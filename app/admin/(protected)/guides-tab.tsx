'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExt from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { createClient } from '@/lib/supabase/client'
import { clsx } from 'clsx'
import {
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
  Quote, Code, Link as LinkIcon, Minus, Undo, Redo,
  Plus, ArrowLeft, Globe, FileText, ExternalLink,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type GuideStatus = 'draft' | 'published'

type Guide = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  content_html: string
  meta_title: string
  meta_description: string
  focus_keyword: string
  og_image_url: string
  read_time: string
  status: GuideStatus
  published_at: string | null
  updated_at: string
  created_at: string
}

type SeoFields = {
  title: string
  metaTitle: string
  metaDesc: string
  slug: string
  keyword: string
  html: string
}

const CATEGORIES = ['Banking', 'Visas', 'Housing', 'Transport', 'Lifestyle', 'Health']

const STATUS_COLORS: Record<GuideStatus, string> = {
  draft: 'bg-gray-100 text-gray-500',
  published: 'bg-green-100 text-green-700',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function slugify(text: string) {
  return text.toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function wordCount(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length
}

function readTimeFromWords(wc: number) {
  return `${Math.max(1, Math.ceil(wc / 200))} min read`
}

function calcSeoScore(f: SeoFields) {
  const kw = f.keyword.toLowerCase().trim()
  const plainText = f.html.replace(/<[^>]*>/g, ' ').toLowerCase()
  const wc = wordCount(f.html)
  const h2Count = (f.html.match(/<h2/g) || []).length
  const first100 = plainText.split(/\s+/).slice(0, 100).join(' ')

  const checks = [
    {
      label: 'Focus keyword in title',
      pass: !!kw && f.title.toLowerCase().includes(kw),
      tip: `Add "${f.keyword}" to the article title`,
    },
    {
      label: 'Focus keyword in meta description',
      pass: !!kw && f.metaDesc.toLowerCase().includes(kw),
      tip: `Include "${f.keyword}" in the meta description`,
    },
    {
      label: 'Focus keyword in URL slug',
      pass: !!kw && f.slug.includes(kw.replace(/\s+/g, '-')),
      tip: `URL should contain "${kw.replace(/\s+/g, '-')}"`,
    },
    {
      label: 'Keyword in opening paragraph',
      pass: !!kw && first100.includes(kw),
      tip: `Mention "${f.keyword}" within the first 100 words`,
    },
    {
      label: 'Meta title 50–60 characters',
      pass: f.metaTitle.length >= 50 && f.metaTitle.length <= 60,
      tip: `${f.metaTitle.length} chars — target 50–60`,
    },
    {
      label: 'Meta description 140–160 characters',
      pass: f.metaDesc.length >= 140 && f.metaDesc.length <= 160,
      tip: `${f.metaDesc.length} chars — target 140–160`,
    },
    {
      label: 'Article length ≥ 800 words',
      pass: wc >= 800,
      tip: `${wc} words — aim for 800+ for strong rankings`,
    },
    {
      label: 'At least 2 H2 subheadings',
      pass: h2Count >= 2,
      tip: `${h2Count} H2 found — structure content with 2+ sections`,
    },
  ]

  const passed = checks.filter(c => c.pass).length
  return { score: Math.round((passed / checks.length) * 100), checks, wc }
}

// ---------------------------------------------------------------------------
// Toolbar button
// ---------------------------------------------------------------------------
function TB({ onClick, active, disabled, title, children }: {
  onClick: () => void; active?: boolean; disabled?: boolean; title: string; children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick() }}
      disabled={disabled}
      title={title}
      className={clsx(
        'w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors select-none',
        active ? 'bg-[#1D9E75] text-white' : 'text-gray-600 hover:bg-gray-100',
        disabled && 'opacity-30 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Rich Text Editor
// ---------------------------------------------------------------------------
function RichEditor({ content, onChange }: { content: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      LinkExt.configure({ openOnClick: false, HTMLAttributes: { class: 'text-[#1AA5D8] underline' } }),
      Underline,
      Placeholder.configure({ placeholder: 'Start writing your guide here…\n\nTip: Use H2 headings to structure the article for SEO.' }),
      CharacterCount,
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { class: 'ProseMirror min-h-[600px] p-6' } },
    immediatelyRender: false,
  })

  const addLink = () => {
    const url = window.prompt('Enter URL:')
    if (!url) return
    if (editor?.state.selection.empty) {
      editor.chain().focus().setLink({ href: url }).run()
    } else {
      editor?.chain().focus().setLink({ href: url }).run()
    }
  }

  if (!editor) return <div className="min-h-[600px] p-6 text-gray-400 text-sm">Loading editor…</div>

  const wc = wordCount(editor.getHTML())

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="border-b border-[#E5E7EB] px-4 py-2 flex flex-wrap gap-1 bg-gray-50/50 sticky top-0 z-10">
        {/* History */}
        <TB onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (⌘Z)"><Undo size={14} /></TB>
        <TB onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (⌘⇧Z)"><Redo size={14} /></TB>
        <span className="w-px bg-gray-200 mx-1 self-stretch" />

        {/* Headings */}
        {([1, 2, 3] as const).map(level => (
          <TB
            key={level}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            active={editor.isActive('heading', { level })}
            title={`Heading ${level}`}
          >
            <span className="font-bold text-[11px]">H{level}</span>
          </TB>
        ))}
        <span className="w-px bg-gray-200 mx-1 self-stretch" />

        {/* Inline */}
        <TB onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (⌘B)"><Bold size={14} /></TB>
        <TB onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (⌘I)"><Italic size={14} /></TB>
        <TB onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline (⌘U)"><UnderlineIcon size={14} /></TB>
        <TB onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code"><Code size={14} /></TB>
        <span className="w-px bg-gray-200 mx-1 self-stretch" />

        {/* Blocks */}
        <TB onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list"><List size={14} /></TB>
        <TB onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list"><ListOrdered size={14} /></TB>
        <TB onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote"><Quote size={14} /></TB>
        <TB onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule"><Minus size={14} /></TB>
        <span className="w-px bg-gray-200 mx-1 self-stretch" />

        {/* Link */}
        <TB onClick={addLink} active={editor.isActive('link')} title="Add link"><LinkIcon size={14} /></TB>
        {editor.isActive('link') && (
          <TB onClick={() => editor.chain().focus().unsetLink().run()} title="Remove link">
            <span className="text-[10px] font-medium text-red-500">✕link</span>
          </TB>
        )}
      </div>

      {/* Editor area */}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      {/* Footer word count */}
      <div className="border-t border-[#E5E7EB] px-4 py-2 flex items-center justify-between text-xs text-gray-400 bg-gray-50/50">
        <span>{wc} words · {readTimeFromWords(wc)}</span>
        <span>{editor.storage.characterCount?.characters() ?? 0} characters</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SEO Panel
// ---------------------------------------------------------------------------
function SeoPanel({
  fields, onField, slug, onSlug,
}: {
  fields: Omit<Guide, 'id' | 'content_html' | 'status' | 'published_at' | 'updated_at' | 'created_at'>
  onField: (k: string, v: string) => void
  slug: string
  onSlug: (s: string) => void
}) {
  const seoFields: SeoFields = {
    title: fields.title,
    metaTitle: fields.meta_title,
    metaDesc: fields.meta_description,
    slug,
    keyword: fields.focus_keyword,
    html: '',
  }
  const { score, checks } = calcSeoScore(seoFields)
  const scoreColor = score >= 70 ? '#1D9E75' : score >= 40 ? '#F5A623' : '#ef4444'

  return (
    <div className="space-y-4">
      {/* Score */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700">SEO Score</p>
          <span className="text-2xl font-bold tabular-nums" style={{ color: scoreColor }}>{score}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, backgroundColor: scoreColor }} />
        </div>
        <div className="space-y-2">
          {checks.map((c, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className={clsx('text-xs mt-0.5 flex-shrink-0 font-bold', c.pass ? 'text-[#1D9E75]' : 'text-gray-300')}>
                {c.pass ? '✓' : '○'}
              </span>
              <div className="min-w-0">
                <p className={clsx('text-xs', c.pass ? 'text-gray-700' : 'text-gray-400')}>{c.label}</p>
                {!c.pass && <p className="text-[11px] text-amber-500 mt-0.5">{c.tip}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Focus keyword */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">SEO Fields</p>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Focus keyword</label>
          <input
            value={fields.focus_keyword}
            onChange={e => onField('focus_keyword', e.target.value)}
            placeholder="e.g. bank account Da Nang"
            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 flex justify-between">
            <span>Meta title</span>
            <span className={clsx(fields.meta_title.length > 60 ? 'text-red-400' : fields.meta_title.length >= 50 ? 'text-green-600' : 'text-gray-300')}>
              {fields.meta_title.length}/60
            </span>
          </label>
          <input
            value={fields.meta_title}
            onChange={e => onField('meta_title', e.target.value)}
            placeholder="Appears in Google search results"
            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 flex justify-between">
            <span>Meta description</span>
            <span className={clsx(fields.meta_description.length > 160 ? 'text-red-400' : fields.meta_description.length >= 140 ? 'text-green-600' : 'text-gray-300')}>
              {fields.meta_description.length}/160
            </span>
          </label>
          <textarea
            rows={3}
            value={fields.meta_description}
            onChange={e => onField('meta_description', e.target.value)}
            placeholder="Appears under the title in Google"
            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75] resize-none"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">URL slug</label>
          <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden focus-within:border-[#1D9E75]">
            <span className="px-2 py-2 text-xs text-gray-400 bg-gray-50 border-r border-[#E5E7EB] whitespace-nowrap">/guides/</span>
            <input
              value={slug}
              onChange={e => onSlug(slugify(e.target.value))}
              className="flex-1 px-2 py-2 text-sm outline-none bg-white"
            />
          </div>
        </div>
      </div>

      {/* Article meta */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Article info</p>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Excerpt (for listing page)</label>
          <textarea
            rows={3}
            value={fields.excerpt}
            onChange={e => onField('excerpt', e.target.value)}
            placeholder="One sentence summary shown in the guides list"
            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75] resize-none"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Category</label>
          <select
            value={fields.category}
            onChange={e => onField('category', e.target.value)}
            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75] bg-white"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">OG image URL</label>
          <input
            value={fields.og_image_url}
            onChange={e => onField('og_image_url', e.target.value)}
            placeholder="https://..."
            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]"
          />
        </div>
      </div>

      {/* SERP preview */}
      {(fields.meta_title || fields.title) && (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Google preview</p>
          <div className="space-y-1">
            <p className="text-xs text-[#006621] truncate">expatsdanang.com/guides/{slug}</p>
            <p className="text-[#1a0dab] text-base font-medium leading-tight line-clamp-2">{fields.meta_title || fields.title}</p>
            <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{fields.meta_description || fields.excerpt}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Guide Editor (full-page view)
// ---------------------------------------------------------------------------
function GuideEditor({
  initial,
  onBack,
  onSaved,
}: {
  initial: Partial<Guide>
  onBack: () => void
  onSaved: () => void
}) {
  const supabase = useMemo(() => createClient(), [])
  const isNew = !initial.id

  const [fields, setFields] = useState<Omit<Guide, 'id' | 'content_html' | 'status' | 'published_at' | 'updated_at' | 'created_at'>>({
    slug: initial.slug ?? '',
    title: initial.title ?? '',
    excerpt: initial.excerpt ?? '',
    category: initial.category ?? 'Lifestyle',
    meta_title: initial.meta_title ?? '',
    meta_description: initial.meta_description ?? '',
    focus_keyword: initial.focus_keyword ?? '',
    og_image_url: initial.og_image_url ?? '',
    read_time: initial.read_time ?? '',
  })
  const [slug, setSlug] = useState(initial.slug ?? '')
  const [html, setHtml] = useState(initial.content_html ?? '')
  const [status, setStatus] = useState<GuideStatus>(initial.status ?? 'draft')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const setField = (k: string, v: string) => setFields(p => ({ ...p, [k]: v }))

  const handleTitleChange = (v: string) => {
    setField('title', v)
    if (!initial.slug) setSlug(slugify(v))
    if (!fields.meta_title) setField('meta_title', v)
  }

  const { score, checks, wc } = calcSeoScore({
    title: fields.title,
    metaTitle: fields.meta_title,
    metaDesc: fields.meta_description,
    slug,
    keyword: fields.focus_keyword,
    html,
  })

  const save = async (publish: boolean) => {
    setSaving(true); setSaveMsg('')
    const newStatus: GuideStatus = publish ? 'published' : 'draft'
    const payload = {
      ...fields,
      slug,
      content_html: html,
      status: newStatus,
      read_time: readTimeFromWords(wc),
      published_at: publish ? new Date().toISOString() : initial.published_at ?? null,
      updated_at: new Date().toISOString(),
    }
    let error
    if (initial.id) {
      ;({ error } = await supabase.from('guides').update(payload).eq('id', initial.id))
    } else {
      ;({ error } = await supabase.from('guides').insert(payload))
    }
    setSaving(false)
    if (error) {
      setSaveMsg(`Error: ${error.message}`)
    } else {
      setStatus(newStatus)
      setSaveMsg(publish ? 'Published!' : 'Saved as draft')
      setTimeout(() => setSaveMsg(''), 3000)
      onSaved()
    }
  }

  const scoreColor = score >= 70 ? '#1D9E75' : score >= 40 ? '#F5A623' : '#ef4444'

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-4 sm:-m-6">
      {/* Editor topbar */}
      <div className="h-14 bg-white border-b border-[#E5E7EB] flex items-center gap-3 px-4 flex-shrink-0">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft size={16} /> Back
        </button>
        <span className="w-px h-5 bg-gray-200" />
        <input
          value={fields.title}
          onChange={e => handleTitleChange(e.target.value)}
          placeholder="Article title…"
          className="flex-1 text-base font-semibold text-gray-900 outline-none placeholder:text-gray-300 min-w-0"
        />
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* SEO score pill */}
          <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: `${scoreColor}18`, color: scoreColor }}>
            SEO {score}
          </span>
          <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', STATUS_COLORS[status])}>
            {status === 'published' ? 'Published' : 'Draft'}
          </span>
          {saveMsg && <span className="text-xs text-[#1D9E75]">{saveMsg}</span>}
          <button
            onClick={() => save(false)}
            disabled={saving}
            className="text-sm border border-[#D1D5DB] text-gray-600 px-4 py-1.5 rounded-full hover:bg-gray-50 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save draft'}
          </button>
          <button
            onClick={() => save(true)}
            disabled={saving || !fields.title || !slug}
            className="text-sm bg-[#1D9E75] text-white px-4 py-1.5 rounded-full hover:bg-[#0F6E56] disabled:opacity-50"
          >
            {status === 'published' ? 'Update' : 'Publish'}
          </button>
          {status === 'published' && (
            <a href={`/guides/${slug}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Body: editor + seo panel */}
      <div className="flex-1 overflow-hidden flex">
        {/* Editor */}
        <div className="flex-1 overflow-y-auto bg-white border-r border-[#E5E7EB] flex flex-col">
          <RichEditor content={html} onChange={setHtml} />
        </div>

        {/* SEO sidebar */}
        <div className="w-80 flex-shrink-0 overflow-y-auto p-4 bg-[#f7f8fc]">
          <SeoPanel
            fields={fields}
            onField={setField}
            slug={slug}
            onSlug={setSlug}
          />
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Guides list
// ---------------------------------------------------------------------------
export function GuidesTab() {
  const supabase = useMemo(() => createClient(), [])
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Guide> | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('guides').select('*').order('updated_at', { ascending: false })
    setGuides((data as Guide[]) || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const del = async (id: string) => {
    if (!confirm('Delete this guide? This cannot be undone.')) return
    setDeleting(id)
    await supabase.from('guides').delete().eq('id', id)
    setDeleting(null)
    load()
  }

  if (editing !== null) {
    return (
      <GuideEditor
        initial={editing}
        onBack={() => setEditing(null)}
        onSaved={load}
      />
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">Manage all guide articles — drafts and published.</p>
        <button
          onClick={() => setEditing({})}
          className="flex items-center gap-1.5 bg-[#1D9E75] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#0F6E56]"
        >
          <Plus size={15} /> New guide
        </button>
      </div>

      {loading && <p className="text-sm text-gray-400 text-center py-12">Loading guides…</p>}

      {!loading && guides.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-[#E5E7EB] rounded-xl">
          <FileText size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No guides yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">Create your first guide to start ranking on Google</p>
          <button
            onClick={() => setEditing({})}
            className="inline-flex items-center gap-1.5 bg-[#1D9E75] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#0F6E56]"
          >
            <Plus size={15} /> Create first guide
          </button>
        </div>
      )}

      <div className="space-y-3">
        {guides.map(g => (
          <div key={g.id} className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-start justify-between gap-4 hover:border-[#1D9E75]/30 transition-colors">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', STATUS_COLORS[g.status])}>
                  {g.status === 'published' ? 'Published' : 'Draft'}
                </span>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{g.category}</span>
                {g.focus_keyword && (
                  <span className="text-xs text-[#1AA5D8] bg-blue-50 px-2 py-0.5 rounded-full">{g.focus_keyword}</span>
                )}
              </div>
              <p className="font-semibold text-gray-900 truncate">{g.title || <span className="text-gray-400 italic">Untitled</span>}</p>
              <p className="text-xs text-gray-400 mt-1 truncate">
                /guides/{g.slug} · {g.read_time || '—'} · updated {new Date(g.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {g.status === 'published' && (
                <a
                  href={`/guides/${g.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#1D9E75] p-1"
                  title="View live"
                >
                  <Globe size={16} />
                </a>
              )}
              <button
                onClick={() => setEditing(g)}
                className="text-sm text-[#1D9E75] hover:underline px-1"
              >
                Edit
              </button>
              <button
                onClick={() => del(g.id)}
                disabled={deleting === g.id}
                className="text-sm text-red-400 hover:text-red-600 hover:underline px-1 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
