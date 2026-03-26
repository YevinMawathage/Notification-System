package main

import (
	"log"
	"net/http"
	"os"
	"time"

	cronjob "animenotify/internal/cron"
	"animenotify/internal/database"
	"animenotify/internal/routing"
	"animenotify/internal/workers"

	"github.com/joho/godotenv"
)

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

	//Routers
	router := routing.Routers()

	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      router,
		IdleTimeout:  time.Minute,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	log.Printf("Starting server on %s", port)

	log.Println("--- TESTING JIKAN API FETCH ---")
	workers.FetchTopOldAnime()
	log.Println("--- TEST COMPLETE ---")

	// CRON Scheduler for anime fetch
	c := cronjob.CronScheduler()
	defer c.Stop()

	err = srv.ListenAndServe()
	log.Fatal(err)

}
