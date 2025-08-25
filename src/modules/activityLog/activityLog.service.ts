import { ApiError } from '@utils-core';
import { StatusCodes } from 'http-status-codes';
import { ActivityLogRepository } from './activityLog.repository';
import {
  ActivityLogActionType,
  ActivityLogResourceType,
  ActivityLogErrorCode,
} from './activityLog.constants';

export class ActivityLogService {
  static async capture(data: {
    endpoint: string;
    httpMethod: string;
    userAgent?: string | undefined;
    ipAddress?: string | undefined;
    requestBody?: any;
    requestParams?: any;
    requestQuery?: any;
    userId?: number;
    userType?: string;
    responseBody?: any;
    responseStatus?: number;
    processingTime?: number;
    success?: boolean;
    timestamp: Date;
    sessionId?: string;
    user?: any;
  }) {
    try {
      // Determine action type based on HTTP method and endpoint
      const actionType = this.determineActionType(
        data.httpMethod,
        data.endpoint
      );

      // Determine resource type from endpoint
      const resourceType = this.determineResourceType(data.endpoint);

      // Determine resource ID from request/response
      const resourceId = this.determineResourceId(data);

      // Create comprehensive details JSON
      const details = {
        endpoint: data.endpoint,
        httpMethod: data.httpMethod,
        userAgent: data.userAgent,
        requestData: {
          body: this.sanitizeData(data.requestBody),
          params: data.requestParams,
          query: data.requestQuery,
        },
        responseData: {
          status: data.responseStatus,
          body: this.sanitizeData(data.responseBody),
          processingTime: data.processingTime,
        },
        userContext: {
          userId: data.userId,
          userType: data.userType,
          sessionId: data.sessionId,
          user: data.user, // Complete user object for detailed context
        },
        businessContext: this.extractBusinessContext(data),
        systemContext: {
          timestamp: data.timestamp,
          success: data.success,
        },
      };

      // Store in database
      const result = await ActivityLogRepository.create({
        userId: data.userId || null,
        actionType,
        resourceType,
        resourceId,
        details: JSON.stringify(details),
        ipAddress: data.ipAddress || null,
      });

      return { logId: result.insertId, captured: true };
    } catch (error) {
      // Don't throw error for logging failures - just log to console
      console.error('Activity log capture failed:', error);
      return { logId: null, captured: false };
    }
  }

  static async listForUser(
    userId: number,
    opts: {
      page: number;
      limit: number;
      actionType?: string | undefined;
      resourceType?: string | undefined;
      startDate?: Date | undefined;
      endDate?: Date | undefined;
    }
  ) {
    try {
      return await ActivityLogRepository.listForUser(userId, opts);
    } catch {
      throw new ApiError(
        'ACTIVITY_LOG',
        StatusCodes.INTERNAL_SERVER_ERROR,
        ActivityLogErrorCode.DATABASE_ERROR,
        'Failed to fetch user activity logs'
      );
    }
  }

  static async listAll(opts: {
    page: number;
    limit: number;
    userId?: number | undefined;
    actionType?: string | undefined;
    resourceType?: string | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
  }) {
    try {
      return await ActivityLogRepository.listAll(opts);
    } catch {
      throw new ApiError(
        'ACTIVITY_LOG',
        StatusCodes.INTERNAL_SERVER_ERROR,
        ActivityLogErrorCode.DATABASE_ERROR,
        'Failed to fetch activity logs'
      );
    }
  }

