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
import { IBusiness } from "./types"

import { ChevronLeftIcon } from "@chakra-ui/icons"


// import { format } from "date-fns"
// import { es } from "date-fns/locale"

// custom hooks
import { useBusinesses } from "../../hooks/useBusinesses"

const BusinessDetails = () => {
  const { businessId } = useParams()

  const queryBusinesses = useBusinesses({ id: businessId })

  const business = queryBusinesses.data?.filter(
    (business) => business._id === businessId
  )[0] as IBusiness


  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate("/businesses")
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
        {queryBusinesses?.isLoading && (
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
        {!queryBusinesses?.isLoading && (
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
                        {business?.name}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Cuit: </Text>
                      <Text as="b" fontSize="lg">
                        {business?.cuit}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Condición frente al IVA: </Text>
                      <Text as="b" fontSize="lg">
                        {business?.ivaCondition}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Dirección: </Text>
                      <Text as="b" fontSize="lg">
                        {business?.address}
                      </Text>
                    </Flex>
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

export default BusinessDetails
