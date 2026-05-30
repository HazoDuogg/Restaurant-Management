import { Router } from "express";
import { StaffController } from "../controller/StaffController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();
const staffController = new StaffController();

router.get('/', authenticate, staffController.getAll.bind(staffController));
router.get('/:id', authenticate, staffController.getById.bind(staffController));
router.post('/', authenticate, staffController.create.bind(staffController));
router.put('/:id', authenticate, staffController.update.bind(staffController));
router.delete('/:id', authenticate, staffController.delete.bind(staffController));

export default router;
