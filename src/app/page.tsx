import { desc } from "drizzle-orm";
import Image from "next/image";

import Brands from "@/components/common/brands";
import CategorySelector from "@/components/common/category-selector";
import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductsList from "@/components/common/products-list";
import { db } from "@/db";
import { productTable } from "@/db/schema";

const Home = async () => {
  

  const products = await db.query.productTable.findMany({with: {variants: true}});
  const newCreatedProducts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: {variants: true}
  });
  const categories = await db.query.categoryTable.findMany();
  console.log(products);
  return (
    <>
    <Header />
    <div className="space-y-6">
      <div className="px-5">
      <Image src="/banner.svg" alt="Leve uma vida com estilo" height={0} width={0} sizes="100vw" className="h-auto w-full" />
      </div>
      
      <Brands />

      <ProductsList title="Mais vendidos" products={products} /> 

      <div className="px-5">
        <CategorySelector categories={categories} />
      </div>
      
      <div className="px-5">
      <Image src="/banner.png" alt="Seja autentico" height={0} width={0} sizes="100vw" className="h-auto w-full" />
      </div>

      <ProductsList title="Novos produtos" products={newCreatedProducts} />
      <Footer />
    </div>
    
    </>
  );
}
 
export default Home;