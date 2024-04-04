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
import Category from "./Category"
import WithoutResults from "../common/WithoutResults"

// custom hooks
import { useCategories } from "../../hooks/useCategories"
import { ICategory } from "./types"
// import { useError } from "../../hooks/useError"

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
        <Card bgColor={"#373E68"} variant="filled" mt={5} mb={3}>
          <CardBody>
            <Flex placeItems={"center"}>
              <Text color={"white"} fontWeight={"bold"}>
                {categoryList?.length} categorias
              </Text>
              <Spacer />
              <Button
                onClick={() => handleAddCategory()}
                colorScheme="purple"
                variant="solid"
              >
                <AddIcon boxSize={3} me={2} />
                Agregar categoria
              </Button>
            </Flex>
          </CardBody>
        </Card>
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
