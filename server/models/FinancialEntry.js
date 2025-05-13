import mongoose from 'mongoose';

const FinancialEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  gstIncluded: {
    type: Boolean,
    default: false
  }
});

const FinancialEntry = mongoose.model('FinancialEntry', FinancialEntrySchema);
export default FinancialEntry;