import { Router } from 'express';
import { validateBody } from 'middlewares/zodSchema.validator.middleware';
import { UserTypeController } from 'modules/user/userTypes/userType.controller';
import { userTypeCreateSchema } from 'modules/user/userTypes/validators/userType.validator';

const router = Router();

router.post(
  '/',
  validateBody(userTypeCreateSchema),
  UserTypeController.createUserType
);

router.get('/', UserTypeController.getPaginatedUserTypes);

export default router;
