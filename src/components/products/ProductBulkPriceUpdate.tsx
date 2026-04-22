import { ChangeEvent, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Badge,
  Button,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react"
import { AxiosError } from "axios"
import { useProducts } from "../../hooks/useProducts"
import { useEditManyProductPrices } from "../../hooks/useEditManyProductPrices"
import { useMessage } from "../../hooks/useMessage"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"
import { SOMETHING_WENT_WRONG_MESSAGE } from "../../utils/constants"
import { IProductBulkPriceUpdate, IProductFullRelated } from "./types"

type EditablePrice = {
  retailsalePrice: string
  wholesalePrice: string
}

const formatMoney = (value: Number | number | undefined) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    minimumFractionDigits: 2,
    currency: "USD",
  }).format(Number(value ?? 0))

const getApiErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError<{ message?: string }>
  return axiosError?.response?.data?.message ?? SOMETHING_WENT_WRONG_MESSAGE
}

const isEmptyPrice = (value: string | undefined) => value === undefined || value.trim() === ""

const isInvalidPrice = (value: string | undefined) => {
  if (isEmptyPrice(value)) return true

  const numericValue = Number(value)
  return Number.isNaN(numericValue) || numericValue < 0
}

const ProductBulkPriceUpdate = () => {
  const navigate = useNavigate()
  const { showMessage } = useMessage()
  const { editManyProductPrices } = useEditManyProductPrices()
  const queryProducts = useProducts({})
  const products = (queryProducts.data ?? []) as IProductFullRelated[]
  const [searchValue, setSearchValue] = useState("")
  const [pricesByProductId, setPricesByProductId] = useState<Record<string, EditablePrice>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (products.length === 0) return

    setPricesByProductId((currentPrices) => {
      const nextPrices = { ...currentPrices }
      products.forEach((product) => {
        if (!product._id || nextPrices[product._id]) return
        nextPrices[product._id] = {
          retailsalePrice: String(Number(product.retailsalePrice ?? 0)),
          wholesalePrice: String(Number(product.wholesalePrice ?? 0)),
        }
      })
      return nextPrices
    })
  }, [products])

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchValue.toLowerCase())
  )

  const changedProducts = useMemo<IProductBulkPriceUpdate[]>(() => {
    return products.reduce<IProductBulkPriceUpdate[]>((accumulator, product) => {
      if (!product._id) return accumulator

      const currentPrices = pricesByProductId[product._id]
      if (!currentPrices) return accumulator

      if (
        isInvalidPrice(currentPrices.retailsalePrice) ||
        isInvalidPrice(currentPrices.wholesalePrice)
      ) {
        return accumulator
      }

      const retailsalePrice = Number(currentPrices.retailsalePrice)
      const wholesalePrice = Number(currentPrices.wholesalePrice)
      const oldRetailsalePrice = Number(product.retailsalePrice ?? 0)
      const oldWholesalePrice = Number(product.wholesalePrice ?? 0)

      if (
        retailsalePrice !== oldRetailsalePrice ||
        wholesalePrice !== oldWholesalePrice
      ) {
        accumulator.push({
          id: product._id,
          retailsalePrice,
          wholesalePrice,
        })
      }

      return accumulator
    }, [])
  }, [pricesByProductId, products])

  const hasInvalidPrices = products.some((product) => {
    if (!product._id) return false

    const currentPrices = pricesByProductId[product._id]
    if (!currentPrices) return false

    return (
      isInvalidPrice(currentPrices.retailsalePrice) ||
      isInvalidPrice(currentPrices.wholesalePrice)
    )
  })

  const handlePriceChange = (
    event: ChangeEvent<HTMLInputElement>,
    productId: string,
    field: keyof EditablePrice
  ) => {
    setPricesByProductId((currentPrices) => ({
      ...currentPrices,
      [productId]: {
        ...currentPrices[productId],
        [field]: event.target.value,
      },
    }))
  }

  const handleSave = async () => {
    if (changedProducts.length === 0) {
      showMessage(
        "No hay cambios para guardar.",
        AlertStatus.Info,
        AlertColorScheme.Blue
      )
      return
    }

    if (hasInvalidPrices) {
      showMessage(
        "Revisá los precios: no pueden estar vacíos ni ser negativos.",
        AlertStatus.Error,
        AlertColorScheme.Red
      )
      return
    }

    setIsLoading(true)
    try {
      await editManyProductPrices(changedProducts)
      showMessage(
        `Se actualizaron ${changedProducts.length} productos.`,
        AlertStatus.Success,
        AlertColorScheme.Purple
      )
      navigate("/products")
    } catch (error) {
      showMessage(
        getApiErrorMessage(error),
        AlertStatus.Error,
        AlertColorScheme.Red
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card variant="outline" mt={5} mb={3}>
        <CardBody>
          <Flex
            alignItems={{ base: "flex-start", md: "center" }}
            direction={{ base: "column", md: "row" }}
            gap={3}
          >
            <Stack spacing={1} flex={1}>
              <Heading size="md">Actualización masiva de precios</Heading>
              <Text color="gray.600">
                Editá manualmente los precios por menor y por mayor. Solo se guardan los productos modificados.
              </Text>
            </Stack>
            <Badge colorScheme={changedProducts.length > 0 ? "purple" : "gray"} px={3} py={1}>
              {changedProducts.length} cambios
            </Badge>
          </Flex>
        </CardBody>
      </Card>

      <Card variant="outline" mb={3}>
        <CardBody>
          <Input
            placeholder="Buscar producto ..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </CardBody>
      </Card>

      {queryProducts.isLoading && (
        <Card variant="outline" mb={3}>
          <CardBody>
            <Stack>
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </Stack>
          </CardBody>
        </Card>
      )}

      {!queryProducts.isLoading && filteredProducts.length === 0 && (
        <Card variant="outline" mb={3}>
          <CardBody>
            <Text>No se encontraron productos activos.</Text>
          </CardBody>
        </Card>
      )}

      {filteredProducts.map((product) => {
        const productId = product._id ?? ""
        const editablePrice = pricesByProductId[productId] ?? {
          retailsalePrice: String(Number(product.retailsalePrice ?? 0)),
          wholesalePrice: String(Number(product.wholesalePrice ?? 0)),
        }
        const hasInvalidRetailsalePrice = isInvalidPrice(editablePrice.retailsalePrice)
        const hasInvalidWholesalePrice = isInvalidPrice(editablePrice.wholesalePrice)

        return (
          <Card variant="outline" mb={3} key={productId}>
            <CardBody>
              <Grid templateColumns="repeat(12, 1fr)" gap={3} alignItems="center">
                <GridItem colSpan={{ base: 12, lg: 4 }}>
                  <Text as="b">{product.name}</Text>
                  <Text color="gray.500" fontSize="sm">
                    {product.productType?.name ?? "Sin tipo"}
                  </Text>
                </GridItem>
                <GridItem colSpan={{ base: 6, lg: 2 }}>
                  <Text fontSize="sm" color="gray.500">Menor actual</Text>
                  <Text as="b">{formatMoney(product.retailsalePrice)}</Text>
                </GridItem>
                <GridItem colSpan={{ base: 6, lg: 2 }}>
                  <Text fontSize="sm" color="gray.500">Nuevo menor</Text>
                  <Input
                    type="number"
                    min={0}
                    isInvalid={hasInvalidRetailsalePrice}
                    value={editablePrice.retailsalePrice}
                    onChange={(event) =>
                      handlePriceChange(event, productId, "retailsalePrice")
                    }
                  />
                </GridItem>
                <GridItem colSpan={{ base: 6, lg: 2 }}>
                  <Text fontSize="sm" color="gray.500">Mayor actual</Text>
                  <Text as="b">{formatMoney(product.wholesalePrice)}</Text>
                </GridItem>
                <GridItem colSpan={{ base: 6, lg: 2 }}>
                  <Text fontSize="sm" color="gray.500">Nuevo mayor</Text>
                  <Input
                    type="number"
                    min={0}
                    isInvalid={hasInvalidWholesalePrice}
                    value={editablePrice.wholesalePrice}
                    onChange={(event) =>
                      handlePriceChange(event, productId, "wholesalePrice")
                    }
                  />
                </GridItem>
              </Grid>
            </CardBody>
          </Card>
        )
      })}

      <Card variant="filled" mb={3} position="sticky" bottom={{ base: "90px", md: 3 }} zIndex={2}>
        <CardBody>
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={3}
            alignItems={{ base: "stretch", md: "center" }}
          >
            <Text flex={1}>
              {hasInvalidPrices
                ? "Hay precios vacíos o inválidos. Revisalos antes de guardar."
                : changedProducts.length === 0
                ? "Todavía no hay cambios para guardar."
                : `Se van a actualizar ${changedProducts.length} productos.`}
            </Text>
            <Button variant="outline" onClick={() => navigate("/products")}>
              Cancelar
            </Button>
            <Button
              colorScheme="purple"
              onClick={handleSave}
              isLoading={isLoading}
              isDisabled={changedProducts.length === 0 || hasInvalidPrices}
            >
              Guardar precios
            </Button>
          </Flex>
        </CardBody>
      </Card>
    </>
  )
}

export default ProductBulkPriceUpdate
