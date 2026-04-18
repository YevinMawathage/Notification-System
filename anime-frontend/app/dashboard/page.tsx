import { Suspense } from "react";
import Link from "next/link";
import AnimeCard from "../../components/AnimeCard";

// 1. Update the fetch engine to accept a page number
async function getLiveAnime(page: number) {
  try {
    // We inject the page variable right into your Go URL!
    // Since cards are roughly 2x smaller, let's fetch more items to fill the grid nicely
    const res = await fetch(`http://api:4000/api/v1/anime?page=${page}&limit=24`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Go API returned status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching anime:", error);
    return []; 
  }
}

// 2. Extracted component to fetch and render data so we can stream the loading state
async function DashboardContent({ validPage }: { validPage: number }) {
  const liveAnimeData = await getLiveAnime(validPage);

  return (
    <>
      <div className="flex-grow flex flex-col justify-start">
      {liveAnimeData.length === 0 ? (
        <div className="text-center bg-zinc-900/50 p-12 rounded-3xl border border-zinc-800/80 backdrop-blur-sm m-auto">
          <h3 className="text-lg font-medium text-zinc-200 tracking-tight">No Anime Found</h3>
          <p className="text-zinc-400 mt-2 text-sm">
            We reached the end of the list, or the database is empty.
          </p>
        </div>
      ) : (
          <div className="grid grid-cols-2 min-[500px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {liveAnimeData.map((anime: any) => (
              <AnimeCard key={anime.anime_id} anime={anime} />
            ))}
          </div>
      )}
      </div>

      {/* The Pagination Controls */}
      <div className="flex justify-center items-center mt-auto pt-16">
        <div className="flex items-center gap-1 sm:gap-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 rounded-full px-4 sm:px-8 py-2.5 shadow-xl shadow-black/40">
          
          {/* Prev Arrow */}
          {validPage > 1 ? (
            <Link href={`/dashboard?page=${validPage - 1}`} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-colors">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          ) : (
            <div className="w-8 h-8 flex items-center justify-center text-zinc-700 cursor-not-allowed">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          )}

          {/* Always show Page 1 if we're far ahead */}
          {validPage > 2 && (
            <Link href="/dashboard?page=1" className="w-9 h-9 flex items-center justify-center text-sm font-semibold text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-full transition-all">
              1
            </Link>
          )}

          {/* Left Ellipsis */}
          {validPage > 3 && (
            <span className="text-zinc-500 text-xs px-1 tracking-widest">...</span>
          )}

          {/* Previous Page */}
          {validPage > 1 && (
            <Link href={`/dashboard?page=${validPage - 1}`} className="w-9 h-9 flex items-center justify-center text-sm font-semibold text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-full transition-all">
              {validPage - 1}
            </Link>
          )}
          
          {/* Current Active Page */}
          <div className="w-9 h-9 flex items-center justify-center text-sm font-bold bg-[#3b82f6] text-white rounded-full shadow-lg shadow-blue-500/30">
            {validPage}
          </div>

          {/* Next Page */}
          {liveAnimeData.length === 24 && (
            <Link href={`/dashboard?page=${validPage + 1}`} className="w-9 h-9 flex items-center justify-center text-sm font-semibold text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-full transition-all">
              {validPage + 1}
            </Link>
          )}

          {/* Next Next Page (Only visible on larger screens to match image layout) */}
          {liveAnimeData.length === 24 && (
            <Link href={`/dashboard?page=${validPage + 2}`} className="hidden sm:flex w-9 h-9 items-center justify-center text-sm font-semibold text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-full transition-all">
              {validPage + 2}
            </Link>
          )}
          
          {/* Next Next Next Page */}
          {liveAnimeData.length === 24 && (
            <Link href={`/dashboard?page=${validPage + 3}`} className="hidden md:flex w-9 h-9 items-center justify-center text-sm font-semibold text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-full transition-all">
              {validPage + 3}
            </Link>
          )}

          {/* Right Ellipsis */}
          {liveAnimeData.length === 24 && (
            <span className="text-zinc-500 text-xs px-1 tracking-widest">...</span>
          )}

          {/* Next Arrow */}
          {liveAnimeData.length === 24 ? (
            <Link href={`/dashboard?page=${validPage + 1}`} className="w-8 h-8 flex items-center justify-center text-zinc-100 hover:text-white transition-colors">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div className="w-8 h-8 flex items-center justify-center text-zinc-700 cursor-not-allowed">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// 3. Skeleton Loading State
function DashboardSkeleton() {
  return (
    <>
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
    </>
  );
}

// 4. Next.js automatically passes searchParams from the URL into Server Components!
export default async function AnimeDashboard({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  
  // 5. Extract the page number from the URL using React's use() equivalent (awaiting the Promise in Next.js 15)
  const params = await searchParams;
  const pageStr = params?.page;
  
  const currentPage = typeof pageStr === "string" ? parseInt(pageStr, 10) : 1;
  const validPage = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;

  return (
    <main className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 px-8 pb-8 pt-36 sm:px-12 sm:pb-12 sm:pt-40 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto w-full flex flex-col flex-grow">
        <Suspense fallback={<DashboardSkeleton />} key={validPage}>
          <DashboardContent validPage={validPage} />
        </Suspense>
      </div>
    </main>
  );
}