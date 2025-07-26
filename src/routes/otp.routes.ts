import { Router } from 'express';
import { OTPController } from '../modules/user/registration/otp.controller';
import { validateBody } from '../middlewares/zodSchema.validator.middleware';

const router = Router();

// OTP verification route
router.post('/verify', validateBody, OTPController.verifyOTP);

// OTP resend route
router.post('/resend', validateBody, OTPController.resendOTP);

export default router;
