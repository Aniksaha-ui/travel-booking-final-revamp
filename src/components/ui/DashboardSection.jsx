export function DashboardSection({ title, icon, action, children, className = '', bodyClassName = '' }) {
  return (
    <section className={`rounded-lg border border-[#332d30] bg-[#231f21] ${className}`}>
      {(title || action) && (
        <header className="flex h-[50px] items-center justify-between px-5">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-sm font-bold text-white">{title}</h3>
          </div>
          {action}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  )
}
