"use client";

import Image from "next/image";
import Link from "next/link";

import { formatCentsToBRL } from "@/app/helpers/money";
import { productTable, productVariantTable } from "@/db/schema";

interface ProductItemProps {
    product: (typeof productTable.$inferSelect & {
        variants: (typeof productVariantTable.$inferSelect)[]
    });
}

const ProductItem =  ({ product }: ProductItemProps) => {
    const firstVariant = product.variants[0];
    return (
        <Link href="/" className="flex flex-col gap-4 w-full">
        <Image src={firstVariant.imageUrl} alt={firstVariant.name} width={200} height={200} sizes="100vw" className="rounded-3xl"
        />
        <div className="flex flex-col gap-1 max-w-[200px]">
            <p className="truncate text-sm font-medium">{product.name}</p>
            <p className="truncate text-xs font-muted-foreground font-medium">{product.description}</p>
            <p className="truncate text-lg font-semibold">{formatCentsToBRL(product.variants[0].priceInCents)}</p>
        </div>
        </Link>
    );
}
 
export default ProductItem;