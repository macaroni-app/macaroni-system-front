import {
  Badge,
  Button,
  Grid,
  Card,
  CardBody,
  Flex,
  GridItem,
  Spacer,
  Stack,
  Skeleton,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// components
import Inventory from "./Inventory";
import WithoutResults from "../common/WithoutResults";
import NewRecordPanel from "../common/NewRecordPanel";

// custom hooks
import { useInventories } from "../../hooks/useInventories";
import { IInventoryFullRelated } from "./types";
// import { useError } from "../../hooks/useError"

import ProfileBase from "../common/permissions";

const Inventories = (): JSX.Element => {
  const queryInventories = useInventories({});
  const [showOnlyReserved, setShowOnlyReserved] = useState(false)

  const navigate = useNavigate();

  // const { throwError } = useError()

  // if (queryCategories?.isError) {
  //   throwError(queryCategories?.error)
  // }

  const handleAddInventory = () => {
    navigate("/inventories/add");
  };

  const inventories = queryInventories?.inventories as IInventoryFullRelated[];
  const filteredInventories = useMemo(() => {
    if (!showOnlyReserved) {
      return inventories
    }

    return inventories?.filter(
      (inventory) => Number(inventory.quantityReserved ?? 0) > 0,
    )
  }, [inventories, showOnlyReserved])

  const inventorySummary = useMemo(() => {
    return (inventories ?? []).reduce(
      (accumulator, inventory) => {
        const quantityAvailable = Number(inventory.quantityAvailable ?? 0)
        const quantityReserved = Number(inventory.quantityReserved ?? 0)
        const quantitySellable = quantityAvailable - quantityReserved

        accumulator.totalPhysical += quantityAvailable
        accumulator.totalReserved += quantityReserved
        accumulator.totalSellable += quantitySellable
        if (quantityReserved > 0) {
          accumulator.assetsWithReservations += 1
        }

        return accumulator
      },
      {
        totalPhysical: 0,
        totalReserved: 0,
        totalSellable: 0,
        assetsWithReservations: 0,
      },
    )
  }, [inventories])

  const inventoryList = filteredInventories?.map((inventory) => {
    if (inventory._id !== undefined && inventory.createdAt !== undefined) {
      return (
        <Inventory
          key={inventory?._id + inventory?.createdAt}
          inventory={inventory}
        />
      );
    }
  });

  if (queryInventories?.isLoading) {
    return (
      <>
        <Card variant="outline" mt={5} mb={3}>
          <CardBody>
            <Stack>
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </Stack>
          </CardBody>
        </Card>
        <Card variant="filled" mb={3}>
          <CardBody>
            <Flex>
              <Spacer />
              <Skeleton
                width={"170px"}
                startColor="purple.500"
                endColor="purple.300"
                height="40px"
                borderRadius={"5px"}
              />
            </Flex>
          </CardBody>
        </Card>
        <Card variant="outline" mb={3}>
          <CardBody>
            <Stack>
              <Skeleton height="10px" />
              <Skeleton height="10px" />
              <Skeleton height="10px" />
            </Stack>
          </CardBody>
        </Card>
        <Card variant="outline" mb={3}>
          <CardBody>
            <Stack>
              <Skeleton height="10px" />
              <Skeleton height="10px" />
              <Skeleton height="10px" />
            </Stack>
          </CardBody>
        </Card>
        <Card variant="outline" mb={3}>
          <CardBody>
            <Stack>
              <Skeleton height="10px" />
              <Skeleton height="10px" />
              <Skeleton height="10px" />
            </Stack>
          </CardBody>
        </Card>
        <Card variant="outline" mb={3}>
          <CardBody>
            <Stack>
              <Skeleton height="10px" />
              <Skeleton height="10px" />
              <Skeleton height="10px" />
            </Stack>
          </CardBody>
        </Card>
        <Card variant="outline" mb={3}>
          <CardBody>
            <Stack>
              <Skeleton height="10px" />
              <Skeleton height="10px" />
              <Skeleton height="10px" />
            </Stack>
          </CardBody>
        </Card>
      </>
    );
  }

  return (
    <>
      {!queryInventories?.isError && !queryInventories?.isLoading && (
        <NewRecordPanel
          handleAddRecord={handleAddInventory}
          noRecords={filteredInventories?.length}
          title="inventarios"
          buttonLabel="Nuevo inventario"
          roles={ProfileBase.inventories.create}
        />
      )}

      {!queryInventories?.isError && !queryInventories?.isLoading && (
        <>
          <Grid templateColumns="repeat(12, 1fr)" gap={3} mb={3}>
            <GridItem colSpan={{ base: 12, md: 6, lg: 3 }}>
              <Card variant="outline">
                <CardBody>
                  <Stat>
                    <StatLabel>Stock fisico total</StatLabel>
                    <StatNumber>{inventorySummary.totalPhysical}</StatNumber>
                    <StatHelpText>Suma total cargada en inventario</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 6, lg: 3 }}>
              <Card variant="outline">
                <CardBody>
                  <Stat>
                    <StatLabel>Total reservado</StatLabel>
                    <StatNumber color={inventorySummary.totalReserved > 0 ? "orange.500" : undefined}>
                      {inventorySummary.totalReserved}
                    </StatNumber>
                    <StatHelpText>No disponible para vender</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 6, lg: 3 }}>
              <Card variant="outline">
                <CardBody>
                  <Stat>
                    <StatLabel>Total vendible</StatLabel>
                    <StatNumber color={inventorySummary.totalSellable > 0 ? "green.600" : "red.500"}>
                      {inventorySummary.totalSellable}
                    </StatNumber>
                    <StatHelpText>Stock disponible ahora</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 6, lg: 3 }}>
              <Card variant="outline">
                <CardBody>
                  <Stat>
                    <StatLabel>Insumos con reserva</StatLabel>
                    <StatNumber>{inventorySummary.assetsWithReservations}</StatNumber>
                    <StatHelpText>Pedidos que bloquean stock</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          <Card variant="outline" mb={3}>
            <CardBody>
              <Flex justifyContent="space-between" alignItems="center" wrap="wrap" gap={3}>
                <Flex alignItems="center" gap={2} wrap="wrap">
                  <Text fontWeight="bold">Vista de reservas</Text>
                  {showOnlyReserved && (
                    <Badge colorScheme="orange">Solo con reserva</Badge>
                  )}
                </Flex>
                <Button
                  variant={showOnlyReserved ? "solid" : "outline"}
                  colorScheme="orange"
                  onClick={() => setShowOnlyReserved((currentValue) => !currentValue)}
                >
                  {showOnlyReserved ? "Ver todos" : "Solo con reserva"}
                </Button>
              </Flex>
            </CardBody>
          </Card>
        </>
      )}

      {!queryInventories?.isError &&
        filteredInventories?.length !== undefined &&
        filteredInventories?.length > 0 &&
        !queryInventories?.isLoading && <Grid>{inventoryList}</Grid>}
      {!queryInventories?.isError &&
        filteredInventories?.length === 0 &&
        !queryInventories?.isLoading && (
          <WithoutResults text={showOnlyReserved ? "No hay insumos con stock reservado." : "No hay inventarios cargados."} />
        )}
    </>
  );
};

export default Inventories;
