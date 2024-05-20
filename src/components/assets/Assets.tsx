// libs
import { useNavigate } from "react-router-dom"
import { ChangeEvent, useState } from "react"

// custom hooks
import { useAssets } from "../../hooks/useAssets"
import { useError } from "../../hooks/useError"
import { useCheckRole } from "../../hooks/useCheckRole"

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

import { ROLES } from "../common/roles"

const Assets = (): JSX.Element => {
  const [searchValue, setSearchValue] = useState<string>("")

  const { checkRole } = useCheckRole()

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

  const numberColumn = checkRole([ROLES.ADMIN]) ? 5 : 4

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
                {checkRole([ROLES.ADMIN]) && (
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
            <GridItem>
              <Card variant="outline" mb={3}>
                <CardBody>
                  <Grid
                    templateColumns={`repeat(${numberColumn}, 1fr)`}
                    gap={2}
                    alignItems={"center"}
                  >
                    <GridItem>
                      <Flex direction="column" gap={2}>
                        <Text fontWeight="bold">Nombre del insumo</Text>
                      </Flex>
                    </GridItem>
                    <GridItem>
                      <Flex direction="column" gap={2} placeItems={"center"}>
                        <Text fontWeight="bold">Estado</Text>
                      </Flex>
                    </GridItem>
                    <GridItem>
                      <Flex direction="column" gap={2} placeItems={"center"}>
                        <Text fontWeight="bold">Categoria</Text>
                      </Flex>
                    </GridItem>
                    <GridItem>
                      <Flex direction="column" gap={2} placeItems={"center"}>
                        <Text fontWeight="bold">Precio de costo</Text>
                      </Flex>
                    </GridItem>
                    {checkRole([ROLES.ADMIN]) && (
                      <GridItem>
                        <Flex direction="column" gap={2} placeItems={"end"}>
                          <Text fontWeight="bold">Acciones</Text>
                        </Flex>
                      </GridItem>
                    )}
                  </Grid>
                </CardBody>
              </Card>
            </GridItem>
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
