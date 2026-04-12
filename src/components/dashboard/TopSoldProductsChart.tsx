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
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react"
import { useState } from "react"

import { useSaleItems } from "../../hooks/useSaleItems"
import { ISaleItemFullRelated } from "../sales/types"
import Loading from "../common/Loading"

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  Legend,
  Tooltip,
  Title,
)

type TopProductRecord = {
  productName: string
  quantity: number
  total: number
}

const maxVisibleItems = 10

const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

const getDateRange = (daysToRetrieve: number) => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - daysToRetrieve)

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  }
}

const getTopProductRecords = (
  saleItems: ISaleItemFullRelated[] = [],
): TopProductRecord[] => {
  const recordsByProductId = new Map<string, TopProductRecord>()

  saleItems.forEach((saleItem) => {
    const productId = saleItem.product?._id

    if (!productId) return

    const currentRecord = recordsByProductId.get(productId) ?? {
      productName: saleItem.product?.name ?? "Sin nombre",
      quantity: 0,
      total: 0,
    }

    currentRecord.quantity += Number(saleItem.quantity ?? 0)
    currentRecord.total += Number(saleItem.subtotal ?? 0)
    recordsByProductId.set(productId, currentRecord)
  })

  return Array.from(recordsByProductId.values())
    .sort((current, next) => next.quantity - current.quantity)
    .slice(0, maxVisibleItems)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    minimumFractionDigits: 2,
    currency: "USD",
  }).format(amount)
}

const RangeButtons = ({
  setDaysToRetrieve,
}: {
  setDaysToRetrieve: (days: number) => void
}) => {
  return (
    <Flex gap={2} flexWrap="wrap" justifyContent="center" w="100%">
      <Button
        onClick={() => setDaysToRetrieve(30)}
        colorScheme="purple"
        variant="ghost"
      >
        30 días
      </Button>
      <Button
        onClick={() => setDaysToRetrieve(90)}
        colorScheme="purple"
        variant="ghost"
      >
        90 días
      </Button>
      <Button
        onClick={() => setDaysToRetrieve(180)}
        colorScheme="purple"
        variant="ghost"
      >
        180 días
      </Button>
    </Flex>
  )
}

const TopSoldProductsChart = () => {
  const [daysToRetrieve, setDaysToRetrieve] = useState<number>(30)
  const rangeDate = getDateRange(daysToRetrieve)
  const querySaleItems = useSaleItems(rangeDate)
  const saleItems = querySaleItems.data as ISaleItemFullRelated[]
  const records = getTopProductRecords(saleItems)

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        ticks: {
          autoSkip: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const record = records[context.dataIndex]
            return [
              `Unidades: ${record?.quantity ?? 0}`,
              `Facturación: ${formatCurrency(record?.total ?? 0)}`,
            ]
          },
        },
      },
    },
  }

  const data = {
    labels: records.map((record) => record.productName),
    datasets: [
      {
        label: "Unidades vendidas",
        data: records.map((record) => record.quantity),
        backgroundColor: "#805AD5",
        borderRadius: 6,
      },
    ],
  }

  if (querySaleItems.isLoading) {
    return <Loading />
  }

  if (!querySaleItems.isLoading && records.length === 0) {
    return (
      <Card variant="outline" mb={3}>
        <CardHeader textAlign="center">
          <Heading size="lg">Top productos más vendidos</Heading>
        </CardHeader>
        <CardBody textAlign="center">
          <Text>No hay productos vendidos en los últimos {daysToRetrieve} días.</Text>
        </CardBody>
        <Divider />
        <CardFooter justifyContent="center">
          <RangeButtons setDaysToRetrieve={setDaysToRetrieve} />
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card variant="outline" mb={3}>
      <CardHeader textAlign="center">
        <Heading size="lg">
          Top productos más vendidos últimos {daysToRetrieve} días
        </Heading>
        <Text color="gray.600" fontSize="sm" mt={2}>
          Ordenado por unidades vendidas. El tooltip muestra también la
          facturación estimada.
        </Text>
      </CardHeader>
      <CardBody>
        <Box h={`${Math.max(280, records.length * 48)}px`} w="100%">
          <Bar options={options} data={data} />
        </Box>
      </CardBody>
      <Divider />
      <CardFooter justifyContent="center">
        <RangeButtons setDaysToRetrieve={setDaysToRetrieve} />
      </CardFooter>
    </Card>
  )
}

export default TopSoldProductsChart
