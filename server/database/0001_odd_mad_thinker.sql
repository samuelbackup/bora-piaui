CREATE TABLE `cultural_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(140) NOT NULL,
	`title` varchar(220) NOT NULL,
	`city` varchar(120) NOT NULL,
	`category` varchar(100) NOT NULL,
	`startsAt` timestamp NOT NULL,
	`endsAt` timestamp,
	`venue` varchar(220) NOT NULL,
	`summary` text NOT NULL,
	`sourceName` varchar(255) NOT NULL,
	`sourceUrl` varchar(1024) NOT NULL,
	`confirmationStatus` enum('confirmado','verificar','cancelado') NOT NULL DEFAULT 'verificar',
	`published` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cultural_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `cultural_events_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `partner_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessName` varchar(180) NOT NULL,
	`city` varchar(120) NOT NULL,
	`category` varchar(100) NOT NULL,
	`phone` varchar(40) NOT NULL,
	`address` varchar(255) NOT NULL,
	`openingHours` varchar(255),
	`description` text NOT NULL,
	`plan` enum('gratuito','destaque') NOT NULL DEFAULT 'gratuito',
	`editorialStatus` enum('pendente','em_revisao','aprovado','recusado') NOT NULL DEFAULT 'pendente',
	`editorialNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partner_submissions_id` PRIMARY KEY(`id`)
);
