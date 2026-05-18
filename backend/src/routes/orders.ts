import { Router } from "express";
import { OrderController } from "../controller/OrderController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();
const orderController = new OrderController();

router.get('/', authenticate, orderController.getAll.bind(orderController));
router.get('/status/:status', authenticate, orderController.getByStatus.bind(orderController));
router.get('/table/:tableId', authenticate, orderController.getByTable.bind(orderController));
router.get('/:id', authenticate, orderController.getById.bind(orderController));
router.get('/:id/items', authenticate, orderController.getItemsByOrder.bind(orderController));
router.post('/', authenticate, orderController.create.bind(orderController));
router.post('/:id/items', authenticate, orderController.addItem.bind(orderController));
router.delete('/:id/items/:itemId', authenticate, orderController.removeItem.bind(orderController));
router.patch('/:id/confirm', authenticate, orderController.confirm.bind(orderController));
router.patch('/:id/complete', authenticate, orderController.complete.bind(orderController));
router.patch('/:id/cancel', authenticate, orderController.cancel.bind(orderController));

export default router;
