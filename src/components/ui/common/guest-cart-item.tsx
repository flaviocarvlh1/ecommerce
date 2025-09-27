"use client";

import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";

import { formatCentsToEUR } from "@/helpers/money";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCartStore } from "@/action/hooks/use-cart-store";

interface GuestCartItemProps {
  productVariantId: string;
  productName: string;
  productVariantName: string;
  productVariantImageUrl: string;
  productVariantPriceInCents: number;
  quantity: number;
}

export const GuestCartItem = ({
  productVariantId,
  productName,
  productVariantName,
  productVariantImageUrl,
  productVariantPriceInCents,
  quantity,
}: GuestCartItemProps) => {
  const { removeItem, updateQuantity } = useCartStore();

  const handleDeleteClick = () => {
    removeItem(productVariantId);
    toast.success("Produto removido do carrinho.");
  };

  const handleDecreaseQuantityClick = () => {
    if (quantity > 1) {
      updateQuantity(productVariantId, quantity - 1);
      toast.success("Quantidade diminuida.");
    } else {
      removeItem(productVariantId);
      toast.success("Produto removido do carrinho.");
    }
  };

  const handleIncreaseQuantityClick = () => {
    updateQuantity(productVariantId, quantity + 1);
    toast.success("Quantidade do produto aumentada.");
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image
          src={productVariantImageUrl}
          alt={productVariantName}
          width={78}
          height={78}
          className="rounded-lg"
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{productName}</p>
          <p className="text-muted-foreground text-xs font-medium">
            {productVariantName}
          </p>
          <div className="flex w-[80px] items-center justify-between rounded-lg border p-1">
            <Button
              className="h-4 w-4"
              variant="ghost"
              onClick={handleDecreaseQuantityClick}
            >
              <MinusIcon />
            </Button>
            <p className="text-xs font-medium">{quantity}</p>
            <Button
              className="h-4 w-4"
              variant="ghost"
              onClick={handleIncreaseQuantityClick}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center gap-2">
        <Button variant="outline" size="icon" onClick={handleDeleteClick}>
          <TrashIcon />
        </Button>
        <p className="text-sm font-bold">
          {formatCentsToEUR(productVariantPriceInCents)}
        </p>
      </div>
    </div>
  );
};
