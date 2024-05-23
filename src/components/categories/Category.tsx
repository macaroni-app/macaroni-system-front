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

import { useNavigate } from "react-router-dom"

import { ChevronDownIcon, AddIcon } from "@chakra-ui/icons"
import { useState } from "react"

import { useDeleteCategory } from "../../hooks/useDeleteCategory"
import { useMessage } from "../../hooks/useMessage"
import { useChangeIsActiveCategory } from "../../hooks/useChangeIsActiveCategory"

import { ICategory } from "./types"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"

import CustomModal from "../common/CustomModal"

import { useCheckRole } from "../../hooks/useCheckRole"
import ProfileBase from "../common/permissions"

interface Props {
  category: ICategory
}

const Category = ({ category }: Props) => {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)

  const { checkRole } = useCheckRole()

  const [deleteModal, setDeleteModal] = useState(false)

  const { deleteCategory } = useDeleteCategory()
  const { showMessage } = useMessage()
  const { changeIsActiveCategory } = useChangeIsActiveCategory()

  const handleEdit = () => {
    navigate(`${category._id}/edit`)
  }

  const handleChangeIsActive = async (isActive: boolean) => {
    setIsLoading(true)

    if (category === undefined) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
    }

    let response = undefined

    if (category !== undefined && category._id !== undefined) {
      response = await changeIsActiveCategory({
        categoryId: category._id,
        isActive,
      })
    }

    if (response?.isUpdated) {
      showMessage(
        isActive ? "Categoria activada." : "Categoria desactivada.",
        AlertStatus.Success,
        AlertColorScheme.Purple
      )
      setIsLoading(false)
      onClose()
    }

    if (!response?.isUpdated) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
    }

    setDeleteModal(false)
    navigate("/categories")
  }

  const handleDelete = async () => {
    setIsLoading(true)

    if (category === undefined) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
    }

    let response = undefined

    if (category !== undefined && category._id !== undefined) {
      response = await deleteCategory(category._id)
    }

    if (response?.isDeleted) {
      showMessage(
        "Categoría eliminada.",
        AlertStatus.Success,
        AlertColorScheme.Purple
      )
      setIsLoading(false)
    }

    if (!response?.isDeleted) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
    }

    setDeleteModal(false)
    navigate("/categories")
  }

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <GridItem colSpan={5} mb={3}>
      <Card variant="outline">
        <CardBody>
          <Grid templateColumns="repeat(6, 1fr)" gap={2} alignItems="center">
            <GridItem colSpan={5}>
              <Flex direction="column" gap={2}>
                <Text fontSize="xl" align="start">
                  {category.name}
                </Text>
                <Badge
                  variant="subtle"
                  colorScheme={category?.isActive ? "green" : "red"}
                  alignSelf={"start"}
                >
                  {category?.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </Flex>
            </GridItem>

            <GridItem colSpan={1} colStart={6}>
              <Flex direction="column" gap={2}>
                {checkRole(ProfileBase.categories.viewActions) && (
                  <Popover placement="bottom-start">
                    <PopoverTrigger>
                      <IconButton
                        alignSelf="end"
                        variant={"link"}
                        colorScheme="blackAlpha"
                        size="md"
                        icon={
                          <>
                            <AddIcon boxSize="3" />
                            <ChevronDownIcon boxSize="4" />
                          </>
                        }
                        aria-label={""}
                      />
                    </PopoverTrigger>
                    <Portal>
                      <PopoverContent width="3xs">
                        <PopoverArrow />
                        <PopoverBody p={0}>
                          <VStack spacing={1} align="stretch">
                            {checkRole(ProfileBase.categories.edit) && (
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
                            {checkRole(ProfileBase.categories.deactivate) && (
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
                                {category.isActive ? "Desactivar" : "Activar"}
                              </Button>
                            )}
                            {checkRole(ProfileBase.categories.delete) && (
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
                )}
              </Flex>
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
        model={category}
        onClose={onClose}
        modelName={"categoria"}
        key={category._id}
      />
    </GridItem>
  )
}

export default Category
