import { useMutation } from "@tanstack/react-query";

// services
import inventoryService from "../services/inventory";

// hooks
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useAdjustManyInventory = () => {
  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: adjustManyInventory } = useMutation({
    mutationFn: async (
      adjustments: Array<{
        id?: string;
        asset?: string;
        quantityDelta: number;
      }>,
    ) => inventoryService.adjustMany(adjustments, axiosPrivate),
  });

  return { adjustManyInventory };
};

export default useAdjustManyInventory;
