export function analyzeDocument(text) {
  // Basic example: extract PAN number, amount, and date
  const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]/;
  const amountRegex = /(?:Rs\.?|INR)?\s?[\d,]+(?:\.\d{1,2})?/gi;
  const dateRegex = /\b\d{2}[-\/]\d{2}[-\/]\d{4}\b/g;

  const pan = text.match(panRegex)?.[0] || "Not found";
  const amounts = text.match(amountRegex) || [];
  const dates = text.match(dateRegex) || [];

  return {
    extractedPAN: pan,
    extractedAmounts: amounts,
    extractedDates: dates,
  };
}