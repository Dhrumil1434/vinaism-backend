export interface IOAuthLoginResponse {
  user: IOAuthUser;
  oauth: IOAuthMetadata;
  isNewUser: boolean;
  message: string;
}

export interface IOAuthUser {
  userId: number;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  userType: number;
  emailVerified: boolean;
  adminApproved: boolean;
}

export interface IOAuthMetadata {
  provider: string;
  providerEmail?: string | undefined;
  connectedAt?: string | undefined;
}

export interface IOAuthLinkRequest {
  provider: string;
  providerUserId: string;
  providerEmail?: string;
  providerName?: string;
  providerPicture?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface IOAuthResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface IOAuthConnection {
  id: number;
  provider: string;
  providerUserId: string;
  providerEmail?: string;
  providerName?: string;
  createdAt: string;
}
