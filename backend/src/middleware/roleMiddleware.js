import ApiError from '../utils/ApiError.js';

// Restricts route access to users whose role is included in allowedRoles
export const authorizeRoles = (...allowedRoles) => {
  return (req, _res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden: you do not have permission to perform this action'));
    }
    next();
  };
};
