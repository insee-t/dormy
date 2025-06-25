CREATE TYPE "public"."bank_providers" AS ENUM('promptpay', 'krungsri');--> statement-breakpoint
CREATE TYPE "public"."business_types" AS ENUM('personal', 'business');--> statement-breakpoint
CREATE TYPE "public"."oauth_provides" AS ENUM('discord', 'github', 'google');--> statement-breakpoint
CREATE TYPE "public"."report_types" AS ENUM('repair', 'clean', 'move', 'emergency', 'other');--> statement-breakpoint
CREATE TYPE "public"."user_roles" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TYPE "public"."util_types" AS ENUM('water', 'electric');--> statement-breakpoint
CREATE TABLE "apartments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"businessType" "business_types" DEFAULT 'personal' NOT NULL,
	"phone" text NOT NULL,
	"billDate" timestamp with time zone NOT NULL,
	"paymentDate" timestamp with time zone NOT NULL,
	"email" text NOT NULL,
	"userId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "apartments_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "bankAccounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"bankNumber" text NOT NULL,
	"bankProvider" "bank_providers" NOT NULL,
	"userId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "compalins" (
	"id" serial PRIMARY KEY NOT NULL,
	"reportType" "report_types" NOT NULL,
	"description" text NOT NULL,
	"fileName" text NOT NULL,
	"complete" boolean DEFAULT false NOT NULL,
	"tenantId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leases" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenantId" uuid NOT NULL,
	"lateFee" integer DEFAULT 0 NOT NULL,
	"fee" integer NOT NULL,
	"roomId" serial NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"complete" boolean DEFAULT false NOT NULL,
	"tenantId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rents" (
	"id" serial PRIMARY KEY NOT NULL,
	"leaseId" serial NOT NULL,
	"late" boolean DEFAULT false,
	"paid" boolean DEFAULT false NOT NULL,
	"fee" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"floor" integer DEFAULT 1,
	"apartmentId" serial NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text,
	"role" "user_roles" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tenants_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_oauth_accounts" (
	"userId" uuid NOT NULL,
	"provider" "oauth_provides" NOT NULL,
	"providerAccountId" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_oauth_accounts_providerAccountId_provider_pk" PRIMARY KEY("providerAccountId","provider"),
	CONSTRAINT "user_oauth_accounts_providerAccountId_unique" UNIQUE("providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "util_bills" (
	"id" serial PRIMARY KEY NOT NULL,
	"utilType" "util_types" NOT NULL,
	"leaseId" serial NOT NULL,
	"late" boolean DEFAULT false,
	"paid" boolean DEFAULT false NOT NULL,
	"fee" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notes" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "notes" CASCADE;--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_email_key";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_roles" DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "createdAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updatedAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "apartments" ADD CONSTRAINT "apartments_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bankAccounts" ADD CONSTRAINT "bankAccounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compalins" ADD CONSTRAINT "compalins_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leases" ADD CONSTRAINT "leases_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leases" ADD CONSTRAINT "leases_roomId_rooms_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packages" ADD CONSTRAINT "packages_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rents" ADD CONSTRAINT "rents_leaseId_leases_id_fk" FOREIGN KEY ("leaseId") REFERENCES "public"."leases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_apartmentId_apartments_id_fk" FOREIGN KEY ("apartmentId") REFERENCES "public"."apartments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_oauth_accounts" ADD CONSTRAINT "user_oauth_accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "util_bills" ADD CONSTRAINT "util_bills_leaseId_leases_id_fk" FOREIGN KEY ("leaseId") REFERENCES "public"."leases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "image";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");