"use server";

import { headers } from "next/headers";
import { db } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

interface GuestCartItem {
  productVariantId: string;
  quantity: number;
}

export const migrateGuestCart = async (guestItems: GuestCartItem[]) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  let cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
  });

  if (!cart) {
    const [newCart] = await db
      .insert(cartTable)
      .values({
        userId: session.user.id,
      })
      .returning();
    cart = newCart;
  }

  for (const guestItem of guestItems) {
    const existingItem = await db.query.cartItemTable.findFirst({
      where: (item, { eq, and }) =>
        and(
          eq(item.cartId, cart.id),
          eq(item.productVariantId, guestItem.productVariantId),
        ),
    });

    if (existingItem) {
      await db
        .update(cartItemTable)
        .set({
          quantity: existingItem.quantity + guestItem.quantity,
        })
        .where(eq(cartItemTable.id, existingItem.id));
    } else {
      await db.insert(cartItemTable).values({
        cartId: cart.id,
        productVariantId: guestItem.productVariantId,
        quantity: guestItem.quantity,
      });
    }
  }
};
