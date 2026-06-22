'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExt from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { Blockquote } from '@tiptap/extension-blockquote'
import { createClient } from '@/lib/supabase/client'
import { clsx } from 'clsx'
import {
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
  Quote, Code, Link as LinkIcon, Minus, Undo, Redo,
  Plus, ArrowLeft, Globe, FileText, ExternalLink,
  ChevronDown, Trash2, GripVertical,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type GuideStatus = 'draft' | 'published'

type FaqItem = { q: string; a: string }
type Source = { title: string; url: string }

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
  author_name: string
  author_title: string
  author_bio: string
  author_avatar_url: string
  reviewed_at: string | null
  key_takeaways: string[]
  faqs: FaqItem[]
  sources: Source[]
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
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a').replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i').replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u').replace(/[ỳýỵỷỹ]/g, 'y').replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

function wordCount(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length
}

function readTimeFromWords(wc: number) {
  return `${Math.max(1, Math.ceil(wc / 200))} min read`
}

function keywordDensity(html: string, keyword: string) {
  if (!keyword.trim()) return { count: 0, density: 0 }
  const text = html.replace(/<[^>]*>/g, ' ').toLowerCase()
  const words = text.split(/\s+/).filter(Boolean)
  const kw = keyword.toLowerCase().trim()
  const count = (text.match(new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
  const density = words.length > 0 ? (count / words.length) * 100 : 0
  return { count, density: Math.round(density * 10) / 10 }
}

function calcSeoScore(args: {
  title: string; metaTitle: string; metaDesc: string; slug: string
  keyword: string; html: string; faqs: FaqItem[]; authorName: string
}) {
  const { title, metaTitle, metaDesc, slug, keyword, html, faqs, authorName } = args
  const kw = keyword.toLowerCase().trim()
  const plainText = html.replace(/<[^>]*>/g, ' ').toLowerCase()
  const wc = wordCount(html)
  const h2Count = (html.match(/<h2/g) || []).length
  const first100 = plainText.split(/\s+/).slice(0, 100).join(' ')

  const checks = [
    { label: 'Focus keyword in title', pass: !!kw && title.toLowerCase().includes(kw), tip: `Add "${keyword}" to the title` },
    { label: 'Focus keyword in meta description', pass: !!kw && metaDesc.toLowerCase().includes(kw), tip: `Include "${keyword}" in meta description` },
    { label: 'Focus keyword in URL slug', pass: !!kw && slug.includes(kw.replace(/\s+/g, '-')), tip: `URL should contain "${kw.replace(/\s+/g, '-')}"` },
    { label: 'Keyword in opening paragraph', pass: !!kw && first100.includes(kw), tip: `Mention "${keyword}" in the first 100 words` },
    { label: 'Meta title 50–60 characters', pass: metaTitle.length >= 50 && metaTitle.length <= 60, tip: `${metaTitle.length} chars — target 50–60` },
    { label: 'Meta description 140–160 characters', pass: metaDesc.length >= 140 && metaDesc.length <= 160, tip: `${metaDesc.length} chars — target 140–160` },
    { label: 'Article length ≥ 800 words', pass: wc >= 800, tip: `${wc} words — aim for 800+` },
    { label: 'At least 2 H2 subheadings', pass: h2Count >= 2, tip: `${h2Count} H2 found — add ${Math.max(0, 2 - h2Count)} more` },
    { label: 'FAQ section added', pass: faqs.length >= 2, tip: 'Add at least 2 FAQs for rich snippets' },
    { label: 'Author name provided', pass: !!authorName.trim(), tip: 'Add author name to improve E-E-A-T signals' },
  ]

  return { score: Math.round((checks.filter(c => c.pass).length / checks.length) * 100), checks, wc }
}

// ---------------------------------------------------------------------------
// Blockquote with class support (for tip/warning/info blocks)
// ---------------------------------------------------------------------------
const StyledBlockquote = Blockquote.extend({
  addAttributes() {
    return { ...this.parent?.(), class: { default: null } }
  },
})

// ---------------------------------------------------------------------------
// Toolbar button
// ---------------------------------------------------------------------------
function TB({ onClick, active, disabled, title, children, className }: {
  onClick: () => void; active?: boolean; disabled?: boolean
  title: string; children: React.ReactNode; className?: string
}) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick() }}
      disabled={disabled}
      title={title}
      className={clsx(
        'h-7 px-1.5 flex items-center justify-center rounded text-sm font-medium transition-colors select-none',
        active ? 'bg-[#1D9E75] text-white' : 'text-gray-600 hover:bg-gray-100',
        disabled && 'opacity-30 cursor-not-allowed',
        className,
      )}
    >
      {children}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Rich editor
