package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"animenotify/internal/database"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func home(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	w.Write([]byte("Entry Point"))
	log.Println("testing")
}

//main Function

func main() {

	err := godotenv.Load(".env")
	if err != nil {
		log.Println("Error loading .env file")
	}

	//Database Connection
	database.ConnectDB()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/", home)

	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      mux,
		IdleTimeout:  time.Minute,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	log.Printf("Starting server on %s", port)

	err = srv.ListenAndServe()
	log.Fatal(err)
}
