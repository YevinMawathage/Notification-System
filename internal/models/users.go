package models

import "time"

type User struct {
	UserID         int64     `json:"user_id binding:"required"`
	Username       string    `json:"username binding:"required"`
	Email          string    `json:"email binding:"required"`
	Password       string    `json:"password binding:"required"`
	ProfilePicture string    `json:"profile_picture"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}
