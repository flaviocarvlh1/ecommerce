import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getUseCartQueryKey } from "../queries/use-cart";
import { finishOrder } from "@/action/finish-order";

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
