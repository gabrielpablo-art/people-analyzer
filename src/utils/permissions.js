export const ROLES = {
    OWNER: 'owner',
    HR_ADMIN: 'hr_admin',
    EMPLOYEE: 'employee'
};

export const PERMISSIONS = {
    VIEW_DASHBOARD: 'view_dashboard',
    VIEW_FULL_ANALYTICS: 'view_full_analytics',
    MANAGE_EMPLOYEES: 'manage_employees',
    MANAGE_CORE_VALUES: 'manage_core_values',
    MANAGE_ACCOUNTABILITY_CHART: 'manage_accountability_chart',
    LAUNCH_EVALUATIONS: 'launch_evaluations',
    VIEW_OWN_FEEDBACK: 'view_own_feedback',
};

const ROLE_PERMISSIONS = {
    [ROLES.OWNER]: Object.values(PERMISSIONS),
    [ROLES.HR_ADMIN]: [
        PERMISSIONS.VIEW_DASHBOARD,
        PERMISSIONS.VIEW_FULL_ANALYTICS,
        PERMISSIONS.MANAGE_EMPLOYEES,
        PERMISSIONS.MANAGE_CORE_VALUES,
        PERMISSIONS.MANAGE_ACCOUNTABILITY_CHART,
        PERMISSIONS.LAUNCH_EVALUATIONS,
        PERMISSIONS.VIEW_OWN_FEEDBACK,
    ],
    [ROLES.EMPLOYEE]: [
        PERMISSIONS.VIEW_DASHBOARD,
        PERMISSIONS.VIEW_OWN_FEEDBACK,
    ]
};

export const hasPermission = (user, permission) => {
    if (!user || !user.role) return false;
    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission);
};

export const isOwner = (user) => user?.role === ROLES.OWNER;
export const isHRAdmin = (user) => user?.role === ROLES.HR_ADMIN;
export const isEmployee = (user) => user?.role === ROLES.EMPLOYEE;
