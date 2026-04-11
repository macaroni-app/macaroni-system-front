import {
  AddIcon,
  CalendarIcon,
  HamburgerIcon,
  InfoIcon,
  RepeatIcon,
} from "@chakra-ui/icons"
import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"

import { useLocation, useNavigate } from "react-router-dom"
import { useLogout } from "../../hooks/useLogout"
import { useCheckRole } from "../../hooks/useCheckRole"

import { useAuthContext } from "../../hooks/useAuthContext"
import { IUserContext } from "../../context/types"
import ProfileBase from "./permissions"

type NavigationItem = {
  label: string
  path: string
  permission: number[]
}

const navigationItems: NavigationItem[] = [
  {
    label: "Informes",
    path: "/",
    permission: ProfileBase.home.view,
  },
  {
    label: "Nueva venta",
    path: "/sales/add",
    permission: ProfileBase.sales.create,
  },
  {
    label: "Ventas",
    path: "/sales",
    permission: ProfileBase.sales.view,
  },
  {
    label: "Nuevo pedido",
    path: "/orderRequests/add",
    permission: ProfileBase.orderRequests.create,
  },
  {
    label: "Pedidos",
    path: "/orderRequests",
    permission: ProfileBase.orderRequests.view,
  },
  {
    label: "Productos",
    path: "/products",
    permission: ProfileBase.products.view,
  },
  {
    label: "Insumos",
    path: "/assets",
    permission: ProfileBase.assets.view,
  },
  {
    label: "Inventarios",
    path: "/inventories",
    permission: ProfileBase.inventories.view,
  },
  {
    label: "Historial inventario",
    path: "/inventoryTransactions",
    permission: ProfileBase.inventoryTransactions.view,
  },
  {
    label: "Categorias",
    path: "/categories",
    permission: ProfileBase.categories.view,
  },
  {
    label: "Tipos de productos",
    path: "/productTypes",
    permission: ProfileBase.productTypes.view,
  },
  {
    label: "Clientes",
    path: "/clients",
    permission: ProfileBase.clients.view,
  },
  {
    label: "Métodos de pagos",
    path: "/paymentMethods",
    permission: ProfileBase.paymentMethods.view,
  },
  {
    label: "Gastos fijos",
    path: "/fixedCosts",
    permission: ProfileBase.fixedCosts.view,
  },
  {
    label: "Negocios",
    path: "/businesses",
    permission: ProfileBase.businesses.view,
  },
  {
    label: "Usuarios",
    path: "/users",
    permission: ProfileBase.users.view,
  },
]

