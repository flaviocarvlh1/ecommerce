"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Header } from "@/components/ui/common/header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCartStore } from "@/action/hooks/use-cart-store";
import { useQueryClient } from "@tanstack/react-query";

const CheckoutSuccessPage = () => {
  const clearCart = useCartStore((state) => state.clearCart);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Limpar carrinho quando a página carregar
    clearCart();

    // Invalidar query do carrinho para refletir vazio
    queryClient.invalidateQueries({ queryKey: ["cart"] });

    console.log("Carrinho limpo após compra!");
  }, [clearCart, queryClient]);

  return (
    <>
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="text-center">
          <Image
            src="/illustration.svg"
            alt="Success"
            width={300}
            height={300}
            className="mx-auto"
          />
          <DialogTitle className="mt-4 text-2xl">Pedido efetuado!</DialogTitle>
          <DialogDescription className="font-medium">
            Seu pedido foi efetuado com sucesso. Você pode acompanhar o status
            na seção de "Meus Pedidos".
          </DialogDescription>

          <DialogFooter>
            <Button className="rounded-full" size="lg">
              <Link href="/my-orders">Ver meus pedidos</Link>
            </Button>
            <Button
              className="rounded-full"
              variant="outline"
              size="lg"
              asChild
            >
              <Link href="/">Voltar para a loja</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CheckoutSuccessPage;
