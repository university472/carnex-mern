// client/src/components/ui/FormattedDescription.jsx
export function FormattedDescription({ text }) {
  if (!text) return null

  const lines = text.split('\n')
  const elements = []
  let listItems = []

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={elements.length} className="list-disc pl-5 mb-2 space-y-1">
          {listItems}
        </ul>
      )
      listItems = []
    }
  }

  lines.forEach((line, i) => {
    const trimmed = line.trim()
    if (trimmed.startsWith('- ')) {
      listItems.push(
        <li key={`li-${i}`} className="text-slate-600">
          {trimmed.substring(2)}
        </li>
      )
    } else {
      flushList()
      if (trimmed) {
        elements.push(
          <p key={`p-${i}`} className="text-slate-600 leading-relaxed mb-2">
            {trimmed}
          </p>
        )
      } else {
        // empty line: paragraph break
        elements.push(<br key={`br-${i}`} />)
      }
    }
  })
  flushList()

  return <div>{elements}</div>
}
