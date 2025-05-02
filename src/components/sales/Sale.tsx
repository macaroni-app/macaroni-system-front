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
// import { useDeleteSale } from "../../hooks/useDeleteSale"
// import { useDeleteManySaleItem } from "../../hooks/useDeleteManySaleItem"

import { ChevronDownIcon, AddIcon } from "@chakra-ui/icons"

import { format } from "date-fns"
import { es } from "date-fns/locale"

// types
import {
  CONCEPT_TYPE_AFIP,
  INVOICE_TYPE_AFIP,
  ISaleFullRelated,
  ISaleItemFullRelated,
  POINT_OF_SALE_AFIP,
  // ISaleItemPreview,
  SaleStatus,
} from "./types"

import { SALE_CANCELLED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"

import { useEditManyInventory } from "../../hooks/useEditManyInventory"
import { useNewManyInventoryTransaction } from "../../hooks/useNewManyInventoryTransaction"
import { useNewInvoice } from "../../hooks/useGenerateInvoice"
import {
  IInventoryFullRelated,
  IInventoryLessRelated,
} from "../inventories/types"
import {
  IInventoryTransactionLessRelated,
  TransactionReason,
  TransactionType,
} from "../inventoryTransactions/types"
import { IProductItemFullRelated } from "../products/types"
import { useEditSale } from "../../hooks/useEditSale"

import { useCheckRole } from "../../hooks/useCheckRole"
import ProfileBase from "../common/permissions"

import { RangeDate } from "../common/RangeDateFilter"
import { IInvoice } from "../afip/types"
import { AxiosError } from "axios"


interface Props {
  sale: ISaleFullRelated
  inventories: IInventoryFullRelated[]
  productItems: IProductItemFullRelated[]
  rangeDate: RangeDate
}

const Sale = ({ sale, inventories, productItems, rangeDate }: Props) => {
  const navigate = useNavigate()

  const { checkRole } = useCheckRole()

  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const { editSale } = useEditSale()
  // const { deleteSale } = useDeleteSale()
  // const { deleteManySaleItem } = useDeleteManySaleItem()
  const { showMessage } = useMessage()

  const { generateInvoice } = useNewInvoice()

  // const handleEdit = () => {
  //   navigate(`${sale._id}/edit`)
  // }

  const handleDetails = () => {
    navigate(`/sales/${sale._id}/details`)
  }

  const handleGenerateInvoice = async () => {

    setIsLoadingInvoice(true);

    if (sale.status === "CANCELLED") {
      showMessage(
        "No se puede facturar porque la venta ya está anulada",
        AlertStatus.Error,
        AlertColorScheme.Red
      )
      setIsLoadingInvoice(false);
      onClose()
      return
    }

    let invoice: IInvoice = {
      sale: sale._id,
      documentType: sale?.client?.documentType,
      documentNumber: sale.client?.documentNumber,
      concept: CONCEPT_TYPE_AFIP.PRODUCTOS,
      invoiceType: INVOICE_TYPE_AFIP.FACTURA_C,
      totalAmount: sale.total,
      pointOfSale: POINT_OF_SALE_AFIP.TWELVE,
      condicionIVAReceptorId: sale.client?.condicionIVAReceptorId
    }

    try {

      let response = await generateInvoice(invoice)
      if (response.status === 201) {

        const saleUpdatedResponse = await editSale({
          saleId: sale._id !== undefined ? sale?._id : "",
          saleToUpdate: {
            isBilled: true
          },
        })

        if (saleUpdatedResponse.isUpdated && saleUpdatedResponse.status === 200) {
          showMessage(
            `${response.message} - CAE: ${response.invoice_details.cae}`,
            AlertStatus.Success,
            AlertColorScheme.Green
          )
        }
      }

    } catch (error: unknown) {
      const err = error as AxiosError
      if (err.response) {
        let er = err.response.data as { status: number, message: string }
        if (er.status === 400) {
          showMessage(
            er.message,
            AlertStatus.Error,
            AlertColorScheme.Red
          )
        }
      }
    } finally {
      setIsLoadingInvoice(false);
    }
  }

  const { isOpen, onOpen, onClose } = useDisclosure()

  const queryClient = useQueryClient()

  const { editManyInventory } = useEditManyInventory()
  const { addNewManyInventoryTransaction } = useNewManyInventoryTransaction()

  const saleItems = queryClient.getQueryData([
    "saleItems",
    { filters: rangeDate },
  ]) as ISaleItemFullRelated[]

  const saleItemsFiltered = saleItems?.filter(
    (saleItem) => saleItem.sale?._id === sale._id
  ) as ISaleItemFullRelated[]

  const handleDelete = async () => {
    if (sale.status === "CANCELLED") {
      showMessage(
        "Ya esta anulada la venta",
        AlertStatus.Error,
        AlertColorScheme.Red
      )
      onClose()
      return
    }

    if (sale.isBilled === true) {
      showMessage(
        "No se puede anular, ya fue facturada la venta",
        AlertStatus.Error,
        AlertColorScheme.Red
      )
      onClose()
      return
    }


    setIsLoading(true)

    // Todo: actualizar el inventario de cada insumo.
    let assetQuantityByAssetId = new Map<string, number>()

    productItems.forEach((productItem) => {
      saleItemsFiltered?.forEach((saleItem) => {
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
    let oldInventories: IInventoryFullRelated[] = inventories

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
        transactionType: TransactionType.UP,
        transactionReason: TransactionReason.ADJUSTMENT,
      })
    })

    // guardar los valores viejos y nuevos
    inventoryTransactions.forEach(inventoryTransaction => {
      oldInventories.forEach(oldInventory => {
        if (inventoryTransaction.asset === oldInventory.asset?._id) {
          inventoryTransaction.oldQuantityAvailable = oldInventory.quantityAvailable

          //unit cost
          inventoryTransaction.unitCost = oldInventory.asset?.costPrice
        }
      })
      inventoriesToUpdate.forEach(inventoryUpdated => {
        if (inventoryTransaction.asset === inventoryUpdated.asset) {
          inventoryTransaction.currentQuantityAvailable = inventoryUpdated.quantityAvailable

          let asset = inventories.find(inventory => inventory.asset?._id === inventoryUpdated.asset)?.asset
          //unit cost
          inventoryTransaction.unitCost = asset?.costPrice
        }
      })
    })

    await addNewManyInventoryTransaction(inventoryTransactions)

    // delete sale
    // const response = await deleteSale({ saleId: sale._id })
    const response = await editSale({
      saleId: sale._id !== undefined ? sale?._id : "",
      saleToUpdate: {
        status: SaleStatus.CANCELLED,
        client: sale.client?._id,
        paymentMethod: sale.paymentMethod?._id,
        costTotal: sale.costTotal,
        total: sale.total,
        isRetail: sale.isRetail,
      },
    })

    // const saleItemsToDelete: ISaleItemPreview[] = []
    // saleItems.forEach((saleItem) => {
    //   if (saleItem.sale?._id === sale._id) {
    //     saleItemsToDelete.push({
    //       product: saleItem.product?._id,
    //       id: saleItem._id,
    //       quantity: saleItem.quantity,
    //     })
    //   }
    // })

    if (response.isUpdated && response.status === 200) {
      showMessage(SALE_CANCELLED, AlertStatus.Success, AlertColorScheme.Purple)
      onClose()
      // delete productItems
      // const response = await deleteManySaleItem(
      //   saleItemsToDelete as ISaleItemPreview[]
      // )

      // if (
      //   response.isDeleted &&
      //   response.status === 200 &&
      //   response.data.deletedCount > 0
      // ) {
      //   showMessage(SALE_DELETED, AlertStatus.Success, AlertColorScheme.Purple)
      // }
    }
  }

  return (
    <>
      {sale && (
        <GridItem colSpan={5} mb={3}>
          <Card variant="outline">
            <CardBody>
              <Grid
                templateColumns="repeat(7, 1fr)"
                gap={2}
                alignItems="center"
              >
                <GridItem colSpan={{ base: 4, md: 1 }}>
                  <Flex direction="column" gap={2}>
                    <Text fontSize="xs" align="start" mr={2}>
                      {sale.client?.name}
                    </Text>
                    <Badge
                      display={{ md: "none" }}
                      variant={"subtle"}
                      colorScheme={
                        sale.status === "CANCELLED" ? "red" : "green"
                      }
                      alignSelf={"flex-start"}
                    >
                      {sale.status === "CANCELLED" ? "Anulada" : "Pagado"}
                    </Badge>
                    <Badge
                      display={{ md: "none" }}
                      variant={"subtle"}
                      colorScheme={
                        sale.isBilled === false ? "red" : "green"
                      }
                      alignSelf={"flex-start"}
                    >
                      {sale.isBilled === false ? "No facturado" : "Facturado"}
                    </Badge>
                    <Text
                      display={{ md: "none" }}
                      color={"gray.500"}
                      fontSize="xs"
                      align="start"
                    >
                      {format(
                        new Date(sale?.createdAt ? sale?.createdAt : ""),
                        "eeee dd yyyy",
                        {
                          locale: es,
                        }
                      )}
                    </Text>
                  </Flex>
                </GridItem>

                <GridItem display={{ base: "none", md: "block" }}>
                  <Flex direction="column" gap={2} placeItems={"center"}>
                    <Badge
                      variant={"subtle"}
                      colorScheme={
                        sale.status === "CANCELLED" ? "red" : "green"
                      }
                    >
                      {sale.status === "CANCELLED" ? "Anulada" : "Pagado"}
                    </Badge>
                  </Flex>
                </GridItem>
                <GridItem display={{ base: "none", md: "block" }}>
                  <Flex direction="column" gap={2} placeItems={"center"}>
                    <Badge
                      variant={"subtle"}
                      colorScheme={
                        sale.isBilled === false ? "red" : "green"
                      }
                    >
                      {sale.isBilled === false ? "No facturado" : "Facturado"}
                    </Badge>
                  </Flex>
                </GridItem>
                <GridItem display={{ base: "none", md: "block" }}>
                  <Flex direction="column" gap={2} placeItems={"center"}>
                    <Text fontSize="xs" align="start">
                      {sale?.createdBy?.firstName} {sale?.createdBy?.lastName}
                    </Text>
                  </Flex>
                </GridItem>
                <GridItem display={{ base: "none", md: "block" }}>
                  <Flex direction="column" gap={2} placeItems={"center"}>
                    <Text color={"gray.500"} fontSize="xs" align="start">
                      {format(
                        new Date(sale?.createdAt ? sale?.createdAt : ""),
                        "eeee dd yyyy",
                        {
                          locale: es,
                        }
                      )}
                    </Text>
                  </Flex>
                </GridItem>
                <GridItem display={{ base: "none", md: "block" }}>
                  <Flex direction="column" gap={2} placeItems={"center"}>
                    <Text as="b">
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
                  </Flex>
                </GridItem>

                <GridItem colStart={{ base: 7 }}>
                  <Flex direction="column" gap={2}>
                    <Text display={{ md: "none" }} as="b">
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
                    {checkRole(ProfileBase.sales.viewActions) && (
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
                                {checkRole(ProfileBase.sales.view) && (
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
                                )}
                                {/* <Button
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
                              </Button> */}
                                {checkRole(ProfileBase.sales.invoice) && (
                                  <Button
                                    onClick={() => handleGenerateInvoice()}
                                    variant={"blue"}
                                    isLoading={isLoadingInvoice}
                                    loadingText="Generando..."
                                    colorScheme="blue"
                                    justifyContent={"start"}
                                    size="md"
                                    _hover={{
                                      textDecoration: "none",
                                      color: "purple",
                                      bg: "purple.100",
                                    }}
                                  >
                                    Generar factura
                                  </Button>
                                )}
                                {checkRole(ProfileBase.sales.cancel) && (
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
                                    Anular
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
          <Modal
            closeOnOverlayClick={false}
            size={{ base: "xs", md: "lg" }}
            isOpen={isOpen}
            onClose={onClose}
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Anular venta</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>
                  ¿Estás seguro de anular la venta{" "}
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
                  Anular
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
