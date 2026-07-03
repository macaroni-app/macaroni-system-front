import { useEffect, useState } from "react";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

import {
  Grid,
  Card,
  CardBody,
  Flex,
  Spacer,
  Text,
  Stack,
  Skeleton,
  GridItem,
  Badge,
  Button,
  Collapse,
  useDisclosure,
} from "@chakra-ui/react";

// components
import WithoutResults from "../common/WithoutResults";
import Sale from "./Sale";
import RangeDateFilter, { RangeDate } from "../common/RangeDateFilter";
import SimpleBoard from "../dashboard/SimpleBoard";
import SimpleBoardSkeleton from "../dashboard/SimpleBoardSkeleton";

import { IProductItemFullRelated } from "../products/types";

// custom hooks
import { useSales } from "../../hooks/useSales";
import { useSaleItems } from "../../hooks/useSaleItems";
import { useProductItems } from "../../hooks/useProductItems";
import { useInventories } from "../../hooks/useInventories";
import { useTodayDate } from "../../hooks/useTodayDate";
import { useCheckRole } from "../../hooks/useCheckRole";

// types
import { ISaleFullRelated, ISaleItemFullRelated } from "./types";
import { IInventoryFullRelated } from "../inventories/types";

import NewRecordPanel from "../common/NewRecordPanel";

import ProfileBase from "../common/permissions";

