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
import SaleDetails from "../sales/SaleDetails"
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
import ProtectedRoute from "../auth/ProtectedRoute"
import Unauthorized from "./Unauthorized"
import { ROLES } from "./roles"
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
        {/* SALES */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER]}
            />
          }
        >
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
          <Route path="/sales/:saleId/details" element={<SaleDetails />} />
        </Route>
        {/* ASSETS */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER]}
            />
          }
        >
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
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR]} />
          }
        >
          <Route path="/assets/add" element={<AssetForm />} />
          <Route path="/assets/:assetId/edit" element={<AssetForm />} />
        </Route>
        {/* CATEGORIES */}
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR]} />
          }
        >
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
          <Route
            path="/categories/:categoryId/edit"
            element={<CategoryForm />}
          />
        </Route>
        {/* PRODUCT_TYPES */}
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR]} />
          }
        >
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
        </Route>
        {/* PRODUCTS */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER]}
            />
          }
        >
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
          <Route
            path="/products/:productId/details"
            element={<ProductDetails />}
          />
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR]} />
          }
        >
          <Route path="/products/add" element={<ProductForm />} />
          <Route path="/products/:productId/edit" element={<ProductForm />} />
        </Route>
        {/* INVENTORIES */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER]}
            />
          }
        >
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
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR]} />
          }
        >
          <Route path="/inventories/add" element={<InventoryForm />} />
          <Route
            path="/inventories/:inventoryId/edit"
            element={<InventoryForm />}
          />
        </Route>
        {/* INVENTORY TRANSACTIONS */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER]}
            />
          }
        >
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
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR]} />
          }
        >
          <Route
            path="/inventoryTransactions/add"
            element={<InventoryTransactionForm />}
          />
          <Route
            path="/inventoryTransactions/:inventoryTransactionId/edit"
            element={<InventoryTransactionForm />}
          />
        </Route>
        {/* CLIENTS */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER]}
            />
          }
        >
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
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR]} />
          }
        >
          <Route path="/clients/add" element={<ClientForm />} />
          <Route path="/clients/:clientId/edit" element={<ClientForm />} />
        </Route>
        {/* PAYMENT_METHODS */}
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR]} />
          }
        >
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
        </Route>
        {/* UNAUTHORIZED */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </>
  )
}

export default Home
