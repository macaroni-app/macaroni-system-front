import {
  Grid,
  Card,
  CardBody,
  Flex,
  Spacer,
  Stack,
  Skeleton,
} from "@chakra-ui/react"

import { useNavigate } from "react-router-dom"

// components
import ProductType from "./ProductType"
import WithoutResults from "../common/WithoutResults"
import NewRecordPanel from "../common/NewRecordPanel"

// custom hooks
import { useProductTypes } from "../../hooks/useProductTypes"
import { IProductTypeType } from "./types"
// import { useError } from "../../hooks/useError"

import { ROLES } from "../common/roles"

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
        <NewRecordPanel
          handleAddRecord={handleAddProductType}
          noRecords={productTypeList?.length}
          title="tipos de productos"
          buttonLabel="Nuevo tipo"
          roles={[ROLES.ADMIN, ROLES.SUPERVISOR]}
        />
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
