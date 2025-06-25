CREATE TABLE "floors" (
	"id" serial PRIMARY KEY NOT NULL,
	"floor" integer DEFAULT 1,
	"apartmentId" serial NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_apartmentId_apartments_id_fk";
--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "floorId" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "floors" ADD CONSTRAINT "floors_apartmentId_apartments_id_fk" FOREIGN KEY ("apartmentId") REFERENCES "public"."apartments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_floorId_floors_id_fk" FOREIGN KEY ("floorId") REFERENCES "public"."floors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rooms" DROP COLUMN "floor";--> statement-breakpoint
ALTER TABLE "rooms" DROP COLUMN "apartmentId";