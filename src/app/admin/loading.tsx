export default function AdminDashboardLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-7 w-40 bg-ebuy-surface-2 rounded" />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-ebuy-surface-2 rounded" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-72 bg-ebuy-surface-2 rounded" />
        <div className="h-72 bg-ebuy-surface-2 rounded" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-60 bg-ebuy-surface-2 rounded" />
        <div className="h-60 bg-ebuy-surface-2 rounded" />
      </div>
    </div>
  )
}