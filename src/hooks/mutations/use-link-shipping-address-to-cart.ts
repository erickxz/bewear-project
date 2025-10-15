import { useMutation, useQueryClient } from "@tanstack/react-query";

import { linkShippingAddressToCart } from "@/actions/link-shipping-address-to-cart";

import { CART_QUERY_KEY } from "../queries/use-cart";

export const LINK_SHIPPING_ADDRESS_TO_CART_MUTATION_KEY = ["linkShippingAddressToCart"] as const;

export const useLinkShippingAddressToCart = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: LINK_SHIPPING_ADDRESS_TO_CART_MUTATION_KEY,
        mutationFn: linkShippingAddressToCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
        },
    });
};
