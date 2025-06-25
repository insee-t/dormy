ALTER TABLE "leases" RENAME TO "payment_plans";--> statement-breakpoint
ALTER TABLE "rents" RENAME COLUMN "leaseId" TO "paymentPlanId";--> statement-breakpoint
ALTER TABLE "util_bills" RENAME COLUMN "leaseId" TO "paymentPlanId";--> statement-breakpoint
ALTER TABLE "payment_plans" DROP CONSTRAINT "leases_tenantId_tenants_id_fk";
--> statement-breakpoint
ALTER TABLE "payment_plans" DROP CONSTRAINT "leases_roomId_rooms_id_fk";
--> statement-breakpoint
ALTER TABLE "rents" DROP CONSTRAINT "rents_leaseId_leases_id_fk";
--> statement-breakpoint
ALTER TABLE "util_bills" DROP CONSTRAINT "util_bills_leaseId_leases_id_fk";
--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "roomId" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "payment_plans" ADD CONSTRAINT "payment_plans_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rents" ADD CONSTRAINT "rents_paymentPlanId_payment_plans_id_fk" FOREIGN KEY ("paymentPlanId") REFERENCES "public"."payment_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_roomId_rooms_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "util_bills" ADD CONSTRAINT "util_bills_paymentPlanId_payment_plans_id_fk" FOREIGN KEY ("paymentPlanId") REFERENCES "public"."payment_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_plans" DROP COLUMN "roomId";