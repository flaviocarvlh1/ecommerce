import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
  id: string;
  productVariantId: string;
  productName: string;
  productVariantName: string;
  productVariantImageUrl: string;
  productVariantPriceInCents: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoggedIn: boolean;
  guestId: string;
  addItem: (
    productVariant: Omit<CartItem, "id" | "quantity">,
    quantity?: number,
  ) => void;
  removeItem: (productVariantId: string) => void;
  updateQuantity: (productVariantId: string, quantity: number) => void;
  clearCart: () => void;
  setLoginStatus: (status: boolean) => void;
  migrateGuestCart: (userCart: CartItem[]) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const generateGuestId = () => {
  if (typeof window === "undefined") return "";
  return "guest_" + Math.random().toString(36).substr(2, 9);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoggedIn: false,
      guestId: "",

      addItem: (productVariant, quantity = 1) =>
        set((state) => {
          console.log("🛒 ADICIONANDO AO CARRINHO:");
          console.log("ID:", productVariant.productVariantId);
          console.log("Quantidade:", quantity);
          console.log("Itens atuais no carrinho:", state.items.length);

          const existingItem = state.items.find(
            (item) => item.productVariantId === productVariant.productVariantId,
          );

          let newItems;

          if (existingItem) {
            newItems = state.items.map((item) =>
              item.productVariantId === productVariant.productVariantId
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                  }
                : item,
            );
            console.log(
              "✅ Item existente. Nova quantidade:",
              existingItem.quantity + quantity,
            );
          } else {
            newItems = [
              ...state.items,
              {
                id: productVariant.productVariantId,
                productVariantId: productVariant.productVariantId,
                productName: productVariant.productName,
                productVariantName: productVariant.productVariantName,
                productVariantImageUrl: productVariant.productVariantImageUrl,
                productVariantPriceInCents:
                  productVariant.productVariantPriceInCents,
                quantity: quantity,
              },
            ];
            console.log("🆕 Novo item adicionado");
          }

          if (!state.isLoggedIn) {
            const currentGuestId = state.guestId || generateGuestId();
            return {
              items: newItems,
              guestId: currentGuestId,
            };
          }

          return { items: newItems };
        }),
      removeItem: (productVariantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => i.productVariantId !== productVariantId,
          ),
        })),

      updateQuantity: (productVariantId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productVariantId === productVariantId
              ? { ...i, quantity: Math.max(0, quantity) }
              : i,
          ),
        })),

      clearCart: () => set({ items: [] }),

      setLoginStatus: (status: boolean) => {
        set({ isLoggedIn: status });
      },

      migrateGuestCart: (userCart: CartItem[]) => {
        const state = get();
        const guestItems = state.items;

        const mergedItems = [...userCart];

        guestItems.forEach((guestItem) => {
          const existing = mergedItems.find(
            (item) => item.productVariantId === guestItem.productVariantId,
          );
          if (!existing) {
            mergedItems.push(guestItem);
          }
        });

        set({
          items: mergedItems,
          isLoggedIn: true,
        });
      },

      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((total, item) => {
          return total + item.productVariantPriceInCents * item.quantity;
        }, 0);
      },

      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const useIsGuest = () => {
  return useCartStore((state) => !state.isLoggedIn);
};

export const useCartItemCount = () => {
  return useCartStore((state) => state.getTotalItems());
};
