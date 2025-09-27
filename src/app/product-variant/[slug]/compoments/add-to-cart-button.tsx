"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addProductToCart } from "@/action/add-cart-product";
import { useCartStore, useIsGuest } from "@/action/hooks/use-cart-store";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface AddToCartButtonProps {
  productVariantId: string;
  quantity: number;
  productName?: string;
  productVariantName?: string;
  productVariantImageUrl?: string;
  productVariantPriceInCents?: number;
}

const AddToCartButton = ({
  productVariantId,
  quantity,
  productName = "Produto",
  productVariantName = "Variante",
  productVariantImageUrl = "/placeholder-image.jpg",
  productVariantPriceInCents = 0,
}: AddToCartButtonProps) => {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const addItem = useCartStore((state) => state.addItem);
  const isGuest = useIsGuest();

  const { mutate, isPending } = useMutation({
    mutationKey: ["addProductToCart", productVariantId, quantity],
    mutationFn: () =>
      addProductToCart({
        productVariantId,
        quantity,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Produto adicionado ao carrinho!");
    },
    onError: () => {
      toast.error("Erro ao adicionar ao carrinho.");
    },
  });

  const handleAdd = () => {
    if (!isGuest && session?.user) {
      mutate(undefined);
    } else {
      addItem(
        {
          productVariantId,
          productName,
          productVariantName,
          productVariantImageUrl,
          productVariantPriceInCents,
        },
        quantity,
      );

      toast.success("Produto adicionado ao carrinho!");
    }
  };

  return (
    <Button
      className="rounded-full"
      size="lg"
      variant="outline"
      disabled={isPending}
      onClick={handleAdd}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Adicionar à sacola
    </Button>
  );
};

export default AddToCartButton;
