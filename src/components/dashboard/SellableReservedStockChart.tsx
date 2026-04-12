import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  type ChartOptions,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  Text,
} from "@chakra-ui/react"

import { useInventories } from "../../hooks/useInventories"
import { IInventoryFullRelated } from "../inventories/types"
import Loading from "../common/Loading"

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  Legend,
  Tooltip,
  Title,
)

type StockChartRecord = {
  label: string
  reserved: number
  sellable: number
}

const maxVisibleItems = 10

const getStockChartRecords = (
  inventories: IInventoryFullRelated[] = [],
): StockChartRecord[] => {
  return inventories
    .filter((inventory) => inventory.asset?.isActive)
    .map((inventory) => {
      const quantityAvailable = Number(inventory.quantityAvailable ?? 0)
      const quantityReserved = Number(inventory.quantityReserved ?? 0)

      return {
        label: inventory.asset?.name ?? "Sin nombre",
        reserved: quantityReserved,
        sellable: Math.max(quantityAvailable - quantityReserved, 0),
      }
    })
    .sort((current, next) => {
      if (next.reserved !== current.reserved) {
        return next.reserved - current.reserved
      }

      return current.sellable - next.sellable
    })
    .slice(0, maxVisibleItems)
}

const SellableReservedStockChart = () => {
  const queryInventory = useInventories({})
  const inventories = queryInventory.inventories as IInventoryFullRelated[]
  const records = getStockChartRecords(inventories)
  const hasReservedStock = records.some((record) => record.reserved > 0)

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
      },
      y: {
        stacked: true,
        ticks: {
          autoSkip: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.x}`
          },
        },
      },
    },
  }

  const data = {
    labels: records.map((record) => record.label),
    datasets: [
      {
        label: "Vendible",
        data: records.map((record) => record.sellable),
        backgroundColor: "#38A169",
        borderRadius: 6,
      },
      {
        label: "Reservado",
        data: records.map((record) => record.reserved),
        backgroundColor: "#DD6B20",
        borderRadius: 6,
      },
    ],
  }

  if (queryInventory?.isLoading) {
    return <Loading />
  }

  if (!queryInventory?.isLoading && records.length === 0) {
    return (
      <Card variant="outline" mb={3}>
        <CardBody textAlign="center">
          <Text>No hay datos de inventario</Text>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card variant="outline" mb={3}>
      <CardHeader textAlign="center">
        <Heading size="lg">Stock vendible vs reservado</Heading>
        <Text color="gray.600" fontSize="sm" mt={2}>
          Vendible = stock físico - reservado
        </Text>
        {!hasReservedStock && (
          <Text color="gray.500" fontSize="sm" mt={1}>
            No hay stock reservado; se muestran los insumos con menor stock
            vendible.
          </Text>
        )}
      </CardHeader>
      <CardBody>
        <Box h={`${Math.max(280, records.length * 48)}px`} w="100%">
          <Bar options={options} data={data} />
        </Box>
      </CardBody>
      <Divider />
    </Card>
  )
}

export default SellableReservedStockChart
