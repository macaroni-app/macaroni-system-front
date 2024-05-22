import { ROLES } from "./roles";

const ProfileBase = {
  sales: {
    create: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER],
    edit: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER]
  },
  products: {
    create: [ROLES.ADMIN, ROLES.SUPERVISOR],
    edit: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER]
  },
  assets: {
    create: [ROLES.ADMIN],
    edit: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER]
  },
  inventories: {
    create: [ROLES.ADMIN],
    edit: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER]
  },
  inventoryTransactions: {
    create: [ROLES.ADMIN],
    edit: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER]
  },
  categories: {
    create: [ROLES.ADMIN],
    edit: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.SUPERVISOR]
  },
  productTypes: {
    create: [ROLES.ADMIN],
    edit: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.SUPERVISOR]
  },
  clients: {
    create: [ROLES.ADMIN],
    edit: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.SUPERVISOR]
  },
  paymentMethods: {
    create: [ROLES.ADMIN],
    edit: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.SUPERVISOR]
  }
}

export default ProfileBase