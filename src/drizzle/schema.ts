import { relations } from "drizzle-orm"
import {
    boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
  unique,
} from "drizzle-orm/pg-core"

export const userRoles = ["admin", "user"] as const
export const businessTypes = ["personal", "business"] as const
export const bankProviders = [
  "ธนาคารกรุงเทพ",
  "ธนาคารกสิกรไทย", 
  "ธนาคารกรุงไทย",
  "ธนาคารกรุงศรี",
  "ธนาคารไทยพาณิชย์",
  "ธนาคาร ธกส",
  "ธนาคารออมสิน",
  "ธนาคารอิสลาม",
  "promptpay"
] as const
export const reportTypes = ["repair", "clean", "move", "emergency", "other"] as const
export type BusinessType = (typeof businessTypes)[number]
export type UserRole = (typeof userRoles)[number]
export type BankProvider = (typeof bankProviders)[number]
export type ReportType = (typeof reportTypes)[number]
export const userRoleEnum = pgEnum("user_roles", userRoles)
export const businessTypeEnum = pgEnum("business_types", businessTypes)
export const bankProviderEnum = pgEnum("bank_providers", bankProviders)
export const reportEnum =pgEnum("report_types", reportTypes)
export const roomStatusEnum = pgEnum("room_status", ["vacant", "occupied", "under_maintenance"]);

export const complainStatusTypes = ["in_progress", "waiting_for_inventory", "complete"] as const
export type ComplainStatusType = (typeof complainStatusTypes)[number]
export const complainStatusEnum = pgEnum("complain_status", complainStatusTypes)

