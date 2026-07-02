// libs
import { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// types
import { ISaleLessRelated, ISaleFullRelated, ISaleItemOmitSale } from "./types";

import { saleSchema } from "./saleSchema";

import {
  Grid,
  GridItem,
  Button,
  Card,
  CardBody,
  Heading,
  FormControl,
  Stack,
  Text,
  Flex,
  SimpleGrid,
  IconButton,
  Divider,
  Checkbox,
  FormLabel,
  Input,
  Box,
} from "@chakra-ui/react";

import { ChevronDownIcon, ChevronUpIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";

// components
import Loading from "../common/Loading";
import MyInput from "../ui/inputs/MyInput";
import MySelect from "../ui/inputs/MySelect";
import {
  IProductFullRelated,
  IProductItemFullRelated,
  ProductItemSelectionType,
} from "../products/types";
import { IClient } from "../clients/types";
import { IPaymentMethod } from "../paymentMethods/types";
import { IAssetVariant } from "../assetVariants/types";
import VariantSelectionsEditor from "../common/VariantSelectionsEditor";
import {
  formatVariantSelections,
  getVariantSelectionCurrentQuantity,
  getVariantSelectionExpectedQuantity,
} from "../../utils/variants";

interface Props {
  onSubmit: SubmitHandler<ISaleLessRelated>;
  onCancelOperation: () => void;
  saleToUpdate?: ISaleFullRelated;
  products?: IProductFullRelated[];
  productItems?: IProductItemFullRelated[];
  assetVariants?: IAssetVariant[];
  clients?: IClient[];
  paymentMethods?: IPaymentMethod[];
  isLoading: boolean;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  minimumFractionDigits: 2,
  currency: "ARS",
});

const SaleFormAdd = ({
  onSubmit,
  onCancelOperation,
  saleToUpdate,
  isLoading,
  products,
  productItems,
  assetVariants,
  clients,
  paymentMethods,
}: Props) => {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const { register, formState, handleSubmit, control, watch, setValue } =
    useForm<ISaleLessRelated>({
      resolver: zodResolver(saleSchema),
      defaultValues: {
        isRetail: saleToUpdate?.isRetail ?? true,
        total: undefined,
        discount: 0,
        client:
          saleToUpdate?.client?._id ||
          clients?.filter((client) => client.name === "Consumidor Final").at(0)
            ?._id,
        paymentMethod:
          saleToUpdate?.paymentMethod?._id ||
          paymentMethods?.filter((pm) => pm.name === "Contado").at(0)?._id,
        saleItems: [{ product: "", quantity: 1, variantSelections: [] }],
      },
    });

  useEffect(() => {
    const defaultClientId = clients?.find(
      (client) => client.name === "Consumidor Final",
    )?._id;

    if (!saleToUpdate?._id && defaultClientId && !watch("client")) {
      setValue("client", defaultClientId, {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [clients, saleToUpdate?._id, setValue, watch]);

  useEffect(() => {
    const defaultPaymentMethodId = paymentMethods?.find(
      (paymentMethod) => paymentMethod.name === "Contado",
    )?._id;

    if (
      !saleToUpdate?._id &&
      defaultPaymentMethodId &&
      !watch("paymentMethod")
    ) {
      setValue("paymentMethod", defaultPaymentMethodId, {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [paymentMethods, saleToUpdate?._id, setValue, watch]);

  const sale = watch();

  const { fields, remove, append } = useFieldArray({
    name: "saleItems",
    control,
  });

  const productItemRequirementsByProductId = useMemo(() => {
    const requirements = new Map<string, IProductItemFullRelated[]>();

    (productItems ?? []).forEach((productItem) => {
      const currentProductId =
        typeof productItem.product === "string"
          ? productItem.product
          : productItem.product?._id;

      if (!currentProductId) {
        return;
      }

      const currentItems = requirements.get(currentProductId) ?? [];
      currentItems.push(productItem);
      requirements.set(currentProductId, currentItems);
    });

    return requirements;
  }, [productItems]);

  useEffect(() => {
    if (expandedIndex > Math.max(fields.length - 1, 0)) {
      setExpandedIndex(Math.max(fields.length - 1, 0));
    }
  }, [expandedIndex, fields.length]);

  const focusElement = (elementId: string) => {
    requestAnimationFrame(() => {
      const nextElement = document.getElementById(elementId) as
        | HTMLInputElement
        | null;
      nextElement?.focus();
    });
  };

  const getProductInputId = (index: number) => `sale-item-product-${index}`;
  const getQuantityInputId = (index: number) => `sale-item-quantity-${index}`;
  const getVariantInputPrefix = (index: number) => `sale-item-${index}`;

  const getVariantRequirements = (productId?: string) => {
    if (!productId) {
      return [];
    }

    return (productItemRequirementsByProductId.get(productId) ?? []).filter(
      (productItem) =>
        (productItem.selectionType ?? ProductItemSelectionType.FIXED) ===
        ProductItemSelectionType.VARIANT_SELECTION,
    );
  };

  const hasVariantRequirements = (index: number) =>
    getVariantRequirements(sale.saleItems?.at(index)?.product).length > 0;

  const isVariantSelectionComplete = (index: number) => {
    const currentSaleItem = sale.saleItems?.at(index);
    const currentProductId = currentSaleItem?.product;
    const currentVariantSelections = currentSaleItem?.variantSelections;
    const currentLineQuantity = Number(currentSaleItem?.quantity ?? 0);
    const variantRequirements = getVariantRequirements(currentProductId);

    if (variantRequirements.length === 0) {
      return true;
    }

    return variantRequirements.every((productItem) => {
      const productItemId = productItem._id;
      const expectedQuantity = getVariantSelectionExpectedQuantity(
        productItem,
        currentLineQuantity,
      );
      const currentQuantity = getVariantSelectionCurrentQuantity(
        currentVariantSelections,
        productItemId,
      );

      return currentQuantity === expectedQuantity && expectedQuantity > 0;
    });
  };

  const focusFirstVariantField = (index: number) => {
    const currentVariantSelections = sale.saleItems?.at(index)?.variantSelections ?? [];
    const firstExistingIndex = currentVariantSelections.findIndex(
      (variantSelection) => !!variantSelection?.productItem,
    );

    if (firstExistingIndex >= 0) {
      focusElement(
        `${getVariantInputPrefix(index)}-variant-${firstExistingIndex}`,
      );
      return;
    }

    setTimeout(() => {
      focusElement(`${getVariantInputPrefix(index)}-variant-0`);
    }, 0);
  };

  const moveToNextItem = (index: number) => {
    const nextIndex = index + 1;

    if (nextIndex < fields.length) {
      setExpandedIndex(nextIndex);
      focusElement(getProductInputId(nextIndex));
      return;
    }

    append({ product: "", quantity: 1, variantSelections: [] });
    setExpandedIndex(fields.length);
    setTimeout(() => {
      focusElement(getProductInputId(fields.length));
    }, 0);
  };

  const closeCurrentItem = (index: number) => {
    if (hasVariantRequirements(index) && !isVariantSelectionComplete(index)) {
      focusFirstVariantField(index);
      return;
    }

    moveToNextItem(index);
  };

  const getTotalSale = () => {
    let productIds = sale?.saleItems?.map((saleItem) => saleItem.product);

    let productWithSalePrice: IProductFullRelated[] = [];

    productIds?.forEach((productId) =>
      products?.forEach((product) => {
        if (product._id === productId) {
          productWithSalePrice.push(product);
        }
      }),
    );

    let productWithQuantity: ISaleItemOmitSale[] = [];

    productWithSalePrice.forEach((product) => {
      sale.saleItems?.forEach((saleItem) => {
        if (product._id === saleItem.product) {
          productWithQuantity.push({
            product,
            quantity: saleItem.quantity,
          });
        }
      });
    });

    let totalSale = productWithQuantity
      ?.map((productWithQ) => {
        if (
          productWithQ.product?.retailsalePrice !== undefined &&
          productWithQ.quantity !== undefined
        ) {
          if (sale.isRetail) {
            return (
              Number(productWithQ.product.retailsalePrice) *
              Number(productWithQ.quantity)
            );
          }
          return (
            Number(productWithQ.product.wholesalePrice) *
            Number(productWithQ.quantity)
          );
        }
      })
      .reduce((acc, currentValue) => {
        if (acc !== undefined && currentValue !== undefined) {
          return acc + currentValue;
        }
      }, 0);

    let discount =
      sale?.discount !== undefined && !isNaN(sale?.discount)
        ? sale?.discount / 100
        : 0;

    let totalSaleWithDiscount =
      totalSale !== undefined ? totalSale - totalSale * discount : 0;

    return totalSaleWithDiscount;
  };

  const getSubtotal = (index: number) => {
    let subtotal: number = 0;

    products?.filter((product) => {
      if (product._id === sale.saleItems?.at(index)?.product) {
        let quantity = Number(sale?.saleItems?.at(index)?.quantity);

        if (sale !== undefined && sale?.isRetail) {
          subtotal = Number(product?.retailsalePrice) * quantity;
        } else {
          subtotal = Number(product?.wholesalePrice) * quantity;
        }
      }
    });

    let discount =
      sale?.discount !== undefined && !isNaN(sale?.discount)
        ? sale?.discount / 100
        : 0;

    let subTotalWithDiscount =
      subtotal !== undefined ? subtotal - subtotal * discount : 0;

    return subTotalWithDiscount;
  };

  const getProductName = (productId?: string) => {
    if (!productId) {
      return "Seleccioná un producto";
    }

    return (
      products?.find((product) => product._id === productId)?.name ??
      "Seleccioná un producto"
    );
  };

  const getTotalUnits = () =>
    (sale?.saleItems ?? []).reduce(
      (accumulator, saleItem) => accumulator + Number(saleItem.quantity ?? 0),
      0,
    );

  const handleRemoveItem = (index: number) => {
    const nextIndex = index > 0 ? index - 1 : 0;

    remove(index);
    setExpandedIndex((currentExpandedIndex) => {
      if (currentExpandedIndex === index) {
        return Math.max(0, index - 1);
      }

      if (currentExpandedIndex > index) {
        return currentExpandedIndex - 1;
      }

      return currentExpandedIndex;
    });

    setTimeout(() => {
      focusElement(getQuantityInputId(nextIndex));
    }, 0);
  };

  const handleAppendItem = () => {
    append({ product: "", quantity: 1, variantSelections: [] });
    setExpandedIndex(fields.length);
    setTimeout(() => {
      focusElement(getProductInputId(fields.length));
    }, 0);
  };


  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <Grid templateColumns={{ base: "repeat(12, 1fr)" }} mt={5} mb={10}>
          <GridItem colSpan={{ base: 10, md: 8 }} colStart={{ base: 2, md: 3 }}>
            <Card mb={10} variant="outline">
              <CardBody>
                <Heading mb={3} textAlign="center" size="lg">
                  Nueva venta:
                </Heading>
                <form
                  noValidate
                  onSubmit={handleSubmit(onSubmit)}
                  onKeyDownCapture={(event) => {
                    if ((event.key === "Delete" || event.key === "Backspace") && event.altKey) {
                      if (expandedIndex >= 0 && fields.length > 1) {
                        event.preventDefault();
                        event.stopPropagation();
                        handleRemoveItem(expandedIndex);
                      }
                      return;
                    }

                    if (event.key === "Enter" && event.ctrlKey) {
                      event.preventDefault();
                      event.stopPropagation();
                      void handleSubmit(onSubmit)();
                      return;
                    }

                    if (event.key === "F4") {
                      event.preventDefault();
                      event.stopPropagation();
                      handleAppendItem();
                      return;
                    }

                    if (event.key === "F8") {
                      event.preventDefault();
                      event.stopPropagation();
                      onCancelOperation();
                      return;
                    }

                    if (event.key === "Escape" && expandedIndex >= 0) {
                      event.preventDefault();
                      event.stopPropagation();
                      setExpandedIndex(-1);
                      return;
                    }

                    if (event.key === "Enter") {
                      event.preventDefault();
                    }
                  }}
                >
                  <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={4}>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MySelect
                        formState={formState}
                        register={register}
                        field={"client"}
                        placeholder={"Buscar cliente ..."}
                        label={"Cliente"}
                        control={control}
                        data={clients}
                        isRequired={true}
                        noOptionsMessage="No hay datos"
                      />
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 3 }}>
                      <FormControl>
                        <FormLabel>Total:</FormLabel>
                        <Input
                          value={currencyFormatter.format(getTotalSale() || 0)}
                          disabled={true}
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 3 }}>
                      <MyInput
                        formState={formState}
                        register={register}
                        field={"discount"}
                        type={"number"}
                        placeholder={"Descuento"}
                        label={"Descuento"}
                      />
                    </GridItem>
                  </Grid>
                  <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={4}>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MySelect
                        formState={formState}
                        register={register}
                        field={"paymentMethod"}
                        placeholder={"Buscar método de pago ..."}
                        label={"Método de pago"}
                        control={control}
                        data={paymentMethods}
                        isRequired={true}
                        noOptionsMessage="No hay datos"
                      />
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <FormControl>
                        <FormLabel>Por menor?</FormLabel>
                        <Checkbox
                          type="checkbox"
                          colorScheme="purple"
                          placeholder="Por menor"
                          {...register("isRetail")}
                        >
                          Si
                        </Checkbox>
                      </FormControl>
                    </GridItem>
                  </Grid>

                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3} mb={6}>
                    <Card variant="outline" bg="gray.50">
                      <CardBody py={3}>
                        <Text fontSize="sm" color="gray.600">
                          Items cargados
                        </Text>
                        <Heading size="md">{fields.length}</Heading>
                      </CardBody>
                    </Card>
                    <Card variant="outline" bg="gray.50">
                      <CardBody py={3}>
                        <Text fontSize="sm" color="gray.600">
                          Unidades totales
                        </Text>
                        <Heading size="md">{getTotalUnits()}</Heading>
                      </CardBody>
                    </Card>
                    <Card variant="outline" bg="purple.50">
                      <CardBody py={3}>
                        <Text fontSize="sm" color="purple.700">
                          Total actual
                        </Text>
                        <Heading size="md" color="purple.700">
                          {currencyFormatter.format(getTotalSale() || 0)}
                        </Heading>
                      </CardBody>
                    </Card>
                  </SimpleGrid>

                  <Grid mb={4}>
                    <GridItem>
                      <FormControl>
                        <Divider orientation="horizontal" />
                      </FormControl>
                    </GridItem>
                  </Grid>
                  <Grid mb={4}>
                    <GridItem>
                      <FormControl>
                        <Text fontSize="large" fontWeight="semibold">
                          Productos de la venta
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Atajos: F2 nueva venta, F4 agrega item, Alt+Delete elimina el item activo, Ctrl+Enter guarda, F8 cancela la venta y Esc cierra el item abierto.
                        </Text>
                      </FormControl>
                    </GridItem>
                  </Grid>
                  <Grid mb={4}>
                    <GridItem>
                      <FormControl>
                        <Divider orientation="horizontal" />
                      </FormControl>
                    </GridItem>
                  </Grid>

                  <Stack spacing={3}>
                    {fields.map((field, index) => {
                      const isExpanded = expandedIndex === index;
                      const currentProductId = sale.saleItems?.at(index)?.product;
                      const quantity = Number(sale.saleItems?.at(index)?.quantity ?? 0);
                      const subtotal = getSubtotal(index);
                      const productName = getProductName(currentProductId);
                      const variantSummary = formatVariantSelections(
                        sale.saleItems?.at(index)?.variantSelections,
                        assetVariants,
                      );

                      return (
                        <Card key={field.id} variant="outline">
                          <CardBody p={0}>
                            <Flex
                              px={4}
                              py={4}
                              direction={{ base: "column", md: "row" }}
                              gap={3}
                              justify="space-between"
                              align={{ base: "stretch", md: "center" }}
                            >
                              <Box flex="1" minW={0}>
                                <Flex mb={1} align="center" gap={2} wrap="wrap">
                                  <Text fontSize="sm" fontWeight="bold" color="gray.500">
                                    Item {index + 1}
                                  </Text>
                                  <Text fontWeight="semibold" noOfLines={1}>
                                    {productName}
                                  </Text>
                                </Flex>
                                <Flex wrap="wrap" gap={4} fontSize="sm" color="gray.600">
                                  <Text>Cant.: {quantity || 0}</Text>
                                  <Text>
                                    Subtotal: {currencyFormatter.format(subtotal || 0)}
                                  </Text>
                                </Flex>
                                {variantSummary && (
                                  <Text mt={2} fontSize="sm" color="gray.500">
                                    {variantSummary}
                                  </Text>
                                )}
                              </Box>

                              <Flex
                                gap={2}
                                justify={{ base: "space-between", md: "flex-end" }}
                                align="center"
                                width={{ base: "full", md: "auto" }}
                              >
                                <Button
                                  type="button"
                                  size="sm"
                                  colorScheme="purple"
                                  variant={isExpanded ? "solid" : "outline"}
                                  leftIcon={isExpanded ? <ChevronUpIcon /> : <EditIcon />}
                                  onClick={() => {
                                    const nextExpandedState =
                                      expandedIndex === index ? -1 : index;
                                    setExpandedIndex(nextExpandedState);
                                    if (nextExpandedState === index) {
                                      setTimeout(() => {
                                        focusElement(getProductInputId(index));
                                      }, 0);
                                    }
                                  }}
                                >
                                  {isExpanded ? "Listo" : "Editar"}
                                </Button>
                                {fields.length > 1 && (
                                  <IconButton
                                    type="button"
                                    variant="outline"
                                    colorScheme="red"
                                    onClick={() => handleRemoveItem(index)}
                                    icon={<DeleteIcon />}
                                    aria-label="Eliminar item"
                                  />
                                )}
                              </Flex>
                            </Flex>

                            {isExpanded && (
                              <>
                                <Divider />
                                <Box p={4}>
                                  <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={4}>
                                    <MySelect
                                      field={`saleItems.${index}.product`}
                                      register={register}
                                      control={control}
                                      formState={formState}
                                      label="Producto"
                                      placeholder="Buscar producto"
                                      data={products}
                                      isDisabled={false}
                                      isRequired={true}
                                      inputId={getProductInputId(index)}
                                      autoFocus={index === 0}
                                      onValueChange={() => {
                                        focusElement(getQuantityInputId(index));
                                      }}
                                    />
                                    <MyInput
                                      formState={formState}
                                      register={register}
                                      field={`saleItems.${index}.quantity`}
                                      type={"number"}
                                      placeholder={"Cantidad"}
                                      label={"Cantidad"}
                                      inputId={getQuantityInputId(index)}
                                      onKeyDown={(event) => {
                                        if (event.key !== "Enter" || event.ctrlKey) {
                                          return;
                                        }
                                        event.preventDefault();
                                        closeCurrentItem(index);
                                      }}
                                    />
                                    <Card variant="outline" bg="gray.50">
                                      <CardBody py={3}>
                                        <Text fontSize="sm" color="gray.600">
                                          Subtotal del item
                                        </Text>
                                        <Heading size="sm">
                                          {currencyFormatter.format(subtotal || 0)}
                                        </Heading>
                                      </CardBody>
                                    </Card>
                                  </SimpleGrid>

                                  <Box mt={4}>
                                    <VariantSelectionsEditor
                                      name={`saleItems.${index}.variantSelections`}
                                      productId={sale.saleItems?.at(index)?.product}
                                      lineQuantity={Number(
                                        sale.saleItems?.at(index)?.quantity ?? 0,
                                      )}
                                      productItems={productItems}
                                      assetVariants={assetVariants}
                                      register={register}
                                      control={control}
                                      formState={formState}
                                      watch={watch}
                                      inputIdPrefix={getVariantInputPrefix(index)}
                                      onRequestItemCompletion={() => {
                                        closeCurrentItem(index);
                                      }}
                                    />
                                  </Box>
                                </Box>
                              </>
                            )}
                          </CardBody>
                        </Card>
                      );
                    })}
                  </Stack>

                  <Button
                    key={"addRows"}
                    type="button"
                    variant="ghost"
                    size={"sm"}
                    colorScheme="blue"
                    alignSelf={"start"}
                    mt={3}
                    leftIcon={<ChevronDownIcon />}
                    onClick={handleAppendItem}
                  >
                    Agregar item
                  </Button>

                  <Stack
                    mt={6}
                    spacing={3}
                    direction={{ base: "column", md: "row" }}
                    justifyContent={"end"}
                  >
                    <Grid mb={4}>
                      <GridItem>
                        <FormControl>
                          <Divider orientation="horizontal" />
                        </FormControl>
                      </GridItem>
                    </Grid>
                    <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={4}>
                      <GridItem colSpan={{ base: 12, md: 4 }}></GridItem>
                      <GridItem colSpan={{ base: 12, md: 8 }}>
                        <Card
                          size="sm"
                          variant="outline"
                          borderColor="purple.200"
                          bg="linear-gradient(135deg, rgba(128,90,213,0.08), rgba(255,255,255,1))"
                          boxShadow="sm"
                        >
                          <CardBody px={{ base: 4, md: 5 }} py={4}>
                            <Flex
                              direction={{ base: "column", md: "row" }}
                              justify="space-between"
                              align={{ base: "flex-start", md: "center" }}
                              gap={3}
                            >
                              <Box>
                                <Text
                                  fontSize="xs"
                                  letterSpacing="0.08em"
                                  textTransform="uppercase"
                                  color="purple.700"
                                  fontWeight="bold"
                                >
                                  Resumen final
                                </Text>
                                <Text fontSize="sm" color="gray.600" mt={1}>
                                  {fields.length} item{fields.length === 1 ? "" : "s"} · {getTotalUnits()} unidades
                                </Text>
                              </Box>
                              <Box textAlign={{ base: "left", md: "right" }}>
                                <Text fontSize="sm" color="gray.600">
                                  Total a cobrar
                                </Text>
                                <Heading size="lg" color="purple.700">
                                  {currencyFormatter.format(getTotalSale() || 0)}
                                </Heading>
                              </Box>
                            </Flex>
                          </CardBody>
                        </Card>
                      </GridItem>
                    </Grid>
                    <Button
                      isLoading={isLoading}
                      type="submit"
                      colorScheme="purple"
                      variant="solid"
                    >
                      Guardar
                    </Button>
                    <Button
                      type="button"
                      onClick={() => onCancelOperation()}
                      colorScheme="gray"
                      variant="solid"
                    >
                      Cancelar (F8)
                    </Button>
                  </Stack>
                </form>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      )}
    </>
  );
};

export default SaleFormAdd;
