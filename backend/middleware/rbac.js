/**
 * Role-Based Access Control (RBAC) Middleware
 * 
 * Defines roles and their permissions for the application.
 */

// Define roles hierarchy and permissions
const ROLES = {
  EMPLOYEE: 'employee',
  HR: 'hr',
  ADMIN: 'admin'
};

// Define permissions for each role
const PERMISSIONS = {
  [ROLES.EMPLOYEE]: [
    'read:own_profile',
    'update:own_profile',
    'create:leave_request',
    'read:own_leave_requests'
  ],
  [ROLES.HR]: [
    'read:all_profiles',
    'update:employee_profiles',
    'create:department',
    'read:all_leave_requests',
    'approve:leave_requests',
    'reject:leave_requests',
    'read:payroll',
    'generate:payroll'
  ],
  [ROLES.ADMIN]: [
    'read:all_profiles',
    'create:employee',
    'update:employee_profiles',
    'delete:employee',
    'create:department',
    'update:department',
    'delete:department',
    'read:all_leave_requests',
    'approve:leave_requests',
    'reject:leave_requests',
    'read:payroll',
    'generate:payroll',
    'manage:users',
    'manage:system'
  ]
};

/**
 * Check if user has required role
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {Function} Express middleware
 */
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Check if user has required permission
 * @param {string} permission - Required permission
 * @returns {Function} Express middleware
 */
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }

    const userPermissions = PERMISSIONS[req.user.role] || [];
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required permission: ${permission}`
      });
    }

    next();
  };
};

/**
 * Check if user is accessing their own resource or has admin/HR role
 * @param {string} resourceOwnerId - ID of the resource owner
 * @returns {Function} Express middleware
 */
const checkOwnershipOrRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }

    // Check if user is admin or HR
    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    // Check if user is accessing their own resource
    const resourceOwnerId = req.params.id || req.body.userId;
    if (resourceOwnerId && resourceOwnerId.toString() === req.user._id.toString()) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: 'Access denied. You can only access your own resources.'
    });
  };
};

module.exports = {
  ROLES,
  PERMISSIONS,
  checkRole,
  checkPermission,
  checkOwnershipOrRole
};
