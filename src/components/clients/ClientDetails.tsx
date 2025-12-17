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
} from "@chakra-ui/react"

import { useNavigate, useParams } from "react-router-dom"

// types
import { IClient } from "./types"

import { ChevronLeftIcon } from "@chakra-ui/icons"


// import { format } from "date-fns"
// import { es } from "date-fns/locale"

// custom hooks
import { useClients } from "../../hooks/useClients"

const ClientDetails = () => {
  const { clientId } = useParams()

  const queryClients = useClients({ id: clientId })

  const client = queryClients.data?.filter(
    (client) => client._id === clientId
  )[0] as IClient


  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate("/clients")
  }

  // { id: '1', name: 'IVA Responsable Inscripto' },
  // { id: '6', name: 'Responsable Monotributo' },
  // { id: '13', name: 'Monotributista Social' },
  // { id: '16', name: 'Monotributo Trabajador Independiente Promovido' },
  // { id: '4', name: 'IVA Sujeto Exento' },
  // { id: '7', name: 'Sujeto No Categorizado' },
  // { id: '8', name: 'Proveedor del Exterior' },
  // { id: '9', name: 'Cliente del Exterior' },
  // { id: '10', name: 'IVA Liberado – Ley N° 19.640' },
  // { id: '15', name: 'IVA No Alcanzado' },
  // { id: '5', name: 'Consumidor Final' }

  let condicionIVAReceptor = '';
  const condicionIVAReceptorId = client?.condicionIVAReceptorId;
  switch (condicionIVAReceptorId) {
    case '1':
      condicionIVAReceptor = 'IVA Responsable Inscripto';
      break;
    case '6':
      condicionIVAReceptor = 'Responsable Monotributo';
      break;
    case '13':
      condicionIVAReceptor = 'Monotributista Social';
      break;
    case '16':
      condicionIVAReceptor = 'Monotributo Trabajador Independiente Promovido';
      break;
    case '4':
      condicionIVAReceptor = 'IVA Sujeto Exento';
      break;
    case '7':
      condicionIVAReceptor = 'Sujeto No Categorizado';
      break;
    case '8':
      condicionIVAReceptor = 'Proveedor del Exterior';
      break;
    case '9':
      condicionIVAReceptor = 'Cliente del Exterior';
      break;
    case '10':
      condicionIVAReceptor = 'IVA Liberado – Ley N° 19.640';
      break;
    case '15':
      condicionIVAReceptor = 'IVA No Alcanzado';
      break;
    case '5':
      condicionIVAReceptor = 'Consumidor Final';
      break;
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
              </Flex>
            </CardBody>
          </Card>
        </GridItem>
        {queryClients?.isLoading && (
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
        {!queryClients?.isLoading && (
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
                        {client?.name}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Cuit: </Text>
                      <Text as="b" fontSize="lg">
                        {client?.documentNumber}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Tipo documento: </Text>
                      <Text as="b" fontSize="lg">
                        {client?.documentType === '80' ? 'CUIT' : 'Doc. (Otro)'}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Condición frente al IVA: </Text>
                      <Text as="b" fontSize="lg">
                        {condicionIVAReceptor}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Dirección: </Text>
                      <Text as="b" fontSize="lg">
                        {client?.address}
                      </Text>
                    </Flex>
                    {/* <Flex
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
                    </Flex> */}
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </GridItem>
        )}
      </Grid>
    </>
  )
}

export default ClientDetails
