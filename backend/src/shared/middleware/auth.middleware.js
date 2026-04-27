import { verifyToken } from '../auth/jwt.js';
import { CustomError } from '../error-handling/customError.js';

export const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.warn('🔓 [AUTH] Access Denied: No Token Provided');
    return next(new CustomError('Not authorized to access this route', 401));
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    console.log(`🔑 [AUTH] Token Verified: ID ${decoded.id} | Role: ${decoded.role}`);
    next();
  } catch (err) {
    console.error('❌ [AUTH] JWT Verification Failure:', err.message);
    return next(new CustomError('Not authorized, token failed', 401));
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user && req.user.role ? req.user.role.toUpperCase() : 'NONE';
    const authorizedRoles = roles.map(r => r.toUpperCase());
    
    console.log(`🛡️ [AUTH] Validating Access: Requested Roles [${authorizedRoles}] | Actual Role [${userRole}]`);

    if (!authorizedRoles.includes(userRole)) {
      console.warn(`⛔ [AUTH] Forbidden: Role ${userRole} lacks permission for this grid node`);
      return next(new CustomError(`Role ${userRole} is not authorized to access this route`, 403));
    }
    next();
  };
};

