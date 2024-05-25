import { ROLES } from "./roles";

const ProfileBase = {
  routes: {
    view: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER]
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
    deactivate: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
    view: [ROLES.ADMIN],
    viewActions: [ROLES.ADMIN],
  }
}

export default ProfileBase