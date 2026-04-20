package models

type AnimeBase struct {
	MalId         int         `json:"mal_id"`
	Url           string      `json:"url"`
	Images        JikanImages `json:"images"`
	Trailer       TrailerInfo `json:"trailer"`
	Title         string      `json:"title"`
	TitleEnglish  string      `json:"title_english"`
	TitleJapanese string      `json:"title_japanese"`
	TitleSynonyms []string    `json:"title_synonyms"`
	Type          string      `json:"type"`
	Source        string      `json:"source"`
	Episodes      *int        `json:"episodes"`
	Status        string      `json:"status"`
	Airing        bool        `json:"airing"`
	Duration      string      `json:"duration"`
	Rating        string      `json:"rating"`
	Score         *float64    `json:"score"`
	ScoredBy      *int        `json:"scored_by"`
	Rank          *int        `json:"rank"`
	Popularity    *int        `json:"popularity"`
	Members       *int        `json:"members"`
	Favorites     *int        `json:"favorites"`
	Synopsis      string      `json:"synopsis"`
	Background    string      `json:"background"`
	Season        string      `json:"season"`
	Year          *int        `json:"year"`
	Broadcast     struct {
		Day      string `json:"day"`
		Time     string `json:"time"`
		Timezone string `json:"timezone"`
		String   string `json:"string"`
	} `json:"broadcast"`
}

type TrailerInfo struct {
	YoutubeID *string `json:"youtube_id"`
	Url       *string `json:"url"`
	EmbedUrl  *string `json:"embed_url"`
}

type JikanImageFormats struct {
	ImageURL string `json:"image_url"`
}

type JikanImages struct {
	JPG JikanImageFormats `json:"jpg"`
}
