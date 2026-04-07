import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Grid,
  GridItem,
  Input,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import WithoutResults from "../common/WithoutResults";
import NewRecordPanel from "../common/NewRecordPanel";
import RangeDateFilter, { RangeDate } from "../common/RangeDateFilter";
import ProfileBase from "../common/permissions";
import { useOrderRequests } from "../../hooks/useOrderRequests";
import { useTodayDate } from "../../hooks/useTodayDate";
import OrderRequest from "./OrderRequest";
import { IOrderRequestFullRelated } from "./types";

const OrderRequests = () => {
  const today = useTodayDate();
  const navigate = useNavigate();
  const [searchOrderCode, setSearchOrderCode] = useState("");
  const [appliedOrderCode, setAppliedOrderCode] = useState("");
  const [searchClientName, setSearchClientName] = useState("");
  const [appliedClientName, setAppliedClientName] = useState("");
  const [rangeDate, setRangeDate] = useState({
    startDate: today,
    endDate: today,
  });

  const queryOrderRequests = useOrderRequests({
    orderCode: appliedOrderCode || undefined,
    clientName: appliedClientName || undefined,
    startDate: appliedOrderCode || appliedClientName ? undefined : rangeDate.startDate,
    endDate: appliedOrderCode || appliedClientName ? undefined : rangeDate.endDate,
  });

  const orderRequests = queryOrderRequests.data as IOrderRequestFullRelated[];

  const handleAddOrderRequest = () => {
    navigate("add");
  };

  const onSubmit = (currentRangeDate: RangeDate) => {
    setAppliedOrderCode("");
    setAppliedClientName("");
    if (
      currentRangeDate.startDate !== undefined &&
      currentRangeDate.endDate !== undefined
    ) {
      setRangeDate({
        startDate: currentRangeDate.startDate,
        endDate: currentRangeDate.endDate,
      });
    }
  };

  const handleSearchByOrderCode = () => {
    setAppliedClientName("");
    setAppliedOrderCode(searchOrderCode.trim());
  };

  const handleSearchByClientName = () => {
    setAppliedOrderCode("");
    setAppliedClientName(searchClientName.trim());
  };

  const handleClearOrderCodeSearch = () => {
    setSearchOrderCode("");
    setAppliedOrderCode("");
    setSearchClientName("");
    setAppliedClientName("");
  };

  const orderRequestList = orderRequests?.map((orderRequest) => {
    if (orderRequest._id === undefined) {
      return null;
    }

    return <OrderRequest key={orderRequest._id} orderRequest={orderRequest} />;
  });

  return (
    <>
      {queryOrderRequests.isLoading && (
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

      {!queryOrderRequests.isError && !queryOrderRequests.isLoading && (
        <NewRecordPanel
          handleAddRecord={handleAddOrderRequest}
          noRecords={orderRequestList?.filter(Boolean).length}
          title="pedidos"
          buttonLabel="Nuevo pedido"
          roles={ProfileBase.orderRequests.create}
        />
      )}

      <Grid gap={3} templateColumns="repeat(12, 1fr)" mt={3}>
        <GridItem colSpan={{ base: 12, lg: 3 }}>
          <Card variant="outline" mb={3}>
            <CardBody>
              <Text mb={2}>Buscar por nro. de pedido</Text>
              <Grid templateColumns="repeat(12, 1fr)" gap={2}>
                <GridItem colSpan={{ base: 12 }}>
                  <Input
                    placeholder="Ej: 001"
                    value={searchOrderCode}
                    onChange={(event) => setSearchOrderCode(event.target.value)}
                  />
                </GridItem>
                <GridItem colSpan={{ base: 12 }}>
                  <Button
                    colorScheme="purple"
                    width="100%"
                    onClick={handleSearchByOrderCode}
                  >
                    Buscar
                  </Button>
                </GridItem>
                <GridItem colSpan={{ base: 12 }}>
                  <Button
                    variant="outline"
                    width="100%"
                    onClick={handleClearOrderCodeSearch}
                  >
                    Limpiar búsqueda
                  </Button>
                </GridItem>
              </Grid>
            </CardBody>
          </Card>
          <Card variant="outline" mb={3}>
            <CardBody>
              <Text mb={2}>Buscar por cliente</Text>
              <Grid templateColumns="repeat(12, 1fr)" gap={2}>
                <GridItem colSpan={{ base: 12 }}>
                  <Input
                    placeholder="Ej: Juan Perez"
                    value={searchClientName}
                    onChange={(event) => setSearchClientName(event.target.value)}
                  />
                </GridItem>
                <GridItem colSpan={{ base: 12 }}>
                  <Button
                    colorScheme="purple"
                    width="100%"
                    onClick={handleSearchByClientName}
                  >
                    Buscar cliente
                  </Button>
                </GridItem>
              </Grid>
            </CardBody>
          </Card>
          <RangeDateFilter onSubmit={onSubmit} rangeDate={rangeDate} />
        </GridItem>
        <GridItem colSpan={{ base: 12, lg: 9 }}>
          {!queryOrderRequests.isLoading &&
            !queryOrderRequests.isError &&
            orderRequestList?.filter(Boolean).length === 0 && (
              <WithoutResults
                text={
                  appliedOrderCode
                    ? "No se encontraron pedidos con ese código."
                    : appliedClientName
                      ? "No se encontraron pedidos borrador o confirmados para ese cliente."
                    : "No se encontraron resultados."
                }
              />
            )}
          {!queryOrderRequests.isLoading &&
            !queryOrderRequests.isError &&
            orderRequestList}
        </GridItem>
      </Grid>
    </>
  );
};

export default OrderRequests;
