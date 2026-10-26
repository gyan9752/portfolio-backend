import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    referrer: {
      type: String,
      default: '',
    },
    welcomeEmailSent: {
      type: Boolean,
      default: false,
    },
    at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Visitor = mongoose.models.Visitor || mongoose.model('Visitor', visitorSchema);
