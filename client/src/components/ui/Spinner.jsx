// client/src/components/ui/Spinner.jsx
export function Spinner({ size = 16 }) {
  return (
    <span
      className="inline-block animate-spin rounded-full border border-current border-t-transparent"
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  )
}
