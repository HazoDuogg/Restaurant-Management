import { Router } from "express";
import { CustomerController } from "../controller/CustomerController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();
const customerController = new CustomerController();

router.get('/', authenticate, customerController.getAll.bind(customerController));
router.get('/:id', authenticate, customerController.getById.bind(customerController));
router.delete('/:id', authenticate, customerController.delete.bind(customerController));

export default router;
