ALTER TABLE "favorite_things" ADD COLUMN "is_featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "favorite_things" ADD COLUMN "featured_month" text;--> statement-breakpoint
ALTER TABLE "favorite_things" ADD COLUMN "featured_note" text;
