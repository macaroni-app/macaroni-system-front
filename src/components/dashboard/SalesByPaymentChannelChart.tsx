import { useState } from "react"
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
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
  SimpleGrid,
  Heading,
  Text,
} from "@chakra-ui/react"

import Loading from "../common/Loading"
import { useSalesReport } from "../../hooks/useSalesReport"
import { ISaleFullRelated, SalePaymentChannel } from "../sales/types"
import { monthNames } from "../../utils/reports"

ChartJS.register(CategoryScale, LinearScale, BarElement, Legend, Tooltip)

type PaymentChannelKey =
  | SalePaymentChannel.CASH
  | SalePaymentChannel.BANK_TRANSFER
  | SalePaymentChannel.QR
  | SalePaymentChannel.CARD
  | "UNSPECIFIED"

type ChannelConfig = {
  key: PaymentChannelKey
  label: string
  color: string
}

type MonthlyPaymentChannelRecord = {
  year: number
  month: number
  monthName: string
  totals: Record<PaymentChannelKey, number>
}

const channelConfigs: ChannelConfig[] = [
  {
    key: SalePaymentChannel.CASH,
    label: "Efectivo",
    color: "#38A169",
  },
  {
    key: SalePaymentChannel.BANK_TRANSFER,
    label: "Transferencia",
    color: "#3182CE",
  },
  {
    key: SalePaymentChannel.QR,
    label: "QR",
    color: "#805AD5",
  },
  {
    key: SalePaymentChannel.CARD,
    label: "Tarjeta",
    color: "#DD6B20",
  },
  {
    key: "UNSPECIFIED",
    label: "Sin canal",
    color: "#A0AEC0",
  },
]

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    minimumFractionDigits: 2,
    currency: "USD",
  }).format(amount)

const getPaymentChannelKey = (
  paymentChannel?: SalePaymentChannel,
): PaymentChannelKey => {
  if (paymentChannel === undefined || paymentChannel === null) {
    return "UNSPECIFIED"
  }

  return paymentChannel
}

const buildEmptyTotals = (): Record<PaymentChannelKey, number> => ({
  CASH: 0,
  BANK_TRANSFER: 0,
  QR: 0,
  CARD: 0,
  UNSPECIFIED: 0,
})

const groupSalesByPaymentChannelMonth = (
  sales: ISaleFullRelated[] = [],
  numberOfMonths: number,
): MonthlyPaymentChannelRecord[] => {
  const salesByMonth = new Map<string, MonthlyPaymentChannelRecord>()

  sales.forEach((sale) => {
    const createdAt = new Date(String(sale.createdAt))
    const year = createdAt.getFullYear()
    const month = createdAt.getMonth()
    const key = `${year}-${month}`

    const currentRecord =
      salesByMonth.get(key) ?? {
        year,
        month: month + 1,
        monthName: monthNames[month],
        totals: buildEmptyTotals(),
      }

    const paymentChannelKey = getPaymentChannelKey(sale.paymentChannel)
    currentRecord.totals[paymentChannelKey] += Number(sale.total ?? 0)
    salesByMonth.set(key, currentRecord)
  })

  const records: MonthlyPaymentChannelRecord[] = []
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  for (let i = numberOfMonths - 1; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1)
    const year = date.getFullYear()
    const month = date.getMonth()
    const key = `${year}-${month}`

    records.push(
      salesByMonth.get(key) ?? {
        year,
        month: month + 1,
        monthName: monthNames[month],
        totals: buildEmptyTotals(),
      },
    )
  }

  return records
}

const RangeButtons = ({
  setNumberOfMonth,
}: {
  setNumberOfMonth: (value: number) => void
}) => (
  <Flex gap={2} flexWrap="wrap" justifyContent="center" w="100%">
    <Button onClick={() => setNumberOfMonth(24)} colorScheme="purple" variant="ghost">
      24 meses
    </Button>
    <Button onClick={() => setNumberOfMonth(18)} colorScheme="purple" variant="ghost">
      18 meses
    </Button>
    <Button onClick={() => setNumberOfMonth(12)} colorScheme="purple" variant="ghost">
      12 meses
    </Button>
    <Button onClick={() => setNumberOfMonth(6)} colorScheme="purple" variant="ghost">
      6 meses
    </Button>
    <Button onClick={() => setNumberOfMonth(3)} colorScheme="purple" variant="ghost">
      3 meses
    </Button>
  </Flex>
)

