// libs
import { useNavigate } from "react-router-dom"
import { ChangeEvent, useState } from "react"

// custom hooks
import { useAssets } from "../../hooks/useAssets"
import { useError } from "../../hooks/useError"

// types
import { IAssetFullCategory } from "./types"

// styles
import {
  Grid,
  GridItem,
  Button,
  Card,
  CardBody,
  Flex,
  Spacer,
  Text,
  Stack,
  Skeleton,
  FormControl,
  Input,
} from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"

// components
import Asset from "./Asset"
// import Dashboard from "../reports/Dashboard"
import WithoutResults from "../common/WithoutResults"

import { useAuthContext } from "../../hooks/useAuthContext"
import { IUserContext } from "../../context/types"

import { ROLES } from "../common/roles"

const Assets = (): JSX.Element => {
  const [searchValue, setSearchValue] = useState<string>("")

  const { auth } = useAuthContext() as IUserContext

  const { throwError } = useError()

  const navigate = useNavigate()

  const queryAssets = useAssets({})

  if (queryAssets.isError) {
    throwError(queryAssets.error)
  }

  const handleAddAsset = () => {
    navigate("add")
  }

  const handleSetSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const assets = queryAssets?.data as IAssetFullCategory[]

  const assetList = assets
    ?.filter((asset) => {
      if (asset.name !== undefined) {
        return asset.name.toLowerCase().includes(searchValue.toLowerCase())
      }
    })
    ?.map((asset) => {
      if (asset._id !== undefined && asset.createdAt !== undefined) {
        return <Asset key={asset?._id + asset?.createdAt} asset={asset} />
      }
    })

  return (
    <>
      {queryAssets?.isLoading && (
        <Card variant="outline" mt={5} mb={3}>
          <CardBody>
            <Stack>
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </Stack>
          </CardBody>
        </Card>
      )}

      {/* {!queryProducts?.isError && !queryProducts?.isLoading && (
        <Dashboard queryProducts={queryProducts} />
      )} */}
      {!queryAssets?.isError && !queryAssets?.isLoading && (
        <>
          <Card bgColor={"#373E68"} variant="outline" mt={5} mb={3}>
            <CardBody>
              <Flex placeItems={"center"}>
                <Text color={"white"} fontWeight={"bold"}>
                  {assetList?.length} insumos
                </Text>
                <Spacer />
                {auth?.roles
                  ?.map((role) => role === ROLES.ADMIN)
                  .find((val) => val) && (
                  <Button
                    onClick={() => handleAddAsset()}
                    colorScheme="purple"
                    variant="solid"
                  >
                    <AddIcon boxSize={3} me={2} />
                    Agregar insumo
                  </Button>
                )}
              </Flex>
            </CardBody>
          </Card>
          <Card variant="outline" mt={5} mb={3}>
            <CardBody>
              <Flex>
                <FormControl>
                  <Input
                    name="searchValue"
                    type="text"
                    value={searchValue}
                    onChange={(e) => handleSetSearchValue(e)}
                    placeholder="Buscar insumo ..."
                    required
                  />
                </FormControl>
              </Flex>
            </CardBody>
          </Card>
        </>
      )}

      {queryAssets?.isLoading && (
        <>
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
          <Card variant="outline" mb={3} mt={5}>
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
      )}

      {!queryAssets?.isError &&
        queryAssets?.data?.length !== undefined &&
        queryAssets?.data?.length > 0 &&
        !queryAssets?.isLoading && (
          <Grid mt={5}>
            <GridItem>{assetList}</GridItem>
          </Grid>
        )}
      {!queryAssets?.isError &&
        queryAssets?.data?.length === 0 &&
        !queryAssets?.isLoading && (
          <WithoutResults text={"No hay insumos cargados."} />
        )}
    </>
  )
}

export default Assets
