import { HamburgerIcon } from "@chakra-ui/icons"
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  // MenuItemOption,
  // MenuGroup,
  // MenuOptionGroup,
  MenuDivider,
  IconButton,
} from "@chakra-ui/react"

import { useNavigate } from "react-router-dom"
import { useLogout } from "../../hooks/useLogout"
import { useCheckRole } from "../../hooks/useCheckRole"

import { ROLES } from "../common/roles"
import { useAuthContext } from "../../hooks/useAuthContext"
import { IUserContext } from "../../context/types"
import ProfileBase from "./permissions"

const HeaderMenu = (): JSX.Element => {
  const navigate = useNavigate()

  const { auth } = useAuthContext() as IUserContext

  const { logout } = useLogout()

  const { checkRole } = useCheckRole()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="outline"
      />
      <MenuList padding={0}>
        {checkRole(ProfileBase.sales.create) && (
          <MenuItem onClick={() => navigate("/sales/add")}>
            Nueva venta
          </MenuItem>
        )}
        {checkRole(ProfileBase.sales.view) && (
          <MenuItem onClick={() => navigate("/sales")}>Ventas</MenuItem>
        )}
        {checkRole(ProfileBase.products.view) && (
          <MenuItem onClick={() => navigate("/products")}>Productos</MenuItem>
        )}
        {checkRole(ProfileBase.assets.view) && (
          <MenuItem onClick={() => navigate("/assets")}>Insumos</MenuItem>
        )}
        {checkRole(ProfileBase.inventories.view) && (
          <MenuItem onClick={() => navigate("/inventories")}>
            Inventarios
          </MenuItem>
        )}
        {checkRole(ProfileBase.inventoryTransactions.view) && (
          <MenuItem onClick={() => navigate("/inventoryTransactions")}>
            Historial inventario
          </MenuItem>
        )}
        {checkRole([ROLES.ADMIN, ROLES.SUPERVISOR]) && <MenuDivider />}
        {checkRole(ProfileBase.categories.view) && (
          <MenuItem onClick={() => navigate("/categories")}>
            Categorias
          </MenuItem>
        )}
        {checkRole(ProfileBase.productTypes.view) && (
          <MenuItem onClick={() => navigate("/productTypes")}>
            Tipos de productos
          </MenuItem>
        )}
        {checkRole(ProfileBase.clients.view) && (
          <MenuItem onClick={() => navigate("/clients")}>Clientes</MenuItem>
        )}
        {checkRole(ProfileBase.paymentMethods.view) && (
          <MenuItem onClick={() => navigate("/paymentMethods")}>
            Métodos de pagos
          </MenuItem>
        )}

        <MenuDivider />
        <MenuItem>
          {auth.firstName} {auth.lastName}
        </MenuItem>
        <MenuItem onClick={() => handleLogout()}>Salir</MenuItem>
      </MenuList>
    </Menu>
  )
}

export default HeaderMenu
