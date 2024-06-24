import { ISaleFullRelated, ISaleItemFullRelated } from "../components/sales/types"

export type MonthData = {
  total: number;
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
        month: month + 1,
        year,
        monthName: monthNames[month]
      };
    }

    salesByMonth[key].total += Number(sale.total)
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
        month: month + 1,
        year,
        monthName: monthNames[month]
      });
    } else {
      allMonths.push(salesByMonth[key]);
    }
  }

  return allMonths;
};

export const groupSaleItemsByMonth = (saleItems: ISaleItemFullRelated[], numberOfMonths: number): MonthData[] => {
  const saleItemsByMonth: { [key: string]: MonthData } = {};

  saleItems?.forEach(saleItem => {

    const year = new Date(String(saleItem.createdAt)).getFullYear();
    const month = new Date(String(saleItem.createdAt)).getMonth(); // 0-indexed
    const key = `${year}-${month}`;

    if (!saleItemsByMonth[key]) {
      saleItemsByMonth[key] = {
        total: 0,
        month: month + 1,
        year,
        monthName: monthNames[month]
      };
    }

    saleItemsByMonth[key].total += Number(saleItem?.product?.costPrice) * Number(saleItem?.quantity)
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

    if (!saleItemsByMonth[key]) {
      allMonths.push({
        total: 0,
        month: month + 1,
        year,
        monthName: monthNames[month]
      });
    } else {
      allMonths.push(saleItemsByMonth[key]);
    }
  }

  return allMonths;
};