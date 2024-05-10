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
import Product from "./Product"

// custom hooks
// import { useSaleDetails } from "../../hooks/useSaleDetails";
// import { useDebts } from "../../hooks/useDebts";
import { useProducts } from "../../hooks/useProducts"
import { useProductItems } from "../../hooks/useProductItems"
import { useAuthContext } from "../../hooks/useAuthContext"
// import { useTodayDate } from "../../hooks/useTodayDate";
// import { useError } from "../../hooks/useError"

// types
import { IProductFullRelated, IProductItemFullRelated } from "./types"
import { IUserContext } from "../../context/types"

import { ROLES } from "../common/roles"

const Products = () => {
  // const [showFilters, setShowFilters] = useState(
  //   JSON.parse(window.localStorage.getItem("showFilters"))?.showFilters
  // );
  const { auth } = useAuthContext() as IUserContext
  const queryProducts = useProducts({})
  const queryProductItems = useProductItems({})
  // const {
  //   query: querySaleDetails,
  //   setRangeDateFilter: setRangeDateFilterSaleDetail,
  // } = useSaleDetails({ all: false });

  // const queryDebts = useDebts();

  // const { throwError } = useError()

  const navigate = useNavigate()

  const handleAddProduct = () => {
    navigate("add")
  }

  const products = queryProducts?.data as IProductFullRelated[]
  const productItems = queryProductItems?.data as IProductItemFullRelated[]

  // const saleDetails = querySaleDetails?.data

  // const debts = queryDebts?.data

  // if (querySales?.isError) {
  //   throwError(querySales?.error)
  // }

  const saleList = products?.map((product) => {
    if (product._id !== undefined && product.createdAt !== undefined) {
      return (
        <Product key={product?._id + product?.createdAt} product={product} />
      )
    }
  })

  return (
    <>
      {queryProducts?.isLoading && (
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

      {!queryProducts?.isError && !queryProducts?.isLoading && (
        <Card bgColor={"#373E68"} variant="filled" mt={5} mb={3}>
          <CardBody>
            <Flex placeItems={"center"}>
              <Text color={"white"} fontWeight={"bold"}>
                {saleList?.length} productos
              </Text>
              <Spacer />
              {auth?.roles
                ?.map((role) => role === ROLES.ADMIN)
                .find((val) => val) && (
                <Button
                  onClick={() => handleAddProduct()}
                  colorScheme="purple"
                  variant="solid"
                >
                  <AddIcon boxSize={3} me={2} />
                  Nuevo producto
                </Button>
              )}
            </Flex>
          </CardBody>
        </Card>
      )}

      {queryProducts?.isLoading && (
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
          {queryProducts?.data?.length !== undefined &&
            queryProducts?.data?.length > 0 &&
            !queryProducts?.isLoading &&
            !queryProducts?.isError && <>{saleList}</>}
          {queryProducts?.data?.length === 0 &&
            !queryProducts?.isError &&
            !queryProducts?.isLoading && (
              <WithoutResults text={"No se encontró resultados."} />
            )}
        </GridItem>
      </Grid>
    </>
  )
}

export default Products
