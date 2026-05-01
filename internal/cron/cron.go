package cronjob

import (
	"animenotify/internal/workers"
	"fmt"
	"log"
	"time"

	"github.com/robfig/cron/v3"
)

func CronScheduler() *cron.Cron {
	c := cron.New()

	_, err := c.AddFunc("@every 1m", func() {

		log.Println("⏰ CRON TRIGGERED: Starting Daily Data Pipeline...")

		// 1. Fetch Currently Airing (New)
		workers.FetchCurrentSeason()

		// 2. SLEEP FOR 5 SECONDS to respect Jikan's Rate Limits!
		time.Sleep(5 * time.Second)

		// 3. Fetch Upcoming Shows
		workers.FetchUpcomingAnime()

		// 4. SLEEP FOR 5 SECONDS
		time.Sleep(5 * time.Second)

		// 5. Fetch Old/Finished Classics
		workers.FetchTopOldAnime()

		log.Println("✅ Daily Pipeline Complete!")

	})
	if err != nil {
		log.Println("CronJOB Error", err)
	}

	c.Start()
	fmt.Println("Cron scheduler initialized")
	return c
}
