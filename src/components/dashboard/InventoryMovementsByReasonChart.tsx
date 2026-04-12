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

import { useInventoryTransactionsReport } from "../../hooks/useInventoryTransactionsReport"
import {
  IInventoryTransactionFullRelated,
  TransactionReason,
} from "../inventoryTransactions/types"
import Loading from "../common/Loading"

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  Legend,
  Tooltip,
  Title,
)

type MovementReasonRecord = {
  label: string
  reason: TransactionReason
  totalAffectedAmount: number
  color: string
}

const transactionReasonLabels: Record<TransactionReason, string> = {
  [TransactionReason.BUY]: "Compra",
  [TransactionReason.SELL]: "Venta",
  [TransactionReason.RETURN]: "Devolución",
  [TransactionReason.ADJUSTMENT]: "Ajuste",
  [TransactionReason.DONATION]: "Donación",
  [TransactionReason.DEFEATED]: "Vencido",
  [TransactionReason.LOSS]: "Pérdida",
  [TransactionReason.INTERNAL_USAGE]: "Uso interno",
}

const transactionReasonColors: Record<TransactionReason, string> = {
  [TransactionReason.BUY]: "#38A169",
  [TransactionReason.SELL]: "#805AD5",
  [TransactionReason.RETURN]: "#3182CE",
  [TransactionReason.ADJUSTMENT]: "#718096",
  [TransactionReason.DONATION]: "#319795",
  [TransactionReason.DEFEATED]: "#E53E3E",
  [TransactionReason.LOSS]: "#DD6B20",
  [TransactionReason.INTERNAL_USAGE]: "#D69E2E",
}

const getMovementRecords = (
  inventoryTransactions: IInventoryTransactionFullRelated[] = [],
): MovementReasonRecord[] => {
  const totalsByReason = new Map<TransactionReason, number>()

  inventoryTransactions.forEach((transaction) => {
    if (!transaction.transactionReason) return

    const currentTotal = totalsByReason.get(transaction.transactionReason) ?? 0
    totalsByReason.set(
      transaction.transactionReason,
      currentTotal + Number(transaction.affectedAmount ?? 0),
    )
  })

  return Array.from(totalsByReason.entries())
    .map(([reason, totalAffectedAmount]) => ({
      reason,
      totalAffectedAmount,
      label: transactionReasonLabels[reason],
      color: transactionReasonColors[reason],
    }))
    .sort((current, next) => next.totalAffectedAmount - current.totalAffectedAmount)
}

const RangeButtons = ({
  setNumberOfMonths,
}: {
  setNumberOfMonths: (months: number) => void
}) => {
  return (
    <Flex gap={2} flexWrap="wrap" justifyContent="center" w="100%">
      <Button
        onClick={() => setNumberOfMonths(1)}
        colorScheme="purple"
        variant="ghost"
      >
        1 mes
      </Button>
      <Button
        onClick={() => setNumberOfMonths(3)}
        colorScheme="purple"
        variant="ghost"
      >
        3 meses
      </Button>
      <Button
        onClick={() => setNumberOfMonths(6)}
        colorScheme="purple"
        variant="ghost"
      >
        6 meses
      </Button>
    </Flex>
  )
}

const InventoryMovementsByReasonChart = () => {
  const [numberOfMonths, setNumberOfMonths] = useState<number>(1)
  const queryInventoryTransactionsReport = useInventoryTransactionsReport({
    historyMonthToRetrieve: numberOfMonths,
  })
  const inventoryTransactions =
    (queryInventoryTransactionsReport.data as IInventoryTransactionFullRelated[]) ??
    []
  const records = getMovementRecords(inventoryTransactions)

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Cantidad movida: ${context.parsed.y}`
          },
        },
      },
    },
  }

  const data = {
    labels: records.map((record) => record.label),
    datasets: [
      {
        label: "Cantidad movida",
        data: records.map((record) => record.totalAffectedAmount),
        backgroundColor: records.map((record) => record.color),
        borderRadius: 6,
      },
    ],
  }

  if (queryInventoryTransactionsReport.isLoading) {
    return <Loading />
  }

  if (!queryInventoryTransactionsReport.isLoading && records.length === 0) {
    return (
      <Card variant="outline" mb={3}>
        <CardHeader textAlign="center">
          <Heading size="lg">Movimientos de inventario por motivo</Heading>
        </CardHeader>
        <CardBody textAlign="center">
          <Text>No hay movimientos en los últimos {numberOfMonths} meses.</Text>
        </CardBody>
        <Divider />
        <CardFooter justifyContent="center">
          <RangeButtons setNumberOfMonths={setNumberOfMonths} />
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card variant="outline" mb={3}>
      <CardHeader textAlign="center">
        <Heading size="lg">
          Movimientos de inventario por motivo últimos {numberOfMonths} meses
        </Heading>
        <Text color="gray.600" fontSize="sm" mt={2}>
          Mide la cantidad total movida por cada motivo de inventario.
        </Text>
      </CardHeader>
      <CardBody>
        <Box h="320px" w="100%">
          <Bar options={options} data={data} />
        </Box>
      </CardBody>
      <Divider />
      <CardFooter justifyContent="center">
        <RangeButtons setNumberOfMonths={setNumberOfMonths} />
      </CardFooter>
    </Card>
  )
}

export default InventoryMovementsByReasonChart
