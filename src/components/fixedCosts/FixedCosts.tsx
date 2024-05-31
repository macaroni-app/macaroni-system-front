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
import FixedCost from "./FixedCost"
import WithoutResults from "../common/WithoutResults"
import NewRecordPanel from "../common/NewRecordPanel"

// custom hooks
import { useFixedCosts } from "../../hooks/useFixedCosts"
import { IFixedCost } from "./types"
// import { useError } from "../../hooks/useError"

import ProfileBase from "../common/permissions"

const FixedCosts = (): JSX.Element => {
  const queryFixedCosts = useFixedCosts({})

  const navigate = useNavigate()

  // const { throwError } = useError()

  // if (queryCategories?.isError) {
  //   throwError(queryCategories?.error)
  // }

  const handleAddFixedCost = () => {
    navigate("/fixedCosts/add")
  }

  const fixedCosts = queryFixedCosts?.data as IFixedCost[]

  const fixedCostList = fixedCosts?.map((fixedCost) => {
    if (fixedCost._id !== undefined && fixedCost.createdAt !== undefined) {
      return (
        <FixedCost
          key={fixedCost?._id + fixedCost?.createdAt}
          fixedCost={fixedCost}
        />
      )
    }
  })

  if (queryFixedCosts?.isLoading) {
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
      {!queryFixedCosts?.isError && !queryFixedCosts?.isLoading && (
        <NewRecordPanel
          handleAddRecord={handleAddFixedCost}
          noRecords={fixedCostList?.length}
          title="gastos fijos"
          buttonLabel="Nuevo gasto fijo"
          roles={ProfileBase.fixedCosts.create}
        />
      )}

      {!queryFixedCosts?.isError &&
        queryFixedCosts?.data?.length !== undefined &&
        queryFixedCosts?.data?.length > 0 &&
        !queryFixedCosts?.isLoading && <Grid>{fixedCostList}</Grid>}
      {!queryFixedCosts?.isError &&
        queryFixedCosts?.data?.length === 0 &&
        !queryFixedCosts?.isLoading && (
          <WithoutResults text={"No hay gastos fijos cargadas."} />
        )}
    </>
  )
}

export default FixedCosts
