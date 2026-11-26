import { body, param } from 'express-validator';
import { CATEGORIES, PRIORITIES, STATUSES } from '../config/constants.js';

export const requestIdParamValidator = [
  param('id').isMongoId().withMessage('Invalid request ID format')
];

export const createRequestValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
  body('priority')
    .optional()
    .trim()
    .isIn(PRIORITIES)
    .withMessage(`Priority must be one of: ${PRIORITIES.join(', ')}`)
];

export const updateRequestValidator = [
  ...requestIdParamValidator,
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .optional()
    .trim()
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
  body('priority')
    .optional()
    .trim()
    .isIn(PRIORITIES)
    .withMessage(`Priority must be one of: ${PRIORITIES.join(', ')}`)
];

export const assignStaffValidator = [
  ...requestIdParamValidator,
  body('staffId')
    .notEmpty()
    .withMessage('Staff member is required')
    .isMongoId()
    .withMessage('Invalid staff ID format')
];

export const updateStatusValidator = [
  ...requestIdParamValidator,
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(STATUSES)
    .withMessage(`Status must be one of: ${STATUSES.join(', ')}`)
];
