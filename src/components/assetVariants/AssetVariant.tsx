import {
  Badge,
  Button,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import ActionMenuButton from "../common/ActionMenuButton"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import CustomModal from "../common/CustomModal"
import ProfileBase from "../common/permissions"
import { useCheckRole } from "../../hooks/useCheckRole"
import { useDeleteAssetVariant } from "../../hooks/useDeleteAssetVariant"
import { useChangeIsActiveAssetVariant } from "../../hooks/useChangeIsActiveAssetVariant"
import { useMessage } from "../../hooks/useMessage"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"
import { IAssetVariant } from "./types"

interface Props {
  assetVariant: IAssetVariant
}

const AssetVariant = ({ assetVariant }: Props) => {
  const navigate = useNavigate()
  const { checkRole } = useCheckRole()
  const { deleteAssetVariant } = useDeleteAssetVariant()
  const { changeIsActiveAssetVariant } = useChangeIsActiveAssetVariant()
  const { showMessage } = useMessage()
  const [isLoading, setIsLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const secondaryTextColor = useColorModeValue("gray.600", "gray.300")
  const valueTextColor = useColorModeValue("gray.700", "gray.100")

  const handleEdit = () => {
    navigate(`${assetVariant._id}/edit`)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    const response = await deleteAssetVariant(String(assetVariant._id))
    if (response?.isDeleted) {
      showMessage(
        "Variante eliminada.",
        AlertStatus.Success,
        AlertColorScheme.Purple,
      )
    } else {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
    }
    setIsLoading(false)
    setDeleteModal(false)
    onClose()
  }

  const handleChangeIsActive = async (isActive: boolean) => {
    setIsLoading(true)
    const response = await changeIsActiveAssetVariant({
      assetVariantId: String(assetVariant._id),
      isActive,
    })
    if (response?.isUpdated) {
      showMessage(
        isActive ? "Variante activada." : "Variante desactivada.",
        AlertStatus.Success,
        AlertColorScheme.Purple,
      )
    } else {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
    }
    setIsLoading(false)
    setDeleteModal(false)
    onClose()
  }

  const baseAssetName =
    typeof assetVariant.baseAsset === "string"
      ? assetVariant.baseAsset
      : assetVariant.baseAsset?.name
  const valuesLabel = (assetVariant.values ?? [])
    .map((value) => (typeof value === "string" ? value : value.name))
    .filter(Boolean)
    .join(", ")

  return (
    <GridItem colSpan={5} mb={3}>
      <Card variant="outline">
        <CardBody>
          <Grid templateColumns="repeat(6, 1fr)" gap={2} alignItems="center">
            <GridItem colSpan={5}>
              <Flex direction="column" gap={2}>
                <Text fontSize="xl" align="start">
                  {assetVariant.name}
                </Text>
                <Text fontSize="sm" color={secondaryTextColor}>
                  Insumo base:{" "}
                  <Text as="span" color={valueTextColor} fontWeight="medium">
                    {baseAssetName ?? "-"}
                  </Text>
                </Text>
                <Text fontSize="sm" color={secondaryTextColor}>
                  Valores:{" "}
                  <Text as="span" color={valueTextColor} fontWeight="medium">
                    {valuesLabel || "-"}
                  </Text>
                </Text>
                <Badge
                  variant="subtle"
                  colorScheme={assetVariant?.isActive ? "green" : "red"}
                  alignSelf={"start"}
                >
                  {assetVariant?.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </Flex>
            </GridItem>
            <GridItem colSpan={1} colStart={6} justifySelf="end">
              {checkRole(ProfileBase.assetVariants.viewActions) && (
                <Popover placement="bottom-start">
                  <PopoverTrigger>
                    <ActionMenuButton ariaLabel="Acciones de la variante de insumo" />
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent width="3xs">
                      <PopoverArrow />
                      <PopoverBody p={0}>
                        <VStack spacing={1} align="stretch">
                          {checkRole(ProfileBase.assetVariants.edit) && (
                            <Button
                              onClick={handleEdit}
                              variant={"blue"}
                              colorScheme="blue"
                              justifyContent={"start"}
                              _hover={{ color: "purple", bg: "purple.100" }}
                            >
                              Editar
                            </Button>
                          )}
                          {checkRole(ProfileBase.assetVariants.deactivate) && (
                            <Button
                              onClick={() => {
                                setDeleteModal(false)
                                onOpen()
                              }}
                              variant={"blue"}
                              colorScheme="blue"
                              justifyContent={"start"}
                              _hover={{ color: "purple", bg: "purple.100" }}
                            >
                              {assetVariant.isActive ? "Desactivar" : "Activar"}
                            </Button>
                          )}
                          {checkRole(ProfileBase.assetVariants.delete) && (
                            <Button
                              onClick={() => {
                                setDeleteModal(true)
                                onOpen()
                              }}
                              variant={"blue"}
                              colorScheme="blue"
                              justifyContent={"start"}
                              _hover={{ color: "purple", bg: "purple.100" }}
                            >
                              Borrar
                            </Button>
                          )}
                        </VStack>
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover>
              )}
            </GridItem>
          </Grid>
        </CardBody>
      </Card>
      <CustomModal
        deleteModal={deleteModal}
        handleChangeIsActive={handleChangeIsActive}
        isLoading={isLoading}
        handleDelete={handleDelete}
        isOpen={isOpen}
        model={assetVariant}
        onClose={onClose}
        modelName={"variante de insumo"}
        key={assetVariant._id}
      />
    </GridItem>
  )
}

export default AssetVariant
