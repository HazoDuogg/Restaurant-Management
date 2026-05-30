import { Router } from "express";
import MenuItemController from "../controller/MenuItemController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();
const menuItemController = new MenuItemController();

router.get('/', menuItemController.getAll.bind(menuItemController));
router.get('/available', menuItemController.getAvailable.bind(menuItemController));
router.get('/category/:id', menuItemController.getByCategory.bind(menuItemController));
router.get('/:id', menuItemController.getById.bind(menuItemController));
router.post('/', authenticate, menuItemController.create.bind(menuItemController));
router.put('/:id', authenticate, menuItemController.update.bind(menuItemController));
router.patch('/:id/status', authenticate, menuItemController.updateStatus.bind(menuItemController));
router.delete('/:id', authenticate, menuItemController.delete.bind(menuItemController));

export default router;
