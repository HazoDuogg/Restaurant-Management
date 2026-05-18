import { Router } from "express";
import { ReservationController } from "../controller/ReservationController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();
const reservationController = new ReservationController();

router.get('/', reservationController.getAll.bind(reservationController));
router.get('/status/:status', reservationController.getByStatus.bind(reservationController));
router.get('/customer/:customerId', authenticate, reservationController.getByCustomer.bind(reservationController));
router.get('/:id', reservationController.getById.bind(reservationController));
router.post('/', reservationController.create.bind(reservationController));
router.patch('/:id', authenticate, reservationController.update.bind(reservationController));
router.patch('/:id/confirm', authenticate, reservationController.confirm.bind(reservationController));
router.patch('/:id/cancel', authenticate, reservationController.cancel.bind(reservationController));
router.patch('/:id/complete', authenticate, reservationController.complete.bind(reservationController));

export default router;
