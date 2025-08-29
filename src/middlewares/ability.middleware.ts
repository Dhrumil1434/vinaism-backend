import { Request, Response, NextFunction } from 'express';
import { defineAbilities } from '../modules/auth/casl/casl.ability';
import { Action, Subject } from '../modules/auth/casl/casl.enum';
import {
  CaslMessage,
  CaslErrorCode,
} from '../modules/auth/casl/casl.constants';
import {
  getUserTypeName,
  isValidAction,
  isValidSubject,
  resolveForbiddenMessage,
} from '../modules/auth/casl/casl.helpers';
import { ApiError } from '@utils-core';
import { StatusCodes } from 'http-status-codes';

/**
 * Authorization middleware using CASL ability
 * Usage per-route:
 *   router.post('/path', authenticateToken, requireAbility(Action.CREATE, Subject.PROJECT), handler)
 */
export const requireAbility = (action: Action, subject: Subject) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user;
    console.log(user);
    if (!user) {
      return next(
        new ApiError(
          'AUTHORIZATION',
          StatusCodes.UNAUTHORIZED,
          CaslErrorCode.AUTH_REQUIRED,
          CaslMessage.AUTH_REQUIRED
        )
      );
    }

    // Defensive enum validation (optional but helps catch integration errors)
    if (!isValidAction(action)) {
      return next(
        new ApiError(
          'AUTHORIZATION',
          StatusCodes.BAD_REQUEST,
          CaslErrorCode.INVALID_ACTION,
          CaslMessage.INVALID_ACTION
        )
      );
    }
    if (!isValidSubject(subject)) {
      return next(
        new ApiError(
          'AUTHORIZATION',
          StatusCodes.BAD_REQUEST,
          CaslErrorCode.INVALID_SUBJECT,
          CaslMessage.INVALID_SUBJECT
        )
      );
    }

    try {
      const typeName = getUserTypeName(user.userType);
      const ability = defineAbilities({ typeName });
      if (!ability.can(action as any, subject as any)) {
        const detail = resolveForbiddenMessage(action);
        return next(
          new ApiError(
            'AUTHORIZATION',
            StatusCodes.FORBIDDEN,
            CaslErrorCode.FORBIDDEN,
            detail
          )
        );
      }
      return next();
    } catch {
      return next(
        new ApiError(
          'AUTHORIZATION',
          StatusCodes.INTERNAL_SERVER_ERROR,
          CaslErrorCode.AUTHORIZATION_ERROR,
          CaslMessage.AUTHORIZATION_ERROR
        )
      );
    }
  };
};
