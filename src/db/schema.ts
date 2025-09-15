import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  uuid,
  integer,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const userRelations = relations(userTable, ({ many, one }) => ({
  shippingAddresses: many(shippingAddressTable),
  cart: one(cartTable, {
    fields: [userTable.id],
    references: [cartTable.userId],
  }),
}));

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export const accountTable = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verificationTable = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const categoryTable = pgTable("category", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categoryRelations = relations(categoryTable, (params) => {
  return {
    produtcs: params.many(productTable),
  };
});

export const productTable = pgTable("product", {
  id: uuid().primaryKey().defaultRandom(),
  categoryId: uuid()
    .notNull()
    .references(() => categoryTable.id, { onDelete: "set null" }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productRelations = relations(productTable, ({ one, many }) => {
  return {
    category: one(categoryTable, {
      fields: [productTable.categoryId],
      references: [categoryTable.id],
    }),

    variants: many(productVariantTable),
  };
});

export const productVariantTable = pgTable("product_variant", {
  id: uuid().primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => productTable.id, { onDelete: "cascade" }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  color: text().notNull(),
  priceInCents: integer("prince_in_cents").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productVariantRelations = relations(
  productVariantTable,
  ({ one }) => {
    return {
      product: one(productTable, {
        fields: [productVariantTable.productId],
        references: [productTable.id],
      }),
    };
  },
);

export const shippingAddressTable = pgTable("shipping_address", {
  id: uuid().primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  recipientName: text("recipient_name").notNull(),
  street: text("street").notNull(),
  number: text("number").notNull(),
  complement: text("complement"),
  city: text("city").notNull(),
  provincia: text("provincia").notNull(),
  codigoPostal: text("codigo_postal").notNull(),
  country: text("country").notNull(),
  telemovel: text("telemovel").notNull(),
  email: text("email").notNull(),
  nif: text("nif").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const shippingAddressRelations = relations(
  shippingAddressTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [shippingAddressTable.userId],
      references: [userTable.id],
    }),
  }),
);

export const cartTable = pgTable("cart", {
  id: uuid().primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  shippingAddressId: uuid("shipping_address_id").references(
    () => shippingAddressTable.id,
    { onDelete: "set null" },
  ),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const cartRelations = relations(cartTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [cartTable.userId],
    references: [userTable.id],
  }),
  shippingAddress: one(shippingAddressTable, {
    fields: [cartTable.shippingAddressId],
    references: [shippingAddressTable.id],
  }),
  items: many(cartItemTable),
}));

export const cartItemTable = pgTable("cart_item", {
  id: uuid().primaryKey().defaultRandom(),
  cartId: uuid("cart_id")
    .notNull()
    .references(() => cartTable.id, { onDelete: "cascade" }),
  productVariantId: uuid("product_variant_id")
    .notNull()
    .references(() => productVariantTable.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const cartItemRelations = relations(cartItemTable, ({ one }) => ({
  cart: one(cartTable, {
    fields: [cartItemTable.cartId],
    references: [cartTable.id],
  }),
  productVariant: one(productVariantTable, {
    fields: [cartItemTable.productVariantId],
    references: [productVariantTable.id],
  }),
}));

export const orderStatus = pgEnum("order_status", [
  "pending",
  "paid",
  "canceled",
]);

export const orderTable = pgTable("order", {
  id: uuid().primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  shippingAddressId: uuid("shipping_address_id")
    .notNull()
    .references(() => shippingAddressTable.id, { onDelete: "set null" }),

  recipientName: text().notNull(),
  street: text().notNull(),
  number: text().notNull(),
  complement: text(),
  city: text().notNull(),
  provincia: text().notNull(),
  codigoPostal: text().notNull(),
  country: text().notNull().default("Portugal"),
  telemovel: text().notNull(),
  email: text().notNull(),
  nif: text().notNull(),

  totalPriceInCents: integer("total_price_in_cents").notNull(),
  status: orderStatus().notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderRelations = relations(orderTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [orderTable.userId],
    references: [userTable.id],
  }),
  shippingAddress: one(shippingAddressTable, {
    fields: [orderTable.shippingAddressId],
    references: [shippingAddressTable.id],
  }),
  items: many(orderItemTable),
}));

export const orderItemTable = pgTable("order_item", {
  id: uuid().primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orderTable.id, { onDelete: "cascade" }),
  productVariantId: uuid("product_variant_id")
    .notNull()
    .references(() => productVariantTable.id, { onDelete: "restrict" }),
  quantity: integer("quantity").notNull(),
  priceInCents: integer("price_in_cents").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItemRelations = relations(orderItemTable, ({ one }) => ({
  order: one(orderTable, {
    fields: [orderItemTable.orderId],
    references: [orderTable.id],
  }),
  productVariant: one(productVariantTable, {
    fields: [orderItemTable.productVariantId],
    references: [productVariantTable.id],
  }),
}));
