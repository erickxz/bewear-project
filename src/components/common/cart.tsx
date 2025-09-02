import { useQuery } from "@tanstack/react-query";
import { ShoppingCartIcon } from "lucide-react";
import Image from "next/image";

import { getCart } from "@/actions/get-cart";

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"


export const Cart = () => {
    const { data: cart, isPending: isLoading } = useQuery({
        queryKey: ["cart"],
        queryFn: () => getCart(),
    })
    return (
       <Sheet>
        <SheetTrigger asChild>
            <Button variant="outline">
                <ShoppingCartIcon className="w-4 h-4" />
            </Button>
        </SheetTrigger>
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Carrinho</SheetTitle>
            </SheetHeader>
            <div>
                {isLoading && <div>Carregando...</div>}
                {cart?.items.length === 0 && <div>Carrinho vazio</div>}
                {cart?.items.map((item) => (
                    <div key={item.id}>
                        <Image src={item.productVariant.imageUrl} alt={item.productVariant.name} width={0} height={0} sizes="100vw" className="h-auto w-full rounded-3xl px-2" />
                    </div>
                ))}
            </div>
        </SheetContent>
       </Sheet>
    );
}