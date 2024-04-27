import { useState } from "react"

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

import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

import { useMessage } from "../../hooks/useMessage"
import { useDeleteSale } from "../../hooks/useDeleteSale"
import { useDeleteManySaleItem } from "../../hooks/useDeleteManySaleItem"

import { ChevronDownIcon, AddIcon } from "@chakra-ui/icons"

// import { format } from "date-fns"
// import { es } from "date-fns/locale"

// types
import {
  ISaleFullRelated,
  ISaleItemFullRelated,
  ISaleItemPreview,
} from "./types"

import { SALE_DELETED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"

import { useEditManyInventory } from "../../hooks/useEditManyInventory"
import { useNewManyInventoryTransaction } from "../../hooks/useNewManyInventoryTransaction"
import {
  IInventoryFullRelated,
  IInventoryLessRelated,
} from "../inventories/types"
import {
  IInventoryTransactionLessRelated,
  TransactionType,
} from "../inventoryTransactions/types"
import { IProductItemFullRelated } from "../products/types"

interface Props {
  sale: ISaleFullRelated
  inventories: IInventoryFullRelated[]
  productItems: IProductItemFullRelated[]
}

const Sale = ({ sale, inventories, productItems }: Props) => {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)

  const { deleteSale } = useDeleteSale()
  const { deleteManySaleItem } = useDeleteManySaleItem()
  const { showMessage } = useMessage()

  const handleEdit = () => {
    navigate(`${sale._id}/edit`)
  }

  const handleDetails = () => {
    navigate(`/sales/${sale._id}/details`)
  }

  const { isOpen, onOpen, onClose } = useDisclosure()

  const queryClient = useQueryClient()

  const { editManyInventory } = useEditManyInventory()
  const { addNewManyInventoryTransaction } = useNewManyInventoryTransaction()

  const saleItems = queryClient.getQueryData([
    "saleItems",
    { filters: {} },
  ]) as ISaleItemFullRelated[]

  const handleDelete = async () => {
    setIsLoading(true)

    // Todo: actualizar el inventario de cada insumo.
    let assetQuantityByAssetId = new Map<string, number>()

    productItems.forEach((productItem) => {
      saleItems?.forEach((saleItem) => {
        if (saleItem.product?._id === productItem.product?._id) {
          if (assetQuantityByAssetId.has(productItem?.asset?._id as string)) {
            let prevQuantity = assetQuantityByAssetId.get(
              productItem?.asset?._id as string
            )
            assetQuantityByAssetId.set(
              productItem.asset?._id as string,
              Number(prevQuantity) +
                Number(productItem.quantity) * Number(saleItem.quantity)
            )
          } else {
            assetQuantityByAssetId.set(
              productItem.asset?._id as string,
              (Number(productItem.quantity) *
                Number(saleItem.quantity)) as number
            )
          }
        }
      })
    })
    let inventoriesToUpdate: IInventoryLessRelated[] = []

    assetQuantityByAssetId.forEach((value, key) => {
      inventories.forEach((inventory) => {
        let inventoryUpdated: IInventoryLessRelated = {
          asset: inventory.asset?._id,
          id: inventory._id,
          quantityAvailable: inventory.quantityAvailable,
        }
        if (key === inventory.asset?._id) {
          inventoryUpdated.quantityAvailable =
            inventoryUpdated.quantityAvailable !== undefined
              ? inventoryUpdated.quantityAvailable + value
              : inventoryUpdated.quantityAvailable
          inventoriesToUpdate.push(inventoryUpdated)
        }
      })
    })

    await editManyInventory(inventoriesToUpdate)

    // Todo: registrar las transacciones del inventario de cada insumo.

    let inventoryTransactions: IInventoryTransactionLessRelated[] = []

    assetQuantityByAssetId.forEach((value, key) => {
      inventoryTransactions.push({
        asset: key,
        affectedAmount: value,
        transactionType: TransactionType.RETURN,
      })
    })

    await addNewManyInventoryTransaction(inventoryTransactions)

    // delete sale
    const response = await deleteSale({ saleId: sale._id })

    const saleItemsToDelete: ISaleItemPreview[] = []
    saleItems.forEach((saleItem) => {
      if (saleItem.sale?._id === sale._id) {
        saleItemsToDelete.push({
          product: saleItem.product?._id,
          id: saleItem._id,
          quantity: saleItem.quantity,
        })
      }
    })

    if (response.isDeleted && response.status === 200) {
      // delete productItems
      const response = await deleteManySaleItem(
        saleItemsToDelete as ISaleItemPreview[]
      )

      if (
        response.isDeleted &&
        response.status === 200 &&
        response.data.deletedCount > 0
      ) {
        showMessage(SALE_DELETED, AlertStatus.Success, AlertColorScheme.Purple)
      }
    }
  }

  return (
    <>
      {sale && (
        <GridItem colSpan={5} mb={3}>
          <Card variant="outline">
            <CardBody>
              <Grid
                templateColumns="repeat(6, 1fr)"
                gap={2}
                alignItems="center"
              >
                <GridItem colSpan={5}>
                  <Flex direction="column" gap={2}>
                    <Flex alignItems={"center"}>
                      <Text fontSize="lg" align="start" mr={2}>
                        {sale.client?.name}
                      </Text>
                      <Badge variant={"subtle"} colorScheme={"green"}>
                        {sale.paymentMethod?.name}
                      </Badge>
                    </Flex>
                    {/* <Text fontSize="xs" align="start">
                      Vendedor: {sale?.createdBy?.firstName}{" "}
                      {sale?.createdBy?.lastName}
                    </Text>
                    <Text color={"gray.500"} fontSize="xs" align="start">
                      {format(new Date(sale?.createdAt), "eeee dd yyyy", {
                        locale: es,
                      })}
                    </Text> */}
                  </Flex>
                </GridItem>

                <GridItem colSpan={1} colStart={6}>
                  <Flex direction="column" gap={2}>
                    <Text as="b" alignSelf="end">
                      {sale?.total
                        ? new Intl.NumberFormat("en-US", {
                            style: "currency",
                            minimumFractionDigits: 2,
                            currency: "USD",
                          }).format(Number.parseFloat(sale?.total.toString()))
                        : new Intl.NumberFormat("en-US", {
                            style: "currency",
                            minimumFractionDigits: 2,
                            currency: "USD",
                          }).format(0)}
                    </Text>
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
            size={{ base: "xs", md: "lg" }}
            isOpen={isOpen}
            onClose={onClose}
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Borrar venta</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>
                  ¿Estás seguro de eliminar el producto{" "}
                  <Text fontWeight={"bold"} as={"span"}>
                    {sale.client?.name}?
                  </Text>
                </Text>
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
                <Button
                  isDisabled={isLoading}
                  onClick={onClose}
                  variant="ghost"
                >
                  Cancelar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </GridItem>
      )}
    </>
  )
}

export default Sale