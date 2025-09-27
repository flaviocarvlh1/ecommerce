"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { finishOrder } from "@/action/finish-order";
import { createCheckoutSession } from "@/action/create-checkout-session";

const CheckoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const processCheckout = async () => {
      try {
        const order = await finishOrder();

        const session = await createCheckoutSession({
          orderId: order.orderId,
        });

        if (session.url) {
          window.location.href = session.url;
        } else {
          throw new Error("URL da sessão Stripe não encontrada");
        }
      } catch (error) {
        console.error("Erro no checkout:", error);
        router.push("/cart/identification?error=checkout_failed");
      }
    };

    processCheckout();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="text-lg font-medium">Processando seu pedido...</p>
        <p className="mt-2 text-sm text-gray-600">
          Aguarde enquanto redirecionamos para o pagamento
        </p>
      </div>
    </div>
  );
};

export default CheckoutPage;
