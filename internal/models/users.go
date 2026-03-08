package models

import "time"

type User struct {
	UserID         int       `json:"user_id"`
	Username       string    `json:"username"`
	Email          string    `json:"email"`
	Password       string    `json:"password"`
	ProfilePicture string    `json:"profile_picture"`
	CreatedAt      string    `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}
