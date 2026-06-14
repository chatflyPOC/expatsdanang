import { Check, X, AlertTriangle, Info, Lightbulb } from 'lucide-react'

/** A titled content section with a consistent heading. */
export function Section({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10 scroll-mt-24">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </section>
  )
}

export function Lead({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-600 leading-relaxed mb-4">{children}</p>
}

/** TL;DR / key-takeaways box. */
export function KeyTakeaways({ title = 'TL;DR — the short version', items }: { title?: string; items: string[] }) {
  return (
    <div className="bg-[#E1F5EE] border border-[#5DCAA5] rounded-xl p-5 mb-10">
      <p className="text-sm font-semibold text-[#085041] mb-3">{title}</p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-[#085041]">
            <Check size={14} className="mt-0.5 flex-shrink-0 text-[#1D9E75]" /> {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Numbered step list. */
export function StepList({ steps }: { steps: { title: string; detail: string }[] }) {
  return (
    <ol className="space-y-5">
      {steps.map((s, i) => (
        <li key={s.title} className="flex gap-4">
          <div className="w-7 h-7 rounded-full bg-[#E1F5EE] text-[#1D9E75] text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
            {i + 1}
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-1">{s.title}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{s.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

/** Bulleted checklist with teal ticks. */
export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
          <Check size={14} className="text-[#1D9E75] mt-0.5 flex-shrink-0" /> {item}
        </li>
      ))}
    </ul>
  )
}

/** Side-by-side do / don't grid. */
export function DoDont({ good, bad, goodTitle = 'What works', badTitle = 'Common mistakes' }: {
  good: string[]; bad: string[]; goodTitle?: string; badTitle?: string
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="border border-green-100 rounded-xl p-5">
        <p className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2"><Check size={14} /> {goodTitle}</p>
        <ul className="space-y-2">
          {good.map((item) => (
            <li key={item} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-[#1D9E75] mt-0.5 flex-shrink-0">✓</span> {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="border border-red-100 rounded-xl p-5">
        <p className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2"><X size={14} /> {badTitle}</p>
        <ul className="space-y-2">
          {bad.map((item) => (
            <li key={item} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-red-400 mt-0.5 flex-shrink-0">×</span> {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const CALLOUT_STYLES = {
  tip: { wrap: 'border-[#5DCAA5] bg-[#E1F5EE]', icon: 'text-[#1D9E75]', title: 'text-[#085041]', body: 'text-[#0F6E56]', Icon: Lightbulb },
  warning: { wrap: 'border-amber-200 bg-amber-50', icon: 'text-amber-500', title: 'text-amber-800', body: 'text-amber-700', Icon: AlertTriangle },
  info: { wrap: 'border-blue-200 bg-blue-50', icon: 'text-blue-500', title: 'text-blue-800', body: 'text-blue-700', Icon: Info },
} as const

export function Callout({ variant = 'tip', title, children }: {
  variant?: keyof typeof CALLOUT_STYLES; title: string; children: React.ReactNode
}) {
  const s = CALLOUT_STYLES[variant]
  const Icon = s.Icon
  return (
    <div className={`border rounded-xl p-5 mb-10 flex gap-3 ${s.wrap}`}>
      <Icon size={18} className={`flex-shrink-0 mt-0.5 ${s.icon}`} />
      <div>
        <p className={`text-sm font-semibold mb-1 ${s.title}`}>{title}</p>
        <div className={`text-sm leading-relaxed ${s.body}`}>{children}</div>
      </div>
    </div>
  )
}

/** Comparison cards (e.g. banks, visa types) with a verdict badge. */
export function CompareCards({ items }: {
  items: { name: string; verdict: string; color: string; notes: string }[]
}) {
  return (
    <div className="space-y-4">
      {items.map(({ name, verdict, color, notes }) => (
        <div key={name} className="border border-[#E5E7EB] rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <p className="font-semibold text-gray-900">{name}</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>{verdict}</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{notes}</p>
        </div>
      ))}
    </div>
  )
}

/** Simple data table. */
export function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto border border-[#E5E7EB] rounded-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-medium text-gray-500 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-[#E5E7EB]">
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-3 ${j === 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** FAQ list. */
export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="space-y-5">
      {items.map(({ q, a }) => (
        <div key={q} className="border-b border-[#E5E7EB] pb-5 last:border-0 last:pb-0">
          <p className="font-medium text-gray-900 mb-1.5">{q}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
        </div>
      ))}
    </div>
  )
}
