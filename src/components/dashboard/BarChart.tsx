import { useState } from "react"

import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  Title,
} from "chart.js"
import { Line } from "react-chartjs-2"
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
} from "@chakra-ui/react"

// custom hooks
import { useSaleItemsReport } from "../../hooks/useSaleItemsReport"
import { useSalesReport } from "../../hooks/useSalesReport"

// components
import Loading from "../common/Loading"

// types
import { ISaleFullRelated, ISaleItemFullRelated } from "../sales/types"

import { groupSaleItemByMonth, groupSalesByMonth, MonthData } from "../../utils/reports"

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  Title
)


const BarChart = () => {

  const [numberOfMonth, setNumberOfMonth] = useState<number>(12)

  // saleItems
  const querySaleItemsReport = useSaleItemsReport({
    historyMonthToRetrieve: 12,
  })

  const saleItems = querySaleItemsReport.data as ISaleItemFullRelated[]

  const groupedSaleItems = groupSaleItemByMonth(saleItems?.filter(saleItem => saleItem.sale?.status === 'PAID'), numberOfMonth)

  // sales
  const querySalesReport = useSalesReport({ historyMonthToRetrieve: 12 })
  const sales = querySalesReport.data as ISaleFullRelated[]

  const groupedSales = groupSalesByMonth(sales?.filter(sale => sale?.status === 'PAID'), numberOfMonth)

  // profits
  const profitRecords: MonthData[] = []

  groupedSales?.forEach(groupedSale => {
    groupedSaleItems?.forEach(groupedSaleItem => {
      if (groupedSale.month === groupedSaleItem.month && groupedSale.year === groupedSaleItem.year) {
        profitRecords.push({ ...groupedSale, total: groupedSale.total - groupedSaleItem.total })
      }
    })
  })


  const options = {
    responsive: true,
    type: "Line",
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  const data = {
    labels: profitRecords?.map(profitRecord => profitRecord.monthName),
    datasets: [
      {
        data: profitRecords?.map(profitRecord => profitRecord.total)
          .map((current) => current),
        backgroundColor: ["#805AD5"],
      },
    ],
  }

  const profitRecordList = profitRecords?.map((profitRecord) => {
    return (
      <Card key={profitRecord.month} variant="outline" mb={3}>
        <CardBody>
          <Flex direction="row" justifyContent={"space-between"}>
            <Text>{profitRecord.monthName} del {profitRecord.year}</Text>
            <Text as={"span"} fontWeight={"bold"}>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                minimumFractionDigits: 2,
                currency: "USD",
              }).format(profitRecord.total)}
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
            <Line options={options} data={data} />
          </CardBody>
          <Divider />
          <CardFooter justifyContent={"center"}>
            <Flex gap={2}>
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

export default BarChart
