ALTER TABLE "users" ALTER COLUMN "avatar_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "experience" integer DEFAULT 0 NOT NULL;