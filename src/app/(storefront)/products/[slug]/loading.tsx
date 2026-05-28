export default function ProductDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
      <div className="h-4 w-48 bg-ebuy-surface-2 rounded mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-3">
          <div className="aspect-square bg-ebuy-surface-2 rounded" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-ebuy-surface-2 rounded" />
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <div className="h-3 w-24 bg-ebuy-surface-2 rounded" />
          <div className="h-8 w-3/4 bg-ebuy-surface-2 rounded" />
          <div className="h-4 w-28 bg-ebuy-surface-2 rounded" />
          <div className="h-6 w-32 bg-ebuy-surface-2 rounded" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-ebuy-surface-2 rounded" />
            <div className="h-3 w-full bg-ebuy-surface-2 rounded" />
            <div className="h-3 w-2/3 bg-ebuy-surface-2 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 bg-ebuy-surface-2 rounded" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-ebuy-surface-2" />
              ))}
            </div>
          </div>
          <div className="h-12 w-full bg-ebuy-surface-2 rounded" />
          <div className="h-12 w-full bg-ebuy-surface-2 rounded" />
        </div>
      </div>
    </div>
  )
}