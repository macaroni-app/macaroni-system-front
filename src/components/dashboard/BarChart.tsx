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
import { Bar, Line } from "react-chartjs-2"
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

// typeps
import { ISaleFullRelated, ISaleItemFullRelated, SaleStatus } from "../sales/types"

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

  const querySaleItemsReport = useSaleItemsReport({
    historyMonthToRetrieve: 12,
  })

  const saleItems = querySaleItemsReport.data as ISaleItemFullRelated[]

  const [numberOfMonth, setNumberOfMonth] = useState(12)

  let costObj = {
    1: { total: 0 },
    2: { total: 0 },
    3: { total: 0 },
    4: { total: 0 },
    5: { total: 0 },
    6: { total: 0 },
    7: { total: 0 },
    8: { total: 0 },
    9: { total: 0 },
    10: { total: 0 },
    11: { total: 0 },
    12: { total: 0 },
  }

  saleItems?.forEach((saleDetail) => {
    if (saleDetail.sale?.status === SaleStatus.PAID) {
      if (costObj.hasOwnProperty(new Date(saleDetail.createdAt).getMonth() + 1)) {
        if (saleDetail.product !== null) {
          costObj[new Date(saleDetail.createdAt).getMonth() + 1].total +=
            saleDetail?.product?.costPrice * saleDetail?.quantity
        }
      } else {
        if (saleDetail.product !== null) {
          costObj[new Date(saleDetail.createdAt).getMonth() + 1] = {
            total: saleDetail?.product?.costPrice * saleDetail?.quantity,
          }
        }
      }
    }
  })

  const costArr = Object.keys(costObj).map((key) => {
    return {
      ...costObj[key],
      month: Number.parseInt(key),
    }
  })

  const querySalesReport = useSalesReport({ historyMonthToRetrieve: 12 })
  const sales = querySalesReport.data as ISaleFullRelated[]

  let obj = {
    1: { total: 0 },
    2: { total: 0 },
    3: { total: 0 },
    4: { total: 0 },
    5: { total: 0 },
    6: { total: 0 },
    7: { total: 0 },
    8: { total: 0 },
    9: { total: 0 },
    10: { total: 0 },
    11: { total: 0 },
    12: { total: 0 },
  }
  sales?.forEach((sale) => {
    if (sale?.status === SaleStatus.PAID) {
      if (obj.hasOwnProperty(new Date(sale.createdAt).getMonth() + 1)) {
        obj[new Date(sale.createdAt).getMonth() + 1].total += sale.total
      } else {
        obj[new Date(sale.createdAt).getMonth() + 1] = {
          total: sale.total
        }
      }
    }
  })
  const saleArr = Object.keys(obj).map((key) => {
    return {
      ...obj[key],
      month: Number.parseInt(key),
    }
  })

  const profitArr = []
  saleArr.forEach((sale) => {
    costArr.forEach((cost) => {
      {
        if (sale.month === cost.month) {
          profitArr.push({ total: sale.total - cost.total, month: sale.month })
        }
      }
    })
  })


  const total = sales
    ?.map((sale) => {
      if (sale.status === SaleStatus.PAID) {
        return sale?.total
      }
    })
    ?.reduce((acc, currentValue) => acc + currentValue, 0)
    .toFixed(2)

  const options = {
    responsive: true,
    type: "Line",
    plugins: {
      legend: {
        display: false,
      },
      // title: {
      //   display: true,
      //   text: `Ganancia últimos ${numberOfMonth} meses`,
      // },
    },
  }

  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ]

  const monthsLong = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  let currentMonth = new Date().getMonth() + 1

  // const data = {
  //   labels: months,
  //   datasets: [
  //     {
  //       data: [200, 2000, 200, 300, 4000, 430, 499, 200, 100, 400, 299, 700],
  //       backgroundColor: ["#805AD5"],
  //     },
  //   ],
  // }

  const getLastMonths = (monthCount: number, excludeCurrentMonth: boolean) => {
    //debugger;  
    let currentDate = new Date(); // Get the current date
    let monthsInterno = []; // Array to store the last N months
    let profits = []

    // if the current month should be excluded, off by default
    if (excludeCurrentMonth) {
      currentDate.setMonth(currentDate.getMonth() - 1);
    }

    for (var i = 0; i < monthCount; i++) {
      let currentMonth = currentDate.getMonth(); // Get the current month (0-11)
      let currentYear = currentDate.getFullYear(); // Get the current year

      // Add the current month and year to the array
      monthsInterno.unshift(currentYear + " - " + (currentMonth + 1));
      profits.unshift(profitArr[currentMonth])

      // Move to the previous month
      currentDate.setMonth(currentDate.getMonth() - 1);
    }

    return profits
  }

  const data = {
    labels: getLastMonths(numberOfMonth, false).map(current => months[current.month - 1]),
    datasets: [
      {
        data: getLastMonths(numberOfMonth, false)
          .map((current) => current.total),
        backgroundColor: ["#805AD5"],
      },
    ],
  }

  const lastTwelveYears = getLastMonths(numberOfMonth, false)
    .map((current) => {
      return (
        <Card key={current.month} variant="outline" mb={3}>
          <CardBody>
            <Flex direction="row" justifyContent={"space-between"}>
              <Text>{monthsLong[current.month - 1]}:</Text>
              <Text as={"span"} fontWeight={"bold"}>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  minimumFractionDigits: 2,
                  currency: "USD",
                }).format(current.total)}
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

  if (!querySalesReport?.isLoading && total?.length === 0) {
    return <Text>No hay datos</Text>
  }

  if (!querySalesReport?.isLoading && total?.length > 0) {
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
        {lastTwelveYears}
      </>
    )
  }
}

export default BarChart
