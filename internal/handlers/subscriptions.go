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
