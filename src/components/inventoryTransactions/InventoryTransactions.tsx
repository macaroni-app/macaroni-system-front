import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Grid,
  Card,
  CardBody,
  Flex,
  Spacer,
  Stack,
  Skeleton,
  Text,
  GridItem
} from "@chakra-ui/react"


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
  });

  const queryInventoryTransactions = useInventoryTransactions({
    startDate: rangeDate.startDate,
    endDate: rangeDate.endDate
  })

  const inventoryTransactions =
    queryInventoryTransactions?.data as IInventoryTransactionFullRelated[]

  const navigate = useNavigate()

  const { checkRole } = useCheckRole()

  // const { throwError } = useError()

  // if (queryCategories?.isError) {
  //   throwError(queryCategories?.error)
  // }

  const onSubmit = (rangeDate: RangeDate) => {
    if (
      rangeDate.startDate !== undefined &&
      rangeDate.endDate !== undefined
    ) {
      setRangeDate({
        startDate: rangeDate.startDate,
        endDate: rangeDate.endDate,
      });
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
    }
  )

  const numberColumn = checkRole(ProfileBase.inventoryTransactions.viewActions)
    ? 6
    : 5

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

      <Grid gap={3} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={{ base: 12, lg: 3 }}>
          {<RangeDateFilter onSubmit={onSubmit} rangeDate={rangeDate} />}
        </GridItem>

        <GridItem colSpan={{ base: 12, lg: 9 }}>
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
                        templateColumns={`repeat(${numberColumn}, 1fr)`}
                        gap={2}
                        alignItems={"center"}
                      >
                        <GridItem>
                          <Flex direction="column" gap={2}>
                            <Text fontWeight="bold">Insumo</Text>
                          </Flex>
                        </GridItem>
                        <GridItem>
                          <Flex direction="column" gap={2} placeItems={"center"}>
                            <Text fontWeight="bold">Tipo</Text>
                          </Flex>
                        </GridItem>
                        <GridItem>
                          <Flex direction="column" gap={2} placeItems={"center"}>
                            <Text fontWeight="bold">Cantidad</Text>
                          </Flex>
                        </GridItem>
                        <GridItem>
                          <Flex direction="column" gap={2} placeItems={"center"}>
                            <Text fontWeight="bold">Usuario</Text>
                          </Flex>
                        </GridItem>
                        <GridItem>
                          <Flex direction="column" gap={2} placeItems={"center"}>
                            <Text fontWeight="bold">Fecha</Text>
                          </Flex>
                        </GridItem>
                        {checkRole(
                          ProfileBase.inventoryTransactions.viewActions
                        ) && (
                            <GridItem>
                              <Flex direction="column" gap={2} placeItems={"end"}>
                                <Text fontWeight="bold">Acciones</Text>
                              </Flex>
                            </GridItem>
                          )}
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
                text={"No se encontraron registros."}
              />
            )}
        </GridItem>
      </Grid>
    </>
  )
}

export default InventoryTransactions
