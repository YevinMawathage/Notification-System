package handlers

import (
	"animenotify/internal/database"
	"encoding/json"
	"log"
	"net/http"

	"github.com/lib/pq"
)

func SubscribeToAnime(w http.ResponseWriter, r *http.Request) {

	userID := r.Context().Value("UserID")

	var requestBody struct {
		AnimeID int `json:"anime_id"`
	}

	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil || requestBody.AnimeID == 0 {
		http.Error(w, "Invalid request! ", http.StatusBadRequest)
		return
	}

	query := `INSERT INTO Subscriptions (user_id, anime_id) VALUES ($1, $2)`
	_, err = database.DB.Exec(query, userID, requestBody.AnimeID)

	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok {
			if pqErr.Code == "23505" {
				http.Error(w, "Already Subscribe to this Anime", http.StatusConflict)
				return
			}
			log.Println("Subscription DB Error:", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Successfuly Subscribed to the Anime!",
	})
}

type SubscribedAnime struct {
	AnimeID        int    `json:"anime_id"`
	Title          string `json:"title"`
	Title_Japanese string `json:"title_japanese"`
	Url            string `json:"image_url"`
	Synopsis       string `json:"synopsis"`
	BroadcastDay   string `json:"broadcast_day"`
	BroadcastTime  string `json:"broadcast_time"`
}

func GetSubscriptions(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("UserID")

	query := `
	SELECT 
			a.anime_id, 
			a.title, 
			COALESCE(a.title_japanese, ''),
			COALESCE(image_url, '') 
			COALESCE(a.synopsis, ''), 
			COALESCE(a.broadcast_day, ''), 
			COALESCE(a.broadcast_time, '')
		FROM anime_shows a 
		INNER JOIN subscriptions s ON a.anime_id = s.anime_id
		WHERE s.user_id = $1;
	`

	rows, err := database.DB.Query(query, userID)
	if err != nil {
		http.Error(w, "Failed to Fetch Data", http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	shows := []SubscribedAnime{}

	for rows.Next() {
		var animeShow SubscribedAnime

		// 8. Scan the SQL columns directly into our Go struct
		err := rows.Scan(&animeShow.AnimeID, &animeShow.Title, &animeShow.Title_Japanese, &animeShow.Synopsis, &animeShow.BroadcastDay, &animeShow.BroadcastTime)
		if err != nil {
			log.Println("Error scanning anime row:", err)
			continue // Skip this broken row and keep going!
		}

		// 9. Add the scanned show to our master list
		shows = append(shows, animeShow)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(shows)

}

func DeleteSubscription(w http.ResponseWriter, r *http.Request) {

	userID := r.Context().Value("UserID")

	var requestBody struct {
		AnimeID int `json:"anime_id"`
	}

	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil || requestBody.AnimeID == 0 {
		http.Error(w, "Invalid request! ", http.StatusBadRequest)
		return
	}

	query := `
	DELETE FROM Subscriptions 
	WHERE user_id = $1 AND anime_id = $2;
	`

	_, err = database.DB.Exec(query, userID, requestBody.AnimeID)
	if err != nil {
		log.Println("Unsubscribe DB Error:", err)
		http.Error(w, "Failed to Unsubscribe!", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Unubscribed the Anime!",
	})

}
