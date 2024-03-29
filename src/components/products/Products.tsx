// libs
import { useNavigate } from "react-router-dom"
import { ChangeEvent, useState } from "react"

// custom hooks
import { useProducts } from "../../hooks/useProducts"
// import { useError } from "../../hooks/useError"

// types
import { IProduct } from "./types"

// styles
import {
  Grid,
  GridItem,
  Button,
  Card,
  CardBody,
  Flex,
  Spacer,
  Text,
  Stack,
  Skeleton,
  FormControl,
  Input,
} from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"

// components
import Product from "./Product"
// import Dashboard from "../reports/Dashboard"
import WithoutResults from "../common/WithoutResults"

const Products = (): JSX.Element => {
  const [searchValue, setSearchValue] = useState<string>("")

  // const { throwError } = useError()

  const navigate = useNavigate()

  const queryProducts = useProducts({})

  // if (queryProducts?.isError) {
  //   throwError(queryProducts?.error)
  // }

  const handleAddProduct = () => {
    navigate("add")
  }

  const handleSetSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const products = queryProducts?.data as IProduct[]

  const productList = products
    ?.filter((product) =>
      product.name.toLowerCase().includes(searchValue.toLowerCase())
    )
    ?.map((product) => {
      return (
        <Product key={product?._id + product?.createdAt} product={product} />
      )
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

      {/* {!queryProducts?.isError && !queryProducts?.isLoading && (
        <Dashboard queryProducts={queryProducts} />
      )} */}
      {!queryProducts?.isError && !queryProducts?.isLoading && (
        <>
          <Card bgColor={"#373E68"} variant="outline" mt={5} mb={3}>
            <CardBody>
              <Flex placeItems={"center"}>
                <Text color={"white"} fontWeight={"bold"}>
                  {productList?.length} productos
                </Text>
                <Spacer />
                <Button
                  onClick={() => handleAddProduct()}
                  colorScheme="purple"
                  variant="solid"
                >
                  <AddIcon boxSize={3} me={2} />
                  Agregar producto
                </Button>
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
          <Card variant="outline" mb={3} mt={5}>
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
      )}

      {!queryProducts?.isError &&
        queryProducts?.data?.length !== undefined &&
        queryProducts?.data?.length > 0 &&
        !queryProducts?.isLoading && (
          <Grid mt={5}>
            <GridItem>{productList}</GridItem>
          </Grid>
        )}
      {!queryProducts?.isError &&
        queryProducts?.data?.length === 0 &&
        !queryProducts?.isLoading && (
          <WithoutResults text={"No hay productos cargados."} />
        )}
    </>
  )
}

export default Products
