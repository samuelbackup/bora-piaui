CREATE TABLE `destination_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`destinationId` int NOT NULL,
	`imageUrl` varchar(1024) NOT NULL,
	`altText` varchar(255) NOT NULL,
	`caption` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `destination_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `destinations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`title` varchar(180) NOT NULL,
	`polo` varchar(100) NOT NULL,
	`category` varchar(80) NOT NULL,
	`municipality` varchar(120) NOT NULL,
	`summary` text NOT NULL,
	`description` text NOT NULL,
	`mapQuery` varchar(255) NOT NULL,
	`routeUrl` varchar(1024) NOT NULL,
	`sourceName` varchar(255) NOT NULL,
	`sourceUrl` varchar(1024) NOT NULL,
	`sourceYear` varchar(48) NOT NULL,
	`operationalStatus` enum('confirmado','verificar','indisponivel') NOT NULL DEFAULT 'verificar',
	`hours` text,
	`pricing` text,
	`accessInfo` text,
	`contactInfo` text,
	`visitNotes` text,
	`operationalSource` varchar(255),
	`operationalSourceUrl` varchar(1024),
	`lastVerifiedAt` timestamp,
	`published` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `destinations_id` PRIMARY KEY(`id`),
	CONSTRAINT `destinations_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
ALTER TABLE `destination_images` ADD CONSTRAINT `destination_images_destinationId_destinations_id_fk` FOREIGN KEY (`destinationId`) REFERENCES `destinations`(`id`) ON DELETE cascade ON UPDATE no action;