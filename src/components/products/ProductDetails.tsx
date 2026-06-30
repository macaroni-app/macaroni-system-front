import {
  Grid,
  GridItem,
  Card,
  CardBody,
  Text,
  Flex,
  Button,
  Spacer,
  Divider,
  Box,
  Stack,
  Skeleton,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
} from "@chakra-ui/react"

import { useNavigate, useParams } from "react-router-dom"

// types
import { IProductFullRelated } from "./types"

import { EditIcon, ChevronLeftIcon } from "@chakra-ui/icons"

// import { format } from "date-fns"
// import { es } from "date-fns/locale"

// custom hooks
import { useProductItems } from "../../hooks/useProductItems"
import { useProducts } from "../../hooks/useProducts"
import { useCheckRole } from "../../hooks/useCheckRole"

import ProfileBase from "../common/permissions"

const ProductDetails = () => {
  const { productId } = useParams()

  const { checkRole } = useCheckRole()

  const queryProducts = useProducts({})

  const product = queryProducts.data?.filter(
    (product) => product._id === productId
  )[0] as IProductFullRelated

  const queryProductItems = useProductItems({})

  const productItems = queryProductItems?.data?.filter(
    (productItem) => productItem?.product?._id === productId
  )

  const getProductItemAsset = (productItem: {
    selectionType?: string
    asset?: { name?: string; costPrice?: number }
    baseAsset?: { name?: string; costPrice?: number }
  }) =>
    productItem?.selectionType === "VARIANT_SELECTION"
      ? productItem?.baseAsset
      : productItem?.asset

  const productCostTotal = productItems
    ?.map((productItem) => {
      const currentAsset = getProductItemAsset(productItem)

      if (
        productItem !== undefined &&
        currentAsset?.costPrice !== undefined &&
        productItem?.quantity !== undefined
      ) {
        return (
          Number(productItem?.quantity) * Number(currentAsset?.costPrice)
        )
      }
    })
    .reduce((acc, currentValue) => {
      if (acc !== undefined && currentValue !== undefined) {
        return acc + currentValue
      }
    }, 0)

  const revenuePorcentage = Number(
    ((Number(product?.wholesalePrice) - Number(product?.costPrice)) /
      Number(product?.costPrice)) *
      100
  ).toFixed(2)

  const productDetailsList = productItems?.map((productItem) => {
    const currentAsset = getProductItemAsset(productItem)
    const allowedVariantValues = (productItem?.allowedVariantValues ?? []).map(
      (value) => (typeof value === "string" ? value : value?.name)
    ).filter(Boolean)

    return (
      <Tr key={productItem._id}>
        <Td>
          <Text>{currentAsset?.name ?? "-"}</Text>
          {productItem?.selectionType === "VARIANT_SELECTION" && (
            <Flex mt={1} gap={2} wrap="wrap">
              <Badge colorScheme="purple">Variante seleccionable</Badge>
              {allowedVariantValues.length > 0 && (
                <Badge colorScheme="gray">
                  {allowedVariantValues.join(", ")}
                </Badge>
              )}
            </Flex>
          )}
        </Td>
        <Td>
          {productItem?.quantity !== undefined &&
            Number.parseFloat(productItem?.quantity.toString())}
        </Td>
        <Td isNumeric>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            minimumFractionDigits: 2,
            currency: "USD",
          }).format(
            currentAsset?.costPrice !== undefined
              ? Number.parseFloat(currentAsset.costPrice?.toFixed(2))
              : 0
          )}
        </Td>
      </Tr>
    )
  })

  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate("/products")
  }

  const handleEditProduct = () => {
    navigate(`/products/${product._id}/edit`)
  }

  return (
    <>
      <Grid templateColumns="repeat(12, 1fr)" gap={1}>
        <GridItem
          mt={1}
          colSpan={{ base: 10, lg: 8 }}
          colStart={{ base: 2, lg: 3 }}
        >
          <Card variant="outline" mt={5} mb={3}>
            <CardBody>
              <Flex>
                <Button
                  onClick={() => handleGoBack()}
                  colorScheme="blue"
                  variant="outline"
                >
                  <ChevronLeftIcon boxSize={4} me={1} />
                  Volver
                </Button>
                <Spacer />

                {checkRole(ProfileBase.products.edit) && (
                  <Button
                    onClick={() => handleEditProduct()}
                    colorScheme="purple"
                    variant="solid"
                  >
                    <EditIcon boxSize={3} me={2} />
                    Editar
                  </Button>
                )}
              </Flex>
            </CardBody>
          </Card>
        </GridItem>
        {queryProducts?.isLoading && (
          <GridItem
            mt={1}
            colSpan={{ base: 10, lg: 8 }}
            colStart={{ base: 2, lg: 3 }}
          >
            <Card variant="outline">
              <CardBody>
                <Grid
                  templateColumns="repeat(6, 1fr)"
                  gap={2}
                  alignItems="center"
                >
                  <GridItem colSpan={6}>
                    <Stack>
                      <Skeleton height="50px" />
                      <Box padding="3">
                        <Divider />
                      </Box>
                      <Skeleton height="30px" />
                      <Skeleton height="30px" />
                      <Skeleton height="30px" />
                      <Skeleton height="30px" />
                      <Skeleton height="30px" />
                    </Stack>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </GridItem>
        )}
        {!queryProducts?.isLoading && (
          <GridItem
            mt={1}
            colSpan={{ base: 10, lg: 8 }}
            colStart={{ base: 2, lg: 3 }}
          >
            <Card variant="outline">
              <CardBody>
                <Grid
                  templateColumns="repeat(6, 1fr)"
                  gap={2}
                  alignItems="center"
                >
                  <GridItem colSpan={6}>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Nombre: </Text>
                      <Text as="b" fontSize="lg">
                        {product?.name}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Activo: </Text>
                      <Text as="b" fontSize="lg">
                        {product?.isActive ? (
                          <Badge colorScheme="green">Si</Badge>
                        ) : (
                          <Badge colorScheme="red">No</Badge>
                        )}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Precio por menor: </Text>
                      <Text as="b" fontSize="lg">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          minimumFractionDigits: 2,
                          currency: "USD",
                        }).format(
                          product?.retailsalePrice !== undefined
                            ? Number.parseFloat(
                                product?.retailsalePrice?.toFixed(2)
                              )
                            : 0
                        )}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Precio por mayor: </Text>
                      <Text as="b" fontSize="lg">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          minimumFractionDigits: 2,
                          currency: "USD",
                        }).format(
                          product?.wholesalePrice !== undefined
                            ? Number.parseFloat(
                                product?.wholesalePrice?.toFixed(2)
                              )
                            : 0
                        )}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Precio de costo: </Text>
                      <Text as="b" fontSize="lg">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          minimumFractionDigits: 2,
                          currency: "USD",
                        }).format(
                          product?.costPrice !== undefined
                            ? Number.parseFloat(product?.costPrice?.toFixed(2))
                            : 0
                        )}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Porcentaje de ganancia: </Text>
                      <Text as="b" fontSize="lg">
                        {revenuePorcentage} %
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Categoria: </Text>
                      <Text as="b" fontSize="lg">
                        {product?.category?.name}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Tipo de producto: </Text>
                      <Text as="b" fontSize="lg">
                        {product?.productType?.name}
                      </Text>
                    </Flex>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </GridItem>
        )}

        {!queryProducts?.isLoading && (
          <GridItem
            mt={3}
            colSpan={{ base: 10, lg: 8 }}
            colStart={{ base: 2, lg: 3 }}
          >
            <Card variant="outline">
              <CardBody>
                <TableContainer>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Insumo</Th>
                        <Th>Cantidad</Th>
                        <Th isNumeric>Subtotal</Th>
                      </Tr>
                    </Thead>
                    <Tbody>{productDetailsList}</Tbody>
                    <Tfoot>
                      <Tr>
                        <Th>Total</Th>
                        <Th></Th>
                        <Th isNumeric>
                          {productItems !== undefined &&
                            productItems.length > 0 &&
                            new Intl.NumberFormat("en-US", {
                              style: "currency",
                              minimumFractionDigits: 2,
                              currency: "USD",
                            }).format(Number(productCostTotal))}
                        </Th>
                      </Tr>
                    </Tfoot>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>
          </GridItem>
        )}
      </Grid>
    </>
  )
}

export default ProductDetails
