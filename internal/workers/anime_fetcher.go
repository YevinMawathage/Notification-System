package workers

import (
	"animenotify/internal/models"
	"encoding/json"
	"log"
	"net/http"
)

type JikanResponse struct {
	Data []models.AnimeBase `json:"data"`
}

func FetchSeason() {
	url := "https://api.jikan.moe/v4/seasons/now"
	log.Println("JIKAN API: ", url)

	// Testing if we n reach the API

	response, err := http.Get(url)
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

	for i, anime := range results.Data {
		if i >= 3 {
			break
		}
		log.Printf("- Found: %s", anime.Title)
	}

}
