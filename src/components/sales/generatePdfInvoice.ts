import * as QRCode from "qrcode";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Buffer } from 'buffer'
import  arcaLogo from '../../arca-logo.png'

interface InvoiceData {
  pointOfSale: number;
  invoiceNumber: number;
  invoiceType: number;
  issueDate: string;
  businessName: string;
  businessCuit: number;
  businessAddress: string;
  businessIvaCondition: string;
  clientName: string;
  clientCuit: number;
  clientAddress: string;
  clientIvaCondition: string;
  clientDocType: number;
  items: { code: string; description: string; quantity: number; unitPrice: number; subtotal: number }[];
  total: number;
  subtotal: number;
  otherTaxes: number;
  cae: number;
  caeExpiration: string;
  saleCondition: string
}

export async function generateInvoicePDF(invoice: InvoiceData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // Margen reservado para el pie de página
  const pageHeight = doc.internal.pageSize.height;
  const footerHeight = 50;
  // const tableStartY = 40;


  doc.setDrawColor(0);
  doc.setFillColor(255, 255, 255);
  doc.rect(5, 8, 200, 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("ORIGINAL", 105.5, 15, { align: "center" });

  doc.rect(5, 8, 200, 53);

  doc.line(105.5, 33, 105.5, 61)


  // **Encabezado Principal**
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("MACARONI PASTAS", 67,   27.5, { align: "right" });

  // **Encabezado Principal**
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.text("FACTURA", 152.5, 27.5, { align: "right" });

  // **Recuadro y posición de la letra "C" en el centro**
  doc.setDrawColor(0);
  doc.setFillColor(255, 255, 255);
  doc.rect(97, 18, 17, 15); // Recuadro "C" centrado horizontalmente
  // doc.rect(x, y, w, h)
  doc.setFontSize(25);
  doc.text("C", 105.5, 26.5, { align: "center" });
  doc.setFontSize(8);
  doc.text("COD. 011", 105.5, 31, { align: "center" });
  // doc.text(texto, x, y)

  // **Datos del negocio**  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0);
  doc.text(`Razón Social: `, 7, 42);
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0);
  doc.text(`${invoice.businessName}`, 31, 42);
  doc.setFont('helvetica', 'bold')
  doc.text(`Domicilio Comercial:  `, 7, 50);
  // doc.setFont('helvetica', 'normal')
  // doc.text(`${invoice.businessAddress}`, 41, 50);
  const address = invoice.businessAddress || '';
  const maxCharsPerLine = 36; // Ajustá según el ancho disponible

  // Forzar salto de línea si es muy larga, aunque no tenga espacios
  const wrappedAddress = address.length > maxCharsPerLine
    ? [address.slice(0, maxCharsPerLine), address.slice(maxCharsPerLine)]
    : [address];

  // Mostralo en la posición deseada
  doc.setFont('helvetica', 'normal')
  // Imprimir el texto línea por línea
  wrappedAddress.forEach((line, index) => {
    doc.text(line, 41, 50 + (index * 5)); // Espacio de 5 entre líneas
  });

  doc.setFont('helvetica', 'bold')
  doc.text(`Condición frente al IVA: ${invoice.businessIvaCondition}`, 7, 59);

  // **Datos del comprobante**
  doc.text(`Punto de Venta:   ${padNumber(invoice.pointOfSale, 5)}`, 120, 35);
  doc.text(`Comp. Nro:   ${padNumber(invoice.invoiceNumber, 8)}`, 160, 35);
  doc.text(`Fecha de Emisión:   ${formatDate(invoice.issueDate, 'DD/MM/YYYY')}`, 120, 40.5);
  doc.setFont('helvetica', 'bold')
  doc.text(`CUIT:  `, 120, 50);
  doc.setFont('helvetica', 'normal')
  doc.text(`${invoice.businessCuit}`, 130, 50);
  doc.setFont('helvetica', 'bold')
  doc.text(`Ingresos Brutos:  `, 120, 54);
  doc.setFont('helvetica', 'normal')
  doc.text(`si`, 147, 54);
  doc.setFont('helvetica', 'bold')
  doc.text(`Fecha de Inicio de Actividades:  `, 120, 58);
  doc.setFont('helvetica', 'normal')
  doc.text(`01/10/2023`, 170, 58);

  doc.rect(5, 64, 200, 23);

  // **Datos del cliente**  
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0);
  doc.text(`CUIT: `, 7, 68);
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0);
  doc.text(`${invoice.clientCuit}`, 17, 68);
  doc.setFont('helvetica', 'bold')
  doc.text(`Condición frente al IVA: `, 7, 75);
  doc.setFont('helvetica', 'normal')
  doc.text(`${invoice.clientIvaCondition}`, 45, 75);
  doc.setFont('helvetica', 'bold')
  doc.text(`Condición de venta: `, 7, 82);
  doc.setFont('helvetica', 'normal')
  doc.text(`${invoice.saleCondition}`, 45, 82);


  doc.setFont('helvetica', 'bold')
  doc.text(`Apellido y Nombre / Razón Social:  `, 80, 68);
  doc.setFont('helvetica', 'normal')
  doc.text(`${invoice.clientName}`, 130, 68);
  doc.setFont('helvetica', 'bold')
  doc.text(`Domicilio:  `, 90, 75);
  doc.setFont('helvetica', 'normal')
  doc.text(`${invoice.clientAddress}`, 105, 75);


  // **Detalle de Ítems**
  const tableData = invoice.items.map(item => [
    item.code,
    item.description,
    item.quantity.toFixed(2),
    `unidades`,
    `${item.unitPrice.toFixed(2)}`,
    Number(0).toFixed(2),
    Number(0).toFixed(2),
    ` ${item.subtotal.toFixed(2)}`,
  ]);

  // QR
  // Generar QR
  // Ejemplo:
  // "ver": 1,                    // number
  // "fecha": "2025-02-04",       // string
  // "cuit": 23393153504,         // number
  // "ptoVta": 2,                 // number
  // "tipoCmp": 11,               // number
  // "nroCmp": 282,               // number
  // "importe": 14200,            // number
  // "moneda": "PES",             // string
  // "ctz": 1,                    // number
  // "tipoDocRec": 80,            // number 80 cuit | 99 consumidor final
  // "nroDocRec": 27298813098,    // number si corresponde sino 0
  // "tipoCodAut": "E",           // string
  // "codAut": 75034219431674     // number
  const qrData = {
    "ver": 1,
    "fecha": formatDate(invoice.issueDate, 'YYYY-MM-DD'),
    "cuit": invoice.businessCuit,
    "ptoVta": invoice.pointOfSale,
    "tipoCmp": invoice.invoiceType,
    "nroCmp": invoice.invoiceNumber,
    "importe": invoice.total,
    "moneda": "PES",
    "ctz": 1,
    "tipoDocRec": invoice.clientDocType,
    "nroDocRec": invoice.clientCuit,
    "tipoCodAut": "E",
    "codAut": invoice.cae
  };

  const json_string = JSON.stringify(qrData) 
  const base64_string = Buffer.from(json_string, 'utf8');

  const qrPayload = base64_string.toString("base64");
  const qrUrl = `https://www.afip.gob.ar/fe/qr/?p=${qrPayload}`;

  const qrImage = await QRCode.toDataURL(qrUrl);

  console.log(qrUrl)
    
  // corregir que si tienen muchas filas se cree una nueva pagina
  autoTable(doc, {
    head: [["Código", "Producto / Servicio", "Cantidad", "U. Medida", "Precio Unit.", "% Bonif", "Imp. Bonif.", "Subtotal"]],
    body: tableData,
    startY: 88.5,
    styles: { fontSize: 7, cellPadding: 2, textColor: [0, 0, 0], fillColor: [255, 255, 255], lineWidth: 0 },
    headStyles: { fillColor: [200, 200, 200], textColor: 0, lineWidth: 0.2, lineColor: [0, 0, 0], halign: "center", valign: "middle" },
    bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0 },
    alternateRowStyles: { fillColor: [255, 255, 255] },
    margin: { left: 5, right: 5 }, // Abarcar desde margen izquierdo ajustado
    columnStyles: {
      2: { halign: "right" }, // Precio Unitario alineado a la derecha
      3: { halign: "center" }, // Precio Unitario alineado a la derecha
      4: { halign: "right" }, // Subtotal alineado a la derecha
      5: { halign: "center" }, // Subtotal alineado a la derecha
      6: { halign: "right" }, // Subtotal alineado a la derecha
      7: { halign: "right" }, // Subtotal alineado a la derecha
    },
    didDrawPage: (_data) => {
      // Fijar los totales y el QR siempre al pie
      const yFooterStart = pageHeight - footerHeight;

      doc.setDrawColor(0);
      doc.setLineWidth(0.4);
      doc.rect(5, yFooterStart - 64, doc.internal.pageSize.width - 10, 35);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);

      const valueX = doc.internal.pageSize.width - 10;
      const labelX = valueX - 30; // Ajusta la posición de las etiquetas

      const drawAlignedRow = (label: string, value: string, yPos: number) => {
        // Alinear ambos por la derecha
        doc.text(label, labelX, yPos, { align: 'right' });
        doc.text(value, valueX, yPos, { align: 'right' });
      };

      drawAlignedRow('Subtotal: $', `${invoice.subtotal.toFixed(2)}`, yFooterStart - 45);
      drawAlignedRow('Importe Otros Tributos: $', `${invoice.otherTaxes.toFixed(2)}`, yFooterStart - 38.5);
      drawAlignedRow('Importe Total: $', `${invoice.total.toFixed(2)}`, yFooterStart - 32);

      // **CAE y fecha de vencimiento en la derecha y abajo**
      doc.setFontSize(10);
      doc.text(`CAE N°: `, doc.internal.pageSize.width - 56, yFooterStart - 15);
      doc.setFont('helvetica', 'normal')
      doc.text(`${invoice.cae}`, doc.internal.pageSize.width - 40, yFooterStart - 15); 
      doc.setFont('helvetica', 'bold')
      doc.text(`Fecha de Vto. CAE: `, doc.internal.pageSize.width - 75, yFooterStart - 10);
      doc.setFont('helvetica', 'normal')
      doc.text(`${formatDate(invoice.caeExpiration, 'DD/MM/YYYY')}`, doc.internal.pageSize.width - 40, yFooterStart - 10);

      // QR en el pie a la derecha
      const qrX = doc.internal.pageSize.width - 203;
      const qrY = pageHeight - 65;
      doc.addImage(qrImage, "PNG", qrX, qrY, 25, 25); // QR en la esquina inferior derecha

      // Logo al lado del QR
      const logoX = qrX + 30; // Ajusta la posición horizontal
      const logoY = qrY - 1; // Alineado verticalmente con el QR
      const logoWidth = 20; // Ajusta el tamaño del logo
      const logoHeight = 10;

      doc.addImage(arcaLogo, 'PNG', logoX, logoY, logoWidth, logoHeight);

      // ** Comprobante autorizado **
      doc.setFont('helvetica', 'bolditalic');
      doc.setFontSize(9);
      doc.text(`Comprobante Autorizado`, doc.internal.pageSize.width - 173  , yFooterStart - 2);

      // ** Esta Agencia no se responsabiliza por los datos ingresados en el detalle de la operación **
      doc.setFont('helvetica', 'bolditalic');
      doc.setFontSize(6.5);
      doc.text(`Esta Agencia no se responsabiliza por los datos ingresados en el detalle de la operación`, doc.internal.pageSize.width - 173  , yFooterStart + 4);
    },
  });


  // **Guardar PDF**
  doc.save(`Factura_Macaroni_${invoice.invoiceNumber}.pdf`);
}

const formatDate = (dateStr: string, type: string): string => {
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);

  if(type === 'DD/MM/YYYY') {
    return `${day}/${month}/${year}`;
  }

  return `${year}-${month}-${day}`;
};

const padNumber = (num: number, length: number): string => {
  return num.toString().padStart(length, '0');
};