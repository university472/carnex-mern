// Dark banner used at the top of inner public pages.
export function PageHero({ eyebrow, title, children, watermark }) {
  return (
    <div className="relative overflow-hidden bg-grain">
      {watermark && (
        <span
          aria-hidden="true"
          className="text-outline pointer-events-none absolute -bottom-6 right-0 select-none font-display text-[7rem] font-extrabold leading-none sm:text-[10rem] lg:text-[12rem]"
        >
          {watermark}
        </span>
      )}
      <div className="container relative py-12 sm:py-16 lg:py-20">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="max-w-3xl font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {children && (
          <div className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
