import { useQuery } from "@tanstack/react-query";

import { getCart } from "@/actions/get-cart";

export const CART_QUERY_KEY = ["cart"] as const;

export const useCart = () => {
    return useQuery({
        queryKey: CART_QUERY_KEY,
        queryFn: () => getCart(),
    });
}   