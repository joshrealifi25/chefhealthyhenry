CREATE TABLE "favorite_things" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"image_url" text,
	"link_url" text NOT NULL,
	"is_affiliate" boolean DEFAULT false NOT NULL,
	"note" text NOT NULL,
	"why_i_like_it" text,
	"label" text DEFAULT 'recommends' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
