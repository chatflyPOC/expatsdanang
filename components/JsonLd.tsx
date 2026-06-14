/** Renders one or more schema.org JSON-LD blocks into the document. */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = Array.isArray(data)
    ? { '@context': 'https://schema.org', '@graph': data }
    : data
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
