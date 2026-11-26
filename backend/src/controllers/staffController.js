import Staff from '../models/Staff.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    List active staff members for assignment dropdown
// @route   GET /api/staff
// @access  Private (Admin only)
export const getStaff = asyncHandler(async (_req, res) => {
  const staff = await Staff.find({ isActive: true }).sort({ name: 1 }).lean();

  res.status(200).json({
    success: true,
    message: 'Staff members fetched successfully',
    data: staff
  });
});
