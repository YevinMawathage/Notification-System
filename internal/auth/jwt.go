package authentication

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var sectretKey = []byte(os.Getenv("SECRET_KEY"))

func GenerateToken(UserID int) (string, error) {

	claims := jwt.MapClaims{
		"user_id": UserID,
		"expire":  time.Now().Add(time.Hour * 48).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString(sectretKey)
}
