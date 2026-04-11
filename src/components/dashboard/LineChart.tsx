import { useEffect, useRef, useState } from "react"

import {
  AreaSeries,
  ColorType,
  createChart,
  type AreaData,
} from "lightweight-charts"
import {
  Text,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  Button,
  CardHeader,
  Heading,
  Box,
  Link,
} from "@chakra-ui/react"

// custom hooks
import { useSalesReport } from "../../hooks/useSalesReport"

// components
import Loading from "../common/Loading"

// types
import { ISaleFullRelated } from "../sales/types"

import { groupSalesByMonth, MonthData } from "../../utils/reports"

interface ProfitAreaChartProps {
  profitRecords: MonthData[]
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    minimumFractionDigits: 2,
    currency: "USD",
  }).format(amount)
}

const getMonthTime = (profitRecord: MonthData) => {
  return `${profitRecord.year}-${String(profitRecord.month).padStart(2, "0")}-01`
}

const ProfitAreaChart = ({ profitRecords }: ProfitAreaChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      height: 320,
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

    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: "#805AD5",
      topColor: "rgba(128, 90, 213, 0.35)",
      bottomColor: "rgba(128, 90, 213, 0.02)",
      lineWidth: 3,
      priceLineVisible: false,
      lastValueVisible: false,
    })

    const chartData: AreaData[] = profitRecords.map((profitRecord) => ({
      time: getMonthTime(profitRecord),
      value: Number(profitRecord.total.toFixed(2)),
    }))

    areaSeries.setData(chartData)
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
  }, [profitRecords])

  return <Box ref={chartContainerRef} minH="320px" w="100%" />
}


const LineChart = () => {

  const [numberOfMonth, setNumberOfMonth] = useState<number>(12)

  // sales
  const querySalesReport = useSalesReport({ historyMonthToRetrieve: numberOfMonth })
  const sales = querySalesReport.data as ISaleFullRelated[]

  const groupedSales = groupSalesByMonth(sales?.filter(sale => sale?.status === 'PAID'), numberOfMonth)

  // profits
  const profitRecords: MonthData[] = []

  groupedSales?.forEach(groupedSale => {
    profitRecords.push({ ...groupedSale, total: groupedSale.total - groupedSale.costCotal })
  })


  const profitRecordList = profitRecords?.map((profitRecord) => {
    return (
      <Card key={`${profitRecord.month}-${profitRecord.year}`} variant="outline" mb={3}>
        <CardBody>
          <Flex direction="row" justifyContent={"space-between"}>
            <Text>{profitRecord.monthName} del {profitRecord.year}</Text>
            <Text as={"span"} fontWeight={"bold"}>
              {formatCurrency(profitRecord.total)}
            </Text>
          </Flex>
        </CardBody>
      </Card>
    )
  })
    .reverse()

  if (querySalesReport?.isLoading) {
    return <Loading />
  }

  if (!querySalesReport?.isLoading && profitRecords?.length === 0) {
    return (
      <Card variant="outline" mb={3}>
        <CardBody textAlign={"center"}>
          <Text>No hay datos</Text>
        </CardBody>
      </Card>
    )
  }

  if (!querySalesReport?.isLoading && profitRecords?.length > 0) {
    return (
      <>
        <Card variant="outline" mb={3}>
          <CardHeader textAlign={"center"}>
            <Heading size={"lg"}>
              Ganancia últimos {numberOfMonth} meses
            </Heading>
          </CardHeader>
          <CardBody>
            <ProfitAreaChart profitRecords={profitRecords} />
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
          <CardFooter justifyContent={"center"}>
            <Flex
              gap={2}
              flexWrap="wrap"
              justifyContent="center"
              w="100%"
            >
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
        {profitRecordList}
      </>
    )
  }
}

export default LineChart
