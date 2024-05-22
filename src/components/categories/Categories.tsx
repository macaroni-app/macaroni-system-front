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
import Category from "./Category"
import WithoutResults from "../common/WithoutResults"
import NewRecordPanel from "../common/NewRecordPanel"

// custom hooks
import { useCategories } from "../../hooks/useCategories"
import { ICategory } from "./types"
// import { useError } from "../../hooks/useError"

import { ROLES } from "../common/roles"

const Categories = (): JSX.Element => {
  const queryCategories = useCategories({})

  const navigate = useNavigate()

  // const { throwError } = useError()

  // if (queryCategories?.isError) {
  //   throwError(queryCategories?.error)
  // }

  const handleAddCategory = () => {
    navigate("/categories/add")
  }

  const categories = queryCategories?.data as ICategory[]

  const categoryList = categories?.map((category) => {
    if (category._id !== undefined && category.createdAt !== undefined) {
      return (
        <Category
          key={category?._id + category?.createdAt}
          category={category}
        />
      )
    }
  })

  if (queryCategories?.isLoading) {
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
      {!queryCategories?.isError && !queryCategories?.isLoading && (
        <NewRecordPanel
          handleAddRecord={handleAddCategory}
          noRecords={categoryList?.length}
          title="categorias"
          buttonLabel="Nueva categoria"
          roles={[ROLES.ADMIN, ROLES.SUPERVISOR]}
        />
      )}

      {!queryCategories?.isError &&
        queryCategories?.data?.length !== undefined &&
        queryCategories?.data?.length > 0 &&
        !queryCategories?.isLoading && <Grid>{categoryList}</Grid>}
      {!queryCategories?.isError &&
        queryCategories?.data?.length === 0 &&
        !queryCategories?.isLoading && (
          <WithoutResults text={"No hay categorias cargadas."} />
        )}
    </>
  )
}

export default Categories
