import { useQuery } from "@tanstack/react-query";

import { shippingAddressTable } from "@/db/schema";
import { getUserAddresses } from "@/action/get-user-addresses";

export const getUserAddressesQueryKey = () => ["user-addresses"] as const;

export const useUserAddresses = (params?: {
  initialData?: (typeof shippingAddressTable.$inferSelect)[];
}) => {
  return useQuery({
    queryKey: getUserAddressesQueryKey(),
    queryFn: getUserAddresses,
    initialData: params?.initialData,
  });
};
