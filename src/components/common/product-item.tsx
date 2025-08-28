"use client";

import Image from "next/image";
import Link from "next/link";

import { formatCentsToBRL } from "@/app/helpers/money";
import { productTable, productVariantTable } from "@/db/schema";
import { cn } from "@/lib/utils";

interface ProductItemProps {
    product: (typeof productTable.$inferSelect & {
        variants: (typeof productVariantTable.$inferSelect)[]
    });
    textContainerClassName?: string;
}

const ProductItem =  ({ product, textContainerClassName }: ProductItemProps) => {
    const firstVariant = product.variants[0];
    return (
        <Link href={`/product-variant/${firstVariant.slug}`} className="flex flex-col gap-4 w-full">
        <Image src={firstVariant.imageUrl} alt={firstVariant.name} width={0} height={0} sizes="100vw" className="h-auto w-full rounded-3xl"
        />
        <div className={cn("flex flex-col gap-1 max-w-[200px]", textContainerClassName)}>
            <p className="truncate text-sm font-medium">{product.name}</p>
            <p className="truncate text-xs text-muted-foreground font-medium">{product.description}</p>
            <p className="text-lg font-semibold">{formatCentsToBRL(product.variants[0].priceInCents)}</p>
        </div>
        </Link>
    );
}
 
export default ProductItem;