export default function SettingsLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-7 w-24 bg-ebuy-surface-2 rounded" />
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 w-24 bg-ebuy-surface-2 rounded-full" />
        ))}
      </div>
      <div className="bg-ebuy-surface border border-ebuy-border rounded p-6 space-y-5">
        <div className="h-5 w-36 bg-ebuy-surface-2 rounded" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-28 bg-ebuy-surface-2 rounded" />
            <div className="h-10 w-full bg-ebuy-surface-2 rounded" />
          </div>
        ))}
        <div className="h-10 w-28 bg-ebuy-surface-2 rounded mt-4" />
      </div>
    </div>
  )
}