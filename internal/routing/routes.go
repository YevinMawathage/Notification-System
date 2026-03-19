package routing

// Rule 1 - API Versioning v1 & v2
// Rule 2 - Http Methods

import (
	authentication "animenotify/internal/auth"
	"animenotify/internal/handlers"
	"log"
	"net/http"
)

func Routers() *http.ServeMux {

	router := http.NewServeMux()
	router.HandleFunc("/", home)
	router.HandleFunc("POST /api/v1/users", handlers.RegisterUser)
	router.HandleFunc("POST /api/v1/users/login", handlers.LoginUser)
	router.HandleFunc("GET /api/v1/users/profile", authentication.Middleware(handlers.GetUserProfile))
	router.HandleFunc("POST /api/v1/users/subscribe", authentication.Middleware(handlers.SubscribeToAnime))
	router.HandleFunc("GET /api/v1/users/subscribe/shows", authentication.Middleware(handlers.GetSubscriptions))
	router.HandleFunc("DELETE /api/v1/users/unsubscribe", authentication.Middleware(handlers.DeleteSubscription))
	router.HandleFunc("GET /api/v1/anime", handlers.GetAnimeList)
	return router
}

func home(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	w.Write([]byte("Entry Point"))
	log.Println("testing")
}
