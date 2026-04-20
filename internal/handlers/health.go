package handlers

import "net/http"

// HealthCheck is a dedicated endpoint for Kubernetes and Jenkins to ping
func HealthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status": "alive"}`))
}
