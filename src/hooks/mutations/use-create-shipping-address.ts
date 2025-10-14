import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createShippingAddress } from "@/actions/create-shipping-address";

import { SHIPPING_ADDRESSES_QUERY_KEY } from "../queries/use-shipping-addresses";

export const CREATE_SHIPPING_ADDRESS_MUTATION_KEY = ["createShippingAddress"] as const;

export const useCreateShippingAddress = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: CREATE_SHIPPING_ADDRESS_MUTATION_KEY,
        mutationFn: createShippingAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SHIPPING_ADDRESSES_QUERY_KEY });
        },
    });
};
