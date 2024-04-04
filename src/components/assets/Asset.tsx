// libs
import { useNavigate } from "react-router-dom"
import { useState } from "react"

// custom hooks
import { useDeleteAsset } from "../../hooks/useDeleteAsset"
import { useMessage } from "../../hooks/useMessage"

// types
import { IAsset } from "./types"

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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Badge,
} from "@chakra-ui/react"

import { ChevronDownIcon, AddIcon } from "@chakra-ui/icons"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"

interface Props {
  asset: IAsset
}

const Asset = ({ asset }: Props): JSX.Element => {
  const navigate = useNavigate()

  const { deleteAsset } = useDeleteAsset()
  const { showMessage } = useMessage()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleEdit = () => {
    navigate(`${asset._id}/edit`)
  }

  const handleDetails = () => {
    navigate(`/assets/${asset._id}/details`)
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
    }

    if (!response?.isDeleted) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
    }
    navigate("/assets")
  }

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <GridItem colSpan={5} mb={3}>
      <Card variant="outline">
        <CardBody>
          <Grid templateColumns="repeat(6, 1fr)" gap={2} alignItems="center">
            <GridItem colSpan={5}>
              <Flex direction="column" gap={2}>
                <Text noOfLines={1} fontSize="xl" align="start" mr={4}>
                  {asset.name}
                </Text>
                <Badge
                  variant="subtle"
                  colorScheme="purple"
                  alignSelf={"start"}
                >
                  {asset?.category?.name}
                </Badge>
                {/* <Text fontSize="xs" align="start">
                  Stock:{" "}
                  <Text fontWeight={"bold"} as={"span"}>
                    Stock
                  </Text>
                </Text> */}
              </Flex>
            </GridItem>

            <GridItem colSpan={1} colStart={6}>
              <Flex direction="column" gap={2}>
                {/* {product.retailsalePrice !== undefined && ( */}
                {/* <Text as="b" alignSelf="end">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    minimumFractionDigits: 2,
                    currency: "USD",
                  }).format(
                    Number.parseFloat(
                      product?.retailsalePrice.toFixed(2).toString()
                    )
                  )}
                </Text> */}
                {/* )} */}
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
                          <Button
                            onClick={onOpen}
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
                        </VStack>
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover>
              </Flex>
            </GridItem>
          </Grid>
        </CardBody>
      </Card>
      <Modal
        closeOnOverlayClick={false}
        isCentered
        size={{ base: "xs", md: "lg" }}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Borrar insumo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              ¿Estás seguro de eliminar el insumo{" "}
              <Text as={"b"}>{asset.name}</Text>?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={isLoading}
              colorScheme="red"
              mr={3}
              onClick={() => handleDelete()}
            >
              Borrar
            </Button>
            <Button onClick={onClose} variant="ghost">
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </GridItem>
  )
}

export default Asset
