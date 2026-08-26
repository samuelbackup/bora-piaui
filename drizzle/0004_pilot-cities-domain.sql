CREATE TABLE `cities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`name` varchar(120) NOT NULL,
	`eyebrow` varchar(120) NOT NULL,
	`summary` text NOT NULL,
	`accent` varchar(32) NOT NULL,
	`sourceName` varchar(255) NOT NULL,
	`sourceUrl` varchar(1024) NOT NULL,
	`sourceVerifiedAt` varchar(96) NOT NULL,
	`sourceResponsible` varchar(255),
	`published` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cities_id` PRIMARY KEY(`id`),
	CONSTRAINT `cities_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `city_places` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cityId` int NOT NULL,
	`externalId` varchar(140) NOT NULL,
	`slug` varchar(140) NOT NULL,
	`kind` enum('attraction','business') NOT NULL DEFAULT 'attraction',
	`title` varchar(180) NOT NULL,
	`category` varchar(100) NOT NULL,
	`summary` text NOT NULL,
	`image` json,
	`routeUrl` varchar(1024),
	`contactUrl` varchar(1024),
	`externalUrl` varchar(1024),
	`mapQuery` varchar(255) NOT NULL,
	`accent` varchar(32) NOT NULL,
	`operationalStatus` enum('confirmed','verify','unavailable') NOT NULL DEFAULT 'verify',
	`editorialStatus` enum('published','pending') NOT NULL DEFAULT 'pending',
	`sourceName` varchar(255) NOT NULL,
	`sourceUrl` varchar(1024) NOT NULL,
	`sourceVerifiedAt` varchar(96) NOT NULL,
	`sourceResponsible` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `city_places_id` PRIMARY KEY(`id`),
	CONSTRAINT `city_places_external_id_unique` UNIQUE(`externalId`)
);
--> statement-breakpoint
CREATE TABLE `curated_businesses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cityId` int NOT NULL,
	`externalId` varchar(140) NOT NULL,
	`kind` enum('restaurant','service') NOT NULL DEFAULT 'service',
	`anchorPlaceIds` json NOT NULL,
	`title` varchar(180) NOT NULL,
	`category` varchar(100) NOT NULL,
	`summary` text NOT NULL,
	`routeUrl` varchar(1024),
	`contactUrl` varchar(1024),
	`editorialStatus` enum('published','pending') NOT NULL DEFAULT 'pending',
	`sourceName` varchar(255) NOT NULL,
	`sourceUrl` varchar(1024) NOT NULL,
	`sourceVerifiedAt` varchar(96) NOT NULL,
	`sourceResponsible` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `curated_businesses_id` PRIMARY KEY(`id`),
	CONSTRAINT `curated_businesses_external_id_unique` UNIQUE(`externalId`)
);
--> statement-breakpoint
CREATE TABLE `curation_topics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cityId` int NOT NULL,
	`externalId` varchar(140) NOT NULL,
	`category` enum('gastronomy','service') NOT NULL DEFAULT 'service',
	`title` varchar(180) NOT NULL,
	`description` text NOT NULL,
	`status` enum('curating','published') NOT NULL DEFAULT 'curating',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `curation_topics_id` PRIMARY KEY(`id`),
	CONSTRAINT `curation_topics_external_id_unique` UNIQUE(`externalId`)
);
--> statement-breakpoint
CREATE TABLE `editorial_highlights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cityId` int NOT NULL,
	`externalId` varchar(140) NOT NULL,
	`title` varchar(160) NOT NULL,
	`description` text NOT NULL,
	`sourceName` varchar(255) NOT NULL,
	`sourceUrl` varchar(1024) NOT NULL,
	`sourceVerifiedAt` varchar(96) NOT NULL,
	`sourceResponsible` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `editorial_highlights_id` PRIMARY KEY(`id`),
	CONSTRAINT `editorial_highlights_external_id_unique` UNIQUE(`externalId`)
);
--> statement-breakpoint
CREATE TABLE `itineraries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cityId` int NOT NULL,
	`slug` varchar(140) NOT NULL,
	`dayScope` enum('one-day') NOT NULL DEFAULT 'one-day',
	`title` varchar(180) NOT NULL,
	`durationLabel` varchar(120) NOT NULL,
	`summary` text NOT NULL,
	`confirmationNotice` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `itineraries_id` PRIMARY KEY(`id`),
	CONSTRAINT `itineraries_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `itinerary_stops` (
	`id` int AUTO_INCREMENT NOT NULL,
	`itineraryId` int NOT NULL,
	`placeId` int NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `itinerary_stops_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `place_proximity_relations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`externalId` varchar(180) NOT NULL,
	`anchorPlaceId` int NOT NULL,
	`relatedPlaceId` int NOT NULL,
	`category` varchar(120) NOT NULL,
	`editorialReason` text NOT NULL,
	`sourceName` varchar(255) NOT NULL,
	`sourceUrl` varchar(1024) NOT NULL,
	`sourceVerifiedAt` varchar(96) NOT NULL,
	`sourceResponsible` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `place_proximity_relations_id` PRIMARY KEY(`id`),
	CONSTRAINT `place_proximity_relations_external_id_unique` UNIQUE(`externalId`)
);
--> statement-breakpoint
ALTER TABLE `city_places` ADD CONSTRAINT `city_places_cityId_cities_id_fk` FOREIGN KEY (`cityId`) REFERENCES `cities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `curated_businesses` ADD CONSTRAINT `curated_businesses_cityId_cities_id_fk` FOREIGN KEY (`cityId`) REFERENCES `cities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `curation_topics` ADD CONSTRAINT `curation_topics_cityId_cities_id_fk` FOREIGN KEY (`cityId`) REFERENCES `cities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `editorial_highlights` ADD CONSTRAINT `editorial_highlights_cityId_cities_id_fk` FOREIGN KEY (`cityId`) REFERENCES `cities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `itineraries` ADD CONSTRAINT `itineraries_cityId_cities_id_fk` FOREIGN KEY (`cityId`) REFERENCES `cities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `itinerary_stops` ADD CONSTRAINT `itinerary_stops_itineraryId_itineraries_id_fk` FOREIGN KEY (`itineraryId`) REFERENCES `itineraries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `itinerary_stops` ADD CONSTRAINT `itinerary_stops_placeId_city_places_id_fk` FOREIGN KEY (`placeId`) REFERENCES `city_places`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `place_proximity_relations` ADD CONSTRAINT `place_proximity_relations_anchorPlaceId_city_places_id_fk` FOREIGN KEY (`anchorPlaceId`) REFERENCES `city_places`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `place_proximity_relations` ADD CONSTRAINT `place_proximity_relations_relatedPlaceId_city_places_id_fk` FOREIGN KEY (`relatedPlaceId`) REFERENCES `city_places`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `city_places_city_idx` ON `city_places` (`cityId`);--> statement-breakpoint
CREATE INDEX `curated_businesses_city_idx` ON `curated_businesses` (`cityId`);--> statement-breakpoint
CREATE INDEX `itinerary_stops_itinerary_idx` ON `itinerary_stops` (`itineraryId`);