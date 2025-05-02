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
import Business from "./Business"
import WithoutResults from "../common/WithoutResults"
import NewRecordPanel from "../common/NewRecordPanel"

// custom hooks
import { useBusinesses } from "../../hooks/useBusinesses"
// import { useError } from "../../hooks/useError"

// types
import { IBusiness } from "./types"

import ProfileBase from "../common/permissions"

const Businesses = (): JSX.Element => {
  const queryBusinesses = useBusinesses({})

  const navigate = useNavigate()

  // const { throwError } = useError()

  // if (queryCategories?.isError) {
  //   throwError(queryCategories?.error)
  // }

  const handleAddClient = () => {
    navigate("/businesses/add")
  }

  const businesses = queryBusinesses?.data as IBusiness[]

  const businessList = businesses?.map((business) => {
    if (business._id !== undefined && business.createdAt !== undefined) {
      return <Business key={business?._id + business?.createdAt} business={business} />
    }
  })

  if (queryBusinesses?.isLoading) {
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
      {!queryBusinesses?.isError && !queryBusinesses?.isLoading && (
        <NewRecordPanel
          handleAddRecord={handleAddClient}
          noRecords={businessList?.length}
          title="Negocios"
          buttonLabel="Nuevo negocio"
          roles={ProfileBase.clients.create}
        />
      )}

      {!queryBusinesses?.isError &&
        queryBusinesses?.data?.length !== undefined &&
        queryBusinesses?.data?.length > 0 &&
        !queryBusinesses?.isLoading && <Grid>{businessList}</Grid>}
      {!queryBusinesses?.isError &&
        queryBusinesses?.data?.length === 0 &&
        !queryBusinesses?.isLoading && (
          <WithoutResults text={"No hay negocios cargados."} />
        )}
    </>
  )
}

export default Businesses
