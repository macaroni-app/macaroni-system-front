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
import PaymentMethod from "./PaymentMethod"
import WithoutResults from "../common/WithoutResults"

// custom hooks
import { usePaymentMethods } from "../../hooks/usePaymentMethods"
import { IPaymentMethod } from "./types"
// import { useError } from "../../hooks/useError"

const PaymentMethods = (): JSX.Element => {
  const queryPaymentMethods = usePaymentMethods({})

  const navigate = useNavigate()

  // const { throwError } = useError()

  // if (queryCategories?.isError) {
  //   throwError(queryCategories?.error)
  // }

  const handleAddPaymentMethod = () => {
    navigate("/paymentMethods/add")
  }

  const paymentMethods = queryPaymentMethods?.data as IPaymentMethod[]

  const clientList = paymentMethods?.map((paymentMethod) => {
    if (
      paymentMethod._id !== undefined &&
      paymentMethod.createdAt !== undefined
    ) {
      return (
        <PaymentMethod
          key={paymentMethod?._id + paymentMethod?.createdAt}
          paymentMethod={paymentMethod}
        />
      )
    }
  })

  if (queryPaymentMethods?.isLoading) {
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
      {!queryPaymentMethods?.isError && !queryPaymentMethods?.isLoading && (
        <Card bgColor={"#373E68"} variant="filled" mt={5} mb={3}>
          <CardBody>
            <Flex placeItems={"center"}>
              <Text
                color={"white"}
                fontWeight={"bold"}
                fontSize={{ base: "small", md: "medium" }}
              >
                {clientList?.length} métodos de pagos
              </Text>
              <Spacer />
              <Button
                onClick={() => handleAddPaymentMethod()}
                colorScheme="purple"
                variant="solid"
                size={{ base: "sm", md: "md" }}
              >
                <AddIcon boxSize={3} me={2} />
                Agregar método
              </Button>
            </Flex>
          </CardBody>
        </Card>
      )}

      {!queryPaymentMethods?.isError &&
        queryPaymentMethods?.data?.length !== undefined &&
        queryPaymentMethods?.data?.length > 0 &&
        !queryPaymentMethods?.isLoading && <Grid>{clientList}</Grid>}
      {!queryPaymentMethods?.isError &&
        queryPaymentMethods?.data?.length === 0 &&
        !queryPaymentMethods?.isLoading && (
          <WithoutResults text={"No hay métodos de pago cargados."} />
        )}
    </>
  )
}

export default PaymentMethods
