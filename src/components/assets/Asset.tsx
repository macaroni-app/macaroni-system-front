// libs
import { useNavigate } from "react-router-dom"
import { useState } from "react"

// custom hooks
import { useDeleteAsset } from "../../hooks/useDeleteAsset"
import { useMessage } from "../../hooks/useMessage"
import { useCheckRole } from "../../hooks/useCheckRole"

// types
import { IAssetFullCategory } from "./types"

// styles
import {
  Grid,
  GridItem,
  Card,
  CardBody,
  Text,
  Flex,
  IconButton,
  Popover,
  PopoverTrigger,
  Button,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  VStack,
  useDisclosure,
  Badge,
} from "@chakra-ui/react"

import { ChevronDownIcon, AddIcon } from "@chakra-ui/icons"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"

import { useChangeIsActiveAsset } from "../../hooks/useChangeIsActiveAsset"

import CustomModal from "../common/CustomModal"

import ProfileBase from "../common/permissions"

interface Props {
  asset: IAssetFullCategory
}

const Asset = ({ asset }: Props): JSX.Element => {
  const navigate = useNavigate()

  const { checkRole } = useCheckRole()

  const { deleteAsset } = useDeleteAsset()
  const { showMessage } = useMessage()
  const { changeIsActiveAsset } = useChangeIsActiveAsset()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [deleteModal, setDeleteModal] = useState(false)

  const handleEdit = () => {
    navigate(`${asset._id}/edit`)
  }

  // const handleDetails = () => {
  //   navigate(`/assets/${asset._id}/details`)
  // }

  const handleChangeIsActive = async (isActive: boolean) => {
    setIsLoading(true)

    if (asset === undefined) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
      setDeleteModal(false)
    }

    let response = undefined

    if (asset !== undefined && asset._id !== undefined) {
      response = await changeIsActiveAsset({
        assetId: asset._id,
        isActive,
      })
    }

    if (response?.isUpdated) {
      showMessage(
        isActive ? "Insumo activado." : "Insumo desactivado.",
        AlertStatus.Success,
        AlertColorScheme.Purple
      )
      setIsLoading(false)
      onClose()
      setDeleteModal(false)
    }

    if (!response?.isUpdated) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
      setDeleteModal(false)
    }

    navigate("/assets")
  }

  const handleDelete = async () => {
    setIsLoading(true)
    const response = await deleteAsset({ assetId: asset?._id })
    if (response?.isDeleted) {
      showMessage(
        "Insumo eliminado.",
        AlertStatus.Success,
        AlertColorScheme.Purple
      )
      setIsLoading(false)
      setDeleteModal(false)
    }

    if (!response?.isDeleted) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
      setDeleteModal(false)
    }
    navigate("/assets")
  }

  const { isOpen, onOpen, onClose } = useDisclosure()

  const numberColumn = checkRole(ProfileBase.assets.viewActions) ? 5 : 4

  return (
    <GridItem colSpan={5} mb={3}>
      <Card variant="outline">
        <CardBody>
          <Grid
            templateColumns={`repeat(${numberColumn}, 1fr)`}
            gap={2}
            alignItems={"center"}
          >
            <GridItem colSpan={{ base: 3, md: 1 }}>
              <Flex direction="column" gap={2}>
                <Text noOfLines={1} fontSize="xs" align="start" mr={4}>
                  {asset.name}
                </Text>
                <Badge
                  display={{ md: "none" }}
                  variant="subtle"
                  colorScheme="gray"
                  alignSelf={"flex-start"}
                >
                  {asset?.category?.name}
                </Badge>
              </Flex>
            </GridItem>
            <GridItem display={{ base: "none", md: "block" }}>
              <Flex direction="column" gap={2} placeItems={"center"}>
                <Badge
                  variant="subtle"
                  colorScheme={asset?.isActive ? "green" : "red"}
                >
                  {asset?.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </Flex>
            </GridItem>
            <GridItem display={{ base: "none", md: "block" }}>
              <Flex direction="column" gap={2} placeItems={"center"}>
                <Badge variant="subtle" colorScheme="gray">
                  {asset?.category?.name}
                </Badge>
              </Flex>
            </GridItem>
            <GridItem display={{ base: "none", md: "block" }}>
              <Flex direction="column" gap={2} placeItems={"center"}>
                {asset.costPrice !== undefined && (
                  <Text as="b">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      minimumFractionDigits: 2,
                      currency: "USD",
                    }).format(
                      Number.parseFloat(asset?.costPrice.toFixed(2).toString())
                    )}
                  </Text>
                )}
              </Flex>
            </GridItem>
            <GridItem colStart={{ base: 5 }}>
              <Flex direction="column" gap={2} placeItems={"center"}>
                {asset.costPrice !== undefined && (
                  <Text display={{ md: "none" }} as="b">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      minimumFractionDigits: 2,
                      currency: "USD",
                    }).format(
                      Number.parseFloat(asset?.costPrice.toFixed(2).toString())
                    )}
                  </Text>
                )}
                {checkRole(ProfileBase.assets.viewActions) && (
                  <>
                    <Popover placement="bottom-start">
                      <PopoverTrigger>
                        <IconButton
                          alignSelf="end"
                          variant={"link"}
                          colorScheme="blackAlpha"
                          aria-label="some"
                          size="md"
                          icon={
                            <>
                              <AddIcon boxSize="3" />
                              <ChevronDownIcon boxSize="4" />
                            </>
                          }
                        />
                      </PopoverTrigger>
                      <Portal>
                        <PopoverContent width="3xs">
                          <PopoverArrow />
                          <PopoverBody p={0}>
                            <VStack spacing={1} align="stretch">
                              {/* {checkRole(ProfileBase.assets.view) && (
                                <Button
                                  onClick={() => handleDetails()}
                                  variant="blue"
                                  colorScheme="blue"
                                  justifyContent={"start"}
                                  size="md"
                                  _hover={{
                                    textDecoration: "none",
                                    color: "purple",
                                    bg: "purple.100",
                                  }}
                                >
                                  Ver detalles
                                </Button>
                              )} */}
                              {checkRole(ProfileBase.assets.edit) && (
                                <Button
                                  onClick={() => handleEdit()}
                                  variant={"blue"}
                                  colorScheme="blue"
                                  justifyContent={"start"}
                                  size="md"
                                  _hover={{
                                    textDecoration: "none",
                                    color: "purple",
                                    bg: "purple.100",
                                  }}
                                >
                                  Editar
                                </Button>
                              )}
                              {checkRole(ProfileBase.assets.deactivate) && (
                                <Button
                                  onClick={() => {
                                    setDeleteModal(false)
                                    onOpen()
                                  }}
                                  variant={"blue"}
                                  colorScheme="blue"
                                  justifyContent={"start"}
                                  size="md"
                                  _hover={{
                                    textDecoration: "none",
                                    color: "purple",
                                    bg: "purple.100",
                                  }}
                                >
                                  {asset.isActive ? "Desactivar" : "Activar"}
                                </Button>
                              )}
                              {checkRole(ProfileBase.assets.delete) && (
                                <Button
                                  onClick={() => {
                                    setDeleteModal(true)
                                    onOpen()
                                  }}
                                  variant={"blue"}
                                  colorScheme="blue"
                                  justifyContent={"start"}
                                  size="md"
                                  _hover={{
                                    textDecoration: "none",
                                    color: "purple",
                                    bg: "purple.100",
                                  }}
                                >
                                  Borrar
                                </Button>
                              )}
                            </VStack>
                          </PopoverBody>
                        </PopoverContent>
                      </Portal>
                    </Popover>
                  </>
                )}
              </Flex>
            </GridItem>
          </Grid>
        </CardBody>
      </Card>
      <CustomModal
        deleteModal={deleteModal}
        handleChangeIsActive={handleChangeIsActive}
        handleDelete={handleDelete}
        isLoading={isLoading}
        isOpen={isOpen}
        model={asset}
        modelName="Insumo"
        onClose={onClose}
        key={asset._id}
      />
    </GridItem>
  )
}

export default Asset
