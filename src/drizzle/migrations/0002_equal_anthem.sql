ALTER TABLE "apartments" DROP CONSTRAINT "apartments_email_unique";--> statement-breakpoint
ALTER TABLE "apartments" ALTER COLUMN "email" DROP NOT NULL;