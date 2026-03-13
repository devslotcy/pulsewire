interface RichTextProps {
  content: any
}

function renderNode(node: any, index: number): React.ReactNode {
  if (!node) return null

  if (node.type === 'text') {
    let text: React.ReactNode = node.text
    if (node.format & 1) text = <strong key={index}>{text}</strong>
    if (node.format & 2) text = <em key={index}>{text}</em>
    if (node.format & 8) text = <u key={index}>{text}</u>
    return text
  }

  const children = node.children?.map((child: any, i: number) => renderNode(child, i))

  switch (node.type) {
    case 'paragraph':
      return <p key={index} className="mb-4 leading-relaxed text-gray-700">{children}</p>
    case 'heading':
      const Tag = `h${node.tag?.replace('h', '') || 2}` as keyof JSX.IntrinsicElements
      return <Tag key={index} className="font-bold text-[#1D3557] mt-8 mb-4">{children}</Tag>
    case 'list':
      return node.listType === 'number'
        ? <ol key={index} className="list-decimal pl-6 mb-4 space-y-2 text-gray-700">{children}</ol>
        : <ul key={index} className="list-disc pl-6 mb-4 space-y-2 text-gray-700">{children}</ul>
    case 'listitem':
      return <li key={index}>{children}</li>
    case 'quote':
      return (
        <blockquote key={index} className="border-l-4 border-[#E63946] pl-4 italic text-gray-600 my-6">
          {children}
        </blockquote>
      )
    case 'link':
      return (
        <a
          key={index}
          href={node.fields?.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#457B9D] hover:underline"
        >
          {children}
        </a>
      )
    default:
      return <span key={index}>{children}</span>
  }
}

export function RichText({ content }: RichTextProps) {
  if (!content) return null

  // Plain string (from bot - plain text)
  if (typeof content === 'string') {
    return (
      <div className="prose max-w-none">
        {content.split('\n\n').map((para, i) => (
          <p key={i} className="mb-4 leading-relaxed text-gray-700">{para}</p>
        ))}
      </div>
    )
  }

  // Lexical JSON (from Payload admin)
  const root = content?.root
  if (!root?.children) return null

  return (
    <div className="prose max-w-none">
      {root.children.map((node: any, i: number) => renderNode(node, i))}
    </div>
  )
}
