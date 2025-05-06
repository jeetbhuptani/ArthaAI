import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'Please provide a first name']
  },
  lastname: {
    type: String,
    required: [true, 'Please provide a last name']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  googleId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  financialProfile: {
    incomeRange: String,
    expenses: [{
      category: String, 
      amount: Number
    }],
    savingsGoal: Number,
    riskTolerance: {
      type: String,
      enum: ['Low', 'Medium', 'High']
    },
    investmentPreferences: [String]
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);