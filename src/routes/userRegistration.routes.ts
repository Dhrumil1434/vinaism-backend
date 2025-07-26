import { Router } from 'express';
import { UserRegistrationController } from '../modules/user/registration/registration.controller';
import { uploadProfilePicture } from '../modules/user/registration/middleware/profilePictureMulter.middleware';
import { profilePicturePreValidator } from '../modules/user/registration/middleware/profilePictureMulter.middleware';
import { validateBody } from '../middlewares/zodSchema.validator.middleware';
import { UserRegistrationInsertSchemaDto } from '../modules/user/registration/validators/registration.dtos';

const router = Router();

router.post(
  '/register',
  uploadProfilePicture,
  profilePicturePreValidator,
  validateBody(UserRegistrationInsertSchemaDto),
  UserRegistrationController.registerUser
);

// GET - Get paginated users with filters
router.get('/users', UserRegistrationController.getPaginatedUsers);

// GET - Get all users (active and inactive)
router.get('/users/all', UserRegistrationController.getAllUsers);

// GET - Get users by status
router.get(
  '/users/status/:status',
  UserRegistrationController.getUsersByStatus
);

// GET - Get user by ID
router.get('/users/:userId', UserRegistrationController.getUserById);

// GET - Get pending admin approval users
router.get(
  '/users/pending-approval',
  UserRegistrationController.getPendingAdminApproval
);

// GET - Get verified users
router.get('/users/verified', UserRegistrationController.getVerifiedUsers);

export default router;
