package authentication

import (
	"testing"
)

// In Go, every test function must start with the word "Test" and take a pointer to testing.T
func TestGenerateToken(t *testing.T) {
	// 1. The Setup
	userID := 42

	// 2. The Execution
	token, err := GenerateToken(userID)

	// 3. The Validation (Checking every possible situation)
	if err != nil {
		t.Fatalf("Expected no error when generating token, got: %v", err)
	}

	if token == "" {
		t.Errorf("Expected a valid JWT string, got an empty string")
	}

	// Industry Standard: If your token has a specific prefix or format, test that too!
	if len(token) < 20 {
		t.Errorf("Generated token seems too short to be a valid JWT: %s", token)
	}
}
