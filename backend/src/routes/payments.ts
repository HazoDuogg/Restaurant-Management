import { Router } from "express";
import { PaymentController } from "../controller/PaymentController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();
const paymentController = new PaymentController();

router.get('/', authenticate, paymentController.getAll.bind(paymentController));
router.get('/invoice/:invoiceId', authenticate, paymentController.getByInvoice.bind(paymentController));
router.get('/:id', authenticate, paymentController.getById.bind(paymentController));
router.post('/', authenticate, paymentController.processPayment.bind(paymentController));

export default router;
