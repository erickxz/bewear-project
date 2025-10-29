import { useMutation, useQueryClient } from "@tanstack/react-query";

import { finishOrder } from "@/actions/finish-order";

import { CART_QUERY_KEY } from "../queries/use-cart";

export const FINISH_ORDER_MUTATION_KEY = ["finishOrder"] as const;

export const useFinishOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: FINISH_ORDER_MUTATION_KEY,
        mutationFn: async () => {
            return await finishOrder();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
        },
    });
}