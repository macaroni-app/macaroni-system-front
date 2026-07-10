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
  useDisclosure,
} from "@chakra-ui/react"
import ActionMenuButton from "../common/ActionMenuButton"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import CustomModal from "../common/CustomModal"
import ProfileBase from "../common/permissions"
import { useCheckRole } from "../../hooks/useCheckRole"
import { useDeleteVariantAttribute } from "../../hooks/useDeleteVariantAttribute"
import { useChangeIsActiveVariantAttribute } from "../../hooks/useChangeIsActiveVariantAttribute"
import { useMessage } from "../../hooks/useMessage"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"
import { IVariantAttribute } from "./types"

interface Props {
  variantAttribute: IVariantAttribute
}

const VariantAttribute = ({ variantAttribute }: Props) => {
  const navigate = useNavigate()
  const { checkRole } = useCheckRole()
  const { deleteVariantAttribute } = useDeleteVariantAttribute()
  const { changeIsActiveVariantAttribute } = useChangeIsActiveVariantAttribute()
  const { showMessage } = useMessage()
  const [isLoading, setIsLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleEdit = () => {
    navigate(`${variantAttribute._id}/edit`)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    const response = await deleteVariantAttribute(String(variantAttribute._id))
    if (response?.isDeleted) {
      showMessage(
        "Atributo eliminado.",
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
    const response = await changeIsActiveVariantAttribute({
      variantAttributeId: String(variantAttribute._id),
      isActive,
    })
    if (response?.isUpdated) {
      showMessage(
        isActive ? "Atributo activado." : "Atributo desactivado.",
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

  return (
    <GridItem colSpan={5} mb={3}>
      <Card variant="outline">
        <CardBody>
          <Grid templateColumns="repeat(6, 1fr)" gap={2} alignItems="center">
            <GridItem colSpan={5}>
              <Flex direction="column" gap={2}>
                <Text fontSize="xl" align="start">
                  {variantAttribute.name}
                </Text>
                <Badge
                  variant="subtle"
                  colorScheme={variantAttribute?.isActive ? "green" : "red"}
                  alignSelf={"start"}
                >
                  {variantAttribute?.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </Flex>
            </GridItem>
            <GridItem colSpan={1} colStart={6} justifySelf="end">
              {checkRole(ProfileBase.variantAttributes.viewActions) && (
                <Popover placement="bottom-start">
                  <PopoverTrigger>
                    <ActionMenuButton ariaLabel="Acciones del atributo de variante" />
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent width="3xs">
                      <PopoverArrow />
                      <PopoverBody p={0}>
                        <VStack spacing={1} align="stretch">
                          {checkRole(ProfileBase.variantAttributes.edit) && (
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
                          {checkRole(ProfileBase.variantAttributes.deactivate) && (
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
                              {variantAttribute.isActive ? "Desactivar" : "Activar"}
                            </Button>
                          )}
                          {checkRole(ProfileBase.variantAttributes.delete) && (
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
        model={variantAttribute}
        onClose={onClose}
        modelName={"atributo de variante"}
        key={variantAttribute._id}
      />
    </GridItem>
  )
}

export default VariantAttribute
