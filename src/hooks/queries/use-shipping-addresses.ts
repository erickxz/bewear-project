import { useQuery } from "@tanstack/react-query";

import { getShippingAddresses } from "@/actions/get-shipping-addresses";
import { shippingAddressTable } from "@/db/schema";

export const SHIPPING_ADDRESSES_QUERY_KEY = ["shippingAddresses"] as const;

export const useShippingAddresses = (params: {initialData: typeof shippingAddressTable.$inferSelect[]}) => {
    return useQuery({
        queryKey: SHIPPING_ADDRESSES_QUERY_KEY,
        queryFn: getShippingAddresses,
        initialData: params?.initialData,
    });
};
