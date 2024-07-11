import { useState } from "react"


import {
  QueryFunctionContext,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query"

// types
import { IFixedCost } from "../components/fixedCosts/types"
import { IFilters } from "../components/common/types"

// services
import fixedCostService from "../services/fixedCost"

// hooks
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { useTodayDate } from "./useTodayDate"

interface Props {
  id?: string
  startDate?: string
  endDate?: string
}

export const useFixedCosts = (props: Props) => {
  const axiosPrivate = useAxiosPrivate()
  const { id } = props || ""

  const today = useTodayDate();

  const [rangeDateFilter, setRangeDateFilter] = useState({
    startDate: today,
    endDate: today,
  });

  const query: UseQueryResult<IFixedCost[], Error> = useQuery({
    queryKey: [
      "fixedCosts",
      {
        filters: { ...rangeDateFilter, id },
      },
    ],
    queryFn: async ({ queryKey }: QueryFunctionContext) => {
      const { filters } = queryKey[1] as IFilters

      const { data } = await fixedCostService.getAll(
        { ...filters },
        axiosPrivate
      )
      return data
    },
    staleTime: Infinity,
  })

  return query
}
