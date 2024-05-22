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
import PaymentMethod from "./PaymentMethod"
import WithoutResults from "../common/WithoutResults"
import NewRecordPanel from "../common/NewRecordPanel"

// custom hooks
import { usePaymentMethods } from "../../hooks/usePaymentMethods"
import { IPaymentMethod } from "./types"
// import { useError } from "../../hooks/useError"

import { ROLES } from "../common/roles"

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

  const paymentMethodList = paymentMethods?.map((paymentMethod) => {
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
        <NewRecordPanel
          handleAddRecord={handleAddPaymentMethod}
          noRecords={paymentMethodList?.length}
          title="métodos de pagos"
          buttonLabel="Nuevo método"
          roles={[ROLES.ADMIN, ROLES.SUPERVISOR]}
        />
      )}

      {!queryPaymentMethods?.isError &&
        queryPaymentMethods?.data?.length !== undefined &&
        queryPaymentMethods?.data?.length > 0 &&
        !queryPaymentMethods?.isLoading && <Grid>{paymentMethodList}</Grid>}
      {!queryPaymentMethods?.isError &&
        queryPaymentMethods?.data?.length === 0 &&
        !queryPaymentMethods?.isLoading && (
          <WithoutResults text={"No hay métodos de pago cargados."} />
        )}
    </>
  )
}

export default PaymentMethods
