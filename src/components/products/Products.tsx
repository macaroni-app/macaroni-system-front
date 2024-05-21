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
  FormControl,
  // FormLabel,
  Input,
  GridItem,
} from "@chakra-ui/react"
import { AddIcon /* , SearchIcon */ } from "@chakra-ui/icons"

import { useNavigate } from "react-router-dom"
import { ChangeEvent, useState } from "react"

// components
// import Dashboard from "../reports/Dashboard";
import WithoutResults from "../common/WithoutResults"
import Product from "./Product"

// custom hooks
// import { useSaleDetails } from "../../hooks/useSaleDetails";
// import { useDebts } from "../../hooks/useDebts";
import { useProducts } from "../../hooks/useProducts"
import { useProductItems } from "../../hooks/useProductItems"
import { useCheckRole } from "../../hooks/useCheckRole"

// import { useTodayDate } from "../../hooks/useTodayDate";
// import { useError } from "../../hooks/useError"

// types
import { IProductFullRelated, IProductItemFullRelated } from "./types"

import { ROLES } from "../common/roles"

const Products = () => {
  // const [showFilters, setShowFilters] = useState(
  //   JSON.parse(window.localStorage.getItem("showFilters"))?.showFilters
  // );

  const [searchValue, setSearchValue] = useState<string>("")

  const { checkRole } = useCheckRole()

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

  const handleSetSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const products = queryProducts?.data as IProductFullRelated[]
  const productItems = queryProductItems?.data as IProductItemFullRelated[]

  // const saleDetails = querySaleDetails?.data

  // const debts = queryDebts?.data

  // if (querySales?.isError) {
  //   throwError(querySales?.error)
  // }

  const saleList = products
    ?.filter((product) => {
      if (product.name !== undefined) {
        return product.name.toLowerCase().includes(searchValue.toLowerCase())
      }
    })
    .map((product) => {
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
        <>
          <Card bgColor={"#373E68"} variant="filled" mt={5} mb={3}>
            <CardBody>
              <Flex placeItems={"center"}>
                <Text
                  color={"white"}
                  fontWeight={"bold"}
                  fontSize={{ base: "small", md: "medium" }}
                >
                  {saleList?.length} productos
                </Text>
                <Spacer />
                {checkRole([ROLES.ADMIN]) && (
                  <Button
                    onClick={() => handleAddProduct()}
                    colorScheme="purple"
                    variant="solid"
                    size={{ base: "sm", md: "md" }}
                  >
                    <AddIcon boxSize={3} me={2} />
                    Nuevo producto
                  </Button>
                )}
              </Flex>
            </CardBody>
          </Card>
          <Card variant="outline" mt={5} mb={3}>
            <CardBody>
              <Flex>
                <FormControl>
                  <Input
                    name="searchValue"
                    type="text"
                    value={searchValue}
                    onChange={(e) => handleSetSearchValue(e)}
                    placeholder="Buscar producto ..."
                    required
                  />
                </FormControl>
              </Flex>
            </CardBody>
          </Card>
        </>
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
          display={{ base: "none", md: "block" }}
          colSpan={{ base: 12, md: 12, lg: 12 }}
          colStart={{ base: 1, md: 1, lg: 1 }}
        >
          {!queryProducts?.isLoading && !queryProducts?.isError && (
            <Card variant="outline" mb={3}>
              <CardBody>
                <Grid
                  templateColumns="repeat(6, 1fr)"
                  gap={2}
                  alignItems={"center"}
                >
                  <GridItem>
                    <Flex direction="column" gap={2}>
                      <Text fontWeight="bold">Nombre del producto</Text>
                    </Flex>
                  </GridItem>
                  <GridItem>
                    <Flex direction="column" gap={2} placeItems={"center"}>
                      <Text fontWeight="bold">Estado</Text>
                    </Flex>
                  </GridItem>
                  <GridItem>
                    <Flex direction="column" gap={2} placeItems={"center"}>
                      <Text fontWeight="bold">Categoria</Text>
                    </Flex>
                  </GridItem>
                  <GridItem>
                    <Flex direction="column" gap={2} placeItems={"center"}>
                      <Text fontWeight="bold">Precio x menor</Text>
                    </Flex>
                  </GridItem>
                  <GridItem>
                    <Flex direction="column" gap={2} placeItems={"center"}>
                      <Text fontWeight="bold">Precio x mayor</Text>
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
