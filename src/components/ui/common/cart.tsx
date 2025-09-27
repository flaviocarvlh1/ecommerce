"use client";

import { useState } from "react";
import { ShoppingBasketIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../sheet";
import { formatCentsToEUR } from "@/helpers/money";
import CartItem from "./cart-item";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Separator } from "@radix-ui/react-separator";
import { useCart } from "@/action/hooks/queries/use-cart";
import { GuestCartItem } from "./guest-cart-item";
import { useCartStore, useIsGuest } from "@/action/hooks/use-cart-store";

export const Cart = () => {
  const { data: userCart } = useCart();
  const guestCartItems = useCartStore((state) => state.items);
  const guestTotalPrice = useCartStore((state) => state.getTotalPrice());
  const isGuest = useIsGuest();

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const cart = isGuest
    ? {
        items: guestCartItems,
        totalPriceInCents: guestTotalPrice,
      }
    : userCart;

  const handleCheckout = () => {
    setOpen(false);
    if (isGuest) {
      router.push("/authentication");
    } else {
      router.push("/cart/identification");
    }
  };

  const isEmpty = !cart?.items || cart.items.length === 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Carrinho</SheetTitle>
        </SheetHeader>

        <div className="flex h-full flex-col px-5 pb-5">
          <div className="flex h-full max-h-full flex-col overflow-hidden">
            <ScrollArea className="h-full">
              <div className="flex h-full flex-col gap-8">
                {isEmpty ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">Carrinho vazio</p>
                  </div>
                ) : (
                  <>
                    {isGuest &&
                      guestCartItems.map((item) => (
                        <GuestCartItem
                          key={item.productVariantId}
                          productVariantId={item.productVariantId}
                          productName={item.productName}
                          productVariantName={item.productVariantName}
                          productVariantImageUrl={item.productVariantImageUrl}
                          productVariantPriceInCents={
                            item.productVariantPriceInCents
                          }
                          quantity={item.quantity}
                        />
                      ))}

                    {!isGuest &&
                      userCart?.items?.map((item) => (
                        <CartItem
                          key={item.id}
                          id={item.id}
                          productVariantId={item.productVariant.id}
                          productName={item.productVariant.product.name}
                          productVariantName={item.productVariant.name}
                          productVariantImageUrl={item.productVariant.imageUrl}
                          productVariantPriceInCents={
                            item.productVariant.priceInCents
                          }
                          quantity={item.quantity}
                        />
                      ))}
                  </>
                )}
              </div>
            </ScrollArea>
          </div>

          {!isEmpty && (
            <div className="flex flex-col gap-4">
              <Separator />
              <div className="flex items-center justify-between text-xs font-medium">
                <p>Subtotal</p>
                <p>{formatCentsToEUR(cart?.totalPriceInCents ?? 0)}</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-xs font-medium">
                <p>Entrega</p>
                <p>GRÁTIS</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-xs font-medium">
                <p>Total</p>
                <p>{formatCentsToEUR(cart?.totalPriceInCents ?? 0)}</p>
              </div>

              <Button className="mt-5 rounded-full" onClick={handleCheckout}>
                {isGuest ? "Fazer Login para Continuar" : "Finalizar Compra"}
              </Button>

              {isGuest && (
                <p className="text-muted-foreground text-center text-xs">
                  Seus itens serão salvos automaticamente
                </p>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
