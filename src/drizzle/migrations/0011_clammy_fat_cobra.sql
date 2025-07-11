ALTER TABLE "electrics" RENAME COLUMN "feePerMatrix" TO "fee";--> statement-breakpoint
ALTER TABLE "waters" RENAME COLUMN "feePerMatrix" TO "fee";--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "phone" text;