import { useState } from "react";

import {
  Grid,
  GridItem,
  Card,
  CardBody,
  Text,
  Flex,
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
} from "@chakra-ui/react";

import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { useMessage } from "../../hooks/useMessage";
// import { useDeleteSale } from "../../hooks/useDeleteSale"
// import { useDeleteManySaleItem } from "../../hooks/useDeleteManySaleItem"

// import { format } from "date-fns"
// import { es } from "date-fns/locale"

// types
import {
  CONCEPT_TYPE_AFIP,
  INVOICE_TYPE_AFIP,
  ISaleFullRelated,
  ISaleItemFullRelated,
  POINT_OF_SALE_AFIP,
  // ISaleItemPreview,
  SalePaymentChannel,
  SaleStatus,
} from "./types";

import { SALE_CANCELLED } from "../../utils/constants";
import { AlertColorScheme, AlertStatus } from "../../utils/enums";

import { useAdjustManyInventory } from "../../hooks/useAdjustManyInventory";
import { useNewManyInventoryTransaction } from "../../hooks/useNewManyInventoryTransaction";
import { useNewInvoice } from "../../hooks/useGenerateInvoice";
import { IInventoryFullRelated } from "../inventories/types";
import {
  IInventoryTransactionLessRelated,
  TransactionReason,
  TransactionType,
} from "../inventoryTransactions/types";
import { IProductItemFullRelated } from "../products/types";
import { useEditSale } from "../../hooks/useEditSale";

import { useCheckRole } from "../../hooks/useCheckRole";
import ProfileBase from "../common/permissions";

import { RangeDate } from "../common/RangeDateFilter";
import { IInvoice } from "../afip/types";
import { AxiosError } from "axios";
import ActionMenuButton from "../common/ActionMenuButton";

const getPaymentChannelConfig = (paymentChannel?: SalePaymentChannel) => {
  switch (paymentChannel) {
    case SalePaymentChannel.CASH:
      return { label: "Efectivo", colorScheme: "green" };
    case SalePaymentChannel.BANK_TRANSFER:
      return { label: "Transferencia", colorScheme: "blue" };
    case SalePaymentChannel.QR:
      return { label: "QR", colorScheme: "purple" };
    case SalePaymentChannel.CARD:
      return { label: "Tarjeta", colorScheme: "orange" };
    default:
      return { label: "Sin canal", colorScheme: "gray" };
  }
};

interface Props {
  sale: ISaleFullRelated;
  inventories: IInventoryFullRelated[];
  productItems: IProductItemFullRelated[];
  rangeDate: RangeDate;
  inventoriesByAsset?: Map<string, IInventoryFullRelated>;
  inventoriesByAssetVariant?: Map<string, IInventoryFullRelated>;
}

