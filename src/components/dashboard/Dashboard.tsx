import { Grid, GridItem } from "@chakra-ui/react"

// custom hooks
import { useSales } from "../../hooks/useSales"
import { useSaleItems } from "../../hooks/useSaleItems"
import { useInventories } from "../../hooks/useInventories"
import { useCheckRole } from "../../hooks/useCheckRole"

// components
import QuickInventoryReport from "./QuickInventoryReport"

// types
import { ISaleFullRelated, ISaleItemFullRelated } from "../sales/types"
import { IInventoryFullRelated } from "../inventories/types"
import SimpleBoard from "./SimpleBoard"
import ProfileBase from "../common/permissions"

const Dashboard = () => {
  const { checkRole } = useCheckRole()

  // sales
  const querySales = useSales({})
  const sales = querySales?.data as ISaleFullRelated[]

  const billings = sales
    ?.filter((sale) => sale.status === "PAID")
    ?.map((sale) => sale?.total) as number[]

  const totalBillings = Number.parseFloat(
    billings?.reduce((acc, currentValue) => acc + currentValue, 0).toFixed(2)
  )

  // saleItems
  const querySaleItems = useSaleItems({})
  const saleItems = querySaleItems?.data as ISaleItemFullRelated[]

  const costs = saleItems
    ?.filter((saleItem) => saleItem.sale?.status === "PAID")
    ?.map(
      (saleItem) =>
        Number(saleItem?.product?.costPrice) * Number(saleItem?.quantity)
    ) as number[]

  const totalCosts = Number.parseFloat(
    costs?.reduce((acc, currentValue) => acc + currentValue, 0).toFixed(2)
  )

  // profit
  const totalRevenues = Number(totalBillings - totalCosts)

  // assets costs
  const queryInventories = useInventories({})
  const inventories = queryInventories?.data as IInventoryFullRelated[]

  const assetCosts = inventories
    ?.filter((inventory) => inventory.asset?.isActive)
    ?.map(
      (inventory) =>
        Number(inventory?.asset?.costPrice) *
        Number(inventory?.quantityAvailable)
    ) as number[]

  const totalAssetCosts = Number.parseFloat(
    assetCosts?.reduce((acc, currentValue) => acc + currentValue, 0).toFixed(2)
  )

  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
      {checkRole(ProfileBase.dashboard.stats) && (
        <>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
              <GridItem colSpan={{ base: 12 }}>
                <SimpleBoard
                  title="Facturación"
                  amount={totalBillings}
                  size={billings?.length}
                />
              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                <SimpleBoard
                  title="Costo"
                  amount={totalCosts}
                  size={costs?.length}
                />
              </GridItem>
            </Grid>
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
              <GridItem colSpan={{ base: 12 }}>
                <SimpleBoard
                  title="Ganancia"
                  amount={totalRevenues}
                  size={billings?.length}
                />
              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                <SimpleBoard
                  title="Costo en stock"
                  amount={totalAssetCosts}
                  size={assetCosts?.length}
                />
              </GridItem>
            </Grid>
          </GridItem>
        </>
      )}
      {checkRole(ProfileBase.dashboard.stockTab) && (
        <GridItem colSpan={{ base: 12, md: 6 }}>
          <QuickInventoryReport />
        </GridItem>
      )}
      <GridItem colSpan={{ base: 12, md: 6 }}>
        {/* <QuickInventoryReport /> */}
      </GridItem>
    </Grid>
  )
}

export default Dashboard
