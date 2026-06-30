import { Card, CardBody, Grid, Skeleton, Stack } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { useAssetVariants } from "../../hooks/useAssetVariants"
import NewRecordPanel from "../common/NewRecordPanel"
import WithoutResults from "../common/WithoutResults"
import ProfileBase from "../common/permissions"
import AssetVariant from "./AssetVariant"
import { IAssetVariant } from "./types"

const AssetVariants = () => {
  const navigate = useNavigate()
  const queryAssetVariants = useAssetVariants({})
  const assetVariants = queryAssetVariants.data as IAssetVariant[]

  const handleAdd = () => {
    navigate("/assetVariants/add")
  }

  const assetVariantList = assetVariants?.map((assetVariant) => (
    <AssetVariant
      key={`${assetVariant._id}-${assetVariant.createdAt}`}
      assetVariant={assetVariant}
    />
  ))

  if (queryAssetVariants.isLoading) {
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
        noRecords={assetVariantList?.length ?? 0}
        title="variantes de insumo"
        buttonLabel="Nueva variante"
        roles={ProfileBase.assetVariants.create}
      />

      {assetVariantList?.length ? (
        <Grid>{assetVariantList}</Grid>
      ) : (
        <WithoutResults text="No hay variantes de insumo cargadas." />
      )}
    </>
  )
}

export default AssetVariants
