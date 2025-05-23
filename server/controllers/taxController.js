import FinancialEntry from "../models/FinancialEntry.js";
import { createReadStream, unlinkSync } from "fs";
import csv from "csv-parser";
import PDFDocument from "pdfkit";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getTaxSummary(userId) {
  const entries = await FinancialEntry.aggregate([
    { $match: { userId } },
    { $sort: { date: -1, _id: -1 } },
    {
      $group: {
        _id: {
          date: "$date",
          category: "$category",
          description: "$description",
        },
        doc: { $first: "$$ROOT" },
      },
    },
    { $replaceRoot: { newRoot: "$doc" } },
  ]);

  let totalIncome = 0, totalExpenses = 0, gstCredit = 0;
  entries.forEach((entry) => {
    if (entry.category === "income") {
      totalIncome += entry.amount;
    } else {
      totalExpenses += entry.amount;
      if (entry.gstIncluded) {
        gstCredit += (entry.amount * 0.18) / 1.18;
      }
    }
  });

  const gstPayable = totalIncome * 0.18;
  const netGst = gstPayable - gstCredit;
  return { entries, totalIncome, totalExpenses, gstCredit, gstPayable, netGst };
}

export async function addEntry(req, res) {
  const entry = new FinancialEntry({ ...req.body, userId: req.user._id });
  await entry.save();
  res.json({ success: true });
}

export async function uploadCSV(req, res) {
  const results = [];
  const errors = [];

  createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => {
      // Validate and clean each row
      const amount = parseFloat(data.amount);

      // Check required fields
      if (!data.date) {
        errors.push(
          `Row with description "${
            data.description || "unknown"
          }" is missing date`
        );
        return;
      }
      if (!data.category) {
        errors.push(
          `Row with description "${
            data.description || "unknown"
          }" is missing category`
        );
        return;
      }
      if (!data.description) {
        errors.push(`Row dated "${data.date}" is missing description`);
        return;
      }
      if (isNaN(amount)) {
        errors.push(
          `Row "${data.description || "unknown"}" has invalid amount: ${
            data.amount
          }`
        );
        return;
      }

      // Format date properly - assuming CSV has date in format YYYY-MM-DD
      let parsedDate;
      try {
        parsedDate = new Date(data.date);
        if (isNaN(parsedDate.getTime())) throw new Error("Invalid date");
      } catch (e) {
        errors.push(
          `Row "${data.description}" has invalid date format: ${data.date}`
        );
        return;
      }

      // Push valid entry
      results.push({
        userId: req.user._id,
        date: parsedDate,
        category: data.category,
        description: data.description,
        amount: amount,
        gstIncluded: data.gstIncluded === "true",
      });
    })
    .on("end", async () => {
      try {
        // If no valid rows were found
        if (results.length === 0) {
          unlinkSync(req.file.path);
          return res.status(400).json({
            success: false,
            error: "No valid entries found in CSV",
            details: errors,
          });
        }

        // Insert valid rows
        await FinancialEntry.insertMany(results);
        unlinkSync(req.file.path);

        res.json({
          success: true,
          message: `Successfully imported ${results.length} entries`,
          warnings:
            errors.length > 0
              ? `Skipped ${errors.length} invalid entries`
              : null,
          details: errors.length > 0 ? errors : null,
        });
      } catch (error) {
        console.error("Error inserting CSV data:", error);
        res.status(500).json({ success: false, error: error.message });
      }
    })
    .on("error", (error) => {
      console.error("CSV parsing error:", error);
      res.status(500).json({ success: false, error: error.message });
    });
}

export async function calculateTax(req, res) {
  try {
    const { totalIncome, totalExpenses, gstCredit, gstPayable, netGst } =
      await getTaxSummary(req.user._id);

    res.json({ totalIncome, totalExpenses, gstCredit, gstPayable, netGst });
  } catch (error) {
    console.error("Tax calculation error:", error);
    res.status(500).send({ success: false, error: error.message });
  }
}

