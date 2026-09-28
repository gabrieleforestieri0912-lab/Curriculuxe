"use client";

export default function DashboardSkeleton() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-16">
        <div className="flex items-center justify-between mb-10">
          <div className="space-y-3">
            <div className="skeleton-line h-9 w-64" />
            <div className="skeleton-line h-5 w-44" />
          </div>
          <div className="hidden sm:flex gap-3">
            <div className="skeleton-line h-12 w-36 rounded-full" />
            <div className="skeleton-line h-12 w-28 rounded-full" />
          </div>
        </div>
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 glass-card rounded-2xl p-6">
            <div className="skeleton-line h-6 w-40 mb-6" />
            <div className="grid md:grid-cols-3 gap-4">
              {[0, 1, 2].map((item) => (
                <div key={item} className="bg-white/5 rounded-xl p-4 border border-white/10">
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
    </section>
  );
}
