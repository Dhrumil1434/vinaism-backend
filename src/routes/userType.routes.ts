import { authenticateToken } from '@middleware-core';
import { Router } from 'express';
import {
  validateBody,
  validateParams,
} from 'middlewares/zodSchema.validator.middleware';
import { UserTypeController } from 'modules/user/userTypes/userType.controller';
import {
  userTypeCreateSchema,
  userTypeIdParamSchema,
  userTypeUpdateSchema,
} from 'modules/user/userTypes/validators/userType.validator';
import { captureActivityAfterAuth } from '../middlewares/activityCapture.middleware';
import { requireAbility } from 'middlewares/ability.middleware';
import { Action, Subject } from 'modules/auth/casl/casl.enum';

const router = Router();

router.post(
  '/',
  validateBody(userTypeCreateSchema),
  UserTypeController.createUserType
);

router.get(
  '/',
  authenticateToken,
  captureActivityAfterAuth,
  requireAbility(Action.READ, Subject.USER_TYPE),
  UserTypeController.getPaginatedUserTypes
);

router.get('/all', UserTypeController.getAllUserTypes);

router.put(
  '/:userTypeId',
  validateParams(userTypeIdParamSchema),
  validateBody(userTypeUpdateSchema),
  UserTypeController.updateUserTypes
);

router.patch(
  '/:userTypeId/active',
  authenticateToken,
  validateParams(userTypeIdParamSchema),
  captureActivityAfterAuth,
  UserTypeController.softDeleteUserType
);

router.delete(
  '/:userTypeId',
  validateParams(userTypeIdParamSchema),
  UserTypeController.hardDeleteUserType
);
export default router;
