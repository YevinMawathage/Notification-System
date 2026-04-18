export default function DashboardLoading() {
  return (
    <main className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 px-8 pb-8 pt-36 sm:px-12 sm:pb-12 sm:pt-40 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto w-full flex flex-col flex-grow">
        <div className="flex-grow flex flex-col justify-start">
          <div className="grid grid-cols-2 min-[500px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-zinc-900 rounded-xl aspect-[2/3] w-full border border-zinc-800/50 shadow-md"></div>
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center mt-auto pt-16">
          <div className="animate-pulse bg-zinc-900/80 rounded-full w-64 h-[44px] sm:h-[56px] shadow-xl"></div>
        </div>
      </div>
    </main>
  );
}