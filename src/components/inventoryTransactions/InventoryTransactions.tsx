import {
  Grid,
  Button,
  Card,
  CardBody,
  Flex,
  Spacer,
  Stack,
  Skeleton,
  Text,
  GridItem,
} from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"

import { useNavigate } from "react-router-dom"

// components
import InventoryTransaction from "./InventoryTransaction"
import WithoutResults from "../common/WithoutResults"

// custom hooks
import { useInventoryTransactions } from "../../hooks/useInventoryTransactions"
import { IInventoryTransactionFullRelated } from "./types"
// import { useError } from "../../hooks/useError"

import { ROLES } from "../common/roles"
import { useCheckRole } from "../../hooks/useCheckRole"

const InventoryTransactions = (): JSX.Element => {
  const queryInventoryTransactions = useInventoryTransactions({})

  const navigate = useNavigate()

  const { checkRole } = useCheckRole()

  // const { throwError } = useError()

  // if (queryCategories?.isError) {
  //   throwError(queryCategories?.error)
  // }

  const handleAddInventoryTransaction = () => {
    navigate("/inventoryTransactions/add")
  }

  const inventoryTransactions =
    queryInventoryTransactions?.data as IInventoryTransactionFullRelated[]

  const inventoryTransactionList = inventoryTransactions?.map(
    (inventoryTransaction) => {
      if (
        inventoryTransaction._id !== undefined &&
        inventoryTransaction.createdAt !== undefined
      ) {
        return (
          <InventoryTransaction
            key={inventoryTransaction?._id + inventoryTransaction?.createdAt}
            inventoryTransaction={inventoryTransaction}
          />
        )
      }
    }
  )

  if (queryInventoryTransactions?.isLoading) {
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
    )
  }

  return (
    <>
      {!queryInventoryTransactions?.isError &&
        !queryInventoryTransactions?.isLoading && (
          <Card bgColor={"#373E68"} variant="filled" mt={5} mb={3}>
            <CardBody>
              <Flex placeItems={"center"}>
                <Text color={"white"} fontWeight={"bold"}>
                  {inventoryTransactionList?.length} transacciones
                </Text>
                <Spacer />
                {checkRole([ROLES.ADMIN]) && (
                  <Button
                    onClick={() => handleAddInventoryTransaction()}
                    colorScheme="purple"
                    variant="solid"
                  >
                    <AddIcon boxSize={3} me={2} />
                    Agregar nueva
                  </Button>
                )}
              </Flex>
            </CardBody>
          </Card>
        )}

      {!queryInventoryTransactions?.isError &&
        queryInventoryTransactions?.data?.length !== undefined &&
        queryInventoryTransactions?.data?.length > 0 &&
        !queryInventoryTransactions?.isLoading && (
          <Grid gap={2} templateColumns="repeat(12, 1fr)">
            <GridItem
              display={{ base: "none", md: "block" }}
              colSpan={{ base: 12, md: 12, lg: 12 }}
              colStart={{ base: 1, md: 1, lg: 1 }}
            >
              <Card variant="outline">
                <CardBody>
                  <Grid
                    templateColumns="repeat(6, 1fr)"
                    gap={2}
                    alignItems={"center"}
                  >
                    <GridItem>
                      <Flex direction="column" gap={2}>
                        <Text fontWeight="bold">Nombre del insumo</Text>
                      </Flex>
                    </GridItem>
                    <GridItem>
                      <Flex direction="column" gap={2} placeItems={"center"}>
                        <Text fontWeight="bold">Tipo</Text>
                      </Flex>
                    </GridItem>
                    <GridItem>
                      <Flex direction="column" gap={2} placeItems={"center"}>
                        <Text fontWeight="bold">Cantidad afectada</Text>
                      </Flex>
                    </GridItem>
                    <GridItem>
                      <Flex direction="column" gap={2} placeItems={"center"}>
                        <Text fontWeight="bold">Realizado por</Text>
                      </Flex>
                    </GridItem>
                    <GridItem>
                      <Flex direction="column" gap={2} placeItems={"center"}>
                        <Text fontWeight="bold">Fecha de creación</Text>
                      </Flex>
                    </GridItem>
                    <GridItem>
                      <Flex direction="column" gap={2} placeItems={"end"}>
                        <Text fontWeight="bold">Acciones</Text>
                      </Flex>
                    </GridItem>
                  </Grid>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem
              colSpan={{ base: 12, md: 12, lg: 12 }}
              colStart={{ base: 1, md: 1, lg: 1 }}
            >
              {inventoryTransactionList}
            </GridItem>
          </Grid>
        )}
      {!queryInventoryTransactions?.isError &&
        queryInventoryTransactions?.data?.length === 0 &&
        !queryInventoryTransactions?.isLoading && (
          <WithoutResults
            text={"No hay transacciones de inventario cargadas."}
          />
        )}
    </>
  )
}

export default InventoryTransactions
