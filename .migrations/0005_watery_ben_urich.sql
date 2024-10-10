ALTER TABLE "users" DROP COLUMN "external_account_id";
ALTER TABLE "users" ADD COLUMN "external_account_id" integer NOT NULL;