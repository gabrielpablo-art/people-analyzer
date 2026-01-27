import { useAuth } from '../contexts/AuthContext';
import { hasPermission, PERMISSIONS } from '../utils/permissions'; // Import shared logic

export function usePermissions() {
    const { currentUser, userProfile } = useAuth();

    // Merge auth user and profile if needed, but usually userProfile has the roles
    const userToCheck = userProfile || currentUser;

    const can = (permission) => {
        return hasPermission(userToCheck, permission);
    };

    const hasRole = (role) => {
        if (!userToCheck || !userToCheck.roles) return false;
        return userToCheck.roles.includes(role);
    };

    return {
        can,
        hasRole,
        PERMISSIONS
    };
}
