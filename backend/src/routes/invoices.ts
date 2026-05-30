import { Router } from "express";
import { InvoiceController } from "../controller/InvoiceController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();
const invoiceController = new InvoiceController();

router.get('/', authenticate, invoiceController.getAll.bind(invoiceController));
router.get('/order/:orderId', authenticate, invoiceController.getByOrder.bind(invoiceController));
router.get('/:id', authenticate, invoiceController.getById.bind(invoiceController));
router.get('/:id/details', authenticate, invoiceController.getDetailsByInvoice.bind(invoiceController));
router.post('/generate', authenticate, invoiceController.generateFromOrder.bind(invoiceController));
router.patch('/:id/paid', authenticate, invoiceController.markAsPaid.bind(invoiceController));
router.patch('/:id/cancel', authenticate, invoiceController.cancel.bind(invoiceController));

export default router;
