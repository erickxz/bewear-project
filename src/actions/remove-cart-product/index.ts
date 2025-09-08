"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { cartItemTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { removeCartProductSchema } from "./schema";

export const removeCartProduct = async (data: z.infer<typeof removeCartProductSchema>) => {
  removeCartProductSchema.parse(data);
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) =>
      eq(cartItem.id, data.cartItemId),
    with: {
      cart: true,
    },
  });
  const cartDoesNotBelongToUser = cartItem?.cart.userId !== session.user.id;
  if (cartDoesNotBelongToUser) {
    throw new Error("Unauthorized");
  }
  if (!cartItem) {
    throw new Error("Cart item not found");
  }
  await db.delete(cartItemTable).where(eq(cartItemTable.id, cartItem.id));
};