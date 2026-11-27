import Staff from '../models/Staff.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';


export const getStaff = asyncHandler(async (_req, res) => {
  const staff = await Staff.find({ isActive: true }).sort({ name: 1 }).lean();

  res.status(200).json({
    success: true,
    message: 'Staff members fetched successfully',
    data: staff
  });
});


export const createStaff = asyncHandler(async (req, res) => {
  const { name, email, department } = req.body;

  if (!name?.trim() || !email?.trim() || !department?.trim()) {
    throw new ApiError(400, 'Name, email and department are required');
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingStaff = await Staff.findOne({ email: normalizedEmail });

  if (existingStaff) {
    throw new ApiError(409, 'Staff with this email already exists');
  }

  const staff = await Staff.create({
    name,
    email: normalizedEmail,
    department
  });

  res.status(201).json({
    success: true,
    message: 'Staff member added successfully',
    data: staff
  });
});



export const deactivateStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);

  if (!staff) {
    throw new ApiError(404, 'Staff member not found');
  }

  staff.isActive = false;
  await staff.save();

  res.status(200).json({
    success: true,
    message: 'Staff member deactivated successfully',
    data: staff
  });
});


export const getAllStaff = asyncHandler(async (_req, res) => {
  const staff = await Staff.find().sort({ name: 1 }).lean();

  res.status(200).json({
    success: true,
    message: 'All staff members fetched successfully',
    data: staff
  });
});


export const reactivateStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);

  if (!staff) {
    throw new ApiError(404, 'Staff member not found');
  }

  staff.isActive = true;
  await staff.save();

  res.status(200).json({
    success: true,
    message: 'Staff member reactivated successfully',
    data: staff
  });
});