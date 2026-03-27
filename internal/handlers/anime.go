package handlers

import (
	"animenotify/internal/database"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
)

type AnimeCard struct {
	AnimeID        int     `json:"anime_id"`
	Title          string  `json:"title"`
	Title_Japanese string  `json:"title_japanese"`
	Synopsis       string  `json:"synopsis"`
	Trailer        string  `json:"trailer_embed_url"`
	Score          float64 `json:"score"`
}

func GetAnimeList(w http.ResponseWriter, r *http.Request) {
	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")
	statusFilter := r.URL.Query().Get("status")
	searchFilter := r.URL.Query().Get("search")

	page := 1
	limit := 10

	if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
		page = p
	}

	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 && l <= 50 {
		limit = l
	}

	offset := (page - 1) * limit

	query := `
		SELECT 
			anime_id,
			title,
			COALESCE(title_japanese, ''), 
			COALESCE(synopsis, ''), 
			COALESCE(trailer_embed_url, ''),
			COALESCE(score, 0)
		FROM anime_shows
		WHERE ($3 = '' OR status ILIKE '%' || $3 || '%') AND
		WHERE ($4 = '' OR title ILIKE '%' || $4 || '%' OR title_japanese ILIKE '%' || $4 || '%')
		ORDER BY anime_id ASC
		LIMIT $1 OFFSET $2;
	`

	rows, err := database.DB.Query(query, limit, offset, statusFilter, searchFilter)
	if err != nil {
		http.Error(w, "Failed to Fetch Anime", http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	Catalog := []AnimeCard{}

	for rows.Next() {
		var list AnimeCard

		// 8. Scan the SQL columns directly into our Go struct
		err := rows.Scan(&list.AnimeID, &list.Title, &list.Title_Japanese, &list.Synopsis, &list.Trailer, &list.Score)
		if err != nil {
			log.Println("Error scanning anime:", err)
			continue // Skip this broken row and keep going!
		}

		// 9. Add the scanned show to our master list
		Catalog = append(Catalog, list)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(Catalog)

}
