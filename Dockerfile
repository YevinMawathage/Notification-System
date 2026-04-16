# Stage 01

FROM golang:1.24-alpine AS builder

WORKDIR /app

RUN apk --no-cache add ca-certificates

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o api-server ./cmd/api


# Stage 02

FROM scratch

WORKDIR /root/

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

COPY --from=builder /app/api-server .
COPY .env .

EXPOSE 4000

CMD ["./api-server"]





