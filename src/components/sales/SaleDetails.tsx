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
import { ISaleFullRelated } from "./types"

import { ChevronLeftIcon } from "@chakra-ui/icons"

// import { format } from "date-fns"
// import { es } from "date-fns/locale"

// custom hooks
import { useSales } from "../../hooks/useSales"
import { useSaleItems } from "../../hooks/useSaleItems"

const SaleDetails = () => {
  const { saleId } = useParams()

  const querySales = useSales({})

  const sale = querySales.data?.filter(
    (sale) => sale._id === saleId
  )[0] as ISaleFullRelated

  const querySaleItems = useSaleItems({})

  const saleItems = querySaleItems?.data?.filter(
    (saleItem) => saleItem?.sale?._id === saleId
  )

  const saleTotal = saleItems
    ?.map((saleItem) => {
      if (
        saleItem !== undefined &&
        saleItem?.product?.retailsalePrice !== undefined &&
        saleItem?.quantity !== undefined
      ) {
        return (
          Number(saleItem?.quantity) *
          Number(saleItem?.product?.retailsalePrice)
        )
      }
    })
    .reduce((acc, currentValue) => {
      if (acc !== undefined && currentValue !== undefined) {
        return acc + currentValue
      }
    }, 0)

  const saleDetailsList = saleItems?.map((saleItem) => {
    return (
      <Tr key={saleItem._id}>
        <Td>{saleItem?.product?.name}</Td>
        <Td>
          <Badge>{saleItem?.product?.productType?.name}</Badge>
        </Td>
        <Td>
          {saleItem?.quantity !== undefined &&
            Number.parseFloat(saleItem?.quantity.toString())}
        </Td>
        <Td isNumeric>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            minimumFractionDigits: 2,
            currency: "USD",
          }).format(
            saleItem?.subtotal !== undefined
              ? Number.parseFloat(saleItem?.subtotal?.toFixed(2))
              : 0
          )}
        </Td>
      </Tr>
    )
  })

  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate("/sales")
  }

  // const handleEditProduct = () => {
  //   navigate(`/sales/${sale._id}/edit`)
  // }

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
                {/* <Button
                  onClick={() => handleEditProduct()}
                  colorScheme="purple"
                  variant="solid"
                >
                  <EditIcon boxSize={3} me={2} />
                  Editar
                </Button> */}
              </Flex>
            </CardBody>
          </Card>
        </GridItem>
        {querySales?.isLoading && (
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
        {!querySales?.isLoading && (
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
                      <Text fontSize="lg">Cliente: </Text>
                      <Text as="b" fontSize="lg">
                        {sale?.client?.name}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Método de pago: </Text>
                      <Text as="b" fontSize="lg">
                        {sale?.paymentMethod?.name}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Total: </Text>
                      <Text as="b" fontSize="lg">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          minimumFractionDigits: 2,
                          currency: "USD",
                        }).format(
                          sale?.total !== undefined
                            ? Number.parseFloat(sale?.total?.toFixed(2))
                            : 0
                        )}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Costo total: </Text>
                      <Text as="b" fontSize="lg">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          minimumFractionDigits: 2,
                          currency: "USD",
                        }).format(
                          sale?.costTotal !== undefined
                            ? Number.parseFloat(sale?.costTotal?.toFixed(2))
                            : 0
                        )}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Venta por menor: </Text>
                      <Text as="b" fontSize="lg">
                        {sale?.isRetail ? (
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
                      <Text fontSize="lg">Estado: </Text>
                      <Text as="b" fontSize="lg">
                        {sale?.status === "PAID" ? (
                          <Badge colorScheme="green">Pagado</Badge>
                        ) : (
                          <Badge colorScheme="red">Cancelado</Badge>
                        )}
                      </Text>
                    </Flex>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </GridItem>
        )}

        {!querySales?.isLoading && (
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
                        <Th>Producto</Th>
                        <Th>Tipo</Th>
                        <Th>Cantidad</Th>
                        <Th isNumeric>Subtotal</Th>
                      </Tr>
                    </Thead>
                    <Tbody>{saleDetailsList}</Tbody>
                    <Tfoot>
                      <Tr>
                        <Th>Total</Th>
                        <Th></Th>
                        <Th></Th>
                        <Th isNumeric>
                          {saleItems !== undefined &&
                            saleItems.length > 0 &&
                            new Intl.NumberFormat("en-US", {
                              style: "currency",
                              minimumFractionDigits: 2,
                              currency: "USD",
                            }).format(Number(saleTotal))}
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

export default SaleDetails
