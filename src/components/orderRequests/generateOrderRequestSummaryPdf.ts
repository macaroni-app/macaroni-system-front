import jsPDF from "jspdf";
import { IOrderRequestFullRelated } from "./types";

const TICKET_WIDTH_MM = 80;
const TICKET_HEIGHT_MM = 180;
const PAGE_MARGIN_MM = 6;
const CONTENT_WIDTH_MM = TICKET_WIDTH_MM - PAGE_MARGIN_MM * 2;

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(Number(amount ?? 0));

const formatDateTime = (value?: string | Date) => {
  if (!value) return "-";

  return new Date(String(value)).toLocaleString("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const drawLine = (doc: jsPDF, y: number) => {
  doc.setLineWidth(0.2);
  doc.line(PAGE_MARGIN_MM, y, TICKET_WIDTH_MM - PAGE_MARGIN_MM, y);
};

export const generateOrderRequestSummaryPdf = (
  orderRequest: IOrderRequestFullRelated,
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [TICKET_HEIGHT_MM, TICKET_WIDTH_MM],
  });

  let currentY = PAGE_MARGIN_MM + 2;

  const ensureSpace = (requiredHeight: number) => {
    const pageHeight = doc.internal.pageSize.getHeight();

    if (currentY + requiredHeight <= pageHeight - PAGE_MARGIN_MM) {
      return;
    }

    doc.addPage([TICKET_HEIGHT_MM, TICKET_WIDTH_MM], "portrait");
    currentY = PAGE_MARGIN_MM + 2;
  };

  const drawCenteredText = (
    text: string,
    fontSize: number,
    fontStyle: "normal" | "bold" = "normal",
    extraGap = 0,
  ) => {
    ensureSpace(fontSize * 0.5 + 4 + extraGap);
    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);
    doc.text(text, TICKET_WIDTH_MM / 2, currentY, { align: "center" });
    currentY += fontSize * 0.5 + 2 + extraGap;
  };

  const drawLabelValue = (label: string, value: string, extraGap = 0) => {
    ensureSpace(6 + extraGap);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(label, PAGE_MARGIN_MM, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(value, TICKET_WIDTH_MM - PAGE_MARGIN_MM, currentY, {
      align: "right",
    });
    currentY += 5 + extraGap;
  };

  const drawWrappedText = (
    label: string,
    value: string,
    fontStyle: "normal" | "bold" = "normal",
  ) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const labelWidth = doc.getTextWidth(label);
    const wrappedValue = doc.splitTextToSize(
      value,
      CONTENT_WIDTH_MM - labelWidth - 2,
    ) as string[];

    ensureSpace(Math.max(1, wrappedValue.length) * 5 + 2);
    doc.text(label, PAGE_MARGIN_MM, currentY);
    doc.setFont("helvetica", fontStyle);
    doc.text(wrappedValue, PAGE_MARGIN_MM + labelWidth + 2, currentY);
    currentY += Math.max(1, wrappedValue.length) * 5;
  };

  // drawCenteredText(orderRequest.business?.name ?? "Resumen de pedido", 11, "bold");
  drawCenteredText("MACARONI", 11, "bold");
  drawCenteredText("RESUMEN DE PEDIDO", 10, "bold", 1);

  drawLine(doc, currentY);
  currentY += 5;

  doc.setFillColor(245, 245, 245);
  doc.roundedRect(
    PAGE_MARGIN_MM,
    currentY,
    CONTENT_WIDTH_MM,
    14,
    1.5,
    1.5,
    "F",
  );
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("NRO. DE PEDIDO", TICKET_WIDTH_MM / 2, currentY + 5, {
    align: "center",
  });
  doc.setFontSize(16);
  doc.text(orderRequest.orderCode ?? "-", TICKET_WIDTH_MM / 2, currentY + 11, {
    align: "center",
  });
  currentY += 18;

  // drawWrappedText("Cliente:", orderRequest.client?.name ?? "-");
  // drawWrappedText(
  //   "Fecha:",
  //   formatDateTime(orderRequest.sortingDate ?? orderRequest.createdAt),
  // );
  drawLabelValue("Cliente:", orderRequest.client?.name ?? "-");
  drawLabelValue(
    "Fecha:",
    formatDateTime(orderRequest.sortingDate ?? orderRequest.createdAt),
    1,
  );

  drawLine(doc, currentY);
  currentY += 5;

  drawCenteredText("DETALLE", 10, "bold");

  orderRequest.items?.forEach((item) => {
    const productName = item.product?.name ?? "Producto";
    const quantity = Number(item.quantity ?? 0);
    const unitPrice = formatCurrency(Number(item.unitPrice ?? 0));
    const subtotal = formatCurrency(Number(item.subtotal ?? 0));
    const wrappedName = doc.splitTextToSize(
      productName,
      CONTENT_WIDTH_MM,
    ) as string[];

    ensureSpace(wrappedName.length * 4 + 8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(wrappedName, PAGE_MARGIN_MM, currentY);
    currentY += wrappedName.length * 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Cant.: ${quantity}u x ${unitPrice}`, PAGE_MARGIN_MM, currentY);
    doc.text(subtotal, TICKET_WIDTH_MM - PAGE_MARGIN_MM, currentY, {
      align: "right",
    });
    currentY += 5;
  });

  drawLine(doc, currentY);
  currentY += 5;

  drawLabelValue("Total:", formatCurrency(Number(orderRequest.total ?? 0)));
  drawLabelValue(
    "Entregado:",
    formatCurrency(Number(orderRequest.paidAmount ?? 0)),
  );
  drawLabelValue(
    "Saldo pendiente:",
    formatCurrency(Number(orderRequest.pendingAmount ?? 0)),
  );

  currentY += 2;
  drawLine(doc, currentY);
  currentY += 6;

  drawCenteredText("Gracias por su compra", 9, "normal");
  drawCenteredText("Presentar este ticket para retirar", 8, "bold");

  doc.save(`Pedido_${orderRequest.orderCode ?? "sin-codigo"}.pdf`);
};

export default generateOrderRequestSummaryPdf;
