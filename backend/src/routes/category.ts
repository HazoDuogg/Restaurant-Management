import { Router } from "express";
import { CategoryController } from "../controller/CategoryController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = Router();
const categoryController = new CategoryController();

router.get('/', categoryController.getAll.bind(categoryController));
router.get('/:id', categoryController.getById.bind(categoryController));
router.post('/', authenticate, authorize('ADMIN'), categoryController.create.bind(categoryController));
router.put('/:id', authenticate, authorize('ADMIN'), categoryController.update.bind(categoryController));
router.delete('/:id', authenticate, authorize('ADMIN'), categoryController.delete.bind(categoryController));

export default router;
