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
import { Bar } from "react-chartjs-2"
import {
  Text,
  Card,
  CardBody,
  Divider,
  CardHeader,
  Heading,
} from "@chakra-ui/react"

// components
import Loading from "../common/Loading"

// useHooks
import { useInventories } from "../../hooks/useInventories"

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

  const queryInventory = useInventories({})
  const inventories = queryInventory.data

  const options = {
    responsive: true,
    type: "Bar",
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  const data = {
    labels: inventories?.map(inventory => inventory.asset?.name),
    datasets: [
      {
        data: inventories?.map(inventory => Number(inventory.asset?.costPrice) * Number(inventory.quantityAvailable)),
        backgroundColor: ["#805AD5"],
      },
    ],
  }

  if (queryInventory?.isLoading) {
    return <Loading />
  }

  if (!queryInventory?.isLoading && inventories?.length === 0) {
    return (
      <Card variant="outline" mb={3}>
        <CardBody textAlign={"center"}>
          <Text>No hay datos</Text>
        </CardBody>
      </Card>
    )
  }

  if (!queryInventory?.isLoading && inventories?.length !== undefined && inventories?.length > 0) {
    return (
      <>
        <Card variant="outline" mb={3}>
          <CardHeader textAlign={"center"}>
            <Heading size={"lg"}>
              Costo del inventario
            </Heading>
          </CardHeader>
          <CardBody>
            <Bar options={options} data={data} />
          </CardBody>
          <Divider />
        </Card>
      </>
    )
  }
}

export default BarChart
