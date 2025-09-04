// app/product-variant/[slug]/page.tsx
import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Header } from "@/components/ui/common/header";
import Footer from "@/components/ui/common/footer";
import ProductList from "@/components/ui/common/product-list";
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToEUR } from "@/helpers/money";

//import ProductActions from "./components/product-actions";
//import VariantSelector from "./components/variant-selector";

interface ProductVariantPageProps {
  params: { slug: string };
}

const ProductVariantPage = async ({ params }: ProductVariantPageProps) => {
  const { slug } = params;

  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.slug, slug),
    with: {
      product: {
        with: {
          variants: true,
        },
      },
    },
  });

  if (!productVariant) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Header />
        <h1 className="mb-4 text-2xl font-bold">Produto não encontrado</h1>
        <p className="text-muted-foreground">
          Verifique se o link está correto ou volte para a loja.
        </p>
        <Footer />
      </div>
    );
  }

  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, productVariant.product.categoryId),
    with: { variants: true },
  });

  return (
    <>
      <Header />
      <div className="flex flex-col space-y-6 px-5">
        <Image
          src={productVariant.imageUrl}
          alt={productVariant.name}
          sizes="100vw"
          height={0}
          width={0}
          className="h-auto w-full object-cover"
        />

        <div>
          <h2 className="text-lg font-semibold">
            {productVariant.product.name}
          </h2>
          <h3 className="text-muted-foreground text-sm">
            {productVariant.name}
          </h3>
          <h3 className="text-lg font-semibold">
            {formatCentsToEUR(productVariant.priceInCents)}
          </h3>
        </div>

        <div>
          <p className="text-shadow-amber-600">
            {productVariant.product.description}
          </p>
        </div>

        <ProductList title="Talvez você goste" products={likelyProducts} />

        <Footer />
      </div>
    </>
  );
};

export default ProductVariantPage;
