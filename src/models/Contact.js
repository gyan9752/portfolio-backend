import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
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
    message: {
      type: String,
      required: true,
    },
    replied: {
      type: Boolean,
      default: false,
    },
    replies: [
      {
        subject: String,
        message: String,
        sentAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
