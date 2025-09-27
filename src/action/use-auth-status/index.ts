"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useCartStore } from "../hooks/use-cart-store";

export const useAuthStatus = () => {
  const { data: session, isPending } = authClient.useSession();
  const setLoginStatus = useCartStore((state) => state.setLoginStatus);

  useEffect(() => {
    setLoginStatus(!!session?.user);
  }, [session?.user, setLoginStatus]);

  return {
    isAuthenticated: !!session?.user,
    isPending,
    user: session?.user,
  };
};
