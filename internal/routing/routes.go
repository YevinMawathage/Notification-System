package routing

// Rule 1 - API Versioning v1 & v2
// Rule 2 - Http Methods

import (
	"animenotify/internal/handlers"
	"log"
	"net/http"
)

func Routers() *http.ServeMux {

	router := http.NewServeMux()
	router.HandleFunc("/", home)
	router.HandleFunc("POST /api/v1/users", handlers.RegisterUser)

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
