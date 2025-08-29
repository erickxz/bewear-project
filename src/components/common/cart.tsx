import { ShoppingCartIcon } from "lucide-react";

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"


export const Cart = () => {
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
        </SheetContent>
       </Sheet>
    );
}