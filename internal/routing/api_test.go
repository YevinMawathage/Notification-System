package routing

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"animenotify/internal/handlers"
)

func TestHealthCheckAPI(t *testing.T) {
	// 1. Send a fake request to the dedicated health route
	req, err := http.NewRequest("GET", "/api/v1/health", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()

	// 2. 🚨 Target ONLY the HealthCheck function
	handler := http.HandlerFunc(handlers.HealthCheck)
	handler.ServeHTTP(rr, req)

	// 3. Verify it works
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("Handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	expected := `{"status": "alive"}`
	if rr.Body.String() != expected {
		t.Errorf("Handler returned unexpected body: got %v want %v", rr.Body.String(), expected)
	}
}
