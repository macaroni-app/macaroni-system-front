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

import { ChevronLeftIcon, DownloadIcon } from "@chakra-ui/icons"

import { useInvoices } from "../../hooks/useInvoices"


// import { format } from "date-fns"
// import { es } from "date-fns/locale"

import { generateInvoicePDF } from "./generatePdfInvoice"

// custom hooks
import { useSales } from "../../hooks/useSales"
import { useSaleItems } from "../../hooks/useSaleItems"

const SaleDetails = () => {
  const { saleId } = useParams()

  const querySales = useSales({ id: saleId })

  const sale = querySales.data?.filter(
    (sale) => sale._id === saleId
  )[0] as ISaleFullRelated

  const querySaleItems = useSaleItems({ id: saleId })

  const queryInvoice = useInvoices({ saleId: saleId })

  const saleItems = querySaleItems?.data?.filter(
    (saleItem) => saleItem?.sale?._id === saleId
  )

  const profit = Number(sale?.total) - Number(sale?.costTotal)
  const profitPorcentage = (profit / Number(sale?.costTotal)) * 100

  const saleTotal = saleItems?.map(saleItem => saleItem.subtotal).reduce((acc, currentValue) => Number(acc) + Number(currentValue), 0)

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

  const handleGeneratePdf = async () => {
    // Todo: generar un service para traer el invoice guardado recien y poder generar el pdf

    const invoice = queryInvoice.data

    let clientIvaCondition = '';
    const condicionIVAReceptorId = sale.client?.condicionIVAReceptorId;
    switch (condicionIVAReceptorId) {
      case '1':
        clientIvaCondition = 'IVA Responsable Inscripto';
        break;
      case '6':
        clientIvaCondition = 'Responsable Monotributo';
        break;
      case '13':
        clientIvaCondition = 'Monotributista Social';
        break;
      case '16':
        clientIvaCondition = 'Monotributo Trabajador Independiente Promovido';
        break;
      case '4':
        clientIvaCondition = 'IVA Sujeto Exento';
        break;
      case '7':
        clientIvaCondition = 'Sujeto No Categorizado';
        break;
      case '8':
        clientIvaCondition = 'Proveedor del Exterior';
        break;
      case '9':
        clientIvaCondition = 'Cliente del Exterior';
        break;
      case '10':
        clientIvaCondition = 'IVA Liberado – Ley N° 19.640';
        break;
      case '15':
        clientIvaCondition = 'IVA No Alcanzado';
        break;
      case '5':
        clientIvaCondition = 'Consumidor Final';
        break;
    }

    if (invoice != null) {
      const invoiceData = {
        pointOfSale: Number(invoice.pointOfSale),
        invoiceNumber: Number(invoice.invoiceNumber),
        invoiceType: Number(invoice.invoiceType),
        issueDate: String(invoice.cbteFch),
        businessName: String(sale.business?.name),
        businessCuit: Number(invoice.cuit),
        businessAddress: String(sale.business?.address),
        businessIvaCondition: String(sale.business?.ivaCondition),
        clientName: String(sale.client?.name),
        clientCuit: Number(invoice.documentNumber),
        clientAddress: String(sale.client?.address),
        clientIvaCondition: String(clientIvaCondition),
        clientDocType: Number(invoice.documentType),
        items: saleItems != undefined ? saleItems?.map(saleItem => {
          return {
            code: '',
            description: String(saleItem.product?.name),
            quantity: Number(saleItem.quantity),
            unitPrice: sale.isRetail ? Number(saleItem.product?.retailsalePrice) : Number(saleItem.product?.wholesalePrice),
            subtotal: Number(saleItem.subtotal)
          }
        }) : [],
        subtotal: Number(invoice.totalAmount),
        total: Number(invoice.totalAmount),
        otherTaxes: 0,
        cae: Number(invoice.cae),
        caeExpiration: String(invoice.expirationDate),
        saleCondition: String(sale.paymentMethod?.name)
      };

      generateInvoicePDF(invoiceData);
    }
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
                {queryInvoice.data != null && (
                  <Button
                    onClick={() => handleGeneratePdf()}
                    colorScheme="purple"
                    variant="solid"
                  >
                    <DownloadIcon boxSize={3} me={2} />
                    Factura
                  </Button>
                )}
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
                      <Text fontSize="lg">Descuento aplicado: </Text>
                      <Text as="b" fontSize="lg">
                        {
                          sale?.discount !== undefined
                            ? Number(sale?.discount)
                            : 0
                        } %
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Porcentaje de ganancia: </Text>
                      <Text as="b" fontSize="lg">
                        {
                          profitPorcentage !== undefined
                            ? Number(profitPorcentage).toFixed(2)
                            : 0
                        } %
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
                      <Text fontSize="lg">Ganancia: </Text>
                      <Text as="b" fontSize="lg">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          minimumFractionDigits: 2,
                          currency: "USD",
                        }).format(
                          profit !== undefined
                            ? Number.parseFloat(profit?.toFixed(2))
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
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Afip: </Text>
                      <Text as="b" fontSize="lg">
                        {sale?.isBilled === true ? (
                          <Badge colorScheme="green">Facturado</Badge>
                        ) : (
                          <Badge colorScheme="red">No Facturado</Badge>
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
