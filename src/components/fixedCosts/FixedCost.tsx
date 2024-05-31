import { useState } from "react"
import { useNavigate } from "react-router-dom"

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
} from "@chakra-ui/react"

import CustomModal from "../common/CustomModal"

import { ChevronDownIcon, AddIcon } from "@chakra-ui/icons"

import { useDeleteFixedCost } from "../../hooks/useDeleteFixedCost"
import { useMessage } from "../../hooks/useMessage"

import { IFixedCost } from "./types"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"

import { format } from "date-fns"
import { es } from "date-fns/locale"

import { useCheckRole } from "../../hooks/useCheckRole"

import ProfileBase from "../common/permissions"

interface Props {
  fixedCost: IFixedCost
}

const FixedCost = ({ fixedCost }: Props) => {
  const navigate = useNavigate()

  const { checkRole } = useCheckRole()

  const [isLoading, setIsLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  const { deleteFixedCost } = useDeleteFixedCost()
  const { showMessage } = useMessage()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleEdit = () => {
    navigate(`${fixedCost._id}/edit`)
  }

  const handleDelete = async () => {
    setIsLoading(true)

    if (fixedCost === undefined) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
    }

    let response = undefined

    if (fixedCost !== undefined && fixedCost._id !== undefined) {
      response = await deleteFixedCost(fixedCost._id)
    }

    if (response?.isDeleted) {
      showMessage(
        "Gasto fijo eliminado.",
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
    navigate("/fixedCosts")
  }

  return (
    <GridItem colSpan={5} mb={3}>
      <Card variant="outline">
        <CardBody>
          <Grid templateColumns="repeat(6, 1fr)" gap={2} alignItems="center">
            <GridItem colSpan={5}>
              <Flex direction="column" gap={2}>
                <Text noOfLines={1} fontSize="xl" align="start" mr={4}>
                  {fixedCost.name}
                </Text>
                <Text color={"gray.500"} fontSize="xs" align="start">
                  {format(
                    new Date(
                      fixedCost?.operationDate ? fixedCost?.operationDate : ""
                    ),
                    "eeee dd yyyy",
                    {
                      locale: es,
                    }
                  )}
                </Text>
              </Flex>
            </GridItem>

            <GridItem colStart={{ base: 6 }}>
              <Flex direction="column" gap={2} placeItems={"flex-end"}>
                <Text as="b">
                  {fixedCost?.amount
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(Number.parseFloat(fixedCost?.amount.toString()))
                    : new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(0)}
                </Text>
                {checkRole(ProfileBase.fixedCosts.viewActions) && (
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
                            {checkRole(ProfileBase.fixedCosts.edit) && (
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
                            {checkRole(ProfileBase.fixedCosts.delete) && (
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
        handleDelete={handleDelete}
        handleChangeIsActive={() => console.log()}
        isLoading={isLoading}
        isOpen={isOpen}
        model={fixedCost}
        modelName="Costo fijo"
        onClose={onClose}
        key={fixedCost._id}
      />
    </GridItem>
  )
}

export default FixedCost
