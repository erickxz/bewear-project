import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { addProductToCart } from "@/actions/add-cart-product";
import { decreaseCartProduct } from "@/actions/decrease-cart-product";
import { removeCartProduct } from "@/actions/remove-cart-product";
import { formatCentsToBRL } from "@/app/helpers/money";

import { Button } from "../ui/button";
  
interface CartItemProps {
  id: string;
  productName: string;
  productVariantId: string;
  productVariantName: string;
  productVariantImageUrl: string;
  productVariantPriceInCents: number;
  quantity: number;
}

const CartItem = ({
  id,
  productName,
  productVariantId,
  productVariantName,
  productVariantImageUrl,
  productVariantPriceInCents,
  quantity,
}: CartItemProps) => {
  const decreaseCartProductMutation = useMutation({
    mutationKey: ["decrease-cart-product", id],
    mutationFn: () => decreaseCartProduct({ cartItemId: id,}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  const addProductToCartMutation = useMutation({
    mutationKey: ["increase-cart-product", id],
    mutationFn: () => addProductToCart({ productVariantId, quantity: 1}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  const queryClient = useQueryClient();
  const removeCartProductMutation = useMutation({
    mutationKey: ["remove-cart-product", id],
    mutationFn: () => removeCartProduct({ cartItemId: id,}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  const handleDeleteClick = () => {
    removeCartProductMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Produto removido do carrinho");
      },
      onError: () => {
        toast.error("Erro ao remover produto do carrinho");
      },
    });
  }
  const handleDecreaseClick = () => {
    decreaseCartProductMutation.mutate(undefined, {
      onSuccess: () => {
        // toast.success("Produto diminuido do carrinho");
      },
    });
  }

  const handleIncreaseClick = () => {
    addProductToCartMutation.mutate(undefined, {
      onSuccess: () => {
        // toast.success("Produto removido do carrinho");
      },
    });
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          src={productVariantImageUrl}
          alt={productVariantName}
          width={78}
          height={78}
          className="rounded-lg "
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{productName}</p>
          <p className="text-muted-foreground text-xs font-medium">
            {productVariantName}
          </p>
          <div className="flex w-[100px] items-center justify-between rounded-lg border p-1">
            <Button className="h-4 w-4" variant="ghost" onClick={handleDecreaseClick}>
              <MinusIcon />
            </Button>
            <p className="text-xs font-medium">{quantity}</p>
            <Button className="h-4 w-4" variant="ghost" onClick={handleIncreaseClick}>
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center gap-2">
        <Button variant="outline" size="icon" onClick={handleDeleteClick}>
          <TrashIcon />
        </Button>
        <p className="text-sm font-bold">
          {formatCentsToBRL(productVariantPriceInCents)}    
        </p>
      </div>
    </div>
  );
};

export default CartItem;