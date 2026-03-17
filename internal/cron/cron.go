package cronjob

import (
	"animenotify/internal/workers"
	"fmt"
	"log"

	"github.com/robfig/cron/v3"
)

func CronScheduler() *cron.Cron {
	c := cron.New()

	_, err := c.AddFunc("@daily", workers.FetchSeason)
	if err != nil {
		log.Println("CronJOB Error", err)
	}

	c.Start()
	fmt.Println("Cron scheduler initialized")
	return c
}
