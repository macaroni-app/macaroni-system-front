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

const monthNames = [
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


export const agruparYSumarTransacciones = (inventoryTransactions: IInventoryTransactionFullRelated[]) => {

  if(inventoryTransactions !== undefined && inventoryTransactions.length > 0) {

    const resultado = inventoryTransactions?.reduce((acc, inventoryTransaction) => {
      const { asset, transactionType, affectedAmount } = inventoryTransaction;
  
      let assetId = asset?._id
  
      if (!acc[assetId]) {
        acc[assetId] = {};
      }
  
      if (!acc[assetId][transactionType]) {
        acc[assetId][transactionType] = 0;
      }
  
      acc[assetId][transactionType] += affectedAmount;

      return acc;
    }, {});
  
    const resultadoArray = Object?.entries(resultado)?.map(([assetId, transaccionesPorTipo]) => {
      return Object?.entries(transaccionesPorTipo)?.map(([transactionType, affectedAmount]) => {
        return {
          asset: assetId,
          transactionType,
          affectedAmount
        };
      });
    }).flat();
  
    return resultadoArray;
  }

};