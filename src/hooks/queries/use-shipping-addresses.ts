import { useQuery } from "@tanstack/react-query";

import { getShippingAddresses } from "@/actions/get-shipping-addresses";

export const SHIPPING_ADDRESSES_QUERY_KEY = ["shippingAddresses"] as const;

export const useShippingAddresses = () => {
    return useQuery({
        queryKey: SHIPPING_ADDRESSES_QUERY_KEY,
        queryFn: getShippingAddresses,
    });
};
