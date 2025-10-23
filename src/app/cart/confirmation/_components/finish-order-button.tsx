"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// import { finishOrder } from "@/actions/finish-order";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,DialogTrigger } from "@/components/ui/dialog";
import { useFinishOrder } from "@/hooks/mutations/use-finish-order";

export const FinishOrderButton = () => {    

    const [successDialogIsOpen, setSuccessDialogIsOpen] = useState(true);
    const { mutate, isPending } = useFinishOrder();
    return (
        <>
        <Button className="w-full md:w-auto rounded-full" disabled={isPending} onClick={() => mutate()}>
            {isPending && <Loader2 className="animate-spin" />}
            <Link href="/cart/pagamento">Finalizar compra</Link>
        </Button>

        <Dialog open={successDialogIsOpen} onOpenChange={setSuccessDialogIsOpen}>
            <DialogContent className="text-center">
                <Image src="/illustration (1).svg" alt="Success" width={250} height={250} className="mx-auto" />
                <DialogTitle className="text-center text-2xl font-bold mt-4">Pedido Efetuado!</DialogTitle>
                <DialogDescription className="font-medium text-center text-sm text-gray-500">Seu pedido foi efetuado com sucesso. Você pode acompanhar o status na seção de “Meus Pedidos”.</DialogDescription>
                <Button className="w-full md:w-auto rounded-full mt-2" size="lg" onClick={() => setSuccessDialogIsOpen(false)}>
                    Ver meus pedidos
                </Button>
                <Button className="w-full md:w-auto rounded-full" variant="outline" size="lg" onClick={() => setSuccessDialogIsOpen(false)}>
                    Voltar para a loja
                </Button>
            </DialogContent>
        </Dialog>
        </>
    );
}