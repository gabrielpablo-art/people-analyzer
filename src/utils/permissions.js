export const ROLES = {
    ADMIN: 'admin',
    HR: 'hr',
    EVALUATOR: 'evaluator',
    EMPLOYEE: 'employee',
    USER: 'user' // Legacy/Fallback alias
};

export const PERMISSIONS = {
    VIEW_DASHBOARD: 'view_dashboard',
    VIEW_FULL_ANALYTICS: 'view_full_analytics',
    MANAGE_EMPLOYEES: 'manage_employees',
    MANAGE_CORE_VALUES: 'manage_core_values',
    MANAGE_ACCOUNTABILITY_CHART: 'manage_accountability_chart',
    LAUNCH_EVALUATIONS: 'launch_evaluations',
    VIEW_OWN_FEEDBACK: 'view_own_feedback',
    VIEW_USERS: 'view_users',
    INVITE_USERS: 'invite_users',
};

const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: Object.values(PERMISSIONS),
    [ROLES.HR]: [
        PERMISSIONS.VIEW_DASHBOARD,
        PERMISSIONS.VIEW_FULL_ANALYTICS,
        PERMISSIONS.MANAGE_EMPLOYEES,
        PERMISSIONS.MANAGE_CORE_VALUES,
        PERMISSIONS.MANAGE_ACCOUNTABILITY_CHART,
        PERMISSIONS.LAUNCH_EVALUATIONS,
        PERMISSIONS.VIEW_OWN_FEEDBACK,
        PERMISSIONS.VIEW_USERS,
        PERMISSIONS.INVITE_USERS
    ],
    [ROLES.EVALUATOR]: [
        PERMISSIONS.VIEW_DASHBOARD,
        PERMISSIONS.VIEW_OWN_FEEDBACK,
    ],
    [ROLES.EMPLOYEE]: [
        PERMISSIONS.VIEW_DASHBOARD,
        PERMISSIONS.VIEW_OWN_FEEDBACK,
    ],
    [ROLES.USER]: [ // Alias for EMPLOYEE
        PERMISSIONS.VIEW_DASHBOARD,
        PERMISSIONS.VIEW_OWN_FEEDBACK,
    ]
};

/**
 * Checks if a user has a specific permission.
 * @param {Object} user - The user object containing roles.
 * @param {string} permission - The permission string to check.
 * @returns {boolean}
 */
export const hasPermission = (user, permission) => {
    if (!user) return false;

    // Support both new array format and legacy string format
    const userRoles = Array.isArray(user.roles) ? user.roles : [user.role].filter(Boolean);

    if (userRoles.length === 0) return false;

    // Check if any of the user's roles has the permission
    return userRoles.some(role => {
        const permissions = ROLE_PERMISSIONS[role] || [];
        return permissions.includes(permission);
    });
};

// Helper checks
export const isAdmin = (user) => hasRole(user, ROLES.ADMIN);
export const isHRAndAbove = (user) => hasRole(user, ROLES.ADMIN) || hasRole(user, ROLES.HR);
export const isEmployee = (user) => hasRole(user, ROLES.EMPLOYEE);
export const isEvaluator = (user) => hasRole(user, ROLES.EVALUATOR);

const hasRole = (user, role) => {
    if (!user) return false;
    const userRoles = Array.isArray(user.roles) ? user.roles : [user.role].filter(Boolean);
    return userRoles.includes(role);
};
