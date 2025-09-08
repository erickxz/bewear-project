import { useMutation, useQueryClient } from "@tanstack/react-query";

import { decreaseCartProduct } from "@/actions/decrease-cart-product";

import { CART_QUERY_KEY } from "../queries/use-cart";

export const DECREASE_PRODUCT_QUANTITY_MUTATION_KEY = (cartItemId: string) => ["decrease-cart-product", cartItemId] as const;

export const useDecreaseProductQuantity = (cartItemId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
    mutationKey: DECREASE_PRODUCT_QUANTITY_MUTATION_KEY(cartItemId),
    mutationFn: () => decreaseCartProduct({ cartItemId,}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}