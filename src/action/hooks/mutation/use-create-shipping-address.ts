import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserAddressesQueryKey } from "../queries/use-user-addresses";
import { createShippingAddress } from "@/action/create-shipping-address";
import { CreateShippingAddressSchema } from "@/action/create-shipping-address/schema";

export const getCreateShippingAddressMutationKey = () =>
  ["create-shipping-address"] as const;

export const useCreateShippingAddress = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Awaited<ReturnType<typeof createShippingAddress>>,
    unknown,
    CreateShippingAddressSchema
  >({
    mutationKey: getCreateShippingAddressMutationKey(),
    mutationFn: (data: CreateShippingAddressSchema) =>
      createShippingAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUserAddressesQueryKey(),
      });
    },
  });
};
