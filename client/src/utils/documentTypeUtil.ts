export function detectDocumentType(
  text: string
): "ITR" | "INVOICE" | "UNKNOWN" {
  if (text.includes("Form ITR") || text.includes("Assessment Year"))
    return "ITR";
  if (
    text.includes("Tax Invoice") ||
    text.includes("GSTIN") ||
    text.includes("Invoice Number")
  )
    return "INVOICE";
  return "UNKNOWN";
}