import Link from "next/link";
import SubscribeButton from "../components/SubscribeButton";

// 1. Update the fetch engine to accept a page number
async function getLiveAnime(page: number) {
  try {
    // We inject the page variable right into your Go URL!
    const res = await fetch(`http://localhost:4000/api/v1/anime?page=${page}&limit=9`, {
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

// 2. Next.js automatically passes searchParams from the URL into Server Components!
export default async function AnimeDashboard({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  
  // 3. Extract the page number from the URL (default to page 1 if it's missing)
  const params = await searchParams;
  const pageStr = params?.page;
  
  const currentPage = typeof pageStr === "string" ? parseInt(pageStr, 10) : 1;
  const validPage = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;

  // 4. Call Go with the current page
  const liveAnimeData = await getLiveAnime(validPage);

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto">

        {liveAnimeData.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-700">No Anime Found</h3>
            <p className="text-gray-500 mt-2">
              We reached the end of the list, or the database is empty!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveAnimeData.map((anime: any) => (
                <div
                  key={anime.anime_id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                >
                  <img
                    src={anime.image_url || "https://via.placeholder.com/400x500?text=No+Image+Available"}
                    alt={`${anime.title} cover`}
                    className="w-full h-64 object-cover object-center"
                  />
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold text-gray-800 truncate" title={anime.title}>
                      {anime.title}
                    </h2>
                    <p className="text-sm text-gray-500 mb-3 font-medium">
                      {anime.title_japanese || "N/A"}
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded">
                        Score: {anime.score || "N/A"}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
                      {anime.synopsis || "No synopsis available."}
                    </p>
                    
                    {/* 🚨 Our new Smart Subscribe Button */}
                    <SubscribeButton animeId={anime.anime_id} animeTitle={anime.title} />
                  </div>
                </div>
              ))}
            </div>

            {/* 5. The Pagination Controls */}
            <div className="flex justify-center items-center gap-6 mt-12 mb-8">
              {validPage > 1 ? (
                <Link 
                  href={`/?page=${validPage - 1}`} 
                  className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  &larr; Previous Page
                </Link>
              ) : (
                <div className="px-6 py-2 border border-transparent opacity-0 cursor-default">&larr; Previous Page</div> // Invisible placeholder to keep UI centered
              )}

              <span className="text-gray-600 font-medium">
                Page {validPage}
              </span>

              {/* If Go returned exactly 10 items, assume there is a next page */}
              {liveAnimeData.length === 9 ? (
                <Link 
                  href={`/?page=${validPage + 1}`} 
                  className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Next Page &rarr;
                </Link>
              ) : (
                <div className="px-6 py-2 border border-transparent opacity-0 cursor-default">Next Page &rarr;</div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}