import Request from '../models/Request.js';
import { CATEGORIES, PRIORITIES, ROLES, STATUSES } from '../config/constants.js';
import asyncHandler from '../utils/asyncHandler.js';
import { attachOverdueFlag } from '../utils/deadlineUtils.js';

// Helper to initialize all enum keys to 0 so UI never receives undefined counts
const mapAggregationCounts = (keys, rows) => {
  const counts = Object.fromEntries(keys.map((key) => [key, 0]));
  for (const row of rows) {
    if (row._id && Object.prototype.hasOwnProperty.call(counts, row._id)) {
      counts[row._id] = row.count;
    }
  }
  return counts;
};

// @desc    Get dashboard statistics scoped by role (Admin: global, User: own)
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = asyncHandler(async (req, res) => {
  const matchStage = req.user.role === ROLES.ADMIN ? {} : { createdBy: req.user._id };

  const now = new Date();
  const [aggregationResult, recent, overdue] = await Promise.all([
    Request.aggregate([
      { $match: matchStage },
      {
        $facet: {
          total: [{ $count: 'count' }],
          byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
          byPriority: [{ $group: { _id: '$priority', count: { $sum: 1 } } }],
          byCategory: [{ $group: { _id: '$category', count: { $sum: 1 } } }]
        }
      }
    ]),
    Request.find(matchStage)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email department')
      .lean(),
    Request.countDocuments({
      ...matchStage,
      dueDate: { $ne: null, $lt: now },
      status: { $ne: 'Resolved' }
    })
  ]);

  const facets = aggregationResult[0] || {};
  const total = facets.total?.[0]?.count || 0;

  res.status(200).json({
    success: true,
    message: 'Dashboard statistics fetched successfully',
    data: {
      total,
      overdue,
      byStatus: mapAggregationCounts(STATUSES, facets.byStatus || []),
      byPriority: mapAggregationCounts(PRIORITIES, facets.byPriority || []),
      byCategory: mapAggregationCounts(CATEGORIES, facets.byCategory || []),
      recent: recent.map((doc) => attachOverdueFlag(doc, now))
    }
  });
});
