CREATE TYPE "public"."confirmation_status" AS ENUM('confirmado', 'verificar', 'cancelado');--> statement-breakpoint
CREATE TYPE "public"."editorial_status" AS ENUM('pendente', 'em_revisao', 'aprovado', 'recusado');--> statement-breakpoint
CREATE TYPE "public"."feedback_category" AS ENUM('elogio', 'sugestao', 'problema');--> statement-breakpoint
CREATE TYPE "public"."operational_status" AS ENUM('confirmado', 'verificar', 'indisponivel');--> statement-breakpoint
CREATE TYPE "public"."partner_plan" AS ENUM('gratuito', 'destaque');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "cultural_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(140) NOT NULL,
	"title" varchar(220) NOT NULL,
	"city" varchar(120) NOT NULL,
	"category" varchar(100) NOT NULL,
	"startsAt" timestamp NOT NULL,
	"endsAt" timestamp,
	"venue" varchar(220) NOT NULL,
	"summary" text NOT NULL,
	"sourceName" varchar(255) NOT NULL,
	"sourceUrl" varchar(1024) NOT NULL,
	"confirmationStatus" "confirmation_status" DEFAULT 'verificar' NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "destination_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"destinationId" integer NOT NULL,
	"imageUrl" varchar(1024) NOT NULL,
	"altText" varchar(255) NOT NULL,
	"caption" text,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "destinations" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(120) NOT NULL,
	"title" varchar(180) NOT NULL,
	"polo" varchar(100) NOT NULL,
	"category" varchar(80) NOT NULL,
	"municipality" varchar(120) NOT NULL,
	"summary" text NOT NULL,
	"description" text NOT NULL,
	"mapQuery" varchar(255) NOT NULL,
	"routeUrl" varchar(1024) NOT NULL,
	"sourceName" varchar(255) NOT NULL,
	"sourceUrl" varchar(1024) NOT NULL,
	"sourceYear" varchar(48) NOT NULL,
	"operationalStatus" "operational_status" DEFAULT 'verificar' NOT NULL,
	"hours" text,
	"pricing" text,
	"accessInfo" text,
	"contactInfo" text,
	"visitNotes" text,
	"operationalSource" varchar(255),
	"operationalSourceUrl" varchar(1024),
	"lastVerifiedAt" timestamp,
	"published" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedbacks" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" "feedback_category" NOT NULL,
	"message" text NOT NULL,
	"rating" integer,
	"destinationSlug" varchar(120),
	"destinationName" varchar(180),
	"isRead" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partner_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"businessName" varchar(180) NOT NULL,
	"city" varchar(120) NOT NULL,
	"category" varchar(100) NOT NULL,
	"phone" varchar(40) NOT NULL,
	"address" varchar(255) NOT NULL,
	"openingHours" varchar(255),
	"description" text NOT NULL,
	"plan" "partner_plan" DEFAULT 'gratuito' NOT NULL,
	"editorialStatus" "editorial_status" DEFAULT 'pendente' NOT NULL,
	"editorialNotes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usage_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"eventName" varchar(48) NOT NULL,
	"sessionId" varchar(36) NOT NULL,
	"citySlug" varchar(80),
	"itemId" varchar(120),
	"anchorItemId" varchar(120),
	"source" varchar(48),
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"passwordHash" text,
	"sessionsInvalidatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
ALTER TABLE "destination_images" ADD CONSTRAINT "destination_images_destinationId_destinations_id_fk" FOREIGN KEY ("destinationId") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "cultural_events_slug_unique" ON "cultural_events" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "destinations_slug_unique" ON "destinations" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "feedbacks_created_at_idx" ON "feedbacks" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "feedbacks_category_idx" ON "feedbacks" USING btree ("category");--> statement-breakpoint
CREATE INDEX "feedbacks_is_read_idx" ON "feedbacks" USING btree ("isRead");--> statement-breakpoint
CREATE INDEX "usage_events_created_at_idx" ON "usage_events" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "usage_events_event_name_idx" ON "usage_events" USING btree ("eventName");--> statement-breakpoint
CREATE INDEX "usage_events_city_slug_idx" ON "usage_events" USING btree ("citySlug");