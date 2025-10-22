import Image from "next/image";

import { formatCentsToBRL } from "@/app/helpers/money";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
    subTotalInCents: number;
    totalInCents: number;
    products: {
        id: string;
        name: string;
        variantName: string;
        imageUrl: string;
        priceInCents: number;
        quantity: number;
    }[];
}

const CartSummary = ({ subTotalInCents, totalInCents, products }: CartSummaryProps) => {
    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle className="text-m font-bold">Seu Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex justify-between">
                    <p className="text-sm font-medium">Subtotal</p>
                    <p className="text-sm text-muted-foreground font-medium">{formatCentsToBRL(subTotalInCents)}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-sm font-medium">Frete</p>
                    <p className="text-sm font-medium text-green-500">GRÁTIS</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-sm font-medium">Total</p>
                    <p className="text-sm text-muted-foreground font-medium">{formatCentsToBRL(totalInCents)}</p>
                </div>
                <Separator className="my-8" />
                
                {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={96}
          height={96}
          className="rounded-lg "
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{product.name}</p>
          <p className="text-muted-foreground text-xs font-medium">
            {product.variantName}
          </p>
          <p className="text-muted-foreground text-sm font-medium">x{product.quantity}</p>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center gap-2">
        <p className="text-sm font-bold">
          {formatCentsToBRL(product.priceInCents)}    
        </p>
      </div>
    </div>
                ))}
            </CardContent>
        </Card>
        </>

    );
}
 
export default CartSummary;