// ---------------------------------------------------------------------------
function RichEditor({ content, onChange }: { content: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ blockquote: false, heading: { levels: [1, 2, 3] } }),
      StyledBlockquote,
      LinkExt.configure({ openOnClick: false }),
      Underline,
      Placeholder.configure({ placeholder: 'Start writing your guide here…\n\nUse H2 headings to create sections. Use the ✦ block buttons to insert tip/warning boxes.' }),
      CharacterCount,
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { class: 'ProseMirror min-h-[600px] p-6' } },
    immediatelyRender: false,
  })

  const insertBlock = (type: 'tip' | 'warning' | 'info') => {
    const icons = { tip: '💡', warning: '⚠️', info: 'ℹ️' }
    const labels = { tip: 'Tip', warning: 'Warning', info: 'Note' }
    editor?.chain().focus().insertContent(
      `<blockquote class="guide-${type}"><p>${icons[type]} <strong>${labels[type]}:</strong> Write content here…</p></blockquote><p></p>`
    ).run()
  }

  const insertSection = () => {
    editor?.chain().focus().insertContent('<h2>New section</h2><p></p>').run()
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) editor?.chain().focus().setLink({ href: url }).run()
  }

  if (!editor) return <div className="min-h-[600px] p-6 text-gray-400 text-sm animate-pulse">Loading editor…</div>

  const wc = wordCount(editor.getHTML())

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-[#E5E7EB] px-3 py-1.5 flex flex-wrap gap-0.5 bg-gray-50/80 sticky top-0 z-10">
        <TB onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Undo size={13} /></TB>
        <TB onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Redo size={13} /></TB>
        <span className="w-px bg-gray-200 mx-1 self-stretch" />

        {([1, 2, 3] as const).map(l => (
          <TB key={l} onClick={() => editor.chain().focus().toggleHeading({ level: l }).run()}
            active={editor.isActive('heading', { level: l })} title={`Heading ${l}`}>
            <span className="text-[11px] font-bold">H{l}</span>
          </TB>
        ))}
        <span className="w-px bg-gray-200 mx-1 self-stretch" />

        <TB onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><Bold size={13} /></TB>
        <TB onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><Italic size={13} /></TB>
        <TB onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><UnderlineIcon size={13} /></TB>
        <TB onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Code"><Code size={13} /></TB>
        <span className="w-px bg-gray-200 mx-1 self-stretch" />

        <TB onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list"><List size={13} /></TB>
        <TB onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list"><ListOrdered size={13} /></TB>
        <TB onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote"><Quote size={13} /></TB>
        <TB onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus size={13} /></TB>
        <TB onClick={addLink} active={editor.isActive('link')} title="Add link"><LinkIcon size={13} /></TB>
        <span className="w-px bg-gray-200 mx-1 self-stretch" />

        {/* Content blocks */}
        <TB onClick={insertSection} title="Insert new section" className="text-[#1D9E75] font-bold text-xs px-2">+ §</TB>
        <TB onClick={() => insertBlock('tip')} title="Insert tip box" className="text-[11px] px-2">💡 Tip</TB>
        <TB onClick={() => insertBlock('warning')} title="Insert warning box" className="text-[11px] px-2">⚠️ Note</TB>
        <TB onClick={() => insertBlock('info')} title="Insert info box" className="text-[11px] px-2">ℹ️ Info</TB>
      </div>

      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      <div className="border-t border-[#E5E7EB] px-4 py-1.5 flex items-center justify-between text-xs text-gray-400 bg-gray-50/50">
        <span className={clsx(wc >= 800 ? 'text-[#1D9E75]' : 'text-amber-500')}>
          {wc} words {wc >= 800 ? '✓' : `— ${800 - wc} more to reach 800`}
        </span>
        <span>{editor.storage.characterCount?.characters() ?? 0} chars · {readTimeFromWords(wc)}</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Collapsible sidebar section
// ---------------------------------------------------------------------------
function Panel({ title, icon, children, defaultOpen = false }: {
  title: string; icon: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <span className="flex items-center gap-2">
          <span>{icon}</span> {title}
        </span>
        <ChevronDown size={14} className={clsx('text-gray-400 transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="px-4 pb-4 pt-1 border-t border-[#F3F4F6] space-y-3">{children}</div>}
    </div>
  )
}

function Field({ label, counter, max, children }: {
  label: string; counter?: number; max?: number; children: React.ReactNode
}) {
  return (
    <div>
      <label className="text-xs text-gray-400 mb-1 flex items-center justify-between">
        <span>{label}</span>
        {counter !== undefined && max && (
          <span className={clsx('text-[11px]',
            counter > max ? 'text-red-400' : counter >= max * 0.85 ? 'text-green-600' : 'text-gray-300'
          )}>{counter}/{max}</span>
        )}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]'
const textareaCls = `${inputCls} resize-none`

// ---------------------------------------------------------------------------
// FAQ builder
// ---------------------------------------------------------------------------
function FaqBuilder({ faqs, onChange }: { faqs: FaqItem[]; onChange: (faqs: FaqItem[]) => void }) {
  const add = () => onChange([...faqs, { q: '', a: '' }])
  const remove = (i: number) => onChange(faqs.filter((_, idx) => idx !== i))
  const update = (i: number, field: 'q' | 'a', val: string) =>
    onChange(faqs.map((f, idx) => idx === i ? { ...f, [field]: val } : f))

  return (
    <div className="space-y-3">
      {faqs.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-3">No FAQs yet. Add questions that your readers often ask.</p>
      )}
      {faqs.map((faq, i) => (
        <div key={i} className="border border-[#E5E7EB] rounded-lg p-3 space-y-2 bg-gray-50/50">
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-medium text-gray-400 mt-2">Q{i + 1}</span>
            <input
              value={faq.q}
              onChange={e => update(i, 'q', e.target.value)}
              placeholder="Question readers ask…"
              className={clsx(inputCls, 'flex-1 text-xs')}
            />
            <button type="button" onClick={() => remove(i)} className="text-gray-300 hover:text-red-400 mt-2 flex-shrink-0">
              <Trash2 size={13} />
            </button>
          </div>
          <textarea
            value={faq.a}
            onChange={e => update(i, 'a', e.target.value)}
            placeholder="Detailed answer…"
            rows={3}
            className={clsx(textareaCls, 'text-xs')}
          />
        </div>
      ))}
      <button type="button" onClick={add}
        className="w-full text-xs text-[#1D9E75] border border-dashed border-[#1D9E75]/40 rounded-lg py-2 hover:bg-[#f0fdf9] transition-colors">
        + Add question
      </button>
      {faqs.length >= 2 && (
        <p className="text-[11px] text-[#1D9E75]">✓ {faqs.length} FAQs — Google will show these as rich snippets</p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Key takeaways builder
// ---------------------------------------------------------------------------
function TakeawaysBuilder({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  const add = () => onChange([...items, ''])
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i))
  const update = (i: number, val: string) => onChange(items.map((x, idx) => idx === i ? val : x))

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-gray-400">Shown as a green highlight box at the top of the article</p>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <GripVertical size={12} className="text-gray-300 flex-shrink-0" />
          <input
            value={item}
            onChange={e => update(i, e.target.value)}
            placeholder={`Takeaway ${i + 1}…`}
            className={clsx(inputCls, 'text-xs flex-1')}
          />
          <button type="button" onClick={() => remove(i)} className="text-gray-300 hover:text-red-400 flex-shrink-0">
            <Trash2 size={12} />
          </button>
        </div>
      ))}
      <button type="button" onClick={add}
        className="w-full text-xs text-[#1D9E75] border border-dashed border-[#1D9E75]/40 rounded-lg py-2 hover:bg-[#f0fdf9]">
        + Add takeaway
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sources builder
// ---------------------------------------------------------------------------
function SourcesBuilder({ sources, onChange }: { sources: Source[]; onChange: (s: Source[]) => void }) {
  const add = () => onChange([...sources, { title: '', url: '' }])
  const remove = (i: number) => onChange(sources.filter((_, idx) => idx !== i))
  const update = (i: number, field: 'title' | 'url', val: string) =>
    onChange(sources.map((s, idx) => idx === i ? { ...s, [field]: val } : s))

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-gray-400">Cite official sources to build trust (government sites, official banks, etc.)</p>
      {sources.map((s, i) => (
        <div key={i} className="space-y-1">
          <div className="flex items-center gap-2">
            <input value={s.title} onChange={e => update(i, 'title', e.target.value)}
              placeholder="Source name (e.g. Vietnam Immigration Dept)" className={clsx(inputCls, 'text-xs flex-1')} />
            <button type="button" onClick={() => remove(i)} className="text-gray-300 hover:text-red-400 flex-shrink-0"><Trash2 size={12} /></button>
          </div>
          <input value={s.url} onChange={e => update(i, 'url', e.target.value)}
            placeholder="https://..." className={clsx(inputCls, 'text-xs')} />
        </div>
      ))}
      <button type="button" onClick={add}
        className="w-full text-xs text-[#1D9E75] border border-dashed border-[#1D9E75]/40 rounded-lg py-2 hover:bg-[#f0fdf9]">
        + Add source
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Guide Editor
// ---------------------------------------------------------------------------
function GuideEditor({ initial, onBack, onSaved }: {
  initial: Partial<Guide>; onBack: () => void; onSaved: () => void
}) {
  const supabase = useMemo(() => createClient(), [])

  const [fields, setFields] = useState({
    slug: initial.slug ?? '',
    title: initial.title ?? '',
    excerpt: initial.excerpt ?? '',
    category: initial.category ?? 'Lifestyle',
    meta_title: initial.meta_title ?? '',
    meta_description: initial.meta_description ?? '',
    focus_keyword: initial.focus_keyword ?? '',
    og_image_url: initial.og_image_url ?? '',
    read_time: initial.read_time ?? '',
    author_name: initial.author_name ?? '',
    author_title: initial.author_title ?? '',
    author_bio: initial.author_bio ?? '',
    author_avatar_url: initial.author_avatar_url ?? '',
    reviewed_at: initial.reviewed_at ?? '',
  })
  const [slug, setSlug] = useState(initial.slug ?? '')
  const [html, setHtml] = useState(initial.content_html ?? '')
  const [status, setStatus] = useState<GuideStatus>(initial.status ?? 'draft')
  const [faqs, setFaqs] = useState<FaqItem[]>(initial.faqs ?? [])
  const [takeaways, setTakeaways] = useState<string[]>(initial.key_takeaways ?? [])
  const [sources, setSources] = useState<Source[]>(initial.sources ?? [])
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const set = (k: string, v: string) => setFields(p => ({ ...p, [k]: v }))

  const handleTitleChange = (v: string) => {
    set('title', v)
    if (!initial.slug) setSlug(slugify(v))
    if (!fields.meta_title) set('meta_title', v)
  }

  const { score, checks, wc } = calcSeoScore({
    title: fields.title, metaTitle: fields.meta_title, metaDesc: fields.meta_description,
    slug, keyword: fields.focus_keyword, html, faqs, authorName: fields.author_name,
  })

  const { count: kwCount, density: kwDensity } = keywordDensity(html, fields.focus_keyword)
  const scoreColor = score >= 70 ? '#1D9E75' : score >= 40 ? '#F5A623' : '#ef4444'

  const save = async (publish: boolean) => {
    setSaving(true); setSaveMsg('')
    const newStatus: GuideStatus = publish ? 'published' : 'draft'
    const payload = {
      ...fields, slug, content_html: html, status: newStatus,
      read_time: readTimeFromWords(wc),
      published_at: publish ? (initial.published_at ?? new Date().toISOString()) : initial.published_at ?? null,
      updated_at: new Date().toISOString(),
      faqs, key_takeaways: takeaways, sources,
    }
    let error
    if (initial.id) {
      ;({ error } = await supabase.from('guides').update(payload).eq('id', initial.id))
    } else {
      ;({ error } = await supabase.from('guides').insert(payload))
    }
    setSaving(false)
    if (error) { setSaveMsg(`Error: ${error.message}`) }
    else {
      setStatus(newStatus)
      setSaveMsg(publish ? '✓ Published' : '✓ Saved')
      setTimeout(() => setSaveMsg(''), 3000)
      onSaved()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-4 sm:-m-6">
      {/* Top bar */}
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
          <span className="hidden sm:flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: `${scoreColor}18`, color: scoreColor }}>
            SEO {score}
          </span>
          <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', STATUS_COLORS[status])}>
            {status === 'published' ? 'Live' : 'Draft'}
          </span>
          {saveMsg && <span className="text-xs text-[#1D9E75]">{saveMsg}</span>}
          <button onClick={() => save(false)} disabled={saving}
            className="text-sm border border-[#D1D5DB] text-gray-600 px-4 py-1.5 rounded-full hover:bg-gray-50 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save draft'}
          </button>
          <button onClick={() => save(true)} disabled={saving || !fields.title || !slug}
            className="text-sm bg-[#1D9E75] text-white px-4 py-1.5 rounded-full hover:bg-[#0F6E56] disabled:opacity-50">
            {status === 'published' ? 'Update' : 'Publish'}
          </button>
          {status === 'published' && (
            <a href={`/guides/${slug}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden flex">
        {/* Editor */}
        <div className="flex-1 overflow-y-auto bg-white border-r border-[#E5E7EB] flex flex-col">
          <RichEditor content={html} onChange={setHtml} />
        </div>

        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 overflow-y-auto p-3 bg-[#f7f8fc] space-y-3">

          {/* SEO Score */}
          <Panel title="SEO Score" icon="🎯" defaultOpen>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">{checks.filter(c => c.pass).length}/{checks.length} checks passed</span>
              <span className="text-xl font-bold tabular-nums" style={{ color: scoreColor }}>{score}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, backgroundColor: scoreColor }} />
            </div>
            <div className="space-y-1.5">
              {checks.map((c, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className={clsx('text-[11px] mt-0.5 flex-shrink-0 font-bold', c.pass ? 'text-[#1D9E75]' : 'text-gray-300')}>
                    {c.pass ? '✓' : '○'}
                  </span>
                  <div className="min-w-0">
                    <p className={clsx('text-[11px]', c.pass ? 'text-gray-700' : 'text-gray-400')}>{c.label}</p>
                    {!c.pass && <p className="text-[10px] text-amber-500 mt-0.5">{c.tip}</p>}
                  </div>
                </div>
              ))}
            </div>
            {/* Keyword density */}
            {fields.focus_keyword && (
              <div className="mt-3 pt-3 border-t border-[#F3F4F6]">
                <p className="text-[11px] text-gray-400 mb-1">Keyword density — "{fields.focus_keyword}"</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${Math.min(100, kwDensity * 20)}%`,
                      backgroundColor: kwDensity < 0.5 ? '#F5A623' : kwDensity > 3 ? '#ef4444' : '#1D9E75'
                    }} />
                  </div>
                  <span className={clsx('text-[11px] font-medium tabular-nums',
                    kwDensity < 0.5 ? 'text-amber-500' : kwDensity > 3 ? 'text-red-400' : 'text-[#1D9E75]')}>
                    {kwDensity}% ({kwCount}×)
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Target: 0.5–3% (too high = keyword spam)</p>
              </div>
            )}
          </Panel>

          {/* SEO Fields */}
          <Panel title="SEO Fields" icon="🔍" defaultOpen>
            <Field label="Focus keyword">
              <input value={fields.focus_keyword} onChange={e => set('focus_keyword', e.target.value)}
                placeholder="e.g. bank account Da Nang" className={inputCls} />
            </Field>
            <Field label="Meta title" counter={fields.meta_title.length} max={60}>
              <input value={fields.meta_title} onChange={e => set('meta_title', e.target.value)}
                placeholder="Shown in Google results" className={inputCls} />
            </Field>
            <Field label="Meta description" counter={fields.meta_description.length} max={160}>
              <textarea rows={3} value={fields.meta_description} onChange={e => set('meta_description', e.target.value)}
                placeholder="Summary under the title in Google" className={textareaCls} />
            </Field>
            <Field label="URL slug">
              <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden focus-within:border-[#1D9E75]">
                <span className="px-2 py-2 text-xs text-gray-400 bg-gray-50 border-r border-[#E5E7EB] whitespace-nowrap">/guides/</span>
                <input value={slug} onChange={e => setSlug(slugify(e.target.value))} className="flex-1 px-2 py-2 text-sm outline-none" />
              </div>
            </Field>
            {/* SERP preview */}
            {(fields.meta_title || fields.title) && (
              <div className="border border-[#E5E7EB] rounded-lg p-3 bg-white mt-1">
                <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wide">Google preview</p>
                <p className="text-[11px] text-[#006621]">expatsdanang.com › guides › {slug || '…'}</p>
                <p className="text-[#1a0dab] text-sm font-medium leading-tight mt-0.5 line-clamp-2">{fields.meta_title || fields.title}</p>
                <p className="text-[11px] text-gray-600 leading-relaxed mt-0.5 line-clamp-2">{fields.meta_description || fields.excerpt || '…'}</p>
              </div>
            )}
          </Panel>

          {/* Author */}
          <Panel title="Author" icon="✍️" defaultOpen>
            <p className="text-[11px] text-gray-400">Author info improves Google's E-E-A-T trust signals</p>
            <Field label="Name">
              <input value={fields.author_name} onChange={e => set('author_name', e.target.value)}
                placeholder="e.g. Nam Tran" className={inputCls} />
            </Field>
            <Field label="Title / expertise">
              <input value={fields.author_title} onChange={e => set('author_title', e.target.value)}
                placeholder="e.g. Da Nang Expat Specialist · 5 years" className={inputCls} />
            </Field>
            <Field label="Short bio">
              <textarea rows={2} value={fields.author_bio} onChange={e => set('author_bio', e.target.value)}
                placeholder="1–2 sentences about the author's experience" className={textareaCls} />
            </Field>
            <Field label="Avatar URL (optional)">
              <input value={fields.author_avatar_url} onChange={e => set('author_avatar_url', e.target.value)}
                placeholder="https://..." className={inputCls} />
            </Field>
            <Field label="Last reviewed date">
              <input type="date" value={fields.reviewed_at?.slice(0, 10) ?? ''}
                onChange={e => set('reviewed_at', e.target.value)}
                className={inputCls} />
            </Field>
          </Panel>

          {/* Key Takeaways */}
          <Panel title="Key Takeaways" icon="✅">
            <TakeawaysBuilder items={takeaways} onChange={setTakeaways} />
          </Panel>

          {/* FAQ */}
          <Panel title="FAQ" icon="❓">
            <FaqBuilder faqs={faqs} onChange={setFaqs} />
          </Panel>

          {/* Sources */}
          <Panel title="Sources & References" icon="🔗">
            <SourcesBuilder sources={sources} onChange={setSources} />
          </Panel>

          {/* Article info */}
          <Panel title="Article info" icon="📄">
            <Field label="Excerpt (guide listing)">
              <textarea rows={3} value={fields.excerpt} onChange={e => set('excerpt', e.target.value)}
                placeholder="One sentence shown in the guides list" className={textareaCls} />
            </Field>
            <Field label="Category">
              <select value={fields.category} onChange={e => set('category', e.target.value)}
                className={clsx(inputCls, 'bg-white')}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="OG image URL">
              <input value={fields.og_image_url} onChange={e => set('og_image_url', e.target.value)}
                placeholder="https://..." className={inputCls} />
            </Field>
          </Panel>
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
    return <GuideEditor initial={editing} onBack={() => setEditing(null)} onSaved={load} />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">Manage guide articles — drafts and published.</p>
        <button onClick={() => setEditing({})}
          className="flex items-center gap-1.5 bg-[#1D9E75] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#0F6E56]">
          <Plus size={15} /> New guide
        </button>
      </div>

      {loading && <p className="text-center py-12 text-sm text-gray-400">Loading guides…</p>}

      {!loading && guides.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-[#E5E7EB] rounded-xl">
          <FileText size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No guides yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">Create your first guide to start ranking on Google</p>
          <button onClick={() => setEditing({})}
            className="inline-flex items-center gap-1.5 bg-[#1D9E75] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#0F6E56]">
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
                {g.author_name && <span className="text-xs text-[#1D9E75] bg-[#f0fdf9] px-2 py-0.5 rounded-full">✍️ {g.author_name}</span>}
                {g.faqs?.length >= 2 && <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">FAQ ✓</span>}
              </div>
              <p className="font-semibold text-gray-900 truncate">{g.title || <span className="text-gray-400 italic">Untitled</span>}</p>
              <p className="text-xs text-gray-400 mt-1 truncate">
                /guides/{g.slug} · {g.read_time || '—'} · {new Date(g.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {g.status === 'published' && (
                <a href={`/guides/${g.slug}`} target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#1D9E75] p-1" title="View live">
                  <Globe size={15} />
                </a>
              )}
              <button onClick={() => setEditing(g)} className="text-sm text-[#1D9E75] hover:underline px-1">Edit</button>
              <button onClick={() => del(g.id)} disabled={deleting === g.id}
                className="text-sm text-red-400 hover:text-red-600 hover:underline px-1 disabled:opacity-50">
                {deleting === g.id ? '…' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
