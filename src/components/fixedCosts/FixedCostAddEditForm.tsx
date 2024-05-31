import {
  Grid,
  GridItem,
  Button,
  Card,
  CardBody,
  Heading,
  Stack,
} from "@chakra-ui/react"

// Components
import MyInput from "../ui/inputs/MyInput"
import Loading from "../common/Loading"

// libs
import { zodResolver } from "@hookform/resolvers/zod"

// custom hook
import { SubmitHandler, useForm } from "react-hook-form"
import { IFixedCost } from "./types"
import { fixedCostSchema } from "./fixedCostSchema"

interface Props {
  onSubmit: SubmitHandler<IFixedCost>
  onCancelOperation: () => void
  fixedCostToUpdate?: IFixedCost
  isEditing: boolean
  isLoading: boolean
}

const FixedCostAddEditForm = (props: Props) => {
  const {
    onSubmit,
    onCancelOperation,
    fixedCostToUpdate,
    isEditing,
    isLoading,
  } = props

  const { register, formState, handleSubmit } = useForm<IFixedCost>({
    resolver: zodResolver(fixedCostSchema),
    values: {
      name: fixedCostToUpdate?.name,
      amount: fixedCostToUpdate?.amount,
    },
  })

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <Grid templateColumns={{ base: "repeat(12, 1fr)" }} mt={5}>
          <GridItem colSpan={{ base: 10, md: 8 }} colStart={{ base: 2, md: 3 }}>
            <Card mb={3} variant="outline">
              <CardBody>
                <Heading mb={3} textAlign="center" size="lg">
                  {!isEditing ? "Nuevo gasto" : "Modificar gasto"}
                </Heading>
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <Grid mb={4}>
                    <GridItem>
                      <MyInput
                        register={register}
                        formState={formState}
                        field={"name"}
                        type={"text"}
                        placeholder={"Nombre del gasto"}
                        label={"Gasto"}
                      />
                    </GridItem>
                  </Grid>
                  <Grid mb={4}>
                    <GridItem>
                      <MyInput
                        register={register}
                        formState={formState}
                        field={"amount"}
                        type={"number"}
                        placeholder={"Monto"}
                        label={"Monto"}
                      />
                    </GridItem>
                  </Grid>

                  <Stack
                    spacing={3}
                    direction={{ base: "column", md: "row" }}
                    justifyContent={"end"}
                  >
                    <Button
                      isLoading={isLoading}
                      type="submit"
                      colorScheme="purple"
                      variant="solid"
                    >
                      {!isEditing ? "Guardar" : "Actualizar"}
                    </Button>
                    <Button
                      onClick={() => onCancelOperation()}
                      colorScheme="gray"
                      variant="solid"
                    >
                      Cancelar
                    </Button>
                  </Stack>
                </form>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      )}
    </>
  )
}

export default FixedCostAddEditForm
