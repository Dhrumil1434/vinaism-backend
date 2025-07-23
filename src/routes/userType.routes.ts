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

const router = Router();

router.post(
  '/',
  validateBody(userTypeCreateSchema),
  UserTypeController.createUserType
);

router.get('/', UserTypeController.getPaginatedUserTypes);

router.put(
  '/:userTypeId',
  validateParams(userTypeIdParamSchema),
  validateBody(userTypeUpdateSchema),
  UserTypeController.updateUserTypes
);
export default router;
