import { Router } from "express";
import { ReportController } from "../controller/ReportController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();
const reportController = new ReportController();

router.get('/', authenticate, reportController.getAll.bind(reportController));
router.get('/stats', authenticate, reportController.getStats.bind(reportController));
router.get('/range', authenticate, reportController.getByDateRange.bind(reportController));
router.get('/:id', authenticate, reportController.getById.bind(reportController));
router.post('/generate', authenticate, reportController.generate.bind(reportController));

export default router;
