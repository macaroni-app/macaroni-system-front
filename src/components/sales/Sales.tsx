// import { useState } from "react";

import {
  Grid,
  Card,
  CardBody,
  Flex,
  Spacer,
  Text,
  Stack,
  Skeleton,
  // FormControl,
  // FormLabel,
  // Input,
  GridItem,
} from "@chakra-ui/react"

import { useNavigate } from "react-router-dom"

// components
// import Dashboard from "../reports/Dashboard";
import WithoutResults from "../common/WithoutResults"
import Sale from "./Sale"

import { IProductItemFullRelated } from "../products/types"

// custom hooks
import { useSales } from "../../hooks/useSales"
import { useSaleItems } from "../../hooks/useSaleItems"
import { useProductItems } from "../../hooks/useProductItems"
import { useInventories } from "../../hooks/useInventories"

// types
import { ISaleFullRelated, ISaleItemFullRelated } from "./types"
import { IInventoryFullRelated } from "../inventories/types"

import NewRecordPanel from "../common/NewRecordPanel"

import ProfileBase from "../common/permissions"
import RangeDateFilter, { RangeDate } from "../dashboard/RangeDateFilter"
import { useTodayDate } from "../../hooks/useTodayDate"
import { useState } from "react"

const Sales = () => {
  // const [showFilters, setShowFilters] = useState(
  //   JSON.parse(window.localStorage.getItem("showFilters"))?.showFilters
  // );
  const today = useTodayDate();
  const [rangeDate, setRangeDate] = useState({
    startDate: today,
    endDate: today,
  });
  const querySales = useSales({
    startDate: rangeDate.startDate,
    endDate: rangeDate.endDate,
  })
  const querySaleItems = useSaleItems({})
  const queryProductItems = useProductItems({})
  const queryInventories = useInventories({})

  const productItems = queryProductItems.data as IProductItemFullRelated[]
  const inventories = queryInventories.data as IInventoryFullRelated[]
  // const {
  //   query: querySaleDetails,
  //   setRangeDateFilter: setRangeDateFilterSaleDetail,
  // } = useSaleDetails({ all: false });

  // const queryDebts = useDebts();

  // const { throwError } = useError()

  const navigate = useNavigate()

  const handleAddSale = () => {
    navigate("add")
  }

  const sales = querySales?.data as ISaleFullRelated[]
  // saleItems
  querySaleItems?.data as ISaleItemFullRelated[]

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
  };

  // if (querySales?.isError) {
  //   throwError(querySales?.error)
  // }

  const saleList = sales?.map((sale) => {
    if (sale._id !== undefined && sale.createdAt !== undefined) {
      return (
        <Sale
          key={sale?._id + sale?.createdAt}
          sale={sale}
          productItems={productItems}
          inventories={inventories}
        />
      )
    }
  })

  return (
    <>
      {querySales?.isLoading && (
        <Card variant="outline" mt={5} mb={3}>
          <CardBody>
            <Stack>
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </Stack>
          </CardBody>
        </Card>
      )}
      {/* {!querySales?.isError && !querySales?.isLoading && (
        <Dashboard
          querySales={querySales}
          querySaleDetails={querySaleDetails}
        />
      )} */}

      {!querySales?.isError && !querySales?.isLoading && (
        <NewRecordPanel
          handleAddRecord={handleAddSale}
          noRecords={saleList?.length}
          title="ventas"
          buttonLabel="Nueva venta"
          roles={ProfileBase.sales.create}
        />
      )}

      <Grid gap={3} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={{ base: 12, lg: 3 }}>
          {<RangeDateFilter onSubmit={onSubmit} rangeDate={rangeDate} />}
        </GridItem>
        <GridItem colSpan={{ base: 12, lg: 9 }}>
          {querySales?.isLoading && (
            <>
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
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                  </Stack>
                </CardBody>
              </Card>
              <Card variant="outline" mb={3}>
                <CardBody>
                  <Stack>
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                  </Stack>
                </CardBody>
              </Card>
              <Card variant="outline" mb={3}>
                <CardBody>
                  <Stack>
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                  </Stack>
                </CardBody>
              </Card>
              <Card variant="outline" mb={3}>
                <CardBody>
                  <Stack>
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                  </Stack>
                </CardBody>
              </Card>
              <Card variant="outline" mb={3}>
                <CardBody>
                  <Stack>
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                  </Stack>
                </CardBody>
              </Card>
            </>
          )}

          <Grid gap={2} templateColumns="repeat(12, 1fr)">
            <GridItem
              display={{ base: "none", md: "block" }}
              colSpan={{ base: 12, md: 12, lg: 12 }}
              colStart={{ base: 1, md: 1, lg: 1 }}
            >
              {!querySales?.isLoading && !querySales?.isError && (
                <Card variant="outline">
                  <CardBody>
                    <Grid
                      templateColumns="repeat(6, 1fr)"
                      gap={2}
                      alignItems={"center"}
                    >
                      <GridItem>
                        <Flex direction="column" gap={2}>
                          <Text fontWeight="bold">Nombre del cliente</Text>
                        </Flex>
                      </GridItem>
                      <GridItem>
                        <Flex direction="column" gap={2} placeItems={"center"}>
                          <Text fontWeight="bold">Estado</Text>
                        </Flex>
                      </GridItem>
                      <GridItem>
                        <Flex direction="column" gap={2} placeItems={"center"}>
                          <Text fontWeight="bold">Realizado por</Text>
                        </Flex>
                      </GridItem>
                      <GridItem>
                        <Flex direction="column" gap={2} placeItems={"center"}>
                          <Text fontWeight="bold">Fecha</Text>
                        </Flex>
                      </GridItem>
                      <GridItem>
                        <Flex direction="column" gap={2} placeItems={"center"}>
                          <Text fontWeight="bold">Monto total</Text>
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
              )}
            </GridItem>
            <GridItem
              colSpan={{ base: 12, md: 12, lg: 12 }}
              colStart={{ base: 1, md: 1, lg: 1 }}
            >
              {querySales?.data?.length !== undefined &&
                querySales?.data?.length > 0 &&
                !querySales?.isLoading &&
                !querySales?.isError && <>{saleList}</>}
              {querySales?.data?.length === 0 &&
                !querySales?.isError &&
                !querySales?.isLoading && (
                  <WithoutResults text={"No se encontró resultados."} />
                )}
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </>
  )
}

export default Sales