const Sale = ({
  sale,
  inventories,
  productItems,
  rangeDate,
  inventoriesByAsset,
  inventoriesByAssetVariant,
}: Props) => {
  const navigate = useNavigate();
  const popover = useDisclosure();
  const cancelModal = useDisclosure();

  const { checkRole } = useCheckRole();

  const paymentChannelConfig = getPaymentChannelConfig(sale.paymentChannel);

  const saleCreatedDatetime = new Date(
    String(sale?.sortingDate),
  ).toLocaleString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { editSale } = useEditSale();
  // const { deleteSale } = useDeleteSale()
  // const { deleteManySaleItem } = useDeleteManySaleItem()
  const { showMessage } = useMessage();

  const { generateInvoice } = useNewInvoice();

  // const handleEdit = () => {
  //   navigate(`${sale._id}/edit`)
  // }

  const handleDetails = () => {
    navigate(`/sales/${sale._id}/details`);
  };

  const handleGenerateInvoice = async () => {
    setIsLoadingInvoice(true);

    if (sale.status === "CANCELLED") {
      showMessage(
        "No se puede facturar porque la venta ya está anulada",
        AlertStatus.Error,
        AlertColorScheme.Red,
      );
      setIsLoadingInvoice(false);
      popover.onClose();
      return;
    }

    let invoice: IInvoice = {
      sale: sale._id,
      documentType: sale?.client?.documentType,
      documentNumber: sale.client?.documentNumber,
      concept: CONCEPT_TYPE_AFIP.PRODUCTOS,
      invoiceType: INVOICE_TYPE_AFIP.FACTURA_C,
      totalAmount: sale.total,
      pointOfSale: POINT_OF_SALE_AFIP.ONE,
      condicionIVAReceptorId: sale.client?.condicionIVAReceptorId,
    };

    try {
      let response = await generateInvoice(invoice);
      if (response.status === 201) {
        const saleUpdatedResponse = await editSale({
          saleId: sale._id !== undefined ? sale?._id : "",
          saleToUpdate: {
            isBilled: true,
          },
        });

        if (
          saleUpdatedResponse.isUpdated &&
          saleUpdatedResponse.status === 200
        ) {
          showMessage(
            `${response.message} - CAE: ${response.invoice_details.cae}`,
            AlertStatus.Success,
            AlertColorScheme.Green,
          );
          popover.onClose();
        }
      }
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response) {
        let er = err.response.data as { status: number; message: string };
        if (er.status === 400) {
          showMessage(er.message, AlertStatus.Error, AlertColorScheme.Red);
          console.log(err);
        }
        popover.onClose();
      }
    } finally {
      setIsLoadingInvoice(false);
    }
  };

  const queryClient = useQueryClient();

  const { adjustManyInventory } = useAdjustManyInventory();
  const { addNewManyInventoryTransaction } = useNewManyInventoryTransaction();

  const saleItems = queryClient.getQueryData([
    "saleItems",
    { filters: rangeDate },
  ]) as ISaleItemFullRelated[];

  const saleItemsFiltered = saleItems?.filter(
    (saleItem) => saleItem.sale?._id === sale._id,
  ) as ISaleItemFullRelated[];

  const handleDelete = async () => {
    if (sale.status === "CANCELLED") {
      showMessage(
        "Ya esta anulada la venta",
        AlertStatus.Error,
        AlertColorScheme.Red,
      );
      cancelModal.onClose();
      return;
    }

    if (sale.isBilled === true) {
      showMessage(
        "No se puede anular, ya fue facturada la venta",
        AlertStatus.Error,
        AlertColorScheme.Red,
      );
      cancelModal.onClose();
      return;
    }

    setIsLoading(true);
    try {
      const assetQuantityByAssetId = new Map<string, number>();
      const assetQuantityByAssetVariantId = new Map<
        string,
        { quantity: number; assetId?: string }
      >();

      productItems.forEach((productItem) => {
        saleItemsFiltered?.forEach((saleItem) => {
          if (saleItem.product?._id !== productItem.product?._id) return;

          if (productItem.selectionType === "VARIANT_SELECTION") {
            const relevantSelections = (
              saleItem.variantSelections ?? []
            ).filter((variantSelection) => {
              const currentProductItemId =
                typeof variantSelection.productItem === "string"
                  ? variantSelection.productItem
                  : variantSelection.productItem?._id;

              return currentProductItemId === productItem._id;
            });

            relevantSelections.forEach((variantSelection) => {
              const assetVariantId =
                typeof variantSelection.assetVariant === "string"
                  ? variantSelection.assetVariant
                  : variantSelection.assetVariant?._id;
              const assetId =
                typeof productItem.baseAsset === "string"
                  ? productItem.baseAsset
                  : productItem.baseAsset?._id;

              if (!assetVariantId) return;

              const previousValue =
                assetQuantityByAssetVariantId.get(assetVariantId);

              assetQuantityByAssetVariantId.set(assetVariantId, {
                quantity:
                  Number(previousValue?.quantity ?? 0) +
                  Number(variantSelection.quantity ?? 0),
                assetId: previousValue?.assetId ?? assetId,
              });
            });

            return;
          }

          const assetId = productItem.asset?._id;
          if (!assetId) return;

          assetQuantityByAssetId.set(
            assetId,
            Number(assetQuantityByAssetId.get(assetId) ?? 0) +
              Number(productItem.quantity ?? 0) *
                Number(saleItem.quantity ?? 0),
          );
        });
      });

      const inventoryAdjustments: Array<{
        id?: string;
        asset?: string;
        assetVariant?: string;
        quantityDelta: number;
      }> = [];
      const oldInventories: IInventoryFullRelated[] = inventories;

      assetQuantityByAssetId.forEach((value, key) => {
        const inv = inventoriesByAsset?.get(String(key));
        if (!inv) return;

        inventoryAdjustments.push({
          id: inv._id,
          asset: inv.asset?._id,
          quantityDelta: Number(value),
        });
      });

      assetQuantityByAssetVariantId.forEach((value, key) => {
        const inv = inventoriesByAssetVariant?.get(String(key));
        if (!inv) return;

        inventoryAdjustments.push({
          id: inv._id,
          asset: value.assetId ?? inv.asset?._id,
          assetVariant: inv.assetVariant?._id,
          quantityDelta: Number(value.quantity),
        });
      });

      const adjustInventoryResponse =
        inventoryAdjustments.length > 0
          ? await adjustManyInventory(inventoryAdjustments)
          : undefined;

      const updatedInventories = adjustInventoryResponse?.data?.updated ?? [];
      const updatedInventoryById = new Map<string, any>();

      updatedInventories.forEach((inventoryUpdated: any) => {
        if (inventoryUpdated.id) {
          updatedInventoryById.set(
            String(inventoryUpdated.id),
            inventoryUpdated,
          );
        }
      });

      const inventoryTransactions: IInventoryTransactionLessRelated[] = [];

      assetQuantityByAssetId.forEach((value, key) => {
        inventoryTransactions.push({
          asset: key,
          affectedAmount: value,
          transactionType: TransactionType.UP,
          transactionReason: TransactionReason.ADJUSTMENT,
        });
      });

      assetQuantityByAssetVariantId.forEach((value, key) => {
        inventoryTransactions.push({
          asset: value.assetId,
          assetVariant: key,
          affectedAmount: value.quantity,
          transactionType: TransactionType.UP,
          transactionReason: TransactionReason.ADJUSTMENT,
        });
      });

      inventoryTransactions.forEach((inventoryTransaction) => {
        inventoryAdjustments.forEach((adj) => {
          if (
            inventoryTransaction.asset === adj.asset &&
            inventoryTransaction.assetVariant === adj.assetVariant
          ) {
            const oldInv = inventoriesByAsset?.get(String(adj.asset));
            const oldVariantInv = adj.assetVariant
              ? inventoriesByAssetVariant?.get(String(adj.assetVariant))
              : undefined;
            const updatedInv = adj.id
              ? updatedInventoryById.get(String(adj.id))
              : undefined;

            inventoryTransaction.oldQuantityAvailable =
              updatedInv?.oldQuantityAvailable ??
              oldVariantInv?.quantityAvailable ??
              oldInv?.quantityAvailable;
            inventoryTransaction.currentQuantityAvailable =
              updatedInv?.currentQuantityAvailable ??
              updatedInv?.quantityAvailable ??
              (oldVariantInv?.quantityAvailable ??
                oldInv?.quantityAvailable ??
                0) + adj.quantityDelta;
            inventoryTransaction.unitCost =
              oldVariantInv?.assetVariant?.costPrice ??
              oldInv?.asset?.costPrice;
          }
        });
      });

      if (inventoryTransactions.length > 0) {
        await addNewManyInventoryTransaction(inventoryTransactions);
      }

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
      });

      if (response.isUpdated && response.status === 200) {
        showMessage(
          SALE_CANCELLED,
          AlertStatus.Success,
          AlertColorScheme.Purple,
        );
        cancelModal.onClose();
        return;
      }

      showMessage(
        "No se pudo anular la venta.",
        AlertStatus.Error,
        AlertColorScheme.Red,
      );
    } catch (error) {
      console.error(error);
      showMessage(
        "No se pudo anular la venta. Revisá el stock o intentá nuevamente.",
        AlertStatus.Error,
        AlertColorScheme.Red,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {sale && (
        <GridItem colSpan={5} mb={3}>
          <Card variant="outline">
            <CardBody>
              <Grid
                templateColumns="repeat(8, 1fr)"
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
                      colorScheme={sale.isBilled === false ? "red" : "green"}
                      alignSelf={"flex-start"}
                    >
                      {sale.isBilled === false ? "No facturado" : "Facturado"}
                    </Badge>
                    <Badge
                      display={{ md: "none" }}
                      variant={"subtle"}
                      colorScheme={paymentChannelConfig.colorScheme}
                      alignSelf={"flex-start"}
                    >
                      {paymentChannelConfig.label}
                    </Badge>
                    <Text
                      display={{ md: "none" }}
                      color={"gray.500"}
                      fontSize="xs"
                      align="start"
                    >
                      {saleCreatedDatetime}
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
                      colorScheme={sale.isBilled === false ? "red" : "green"}
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
                      {saleCreatedDatetime}
                    </Text>
                  </Flex>
                </GridItem>
                <GridItem display={{ base: "none", md: "block" }}>
                  <Flex direction="column" gap={2} placeItems={"center"}>
                    <Badge
                      variant={"subtle"}
                      colorScheme={paymentChannelConfig.colorScheme}
                    >
                      {paymentChannelConfig.label}
                    </Badge>
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

                <GridItem colStart={{ base: 8 }}>
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
                      <Popover
                        placement="bottom-start"
                        isOpen={popover.isOpen}
                        onClose={popover.onClose}
                      >
                        <PopoverTrigger>
                          <ActionMenuButton
                            onClick={(e) => {
                              e.stopPropagation();
                              popover.onToggle();
                            }}
                            ariaLabel="Acciones de la venta"
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
                                    onClick={() => {
                                      popover.onClose();
                                      cancelModal.onOpen();
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
            isOpen={cancelModal.isOpen}
            onClose={cancelModal.onClose}
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
                  onClick={cancelModal.onClose}
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
  );
};

export default Sale;
