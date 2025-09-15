import Footer from "@/components/ui/common/footer";
import { Header } from "@/components/ui/common/header";
import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CartSummary from "../components/cart-summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAddress } from "../helpers/address";
import { Button } from "@/components/ui/button";

const ConfirmationPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/");
  }

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      shippingAddress: true, // ✅ inclui o endereço
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    redirect("/");
  }

  const shippingAddresses = await db
    .select()
    .from(shippingAddressTable)
    .where(eq(shippingAddressTable.userId, session.user.id));

  const defaultShippingAddressId =
    cart.shippingAddressId &&
    shippingAddresses.some((addr) => addr.id === cart.shippingAddressId)
      ? cart.shippingAddressId
      : null;

  const cartTotalInCents = cart.items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0,
  );

  if (!cart.shippingAddress) {
    redirect("/cart/identification");
  }

  return (
    <>
      <Header />
      <div className="space-y-4 px-5">
        <Card className="px-4">
          <CardHeader>
            <CardTitle>Identificação:</CardTitle>
          </CardHeader>
          <Card>
            <CardContent>
              <p className="text-sm">{formatAddress(cart.shippingAddress)}</p>
            </CardContent>
          </Card>
          <Button className="w-full rounded-full" size="lg">
            Confirmar compra
          </Button>
        </Card>
        <CartSummary
          subtotalInCents={cartTotalInCents}
          totalInCents={cartTotalInCents}
          products={cart.items.map((item) => ({
            id: item.productVariant.id,
            name: item.productVariant.product.name,
            variantName: item.productVariant.name,
            quantity: item.quantity,
            priceInCents: item.productVariant.priceInCents,
            imageUrl: item.productVariant.imageUrl,
          }))}
        />
      </div>
      <div className="mt-12">
        <Footer />
      </div>
    </>
  );
};

export default ConfirmationPage;
