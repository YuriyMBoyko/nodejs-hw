import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
} from '../controllers/authController.js';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';

const router = Router();

// register User
router.post('/auth/register', celebrate(registerUserSchema), registerUser);

// login User
router.post('/auth/login', celebrate(loginUserSchema), loginUser);

// logout User
router.post('/auth/logout', logoutUser);

// refresh User
router.post('/auth/refresh', refreshUserSession);

export default router;
