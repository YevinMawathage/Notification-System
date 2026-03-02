CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username varchar(255) UNIQUE NOT NULL,
    email varchar(255) UNIQUE NOT NULL,
    password varchar(255) NOT NULL,
    profile_picture varchar(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS anime_shows (
    anime_id SERIAL PRIMARY KEY,
    release_year varchar(255),
    Title varchar(255),
    synopsis TEXT,
    release_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Subscriptions (
    id SERIAL PRIMARY KEY,
    user_id int NOT NULL,
    anime_id int NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_anime FOREIGN KEY (anime_id) REFERENCES anime_shows(anime_id) ON DELETE CASCADE,
    
    CONSTRAINT unique_user_anime UNIQUE (user_id, anime_id)
);


