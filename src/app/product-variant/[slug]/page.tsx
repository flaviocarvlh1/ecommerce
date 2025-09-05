import { eq } from "drizzle-orm";
import Image from "next/image";
import { Header } from "@/components/ui/common/header";
import Footer from "@/components/ui/common/footer";
import ProductList from "@/components/ui/common/product-list";
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToEUR } from "@/helpers/money";
import { Button } from "@/components/ui/button";
import VariantSelector from "./compoments/variant-selector";
import QuantitySelector from "./compoments/quantity-selector";

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
      <div className="flex flex-col space-y-6">
        <Image
          src={productVariant.imageUrl}
          alt={productVariant.name}
          sizes="100vw"
          height={0}
          width={0}
          className="h-auto w-full object-cover"
        />

        <div className="px-5">
          <VariantSelector
            selectedVariantSlug={productVariant.slug}
            variants={productVariant.product.variants}
          />
        </div>

        <div className="px-5">
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
        <div className="px-5">
          <QuantitySelector />
        </div>
        <div className="flex flex-col space-y-4 px-5">
          {/*botoes*/}
          <Button className="rounded-full" size="lg" variant="outline">
            Adicionar a Sacola
          </Button>
          <Button className="rounded-full" size="lg">
            Comprar Agora
          </Button>
        </div>

        <div className="px-5">
          <p className="text-shadow-amber-600">
            {productVariant.product.description}
          </p>
        </div>

        <ProductList title="Talvez você goste" products={likelyProducts} />
      </div>

      <Footer />
    </>
  );
};

export default ProductVariantPage;
