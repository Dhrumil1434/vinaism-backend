import { ILoginUser } from '../login/login.types';

export interface IOAuthLoginResponse {
  user: ILoginUser;
  tokens: IOAuthTokens;
  expiresIn: number;
  oauth: IOAuthMetadata;
  isNewUser: boolean;
  message: string;
}

// Note: We use ILoginUser from login.types for consistency

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

export interface IOAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IOAuthConnection {
  id: number;
  provider: string;
  providerUserId: string;
  providerEmail?: string;
  providerName?: string;
  createdAt: string;
}

// New phone verification types
export interface IPhoneVerificationRequest {
  phoneNumber: string;
}

export interface IPhoneVerificationResponse {
  success: boolean;
  message: string;
  data: {
    userId: number;
    phoneNumber: string;
    otpSent: boolean;
    message: string;
  };
}

export interface IPhoneVerificationData {
  userId: number;
  phoneNumber: string;
  otpCode: string;
  otpExpiresAt: Date;
  isNewPhone: boolean;
}

export interface IPhoneUpdateData {
  userId: number;
  phoneNumber: string;
  phoneVerified: boolean;
}
