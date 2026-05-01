package main

import (
	"log"
	"net/http"
	"os"
	"time"

	cronjob "animenotify/internal/cron"
	"animenotify/internal/database"
	"animenotify/internal/routing"

	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

//main Function new

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

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "content-type"},
		AllowCredentials: true,
	})

	corsHandler := c.Handler(router)

	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      corsHandler,
		IdleTimeout:  time.Minute,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	log.Printf("Starting server on %s", port)

	// CRON Scheduler for anime fetch
	cron := cronjob.CronScheduler()
	defer cron.Stop()

	err = srv.ListenAndServe()
	log.Fatal(err)

}
