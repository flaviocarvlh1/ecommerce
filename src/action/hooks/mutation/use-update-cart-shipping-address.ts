import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getUseCartQueryKey } from "../queries/use-cart";
import { UpdateCartShippingAddressSchema } from "@/action/update-cart-shipping-address/schema";
import { updateCartShippingAddress } from "@/action/update-cart-shipping-address";

export const getUpdateCartShippingAddressMutationKey = () => [
  "update-cart-shipping-address",
];

export const useUpdateCartShippingAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getUpdateCartShippingAddressMutationKey(),
    mutationFn: (data: UpdateCartShippingAddressSchema) =>
      updateCartShippingAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUseCartQueryKey(),
      });
    },
  });
};
