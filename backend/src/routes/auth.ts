import { Router } from "express";
import AuthController from "../controller/AuthController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();
const authController = new AuthController();

router.post('/login', authController.login.bind(authController));
router.post('register', authController.register.bind(authController));
router.post('/logout', authenticate, authController.logout.bind(authController));
router.put('/change-password', authenticate, authController.changePassword.bind(authController));

export default router;