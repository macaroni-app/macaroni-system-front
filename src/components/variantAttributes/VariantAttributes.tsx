import { Card, CardBody, Grid, Skeleton, Stack } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { useVariantAttributes } from "../../hooks/useVariantAttributes"
import NewRecordPanel from "../common/NewRecordPanel"
import WithoutResults from "../common/WithoutResults"
import ProfileBase from "../common/permissions"
import VariantAttribute from "./VariantAttribute"
import { IVariantAttribute } from "./types"

const VariantAttributes = () => {
  const navigate = useNavigate()
  const queryVariantAttributes = useVariantAttributes({})
  const variantAttributes = queryVariantAttributes.data as IVariantAttribute[]

  const handleAdd = () => {
    navigate("/variantAttributes/add")
  }

  const variantAttributeList = variantAttributes?.map((variantAttribute) => (
    <VariantAttribute
      key={`${variantAttribute._id}-${variantAttribute.createdAt}`}
      variantAttribute={variantAttribute}
    />
  ))

  if (queryVariantAttributes.isLoading) {
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
        noRecords={variantAttributeList?.length ?? 0}
        title="atributos de variante"
        buttonLabel="Nuevo atributo"
        roles={ProfileBase.variantAttributes.create}
      />

      {variantAttributeList?.length ? (
        <Grid>{variantAttributeList}</Grid>
      ) : (
        <WithoutResults text="No hay atributos de variante cargados." />
      )}
    </>
  )
}

export default VariantAttributes
