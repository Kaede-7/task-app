const express = require("express");
const router = express.Router();
const categoryController = require("../Controller/CategoryController");

router.post("/create", categoryController.createCategory);
router.get("/get", categoryController.getCategories);
router.put("/update/:id", categoryController.updateCategory);
router.delete("/delete/:id", categoryController.deleteCategory);

module.exports = router;
