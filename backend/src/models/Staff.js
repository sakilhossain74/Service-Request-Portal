import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Staff name is required'],
      trim: true,
      minlength: [2, 'Staff name must be at least 2 characters'],
      maxlength: [60, 'Staff name cannot exceed 60 characters']
    },
    email: {
      type: String,
      required: [true, 'Staff email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Staff = mongoose.model('Staff', staffSchema);

export default Staff;
