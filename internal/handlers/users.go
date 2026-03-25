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

	// step 7 - send http status codes and translted json back to frontend
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// User Login

func LoginUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	var loginDetails struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := json.NewDecoder(r.Body).Decode(&loginDetails)
	if err != nil {
		http.Error(w, "Invalid JSON data", http.StatusBadRequest)
		return
	}

	if loginDetails.Email == "" || loginDetails.Password == "" {
		http.Error(w, "Email or Password is required", http.StatusBadRequest)
		return
	}

	var user models.User // box to hold database data

	loginQuery := `
			SELECT user_id, username, email, password 
			FROM users
			WHERE email = $1
	`

	err = database.DB.QueryRow(loginQuery, loginDetails.Email).Scan(
		&user.UserID,
		&user.Username,
		&user.Email,
		&user.Password,
	)

	if err != nil {
		log.Println("Login DB Error", err)
		http.Error(w, "INVALID Credentials", http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginDetails.Password))
	if err != nil {
		log.Println("LOGIN Password Error", err)
		http.Error(w, "INVALID Credentials", http.StatusUnauthorized)
		return
	}

	tokenString, err := authentication.GenerateToken(int(user.UserID))
	if err != nil {
		log.Println("TOKEN error", err)
		http.Error(w, "Failed to create authentication error", http.StatusInternalServerError)
		return
	}

	user.Password = ""

	response := struct {
		User  models.User `json:"user"`
		Token string      `json:"token"`
	}{
		User:  user,
		Token: tokenString,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)

}

// GetUserProfile is a PROTECTED route. You can only get here if you have a VIP pass.
func GetUserProfile(w http.ResponseWriter, r *http.Request) {
	// 1. Unzip the backpack and grab the sticky note the Bouncer left!
	userID := r.Context().Value("UserID")

	// 2. Create a simple JSON response proving we know who they are
	response := map[string]interface{}{
		"message": "Welcome to the VIP Lounge! Your pass is valid.",
		"user_id": userID,
	}

	// 3. Send it back to the frontend
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// User Profile Delete
func UserProfileDelete(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("UserID")

	query := `
	DELETE FROM users
	WHERE user_id = $1
	`

	_, err := database.DB.Exec(query, userID)
	if err != nil {
		http.Error(w, "Failed to Delete Data!", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "User Profile Deleted!",
	})

}

type UpdateProfileInfo struct {
	Username string `json:"username"`
	Email    string `json:"email"`
}

func UserProfileUpdate(w http.ResponseWriter, r *http.Request) {

	userID := r.Context().Value("UserID")

	var requestBody UpdateProfileInfo
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, "Invalid Request! ", http.StatusBadRequest)
		return
	}

	var currentUsername, currentEmail string

	fetchQuery := `SELECT username, email FROM users WHERE user_id = $1`

	err = database.DB.QueryRow(fetchQuery, userID).Scan(&currentUsername, &currentEmail)
	if err != nil {
		http.Error(w, "Failed to Retrieve user data", http.StatusInternalServerError)
		return
	}

	if requestBody.Username != "" {
		currentUsername = requestBody.Username
	}

	if requestBody.Email != "" {
		currentEmail = requestBody.Email
	}

	updateQuery := `
	UPDATE users
	SET username = $1, email = $2
	WHERE user_id = $3;
	`

	_, err = database.DB.Exec(updateQuery, currentUsername, currentEmail, userID)
	if err != nil {
		http.Error(w, "Failed to update profile!", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"Message":  "Updated Successfully",
		"Username": currentUsername,
		"Email":    currentEmail,
	})

}
