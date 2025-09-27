"use client";

import { useState } from "react";
import { Loader2, MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddToCartButton from "./add-to-cart-button";

interface ProductActionsProps {
  productVariantId: string;
  productName: string;
  productVariantName: string;
  productVariantImageUrl: string;
  productVariantPriceInCents: number;
}

const ProductActions = ({
  productVariantId,
  productName,
  productVariantName,
  productVariantImageUrl,
  productVariantPriceInCents,
}: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isBuying, setIsBuying] = useState(false);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleBuyNow = async () => {
    setIsBuying(true);
    setIsBuying(false);
  };

  return (
    <div className="flex flex-col space-y-6 px-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-semibold">Quantidade</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleDecrement}>
              <MinusIcon className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <Button variant="outline" size="icon" onClick={handleIncrement}>
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <AddToCartButton
          productVariantId={productVariantId}
          quantity={quantity}
          productName={productName}
          productVariantName={productVariantName}
          productVariantImageUrl={productVariantImageUrl}
          productVariantPriceInCents={productVariantPriceInCents}
        />

        <Button
          className="rounded-full"
          size="lg"
          onClick={handleBuyNow}
          disabled={isBuying}
        >
          {isBuying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Comprar Agora
        </Button>
      </div>
    </div>
  );
};

export default ProductActions;
