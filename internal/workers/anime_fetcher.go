package workers

import (
	"animenotify/internal/database"
	"animenotify/internal/models"
	"encoding/json"
	"log"
	"net/http"

	"github.com/lib/pq"
)

type JikanResponse struct {
	Data []models.AnimeBase `json:"data"`
}

func FetchCurrentSeason() {
	log.Println("Fetching NEW (Currently Airing) Anime...")
	FetchSeason("https://api.jikan.moe/v4/seasons/now")
}

func FetchUpcomingAnime() {
	log.Println("Fetching UPCOMING Anime...")
	FetchSeason("https://api.jikan.moe/v4/seasons/upcoming")
}

func FetchTopOldAnime() {
	log.Println("Fetching OLD (Top Classics) Anime...")
	FetchSeason("https://api.jikan.moe/v4/top/anime")
}

func FetchSeason(targetURL string) {
	log.Println("JIKAN API: ", targetURL)

	// Testing if we n reach the API

	response, err := http.Get(targetURL)
	if err != nil {
		log.Println("CANT REACH JIKAN API", err)
		return
	}

	// close the connection to prevent memory leak

	defer response.Body.Close()

	// Validate the API

	if response.StatusCode != http.StatusOK {
		log.Println("API Error: ", response.StatusCode)
		return
	}

	//empty box to get data

	var results JikanResponse

	// unpack json to the struct

	err = json.NewDecoder(response.Body).Decode(&results)
	if err != nil {
		log.Println("JSON Decoding Error", err)
		return
	}

	// checking its working
	log.Printf("SUCCESS! Fetched %d anime shows.\n", len(results.Data))

	query := `
	INSERT INTO anime_shows (
			mal_id, url, title, title_english, title_japanese, title_synonyms,
			trailer_youtube_id, trailer_url, trailer_embed_url,
			show_type, source, episodes, status, airing, duration, rating,
			score, scored_by, rank, popularity, members, favorites,
			synopsis, background, season, release_year,
			broadcast_day, broadcast_time, broadcast_timezone, broadcast_string
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
			$11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
			$21, $22, $23, $24, $25, $26, $27, $28, $29, $30
		) 
		ON CONFLICT (mal_id) 
		DO UPDATE SET 
			url = EXCLUDED.url,
			title = EXCLUDED.title,
			title_english = EXCLUDED.title_english,
			title_japanese = EXCLUDED.title_japanese,
			title_synonyms = EXCLUDED.title_synonyms,
			trailer_youtube_id = EXCLUDED.trailer_youtube_id,
			trailer_url = EXCLUDED.trailer_url,
			trailer_embed_url = EXCLUDED.trailer_embed_url,
			show_type = EXCLUDED.show_type,
			source = EXCLUDED.source,
			episodes = EXCLUDED.episodes,
			status = EXCLUDED.status,
			airing = EXCLUDED.airing,
			duration = EXCLUDED.duration,
			rating = EXCLUDED.rating,
			score = EXCLUDED.score,
			scored_by = EXCLUDED.scored_by,
			rank = EXCLUDED.rank,
			popularity = EXCLUDED.popularity,
			members = EXCLUDED.members,
			favorites = EXCLUDED.favorites,
			synopsis = EXCLUDED.synopsis,
			background = EXCLUDED.background,
			season = EXCLUDED.season,
			release_year = EXCLUDED.release_year,
			broadcast_day = EXCLUDED.broadcast_day,
			broadcast_time = EXCLUDED.broadcast_time,
			broadcast_timezone = EXCLUDED.broadcast_timezone,
			broadcast_string = EXCLUDED.broadcast_string,
			updated_at = CURRENT_TIMESTAMP;
	`

	savedCount := 0

	for _, anime := range results.Data {
		_, err := database.DB.Exec(query,
			anime.MalId, anime.Url, anime.Title, anime.TitleEnglish, anime.TitleJapanese,
			pq.Array(anime.TitleSynonyms), // 🚨 Wraps the []string safely!
			anime.Trailer.YoutubeID, anime.Trailer.Url, anime.Trailer.EmbedUrl,
			anime.Type, anime.Source, anime.Episodes, anime.Status, anime.Airing, anime.Duration, anime.Rating,
			anime.Score, anime.ScoredBy, anime.Rank, anime.Popularity, anime.Members, anime.Favorites,
			anime.Synopsis, anime.Background, anime.Season, anime.Year,
			anime.Broadcast.Day, anime.Broadcast.Time, anime.Broadcast.Timezone, anime.Broadcast.String,
		)

		if err != nil {
			log.Println("DB Error Savings", anime.Title, err)
			continue
		}

		savedCount++
	}
	log.Printf("--- WORKER COMPLETE: Successfully saved/updated %d anime in the database! ---\n", savedCount)
}
