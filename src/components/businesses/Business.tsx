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

import CustomModal from "../common/CustomModal"

import { useNavigate } from "react-router-dom"

import { ChevronDownIcon, AddIcon } from "@chakra-ui/icons"
import { useState } from "react"

import { useChangeIsActiveBusiness } from "../../hooks/useChangeIsActiveBusiness"
import { useMessage } from "../../hooks/useMessage"
import { useDeleteBusiness } from "../../hooks/useDeleteBusiness"

import { IBusiness } from "./types"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"

import { useCheckRole } from "../../hooks/useCheckRole"
import ProfileBase from "../common/permissions"

interface Props {
  business: IBusiness
}

const Business = ({ business }: Props) => {
  const navigate = useNavigate()

  const { checkRole } = useCheckRole()

  const [isLoading, setIsLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  const { deleteBusiness } = useDeleteBusiness()
  const { showMessage } = useMessage()
  const { changeIsActiveBusiness } = useChangeIsActiveBusiness()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleEdit = () => {
    navigate(`${business._id}/edit`)
  }

  const handleChangeIsActive = async (isActive: boolean) => {
    setIsLoading(true)

    if (business === undefined) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
    }

    let response = undefined

    if (business !== undefined && business._id !== undefined) {
      response = await changeIsActiveBusiness({
        businessId: business._id,
        isActive,
      })
    }

    if (response?.isUpdated) {
      showMessage(
        isActive ? "Cliente activado." : "Cliente desactivado.",
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
    navigate("/businesses ")
  }

  const handleDetails = () => {
    navigate(`/businesses/${business._id}/details`)
  }

  const handleDelete = async () => {
    setIsLoading(true)

    if (business === undefined) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
    }

    let response = undefined

    if (business !== undefined && business._id !== undefined) {
      response = await deleteBusiness(business._id)
    }

    if (response?.isDeleted) {
      showMessage(
        "Negocio eliminado.",
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
    navigate("/businesses")
  }

  return (
    <GridItem colSpan={5} mb={3}>
      <Card variant="outline">
        <CardBody>
          <Grid templateColumns="repeat(6, 1fr)" gap={2} alignItems="center">
            <GridItem colSpan={5}>
              <Flex direction="column" gap={2}>
                <Text noOfLines={1} fontSize="xl" align="start" mr={4}>
                  {business.name}
                </Text>
                <Badge
                  variant="subtle"
                  colorScheme={business?.isActive ? "green" : "red"}
                  alignSelf={"start"}
                >
                  {business?.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </Flex>
            </GridItem>

            <GridItem colSpan={1} colStart={6}>
              <Flex direction="column" gap={2}>
                {checkRole(ProfileBase.businesses.viewActions) && (
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
                            {checkRole(ProfileBase.businesses.view) && (
                              <Button
                                onClick={() => handleDetails()}
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
                                Ver detalles
                              </Button>
                            )}
                            {checkRole(ProfileBase.businesses.edit) && (
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
                            {checkRole(ProfileBase.businesses.deactivate) && (
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
                                {business.isActive ? "Desactivar" : "Activar"}
                              </Button>
                            )}
                            {checkRole(ProfileBase.businesses.delete) && (
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
        handleDelete={handleDelete}
        isLoading={isLoading}
        isOpen={isOpen}
        model={business}
        modelName="Negocio"
        onClose={onClose}
        key={business._id}
      />
    </GridItem>
  )
}

export default Business
