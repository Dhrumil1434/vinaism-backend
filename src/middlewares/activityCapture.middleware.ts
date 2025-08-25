import { Request, Response, NextFunction } from 'express';
import { ActivityLogService } from '../modules/activityLog/activityLog.service';

/**
 * Middleware to automatically capture activity data from all requests
 * This middleware captures request/response data and logs it to activity_logs table
 * without modifying existing console logs or requiring code changes
 */
export const captureActivity = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  // Capture request data
  const activityData = {
    endpoint: req.originalUrl,
    httpMethod: req.method,
    userAgent: req.get('User-Agent'),
    ipAddress: req.ip || req.connection.remoteAddress,
    requestBody: req.body,
    requestParams: req.params,
    requestQuery: req.query,
    userId: (req as any).user?.userId,
    userType: (req as any).user?.userType?.typeName,
    timestamp: new Date(),
    sessionId: (req as any).session?.id,
  };

  // Store in request for later use
  (req as any).activityData = activityData;

  // Override res.json to capture response data
  const originalJson = res.json;
  res.json = function (data) {
    const responseData = {
      ...activityData,
      responseBody: data,
      responseStatus: res.statusCode,
      processingTime: Date.now() - startTime,
      success: data?.success || false,
    };

    // Automatically log to activity_logs (non-blocking)
    ActivityLogService.capture(responseData).catch((error) => {
      // Don't let logging failures affect the response
      console.error('Activity log capture failed:', error);
    });

    // Call original res.json
    return originalJson.call(this, data);
  };

  // Override res.send for non-JSON responses
  const originalSend = res.send;
  res.send = function (data) {
    const responseData = {
      ...activityData,
      responseBody: typeof data === 'string' ? { message: data } : data,
      responseStatus: res.statusCode,
      processingTime: Date.now() - startTime,
      success: res.statusCode < 400,
    };

    // Automatically log to activity_logs (non-blocking)
    ActivityLogService.capture(responseData).catch((error) => {
      console.error('Activity log capture failed:', error);
    });

    // Call original res.send
    return originalSend.call(this, data);
  };

  // Override res.status to capture status changes
  const originalStatus = res.status;
  res.status = function (code) {
    // Store the status code for later use
    (res as any).statusCode = code;
    return originalStatus.call(this, code);
  };

  next();
};

/**
 * Middleware to capture activity AFTER authentication
 * This should be used after authenticateToken middleware
 * Usage: router.patch('/:id', authenticateToken, captureActivityAfterAuth, controller.method)
 */
export const captureActivityAfterAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  // Capture request data with user context (should be populated by authenticateToken)
  const activityData = {
    endpoint: req.originalUrl,
    httpMethod: req.method,
    userAgent: req.get('User-Agent'),
    ipAddress: req.ip || req.connection.remoteAddress,
    requestBody: req.body,
    requestParams: req.params,
    requestQuery: req.query,
    userId: (req as any).user?.userId,
    userType: (req as any).user?.userType?.typeName,
    timestamp: new Date(),
    sessionId: (req as any).session?.id,
    user: (req as any).user, // Complete user object for detailed context
  };

  // Store in request for later use
  (req as any).activityData = activityData;

  // Override res.json to capture response data
  const originalJson = res.json;
  res.json = function (data) {
    const responseData = {
      ...activityData,
      responseBody: data,
      responseStatus: res.statusCode,
      processingTime: Date.now() - startTime,
      success: data?.success || false,
    };

    // Automatically log to activity_logs (non-blocking)
    ActivityLogService.capture(responseData).catch((error) => {
      console.error('Activity log capture failed:', error);
    });

    // Call original res.json
    return originalJson.call(this, data);
  };

  // Override res.send for non-JSON responses
  const originalSend = res.send;
  res.send = function (data) {
    const responseData = {
      ...activityData,
      responseBody: typeof data === 'string' ? { message: data } : data,
      responseStatus: res.statusCode,
      processingTime: Date.now() - startTime,
      success: res.statusCode < 400,
    };

    // Automatically log to activity_logs (non-blocking)
    ActivityLogService.capture(responseData).catch((error) => {
      console.error('Activity log capture failed:', error);
    });

    // Call original res.send
    return originalSend.call(this, data);
  };

  // Override res.status to capture status changes
  const originalStatus = res.status;
  res.status = function (code) {
    // Store the status code for later use
    (res as any).statusCode = code;
    return originalStatus.call(this, code);
  };

  next();
};
