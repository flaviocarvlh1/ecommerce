import { getCart } from "@/action/get-cart";
import { useQuery } from "@tanstack/react-query";

export const getUseCartQueryKey = () => ["cart"] as const;

export const useCart = (params?: {
  initialData?: Awaited<ReturnType<typeof getCart>>;
}) => {
  return useQuery({
    queryKey: getUseCartQueryKey(),
    queryFn: () => getCart(),
    initialData: params?.initialData,
  });
};
