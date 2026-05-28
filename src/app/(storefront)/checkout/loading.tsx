export default function CheckoutLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse">
      <div className="h-7 w-28 bg-ebuy-surface-2 rounded mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-6">
          <div className="h-12 bg-ebuy-surface-2 rounded" />
          <div className="space-y-4 p-6 bg-ebuy-surface border border-ebuy-border rounded">
            <div className="h-5 w-36 bg-ebuy-surface-2 rounded" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`h-11 bg-ebuy-surface-2 rounded ${i === 2 ? 'col-span-2' : ''}`} />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4 p-6 bg-ebuy-surface border border-ebuy-border rounded h-fit">
          <div className="h-5 w-28 bg-ebuy-surface-2 rounded mb-4" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-14 h-14 bg-ebuy-surface-2 rounded flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-full bg-ebuy-surface-2 rounded" />
                <div className="h-3 w-1/2 bg-ebuy-surface-2 rounded" />
              </div>
            </div>
          ))}
          <div className="border-t border-ebuy-border pt-4 space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-3 w-20 bg-ebuy-surface-2 rounded" />
                <div className="h-3 w-16 bg-ebuy-surface-2 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}