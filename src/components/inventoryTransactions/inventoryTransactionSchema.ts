import {z} from "zod"


export const TRANSACTION_TYPE = ['UP', 'DOWN'] as const
export const TRANSACTION_REASON = ['BUY', 'SELL', 'RETURN', 'ADJUSTMENT', 'DONATION', 'DEFEATED', 'LOSS', 'INTERNAL_USAGE'] as const


const inventoryTransactions = z.object({
  asset: z.string(),
  transactionReason: z.string(),
  transactionType: z.string(),
  affectedAmount: z.number().nonnegative(),
  oldQuantityAvailable: z.number().nonnegative().optional(),
  currentQuantityAvailable: z.number().nonnegative().optional(),
  unitCost: z.number().nonnegative().optional(),
  id: z.string().optional()
})

export const inventoryTransactionSchema = z.object({
  _id: z.string().optional(),
  asset: z.string({ required_error: "Complete el campo", invalid_type_error: "Complete el campo"}).min(24, "Seleccione una opción").max(24),
  transactionType: z.enum(TRANSACTION_TYPE),
  transactionReason: z.enum(TRANSACTION_REASON),
  affectedAmount: z.number().nonnegative(),
  oldQuantityAvailable: z.number().nonnegative().optional(),
  currentQuantityAvailable: z.number().nonnegative().optional(),
  unitCost: z.number().nonnegative().optional(),
  isDeleted: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  createdBy: z.string().min(24).max(24).optional(),
  updatedBy: z.string().min(24).max(24).optional()
})

export const inventoryTransactionBulkSchema = z.object({
  inventoryTransactions: z.array(inventoryTransactions),
})