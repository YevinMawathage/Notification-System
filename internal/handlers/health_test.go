package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHealthCheck(t *testing.T) {
	// 1. Create a simulated HTTP Request
	req, err := http.NewRequest("GET", "/api/v1/health", nil)
	if err != nil {
		t.Fatal(err)
	}

	// 2. Create a simulated ResponseWriter to capture the API's reply
	rr := httptest.NewRecorder()

	// 3. Call your actual handler function directly
	handler := http.HandlerFunc(HealthCheck)
	handler.ServeHTTP(rr, req)

	// 4. Validate the HTTP Status Code
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("Handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	// 5. Validate the JSON Response Body
	expected := `{"status": "alive"}`
	// We use standard string matching for quick API checks
	if rr.Body.String() != expected {
		t.Errorf("Handler returned unexpected body: got %v want %v",
			rr.Body.String(), expected)
	}
}
