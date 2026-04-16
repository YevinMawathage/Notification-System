import Image from "next/image";

// Notice there is NO "use client" here. This is a Server Component!

interface Anime {
  anime_id: number;
  title: string;
  title_japanese?: string;
  score?: number;
  synopsis?: string;
  image_url?: string; // Adding image_url for the cover
}

// 1. The Fetch Engine
// This function runs on the Next.js server behind the scenes
async function getLiveAnime() {
  try {
    // We hit your Go Docker container on port 4000!
    // cache: 'no-store' tells Next.js to always get the freshest data
    const res = await fetch("http://localhost:4000/api/v1/anime?page=1&limit=25", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Go API returned status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching anime:", error);
    return []; // If it fails, return an empty array so the page doesn't crash
  }
}

// 2. The Main Page
export default async function AnimeDashboard() {
  // 3. We call the Go API before the page even loads!
  const liveAnimeData = await getLiveAnime();

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Anime Notifications MVP
          </h1>
          {/* Quick navigation link to our new Login page */}
          <a href="/login" className="text-blue-600 font-semibold hover:underline">
            Login / Auth
          </a>
        </div>

        {/* 4. Empty State Protection */}
        {liveAnimeData.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-700">No Anime Found</h3>
            <p className="text-gray-500 mt-2">
              The database is currently empty. Is your Jikan Cron Job running?
            </p>
          </div>
        ) : (
          
          /* 5. The Live Data Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveAnimeData.map((anime: Anime) => (
              <div
                key={anime.anime_id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
              >
                {/* 🚨 ADDED: The Cover Image */}
                <Image 
                  src={anime.image_url || "https://via.placeholder.com/400x500?text=No+Image+Available"} 
                  alt={`${anime.title} cover`}
                  width={400}
                  height={500}
                  unoptimized
                  className="w-full h-64 object-cover object-center"
                />

                {/* The Details Section */}
                <div className="p-6 flex flex-col grow">
                  <h2
                    className="text-xl font-bold text-gray-800 truncate"
                    title={anime.title}
                  >
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

                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 grow">
                    {anime.synopsis || "No synopsis available."}
                  </p>

                  <button className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Subscribe for Alerts
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}