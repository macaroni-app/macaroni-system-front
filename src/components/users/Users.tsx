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
import User from "./User"
import WithoutResults from "../common/WithoutResults"
import NewRecordPanel from "../common/NewRecordPanel"

// custom hooks
import { useUsers } from "../../hooks/useUsers"
import { IUserFullRelated } from "./types"
// import { useError } from "../../hooks/useError"

import ProfileBase from "../common/permissions"

const Users = (): JSX.Element => {
  const queryUsers = useUsers({})

  const navigate = useNavigate()

  // const { throwError } = useError()

  // if (queryCategories?.isError) {
  //   throwError(queryCategories?.error)
  // }

  const handleAddUser = () => {
    navigate("/users/add")
  }

  const users = queryUsers?.data as IUserFullRelated[]

  const userList = users?.map((user) => {
    if (user._id !== undefined && user.createdAt !== undefined) {
      return <User key={user?._id + user?.createdAt} user={user} />
    }
  })

  if (queryUsers?.isLoading) {
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
      {!queryUsers?.isError && !queryUsers?.isLoading && (
        <NewRecordPanel
          handleAddRecord={handleAddUser}
          noRecords={userList?.length}
          title="usuarios"
          buttonLabel="Nuevo usuario"
          roles={ProfileBase.users.create}
        />
      )}

      {!queryUsers?.isError &&
        queryUsers?.data?.length !== undefined &&
        queryUsers?.data?.length > 0 &&
        !queryUsers?.isLoading && <Grid>{userList}</Grid>}
      {!queryUsers?.isError &&
        queryUsers?.data?.length === 0 &&
        !queryUsers?.isLoading && (
          <WithoutResults text={"No hay usuarios cargados."} />
        )}
    </>
  )
}

export default Users
