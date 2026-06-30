import { Card, CardBody, Grid, Skeleton, Stack } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { useVariantAttributeValues } from "../../hooks/useVariantAttributeValues"
import NewRecordPanel from "../common/NewRecordPanel"
import WithoutResults from "../common/WithoutResults"
import ProfileBase from "../common/permissions"
import VariantAttributeValue from "./VariantAttributeValue"
import { IVariantAttributeValue } from "./types"

const VariantAttributeValues = () => {
  const navigate = useNavigate()
  const queryVariantAttributeValues = useVariantAttributeValues({})
  const variantAttributeValues =
    queryVariantAttributeValues.data as IVariantAttributeValue[]

  const handleAdd = () => {
    navigate("/variantAttributeValues/add")
  }

  const variantAttributeValueList = variantAttributeValues?.map((value) => (
    <VariantAttributeValue
      key={`${value._id}-${value.createdAt}`}
      variantAttributeValue={value}
    />
  ))

  if (queryVariantAttributeValues.isLoading) {
    return (
      <Card variant="outline" mt={5} mb={3}>
        <CardBody>
          <Stack>
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </Stack>
        </CardBody>
      </Card>
    )
  }

  return (
    <>
      <NewRecordPanel
        handleAddRecord={handleAdd}
        noRecords={variantAttributeValueList?.length ?? 0}
        title="valores de variante"
        buttonLabel="Nuevo valor"
        roles={ProfileBase.variantAttributeValues.create}
      />

      {variantAttributeValueList?.length ? (
        <Grid>{variantAttributeValueList}</Grid>
      ) : (
        <WithoutResults text="No hay valores de variante cargados." />
      )}
    </>
  )
}

export default VariantAttributeValues
