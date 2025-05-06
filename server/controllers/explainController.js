import axios from 'axios';

export const explainDocument = async (req, res) => {
  const { extractedText } = req.body;
  const prompt = `
You are an assistant helping Indian users understand financial documents.

Document:
"""
${extractedText}
"""

Please do the following:
1. Identify what kind of document this is (Invoice, ITR, or other).
2. Explain all financial fields (e.g. Total Amount, GST, PAN, TDS, Taxable Income) in simple Hindi-English (Hinglish) mix.
3. Keep the explanation short, friendly, and non-technical.
`;

  try {
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    const explanation =
      geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No explanation found.';
    res.json({ explanation });
  } catch (err) {
    console.error('Gemini API error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Gemini API call failed' });
  }
};