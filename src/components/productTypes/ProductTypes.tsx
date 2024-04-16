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
} from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"

import { useNavigate } from "react-router-dom"

// components
import ProductType from "./ProductType"
import WithoutResults from "../common/WithoutResults"

// custom hooks
import { useProductTypes } from "../../hooks/useProductTypes"
import { IProductTypeType } from "./types"
// import { useError } from "../../hooks/useError"

const ProductTypes = (): JSX.Element => {
  const queryProductTypes = useProductTypes({})

  const navigate = useNavigate()

  // const { throwError } = useError()

  // if (queryProductTypes?.isError) {
  //   throwError(queryProductTypes?.error)
  // }

  const handleAddProductType = () => {
    navigate("/productTypes/add")
  }

  const productTypes = queryProductTypes?.data as IProductTypeType[]

  const productTypeList = productTypes?.map((productType) => {
    if (productType._id !== undefined && productType.createdAt !== undefined) {
      return (
        <ProductType
          key={productType?._id + productType?.createdAt}
          productType={productType}
        />
      )
    }
  })

  if (queryProductTypes?.isLoading) {
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
      {!queryProductTypes?.isError && !queryProductTypes?.isLoading && (
        <Card bgColor={"#373E68"} variant="filled" mt={5} mb={3}>
          <CardBody>
            <Flex placeItems={"center"}>
              <Text color={"white"} fontWeight={"bold"}>
                {productTypeList?.length} tipos de productos
              </Text>
              <Spacer />
              <Button
                onClick={() => handleAddProductType()}
                colorScheme="purple"
                variant="solid"
              >
                <AddIcon boxSize={3} me={2} />
                Agregar tipo de producto
              </Button>
            </Flex>
          </CardBody>
        </Card>
      )}

      {!queryProductTypes?.isError &&
        queryProductTypes?.data?.length !== undefined &&
        queryProductTypes?.data?.length > 0 &&
        !queryProductTypes?.isLoading && <Grid>{productTypeList}</Grid>}
      {!queryProductTypes?.isError &&
        queryProductTypes?.data?.length === 0 &&
        !queryProductTypes?.isLoading && (
          <WithoutResults text={"No hay tipos de productos cargados."} />
        )}
    </>
  )
}

export default ProductTypes