export const UserTable = pgTable("tenants", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text(),
  role: userRoleEnum().notNull().default("user"),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const ApartmentTable = pgTable("apartments", {
  id: serial("id").primaryKey(),
  name: text().notNull(),
  address: text().notNull(),
  businessType: businessTypeEnum().notNull().default("personal"),
  phone: text().notNull(),
  billDate: timestamp({ withTimezone: true }).notNull(),
  paymentDate: timestamp({ withTimezone: true }).notNull(),
  email: text(),
  userId: uuid()
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const FloorTable = pgTable("floors", {
  id: serial("id").primaryKey(),
  floor: integer().default(1),
  apartmentId: serial()
    .notNull()
    .references(() => ApartmentTable.id, { onDelete: "cascade" }),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const RoomTable = pgTable("rooms", {
  id: serial("id").primaryKey(),
  roomNumber: text().notNull(),
  floorId: serial()
    .notNull()
    .references(() => FloorTable.id, { onDelete: "cascade" }),
  status: roomStatusEnum().notNull().default("vacant"),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const PaymentPlanTable = pgTable("payment_plans", {
  id: serial("id").primaryKey(),
  lateFee: integer().notNull().default(0),
  fee: integer().notNull(),
  waterFeePerMatrix: integer().notNull().default(0),
  electricFeePerMatrix: integer().notNull().default(0),
  roomId: serial()
    .notNull()
    .references(() => RoomTable.id, { onDelete: "cascade" }),
  userId: uuid()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const RentTable = pgTable("rents", {
  id: serial("id").primaryKey(),
  paymentPlanId: serial()
    .notNull()
    .references(() => PaymentPlanTable.id, { onDelete: "cascade" }),
  late: boolean().default(false),
  paid: boolean().notNull().default(false),
  fee: integer().notNull(),
  userId: uuid()
    .references(() => UserTable.id),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const ElectricTable = pgTable("electrics", {
  id: serial("id").primaryKey(),
  paymentPlanId: serial()
    .notNull()
    .references(() => PaymentPlanTable.id, { onDelete: "cascade" }),
  late: boolean().default(false),
  paid: boolean().notNull().default(false),
  meter: integer().notNull(),
  fee: integer().notNull().default(0),
  userId: uuid()
    .references(() => UserTable.id),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const WaterTable = pgTable("waters", {
  id: serial("id").primaryKey(),
  paymentPlanId: serial()
    .notNull()
    .references(() => PaymentPlanTable.id, { onDelete: "cascade" }),
  late: boolean().default(false),
  paid: boolean().notNull().default(false),
  userId: uuid()
    .references(() => UserTable.id),
  meter: integer().notNull(),
  fee: integer().notNull().default(0),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const BankAccountTable = pgTable("bank_accounts", {
  id: serial("id").primaryKey(),
  name: text().notNull(),
  bankNumber: text().notNull(),
  bankProvider: bankProviderEnum().notNull(),
  userId: uuid()
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const BankAccountApartmentTable = pgTable("bank_account_apartments", {
  id: serial("id").primaryKey(),
  bankAccountId: serial()
    .notNull()
    .references(() => BankAccountTable.id, { onDelete: "cascade" }),
  apartmentId: serial()
    .notNull()
    .references(() => ApartmentTable.id, { onDelete: "cascade" }),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}, t => ({
  uniqueBankApartment: unique().on(t.bankAccountId, t.apartmentId),
}))

export const PackageTable = pgTable("packages", {
  id: serial("id").primaryKey(),
  code: text().notNull(),
  complete: boolean().notNull().default(false),
  userId: uuid()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  ownerName: text().notNull(),
  apartmentId: serial()
    .notNull()
    .references(() => ApartmentTable.id, { onDelete: "cascade" }),
  roomNumber: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const ComplainTable = pgTable("complaints", {
  id: serial("id").primaryKey(),
  reportType: reportEnum().notNull(),
  description: text().notNull(),
  fileName: text().notNull(),
  status: complainStatusEnum().notNull().default("in_progress"),
  userId: uuid()
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const ReceiptTable = pgTable("receipts", {
  id: serial("id").primaryKey(),
  fileName: text().notNull(),
  originalName: text().notNull(),
  filePath: text().notNull(),
  fileSize: integer().notNull(),
  mimeType: text().notNull(),
  paymentPlanId: serial()
    .notNull()
    .references(() => PaymentPlanTable.id, { onDelete: "cascade" }),
  userId: uuid()
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  amount: integer().notNull(),
  status: text().notNull().default("pending"), // pending, approved, rejected
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const userRelations = relations(UserTable, ({ one, many }) => ({
  oAuthAccounts: many(UserOAuthAccountTable),
  apartments: many(ApartmentTable),
  bankAccounts: many(BankAccountTable),
  packages: many(PackageTable),
  complains: many(ComplainTable),
  receipts: many(ReceiptTable),
}))

export const oAuthProviders = ["discord", "github", "google"] as const
export type OAuthProvider = (typeof oAuthProviders)[number]
export const oAuthProviderEnum = pgEnum("oauth_provides", oAuthProviders)

export const UserOAuthAccountTable = pgTable(
  "user_oauth_accounts",
  {
    userId: uuid()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    provider: oAuthProviderEnum().notNull(),
    providerAccountId: text().notNull().unique(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  t => [primaryKey({ columns: [t.providerAccountId, t.provider] })]
)

export const userOauthAccountRelationships = relations(
  UserOAuthAccountTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [UserOAuthAccountTable.userId],
      references: [UserTable.id],
    }),
  })
)

export const bankAccountRelationships = relations(
  BankAccountTable,
  ({ one, many }) => ({
    user: one(UserTable, {
      fields: [BankAccountTable.userId],
      references: [UserTable.id],
    }),
    apartmentAssociations: many(BankAccountApartmentTable),
  })
)

export const apartmentRelationships = relations(
  ApartmentTable,
  ({ one, many }) => ({
    user: one(UserTable, {
      fields: [ApartmentTable.userId],
      references: [UserTable.id],
    }),
    bankAccountAssociations: many(BankAccountApartmentTable),
  })
)

export const bankAccountApartmentRelationships = relations(
  BankAccountApartmentTable,
  ({ one }) => ({
    bankAccount: one(BankAccountTable, {
      fields: [BankAccountApartmentTable.bankAccountId],
      references: [BankAccountTable.id],
    }),
    apartment: one(ApartmentTable, {
      fields: [BankAccountApartmentTable.apartmentId],
      references: [ApartmentTable.id],
    }),
  })
)

export const packageRelationships = relations(
  PackageTable,
  ({ one }) => ({
    tenant: one(UserTable, {
      fields: [PackageTable.userId],
      references: [UserTable.id],
    }),
  })
)

export const electricRelationships = relations(
  ElectricTable,
  ({ one }) => ({
    paymentPlan: one(PaymentPlanTable, {
      fields: [ElectricTable.paymentPlanId],
      references: [PaymentPlanTable.id]
    })
  })
)

export const waterRelationships = relations(
  WaterTable,
  ({ one }) => ({
    paymentPlan: one(PaymentPlanTable, {
      fields: [WaterTable.paymentPlanId],
      references: [PaymentPlanTable.id]
    })
  })
)

export const rentRelationships = relations(
  RentTable,
  ({ one }) => ({
    paymentPlan: one(PaymentPlanTable, {
      fields: [RentTable.paymentPlanId],
      references: [PaymentPlanTable.id]
    })
  })
)

export const floorRelationships = relations(
  FloorTable,
  ({ one, many }) => {
    return {
      rooms: many(RoomTable),
      apartment: one(ApartmentTable, {
        fields: [FloorTable.apartmentId],
        references: [ApartmentTable.id],
      }),
  }}
)

export const roomRelationships = relations(
  RoomTable,
  ({ one, many }) => {
    return {
    floor: one(FloorTable, {
      fields: [RoomTable.floorId],
      references: [FloorTable.id],
    }),
      paymentPlan: one(PaymentPlanTable),
  }}
)

export const complainRelationships = relations(
  ComplainTable,
  ({ one }) => ({
    tenant: one(UserTable, {
      fields: [ComplainTable.userId],
      references: [UserTable.id],
    })
  })
)

export const paymentPlanRelationships = relations(
  PaymentPlanTable,
  ({ one, many }) => ({
    room: one(RoomTable, {
      fields: [PaymentPlanTable.roomId],
      references: [RoomTable.id],
    }),
    tenant: one(UserTable, {
      fields: [PaymentPlanTable.userId],
      references: [UserTable.id],
    }),
    electrics: many(ElectricTable),
    waters: many(WaterTable),
    rentBills: many(RentTable),
    receipts: many(ReceiptTable)
  })
)

export const receiptRelationships = relations(
  ReceiptTable,
  ({ one }) => ({
    tenant: one(UserTable, {
      fields: [ReceiptTable.userId],
      references: [UserTable.id],
    }),
    paymentPlan: one(PaymentPlanTable, {
      fields: [ReceiptTable.paymentPlanId],
      references: [PaymentPlanTable.id],
    })
  })
)
