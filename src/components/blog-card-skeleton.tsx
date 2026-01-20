export function BlogCardSkeleton() {
  return (
    <div className="relative group rounded-2xl overflow-hidden bg-slate-900 border border-white/10 flex flex-col justify-between shadow-lg min-h-80">
      {/* Skeleton background */}
      <div className="absolute inset-0 bg-slate-800 animate-pulse" />

      {/* Skeleton content */}
      <div className="relative z-20 p-5 flex items-center gap-3 flex-wrap">
        <div className="h-6 w-20 bg-slate-700 rounded-full animate-pulse" />
        <div className="h-6 w-16 bg-slate-700 rounded-full animate-pulse" />
      </div>

      <div className="relative z-20 p-6 pt-0 flex flex-col">
        <div className="h-8 bg-slate-700 rounded-lg mb-3 animate-pulse" />
        <div className="h-4 bg-slate-700 rounded-lg mb-2 animate-pulse" />
        <div className="h-4 bg-slate-700 rounded-lg w-3/4 animate-pulse" />
        <div className="h-6 w-24 bg-slate-700 rounded-lg mt-4 animate-pulse" />
      </div>
    </div>
  );
}
