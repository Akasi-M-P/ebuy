export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
      <div className="h-6 w-32 bg-ebuy-surface-2 rounded mb-8" />
      <div className="flex gap-8">
        <aside className="hidden lg:block w-60 flex-shrink-0 space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-ebuy-surface-2 rounded" />
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-3 w-full bg-ebuy-surface-2 rounded" />
              ))}
            </div>
          ))}
        </aside>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div className="h-4 w-28 bg-ebuy-surface-2 rounded" />
            <div className="h-8 w-36 bg-ebuy-surface-2 rounded" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square bg-ebuy-surface-2 rounded" />
                <div className="h-3 w-3/4 bg-ebuy-surface-2 rounded" />
                <div className="h-3 w-1/2 bg-ebuy-surface-2 rounded" />
                <div className="h-4 w-1/3 bg-ebuy-surface-2 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}