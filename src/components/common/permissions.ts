import { ROLES } from "./roles";

const ProfileBase = {
  routes: {
    view: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER]
  },
  home: {
    view: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER],
  },
  dashboard: {
    stockTab: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER],
    stats: [ROLES.ADMIN, ROLES.SUPERVISOR]
  },
  sales: {
    create: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER],
    edit: [ROLES.ADMIN],
    cancel: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER],
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER],
    viewActions: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER]
  },
  products: {
    create: [ROLES.ADMIN, ROLES.SUPERVISOR],
    edit: [ROLES.ADMIN, ROLES.SUPERVISOR],
    deactivate: [ROLES.ADMIN, ROLES.SUPERVISOR],
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER],
    viewActions: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER]
  },
  assets: {
    create: [ROLES.ADMIN, ROLES.SUPERVISOR],
    edit: [ROLES.ADMIN, ROLES.SUPERVISOR],
    deactivate: [ROLES.ADMIN, ROLES.SUPERVISOR],
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER],
    viewActions: [ROLES.ADMIN, ROLES.SUPERVISOR]
  },
  inventories: {
    create: [ROLES.ADMIN, ROLES.SUPERVISOR],
    edit: [ROLES.ADMIN],
    deactivate: [ROLES.ADMIN, ROLES.SUPERVISOR],
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER],
    viewActions: [ROLES.ADMIN]
  },
  inventoryTransactions: {
    create: [ROLES.ADMIN, ROLES.SUPERVISOR],
    edit: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER],
    viewActions: [ROLES.ADMIN]
  },
  categories: {
    create: [ROLES.ADMIN, ROLES.SUPERVISOR],
    edit: [ROLES.ADMIN],
    deactivate: [ROLES.ADMIN, ROLES.SUPERVISOR],
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.SUPERVISOR],
    viewActions: [ROLES.ADMIN, ROLES.SUPERVISOR]
  },
  productTypes: {
    create: [ROLES.ADMIN, ROLES.SUPERVISOR],
    edit: [ROLES.ADMIN],
    deactivate: [ROLES.ADMIN, ROLES.SUPERVISOR],
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.SUPERVISOR],
    viewActions: [ROLES.ADMIN, ROLES.SUPERVISOR]
  },
  clients: {
    create: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER],
    edit: [ROLES.ADMIN],
    deactivate: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER],
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER],
    viewActions: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER]
  },
  fixedCosts: {
    create: [ROLES.ADMIN, ROLES.SUPERVISOR],
    edit: [ROLES.ADMIN, ROLES.SUPERVISOR],
    deactivate: [ROLES.ADMIN, ROLES.SUPERVISOR],
    delete: [ROLES.ADMIN, ROLES.SUPERVISOR],
    view: [ROLES.ADMIN, ROLES.SUPERVISOR],
    viewActions: [ROLES.ADMIN, ROLES.SUPERVISOR]
  },
  paymentMethods: {
    create: [ROLES.ADMIN, ROLES.SUPERVISOR],
    edit: [ROLES.ADMIN],
    deactivate: [ROLES.ADMIN, ROLES.SUPERVISOR],
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN, ROLES.SUPERVISOR],
    viewActions: [ROLES.ADMIN, ROLES.SUPERVISOR]
  },
  users: {
    create: [ROLES.ADMIN],
    edit: [ROLES.ADMIN],
    editOwnInfo: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER],
    deactivate: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN],
    viewDetails: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER],
    viewActions: [ROLES.ADMIN],
  }
}

export default ProfileBase