import express from 'express';
import { login } from '../controllers/authController';
import { loginValidation, handleValidationErrors } from '../middleware/validation';

const router = express.Router();

router.post('/login', loginValidation, handleValidationErrors, login);

export default router;
