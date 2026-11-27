import { Router } from 'express';
import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  assignStaff,
  updateRequestStatus,
  updateDueDate
} from '../controllers/requestController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  createRequestValidator,
  updateRequestValidator,
  assignStaffValidator,
  updateStatusValidator,
  updateDueDateValidator,
  requestIdParamValidator
} from '../validators/requestValidators.js';
import { ROLES } from '../config/constants.js';

const router = Router();

router.use(protect);

router
  .route('/')
  .post(createRequestValidator, validate, createRequest)
  .get(getRequests);

router
  .route('/:id')
  .get(requestIdParamValidator, validate, getRequestById)
  .put(updateRequestValidator, validate, updateRequest)
  .delete(requestIdParamValidator, validate, deleteRequest);

router.patch(
  '/:id/assign',
  authorizeRoles(ROLES.ADMIN),
  assignStaffValidator,
  validate,
  assignStaff
);

router.patch(
  '/:id/status',
  authorizeRoles(ROLES.ADMIN),
  updateStatusValidator,
  validate,
  updateRequestStatus
);

router.patch(
  '/:id/due-date',
  authorizeRoles(ROLES.ADMIN),
  updateDueDateValidator,
  validate,
  updateDueDate
);

export default router;
