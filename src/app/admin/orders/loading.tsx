export default function OrdersLoading() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-7 w-24 bg-ebuy-surface-2 rounded" />
        <div className="h-9 w-28 bg-ebuy-surface-2 rounded" />
      </div>
      <div className="flex gap-2">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-8 w-20 bg-ebuy-surface-2 rounded-full" />
        ))}
      </div>
      <div className="h-9 w-full bg-ebuy-surface-2 rounded" />
      <div className="bg-ebuy-surface border border-ebuy-border rounded overflow-hidden">
        <div className="flex gap-4 px-4 py-3 border-b border-ebuy-border">
          {[100, 140, 100, 80, 80, 60].map((w, i) => (
            <div key={i} className="h-3 bg-ebuy-surface-2 rounded" style={{ width: w }} />
          ))}
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-ebuy-border last:border-0">
            <div className="h-3 w-24 bg-ebuy-surface-2 rounded" />
            <div className="h-3 w-36 bg-ebuy-surface-2 rounded" />
            <div className="h-3 w-24 bg-ebuy-surface-2 rounded" />
            <div className="h-3 w-20 bg-ebuy-surface-2 rounded" />
            <div className="h-5 w-20 bg-ebuy-surface-2 rounded-full" />
            <div className="h-6 w-14 bg-ebuy-surface-2 rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}