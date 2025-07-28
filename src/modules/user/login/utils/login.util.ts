import { UserTypeSchemaRepo } from '../../userTypes/userTypeSchema.repository';
import { ILoginUser } from '../login.types';

/**
 * Transform user data for login response
 */
export const transformUserForLogin = async (user: any): Promise<ILoginUser> => {
  const userTypeArr = user.userType
    ? await UserTypeSchemaRepo.getById(user.userType)
    : null;
  const userType = userTypeArr?.[0] || null;

  return {
    userId: user.userId,
    userName: user.userName,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    userType: userType
      ? {
          ...userType,
          typeName: userType.typeName || '',
          is_active: userType.is_active || false,
        }
      : null,
    profilePicture: user.profilePicture,
    email_verified: user.email_verified,
    phone_verified: user.phone_verified,
    admin_approved: user.admin_approved,
  };
};

/**
 * Validate user status for login
 */
export const validateUserStatus = (user: any): void => {
  if (!user.email_verified) {
    throw new Error('Please verify your email first');
  }

  if (!user.admin_approved) {
    throw new Error('Account is not approved by admin');
  }

  if (!user.is_active) {
    throw new Error('Account is inactive');
  }
};

/**
 * Calculate lockout time based on attempts
 */
export const calculateLockoutTime = (attempts: number): Date => {
  const lockoutMinutes = Math.min(attempts * 5, 30); // Max 30 minutes
  const lockoutTime = new Date();
  lockoutTime.setMinutes(lockoutTime.getMinutes() + lockoutMinutes);
  return lockoutTime;
};

/**
 * Get user agent info for security tracking
 */
export const getUserAgentInfo = (userAgent?: string) => {
  if (!userAgent) return null;

  // Basic user agent parsing
  const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
  const isTablet = /Tablet|iPad/.test(userAgent);
  const browser = userAgent.includes('Chrome')
    ? 'Chrome'
    : userAgent.includes('Firefox')
      ? 'Firefox'
      : userAgent.includes('Safari')
        ? 'Safari'
        : userAgent.includes('Edge')
          ? 'Edge'
          : 'Unknown';

  return {
    isMobile,
    isTablet,
    browser,
    userAgent: userAgent.substring(0, 500), // Limit length
  };
};

/**
 * Validate IP address format
 */
export const validateIpAddress = (ipAddress?: string): string | null => {
  if (!ipAddress) return null;

  // Basic IP validation
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  if (ipv4Regex.test(ipAddress) || ipv6Regex.test(ipAddress)) {
    return ipAddress;
  }

  return null;
};
