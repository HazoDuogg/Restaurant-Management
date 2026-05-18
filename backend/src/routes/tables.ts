import { Router } from "express";
import { TableController } from "../controller/TableController.js";

const router = Router();
const tableController = new TableController();

router.get('/', tableController.getAll.bind(tableController));
router.get('/available', tableController.getAvailable.bind(tableController));
router.get('/status/:status', tableController.getByStatus.bind(tableController));
router.get('/:id', tableController.getById.bind(tableController));
router.post('/', tableController.create.bind(tableController));
router.put('/:id', tableController.update.bind(tableController));
router.patch('/:id/status', tableController.updateStatus.bind(tableController));
router.delete('/:id', tableController.delete.bind(tableController));

export default router;
