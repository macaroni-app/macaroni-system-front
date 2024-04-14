import {
  QueryFunctionContext,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";

// types
import { IProductTypeType } from "../components/productTypes/types";
import { IFilters } from "../components/common/types";

// services
import productTypeService from "../services/productType";

// hooks
import useAxiosPrivate from "../hooks/useAxiosPrivate";

interface Props {
  id?: string;
}

export const useProductTypes = (props: Props) => {
  const axiosPrivate = useAxiosPrivate();
  const { id } = props || "";

  const query: UseQueryResult<IProductTypeType[], Error> = useQuery({
    queryKey: [
      "productTypes",
      {
        filters: { id },
      },
    ],
    queryFn: async ({ queryKey }: QueryFunctionContext) => {
      const { filters } = queryKey[1] as IFilters;
      const { data } = await productTypeService.getAll(
        { ...filters },
        axiosPrivate
      );
      return data;
    },
    staleTime: Infinity,
  });

  return query;
};
