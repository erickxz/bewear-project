import { useMutation } from "@tanstack/react-query";

import { createShippingAddress } from "@/actions/create-shipping-address";

export const CREATE_SHIPPING_ADDRESS_MUTATION_KEY = ["createShippingAddress"] as const;

export const useCreateShippingAddress = () => {
    return useMutation({
        mutationKey: CREATE_SHIPPING_ADDRESS_MUTATION_KEY,
        mutationFn: createShippingAddress,
    });
};
