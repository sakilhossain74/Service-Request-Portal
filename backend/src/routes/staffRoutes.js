
import { Router } from 'express';
import {
    getStaff,
    getAllStaff,
    createStaff,
    deactivateStaff,
    reactivateStaff
} from '../controllers/staffController.js';

import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = Router();

// All staff management routes require Admin authentication
router.use(protect, authorizeRoles(ROLES.ADMIN));

// Get active staff members for assignment
router.get('/', getStaff);

// Get all staff members (active and inactive)
router.get('/all', getAllStaff);

// Add a new employee
router.post('/', createStaff);

// Deactivate an employee
router.patch('/:id/deactivate', deactivateStaff);

// Reactivate an employee
router.patch('/:id/reactivate', reactivateStaff);

export default router;
