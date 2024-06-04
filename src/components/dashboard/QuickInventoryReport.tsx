import {
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Text,
  Table,
  // TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"

import { useInventories } from "../../hooks/useInventories"

import { IInventoryFullRelated } from "../inventories/types"

const QuickInventoryReport = () => {
  const queryInventories = useInventories({})
  const inventories = queryInventories.data as IInventoryFullRelated[]

  const listInventories = inventories
    ?.filter((inventory) => inventory.asset?.isActive)
    ?.map((inventory) => {
      if (inventory?._id !== undefined && inventory?.createdAt !== undefined) {
        return (
          <Tr key={inventory?._id + inventory?.createdAt}>
            <Td>{inventory.asset?.name}</Td>
            <Td></Td>
            <Td isNumeric>{inventory.quantityAvailable}</Td>
          </Tr>
        )
      }
    })

  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
      <GridItem colSpan={{ base: 12 }}>
        <Card variant="outline">
          <CardHeader>
            <Text textAlign={"center"}>Stock disponibles</Text>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table size="sm">
                {/* <TableCaption>Cantidades disponibles</TableCaption> */}
                <Thead>
                  <Tr>
                    <Th>Insumo</Th>
                    <Th></Th>
                    <Th isNumeric>Stock</Th>
                  </Tr>
                </Thead>
                <Tbody>{listInventories}</Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  )
}

export default QuickInventoryReport
