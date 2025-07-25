import { Router } from 'express';
import { validateBody } from 'middlewares/zodSchema.validator.middleware';
import {
  profilePicturePreValidator,
  uploadProfilePicture,
} from 'modules/user/registration/middleware/profilePictureMulter.middleware';
import { UserRegistrationController } from 'modules/user/registration/registration.controller';
import { UserRegistrationInsertSchemaDto } from 'modules/user/registration/validators/registration.dtos';
const router = Router();

router.post(
  '/register',
  uploadProfilePicture,
  profilePicturePreValidator,
  validateBody(UserRegistrationInsertSchemaDto),
  UserRegistrationController.registerUser
);
export default router;
