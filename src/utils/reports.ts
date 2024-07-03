import { IAssetLessCategory } from "../components/assets/types";
import { IInventoryTransactionFullRelated } from "../components/inventoryTransactions/types";
import { ISaleFullRelated } from "../components/sales/types"

export type MonthData = {
  total: number;
  costCotal: number
  profit: number
  month: number;
  year: number;
  monthName: string;
};

export const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export const groupSalesByMonth = (sales: ISaleFullRelated[], numberOfMonths: number): MonthData[] => {
  const salesByMonth: { [key: string]: MonthData } = {};

  sales?.forEach(sale => {

    const year = new Date(String(sale.createdAt)).getFullYear();
    const month = new Date(String(sale.createdAt)).getMonth(); // 0-indexed
    const key = `${year}-${month}`;

    if (!salesByMonth[key]) {
      salesByMonth[key] = {
        total: 0,
        costCotal: 0,
        profit: 0,
        month: month + 1,
        year,
        monthName: monthNames[month]
      };
    }

    salesByMonth[key].total += Number(sale.total)
    salesByMonth[key].costCotal += Number(sale.costTotal)
  });

  const allMonths: MonthData[] = [];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  for (let i = numberOfMonths - 1; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${month}`;

    if (!salesByMonth[key]) {
      allMonths.push({
        total: 0,
        costCotal: 0,
        profit: 0,
        month: month + 1,
        year,
        monthName: monthNames[month]
      });
    } else {
      allMonths.push({...salesByMonth[key], profit: salesByMonth[key].total - salesByMonth[key].costCotal});
    }
  }

  return allMonths;
};

export type TransactionResult = {
  asset?: IAssetLessCategory
  transactionReason?: string
  affectedAmount?: number
  total?: number
  month?: string
}

interface Accumulator {
  [assetId: string]: {
    [transactionReason: string]: {
      [month: string]: number;
    }
  }
}

export const agruparYSumarTransaccionesPorMes = (inventoryTransactions: IInventoryTransactionFullRelated[]): TransactionResult[] => {

  if(inventoryTransactions !== undefined && inventoryTransactions.length > 0) {
    const resultado = inventoryTransactions?.reduce((acc, inventoryTransaction) => {
      const { asset, transactionReason, affectedAmount, createdAt } = inventoryTransaction;
      const month = new Date(String(createdAt)).toISOString().slice(0, 7); // Obtiene el año-mes en formato YYYY-MM
  
      let assetId = asset?._id as string
  
      if (!acc[assetId]) {
        acc[assetId] = {};
      }
  
      if (transactionReason !== undefined && !acc[assetId][transactionReason]) {
        acc[assetId][transactionReason] = {};
      }
  
      if (transactionReason !== undefined && !acc[assetId][transactionReason][month]) {
        acc[assetId][transactionReason][month] = 0;
      }
  
      acc[assetId][transactionReason !== undefined ? transactionReason : ''][month] += Number(affectedAmount)
  
      return acc
    }, {} as Accumulator) 
  
    const resultadoArray = Object?.entries(resultado)?.flatMap(([assetId, transactionsByReason]) => {
      return Object?.entries(transactionsByReason)?.flatMap(([transactionReason, transactionsByMonth]) => {
        return Object?.entries(transactionsByMonth)?.map(([month, affectedAmount]) => {
          let asset = inventoryTransactions?.find(inventoryTransaction => inventoryTransaction.asset?._id === assetId)?.asset
          return {
            asset,
            transactionReason,
            affectedAmount,
            total: Number(affectedAmount) * Number(asset?.costPrice),
            month
          };
        });
      });
    }) as TransactionResult[]
  
    return resultadoArray;
  }

  return [{asset: undefined, transactionReason: undefined, affectedAmount: undefined, total: undefined, month: undefined}] as TransactionResult[]
};