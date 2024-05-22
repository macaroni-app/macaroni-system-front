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
  Badge,
} from "@chakra-ui/react"

import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

import { useMessage } from "../../hooks/useMessage"
import { useDeleteProduct } from "../../hooks/useDeleteProduct"
import { useDeleteManyProductItem } from "../../hooks/useDeleteManyProductItem"

import { ChevronDownIcon, AddIcon } from "@chakra-ui/icons"

// import { format } from "date-fns";
// import { es } from "date-fns/locale";

import CustomModal from "../common/CustomModal"

// types
import {
  IProductFullRelated,
  IProductItemFullRelated,
  IProductItemPreview,
} from "./types"

import { PRODUCT_DELETED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"

import { ROLES } from "../common/roles"
import { useCheckRole } from "../../hooks/useCheckRole"
import { useChangeIsActiveProduct } from "../../hooks/useChangeIsActiveProduct"

interface Props {
  product: IProductFullRelated
}

const Product = ({ product }: Props) => {
  const navigate = useNavigate()

  const { checkRole } = useCheckRole()

  const [isLoading, setIsLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  const { deleteProduct } = useDeleteProduct()
  const { deleteManyProductItem } = useDeleteManyProductItem()
  const { showMessage } = useMessage()
  const { changeIsActiveProduct } = useChangeIsActiveProduct()

  const handleEdit = () => {
    navigate(`${product._id}/edit`)
  }

  const handleChangeIsActive = async (isActive: boolean) => {
    setIsLoading(true)

    if (product === undefined) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
      setDeleteModal(false)
    }

    let response = undefined

    if (product !== undefined && product._id !== undefined) {
      response = await changeIsActiveProduct({
        productId: product._id,
        isActive,
      })
    }

    if (response?.isUpdated) {
      showMessage(
        isActive ? "Producto activado." : "Producto desactivado.",
        AlertStatus.Success,
        AlertColorScheme.Purple
      )
      setIsLoading(false)
      onClose()
      setDeleteModal(false)
    }

    if (!response?.isUpdated) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
      setDeleteModal(false)
    }

    navigate("/products")
  }

  const handleDetails = () => {
    navigate(`/products/${product._id}/details`)
  }

  const { isOpen, onOpen, onClose } = useDisclosure()

  const queryClient = useQueryClient()

  const productItems = queryClient.getQueryData([
    "productItems",
    { filters: {} },
  ]) as IProductItemFullRelated[]

  const handleDelete = async () => {
    setIsLoading(true)

    // delete product
    const response = await deleteProduct({ productId: product._id })

    const productItemsToDelete: IProductItemPreview[] = []
    productItems.forEach((productItem) => {
      if (productItem.product?._id === product._id) {
        productItemsToDelete.push({
          asset: productItem.asset?._id,
          id: productItem._id,
          quantity: productItem.quantity,
        })
      }
    })

    if (response.isDeleted && response.status === 200) {
      // delete productItems
      const response = await deleteManyProductItem(
        productItemsToDelete as IProductItemPreview[]
      )

      if (
        response.isDeleted &&
        response.status === 200 &&
        response.data.deletedCount > 0
      ) {
        showMessage(
          PRODUCT_DELETED,
          AlertStatus.Success,
          AlertColorScheme.Purple
        )

        setDeleteModal(false)
      }
    }
  }

  return (
    <>
      {product && (
        <GridItem colSpan={5} mb={3}>
          <Card variant="outline">
            <CardBody>
              <Grid
                templateColumns="repeat(6, 1fr)"
                gap={2}
                alignItems="center"
              >
                <GridItem colSpan={{ base: 3, md: 1 }}>
                  <Flex direction="column" gap={2}>
                    <Text fontSize="lg" align="start" mr={2}>
                      {product.name}
                    </Text>
                    <Badge
                      display={{ md: "none" }}
                      variant={"subtle"}
                      colorScheme={"gray"}
                      alignSelf={"flex-start"}
                    >
                      {product.productType?.name}
                    </Badge>
                  </Flex>
                </GridItem>
                <GridItem display={{ base: "none", md: "block" }}>
                  <Flex direction="column" gap={2} placeItems={"center"}>
                    <Badge
                      variant="subtle"
                      colorScheme={product?.isActive ? "green" : "red"}
                    >
                      {product?.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </Flex>
                </GridItem>
                <GridItem display={{ base: "none", md: "block" }}>
                  <Flex direction="column" gap={2} placeItems={"center"}>
                    <Badge variant={"subtle"} colorScheme={"gray"}>
                      {product.productType?.name}
                    </Badge>
                  </Flex>
                </GridItem>
                <GridItem display={{ base: "none", md: "block" }}>
                  <Flex direction="column" gap={2} placeItems={"center"}>
                    <Text as="b">
                      {product?.retailsalePrice
                        ? new Intl.NumberFormat("en-US", {
                            style: "currency",
                            minimumFractionDigits: 2,
                            currency: "USD",
                          }).format(
                            Number.parseFloat(
                              product?.retailsalePrice.toString()
                            )
                          )
                        : new Intl.NumberFormat("en-US", {
                            style: "currency",
                            minimumFractionDigits: 2,
                            currency: "USD",
                          }).format(0)}
                    </Text>
                  </Flex>
                </GridItem>
                <GridItem display={{ base: "none", md: "block" }}>
                  <Flex direction="column" gap={2} placeItems={"center"}>
                    <Text as="b">
                      {product?.wholesalePrice
                        ? new Intl.NumberFormat("en-US", {
                            style: "currency",
                            minimumFractionDigits: 2,
                            currency: "USD",
                          }).format(
                            Number.parseFloat(
                              product?.wholesalePrice.toString()
                            )
                          )
                        : new Intl.NumberFormat("en-US", {
                            style: "currency",
                            minimumFractionDigits: 2,
                            currency: "USD",
                          }).format(0)}
                    </Text>
                  </Flex>
                </GridItem>
                <GridItem colStart={{ base: 6 }}>
                  <Flex direction="column" gap={2}>
                    <Text display={{ md: "none" }} as="b">
                      {product?.retailsalePrice
                        ? new Intl.NumberFormat("en-US", {
                            style: "currency",
                            minimumFractionDigits: 2,
                            currency: "USD",
                          }).format(
                            Number.parseFloat(
                              product?.retailsalePrice.toString()
                            )
                          )
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
                              {checkRole([ROLES.ADMIN, ROLES.SUPERVISOR]) && (
                                <>
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
                                    {product.isActive
                                      ? "Desactivar"
                                      : "Activar"}
                                  </Button>
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
                                </>
                              )}
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
          <CustomModal
            deleteModal={deleteModal}
            handleChangeIsActive={handleChangeIsActive}
            handleDelete={handleDelete}
            isLoading={isLoading}
            isOpen={isOpen}
            model={product}
            modelName="Producto"
            onClose={onClose}
            key={product._id}
          />
        </GridItem>
      )}
    </>
  )
}

export default Product
