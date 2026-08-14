import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

/**
 * Membership database schema. Content (recipes, lessons, posts) stays in the
 * repo as files; this database holds only member state.
 */

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  stripeCustomerId: text("stripe_customer_id").unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const sessions = pgTable(
  "sessions",
  {
    /** Random 256-bit token, stored hashed-equivalent by being unguessable. */
    id: text("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)]
);

/** Membership tiers, in ascending order of access. */
export const TIERS = ["kitchen", "community", "chefs_table"] as const;
export type Tier = (typeof TIERS)[number];

export const memberships = pgTable("memberships", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  tier: text("tier").$type<Tier>().notNull(),
  /** Stripe subscription status: active, trialing, past_due, canceled, ... */
  status: text("status").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  /** Access runs through the end of the paid period even after cancellation. */
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** One row per member question to Sous, used for daily message caps. */
export const sousMessages = pgTable(
  "sous_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("sous_messages_user_idx").on(t.userId, t.createdAt)]
);

/** Saved grocery combos from the Tier 1 combo builder. */
export const savedLists = pgTable(
  "saved_lists",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    /** Canonical ingredient tags the member selected. */
    ingredients: jsonb("ingredients").$type<string[]>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("saved_lists_user_idx").on(t.userId)]
);
