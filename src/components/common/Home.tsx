import { Route, Routes } from "react-router-dom"

import {
  Grid,
  GridItem,
  // Text,
  // Flex,
  // Card,
  // CardBody,
  Box,
} from "@chakra-ui/react"
// import {
//   FaHouse,
//   FaUsers,
//   FaBoxesStacked,
//   FaMoneyCheckDollar,
//   FaTags,
// } from "react-icons/fa6"

// components
import Header from "./Header"
import Assets from "../assets/Assets"
import AssetForm from "../assets/AssetForm"
// import ProductDetails from "../products/ProductDetails"
// import Sales from "../sales/Sales"
// import SaleForm from "../sales/SaleForm"
// import SaleDetails from "../sales/SaleDetails"
import Categories from "../categories/Categories"
import CategoryForm from "../categories/CategoryForm"
// import ClientForm from "../clients/ClientForm"
// import Clients from "../clients/Clients"
// import MethodPayments from "../methodPayments/MethodPayments"
// import MethodPaymentForm from "../methodPayments/MethodPaymentForm"
// import Debts from "../debts/Debts"
// import DebtForm from "../debts/DebtForm"
// import BarChart from "../reports/BarChart"
// import HistorySales from "../reports/HistorySales"
// import PageNotFound from "./PageNotFound"

const Home = () => {
  return (
    <>
      {import.meta.env.VITE_VERCEL_ENV === "development" && (
        <Box
          bgGradient="linear(to-r, blue.200, blue.500, blue.200)"
          w="100%"
          p={1}
          color="white"
          textAlign={"center"}
        >
          Sandbox Dev
        </Box>
      )}
      <Header />
      <Routes>
        <Route
          path="/assets"
          element={
            <Grid templateColumns="repeat(12, 1fr)" mb={10}>
              <GridItem
                as="main"
                colSpan={{ base: 10, md: 10, lg: 8 }}
                colStart={{ base: 2, md: 2, lg: 3 }}
                mb={10}
              >
                <Assets />
              </GridItem>
            </Grid>
          }
        />
        <Route path="/assets/add" element={<AssetForm />} />
        <Route path="/assets/:assetId/edit" element={<AssetForm />} />

        <Route
          path="/categories"
          element={
            <Grid templateColumns="repeat(12, 1fr)" mb={10}>
              <GridItem
                as="main"
                colSpan={{ base: 10, md: 10, lg: 8 }}
                colStart={{ base: 2, md: 2, lg: 3 }}
                mb={10}
              >
                <Categories />
              </GridItem>
            </Grid>
          }
        />
        <Route path="/categories/add" element={<CategoryForm />} />
        <Route path="/categories/:categoryId/edit" element={<CategoryForm />} />
      </Routes>
      {/*

        <Route
          path="/products/:productId/details"
          element={<ProductDetails />}
        />
        <Route
          path="/clients"
          element={
            <Grid templateColumns="repeat(12, 1fr)" mb={10}>
              <GridItem
                as="main"
                colSpan={{ base: 10, md: 10, lg: 8 }}
                colStart={{ base: 2, md: 2, lg: 3 }}
                mb={10}
              >
                <Clients />
              </GridItem>
            </Grid>
          }
        />
        <Route path="/clients/add" element={<ClientForm />} />
        <Route path="/clients/:clientId/edit" element={<ClientForm />} />

        <Route
          path="/methodPayments"
          element={
            <Grid templateColumns="repeat(12, 1fr)" mb={10}>
              <GridItem
                as="main"
                colSpan={{ base: 10, md: 10, lg: 8 }}
                colStart={{ base: 2, md: 2, lg: 3 }}
                mb={10}
              >
                <MethodPayments />
              </GridItem>
            </Grid>
          }
        />
        <Route path="/methodPayments/add" element={<MethodPaymentForm />} />
        <Route
          path="/methodPayments/:methodPaymentId/edit"
          element={<MethodPaymentForm />}
        />

        <Route
          path="/"
          element={
            <Grid templateColumns="repeat(12, 1fr)" mb={10}>
              <GridItem
                as="main"
                colSpan={{ base: 10, md: 10, lg: 8 }}
                colStart={{ base: 2, md: 2, lg: 3 }}
                mb={10}
              >
                <Sales />
              </GridItem>
            </Grid>
          }
        />
        <Route path="/add" element={<SaleForm />} />
        <Route path="/:saleId/edit" element={<SaleForm />} />
        <Route path="/:saleId/details" element={<SaleDetails />} />
        <Route
          path="/debts"
          element={
            <Grid templateColumns="repeat(12, 1fr)" mb={10}>
              <GridItem
                as="main"
                colSpan={{ base: 10, md: 10, lg: 8 }}
                colStart={{ base: 2, md: 2, lg: 3 }}
                mb={10}
              >
                <Debts />
              </GridItem>
            </Grid>
          }
        />
        <Route path="/debts/add" element={<DebtForm />} />
        <Route path="/debts/:debtId/edit" element={<DebtForm />} />
        <Route
          path="/reports"
          element={
            <Grid templateColumns="repeat(12, 1fr)" mb={10} mt={10}>
              <GridItem
                as="main"
                colSpan={{ base: 10, md: 10, lg: 8 }}
                colStart={{ base: 2, md: 2, lg: 3 }}
                mb={10}
              >
                <BarChart />
              </GridItem>
            </Grid>
          }
        />
        <Route
          path="/products-sold"
          element={
            <Grid templateColumns="repeat(12, 1fr)" mb={10} mt={10}>
              <GridItem
                as="main"
                colSpan={{ base: 10, md: 10, lg: 8 }}
                colStart={{ base: 2, md: 2, lg: 3 }}
                mb={10}
              >
                <Card variant="outline" mb={3}>
                  <CardBody>
                    <HistorySales />
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          }
        />
        <Route
          path="/*"
          element={
            <Grid templateColumns="repeat(12, 1fr)" mb={10} mt={10}>
              <GridItem
                as="main"
                colSpan={{ base: 10, md: 10, lg: 8 }}
                colStart={{ base: 2, md: 2, lg: 3 }}
                mb={10}
              >
                <PageNotFound />
              </GridItem>
            </Grid>
          }
        />
      </Routes> */}
    </>
  )
}

export default Home
