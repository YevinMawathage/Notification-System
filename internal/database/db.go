package database

import (
	"database/sql"
	_ "embed"
	"fmt"
	"log"
	"os"

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

	DB, err = sql.Open("postgres", psqInfo)
	if err != nil {
		log.Fatal("Database is unreachable: ", err)
	}

	err = DB.Ping()
	if err != nil {
		panic(err)
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
