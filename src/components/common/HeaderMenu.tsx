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
        {checkRole([ROLES.ADMIN, ROLES.SELLER]) && (
          <MenuItem onClick={() => navigate("/sales/add")}>
            Nueva venta
          </MenuItem>
        )}
        {checkRole([ROLES.ADMIN, ROLES.SELLER]) && (
          <MenuItem onClick={() => navigate("/sales")}>Ventas</MenuItem>
        )}
        {checkRole([ROLES.ADMIN, ROLES.SELLER]) && (
          <MenuItem onClick={() => navigate("/products")}>Productos</MenuItem>
        )}
        {checkRole([ROLES.ADMIN, ROLES.SELLER]) && (
          <MenuItem onClick={() => navigate("/assets")}>Insumos</MenuItem>
        )}
        {checkRole([ROLES.ADMIN, ROLES.SELLER]) && (
          <MenuItem onClick={() => navigate("/inventories")}>
            Inventarios
          </MenuItem>
        )}
        {checkRole([ROLES.ADMIN, ROLES.SELLER]) && (
          <MenuItem onClick={() => navigate("/inventoryTransactions")}>
            Historial inventario
          </MenuItem>
        )}
        {checkRole([ROLES.ADMIN]) && <MenuDivider />}
        {checkRole([ROLES.ADMIN]) && (
          <MenuItem onClick={() => navigate("/categories")}>
            Categorias
          </MenuItem>
        )}
        {checkRole([ROLES.ADMIN]) && (
          <MenuItem onClick={() => navigate("/productTypes")}>
            Tipos de productos
          </MenuItem>
        )}
        {checkRole([ROLES.ADMIN]) && (
          <MenuItem onClick={() => navigate("/clients")}>Clientes</MenuItem>
        )}
        {checkRole([ROLES.ADMIN]) && (
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
