import { finishOrder } from "@/action/finish-order";
import { getUseCartQueryKey } from "@/action/hooks/queries/use-cart";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const getUseFinishOrderMutationKey = () => ["finish-order"];

export const useFinishOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getUseFinishOrderMutationKey(),
    mutationFn: async () => {
      return await finishOrder();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