  static async getById(logId: number) {
    try {
      const result = await ActivityLogRepository.getById(logId);
      if (!result) {
        throw new ApiError(
          'ACTIVITY_LOG',
          StatusCodes.NOT_FOUND,
          ActivityLogErrorCode.INVALID_DATA,
          'Activity log not found'
        );
      }
      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        'ACTIVITY_LOG',
        StatusCodes.INTERNAL_SERVER_ERROR,
        ActivityLogErrorCode.DATABASE_ERROR,
        'Failed to fetch activity log'
      );
    }
  }

  private static determineActionType(
    method: string,
    endpoint: string
  ): ActivityLogActionType {
    if (endpoint.includes('/login')) return ActivityLogActionType.LOGIN;
    if (endpoint.includes('/logout')) return ActivityLogActionType.LOGOUT;
    if (endpoint.includes('/verify')) return ActivityLogActionType.VERIFY;
    if (endpoint.includes('/approve') || endpoint.includes('/approval'))
      return ActivityLogActionType.APPROVAL;
    if (endpoint.includes('/link')) return ActivityLogActionType.LINK;
    if (endpoint.includes('/unlink')) return ActivityLogActionType.UNLINK;
    if (endpoint.includes('/assign')) return ActivityLogActionType.ASSIGN;
    if (endpoint.includes('/request')) return ActivityLogActionType.REQUEST;
    if (endpoint.includes('/submit')) return ActivityLogActionType.SUBMIT;

    // Default based on HTTP method
    switch (method.toUpperCase()) {
      case 'POST':
        return ActivityLogActionType.CREATE;
      case 'GET':
        return ActivityLogActionType.READ;
      case 'PUT':
      case 'PATCH':
        return ActivityLogActionType.UPDATE;
      case 'DELETE':
        return ActivityLogActionType.DELETE;
      default:
        return ActivityLogActionType.READ;
    }
  }

  private static determineResourceType(
    endpoint: string
  ): ActivityLogResourceType {
    if (endpoint.includes('/users') || endpoint.includes('/auth'))
      return ActivityLogResourceType.USER;
    if (endpoint.includes('/projects')) return ActivityLogResourceType.PROJECT;
    if (endpoint.includes('/notifications'))
      return ActivityLogResourceType.NOTIFICATION;
    if (endpoint.includes('/oauth'))
      return ActivityLogResourceType.OAUTH_METADATA;
    if (endpoint.includes('/id-cards')) return ActivityLogResourceType.ID_CARD;
    if (endpoint.includes('/time-logs'))
      return ActivityLogResourceType.TIME_LOG;
    if (endpoint.includes('/task-assignments'))
      return ActivityLogResourceType.TASK_ASSIGNMENT;
    if (endpoint.includes('/price-forms'))
      return ActivityLogResourceType.PRICE_FORM;
    if (endpoint.includes('/clients')) return ActivityLogResourceType.CLIENT;
    if (endpoint.includes('/workers')) return ActivityLogResourceType.WORKER;
    if (endpoint.includes('/designers'))
      return ActivityLogResourceType.DESIGNER;
    if (endpoint.includes('/suppliers'))
      return ActivityLogResourceType.SUPPLIER;
    if (endpoint.includes('/vendors')) return ActivityLogResourceType.VENDOR;
    if (endpoint.includes('/user-types'))
      return ActivityLogResourceType.USER_TYPE;
    if (endpoint.includes('/roles')) return ActivityLogResourceType.ROLE;
    if (endpoint.includes('/permissions'))
      return ActivityLogResourceType.PERMISSION;
    if (endpoint.includes('/login-sessions'))
      return ActivityLogResourceType.LOGIN_SESSION;
    if (endpoint.includes('/login-attempts'))
      return ActivityLogResourceType.LOGIN_ATTEMPT;
    if (endpoint.includes('/addresses')) return ActivityLogResourceType.ADDRESS;
    if (endpoint.includes('/contacts')) return ActivityLogResourceType.CONTACT;
    if (endpoint.includes('/project-space-details'))
      return ActivityLogResourceType.PROJECT_SPACE_DETAILS;
    if (endpoint.includes('/vendor-orders'))
      return ActivityLogResourceType.VENDOR_ORDER;
    if (endpoint.includes('/vendor-order-items'))
      return ActivityLogResourceType.VENDOR_ORDER_ITEMS;
    if (endpoint.includes('/vendor-categories'))
      return ActivityLogResourceType.VENDOR_CATEGORY;
    if (endpoint.includes('/user-roles'))
      return ActivityLogResourceType.USER_ROLE;
    if (endpoint.includes('/role-permissions'))
      return ActivityLogResourceType.ROLE_PERMISSION;

    return ActivityLogResourceType.GENERAL;
  }

  private static determineResourceId(data: any): string | null {
    // Extract ID from various sources
    return (
      data.requestParams?.id ||
      data.requestBody?.id ||
      data.responseBody?.data?.id ||
      data.responseBody?.data?.userId ||
      null
    );
  }

  private static extractBusinessContext(data: any): any {
    // Extract business-relevant data
    const context: any = {};

    if (data.requestBody?.projectId)
      context.projectId = data.requestBody.projectId;
    if (data.requestBody?.vendorId)
      context.vendorId = data.requestBody.vendorId;
    if (data.requestBody?.orderId) context.orderId = data.requestBody.orderId;
    if (data.requestBody?.clientId)
      context.clientId = data.requestBody.clientId;
    if (data.requestBody?.workerId)
      context.workerId = data.requestBody.workerId;
    if (data.requestBody?.designerId)
      context.designerId = data.requestBody.designerId;
    if (data.requestBody?.supplierId)
      context.supplierId = data.requestBody.supplierId;

    return context;
  }

  private static sanitizeData(data: any): any {
    // Remove sensitive information
    if (!data) return data;

    const sanitized = { ...data };
    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'otp',
      'accessToken',
      'refreshToken',
    ];

    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}
