CREATE TABLE "waters" (
	"id" serial PRIMARY KEY NOT NULL,
	"paymentPlanId" serial NOT NULL,
	"late" boolean DEFAULT false,
	"paid" boolean DEFAULT false NOT NULL,
	"tenantId" uuid,
	"meter" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "util_bills" RENAME TO "electrics";--> statement-breakpoint
ALTER TABLE "electrics" DROP CONSTRAINT "util_bills_paymentPlanId_payment_plans_id_fk";
--> statement-breakpoint
ALTER TABLE "electrics" ADD COLUMN "meter" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "waters" ADD CONSTRAINT "waters_paymentPlanId_payment_plans_id_fk" FOREIGN KEY ("paymentPlanId") REFERENCES "public"."payment_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waters" ADD CONSTRAINT "waters_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "electrics" ADD CONSTRAINT "electrics_paymentPlanId_payment_plans_id_fk" FOREIGN KEY ("paymentPlanId") REFERENCES "public"."payment_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "electrics" DROP COLUMN "utilType";--> statement-breakpoint
ALTER TABLE "electrics" DROP COLUMN "fee";--> statement-breakpoint
DROP TYPE "public"."util_types";