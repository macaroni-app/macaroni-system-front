import {
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Heading,
  Text
} from "@chakra-ui/react"

// custom hooks
import { useInventoryTransactions } from "../../hooks/useInventoryTransactions"

// types
import { IInventoryTransactionFullRelated } from "../inventoryTransactions/types"

// utils
import { agruparYSumarTransaccionesPorMes, monthNames, TransactionResult } from "../../utils/reports"

const InventoryTransactionReport = () => {

  const queryInventoryTransactions = useInventoryTransactions({})
  const inventoryTransactions = queryInventoryTransactions.data as IInventoryTransactionFullRelated[]

  const currentMonth = new Date().getMonth()

  const transactionGrouped: TransactionResult[] = agruparYSumarTransaccionesPorMes(inventoryTransactions)

  const listTransactions = transactionGrouped?.filter(aTransactionGrouped => aTransactionGrouped.transactionReason === 'BUY')?.map(aTransactionGrouped => {
    if (aTransactionGrouped?.asset?._id !== undefined && aTransactionGrouped?.asset.createdAt !== undefined) {
      return (
        <Tr key={aTransactionGrouped?.asset?._id + aTransactionGrouped?.asset.createdAt}>
          <Td>{aTransactionGrouped.asset?.name}</Td>
          <Td></Td>
          <Td isNumeric>{aTransactionGrouped.affectedAmount}</Td>
          <Td isNumeric>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              minimumFractionDigits: 2,
              currency: "USD",
            }).format(
              aTransactionGrouped?.total !== undefined
                ? Number.parseFloat(aTransactionGrouped?.total?.toFixed(2))
                : 0
            )}
          </Td>
        </Tr>
      )
    }
  })

  if (!queryInventoryTransactions?.isLoading && queryInventoryTransactions?.data?.length === 0) {
    return (
      <Card variant="outline" mb={3}>
        <CardHeader textAlign={"center"}>
          <Heading size={"lg"}>
            Compras mes de {monthNames[currentMonth]}
          </Heading>
        </CardHeader>
        <CardBody textAlign={"center"}>
          <Text>No hay datos</Text>
        </CardBody>
      </Card>
    )
  }

  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
      <GridItem colSpan={{ base: 12 }}>
        <Card variant="outline">
          <CardHeader textAlign={"center"}>
            <Heading size={"lg"}>
              Compras mes de {monthNames[currentMonth]}
            </Heading>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table size="sm">
                {/* <TableCaption>Cantidades disponibles</TableCaption> */}
                <Thead>
                  <Tr>
                    <Th>Insumo</Th>
                    <Th></Th>
                    <Th isNumeric>Cantidad</Th>
                    <Th isNumeric>Total</Th>
                  </Tr>
                </Thead>
                <Tbody>{listTransactions}</Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  )
}

export default InventoryTransactionReport
