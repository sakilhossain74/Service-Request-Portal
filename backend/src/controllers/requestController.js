import Request from '../models/Request.js';
import Staff from '../models/Staff.js';
import {
  ALLOWED_STATUS_TRANSITIONS,
  CATEGORIES,
  PRIORITIES,
  ROLES,
  STATUSES
} from '../config/constants.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// Escape special regex characters so user search input cannot break MongoDB $regex
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const populateRequest = (query) =>
  query
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email department');

// Build ownership-scoped filter: admins see all, users see only their own requests
const buildScopedIdFilter = (id, user) => {
  if (user.role === ROLES.ADMIN) {
    return { _id: id };
  }
  return { _id: id, createdBy: user._id };
};

// @desc    Create a new service request
// @route   POST /api/requests
// @access  Private (User & Admin)
export const createRequest = asyncHandler(async (req, res) => {
  const { title, description, category, priority } = req.body;

  // Never trust client-supplied status, assignedTo, or createdBy
  const newRequest = await Request.create({
    title,
    description,
    category,
    priority: priority || 'Medium',
    status: 'Pending',
    createdBy: req.user._id
  });

  const populated = await populateRequest(Request.findById(newRequest._id));

  res.status(201).json({
    success: true,
    message: 'Service request created successfully',
    data: populated
  });
});

// @desc    Get all requests (Admin) or own requests (User) with search, filters, pagination
// @route   GET /api/requests
// @access  Private
export const getRequests = asyncHandler(async (req, res) => {
  const { search, status, category, priority, sort } = req.query;

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.user.role !== ROLES.ADMIN) {
    filter.createdBy = req.user._id;
  }

  if (search && search.trim()) {
    filter.title = { $regex: escapeRegex(search.trim()), $options: 'i' };
  }
  if (status && STATUSES.includes(status)) {
    filter.status = status;
  }
  if (category && CATEGORIES.includes(category)) {
    filter.category = category;
  }
  if (priority && PRIORITIES.includes(priority)) {
    filter.priority = priority;
  }

  const sortOption = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

  const [requests, total] = await Promise.all([
    populateRequest(
      Request.find(filter).sort(sortOption).skip(skip).limit(limit)
    ).lean(),
    Request.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    message: 'Requests fetched successfully',
    data: requests,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      limit
    }
  });
});

// @desc    Get single request by ID
// @route   GET /api/requests/:id
// @access  Private (Owner or Admin)
export const getRequestById = asyncHandler(async (req, res) => {
  const filter = buildScopedIdFilter(req.params.id, req.user);
  const request = await populateRequest(Request.findOne(filter));

  if (!request) {
    throw new ApiError(404, 'Service request not found');
  }

  res.status(200).json({
    success: true,
    message: 'Service request fetched successfully',
    data: request
  });
});

// @desc    Update request fields (Admin: any, User: own & Pending only)
// @route   PUT /api/requests/:id
// @access  Private (Owner Pending or Admin)
export const updateRequest = asyncHandler(async (req, res) => {
  const filter = buildScopedIdFilter(req.params.id, req.user);
  const request = await Request.findOne(filter);

  if (!request) {
    throw new ApiError(404, 'Service request not found');
  }

  if (req.user.role !== ROLES.ADMIN && request.status !== 'Pending') {
    throw new ApiError(403, 'Only Pending requests can be edited by the requester');
  }

  const { title, description, category, priority } = req.body;
  if (title !== undefined) request.title = title;
  if (description !== undefined) request.description = description;
  if (category !== undefined) request.category = category;
  if (priority !== undefined) request.priority = priority;

  await request.save();
  const populated = await populateRequest(Request.findById(request._id));

  res.status(200).json({
    success: true,
    message: 'Service request updated successfully',
    data: populated
  });
});

// @desc    Delete request (Admin: any, User: own & Pending only)
// @route   DELETE /api/requests/:id
// @access  Private (Owner Pending or Admin)
export const deleteRequest = asyncHandler(async (req, res) => {
  const filter = buildScopedIdFilter(req.params.id, req.user);
  const request = await Request.findOne(filter);

  if (!request) {
    throw new ApiError(404, 'Service request not found');
  }

  if (req.user.role !== ROLES.ADMIN && request.status !== 'Pending') {
    throw new ApiError(403, 'Only Pending requests can be deleted by the requester');
  }

  await request.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Service request deleted successfully',
    data: { _id: req.params.id }
  });
});

// @desc    Assign or reassign a staff member to a request
// @route   PATCH /api/requests/:id/assign
// @access  Private (Admin only)
export const assignStaff = asyncHandler(async (req, res) => {
  const { staffId } = req.body;

  const request = await Request.findById(req.params.id);
  if (!request) {
    throw new ApiError(404, 'Service request not found');
  }

  if (request.status === 'Resolved') {
    throw new ApiError(400, 'Cannot assign or reassign a Resolved request');
  }

  const staff = await Staff.findOne({ _id: staffId, isActive: true });
  if (!staff) {
    throw new ApiError(404, 'Active staff member not found');
  }

  request.assignedTo = staff._id;
  request.assignedAt = new Date();
  if (request.status === 'Pending') {
    request.status = 'Assigned';
  }

  await request.save();
  const populated = await populateRequest(Request.findById(request._id));

  res.status(200).json({
    success: true,
    message: `Request assigned to ${staff.name}`,
    data: populated
  });
});

// @desc    Update request workflow status
// @route   PATCH /api/requests/:id/status
// @access  Private (Admin only)
export const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status: newStatus } = req.body;

  const request = await Request.findById(req.params.id);
  if (!request) {
    throw new ApiError(404, 'Service request not found');
  }

  if (!request.assignedTo) {
    throw new ApiError(400, 'A staff member must be assigned before changing status');
  }

  if (request.status === newStatus) {
    throw new ApiError(400, `Request is already in "${newStatus}" status`);
  }

  const allowedNext = ALLOWED_STATUS_TRANSITIONS[request.status] || [];
  if (!allowedNext.includes(newStatus)) {
    throw new ApiError(
      400,
      `Invalid status transition from "${request.status}" to "${newStatus}"`
    );
  }

  request.status = newStatus;
  if (newStatus === 'Resolved') {
    request.resolvedAt = new Date();
  }

  await request.save();
  const populated = await populateRequest(Request.findById(request._id));

  res.status(200).json({
    success: true,
    message: `Request status updated to "${newStatus}"`,
    data: populated
  });
});
