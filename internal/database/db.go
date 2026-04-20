package database

import (
	"database/sql"
	_ "embed"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

var DB *sql.DB

//go:embed schema.sql
var schemaSQL string

func ConnectDB() {

	psqInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("DB_NAME"),
	)
	var err error
	var counts int

	for {
		DB, err = sql.Open("postgres", psqInfo)
		if err != nil {
			log.Println("Postgres not ready yet...")
		} else {
			err = DB.Ping()
			if err == nil {
				log.Println("Successfully connected to the database!")
				break // We connected! Exit the loop and continue booting the app.
			}
			log.Println("Ping failed...")
		}

		if counts > 10 {
			log.Fatal("Database completely failed to start after 20 seconds. Panicking!", err)
		}

		log.Println("Waiting 2 seconds for Database to boot...")
		time.Sleep(2 * time.Second)
		counts++
	}

	fmt.Println("Successfully connected to the PostgreSQL database!")

	initSchema()
}

func initSchema() {
	_, err := DB.Exec(schemaSQL)
	if err != nil {
		log.Fatal("Failed to initialize database schema: ", err)
	}
	fmt.Println("Database schema initialized successfully!")
}