const SalesByPaymentChannelChart = () => {
  const [numberOfMonth, setNumberOfMonth] = useState(12)

  const querySalesReport = useSalesReport({
    historyMonthToRetrieve: numberOfMonth,
  })
  const sales = querySalesReport.data as ISaleFullRelated[]
  const paidSales = sales?.filter((sale) => sale?.status === "PAID") ?? []
  const monthlyRecords = groupSalesByPaymentChannelMonth(paidSales, numberOfMonth)
  const currentMonthRecord = monthlyRecords.at(-1)
  const currentMonthTotal = channelConfigs.reduce(
    (accumulator, channelConfig) =>
      accumulator + Number(currentMonthRecord?.totals[channelConfig.key] ?? 0),
    0,
  )

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          callback: (value) => formatCurrency(Number(value)),
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
            const value = Number(context.parsed.y ?? 0)
            return `${context.dataset.label}: ${formatCurrency(value)}`
          },
          footer: (items) => {
            const total = items.reduce(
              (accumulator, item) => accumulator + Number(item.parsed.y ?? 0),
              0,
            )
            return `Total del mes: ${formatCurrency(total)}`
          },
        },
      },
    },
  }

  const data = {
    labels: monthlyRecords.map(
      (record) => `${record.monthName.slice(0, 3)} ${record.year}`,
    ),
    datasets: channelConfigs.map((channelConfig) => ({
      label: channelConfig.label,
      data: monthlyRecords.map(
        (record) => Number(record.totals[channelConfig.key].toFixed(2)),
      ),
      backgroundColor: channelConfig.color,
      borderRadius: 4,
      borderSkipped: false as const,
      stack: "payment-channels",
    })),
  }

  if (querySalesReport.isLoading) {
    return <Loading />
  }

  if (!querySalesReport.isLoading && paidSales.length === 0) {
    return (
      <Card variant="outline" mb={3}>
        <CardHeader textAlign="center">
          <Heading size="lg">Facturación por canal de cobro</Heading>
        </CardHeader>
        <CardBody textAlign="center">
          <Text>No hay ventas pagadas para analizar.</Text>
        </CardBody>
        <Divider />
        <CardFooter justifyContent="center">
          <RangeButtons setNumberOfMonth={setNumberOfMonth} />
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card variant="outline" mb={3}>
      <CardHeader textAlign="center">
        <Heading size="lg">
          Facturación por canal de cobro últimos {numberOfMonth} meses
        </Heading>
        <Text color="gray.600" fontSize="sm" mt={2}>
          Arriba ves la mezcla del mes actual. Abajo, la evolución mensual de efectivo, transferencia, QR y tarjeta.
        </Text>
      </CardHeader>
      <CardBody>
        <SimpleGrid columns={{ base: 1, sm: 2, xl: 5 }} spacing={3} mb={6}>
          {channelConfigs.map((channelConfig) => {
            const amount = Number(currentMonthRecord?.totals[channelConfig.key] ?? 0)
            const percentage =
              currentMonthTotal > 0 ? (amount / currentMonthTotal) * 100 : 0

            return (
              <Card key={channelConfig.key} variant="outline" bg="gray.50" h="100%">
                <CardBody>
                  <Flex direction="column" gap={2}>
                    <Flex align="center" gap={2}>
                      <Box w="10px" h="10px" borderRadius="full" bg={channelConfig.color} />
                      <Text fontWeight="semibold">{channelConfig.label}</Text>
                    </Flex>
                    <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                      {formatCurrency(amount)}
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                      {percentage.toFixed(1)}% del mes actual
                    </Text>
                  </Flex>
                </CardBody>
              </Card>
            )
          })}
        </SimpleGrid>

        <Box h="420px" w="100%">
          <Bar options={options} data={data} />
        </Box>
      </CardBody>
      <Divider />
      <CardFooter justifyContent="center">
        <RangeButtons setNumberOfMonth={setNumberOfMonth} />
      </CardFooter>
    </Card>
  )
}

export default SalesByPaymentChannelChart
