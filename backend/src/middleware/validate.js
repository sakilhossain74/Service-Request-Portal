import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

// Collects express-validator errors and forwards a structured 400 ApiError
export const validate = (req, _res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array().map((err) => ({
    field: err.path || err.param || 'field',
    message: err.msg
  }));

  return next(new ApiError(400, errors[0]?.message || 'Validation failed', errors));
};
