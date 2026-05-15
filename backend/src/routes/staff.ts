import { Router } from "express";
import { StaffController } from "../controller/StaffController.js";

const router = Router();
const staffController = new StaffController();

router.get("/", staffController.getAll);
router.get("/:id", staffController.getById);
router.post("/", staffController.create);
router.put("/:id", staffController.update);
router.delete("/:id", staffController.delete);

export default router;