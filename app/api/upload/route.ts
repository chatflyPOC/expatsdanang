import { NextRequest, NextResponse } from 'next/server'
import { Storage } from '@google-cloud/storage'
import { createAdminClient } from '@/lib/supabase/server'

const PROJECT_ID = process.env.GCS_PROJECT_ID
const BUCKET_NAME = process.env.GCS_BUCKET_NAME
const CLIENT_EMAIL = process.env.GCS_CLIENT_EMAIL
const PRIVATE_KEY = process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n')

function getStorage() {
  if (!PROJECT_ID || !BUCKET_NAME || !CLIENT_EMAIL || !PRIVATE_KEY) {
    throw new Error('Missing GCS environment variables: GCS_PROJECT_ID, GCS_BUCKET_NAME, GCS_CLIENT_EMAIL, GCS_PRIVATE_KEY')
  }
  return new Storage({
    projectId: PROJECT_ID,
    credentials: { client_email: CLIENT_EMAIL, private_key: PRIVATE_KEY },
  })
}

// Require admin session for all uploads
async function assertAdmin() {
  const supabase = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
}

export async function POST(req: NextRequest) {
  try {
    await assertAdmin()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let storage: Storage
  try {
    storage = getStorage()
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'GCS not configured' }, { status: 500 })
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const folder = (formData.get('folder') as string | null) ?? 'uploads'
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin'
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const objectPath = `${folder}/${uid}.${ext}`

  // 10 MB limit for images, 200 MB for video
  const isVideo = file.type.startsWith('video/')
  const maxBytes = isVideo ? 200 * 1024 * 1024 : 10 * 1024 * 1024
  if (file.size > maxBytes) {
    return NextResponse.json({ error: `File too large (max ${isVideo ? '200' : '10'} MB)` }, { status: 413 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const bucket = storage.bucket(BUCKET_NAME!)
  const gcsFile = bucket.file(objectPath)

  await gcsFile.save(buffer, {
    metadata: { contentType: file.type },
    resumable: false,
  })

  // Public read is controlled by bucket-level IAM (allUsers → Storage Object Viewer)
  const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${objectPath}`
  return NextResponse.json({ url: publicUrl })
}
