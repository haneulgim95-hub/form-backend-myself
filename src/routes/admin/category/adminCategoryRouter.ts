import { Router } from "express";
import adminCategoryController from "../../../controllers/admin/adminCategoryController.ts";
import { validate } from "../../../middlewares/validate.ts";
import { adminCreateCategorySchema } from "../../../schemas/category/createCategory.ts";
import { adminUpdateCategorySchema } from "../../../schemas/category/updateCategory.ts";

const router = Router();

router.get("/list", adminCategoryController.getCategoryList);
router.get("/:id", adminCategoryController.getCategoryById);
router.post("/create", validate(adminCreateCategorySchema), adminCategoryController.createCategory);
router.patch("/:id", validate(adminUpdateCategorySchema), adminCategoryController.updateCategory);
router.patch("/:id/status", adminCategoryController.toggleCategoryStatus);

export default router;
