export default function AnalyticsLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-7 w-32 bg-ebuy-surface-2 rounded" />
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 w-14 bg-ebuy-surface-2 rounded" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-ebuy-surface-2 rounded" />
        ))}
      </div>
      <div className="h-72 bg-ebuy-surface-2 rounded" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-64 bg-ebuy-surface-2 rounded" />
        <div className="h-64 bg-ebuy-surface-2 rounded" />
      </div>
    </div>
  )
}