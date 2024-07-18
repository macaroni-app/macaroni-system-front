import { useState } from "react";

import {
  Grid,
  Card,
  CardBody,
  Flex,
  Spacer,
  Stack,
  Skeleton,
  GridItem,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

// components
import FixedCost from "./FixedCost";
import WithoutResults from "../common/WithoutResults";
import NewRecordPanel from "../common/NewRecordPanel";
import RangeDateFilter, { RangeDate } from "../dashboard/RangeDateFilter";

// custom hooks
import { useFixedCosts } from "../../hooks/useFixedCosts";
import { IFixedCost } from "./types";
import { useTodayDate } from "../../hooks/useTodayDate";
// import { useError } from "../../hooks/useError"

import ProfileBase from "../common/permissions";

const FixedCosts = (): JSX.Element => {
  const today = useTodayDate();
  const [rangeDate, setRangeDate] = useState({
    startDate: today,
    endDate: today,
  });
  const queryFixedCosts = useFixedCosts({
    startDate: rangeDate.startDate,
    endDate: rangeDate.endDate,
  });
  let fixedCosts = queryFixedCosts?.data as IFixedCost[];

  const navigate = useNavigate();

  const onSubmit = (rangeDate: RangeDate) => {
    if (
      rangeDate.startDate !== undefined &&
      rangeDate.endDate !== undefined
    ) {
      setRangeDate({
        startDate: rangeDate.startDate,
        endDate: rangeDate.endDate,
      });
    }
  };

  // const { throwError } = useError()

  // if (queryCategories?.isError) {
  //   throwError(queryCategories?.error)
  // }

  const handleAddFixedCost = () => {
    navigate("/fixedCosts/add");
  };

  const fixedCostList = fixedCosts?.map((fixedCost) => {
    if (fixedCost._id !== undefined && fixedCost.createdAt !== undefined) {
      return (
        <FixedCost
          key={fixedCost?._id + fixedCost?.createdAt}
          fixedCost={fixedCost}
        />
      );
    }
  });

  if (queryFixedCosts?.isLoading) {
    return (
      <>
        <Card variant="outline" mt={5} mb={3}>
          <CardBody>
            <Stack>
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </Stack>
          </CardBody>
        </Card>
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
              <Skeleton height="10px" />
              <Skeleton height="10px" />
              <Skeleton height="10px" />
            </Stack>
          </CardBody>
        </Card>
        <Card variant="outline" mb={3}>
          <CardBody>
            <Stack>
              <Skeleton height="10px" />
              <Skeleton height="10px" />
              <Skeleton height="10px" />
            </Stack>
          </CardBody>
        </Card>
        <Card variant="outline" mb={3}>
          <CardBody>
            <Stack>
              <Skeleton height="10px" />
              <Skeleton height="10px" />
              <Skeleton height="10px" />
            </Stack>
          </CardBody>
        </Card>
        <Card variant="outline" mb={3}>
          <CardBody>
            <Stack>
              <Skeleton height="10px" />
              <Skeleton height="10px" />
              <Skeleton height="10px" />
            </Stack>
          </CardBody>
        </Card>
        <Card variant="outline" mb={3}>
          <CardBody>
            <Stack>
              <Skeleton height="10px" />
              <Skeleton height="10px" />
              <Skeleton height="10px" />
            </Stack>
          </CardBody>
        </Card>
      </>
    );
  }

  return (
    <>
      {!queryFixedCosts?.isError && !queryFixedCosts?.isLoading && (
        <NewRecordPanel
          handleAddRecord={handleAddFixedCost}
          noRecords={fixedCostList?.length}
          title="gastos fijos"
          buttonLabel="Nuevo gasto fijo"
          roles={ProfileBase.fixedCosts.create}
        />
      )}
      <Grid gap={3} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={{ base: 12, lg: 3 }}>
          {<RangeDateFilter onSubmit={onSubmit} rangeDate={rangeDate} />}
        </GridItem>
        <GridItem colSpan={{ base: 12, lg: 9 }}>

          {!queryFixedCosts?.isError &&
            queryFixedCosts?.data?.length !== undefined &&
            queryFixedCosts?.data?.length > 0 &&
            !queryFixedCosts?.isLoading && <Grid>{fixedCostList}</Grid>}
          {!queryFixedCosts?.isError &&
            queryFixedCosts?.data?.length === 0 &&
            !queryFixedCosts?.isLoading && (
              <WithoutResults text={"No hay gastos fijos cargados."} />
            )}
        </GridItem>
      </Grid>
    </>
  );
};

export default FixedCosts;
