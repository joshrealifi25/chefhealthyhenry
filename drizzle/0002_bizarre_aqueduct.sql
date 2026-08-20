ALTER TABLE "saved_lists" ADD COLUMN "recipe_slugs" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "saved_lists" ADD COLUMN "in_cart" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "saved_lists" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;