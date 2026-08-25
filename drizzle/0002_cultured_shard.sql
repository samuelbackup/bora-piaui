CREATE TABLE `usage_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventName` varchar(48) NOT NULL,
	`sessionId` varchar(36) NOT NULL,
	`citySlug` varchar(80),
	`itemId` varchar(120),
	`anchorItemId` varchar(120),
	`source` varchar(48),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `usage_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `usage_events_created_at_idx` ON `usage_events` (`createdAt`);--> statement-breakpoint
CREATE INDEX `usage_events_event_name_idx` ON `usage_events` (`eventName`);--> statement-breakpoint
CREATE INDEX `usage_events_city_slug_idx` ON `usage_events` (`citySlug`);