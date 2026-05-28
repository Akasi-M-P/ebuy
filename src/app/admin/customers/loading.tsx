export default function CustomersLoading() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-7 w-32 bg-ebuy-surface-2 rounded" />
      <div className="h-9 w-full bg-ebuy-surface-2 rounded" />
      <div className="bg-ebuy-surface border border-ebuy-border rounded overflow-hidden">
        <div className="flex gap-4 px-4 py-3 border-b border-ebuy-border">
          {[140, 100, 80, 80, 60].map((w, i) => (
            <div key={i} className="h-3 bg-ebuy-surface-2 rounded" style={{ width: w }} />
          ))}
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-ebuy-border last:border-0">
            <div className="w-9 h-9 rounded-full bg-ebuy-surface-2 flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-36 bg-ebuy-surface-2 rounded" />
              <div className="h-3 w-48 bg-ebuy-surface-2 rounded" />
            </div>
            <div className="h-3 w-16 bg-ebuy-surface-2 rounded" />
            <div className="h-3 w-16 bg-ebuy-surface-2 rounded" />
            <div className="h-5 w-14 bg-ebuy-surface-2 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}