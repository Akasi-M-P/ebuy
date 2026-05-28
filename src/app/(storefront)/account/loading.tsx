export default function AccountLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse">
      <div className="h-7 w-40 bg-ebuy-surface-2 rounded mb-8" />
      <div className="flex gap-8">
        <aside className="hidden md:block w-56 flex-shrink-0 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 w-full bg-ebuy-surface-2 rounded" />
          ))}
        </aside>
        <div className="flex-1 space-y-4">
          <div className="h-5 w-32 bg-ebuy-surface-2 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-ebuy-surface-2 rounded" />
            ))}
          </div>
          <div className="space-y-3 pt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-ebuy-surface-2 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}