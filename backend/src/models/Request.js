import mongoose from 'mongoose';
import { CATEGORIES, PRIORITIES, STATUSES } from '../config/constants.js';

const requestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: 'Invalid category selected'
      }
    },
    priority: {
      type: String,
      enum: {
        values: PRIORITIES,
        message: 'Priority must be Low, Medium, or High'
      },
      default: 'Medium'
    },
    status: {
      type: String,
      enum: {
        values: STATUSES,
        message: 'Invalid request status'
      },
      default: 'Pending'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required']
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      default: null
    },
    assignedAt: {
      type: Date,
      default: null
    },
    resolvedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

requestSchema.index({ createdBy: 1 });
requestSchema.index({ status: 1 });
requestSchema.index({ category: 1 });
requestSchema.index({ priority: 1 });
requestSchema.index({ title: 1 });

const Request = mongoose.model('Request', requestSchema);

export default Request;
