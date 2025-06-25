CREATE TYPE "public"."complain_status" AS ENUM('in_progress', 'waiting_for_inventory', 'complete');--> statement-breakpoint
CREATE TYPE "public"."room_status" AS ENUM('vacant', 'occupied', 'under_maintenance');--> statement-breakpoint
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "apartments" DROP CONSTRAINT "apartments_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "bankAccounts" DROP CONSTRAINT "bankAccounts_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "compalins" DROP CONSTRAINT "compalins_tenantId_tenants_id_fk";
--> statement-breakpoint
ALTER TABLE "packages" DROP CONSTRAINT "packages_tenantId_tenants_id_fk";
--> statement-breakpoint
ALTER TABLE "payment_plans" DROP CONSTRAINT "payment_plans_tenantId_tenants_id_fk";
--> statement-breakpoint
ALTER TABLE "user_oauth_accounts" DROP CONSTRAINT "user_oauth_accounts_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "waters" DROP CONSTRAINT "waters_tenantId_tenants_id_fk";
--> statement-breakpoint
ALTER TABLE "compalins" ADD COLUMN "status" "complain_status" DEFAULT 'in_progress' NOT NULL;--> statement-breakpoint
ALTER TABLE "compalins" ADD COLUMN "userId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "electrics" ADD COLUMN "feePerMatrix" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "electrics" ADD COLUMN "userId" uuid;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "userId" uuid;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "ownerName" text NOT NULL;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "roomNumber" text NOT NULL;--> statement-breakpoint
ALTER TABLE "payment_plans" ADD COLUMN "waterFeePerMatrix" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "payment_plans" ADD COLUMN "electricFeePerMatrix" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "payment_plans" ADD COLUMN "roomId" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "payment_plans" ADD COLUMN "userId" uuid;--> statement-breakpoint
ALTER TABLE "rents" ADD COLUMN "userId" uuid;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "status" "room_status" DEFAULT 'vacant' NOT NULL;--> statement-breakpoint
ALTER TABLE "waters" ADD COLUMN "userId" uuid;--> statement-breakpoint
ALTER TABLE "waters" ADD COLUMN "feePerMatrix" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "apartments" ADD CONSTRAINT "apartments_userId_tenants_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bankAccounts" ADD CONSTRAINT "bankAccounts_userId_tenants_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compalins" ADD CONSTRAINT "compalins_userId_tenants_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "electrics" ADD CONSTRAINT "electrics_userId_tenants_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packages" ADD CONSTRAINT "packages_userId_tenants_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_plans" ADD CONSTRAINT "payment_plans_roomId_rooms_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_plans" ADD CONSTRAINT "payment_plans_userId_tenants_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rents" ADD CONSTRAINT "rents_userId_tenants_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_oauth_accounts" ADD CONSTRAINT "user_oauth_accounts_userId_tenants_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waters" ADD CONSTRAINT "waters_userId_tenants_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compalins" DROP COLUMN "complete";--> statement-breakpoint
ALTER TABLE "compalins" DROP COLUMN "tenantId";--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "tenantId";--> statement-breakpoint
ALTER TABLE "payment_plans" DROP COLUMN "tenantId";--> statement-breakpoint
ALTER TABLE "waters" DROP COLUMN "tenantId";