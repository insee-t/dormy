import { db } from "@/drizzle/db";
import { ApartmentTable, UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export default async function getApartments(user: string) {
  "use server";
  return db.select({
    id: ApartmentTable.id,
    name: ApartmentTable.name,
    address: ApartmentTable.address
  })
    .from(UserTable)
    .where(eq(UserTable.id, user))
    .leftJoin(ApartmentTable, eq(UserTable.id, ApartmentTable.userId));
} 