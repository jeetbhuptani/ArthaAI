// src/services/documentParserService.ts

import { detectDocumentType } from '../utils/documentTypeUtil';

export function analyzeDocument(text: string) {
  const type = detectDocumentType(text);
  let parsedData;

  switch (type) {
    case 'ITR':
      parsedData = parseITR(text);
      break;
    case 'INVOICE':
      parsedData = parseInvoice(text);
      break;
    default:
      parsedData = { message: 'Document type not recognized.' };
  }

  return { type, parsedData };
}

//ITR
export function parseITR(text: string) {
    const parsedData = {
      name: extractValue(text, /Name\s*:\s*(.*)/),
      pan: extractValue(text, /PAN\s*:\s*([A-Z0-9]+)/),
      assessmentYear: extractValue(text, /Assessment Year\s*:\s*(\d{4}-\d{2})/),
      grossIncome: extractValue(text, /Gross Total Income\s*:\s*₹?\s?([\d,]+)/),
      deductions: extractValue(text, /Total Deductions\s*:\s*₹?\s?([\d,]+)/),
      taxPaid: extractValue(text, /Tax Paid\s*:\s*₹?\s?([\d,]+)/),
    };
    return parsedData;
  }
//Invoice
export function parseInvoice(text: string) {
    const parsedData = {
      invoiceNumber: extractValue(text, /Invoice Number\s*:\s*(\S+)/),
      date: extractValue(text, /Date\s*:\s*(\d{2}\/\d{2}\/\d{4})/),
      sellerGst: extractValue(text, /GSTIN\s*:\s*([0-9A-Z]+)/),
      totalAmount: extractValue(text, /Total\s*:\s*₹?\s?([\d,]+\.\d{2})/),
      taxAmount: extractValue(text, /Tax\s*Amount\s*:\s*₹?\s?([\d,]+\.\d{2})/),
    };
    return parsedData;
  }
//Helper
function extractValue(text: string, regex: RegExp): string | null {
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  }

  