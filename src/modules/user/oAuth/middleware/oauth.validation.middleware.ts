import { Request, Response, NextFunction } from 'express';
import { oauthLinkSchemaDto } from '../validators/oauth.dto';
import { validateBody } from '../../../../middlewares/zodSchema.validator.middleware';

/**
 * Middleware to validate OAuth link request body
 */
export const validateOAuthLinkRequest = validateBody(oauthLinkSchemaDto);

/**
 * Middleware to validate authenticated user (can be reused from auth middleware)
 */
export const requireAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // This should be replaced with your actual auth middleware
  // For now, it's just a placeholder
  const userId = (req.user as any)?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  return next();
};
