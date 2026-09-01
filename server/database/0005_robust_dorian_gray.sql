CREATE TABLE `feedbacks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` enum('elogio','sugestao','problema') NOT NULL,
	`message` text NOT NULL,
	`rating` int,
	`destinationSlug` varchar(120),
	`destinationName` varchar(180),
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `feedbacks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `feedbacks_created_at_idx` ON `feedbacks` (`createdAt`);--> statement-breakpoint
CREATE INDEX `feedbacks_category_idx` ON `feedbacks` (`category`);--> statement-breakpoint
CREATE INDEX `feedbacks_is_read_idx` ON `feedbacks` (`isRead`);