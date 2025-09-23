import { desc } from "drizzle-orm";
import Image from "next/image";

import Footer from "@/components/ui/common/footer";
import { Header } from "@/components/ui/common/header";
import ProductList from "@/components/ui/common/product-list";
import { db } from "@/db";
import { productTable } from "@/db/schema";
import CategorySelector from "@/components/ui/common/category-selector";
import { PartnersList } from "@/components/ui/common/partners-list";

const Home = async () => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });

  const newlyCreatedProducts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: {
      variants: true,
    },
  });

  const categories = await db.query.categoryTable.findMany({});

  return (
    <>
      <div className="space-y-6">
        <div className="px-5 lg:px-0">
          <Image
            src="/banner01.png"
            alt="Leve uma vida com estilo"
            height={0}
            width={0}
            sizes="100vw"
            className="h-auto w-full rounded-xl lg:-mr-10 lg:-ml-10 lg:h-[700px] lg:w-[200%] lg:object-contain"
          />
        </div>

        <div className="space-y-10">
          <PartnersList />
        </div>

        <ProductList products={products} title="Mais vendidos" />

        <div className="px-5">
          <CategorySelector categories={categories} />
        </div>

        <div className="px-5 lg:px-0">
          <Image
            src="/banner02.png"
            alt="Leve uma vida com estilo"
            height={0}
            width={0}
            sizes="100vw"
            className="h-auto w-full rounded-xl lg:-mr-10 lg:-ml-10 lg:h-[700px] lg:w-[200%] lg:object-contain"
          />
        </div>

        <ProductList products={newlyCreatedProducts} title="Novos produtos" />

        <Footer />
      </div>
    </>
  );
};

export default Home;
