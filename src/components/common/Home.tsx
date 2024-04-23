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
import Sales from "../sales/Sales"
import SaleForm from "../sales/SaleForm"
import Assets from "../assets/Assets"
import AssetForm from "../assets/AssetForm"
import ProductTypes from "../productTypes/ProductTypes"
import ProductTypeForm from "../productTypes/ProductTypeForm"
import ProductDetails from "../products/ProductDetails"
import Products from "../products/Products"
import ProductForm from "../products/ProductForm"
import Inventories from "../inventories/Inventories"
import InventoryForm from "../inventories/InventoryForm"
import InventoryTransactions from "../inventoryTransactions/InventoryTransactions"
import InventoryTransactionForm from "../inventoryTransactions/InventoryTransactionForm"
import Categories from "../categories/Categories"
import CategoryForm from "../categories/CategoryForm"
import Clients from "../clients/Clients"
import ClientForm from "../clients/ClientForm"
import PaymentMethods from "../paymentMethods/PaymentMethods"
import PaymentMethodForm from "../paymentMethods/PaymentMethodForm"
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
          path="/sales"
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
        <Route path="/sales/add" element={<SaleForm />} />
        {/* <Route path="/sales/:saleId/edit" element={<ProductForm />} />
        <Route path="/sales/:saleId/details" element={<ProductDetails />} /> */}
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
        <Route
          path="/productTypes"
          element={
            <Grid templateColumns="repeat(12, 1fr)" mb={10}>
              <GridItem
                as="main"
                colSpan={{ base: 10, md: 10, lg: 8 }}
                colStart={{ base: 2, md: 2, lg: 3 }}
                mb={10}
              >
                <ProductTypes />
              </GridItem>
            </Grid>
          }
        />
        <Route path="/productTypes/add" element={<ProductTypeForm />} />
        <Route
          path="/productTypes/:productTypeId/edit"
          element={<ProductTypeForm />}
        />

        <Route
          path="/products"
          element={
            <Grid templateColumns="repeat(12, 1fr)" mb={10}>
              <GridItem
                as="main"
                colSpan={{ base: 10, md: 10, lg: 8 }}
                colStart={{ base: 2, md: 2, lg: 3 }}
                mb={10}
              >
                <Products />
              </GridItem>
            </Grid>
          }
        />
        <Route path="/products/add" element={<ProductForm />} />
        <Route path="/products/:productId/edit" element={<ProductForm />} />
        <Route
          path="/products/:productId/details"
          element={<ProductDetails />}
        />
        <Route
          path="/inventories"
          element={
            <Grid templateColumns="repeat(12, 1fr)" mb={10}>
              <GridItem
                as="main"
                colSpan={{ base: 10, md: 10, lg: 8 }}
                colStart={{ base: 2, md: 2, lg: 3 }}
                mb={10}
              >
                <Inventories />
              </GridItem>
            </Grid>
          }
        />
        <Route path="/inventories/add" element={<InventoryForm />} />
        <Route
          path="/inventories/:inventoryId/edit"
          element={<InventoryForm />}
        />
        <Route
          path="/inventoryTransactions"
          element={
            <Grid templateColumns="repeat(12, 1fr)" mb={10}>
              <GridItem
                as="main"
                colSpan={{ base: 10, md: 10, lg: 8 }}
                colStart={{ base: 2, md: 2, lg: 3 }}
                mb={10}
              >
                <InventoryTransactions />
              </GridItem>
            </Grid>
          }
        />
        <Route
          path="/inventoryTransactions/add"
          element={<InventoryTransactionForm />}
        />
        <Route
          path="/inventoryTransactions/:inventoryTransactionId/edit"
          element={<InventoryTransactionForm />}
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
          path="/paymentMethods"
          element={
            <Grid templateColumns="repeat(12, 1fr)" mb={10}>
              <GridItem
                as="main"
                colSpan={{ base: 10, md: 10, lg: 8 }}
                colStart={{ base: 2, md: 2, lg: 3 }}
                mb={10}
              >
                <PaymentMethods />
              </GridItem>
            </Grid>
          }
        />
        <Route path="/paymentMethods/add" element={<PaymentMethodForm />} />
        <Route
          path="/paymentMethods/:paymentMethodId/edit"
          element={<PaymentMethodForm />}
        />
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
