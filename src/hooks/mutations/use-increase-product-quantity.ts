import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addProductToCart } from "@/actions/add-cart-product";

import { CART_QUERY_KEY } from "../queries/use-cart";

export const ADD_PRODUCT_TO_CART_MUTATION_KEY = (cartItemId: string) => ["addProductToCart", cartItemId] as const;

export const useAddProductToCart = (cartItemId: string, productVariantId: string, quantity: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ADD_PRODUCT_TO_CART_MUTATION_KEY(cartItemId),
    mutationFn: () => addProductToCart({ productVariantId, quantity }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
        },
    });
}

    