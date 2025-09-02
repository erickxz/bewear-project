"use client"

// import { AddProductToCartSchema } from "@/actions/add-cart-product/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { addProductToCart } from "@/actions/add-cart-product";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
    productVariantId: string;
    quantity: number;
}

const AddToCartButton = ({ productVariantId, quantity }: AddToCartButtonProps) => {
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationKey: ["addProductToCart", productVariantId, quantity],
        mutationFn: () => addProductToCart({
            productVariantId,
            quantity,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    })
    return ( 
       <Button variant="outline" className="rounded-full" size="lg" disabled={isPending} onClick={() => mutate()}>
       {isPending && <Loader2 className="animate-spin" />}
        Adicionar ao carrinho
        </Button>
     );
}
 
export default AddToCartButton;