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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Badge,
  Wrap,
  WrapItem,
  Stack,
  Collapse,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react"

import {
  ChevronDownIcon,
  ChevronUpIcon,
  TriangleUpIcon,
  TriangleDownIcon,
} from "@chakra-ui/icons"

import { useDeleteInventoryTransaction } from "../../hooks/useDeleteInventoryTransaction"
import { useMessage } from "../../hooks/useMessage"
import { useCheckRole } from "../../hooks/useCheckRole"

import { IInventoryTransactionFullRelated } from "./types"

import { AlertColorScheme, AlertStatus } from "../../utils/enums"

import ProfileBase from "../common/permissions"
import {
  getAssetVariantAttributeChips,
  getInventoryDisplayName,
  getInventoryVariantLabel,
} from "../../utils/variants"

interface Props {
  inventoryTransaction: IInventoryTransactionFullRelated
}

const InventoryTransaction = ({ inventoryTransaction }: Props) => {
  const navigate = useNavigate()
  const { checkRole } = useCheckRole()
  const [isLoading, setIsLoading] = useState(false)
  const { deleteInventoryTransaction } = useDeleteInventoryTransaction()
  const { showMessage } = useMessage()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure()
  const {
    isOpen: isMobileDetailsOpen,
    onToggle: onMobileDetailsToggle,
  } = useDisclosure()

  const handleDelete = async () => {
    setIsLoading(true)

    if (inventoryTransaction === undefined) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
      return
    }

    let response = undefined

    if (
      inventoryTransaction !== undefined &&
      inventoryTransaction._id !== undefined
    ) {
      response = await deleteInventoryTransaction(inventoryTransaction._id)
    }

    if (response?.isDeleted) {
      showMessage(
        "Transaction de inventario eliminado.",
        AlertStatus.Success,
        AlertColorScheme.Purple,
      )
      setIsLoading(false)
    }

    if (!response?.isDeleted) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
    }
    navigate("/inventoryTransactions")
  }

  const getColorSchemeBaseOnTransactionType = (transactionType: string) => {
    return transactionType === "DOWN" ? "red" : "green"
  }

  const getLabelBaseOnTransactionType = (transactionReason: string) => {
    return transactionReason === "BUY"
      ? "Compra"
      : transactionReason === "SELL"
        ? "Venta"
        : transactionReason === "RETURN"
          ? "Devolución"
          : transactionReason === "ADJUSTMENT"
            ? "Ajuste"
            : transactionReason === "DONATION"
              ? "Donación"
              : transactionReason === "DEFEATED"
                ? "Vencido"
                : transactionReason === "LOSS"
                  ? "Pérdida"
                  : transactionReason === "INTERNAL_USAGE"
                    ? "Uso interno"
                    : "Otro"
  }

  const numberColumn = checkRole(ProfileBase.inventoryTransactions.viewActions)
    ? 6
    : 5
  const desktopTemplateColumns = checkRole(
    ProfileBase.inventoryTransactions.viewActions,
  )
    ? "minmax(0, 3.6fr) minmax(0, 1fr) minmax(0, 0.85fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0.45fr)"
    : "minmax(0, 3.6fr) minmax(0, 1fr) minmax(0, 0.85fr) minmax(0, 1fr) minmax(0, 1fr)"
  const inventoryDisplayName = getInventoryDisplayName({
    asset: inventoryTransaction.asset,
    assetVariant: inventoryTransaction.assetVariant,
  })
  const variantLabel = getInventoryVariantLabel(
    inventoryTransaction.assetVariant,
  )
  const variantAttributeChips = getAssetVariantAttributeChips(
    inventoryTransaction.assetVariant,
  )
  const baseAssetName =
    typeof inventoryTransaction.asset === "string"
      ? inventoryTransaction.asset
      : inventoryTransaction.asset?.name
  const transactionLabel = getLabelBaseOnTransactionType(
    inventoryTransaction.transactionReason !== undefined
      ? inventoryTransaction.transactionReason
      : "",
  )
  const transactionColorScheme = getColorSchemeBaseOnTransactionType(
    inventoryTransaction.transactionType !== undefined
      ? inventoryTransaction.transactionType
      : "",
  )
  const affectedAmount = Number(inventoryTransaction?.affectedAmount ?? 0)
  const signedAffectedAmount =
    inventoryTransaction.transactionType === "DOWN"
      ? `-${affectedAmount}`
      : `+${affectedAmount}`

  return (
    <GridItem colSpan={5} mb={3}>
      <Card variant="outline">
        <CardBody>
          <Stack display={{ base: "flex", md: "none" }} spacing={3}>
            <Flex align="center" justify="space-between" gap={3}>
              <Stack spacing={1} minW={0} flex="1">
                <Text fontSize="xl" fontWeight="semibold" lineHeight="short" noOfLines={2}>
                  {inventoryDisplayName}
                </Text>
                <Flex align="center" gap={2} wrap="wrap">
                  <Badge variant="subtle" colorScheme={transactionColorScheme}>
                    {transactionLabel}
                  </Badge>
                  <Text fontSize="sm" color="gray.600">
                    Cantidad: <Text as="span" fontWeight="semibold">{signedAffectedAmount}</Text>
                  </Text>
                </Flex>
              </Stack>
              <IconButton
                aria-label={isMobileDetailsOpen ? "Ocultar detalle" : "Mostrar detalle"}
                variant="outline"
                size="sm"
                icon={isMobileDetailsOpen ? <ChevronUpIcon boxSize={5} /> : <ChevronDownIcon boxSize={5} />}
                onClick={onMobileDetailsToggle}
                flexShrink={0}
              />
            </Flex>

            <Collapse in={isMobileDetailsOpen} animateOpacity>
              <Stack spacing={3} pt={1}>
                <Divider />
                <Wrap spacing={2} shouldWrapChildren>
                  {baseAssetName && (
                    <WrapItem>
                      <Badge variant="subtle" colorScheme="gray" px={2} py={1} borderRadius="md">
                        Base: {baseAssetName}
                      </Badge>
                    </WrapItem>
                  )}
                  {variantAttributeChips.map((chip) => (
                    <WrapItem key={`${chip.attributeName}-${chip.valueName}`}>
                      <Badge variant="subtle" colorScheme="purple" px={2} py={1} borderRadius="md">
                        {chip.attributeName}: {chip.valueName}
                      </Badge>
                    </WrapItem>
                  ))}
                  {variantAttributeChips.length === 0 && variantLabel && (
                    <WrapItem>
                      <Badge variant="subtle" colorScheme="purple" px={2} py={1} borderRadius="md">
                        Variante: {variantLabel}
                      </Badge>
                    </WrapItem>
                  )}
                </Wrap>

                <SimpleGrid columns={2} spacing={3}>
                  <Stack spacing={1}>
                    <Text fontSize="xs" textTransform="uppercase" color="gray.500">
                      Stock antes
                    </Text>
                    <Text fontSize="md" fontWeight="medium">
                      {inventoryTransaction?.oldQuantityAvailable}
                    </Text>
                  </Stack>
                  <Stack spacing={1}>
                    <Text fontSize="xs" textTransform="uppercase" color="gray.500">
                      Stock actual
                    </Text>
                    <Text fontSize="md" fontWeight="medium">
                      {inventoryTransaction?.currentQuantityAvailable}
                    </Text>
                  </Stack>
                </SimpleGrid>

                {checkRole(ProfileBase.inventoryTransactions.delete) && (
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    alignSelf="flex-start"
                    onClick={onDeleteOpen}
                  >
                    Eliminar transacción
                  </Button>
                )}
              </Stack>
            </Collapse>
          </Stack>

          <Grid
            display={{ base: "none", md: "grid" }}
            templateColumns={{
              base: `repeat(${numberColumn}, 1fr)`,
              md: desktopTemplateColumns,
            }}
            gap={2}
            alignItems="center"
          >
            <GridItem colSpan={{ base: 5, md: 1 }}>
              <VStack align="stretch" spacing={3}>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  lineHeight="short"
                  align="start"
                  mr={2}
                >
                  {inventoryDisplayName}
                </Text>
                <Wrap spacing={2} shouldWrapChildren>
                  {baseAssetName && (
                    <WrapItem>
                      <Badge
                        variant="subtle"
                        colorScheme="gray"
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        Base: {baseAssetName}
                      </Badge>
                    </WrapItem>
                  )}
                  {variantAttributeChips.map((chip) => (
                    <WrapItem key={`${chip.attributeName}-${chip.valueName}`}>
                      <Badge
                        variant="subtle"
                        colorScheme="purple"
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {chip.attributeName}: {chip.valueName}
                      </Badge>
                    </WrapItem>
                  ))}
                  {variantAttributeChips.length === 0 && variantLabel && (
                    <WrapItem>
                      <Badge
                        variant="subtle"
                        colorScheme="purple"
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        Variante: {variantLabel}
                      </Badge>
                    </WrapItem>
                  )}
                </Wrap>
              </VStack>
            </GridItem>
            <GridItem display={{ base: "none", md: "block" }} minW={0}>
              <Flex direction="column" gap={2} placeItems={"center"}>
                <Badge variant={"subtle"} colorScheme={transactionColorScheme}>
                  {transactionLabel}
                  {inventoryTransaction.transactionType === "UP" && (
                    <TriangleUpIcon boxSize={3} mb={1} />
                  )}
                  {inventoryTransaction.transactionType === "DOWN" && (
                    <TriangleDownIcon boxSize={3} mb={1} />
                  )}
                </Badge>
              </Flex>
            </GridItem>
            <GridItem display={{ base: "none", md: "block" }} minW={0}>
              <Flex direction="column" gap={2} align="center" justify="center">
                <Text fontSize="xs" textAlign="center">
                  {inventoryTransaction?.affectedAmount}
                </Text>
              </Flex>
            </GridItem>
            <GridItem display={{ base: "none", md: "block" }} minW={0}>
              <Flex direction="column" gap={2} align="center" justify="center">
                <Text fontSize="xs" textAlign="center">
                  {inventoryTransaction?.oldQuantityAvailable}
                </Text>
              </Flex>
            </GridItem>
            <GridItem display={{ base: "none", md: "block" }} minW={0}>
              <Flex direction="column" gap={2} align="center" justify="center">
                <Text fontSize="xs" textAlign="center">
                  {inventoryTransaction?.currentQuantityAvailable}
                </Text>
              </Flex>
            </GridItem>
            {checkRole(ProfileBase.inventoryTransactions.viewActions) && (
              <GridItem colStart={{ base: 6 }} minW={0}>
                <Flex direction="column" gap={2} align="center">
                  <Popover placement="left-start">
                    <PopoverTrigger>
                      <IconButton
                        aria-label="Options"
                        variant="ghost"
                        icon={<ChevronDownIcon boxSize={5} />}
                      />
                    </PopoverTrigger>
                    <Portal>
                      <PopoverContent width="150px">
                        <PopoverArrow />
                        <PopoverBody>
                          <VStack align="stretch" spacing={2}>
                            {checkRole(ProfileBase.inventoryTransactions.delete) && (
                              <Button
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={onDeleteOpen}
                              >
                                Eliminar
                              </Button>
                            )}
                          </VStack>
                        </PopoverBody>
                      </PopoverContent>
                    </Portal>
                  </Popover>
                </Flex>
              </GridItem>
            )}
          </Grid>
        </CardBody>
      </Card>

      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Eliminar transacción</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>¿Estás seguro de que querés eliminar esta transacción?</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDelete}
              isLoading={isLoading}
            >
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </GridItem>
  )
}

export default InventoryTransaction
