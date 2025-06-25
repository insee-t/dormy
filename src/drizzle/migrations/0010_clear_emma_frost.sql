CREATE TABLE "receipts" (
	"id" serial PRIMARY KEY NOT NULL,
	"fileName" text NOT NULL,
	"originalName" text NOT NULL,
	"filePath" text NOT NULL,
	"fileSize" integer NOT NULL,
	"mimeType" text NOT NULL,
	"paymentPlanId" serial NOT NULL,
	"userId" uuid NOT NULL,
	"amount" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_paymentPlanId_payment_plans_id_fk" FOREIGN KEY ("paymentPlanId") REFERENCES "public"."payment_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_userId_tenants_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;