const Sales = () => {
  const { checkRole } = useCheckRole();
  const today = useTodayDate();
  const { isOpen, onToggle } = useDisclosure();
  const [rangeDate, setRangeDate] = useState({
    startDate: today,
    endDate: today,
  });
  const querySales = useSales({
    startDate: rangeDate.startDate,
    endDate: rangeDate.endDate,
  });
  const querySaleItems = useSaleItems({
    startDate: rangeDate.startDate,
    endDate: rangeDate.endDate,
  });
  const queryProductItems = useProductItems({});
  const queryInventories = useInventories({});

  const inventoriesByAsset = queryInventories.inventoriesByAssetId;
  const inventoriesByAssetVariant = queryInventories.inventoriesByAssetVariantId;

  const productItems = queryProductItems.data as IProductItemFullRelated[];
  const inventories = queryInventories.inventories as IInventoryFullRelated[];

  // const { throwError } = useError()

  const navigate = useNavigate();

  const handleAddSale = () => {
    navigate("add");
  };

  useEffect(() => {
    if (!checkRole(ProfileBase.sales.create)) {
      return;
    }

    const handleKeyboardShortcut = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      if (event.key === "F2") {
        event.preventDefault();
        handleAddSale();
      }
    };

    window.addEventListener("keydown", handleKeyboardShortcut);
    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcut);
    };
  }, [checkRole]);

  const sales = querySales?.data as ISaleFullRelated[];
  // saleItems
  querySaleItems?.data as ISaleItemFullRelated[];

  const billings = sales
    ?.filter((sale) => sale.status === "PAID")
    ?.map((sale) => sale?.total) as number[];

  const totalBillings = Number.parseFloat(
    billings?.reduce((acc, currentValue) => acc + currentValue, 0).toFixed(2),
  );

  const totalCosts = Number(
    sales
      ?.filter((sale) => sale.status === "PAID")
      ?.map((sale) => sale.costTotal)
      .reduce((acc, currentValue) => Number(acc) + Number(currentValue), 0),
  );

  // profit
  const totalRevenues = Number(totalBillings - totalCosts);

  const onSubmit = (rangeDate: RangeDate) => {
    if (rangeDate.startDate !== undefined && rangeDate.endDate !== undefined) {
      setRangeDate({
        startDate: rangeDate.startDate,
        endDate: rangeDate.endDate,
      });
    }
  };

  const hasActiveDateFilter =
    rangeDate.startDate !== today || rangeDate.endDate !== today;

  // if (querySales?.isError) {
  //   throwError(querySales?.error)
  // }

  const saleList = sales?.map((sale) => {
    if (sale._id !== undefined && sale.createdAt !== undefined) {
      return (
        <Sale
          key={sale?._id + sale?.createdAt}
          sale={sale}
          productItems={productItems}
          inventories={inventories}
          inventoriesByAsset={inventoriesByAsset}
          inventoriesByAssetVariant={inventoriesByAssetVariant}
          rangeDate={rangeDate}
        />
      );
    }
  });

  return (
    <>
      {querySales?.isLoading && (
        <Card variant="outline" mt={5} mb={3}>
          <CardBody>
            <Stack>
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </Stack>
          </CardBody>
        </Card>
      )}

      {!querySales?.isError && !querySales?.isLoading && (
        <NewRecordPanel
          handleAddRecord={handleAddSale}
          noRecords={saleList?.length}
          title="ventas"
          buttonLabel="Nueva venta (F2)"
          roles={ProfileBase.sales.create}
        />
      )}

      {/* stats */}
      <Grid templateColumns="repeat(12, 1fr)" gap={3}>
        {checkRole(ProfileBase.dashboard.stats) && (
          <>
            <GridItem colSpan={{ base: 12, lg: 4 }}>
              {querySales.isLoading && <SimpleBoardSkeleton numberRows={3} />}
              {!querySales.isLoading && (
                <SimpleBoard
                  title="Facturación"
                  amount={totalBillings}
                  size={billings?.length}
                  fontColor="black"
                />
              )}
            </GridItem>
            <GridItem colSpan={{ base: 12, lg: 4 }}>
              {querySales.isLoading && <SimpleBoardSkeleton numberRows={3} />}
              {!querySales.isLoading && (
                <SimpleBoard
                  title="Costo"
                  amount={totalCosts}
                  size={sales?.length}
                  fontColor="black"
                />
              )}
            </GridItem>
            <GridItem colSpan={{ base: 12, lg: 4 }}>
              {querySales.isLoading && <SimpleBoardSkeleton numberRows={3} />}
              {!querySales.isLoading && (
                <SimpleBoard
                  title="Ganancia"
                  amount={totalRevenues}
                  size={billings?.length}
                  fontColor="black"
                />
              )}
            </GridItem>
          </>
        )}
      </Grid>

      {/* end stats */}

      <Stack spacing={3} mt={3}>
        <Card variant="outline">
          <CardBody>
            <Flex
              direction={{ base: "column", md: "row" }}
              align={{ base: "stretch", md: "center" }}
              justify="space-between"
              gap={3}
            >
              <Flex align="center" gap={3} wrap="wrap">
                <Button
                  onClick={onToggle}
                  leftIcon={hasActiveDateFilter ? <CheckIcon /> : undefined}
                  rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  colorScheme={isOpen || hasActiveDateFilter ? "purple" : "gray"}
                  variant={isOpen || hasActiveDateFilter ? "solid" : "outline"}
                  size={{ base: "sm", md: "md" }}
                  width={{ base: "fit-content", md: "auto" }}
                >
                  {isOpen ? "Ocultar filtros" : "Mostrar filtros"}
                </Button>
                {hasActiveDateFilter && (
                  <Badge colorScheme="purple" variant="subtle" px={2} py={1}>
                    Filtros activos
                  </Badge>
                )}
              </Flex>
              <Text
                fontSize="sm"
                color="gray.500"
                display={{ base: "none", md: "block" }}
              >
                Filtrá por rango de fechas solo cuando lo necesites.
              </Text>
            </Flex>
            <Collapse in={isOpen} animateOpacity>
              <Grid templateColumns="repeat(12, 1fr)" gap={3} mt={4}>
                <GridItem colSpan={{ base: 12, md: 5, lg: 4 }}>
                  <RangeDateFilter onSubmit={onSubmit} rangeDate={rangeDate} />
                </GridItem>
              </Grid>
            </Collapse>
          </CardBody>
        </Card>
        <Grid>
          {querySales?.isLoading && (
            <>
              <Card variant="filled" mb={3}>
                <CardBody>
                  <Flex>
                    <Spacer />
                    <Skeleton
                      width={"170px"}
                      startColor="purple.500"
                      endColor="purple.300"
                      height="40px"
                      borderRadius={"5px"}
                    />
                  </Flex>
                </CardBody>
              </Card>
              <Card variant="outline" mb={3}>
                <CardBody>
                  <Stack>
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                  </Stack>
                </CardBody>
              </Card>
              <Card variant="outline" mb={3}>
                <CardBody>
                  <Stack>
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                  </Stack>
                </CardBody>
              </Card>
              <Card variant="outline" mb={3}>
                <CardBody>
                  <Stack>
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                  </Stack>
                </CardBody>
              </Card>
              <Card variant="outline" mb={3}>
                <CardBody>
                  <Stack>
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                  </Stack>
                </CardBody>
              </Card>
              <Card variant="outline" mb={3}>
                <CardBody>
                  <Stack>
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                  </Stack>
                </CardBody>
              </Card>
            </>
          )}

          <Grid gap={2} templateColumns="repeat(12, 1fr)">
            <GridItem
              display={{ base: "none", md: "block" }}
              colSpan={{ base: 12, md: 12, lg: 12 }}
              colStart={{ base: 1, md: 1, lg: 1 }}
            >
              {!querySales?.isLoading && !querySales?.isError && (
                <Card variant="outline">
                  <CardBody>
                    <Grid
                      templateColumns="repeat(8, 1fr)"
                      gap={2}
                      alignItems={"center"}
                    >
                      <GridItem>
                        <Flex direction="column" gap={2}>
                          <Text fontWeight="bold">Cliente</Text>
                        </Flex>
                      </GridItem>
                      <GridItem>
                        <Flex direction="column" gap={2} placeItems={"center"}>
                          <Text fontWeight="bold">Estado</Text>
                        </Flex>
                      </GridItem>
                      <GridItem>
                        <Flex direction="column" gap={2} placeItems={"center"}>
                          <Text fontWeight="bold">Afip</Text>
                        </Flex>
                      </GridItem>
                      <GridItem>
                        <Flex direction="column" gap={2} placeItems={"center"}>
                          <Text fontWeight="bold">Vendedor</Text>
                        </Flex>
                      </GridItem>
                      <GridItem>
                        <Flex direction="column" gap={2} placeItems={"center"}>
                          <Text fontWeight="bold">Fecha</Text>
                        </Flex>
                      </GridItem>
                      <GridItem>
                        <Flex direction="column" gap={2} placeItems={"center"}>
                          <Text fontWeight="bold">Cobro</Text>
                        </Flex>
                      </GridItem>
                      <GridItem>
                        <Flex direction="column" gap={2} placeItems={"center"}>
                          <Text fontWeight="bold">Total</Text>
                        </Flex>
                      </GridItem>
                      <GridItem>
                        <Flex direction="column" gap={2} placeItems={"end"}>
                          <Text fontWeight="bold">Acciones</Text>
                        </Flex>
                      </GridItem>
                    </Grid>
                  </CardBody>
                </Card>
              )}
            </GridItem>
            <GridItem
              colSpan={{ base: 12, md: 12, lg: 12 }}
              colStart={{ base: 1, md: 1, lg: 1 }}
            >
              {querySales?.data?.length !== undefined &&
                querySales?.data?.length > 0 &&
                !querySales?.isLoading &&
                !querySales?.isError && <>{saleList}</>}
              {querySales?.data?.length === 0 &&
                !querySales?.isError &&
                !querySales?.isLoading && (
                  <WithoutResults text={"No se encontró resultados."} />
                )}
            </GridItem>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

export default Sales;
