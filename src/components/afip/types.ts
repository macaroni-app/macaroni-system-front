export interface IInvoice  {
  saleId?: string
  sale?: string
  cuit?: string
  totalAmount?: number
  pointOfSale?: number
  invoiceType?: number
  concept?: number
  documentType?: string
  documentNumber?: number
  invoiceNumber?: number
  cbteFch?: string
  cae?: string
  expirationDate?: string
  condicionIVAReceptorId?: string
}