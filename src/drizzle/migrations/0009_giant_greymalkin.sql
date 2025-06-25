CREATE TABLE "bank_account_apartments" (
	"id" serial PRIMARY KEY NOT NULL,
	"bankAccountId" serial NOT NULL,
	"apartmentId" serial NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bank_account_apartments_bankAccountId_apartmentId_unique" UNIQUE("bankAccountId","apartmentId")
);
--> statement-breakpoint
ALTER TABLE "bank_accounts" ALTER COLUMN "bankProvider" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."bank_providers";--> statement-breakpoint
CREATE TYPE "public"."bank_providers" AS ENUM('ธนาคารกรุงเทพ', 'ธนาคารกสิกรไทย', 'ธนาคารกรุงไทย', 'ธนาคารกรุงศรี', 'ธนาคารไทยพาณิชย์', 'ธนาคาร ธกส', 'ธนาคารออมสิน', 'ธนาคารอิสลาม', 'promptpay');--> statement-breakpoint
ALTER TABLE "bank_accounts" ALTER COLUMN "bankProvider" SET DATA TYPE "public"."bank_providers" USING "bankProvider"::"public"."bank_providers";--> statement-breakpoint
ALTER TABLE "bank_account_apartments" ADD CONSTRAINT "bank_account_apartments_bankAccountId_bank_accounts_id_fk" FOREIGN KEY ("bankAccountId") REFERENCES "public"."bank_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_account_apartments" ADD CONSTRAINT "bank_account_apartments_apartmentId_apartments_id_fk" FOREIGN KEY ("apartmentId") REFERENCES "public"."apartments"("id") ON DELETE cascade ON UPDATE no action;