import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ArrowRight } from 'lucide-react'
import { FAQ_ITEMS } from '../../constants/faq'

function FaqItem({ item, index, open, onToggle }) {
  const baseId = useId()
  const panelId = `${baseId}-panel`
  const buttonId = `${baseId}-button`

  return (
    <div
      className={`rounded-xl border transition-colors ${
        open ? 'border-slate-200 bg-white shadow-sm' : 'border-transparent bg-white/60'
      }`}
    >
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center gap-4 px-5 py-4 text-left"
        >
          <span className="font-display text-xs font-semibold text-brand-primary">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            className={`flex-1 text-sm font-semibold sm:text-[15px] ${
              open ? 'text-ink-900' : 'text-ink-800'
            }`}
          >
            {item.question}
          </span>
          <span
            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
              open
                ? 'rotate-45 border-brand-primary bg-brand-primary text-white'
                : 'border-slate-300 text-slate-500'
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pl-[3.25rem] text-sm leading-relaxed text-slate-500">
            <p>{item.answer}</p>
            {item.link && (
              <Link
                to={item.link.to}
                tabIndex={open ? 0 : -1}
                className="group mt-3 inline-flex items-center gap-1.5 font-semibold text-brand-primary"
              >
                {item.link.label}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0)

  if (!FAQ_ITEMS.length) return null

  const half = Math.ceil(FAQ_ITEMS.length / 2)
  const columns = [FAQ_ITEMS.slice(0, half), FAQ_ITEMS.slice(half)]

  return (
    <section className="container py-16 sm:py-20">
      <div className="mb-10 text-center">
        <p className="eyebrow eyebrow-center justify-center">FAQs</p>
        <h2 className="section-heading mt-2">Frequently Asked Questions</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
          Quick answers about buying, financing and trading in at Carnex.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2 lg:gap-x-6">
        {columns.map((col, c) => (
          <div key={c} className="space-y-3">
            {col.map((item, i) => {
              const index = c * half + i
              return (
                <FaqItem
                  key={item.question}
                  item={item}
                  index={index}
                  open={openIndex === index}
                  onToggle={() =>
                    setOpenIndex((prev) => (prev === index ? -1 : index))
                  }
                />
              )
            })}
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-xl bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-primary"
        >
          Still have a question? Ask us
        </Link>
      </div>
    </section>
  )
}
