import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  type ChartOptions,
} from "chart.js"
import { Doughnut } from "react-chartjs-2"
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react"

import { useOrderRequests } from "../../hooks/useOrderRequests"
import {
  IOrderRequestFullRelated,
  OrderRequestStatus,
} from "../orderRequests/types"
import Loading from "../common/Loading"

ChartJS.register(ArcElement, Tooltip, Legend)

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    minimumFractionDigits: 2,
    currency: "USD",
  }).format(amount)
}

const PendingOrderPaymentsChart = () => {
  const queryOrderRequests = useOrderRequests({})
  const orderRequests =
    (queryOrderRequests.data as IOrderRequestFullRelated[]) ?? []
  const activeOrderRequests = orderRequests.filter((orderRequest) => {
    return (
      orderRequest.status !== OrderRequestStatus.CANCELLED &&
      orderRequest.status !== OrderRequestStatus.CONVERTED
    )
  })
  const summary = activeOrderRequests.reduce(
    (accumulator, orderRequest) => {
      const paidAmount = Number(orderRequest.paidAmount ?? 0)
      const pendingAmount = Number(orderRequest.pendingAmount ?? 0)

      accumulator.totalPaid += paidAmount
      accumulator.totalPending += pendingAmount
      if (pendingAmount > 0) {
        accumulator.ordersWithPendingAmount += 1
      }

      return accumulator
    },
    {
      totalPaid: 0,
      totalPending: 0,
      ordersWithPendingAmount: 0,
    },
  )
  const hasAmounts = summary.totalPaid > 0 || summary.totalPending > 0

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: ${formatCurrency(Number(context.raw ?? 0))}`
          },
        },
      },
    },
  }

  const data = {
    labels: ["Cobrado", "Pendiente"],
    datasets: [
      {
        data: [summary.totalPaid, summary.totalPending],
        backgroundColor: ["#38A169", "#DD6B20"],
        borderColor: ["#FFFFFF", "#FFFFFF"],
        borderWidth: 2,
      },
    ],
  }

  if (queryOrderRequests.isLoading) {
    return <Loading />
  }

  if (!queryOrderRequests.isLoading && activeOrderRequests.length === 0) {
    return (
      <Card variant="outline" mb={3}>
        <CardBody textAlign="center">
          <Text>No hay pedidos activos para analizar cobros.</Text>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card variant="outline" mb={3}>
      <CardHeader textAlign="center">
        <Heading size="lg">Cobros pendientes en pedidos</Heading>
        <Text color="gray.600" fontSize="sm" mt={2}>
          Incluye pedidos borrador y confirmados; excluye cancelados y
          convertidos.
        </Text>
      </CardHeader>
      <CardBody>
        <Grid templateColumns="repeat(12, 1fr)" gap={4} alignItems="center">
          <GridItem colSpan={{ base: 12, md: 5 }}>
            {hasAmounts ? (
              <Flex h="260px" justifyContent="center">
                <Doughnut options={options} data={data} />
              </Flex>
            ) : (
              <Flex h="260px" alignItems="center" justifyContent="center">
                <Text color="gray.500" textAlign="center">
                  Los pedidos activos no tienen importes pendientes ni cobrados.
                </Text>
              </Flex>
            )}
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 7 }}>
            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Card variant="outline">
                  <CardBody>
                    <Stat>
                      <StatLabel>Total cobrado</StatLabel>
                      <StatNumber color="green.600">
                        {formatCurrency(summary.totalPaid)}
                      </StatNumber>
                      <StatHelpText>Pagos registrados en pedidos</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Card variant="outline">
                  <CardBody>
                    <Stat>
                      <StatLabel>Total pendiente</StatLabel>
                      <StatNumber color="orange.500">
                        {formatCurrency(summary.totalPending)}
                      </StatNumber>
                      <StatHelpText>Saldo por cobrar antes de convertir</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                <Card variant="outline">
                  <CardBody>
                    <Stat>
                      <StatLabel>Pedidos con saldo</StatLabel>
                      <StatNumber>
                        {summary.ordersWithPendingAmount}
                      </StatNumber>
                      <StatHelpText>
                        Pedidos activos que todavía no están saldados
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>
      </CardBody>
      <Divider />
    </Card>
  )
}

export default PendingOrderPaymentsChart
