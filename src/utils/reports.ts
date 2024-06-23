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
  const years = new Set<number>();

  sales?.forEach(sale => {

    const year = new Date(String(sale.createdAt)).getFullYear();
    const month = new Date(String(sale.createdAt)).getMonth(); // 0-indexed
    const key = `${year}-${month}`;

    years.add(year);

    if (!salesByMonth[key]) {
      salesByMonth[key] = {
        total: 0,
        month: month + 1,
        year,
        monthName: monthNames[month]
      };
    }

    salesByMonth[key].total += Number(sale.total);
  });

  // Add missing months with zero sales
  years.forEach(year => {
    for (let month = 0; month < 12; month++) {
      const key = `${year}-${month}`;
      if (!salesByMonth[key]) {
        salesByMonth[key] = {
          total: 0,
          month: month + 1,
          year,
          monthName: monthNames[month]
        };
      }
    }
  });

  const allMonths = Object.values(salesByMonth).sort((a, b) => {
    return a.year === b.year ? a.month - b.month : a.year - b.year;
  });

  // Get the current date
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Calculate the cutoff date for the past `numberOfMonths`
  const startDate = new Date(currentYear, currentMonth - numberOfMonths + 1, 1);

  // Filter out the months outside the range
  const filteredMonths = allMonths.filter(monthData => {
    const monthDate = new Date(monthData.year, monthData.month - 1, 1);
    return monthDate >= startDate && (monthData.year < currentYear || (monthData.year === currentYear && monthData.month - 1 <= currentMonth));
  });

  return filteredMonths;
};

export const groupSaleItemByMonth = (saleItems: ISaleItemFullRelated[], numberOfMonths: number): MonthData[] => {
  const saleItemsByMonth: { [key: string]: MonthData } = {};
  const years = new Set<number>();

  saleItems?.forEach(saleItem => {

    const year = new Date(String(saleItem.createdAt)).getFullYear();
    const month = new Date(String(saleItem.createdAt)).getMonth(); // 0-indexed
    const key = `${year}-${month}`;

    years.add(year);

    if (!saleItemsByMonth[key]) {
      saleItemsByMonth[key] = {
        total: 0,
        month: month + 1,
        year,
        monthName: monthNames[month]
      };
    }

    saleItemsByMonth[key].total += Number(saleItem?.product?.costPrice) * Number(saleItem?.quantity);
  });

  // Add missing months with zero sales
  years.forEach(year => {
    for (let month = 0; month < 12; month++) {
      const key = `${year}-${month}`;
      if (!saleItemsByMonth[key]) {
        saleItemsByMonth[key] = {
          total: 0,
          month: month + 1,
          year,
          monthName: monthNames[month]
        };
      }
    }
  });

  const allMonths = Object.values(saleItemsByMonth).sort((a, b) => {
    return a.year === b.year ? a.month - b.month : a.year - b.year;
  });

  // Get the current date
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Calculate the cutoff date for the past `numberOfMonths`
  const startDate = new Date(currentYear, currentMonth - numberOfMonths + 1, 1);

  // Filter out the months outside the range
  const filteredMonths = allMonths.filter(monthData => {
    const monthDate = new Date(monthData.year, monthData.month - 1, 1);
    return monthDate >= startDate && (monthData.year < currentYear || (monthData.year === currentYear && monthData.month - 1 <= currentMonth));
  });

  return filteredMonths;
};