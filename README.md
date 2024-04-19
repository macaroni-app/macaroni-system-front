# Macaroni Web App

## Testear

### Authentication

- [x] Login an user.
- [ ] Access Token.
- [ ] Refresh Token.
- [ ] Register an user.

### Product Types

- [ ] Insert product type.
- [ ] Update product type.
- [ ] Delete product type: it should deactivate the product type, but not hard delete.

### Categories

- [ ] Insert category.
- [ ] Update category.
- [ ] Delete category: it should deactivate the category, but not hard delete.

### Assets

- [ ] Insert asset.
- [ ] Update asset.
- [ ] Delete asset: it should deactivate the asset, but not hard delete.

### Products

- [ ] Insert product: should insert a product with almost one product item else do not allow it.
- [ ] Update product: should update a product with almost one product item else do not allow it.
- [ ] Delete product: should deactivate the product with all its product items, but not hard delete.

### Ventas

- [ ] Insert sale: should insert a sale with almost one sale item else do not allow it.

#### Acciones que debería hacer cuando se crea una venta:

- Actualizar el inventario de cada insumo que contiene la venta.
- Registrar las transacciones correspondientes de cada insumo.
