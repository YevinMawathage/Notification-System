package handlers

import (
	authentication "animenotify/internal/auth"
	"animenotify/internal/database"
	"animenotify/internal/models"
	"encoding/json"
	"log"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

// w = response write / talks back to browser
// r = request / contains json and headers etc..

// step 1 - validate POST request
func RegisterUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	// step 2 - we decode and pack incoming raw json into a user memory address
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid JSON data", http.StatusBadRequest)
		return
	}

	if user.Username == "" || user.Email == "" || user.Password == "" {
		http.Error(w, "Username, email, and password are required", http.StatusBadRequest)
		return
	}

	// step 3 - Secure data / password hashing / convert plain text into data bytes / complex scramble algo
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to Secure Password", http.StatusInternalServerError)
		return
	}
	// step 4 - SQL insertion using place-holders
	query := `
		INSERT INTO users (username, email, password)
		VALUES ($1, $2, $3)
		RETURNING user_id, created_at
	`
	// step 5 - Firing the queries
	err = database.DB.QueryRow(query, user.Username, user.Email, string(hashedPassword)).Scan(&user.UserID, &user.CreatedAt)
	if err != nil {
		http.Error(w, "Username or Email already exists", http.StatusConflict)
		return
	}
	// step 6 - blank the password in case of revealing hashed password to the frontend
	user.Password = ""

	tokenString, err := authentication.GenerateToken(int(user.UserID))
	if err != nil {
		log.Println("TOKEN error", err)
		http.Error(w, "Failed to create authentication error", http.StatusInternalServerError)
		return
	}

	// Pack the final delivery box

	response := struct {
		User  models.User `json:"user"`
		Token string      `json:"token"`
	}{
		User:  user,
		Token: tokenString,
	}

	// step 7 - send http sttus codes and translted json back to frontend
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}
