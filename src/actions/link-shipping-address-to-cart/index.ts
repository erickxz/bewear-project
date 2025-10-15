"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const linkShippingAddressToCart = async (shippingAddressId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Buscar o carrinho do usuário
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  // Atualizar o carrinho com o shippingAddressId
  await db
    .update(cartTable)
    .set({ shippingAddressId })
    .where(eq(cartTable.id, cart.id));

  return { success: true };
};
