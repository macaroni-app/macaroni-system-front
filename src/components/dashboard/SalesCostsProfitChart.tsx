import { useEffect, useRef, useState } from "react"

import {
  ColorType,
  LineSeries,
  createChart,
  type LineData,
} from "lightweight-charts"
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
  Link,
  Text,
} from "@chakra-ui/react"

import { useSalesReport } from "../../hooks/useSalesReport"
import { ISaleFullRelated } from "../sales/types"
import { groupSalesByMonth, MonthData } from "../../utils/reports"
import Loading from "../common/Loading"

type MonthlyComparisonChartProps = {
  records: MonthData[]
}

type LegendItemProps = {
  color: string
  label: string
}

const salesColor = "#805AD5"
const costsColor = "#DD6B20"
const profitColor = "#38A169"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    minimumFractionDigits: 2,
    currency: "USD",
  }).format(amount)
}

const getMonthTime = (record: MonthData) => {
  return `${record.year}-${String(record.month).padStart(2, "0")}-01`
}

const getSeriesData = (
  records: MonthData[],
  getValue: (record: MonthData) => number
): LineData[] => {
  return records.map((record) => ({
    time: getMonthTime(record),
    value: Number(getValue(record).toFixed(2)),
  }))
}

const LegendItem = ({ color, label }: LegendItemProps) => {
  return (
    <Flex alignItems="center" gap={2}>
      <Box bg={color} borderRadius="full" h="10px" w="10px" />
      <Text color="gray.600" fontSize="sm" fontWeight="medium">
        {label}
      </Text>
    </Flex>
  )
}

const MonthlyComparisonChart = ({ records }: MonthlyComparisonChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      height: 340,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#4A5568",
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "#EDF2F7" },
        horzLines: { color: "#EDF2F7" },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: false,
        secondsVisible: false,
      },
      localization: {
        priceFormatter: (price: number) => formatCurrency(price),
      },
    })

    const salesSeries = chart.addSeries(LineSeries, {
      color: salesColor,
      lineWidth: 3,
      priceLineVisible: false,
      lastValueVisible: false,
    })
    const costsSeries = chart.addSeries(LineSeries, {
      color: costsColor,
      lineWidth: 3,
      priceLineVisible: false,
      lastValueVisible: false,
    })
    const profitSeries = chart.addSeries(LineSeries, {
      color: profitColor,
      lineWidth: 3,
      priceLineVisible: false,
      lastValueVisible: false,
    })

    salesSeries.setData(getSeriesData(records, (record) => record.total))
    costsSeries.setData(getSeriesData(records, (record) => record.costCotal))
    profitSeries.setData(
      getSeriesData(records, (record) => record.total - record.costCotal)
    )
    chart.timeScale().fitContent()

    const resizeObserver = new ResizeObserver(([entry]) => {
      chart.applyOptions({
        width: Math.floor(entry.contentRect.width),
      })
    })

    resizeObserver.observe(chartContainerRef.current)

    return () => {
      resizeObserver.disconnect()
      chart.remove()
    }
  }, [records])

  return <Box ref={chartContainerRef} minH="340px" w="100%" />
}

const SalesCostsProfitChart = () => {
  const [numberOfMonth, setNumberOfMonth] = useState<number>(12)

  const querySalesReport = useSalesReport({
    historyMonthToRetrieve: numberOfMonth,
  })
  const sales = querySalesReport.data as ISaleFullRelated[]
  const paidSales = sales?.filter((sale) => sale?.status === "PAID") ?? []
  const groupedSales = groupSalesByMonth(paidSales, numberOfMonth)

  if (querySalesReport?.isLoading) {
    return <Loading />
  }

  if (!querySalesReport?.isLoading && paidSales?.length === 0) {
    return (
      <Card variant="outline" mb={3}>
        <CardBody textAlign="center">
          <Text>No hay datos</Text>
        </CardBody>
      </Card>
    )
  }

  if (!querySalesReport?.isLoading && groupedSales?.length > 0) {
    return (
      <Card variant="outline" mb={3}>
        <CardHeader textAlign="center">
          <Heading size="lg">
            Ventas vs costos vs ganancia últimos {numberOfMonth} meses
          </Heading>
        </CardHeader>
        <CardBody>
          <Flex
            gap={4}
            justifyContent="center"
            mb={4}
            flexWrap="wrap"
          >
            <LegendItem color={salesColor} label="Ventas" />
            <LegendItem color={costsColor} label="Costos" />
            <LegendItem color={profitColor} label="Ganancia" />
          </Flex>
          <MonthlyComparisonChart records={groupedSales} />
          <Text mt={2} fontSize="xs" color="gray.500" textAlign="right">
            Gráfico por{" "}
            <Link
              href="https://www.tradingview.com/"
              isExternal
              color="purple.500"
            >
              TradingView
            </Link>
          </Text>
        </CardBody>
        <Divider />
        <CardFooter justifyContent="center">
          <Flex gap={2} flexWrap="wrap" justifyContent="center" w="100%">
            <Button
              onClick={() => setNumberOfMonth(24)}
              colorScheme="purple"
              variant="ghost"
            >
              24 meses
            </Button>
            <Button
              onClick={() => setNumberOfMonth(18)}
              colorScheme="purple"
              variant="ghost"
            >
              18 meses
            </Button>
            <Button
              onClick={() => setNumberOfMonth(12)}
              colorScheme="purple"
              variant="ghost"
            >
              12 meses
            </Button>
            <Button
              onClick={() => setNumberOfMonth(6)}
              colorScheme="purple"
              variant="ghost"
            >
              6 meses
            </Button>
            <Button
              onClick={() => setNumberOfMonth(3)}
              colorScheme="purple"
              variant="ghost"
            >
              3 meses
            </Button>
          </Flex>
        </CardFooter>
      </Card>
    )
  }

  return null
}

export default SalesCostsProfitChart
