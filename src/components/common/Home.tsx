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
import Users from "../users/Users"
import UserForm from "../users/UserForm"
import UserDetails from "../users/UserDetails"
import UserNewPasswordForm from "../users/UserNewPassword"
import Dashboard from "../dashboard/Dashboard"
import FixedCosts from "../fixedCosts/FixedCosts"
import FixedCostForm from "../fixedCosts/FixedCostForm"
// import Unauthorized from "./Unauthorized"
import PageNotFound from "./PageNotFound"

import ProfileBase from "./permissions"

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
        {/* HOME */}
        <Route
          element={<ProtectedRoute allowedRoles={ProfileBase.sales.view} />}
        >
          <Route
            path="/"
            element={
              <Grid templateColumns="repeat(12, 1fr)" mb={10} mt={5}>
                <GridItem
                  as="main"
                  colSpan={{ base: 10, md: 10, lg: 8 }}
                  colStart={{ base: 2, md: 2, lg: 3 }}
                  mb={10}
                >
                  <Dashboard />
                </GridItem>
              </Grid>
            }
          />
        </Route>
        {/* SALES */}
        <Route
          element={<ProtectedRoute allowedRoles={ProfileBase.sales.view} />}
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
        </Route>
        <Route
          element={<ProtectedRoute allowedRoles={ProfileBase.sales.create} />}
        >
          <Route path="/sales/add" element={<SaleForm />} />
        </Route>
        <Route
          element={<ProtectedRoute allowedRoles={ProfileBase.sales.view} />}
        >
          <Route path="/sales/:saleId/details" element={<SaleDetails />} />
        </Route>

        {/* PRODUCTS */}
        <Route
          element={<ProtectedRoute allowedRoles={ProfileBase.products.view} />}
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
        </Route>
        <Route
          element={<ProtectedRoute allowedRoles={ProfileBase.products.view} />}
        >
          <Route
            path="/products/:productId/details"
            element={<ProductDetails />}
          />
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={ProfileBase.products.create} />
          }
        >
          <Route path="/products/add" element={<ProductForm />} />
        </Route>
        <Route
          element={<ProtectedRoute allowedRoles={ProfileBase.products.edit} />}
        >
          <Route path="/products/:productId/edit" element={<ProductForm />} />
        </Route>

        {/* ASSETS */}
        <Route
          element={<ProtectedRoute allowedRoles={ProfileBase.assets.view} />}
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
          element={<ProtectedRoute allowedRoles={ProfileBase.assets.create} />}
        >
          <Route path="/assets/add" element={<AssetForm />} />
        </Route>
        <Route
          element={<ProtectedRoute allowedRoles={ProfileBase.assets.edit} />}
        >
          <Route path="/assets/:assetId/edit" element={<AssetForm />} />
        </Route>

        {/* CATEGORIES */}
        <Route
          element={
            <ProtectedRoute allowedRoles={ProfileBase.categories.view} />
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
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={ProfileBase.categories.create} />
          }
        >
          <Route path="/categories/add" element={<CategoryForm />} />
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={ProfileBase.categories.edit} />
          }
        >
          <Route
            path="/categories/:categoryId/edit"
            element={<CategoryForm />}
          />
        </Route>

        {/* PRODUCT_TYPES */}
        <Route
          element={
            <ProtectedRoute allowedRoles={ProfileBase.productTypes.view} />
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
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={ProfileBase.productTypes.create} />
          }
        >
          <Route path="/productTypes/add" element={<ProductTypeForm />} />
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={ProfileBase.productTypes.edit} />
          }
        >
          <Route
            path="/productTypes/:productTypeId/edit"
            element={<ProductTypeForm />}
          />
        </Route>

        {/* INVENTORIES */}
        <Route
          element={
            <ProtectedRoute allowedRoles={ProfileBase.inventories.view} />
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
            <ProtectedRoute allowedRoles={ProfileBase.inventories.create} />
          }
        >
          <Route path="/inventories/add" element={<InventoryForm />} />
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={ProfileBase.inventories.edit} />
          }
        >
          <Route
            path="/inventories/:inventoryId/edit"
            element={<InventoryForm />}
          />
        </Route>

        {/* INVENTORY TRANSACTIONS */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={ProfileBase.inventoryTransactions.view}
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
            <ProtectedRoute
              allowedRoles={ProfileBase.inventoryTransactions.create}
            />
          }
        >
          <Route
            path="/inventoryTransactions/add"
            element={<InventoryTransactionForm />}
          />
        </Route>
        <Route
          element={
            <ProtectedRoute
              allowedRoles={ProfileBase.inventoryTransactions.edit}
            />
          }
        >
          <Route
            path="/inventoryTransactions/:inventoryTransactionId/edit"
            element={<InventoryTransactionForm />}
          />
        </Route>

        {/* CLIENTS */}
        <Route
          element={<ProtectedRoute allowedRoles={ProfileBase.clients.view} />}
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
          element={<ProtectedRoute allowedRoles={ProfileBase.clients.create} />}
        >
          <Route path="/clients/add" element={<ClientForm />} />
        </Route>
        <Route
          element={<ProtectedRoute allowedRoles={ProfileBase.clients.edit} />}
        >
          <Route path="/clients/:clientId/edit" element={<ClientForm />} />
        </Route>

        {/* PAYMENT_METHODS */}
        <Route
          element={
            <ProtectedRoute allowedRoles={ProfileBase.paymentMethods.view} />
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
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={ProfileBase.paymentMethods.create} />
          }
        >
          <Route path="/paymentMethods/add" element={<PaymentMethodForm />} />
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={ProfileBase.paymentMethods.edit} />
          }
        >
          <Route
            path="/paymentMethods/:paymentMethodId/edit"
            element={<PaymentMethodForm />}
          />
        </Route>

        {/* FIXED_COSTS */}
        <Route
          element={
            <ProtectedRoute allowedRoles={ProfileBase.fixedCosts.view} />
          }
        >
          <Route
            path="/fixedCosts"
            element={
              <Grid templateColumns="repeat(12, 1fr)" mb={10}>
                <GridItem
                  as="main"
                  colSpan={{ base: 10, md: 10, lg: 8 }}
                  colStart={{ base: 2, md: 2, lg: 3 }}
                  mb={10}
                >
                  <FixedCosts />
                </GridItem>
              </Grid>
            }
          />
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={ProfileBase.fixedCosts.create} />
          }
        >
          <Route path="/fixedCosts/add" element={<FixedCostForm />} />
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={ProfileBase.fixedCosts.edit} />
          }
        >
          <Route
            path="/fixedCosts/:fixedCostId/edit"
            element={<FixedCostForm />}
          />
        </Route>

        {/* USERS */}
        <Route
          element={<ProtectedRoute allowedRoles={ProfileBase.users.view} />}
        >
          <Route
            path="/users"
            element={
              <Grid templateColumns="repeat(12, 1fr)" mb={10}>
                <GridItem
                  as="main"
                  colSpan={{ base: 10, md: 10, lg: 8 }}
                  colStart={{ base: 2, md: 2, lg: 3 }}
                  mb={10}
                >
                  <Users />
                </GridItem>
              </Grid>
            }
          />
        </Route>
        <Route
          element={<ProtectedRoute allowedRoles={ProfileBase.users.create} />}
        >
          <Route path="/users/add" element={<UserForm />} />
        </Route>
        <Route
          element={<ProtectedRoute allowedRoles={ProfileBase.users.edit} />}
        >
          <Route path="/users/:userId/edit" element={<UserForm />} />
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={ProfileBase.users.viewDetails} />
          }
        >
          <Route path="/users/:userId/details" element={<UserDetails />} />
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={ProfileBase.users.editOwnInfo} />
          }
        >
          <Route
            path="/users/:userId/new-password"
            element={<UserNewPasswordForm />}
          />
        </Route>

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

        {/* UNAUTHORIZED */}
        <Route path="/notFound" element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default Home
