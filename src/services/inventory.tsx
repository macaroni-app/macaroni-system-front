import { AxiosInstance } from "axios";
import { IInventoryLessRelated } from "../components/inventories/types";

const INVENTORY_URL = "/api/v1/inventories";

interface IFilters {
  id?: string;
}

interface IInventoryDeltaUpdate {
  id?: string;
  _id?: string;
  asset?: string;
  quantityDelta: number;
}

const inventoryService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl;

    if (filters.id) {
      finalUrl = `${INVENTORY_URL}?id=${filters.id}`;
    } else {
      finalUrl = INVENTORY_URL;
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    });
    return data;
  },
  getOne: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(`${INVENTORY_URL}/${id}`, {
      withCredentials: true,
    });
    return data;
  },
  store: async (
    newInventory: IInventoryLessRelated,
    axiosPrivate: AxiosInstance,
  ) => {
    const { data } = await axiosPrivate.post(INVENTORY_URL, newInventory, {
      withCredentials: true,
    });
    return data;
  },
  delete: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.delete(`${INVENTORY_URL}/${id}`, {
      withCredentials: true,
    });
    return data;
  },
  update: async (
    id: string,
    inventoryToUpdate: IInventoryLessRelated,
    axiosPrivate: AxiosInstance,
  ) => {
    const currentInventoryResponse = await inventoryService.getOne(
      id,
      axiosPrivate,
    );

    const currentQuantity = Number(
      currentInventoryResponse?.data?.quantityAvailable ?? 0,
    );

    const nextQuantity = Number(
      inventoryToUpdate.quantityAvailable ?? currentQuantity,
    );

    const quantityDelta = nextQuantity - currentQuantity;

    const { data } = await axiosPrivate.put(
      `${INVENTORY_URL}/${id}`,
      {
        asset: inventoryToUpdate.asset,
        quantityDelta,
      },
      {
        withCredentials: true,
      },
    );
    return data;
  },
  updateMany: async (
    inventoriesToUpdate: Array<IInventoryLessRelated | IInventoryDeltaUpdate>,
    axiosPrivate: AxiosInstance,
  ) => {
    const inventories = inventoriesToUpdate
      .map((inventory) => {
        const id = inventory.id ?? inventory._id;
        const quantityDelta =
          "quantityDelta" in inventory
            ? Number(inventory.quantityDelta)
            : Number(
                (inventory as { quantityAvailable?: number })
                  .quantityAvailable ?? 0,
              );

        if (!id) return null;

        return {
          id,
          asset: inventory.asset,
          quantityDelta,
        };
      })
      .filter(Boolean);

    const { data } = await axiosPrivate.put(
      INVENTORY_URL + "/bulkUpdate",
      { inventories },
      {
        withCredentials: true,
      },
    );
    return data;
  },
  adjustMany: async (
    adjustments: Array<{ id?: string; asset?: string; quantityDelta: number }>,
    axiosPrivate: AxiosInstance,
  ) => {
    const inventories = adjustments
      .map((adjustment) => {
        if (!adjustment.id) return null;
        return {
          id: adjustment.id,
          asset: adjustment.asset,
          quantityDelta: Number(adjustment.quantityDelta),
        };
      })
      .filter(Boolean);

    const { data } = await axiosPrivate.put(
      INVENTORY_URL + "/bulkUpdate",
      { inventories },
      {
        withCredentials: true,
      },
    );
    return data;
  },
};

export default inventoryService;