export async function generatePDF(req, res) {
  try {
    // Get tax data
    const entries = await FinancialEntry.find({ userId: req.user._id });
    let totalIncome = 0,
      totalExpenses = 0,
      gstCredit = 0;

    entries.forEach((entry) => {
      if (entry.category === "income") totalIncome += entry.amount;
      else {
        totalExpenses += entry.amount;
        if (entry.gstIncluded) {
          const gstAmount = (entry.amount * 0.18) / 1.18;
          gstCredit += gstAmount;
        }
      }
    });

    const gstPayable = totalIncome * 0.18;
    const netGst = gstPayable - gstCredit;

    // Create PDF
    const doc = new PDFDocument();
    const filename = `tax_report_${req.user._id}_${Date.now()}.pdf`;
    const filePath = path.join("uploads", filename);

    // Pipe PDF to file
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Add content to PDF
    doc.fontSize(25).text("Tax Summary Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Generated on: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    doc.fontSize(16).text("Financial Summary");
    doc.moveDown();
    doc.fontSize(12).text(`Total Income: ₹${totalIncome.toFixed(2)}`);
    doc.fontSize(12).text(`Total Expenses: ₹${totalExpenses.toFixed(2)}`);
    doc.moveDown();

    doc.fontSize(16).text("GST Summary");
    doc.moveDown();
    doc.fontSize(12).text(`GST Payable: ₹${gstPayable.toFixed(2)}`);
    doc.fontSize(12).text(`GST Credit: ₹${gstCredit.toFixed(2)}`);
    doc.fontSize(12).text(`Net GST: ₹${netGst.toFixed(2)}`);

    // Add transaction list
    doc.addPage();
    doc.fontSize(16).text("Transaction Details");
    doc.moveDown();

    entries.forEach((entry, index) => {
      doc
        .fontSize(10)
        .text(
          `${index + 1}. ${new Date(entry.date).toLocaleDateString()} - ${
            entry.description
          } - ₹${entry.amount.toFixed(2)} (${entry.category})`
        );
    });

    // Finalize PDF
    doc.end();

    // Wait for PDF creation to complete
    stream.on("finish", () => {
      // Send file to client
      res.download(filePath, filename, (err) => {
        if (err) {
          console.error("Download error:", err);
        }
        // Delete the file after download attempt
        fs.unlinkSync(filePath);
      });
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).send({ success: false, error: error.message });
  }
}

export async function getSuggestions(req, res) {
  try {
    const { entries, totalIncome, totalExpenses, gstCredit, gstPayable, netGst } =
      await getTaxSummary(req.user._id);

    const categories = {};
    entries.forEach((entry) => {
      if (entry.category !== "income") {
        categories[entry.description] = (categories[entry.description] || 0) + entry.amount;
      }
    });

    const topCats = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat, amt]) => `${cat}: ₹${amt.toFixed(2)}`)
      .join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
You are an AI tax advisor for Indian taxpayers. Based on the following:
Total Income: ₹${totalIncome.toFixed(2)}
Total Expenses: ₹${totalExpenses.toFixed(2)}
GST Payable: ₹${gstPayable.toFixed(2)}
GST Credit: ₹${gstCredit.toFixed(2)}
Net GST: ₹${netGst.toFixed(2)}

Main expense categories:
${topCats}

Provide 3-5 concise, actionable tax optimization tips (GST, 80C, 80D, etc.).
    `;

    try {
      const result = await model.generateContent(prompt);
      res.json({ suggestions: result.response.text() });
    } catch (aiError) {
      console.error("AI suggestion error:", aiError);
      res.json({
        suggestions:
          "Unable to generate AI suggestions at this time. Please consult a tax professional.",
      });
    }
  } catch (error) {
    console.error("Error generating suggestions:", error);
    res.status(500).json({ error: error.message });
  }
}
