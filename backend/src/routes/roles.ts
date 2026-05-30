import { Router } from "express";
import { RoleController } from "../controller/RoleController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();
const roleController = new RoleController();

router.get('/', authenticate, roleController.getAll.bind(roleController));
router.get('/:id', authenticate, roleController.getById.bind(roleController));
router.post('/', authenticate, roleController.create.bind(roleController));
router.put('/:id', authenticate, roleController.update.bind(roleController));
router.delete('/:id', authenticate, roleController.delete.bind(roleController));

export default router;
