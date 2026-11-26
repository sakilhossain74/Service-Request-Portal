import { Router } from 'express';
import { getStaff } from '../controllers/staffController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = Router();

router.get('/', protect, authorizeRoles(ROLES.ADMIN), getStaff);

export default router;
