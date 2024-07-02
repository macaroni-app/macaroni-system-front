import { Grid, GridItem } from "@chakra-ui/react"

// custom hooks
import { useSales } from "../../hooks/useSales"
import { useInventories } from "../../hooks/useInventories"
import { useCheckRole } from "../../hooks/useCheckRole"

// components
import QuickInventoryReport from "./QuickInventoryReport"

// types
import { ISaleFullRelated } from "../sales/types"
import { IInventoryFullRelated } from "../inventories/types"
import SimpleBoard from "./SimpleBoard"
import ProfileBase from "../common/permissions"
import { useFixedCosts } from "../../hooks/useFixedCosts"
import { IFixedCost } from "../fixedCosts/types"
import SimpleBoardSkeleton from "./SimpleBoardSkeleton"
import LineChart from "./LineChart"
import BarChart from "./BarChart"

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

  const totalCosts = Number(sales?.filter((sale) => sale.status === "PAID")?.map(sale => sale.costTotal).reduce((acc, currentValue) => Number(acc) + Number(currentValue), 0))

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

  // Net costs
  const queryFixedCosts = useFixedCosts({})
  const fixedCosts = queryFixedCosts?.data as IFixedCost[]
  const fixedCostAmounts = fixedCosts?.map(
    (fixedCost) => fixedCost.amount
  ) as number[]

  const totalFixedCosts = Number.parseFloat(
    fixedCostAmounts
      ?.reduce((acc, currentValue) => acc + currentValue, 0)
      .toFixed(2)
  )

  // Net revenues
  const netRevenue = Number(totalRevenues - totalFixedCosts)

  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
      {checkRole(ProfileBase.dashboard.stats) && (
        <>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
              <GridItem colSpan={{ base: 12 }}>
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
              <GridItem colSpan={{ base: 12 }}>
                <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                  <GridItem colSpan={{ base: 12, md: 6 }}>
                    {querySales.isLoading && (
                      <SimpleBoardSkeleton numberRows={3} />
                    )}
                    {!querySales.isLoading && (
                      <SimpleBoard
                        title="Costo"
                        amount={totalCosts}
                        size={sales?.length}
                        fontColor="black"
                      />
                    )}
                  </GridItem>
                  <GridItem colSpan={{ base: 12, md: 6 }}>
                    {queryFixedCosts.isLoading && (
                      <SimpleBoardSkeleton numberRows={3} />
                    )}
                    {!queryFixedCosts.isLoading && (
                      <SimpleBoard
                        title="Costo fijo"
                        amount={totalFixedCosts}
                        size={assetCosts?.length}
                        fontColor="black"
                      />
                    )}
                  </GridItem>
                </Grid>
              </GridItem>
            </Grid>
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
              <GridItem colSpan={{ base: 12 }}>
                <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                  <GridItem colSpan={{ base: 12, md: 6 }}>
                    {querySales.isLoading && (
                      <SimpleBoardSkeleton numberRows={3} />
                    )}
                    {!querySales.isLoading && (
                      <SimpleBoard
                        title="Ganancia"
                        amount={totalRevenues}
                        size={billings?.length}
                        fontColor="black"
                      />
                    )}
                  </GridItem>
                  <GridItem colSpan={{ base: 12, md: 6 }}>
                    {querySales.isLoading && (
                      <SimpleBoardSkeleton numberRows={3} />
                    )}
                    {!querySales.isLoading && (
                      <SimpleBoard
                        title="Ganancia neta"
                        amount={netRevenue}
                        size={billings?.length}
                        fontColor="black"
                      />
                    )}
                  </GridItem>
                </Grid>
              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                {queryInventories.isLoading && (
                  <SimpleBoardSkeleton numberRows={3} />
                )}
                {!queryInventories.isLoading && (
                  <SimpleBoard
                    title="Costo total del stock"
                    amount={totalAssetCosts}
                    size={assetCosts?.length}
                    fontColor="black"
                  />
                )}
              </GridItem>
            </Grid>
          </GridItem>
        </>
      )}
      {checkRole(ProfileBase.dashboard.stockTab) && (
        <>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            {queryInventories.isLoading && <SimpleBoardSkeleton numberRows={7} />}
            {!queryInventories.isLoading && <QuickInventoryReport />}
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <BarChart />
          </GridItem>
        </>
      )}
      {checkRole(ProfileBase.dashboard.stats) && (
        <GridItem colSpan={{ base: 12 }}>
          <LineChart />
        </GridItem>
      )}
    </Grid>
  )
}

export default Dashboard
