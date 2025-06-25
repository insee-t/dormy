ALTER TYPE "public"."bank_providers" ADD VALUE 'ธนาคารกรุงเทพ' BEFORE 'promptpay';--> statement-breakpoint
ALTER TYPE "public"."bank_providers" ADD VALUE 'ธนาคารกสิกรไทย' BEFORE 'promptpay';--> statement-breakpoint
ALTER TYPE "public"."bank_providers" ADD VALUE 'ธนาคารกรุงไทย' BEFORE 'promptpay';--> statement-breakpoint
ALTER TYPE "public"."bank_providers" ADD VALUE 'ธนาคารกรุงศรี' BEFORE 'promptpay';--> statement-breakpoint
ALTER TYPE "public"."bank_providers" ADD VALUE 'ธนาคารไทยพาณิชย์' BEFORE 'promptpay';--> statement-breakpoint
ALTER TYPE "public"."bank_providers" ADD VALUE 'ธนาคาร ธกส' BEFORE 'promptpay';--> statement-breakpoint
ALTER TYPE "public"."bank_providers" ADD VALUE 'ธนาคารออมสิน' BEFORE 'promptpay';--> statement-breakpoint
ALTER TYPE "public"."bank_providers" ADD VALUE 'ธนาคารอิสลาม' BEFORE 'promptpay';--> statement-breakpoint
CREATE TABLE "complaints" (
	"id" serial PRIMARY KEY NOT NULL,
	"reportType" "report_types" NOT NULL,
	"description" text NOT NULL,
	"fileName" text NOT NULL,
	"status" "complain_status" DEFAULT 'in_progress' NOT NULL,
	"userId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "compalins" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "compalins" CASCADE;--> statement-breakpoint
ALTER TABLE "bankAccounts" RENAME TO "bank_accounts";--> statement-breakpoint
ALTER TABLE "bank_accounts" DROP CONSTRAINT "bankAccounts_userId_tenants_id_fk";
--> statement-breakpoint
ALTER TABLE "tenants" DROP CONSTRAINT "tenants_roomId_rooms_id_fk";
--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "apartmentId" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_userId_tenants_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_userId_tenants_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packages" ADD CONSTRAINT "packages_apartmentId_apartments_id_fk" FOREIGN KEY ("apartmentId") REFERENCES "public"."apartments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenants" DROP COLUMN "roomId";