const HeaderMenu = (): JSX.Element => {
  const navigate = useNavigate()
  const location = useLocation()
  const drawer = useDisclosure()

  const { auth } = useAuthContext() as IUserContext
  const { logout } = useLogout()
  const { checkRole } = useCheckRole()

  const surfaceColor = useColorModeValue("white", "gray.900")
  const borderColor = useColorModeValue("gray.200", "gray.700")
  const inactiveColor = useColorModeValue("gray.600", "gray.300")
  const mobileSurface = useColorModeValue(
    "rgba(255, 255, 255, 0.96)",
    "gray.900"
  )

  const allowedItems = navigationItems.filter((item) =>
    checkRole(item.permission)
  )
  const hiddenDesktopPaths = ["/sales/add", "/orderRequests/add"]
  const desktopItems = allowedItems.filter(
    (item) => !hiddenDesktopPaths.includes(item.path)
  )
  const mobileDrawerItems = allowedItems.filter(
    (item) => !hiddenDesktopPaths.includes(item.path)
  )
  const desktopPrimaryItems = desktopItems.slice(0, 5)
  const desktopSecondaryItems = desktopItems.slice(5)
  const activeItemPath = [...allowedItems]
    .sort((current, next) => next.path.length - current.path.length)
    .find((item) => {
      if (item.path === "/") return location.pathname === item.path
      return (
        location.pathname === item.path ||
        location.pathname.startsWith(`${item.path}/`)
      )
    })?.path

  const handleLogout = async () => {
    await logout()
    drawer.onClose()
    navigate("/login")
  }

  const goTo = (path: string) => {
    drawer.onClose()
    navigate(path)
  }

  const isActive = (path: string) => {
    return activeItemPath === path
  }
  const hasActiveSecondaryItem = desktopSecondaryItems.some((item) =>
    isActive(item.path)
  )
  const isUserProfileActive = location.pathname === `/users/${auth.id}/details`
  const isMoreActive = hasActiveSecondaryItem || isUserProfileActive
  const canCreateSale = checkRole(ProfileBase.sales.create)
  const isCreateSaleActive = isActive("/sales/add")
  const isMobileMenuActive =
    drawer.isOpen ||
    isUserProfileActive ||
    allowedItems.some((item) => {
      return (
        !["/", "/sales", "/orderRequests", "/sales/add"].includes(item.path) &&
        isActive(item.path)
      )
    })

  const renderNavButton = (item: NavigationItem) => {
    const active = isActive(item.path)

    return (
      <Button
        key={item.path}
        size="sm"
        variant={active ? "solid" : "ghost"}
        colorScheme={active ? "purple" : "gray"}
        color={active ? undefined : inactiveColor}
        onClick={() => goTo(item.path)}
        whiteSpace="nowrap"
      >
        {item.label}
      </Button>
    )
  }

  const renderDrawerButton = (item: NavigationItem) => {
    const active = isActive(item.path)

    return (
      <Button
        key={item.path}
        justifyContent="flex-start"
        minH="44px"
        size="md"
        variant={active ? "solid" : "ghost"}
        colorScheme={active ? "purple" : "gray"}
        onClick={() => goTo(item.path)}
      >
        {item.label}
      </Button>
    )
  }

  const renderMobileTab = (
    label: string,
    path: string,
    icon: typeof InfoIcon
  ) => {
    const active = isActive(path)

    return (
      <Button
        flex={1}
        minW={0}
        h="58px"
        px={1}
        borderRadius="18px"
        variant={active ? "solid" : "ghost"}
        colorScheme={active ? "purple" : "gray"}
        color={active ? undefined : inactiveColor}
        onClick={() => goTo(path)}
      >
        <VStack spacing={1}>
          <Icon as={icon} boxSize={4} />
          <Text fontSize="10px" fontWeight="bold" lineHeight={1} noOfLines={1}>
            {label}
          </Text>
        </VStack>
      </Button>
    )
  }

  return (
    <>
      <Flex
        display={{ base: "none", md: "flex" }}
        alignItems="center"
        gap={2}
        flexWrap="nowrap"
        justifyContent="flex-end"
        w="100%"
      >
        {desktopPrimaryItems.map(renderNavButton)}
        <Menu>
          <MenuButton
            as={Button}
            size="sm"
            variant={isMoreActive ? "solid" : "outline"}
            colorScheme={isMoreActive ? "purple" : "gray"}
            rightIcon={<HamburgerIcon />}
            whiteSpace="nowrap"
          >
            Más
          </MenuButton>
          <MenuList>
            {desktopSecondaryItems.length > 0 && (
              <>
                {desktopSecondaryItems.map((item) => (
                  <MenuItem key={item.path} onClick={() => goTo(item.path)}>
                    {item.label}
                  </MenuItem>
                ))}
                <MenuDivider />
              </>
            )}
            <MenuItem onClick={() => goTo(`/users/${auth.id}/details`)}>
              {auth.firstName} {auth.lastName}
            </MenuItem>
            <MenuItem onClick={() => handleLogout()}>Salir</MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <Box display={{ base: "block", md: "none" }}>
        <HStack
          position="fixed"
          left={3}
          right={3}
          bottom={3}
          zIndex="docked"
          spacing={1}
          maxW="420px"
          mx="auto"
          bg={mobileSurface}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="24px"
          boxShadow="0 16px 40px rgba(15, 23, 42, 0.2)"
          px={2}
          py={2}
          justifyContent="space-between"
        >
          {renderMobileTab("Inicio", "/", InfoIcon)}
          {renderMobileTab("Ventas", "/sales", RepeatIcon)}
          {canCreateSale && (
            <Button
              aria-label="Crear nueva venta"
              flex={1}
              minW={0}
              h="58px"
              px={1}
              borderRadius="18px"
              variant="ghost"
              onClick={() => goTo("/sales/add")}
            >
              <Flex
                alignItems="center"
                justifyContent="center"
                w="46px"
                h="46px"
                borderRadius="full"
                bg="purple.500"
                color="white"
                boxShadow="0 14px 30px rgba(128, 90, 213, 0.35)"
                transform={isCreateSaleActive ? "translateY(-2px)" : undefined}
              >
                <AddIcon boxSize={4} />
              </Flex>
            </Button>
          )}
          {renderMobileTab("Pedidos", "/orderRequests", CalendarIcon)}
          <Button
            flex={1}
            minW={0}
            h="58px"
            px={1}
            borderRadius="18px"
            colorScheme={isMobileMenuActive ? "purple" : "gray"}
            color={isMobileMenuActive ? undefined : inactiveColor}
            variant={isMobileMenuActive ? "solid" : "ghost"}
            onClick={drawer.onOpen}
          >
            <VStack spacing={1}>
              <HamburgerIcon boxSize={4} />
              <Text
                fontSize="10px"
                fontWeight="bold"
                lineHeight={1}
                noOfLines={1}
              >
                Más
              </Text>
            </VStack>
          </Button>
        </HStack>

        <Drawer
          isOpen={drawer.isOpen}
          placement="bottom"
          onClose={drawer.onClose}
        >
          <DrawerOverlay />
          <DrawerContent
            borderTopRadius="28px"
            bg={surfaceColor}
            pb="calc(env(safe-area-inset-bottom) + 16px)"
          >
            <DrawerCloseButton />
            <DrawerHeader pt={6}>Más opciones</DrawerHeader>
            <DrawerBody>
              <VStack alignItems="stretch" spacing={4}>
                <SimpleGrid columns={2} spacing={2}>
                  {mobileDrawerItems.map(renderDrawerButton)}
                </SimpleGrid>

                <Divider />

                <VStack alignItems="stretch" spacing={2}>
                  <Button
                    justifyContent="flex-start"
                    minH="44px"
                    variant={
                      isActive(`/users/${auth.id}/details`) ? "solid" : "ghost"
                    }
                    colorScheme={
                      isActive(`/users/${auth.id}/details`)
                        ? "purple"
                        : "gray"
                    }
                    onClick={() => goTo(`/users/${auth.id}/details`)}
                  >
                    {auth.firstName} {auth.lastName}
                  </Button>
                  <Button
                    justifyContent="flex-start"
                    minH="44px"
                    variant="outline"
                    onClick={() => handleLogout()}
                  >
                    Salir
                  </Button>
                </VStack>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    </>
  )
}

export default HeaderMenu
