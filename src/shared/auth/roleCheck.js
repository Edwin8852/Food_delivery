import { CustomError } from '../error-handling/customError.js';

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new CustomError('User role not authorized', 403));
    }
    next();
  };
};
