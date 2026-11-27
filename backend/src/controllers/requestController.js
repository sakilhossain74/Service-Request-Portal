import Request from '../models/Request.js';
import Staff from '../models/Staff.js';
import sendEmail from '../utils/emailService.js';
import {
  ALLOWED_STATUS_TRANSITIONS,
  CATEGORIES,
  PRIORITIES,
  ROLES,
  STATUSES
} from '../config/constants.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { attachOverdueFlag, parseAndValidateDueDate } from '../utils/deadlineUtils.js';

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const populateRequest = (query) =>
  query
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email department isActive');

const buildScopedIdFilter = (id, user) => {
  if (user.role === ROLES.ADMIN) {
    return { _id: id };
  }
  return { _id: id, createdBy: user._id };
};


export const createRequest = asyncHandler(async (req, res) => {
  const { title, description, category, priority } = req.body;

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
    data: attachOverdueFlag(populated)
  });
});


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

  const now = new Date();
  res.status(200).json({
    success: true,
    message: 'Requests fetched successfully',
    data: requests.map((doc) => attachOverdueFlag(doc, now)),
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      limit
    }
  });
});


export const getRequestById = asyncHandler(async (req, res) => {
  const filter = buildScopedIdFilter(req.params.id, req.user);
  const request = await populateRequest(Request.findOne(filter));

  if (!request) {
    throw new ApiError(404, 'Service request not found');
  }

  res.status(200).json({
    success: true,
    message: 'Service request fetched successfully',
    data: attachOverdueFlag(request)
  });
});


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

  const populated = await populateRequest(
    Request.findById(request._id)
  );

  res.status(200).json({
    success: true,
    message: 'Service request updated successfully',
    data: attachOverdueFlag(populated)
  });
});


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

  const previousStaffId = request.assignedTo ? request.assignedTo.toString() : null;

  request.assignedTo = staff._id;
  request.assignedAt = new Date();
  if (request.status === 'Pending') {
    request.status = 'Assigned';
  }

  await request.save();
  const populated = await populateRequest(Request.findById(request._id));

  const assignedStaff = populated.assignedTo;
  if (
    previousStaffId !== staff._id.toString() &&
    assignedStaff?.email &&
    assignedStaff?.isActive !== false
  ) {
    const formattedDueDate = populated.dueDate
      ? new Date(populated.dueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
      : 'Not set';

    try {
      await sendEmail({
        to: assignedStaff.email,
        subject: 'New Service Request Assigned to You',
        text: `Hello ${assignedStaff.name},

A service request has been assigned to you. Please review the details below and take action to resolve it.

Title: ${populated.title}
Description: ${populated.description}
Category: ${populated.category}
Priority: ${populated.priority}
Due Date: ${formattedDueDate}
Current Status: ${populated.status}

Thank you,
Service Request & Resolution Portal`
      });

      console.log(`Assignment email sent to ${assignedStaff.email} for request ${populated._id}`);
    } catch (emailError) {
      console.error(`Assignment email failed for ${assignedStaff.email}:`, emailError.message);
    }
  }

  res.status(200).json({
    success: true,
    message: `Request assigned to ${staff.name}`,
    data: attachOverdueFlag(populated)
  });
});


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

  const previousStatus = request.status;
  request.status = newStatus;
  if (newStatus === 'Resolved') {
    request.resolvedAt = new Date();
  }

  await request.save();
  const populated = await populateRequest(Request.findById(request._id));

  // Send resolution email only on transition to Resolved
  if (previousStatus !== 'Resolved' && newStatus === 'Resolved') {
    const requester = populated.createdBy;
    if (requester?.email) {
      try {
        await sendEmail({
          to: requester.email,
          subject: 'Your Service Request Has Been Resolved',
          text: `Hello ${requester.name},

Your service request has been successfully resolved.

Title: ${populated.title}
Category: ${populated.category}
Status: Resolved

Thank you for using the Service Request & Resolution Portal.

Best regards,
Service Request & Resolution Portal`
        });

        console.log(`Resolution email sent to ${requester.email} for request ${populated._id}`);
      } catch (emailError) {
        console.error(`Resolution email failed for ${requester.email}:`, emailError.message);
      }
    }
  }

  res.status(200).json({
    success: true,
    message: `Request status updated to "${newStatus}"`,
    data: attachOverdueFlag(populated)
  });
});

export const updateDueDate = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request) {
    throw new ApiError(404, 'Service request not found');
  }

  if (request.status === 'Resolved') {
    throw new ApiError(400, 'Cannot set or change due date on a Resolved request');
  }

  const { date, error } = parseAndValidateDueDate(req.body.dueDate);
  if (error) {
    throw new ApiError(400, error, [{ field: 'dueDate', message: error }]);
  }

  request.dueDate = date;
  await request.save();

  const populated = await populateRequest(Request.findById(request._id));

  res.status(200).json({
    success: true,
    message: 'Due date updated successfully',
    data: attachOverdueFlag(populated)
  });
});
