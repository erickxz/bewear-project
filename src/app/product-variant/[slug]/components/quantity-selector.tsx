"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";   

import { Button } from "@/components/ui/button";

const QuantitySelector   = () => {

    const handleDecrement = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }

    const handleIncrement = () => {
        setQuantity((prev) => prev + 1);
    }

    const [quantity, setQuantity] = useState(1);
    return ( 
        <div className="space-y-4">
            <h3 className="font-medium">Quantidade</h3>
            <div className="flex items-center border justify-between rounded-lg w-[100px]">
                <Button size="icon" variant="ghost" className="w-10 h-10" onClick={handleDecrement}>
                    <MinusIcon className="w-4 h-4" />
                </Button>
                <p>{quantity}</p>
                <Button size="icon" variant="ghost" className="w-10 h-10" onClick={handleIncrement}>
                    <PlusIcon className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
 
export default QuantitySelector;