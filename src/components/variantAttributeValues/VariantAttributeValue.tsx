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
import { useDeleteVariantAttributeValue } from "../../hooks/useDeleteVariantAttributeValue"
import { useChangeIsActiveVariantAttributeValue } from "../../hooks/useChangeIsActiveVariantAttributeValue"
import { useMessage } from "../../hooks/useMessage"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"
import { IVariantAttributeValue } from "./types"

interface Props {
  variantAttributeValue: IVariantAttributeValue
}

const VariantAttributeValue = ({ variantAttributeValue }: Props) => {
  const navigate = useNavigate()
  const { checkRole } = useCheckRole()
  const { deleteVariantAttributeValue } = useDeleteVariantAttributeValue()
  const { changeIsActiveVariantAttributeValue } =
    useChangeIsActiveVariantAttributeValue()
  const { showMessage } = useMessage()
  const [isLoading, setIsLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const secondaryTextColor = useColorModeValue("gray.600", "gray.300")
  const valueTextColor = useColorModeValue("gray.700", "gray.100")

  const handleEdit = () => {
    navigate(`${variantAttributeValue._id}/edit`)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    const response = await deleteVariantAttributeValue(
      String(variantAttributeValue._id),
    )
    if (response?.isDeleted) {
      showMessage(
        "Valor eliminado.",
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
    const response = await changeIsActiveVariantAttributeValue({
      variantAttributeValueId: String(variantAttributeValue._id),
      isActive,
    })
    if (response?.isUpdated) {
      showMessage(
        isActive ? "Valor activado." : "Valor desactivado.",
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

  const attributeName =
    typeof variantAttributeValue.attribute === "string"
      ? variantAttributeValue.attribute
      : variantAttributeValue.attribute?.name

  return (
    <GridItem colSpan={5} mb={3}>
      <Card variant="outline">
        <CardBody>
          <Grid templateColumns="repeat(6, 1fr)" gap={2} alignItems="center">
            <GridItem colSpan={5}>
              <Flex direction="column" gap={2}>
                <Text fontSize="xl" align="start">
                  {variantAttributeValue.name}
                </Text>
                <Text fontSize="sm" color={secondaryTextColor}>
                  Atributo:{" "}
                  <Text as="span" color={valueTextColor} fontWeight="medium">
                    {attributeName ?? "-"}
                  </Text>
                </Text>
                <Badge
                  variant="subtle"
                  colorScheme={variantAttributeValue?.isActive ? "green" : "red"}
                  alignSelf={"start"}
                >
                  {variantAttributeValue?.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </Flex>
            </GridItem>
            <GridItem colSpan={1} colStart={6} justifySelf="end">
              {checkRole(ProfileBase.variantAttributeValues.viewActions) && (
                <Popover placement="bottom-start">
                  <PopoverTrigger>
                    <ActionMenuButton ariaLabel="Acciones del valor de variante" />
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent width="3xs">
                      <PopoverArrow />
                      <PopoverBody p={0}>
                        <VStack spacing={1} align="stretch">
                          {checkRole(ProfileBase.variantAttributeValues.edit) && (
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
                          {checkRole(
                            ProfileBase.variantAttributeValues.deactivate,
                          ) && (
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
                              {variantAttributeValue.isActive ? "Desactivar" : "Activar"}
                            </Button>
                          )}
                          {checkRole(ProfileBase.variantAttributeValues.delete) && (
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
        model={variantAttributeValue}
        onClose={onClose}
        modelName={"valor de variante"}
        key={variantAttributeValue._id}
      />
    </GridItem>
  )
}

export default VariantAttributeValue
