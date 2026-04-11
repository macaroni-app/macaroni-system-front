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
} from "@chakra-ui/react";

import { useInventories } from "../../hooks/useInventories";

import { IInventoryFullRelated } from "../inventories/types";

const QuickInventoryReport = () => {
  const queryInventories = useInventories({});
  const inventories = queryInventories.inventories as IInventoryFullRelated[];

  const listInventories = inventories
    ?.filter((inventory) => inventory.asset?.isActive)
    ?.map((inventory) => {
      if (inventory?._id !== undefined && inventory?.createdAt !== undefined) {
        return (
          <Tr key={inventory?._id + inventory?.createdAt}>
            <Td>{inventory.asset?.name}</Td>
            <Td></Td>
            <Td isNumeric>{inventory.quantityAvailable}</Td>
            <Td isNumeric>{inventory.quantityReserved}</Td>
            <Td isNumeric>
              {Number(inventory.quantityAvailable) -
                Number(inventory?.quantityReserved)}
            </Td>
          </Tr>
        );
      }
    });

  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
      <GridItem colSpan={{ base: 12 }}>
        <Card variant="outline">
          <CardHeader textAlign={"center"}>
            <Heading size={"lg"}>Inventarios disponibles</Heading>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table size="sm">
                {/* <TableCaption>Cantidades disponibles</TableCaption> */}
                <Thead>
                  <Tr>
                    <Th>Insumo</Th>
                    <Th></Th>
                    <Th isNumeric>Fisico</Th>
                    <Th isNumeric>Reservado</Th>
                    <Th isNumeric>Disponible</Th>
                  </Tr>
                </Thead>
                <Tbody>{listInventories}</Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};

export default QuickInventoryReport;
