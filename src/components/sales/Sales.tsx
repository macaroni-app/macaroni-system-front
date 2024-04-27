// import { useState } from "react";

import {
  Grid,
  Button,
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
import { AddIcon /* , SearchIcon */ } from "@chakra-ui/icons"

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

const Sales = () => {
  // const [showFilters, setShowFilters] = useState(
  //   JSON.parse(window.localStorage.getItem("showFilters"))?.showFilters
  // );
  const querySales = useSales({})
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
  const saleItems = querySaleItems?.data as ISaleItemFullRelated[]

  // const saleDetails = querySaleDetails?.data

  // const debts = queryDebts?.data

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
        <Card bgColor={"#373E68"} variant="filled" mt={5} mb={3}>
          <CardBody>
            <Flex placeItems={"center"}>
              <Text color={"white"} fontWeight={"bold"}>
                {saleList?.length} ventas
              </Text>
              <Spacer />
              <Button
                onClick={() => handleAddSale()}
                colorScheme="purple"
                variant="solid"
              >
                <AddIcon boxSize={3} me={2} />
                Nueva venta
              </Button>
            </Flex>
          </CardBody>
        </Card>
      )}

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
    </>
  )
}

export default Sales
