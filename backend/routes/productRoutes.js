const express = require("express");
const multer = require("multer");
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// Configure Multer for memory buffer upload
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Public Catalog routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin Product Management
router.post("/", protect, adminOnly, upload.single("image"), createProduct);
router.put("/:id", protect, adminOnly, upload.single("image"), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
