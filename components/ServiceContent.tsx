'use client'
import React from 'react'
import Link from 'next/link'
import { SERVICE_CONTENT } from '@/lib/service-content'
import { ServiceAuthorByline } from '@/components/AuthorByline'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

type ServiceContentProps = {
  serviceSlug: 'airport-transfer' | 'bank-account' | 'visa-documents' | 'translation'
}

export function ServiceContent({ serviceSlug }: ServiceContentProps) {
  const sections = SERVICE_CONTENT[serviceSlug]?.sections
  if (!sections) return null

  return (
    <article className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {sections.map((section, idx) => {
        switch (section.type) {
          case 'intro':
            return (
              <p key={idx} className="text-lg text-gray-700 leading-relaxed mb-8">
                {section.content}
              </p>
            )

          case 'heading':
            const HeadingTag = section.level === 2 ? 'h2' : section.level === 3 ? 'h3' : 'h4'
            const headingClass =
              section.level === 2
                ? 'text-2xl font-semibold text-gray-900 mt-10 mb-4'
                : 'text-xl font-semibold text-gray-900 mt-8 mb-3'
            return (
              <HeadingTag key={idx} className={headingClass}>
                {section.content}
              </HeadingTag>
            )

          case 'comparison':
            return (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {section.items?.map((item, i) => {
                  if (typeof item !== 'object' || !('name' in item)) return null
                  return (
                    <div key={i} className="border border-gray-200 rounded-lg p-5">
                      <h4 className="font-semibold text-gray-900 mb-3">{(item as any).name}</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {((item as any).issues || (item as any).benefits || []).map((line: string, j: number) => (
                          <li key={j} className="flex gap-2">
                            {line.includes('✅') ? (
                              <>
                                <CheckCircle2 size={16} className="text-[#1D9E75] shrink-0 mt-0.5" />
                                <span>{line.replace('✅ ', '')}</span>
                              </>
                            ) : (
                              <>
                                <span className="text-red-500 font-bold shrink-0">•</span>
                                <span>{line}</span>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            )

          case 'steps':
            return (
              <div key={idx} className="space-y-4 mb-8">
                {section.items?.map((step, i) => {
                  if (typeof step !== 'object' || !('num' in step)) return null
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1D9E75] text-white flex items-center justify-center font-semibold text-sm">
                        {(step as any).num}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{(step as any).title}</h4>
                        <p className="text-gray-600 text-sm mt-1">{(step as any).desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )

          case 'pricing-table':
            return (
              <div key={idx} className="mb-8">
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Vehicle Type</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">An Thuong / My Khe</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Ngu Hanh Son</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(section as any).rows?.map((row: any, i: number) => {
                        if (typeof row !== 'object' || !('type' in row)) return null
                        return (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-900 font-medium">{(row as any).type}</td>
                            <td className="px-4 py-3 text-gray-600">{(row as any).anThuong}</td>
                            <td className="px-4 py-3 text-gray-600">{(row as any).nguHanhSon}</td>
                            <td className="px-4 py-3 text-gray-500 text-xs">{(row as any).note}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                {(section as any).note && <p className="text-xs text-gray-500 mt-2">{(section as any).note}</p>}
              </div>
            )

          case 'faq':
            return (
              <div key={idx} className="space-y-4 mb-8">
                {section.items?.map((faq, i) => {
                  if (typeof faq !== 'object' || !('q' in faq)) return null
                  return (
                    <details key={i} className="border border-gray-200 rounded-lg p-4 group">
                      <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                        {(faq as any).q}
                        <span className="text-[#1D9E75] group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="text-gray-600 text-sm mt-3 pt-3 border-t border-gray-200">{(faq as any).a}</p>
                    </details>
                  )
                })}
              </div>
            )

          case 'benefits':
            return (
              <ul key={idx} className="space-y-3 mb-8">
                {section.items?.map((benefit, i) => {
                  if (typeof benefit !== 'string') return null
                  return (
                    <li key={i} className="flex gap-3">
                      <CheckCircle2 size={20} className="text-[#1D9E75] shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  )
                })}
              </ul>
            )

          case 'list':
            return (
              <div key={idx} className="mb-8">
                <ul className="space-y-2 text-gray-700">
                  {section.items?.map((item, i) => {
                    if (typeof item !== 'string') return null
                    return (
                      <li key={i} className="flex gap-2">
                        <span className="text-[#1D9E75] font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    )
                  })}
                </ul>
                {(section as any).note && <p className="text-sm text-gray-600 mt-3 italic">{(section as any).note}</p>}
              </div>
            )

          case 'bank-comparison':
            return (
              <div key={idx} className="space-y-4 mb-8">
                {(section as any).banks?.map((bank: any, i: number) => {
                  if (typeof bank !== 'object' || !('name' in bank)) return null
                  return (
                    <div key={i} className="border-l-4 border-[#1D9E75] bg-[#f0fdf9] p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{(bank as any).name}</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {(bank as any).details?.map((detail: string, j: number) => (
                          <li key={j}>• {detail}</li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            )

          case 'requirements':
            return (
              <div key={idx} className="space-y-4 mb-8">
                {(section as any).sections?.map((reqSection: any, i: number) => {
                  if (typeof reqSection !== 'object' || !('title' in reqSection)) return null
                  return (
                    <div key={i}>
                      <h4 className="font-semibold text-gray-900 mb-2">{(reqSection as any).title}</h4>
                      <ul className="text-gray-700 space-y-1 ml-4">
                        {(reqSection as any).items?.map((item: string, j: number) => (
                          <li key={j}>✓ {item}</li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            )

          case 'visa-table':
            return (
              <div key={idx} className="overflow-x-auto mb-8 border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Type</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Validity</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Renewal</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Cost</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Best For</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {(section as any).visas?.map((visa: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{visa.type}</td>
                        <td className="px-4 py-3 text-gray-600">{visa.validity}</td>
                        <td className="px-4 py-3 text-gray-600">{visa.renewal}</td>
                        <td className="px-4 py-3 text-gray-600">{visa.cost}</td>
                        <td className="px-4 py-3 text-gray-600">{visa.best}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )

          case 'translation-table':
            return (
              <div key={idx} className="overflow-x-auto mb-8 border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Document</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Length</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Turnaround</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {(section as any).rows?.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{row.doc}</td>
                        <td className="px-4 py-3 text-gray-600">{row.length}</td>
                        <td className="px-4 py-3 text-gray-600">{row.time}</td>
                        <td className="px-4 py-3 text-gray-600">{row.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )

          case 'pricing':
            return (
              <div key={idx} className="space-y-3 mb-8">
                {section.items?.map((item, i) => {
                  if (typeof item !== 'object' || !('service' in item)) return null
                  return (
                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900">{(item as any).service}</h4>
                      <div className="text-sm text-gray-600 mt-2 space-y-1">
                        <p>Rate: {(item as any).rate}</p>
                        <p>Minimum: {(item as any).min}</p>
                        <p>Turnaround: {(item as any).time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )

          case 'scenarios':
            return (
              <div key={idx} className="space-y-4 mb-8">
                {(section as any).scenarios?.map((scenario: any, i: number) => (
                  <div key={i} className="border-l-4 border-[#1D9E75] bg-[#f0fdf9] p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{scenario.title}</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {scenario.details?.map((detail: string, j: number) => (
                        <li key={j}>• {detail}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )

          case 'doc-categories':
            return (
              <div key={idx} className="space-y-4 mb-8">
                {(section as any).categories?.map((cat: any, i: number) => (
                  <div key={i}>
                    <h4 className="font-semibold text-gray-900 mb-2">{cat.name}</h4>
                    <ul className="text-gray-700 space-y-1 ml-4">
                      {cat.items?.map((item: string, j: number) => (
                        <li key={j}>✓ {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )

          default:
            return null
        }
      })}

      {/* CTA Section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="bg-[#f0fdf9] rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Ready to Get Started?</h3>
          <p className="text-gray-600 mb-6">
            Questions? We reply within 2 hours.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/get-help"
              className="inline-flex items-center gap-2 bg-[#1D9E75] hover:bg-[#0F6E56] text-white font-medium px-6 py-3 rounded-full transition-colors"
            >
              Send us a message
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Author byline */}
      <ServiceAuthorByline />
    </article>
  )
}
