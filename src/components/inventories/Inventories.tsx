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
import Inventory from "./Inventory"
import WithoutResults from "../common/WithoutResults"

// custom hooks
import { useInventories } from "../../hooks/useInventories"
import { IInventoryFullRelated } from "./types"
// import { useError } from "../../hooks/useError"

import { ROLES } from "../common/roles"
import { useCheckRole } from "../../hooks/useCheckRole"

const Inventories = (): JSX.Element => {
  const queryInventories = useInventories({})

  const navigate = useNavigate()

  const { checkRole } = useCheckRole()

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
        <Card bgColor={"#373E68"} variant="filled" mt={5} mb={3}>
          <CardBody>
            <Flex placeItems={"center"}>
              <Text
                color={"white"}
                fontWeight={"bold"}
                fontSize={{ base: "small", md: "medium" }}
              >
                {inventoryList?.length} inventarios
              </Text>
              <Spacer />
              {checkRole([ROLES.ADMIN]) && (
                <Button
                  onClick={() => handleAddInventory()}
                  colorScheme="purple"
                  variant="solid"
                  size={{ base: "sm", md: "md" }}
                >
                  <AddIcon boxSize={3} me={2} />
                  Nuevo inventario
                </Button>
              )}
              {/* {auth?.roles
                ?.map((role) => role === ROLES.ADMIN)
                .find((val) => val) && (
                <Button
                  onClick={() => handleAddInventory()}
                  colorScheme="purple"
                  variant="solid"
                >
                  <AddIcon boxSize={3} me={2} />
                  Agregar inventario
                </Button>
              )} */}
            </Flex>
          </CardBody>
        </Card>
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
