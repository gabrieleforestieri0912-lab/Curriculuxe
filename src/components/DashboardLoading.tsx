"use client";

export default function DashboardLoading() {
  return (
    <section className="relative min-h-screen">
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header skeleton */}
        <div className="px-4 sm:px-6">
          <div className="max-w-7xl mx-auto mt-3 rounded-2xl border border-white/10 bg-[#0d0d12]/80 px-4 sm:px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="skeleton-line h-9 w-9 rounded-xl" />
              <div className="skeleton-line h-6 w-32" />
            </div>
            <div className="flex items-center gap-3">
              <div className="skeleton-line h-8 w-20 rounded-xl" />
              <div className="skeleton-line h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>

        <div className="flex-1 bg-[#0d0d12]/60 backdrop-blur-2xl">
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar skeleton (desktop) */}
            <div className="hidden lg:block lg:w-64 shrink-0 pt-24 px-5 pb-8 border-r border-white/10">
              <div className="skeleton-line h-3 w-20 mb-4" />
              <div className="space-y-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="skeleton-line h-9 w-full rounded-xl" />
                ))}
              </div>
            </div>

            {/* Content skeleton */}
            <main className="flex-1 min-w-0">
              <div className="pt-28 pb-16 px-6">
                <div className="max-w-6xl mx-auto">
                  <div className="space-y-3 mb-10">
                    <div className="skeleton-line h-9 w-64" />
                    <div className="skeleton-line h-5 w-44" />
                  </div>
                  <div className="grid lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 glass-card rounded-2xl p-6">
                      <div className="skeleton-line h-6 w-40 mb-6" />
                      <div className="grid md:grid-cols-3 gap-4">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="skeleton-line h-3 w-20 mb-3" />
                            <div className="skeleton-line h-5 w-32" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="glass-card rounded-2xl p-6">
                        <div className="skeleton-line h-4 w-24 mb-5" />
                        <div className="skeleton-line h-10 w-16" />
                      </div>
                      <div className="glass-card rounded-2xl p-6">
                        <div className="skeleton-line h-4 w-24 mb-5" />
                        <div className="skeleton-line h-10 w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}
