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
import Client from "./Client"
import WithoutResults from "../common/WithoutResults"
import NewRecordPanel from "../common/NewRecordPanel"

// custom hooks
import { useClients } from "../../hooks/useClients"
import { IClient } from "./types"
// import { useError } from "../../hooks/useError"

import { ROLES } from "../common/roles"

const Clients = (): JSX.Element => {
  const queryClients = useClients({})

  const navigate = useNavigate()

  // const { throwError } = useError()

  // if (queryCategories?.isError) {
  //   throwError(queryCategories?.error)
  // }

  const handleAddClient = () => {
    navigate("/clients/add")
  }

  const clients = queryClients?.data as IClient[]

  const clientList = clients?.map((client) => {
    if (client._id !== undefined && client.createdAt !== undefined) {
      return <Client key={client?._id + client?.createdAt} client={client} />
    }
  })

  if (queryClients?.isLoading) {
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
      {!queryClients?.isError && !queryClients?.isLoading && (
        <NewRecordPanel
          handleAddRecord={handleAddClient}
          noRecords={clientList?.length}
          title="clientes"
          buttonLabel="Nuevo cliente"
          roles={[ROLES.ADMIN]}
        />
      )}

      {!queryClients?.isError &&
        queryClients?.data?.length !== undefined &&
        queryClients?.data?.length > 0 &&
        !queryClients?.isLoading && <Grid>{clientList}</Grid>}
      {!queryClients?.isError &&
        queryClients?.data?.length === 0 &&
        !queryClients?.isLoading && (
          <WithoutResults text={"No hay clientes cargadas."} />
        )}
    </>
  )
}

export default Clients
