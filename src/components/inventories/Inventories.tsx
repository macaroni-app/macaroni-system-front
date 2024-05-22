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
import Inventory from "./Inventory"
import WithoutResults from "../common/WithoutResults"
import NewRecordPanel from "../common/NewRecordPanel"

// custom hooks
import { useInventories } from "../../hooks/useInventories"
import { IInventoryFullRelated } from "./types"
// import { useError } from "../../hooks/useError"

import { ROLES } from "../common/roles"

const Inventories = (): JSX.Element => {
  const queryInventories = useInventories({})

  const navigate = useNavigate()

  // const { throwError } = useError()

  // if (queryCategories?.isError) {
  //   throwError(queryCategories?.error)
  // }

  const handleAddInventory = () => {
    navigate("/inventories/add")
  }

  const inventories = queryInventories?.data as IInventoryFullRelated[]

  const inventoryList = inventories?.map((inventory) => {
    if (inventory._id !== undefined && inventory.createdAt !== undefined) {
      return (
        <Inventory
          key={inventory?._id + inventory?.createdAt}
          inventory={inventory}
        />
      )
    }
  })

  if (queryInventories?.isLoading) {
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
      {!queryInventories?.isError && !queryInventories?.isLoading && (
        <NewRecordPanel
          handleAddRecord={handleAddInventory}
          noRecords={inventoryList?.length}
          title="inventarios"
          buttonLabel="Nuevo inventario"
          roles={[ROLES.ADMIN, ROLES.SUPERVISOR]}
        />
      )}

      {!queryInventories?.isError &&
        queryInventories?.data?.length !== undefined &&
        queryInventories?.data?.length > 0 &&
        !queryInventories?.isLoading && <Grid>{inventoryList}</Grid>}
      {!queryInventories?.isError &&
        queryInventories?.data?.length === 0 &&
        !queryInventories?.isLoading && (
          <WithoutResults text={"No hay inventarios cargados."} />
        )}
    </>
  )
}

export default Inventories
