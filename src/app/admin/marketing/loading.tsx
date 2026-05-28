export default function MarketingLoading() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-7 w-36 bg-ebuy-surface-2 rounded" />
      <div className="flex gap-2 border-b border-ebuy-border pb-0">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-9 w-28 bg-ebuy-surface-2 rounded-t" />
        ))}
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="h-4 w-40 bg-ebuy-surface-2 rounded" />
        <div className="h-9 w-32 bg-ebuy-surface-2 rounded" />
      </div>
      <div className="bg-ebuy-surface border border-ebuy-border rounded overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-ebuy-border last:border-0">
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-48 bg-ebuy-surface-2 rounded" />
              <div className="h-3 w-32 bg-ebuy-surface-2 rounded" />
            </div>
            <div className="h-5 w-20 bg-ebuy-surface-2 rounded-full" />
            <div className="h-3 w-24 bg-ebuy-surface-2 rounded" />
            <div className="flex gap-2">
              <div className="h-7 w-14 bg-ebuy-surface-2 rounded" />
              <div className="h-7 w-14 bg-ebuy-surface-2 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}