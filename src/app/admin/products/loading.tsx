function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-ebuy-border">
      <div className="w-12 h-12 bg-ebuy-surface-2 rounded flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-48 bg-ebuy-surface-2 rounded" />
        <div className="h-3 w-32 bg-ebuy-surface-2 rounded" />
      </div>
      <div className="h-3 w-16 bg-ebuy-surface-2 rounded" />
      <div className="h-3 w-16 bg-ebuy-surface-2 rounded" />
      <div className="h-5 w-14 bg-ebuy-surface-2 rounded-full" />
      <div className="h-6 w-16 bg-ebuy-surface-2 rounded" />
    </div>
  )
}

export default function ProductsLoading() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-7 w-28 bg-ebuy-surface-2 rounded" />
        <div className="h-9 w-32 bg-ebuy-surface-2 rounded" />
      </div>
      <div className="flex gap-3">
        <div className="h-9 flex-1 bg-ebuy-surface-2 rounded" />
        <div className="h-9 w-28 bg-ebuy-surface-2 rounded" />
        <div className="h-9 w-28 bg-ebuy-surface-2 rounded" />
      </div>
      <div className="bg-ebuy-surface border border-ebuy-border rounded overflow-hidden">
        <div className="flex gap-4 px-4 py-3 border-b border-ebuy-border">
          {[120, 80, 80, 60, 60].map((w, i) => (
            <div key={i} className="h-3 bg-ebuy-surface-2 rounded" style={{ width: w }} />
          ))}
        </div>
        {[...Array(8)].map((_, i) => <TableRowSkeleton key={i} />)}
      </div>
    </div>
  )
}