import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button, Card, CardBody, Grid, GridItem } from "@chakra-ui/react";

import { z } from "zod";

import MyInput from "../ui/inputs/MyInput";

export const rangeDateSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type RangeDate = {
  startDate?: string;
  endDate?: string;
};

interface Props {
  onSubmit: SubmitHandler<RangeDate>;
  rangeDate: RangeDate;
}

const RangeDateFilter = ({ onSubmit, rangeDate }: Props) => {
  const { register, formState, handleSubmit } = useForm<RangeDate>({
    resolver: zodResolver(rangeDateSchema),
    values: {
      startDate: rangeDate.startDate || "",
      endDate: rangeDate.endDate || "",
    },
  });

  return (
    <Grid>
      <GridItem>
        <Card variant={"outline"} mb={3}>
          <CardBody>
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
              <Grid
                mb={4}
                templateColumns="repeat(12, 1fr)"
                gap={2}
              >
                <GridItem colSpan={{ base: 12, md: 6 }}>
                  <MyInput
                    register={register}
                    formState={formState}
                    field={"startDate"}
                    type={"date"}
                    placeholder={"Desde"}
                    label={"Desde"}
                  />
                </GridItem>
                <GridItem colSpan={{ base: 12, md: 6 }}>
                  <MyInput
                    register={register}
                    formState={formState}
                    field={"endDate"}
                    type={"date"}
                    placeholder={"Hasta"}
                    label={"Hasta"}
                  />
                </GridItem>
              </Grid>
              <Button
                type="submit"
                colorScheme="purple"
                variant="solid"
              >
                Filtrar
              </Button>
            </form>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};

export default RangeDateFilter;
