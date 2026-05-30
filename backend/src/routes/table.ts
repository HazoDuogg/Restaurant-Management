import { Router } from "express";
import { TableController } from "../controller/TableController.js";

const router = Router();
const tableController = new TableController();

// ⚠️ Route cụ thể phải đặt TRƯỚC route có :id
router.get("/available", tableController.getAvailable);
router.get("/status/:status", tableController.getByStatus);
router.get("/", tableController.getAll);
router.get("/:id", tableController.getById);
router.post("/", tableController.create);
router.put("/:id", tableController.update);
router.patch("/:id/status", tableController.updateStatus);
router.delete("/:id", tableController.delete);

export default router;