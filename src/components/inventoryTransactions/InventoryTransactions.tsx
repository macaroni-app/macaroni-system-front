import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Badge,
  Button,
  Card,
  CardBody,
  Collapse,
  Flex,
  Grid,
  GridItem,
  Skeleton,
  Spacer,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"

// components
import InventoryTransaction from "./InventoryTransaction"
import WithoutResults from "../common/WithoutResults"
import NewRecordPanel from "../common/NewRecordPanel"
import RangeDateFilter, { RangeDate } from "../common/RangeDateFilter"

// custom hooks
import { useInventoryTransactions } from "../../hooks/useInventoryTransactions"
import { IInventoryTransactionFullRelated } from "./types"
import { useTodayDate } from "../../hooks/useTodayDate"
import { useCheckRole } from "../../hooks/useCheckRole"
// import { useError } from "../../hooks/useError"

import ProfileBase from "../common/permissions"

const InventoryTransactions = (): JSX.Element => {
  const today = useTodayDate()
  const [rangeDate, setRangeDate] = useState({
    startDate: today,
    endDate: today,
  })
  const { isOpen, onToggle } = useDisclosure()

  const queryInventoryTransactions = useInventoryTransactions({
    startDate: rangeDate.startDate,
    endDate: rangeDate.endDate,
  })

  const inventoryTransactions =
    queryInventoryTransactions?.data as IInventoryTransactionFullRelated[]

  const navigate = useNavigate()

  const { checkRole } = useCheckRole()

  // const { throwError } = useError()

  // if (queryCategories?.isError) {
  //   throwError(queryCategories?.error)
  // }

  const onSubmit = (nextRangeDate: RangeDate) => {
    if (
      nextRangeDate.startDate !== undefined &&
      nextRangeDate.endDate !== undefined
    ) {
      setRangeDate({
        startDate: nextRangeDate.startDate,
        endDate: nextRangeDate.endDate,
      })
    }
  }

  const handleAddInventoryTransaction = () => {
    navigate("/inventoryTransactions/add")
  }

  const handleAddBulkInventoryTransaction = () => {
    navigate("/inventoryTransactions/bulk-add")
  }

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

      return undefined
    },
  )

  const numberColumn = checkRole(ProfileBase.inventoryTransactions.viewActions)
    ? 6
    : 5
  const desktopTemplateColumns = checkRole(
    ProfileBase.inventoryTransactions.viewActions,
  )
    ? "minmax(0, 3.6fr) minmax(0, 1fr) minmax(0, 0.85fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0.45fr)"
    : "minmax(0, 3.6fr) minmax(0, 1fr) minmax(0, 0.85fr) minmax(0, 1fr) minmax(0, 1fr)"
  const hasActiveDateFilter =
    rangeDate.startDate !== today || rangeDate.endDate !== today

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
          <NewRecordPanel
            handleAddRecord={handleAddInventoryTransaction}
            noRecords={inventoryTransactionList?.length}
            title="transacciones"
            buttonLabel="Nueva transacción"
            roles={ProfileBase.inventoryTransactions.create}
            showBulkBtn={true}
            handleAddBulkRecords={handleAddBulkInventoryTransaction}
          />
        )}

      <Stack spacing={3}>
        <Card variant="outline">
          <CardBody>
            <Flex
              direction={{ base: "column", md: "row" }}
              align={{ base: "stretch", md: "center" }}
              justify="space-between"
              gap={3}
            >
              <Flex align="center" gap={3} wrap="wrap">
                <Button
                  onClick={onToggle}
                  leftIcon={hasActiveDateFilter ? <CheckIcon /> : undefined}
                  rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  colorScheme={isOpen || hasActiveDateFilter ? "purple" : "gray"}
                  variant={isOpen || hasActiveDateFilter ? "solid" : "outline"}
                  size={{ base: "sm", md: "md" }}
                  width={{ base: "fit-content", md: "auto" }}
                >
                  {isOpen ? "Ocultar filtros" : "Mostrar filtros"}
                </Button>
                {hasActiveDateFilter && (
                  <Badge colorScheme="purple" variant="subtle" px={2} py={1}>
                    Filtros activos
                  </Badge>
                )}
              </Flex>
              <Text fontSize="sm" color="gray.500" display={{ base: "none", md: "block" }}>
                Filtrá por rango de fechas solo cuando lo necesites.
              </Text>
            </Flex>
            <Collapse in={isOpen} animateOpacity>
              <Grid templateColumns="repeat(12, 1fr)" gap={3} mt={4}>
                <GridItem colSpan={{ base: 12, md: 5, lg: 4 }}>
                  <RangeDateFilter onSubmit={onSubmit} rangeDate={rangeDate} />
                </GridItem>
              </Grid>
            </Collapse>
          </CardBody>
        </Card>

        {!queryInventoryTransactions?.isError &&
          queryInventoryTransactions?.data?.length !== undefined &&
          queryInventoryTransactions?.data?.length > 0 &&
          !queryInventoryTransactions?.isLoading && (
            <Grid gap={2} templateColumns="repeat(12, 1fr)">
              <GridItem
                display={{ base: "none", md: "block" }}
                colSpan={12}
              >
                <Card variant="outline">
                  <CardBody>
                    <Grid
                      templateColumns={{
                        base: `repeat(${numberColumn}, 1fr)`,
                        md: desktopTemplateColumns,
                      }}
                      gap={2}
                      alignItems={"center"}
                    >
                      <GridItem minW={0}>
                        <Flex direction="column" gap={2}>
                          <Text fontWeight="bold">Insumo</Text>
                        </Flex>
                      </GridItem>
                      <GridItem minW={0}>
                        <Flex direction="column" gap={2} placeItems={"center"}>
                          <Text fontWeight="bold">Tipo</Text>
                        </Flex>
                      </GridItem>
                      <GridItem minW={0}>
                        <Flex direction="column" gap={2} placeItems={"center"}>
                          <Text fontWeight="bold">Cantidad</Text>
                        </Flex>
                      </GridItem>
                      <GridItem minW={0}>
                        <Flex direction="column" gap={2} placeItems={"center"}>
                          <Text fontWeight="bold">Stock Antes</Text>
                        </Flex>
                      </GridItem>
                      <GridItem minW={0}>
                        <Flex direction="column" gap={2} placeItems={"center"}>
                          <Text fontWeight="bold">Stock Actual</Text>
                        </Flex>
                      </GridItem>
                      {checkRole(ProfileBase.inventoryTransactions.viewActions) && (
                        <GridItem minW={0}>
                          <Flex direction="column" gap={2} placeItems={"center"}>
                            <Text fontWeight="bold" textAlign="center">
                              Acciones
                            </Text>
                          </Flex>
                        </GridItem>
                      )}
                    </Grid>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem colSpan={12}>
                {inventoryTransactionList}
              </GridItem>
            </Grid>
          )}

        {!queryInventoryTransactions?.isError &&
          queryInventoryTransactions?.data?.length !== undefined &&
          queryInventoryTransactions?.data?.length === 0 &&
          !queryInventoryTransactions?.isLoading && (
            <WithoutResults text="No se encontraron transacciones." />
          )}
      </Stack>
    </>
  )
}

export default InventoryTransactions
