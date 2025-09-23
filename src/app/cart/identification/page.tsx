import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { shippingAddressTable, cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { Header } from "@/components/ui/common/header";
import Footer from "@/components/ui/common/footer";
import Addresses from "./components/addresses";
import CartSummary from "../components/cart-summary";

const IdentificationPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/");
  }

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
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

  return (
    <div>
      <div className="space-y-4 px-5">
        <Addresses
          shippingAddresses={shippingAddresses || []}
          defaultShippingAddressId={defaultShippingAddressId}
        />
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
    </div>
  );
};

export default IdentificationPage;
