"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import {
  createShippingAddressSchema,
  CreateShippingAddressSchema,
} from "./schema";

export const createShippingAddress = async (
  data: CreateShippingAddressSchema,
) => {
  createShippingAddressSchema.parse(data);

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const [shippingAddress] = await db
    .insert(shippingAddressTable)
    .values({
      userId: session.user.id,
      recipientName: data.recipientName,
      street: data.street,
      number: data.number,
      complement: data.complement || null,
      city: data.city,
      provincia: data.provincia,
      codigoPostal: data.codigoPostal,
      country: data.country || "Portugal",
      telemovel: data.telemovel,
      email: data.email,
      nif: data.nif,
    })
    .returning();

  revalidatePath("/cart/identification");
  return shippingAddress;
};
