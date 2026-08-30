const Product = require("../models/Product");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const { uploadToCloudinary } = require("../config/cloudinary");

// Default initial catalog for seeding
const DEFAULT_PRODUCTS = [
    {
        name: "KCTTW Signature Luxe Cap",
        category: "caps",
        categoryName: "Signature Caps",
        price: 15000,
        originalPrice: 20000,
        image: "/images/cap.png",
        description: "Handcrafted structured silhouette with embroidered luxury KCTTW crest, curved peak, and adjustable metallic buckle closure. Engineered for durability, style, and effortless swagger.",
        colors: [
            { name: "Black", hex: "#0a0a0a" },
            { name: "White", hex: "#f5f5f5" },
            { name: "Navy", hex: "#15294a" },
            { name: "Red", hex: "#c62828" }
        ],
        sizes: ["One Size Fits All"],
        tag: "BESTSELLER",
        isFeatured: true,
        rating: 4.9,
        reviewsCount: 142
    },
    {
        name: "KCTTW Executive Collared Shirt",
        category: "shirts",
        categoryName: "Collared Shirts",
        price: 25000,
        originalPrice: 32000,
        image: "/assets/collared-shirt2.png",
        description: "Tailored polo-style collared shirt fabricated with premium heavyweight breathable cotton. Features the signature subtle gold chest monogram, ribbed cuffs, and structured collar.",
        colors: [
            { name: "Black", hex: "#0a0a0a" },
            { name: "White", hex: "#f5f5f5" },
            { name: "Navy", hex: "#15294a" },
            { name: "Green", hex: "#168447" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        tag: "HOT DROP",
        isFeatured: true,
        rating: 4.8,
        reviewsCount: 98
    },
    {
        name: "KCTTW Heavyweight Round Neck Tee",
        category: "round-necks",
        categoryName: "Round Necks",
        price: 18000,
        originalPrice: 24000,
        image: "/images/round-neck.png",
        description: "280GSM ultra-dense luxury combed cotton tee designed with a modern oversized boxy streetwear cut, reinforced ribbed crew neckline, and screen-printed high-density emblem.",
        colors: [
            { name: "Black", hex: "#0a0a0a" },
            { name: "White", hex: "#f5f5f5" },
            { name: "Red", hex: "#c62828" },
            { name: "Yellow", hex: "#f2c94c" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        tag: "LIMITED EDITION",
        isFeatured: true,
        rating: 5.0,
        reviewsCount: 215
    },
    {
        name: "KCTTW Heritage Boxy Tee",
        category: "round-necks",
        categoryName: "Round Necks",
        price: 18000,
        originalPrice: 22000,
        image: "/images/round-neck2.png",
        description: "Clean minimal streetwear staple cut from supreme organic cotton with relaxed dropped shoulders and durable double-needle stitching for everyday luxury.",
        colors: [
            { name: "Black", hex: "#0a0a0a" },
            { name: "White", hex: "#f5f5f5" },
            { name: "Pink", hex: "#e96c91" },
            { name: "Purple", hex: "#7b3fc6" }
        ],
        sizes: ["S", "M", "L", "XL"],
        tag: "NEW DROP",
        isFeatured: false,
        rating: 4.7,
        reviewsCount: 76
    }
];

/**
 * Seed database if empty
 */
const ensureSeedProducts = async () => {
    try {
        const count = await Product.countDocuments();
        if (count === 0) {
            console.log("🌱 Seeding default KCTTW product drops...");
            await Product.insertMany(DEFAULT_PRODUCTS);
            console.log("✅ Default products seeded successfully.");
        }
    } catch (err) {
        // Continue silently if DB is temporarily offline
    }
};

/**
 * @desc    Get all products with filters
 * @route   GET /api/products
 * @access  Public
 */
const getAllProducts = async (req, res, next) => {
    try {
        await ensureSeedProducts();

        const { category, search, sort, featured } = req.query;
        let query = {};

        if (category && category !== "all") {
            query.category = category;
        }

        if (featured === "true") {
            query.isFeatured = true;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { categoryName: { $regex: search, $options: "i" } }
            ];
        }

        let sortOption = { createdAt: -1 };
        if (sort === "price-low") sortOption = { price: 1 };
        if (sort === "price-high") sortOption = { price: -1 };
        if (sort === "rating") sortOption = { rating: -1 };

        const products = await Product.find(query).sort(sortOption).lean();

        // If database is disconnected or returned empty list, return DEFAULT_PRODUCTS
        const resultList = products && products.length > 0 ? products : DEFAULT_PRODUCTS;

        return ApiResponse.success(res, "Products retrieved successfully.", {
            products: resultList,
            total: resultList.length
        });
    } catch (error) {
        // Fallback to static data if MongoDB is offline
        return ApiResponse.success(res, "Products retrieved (Static Fallback).", {
            products: DEFAULT_PRODUCTS,
            total: DEFAULT_PRODUCTS.length
        });
    }
};

/**
 * @desc    Get single product by ID or Slug
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        let product = null;

        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(id).lean();
        } else {
            product = await Product.findOne({ $or: [{ slug: id }, { name: { $regex: new RegExp(`^${id}$`, "i") } }] }).lean();
        }

        if (!product) {
            // Check default list
            product = DEFAULT_PRODUCTS.find((p) => p.name.toLowerCase().includes(id.toLowerCase()));
        }

        if (!product) {
            return next(ApiError.notFound("Product not found."));
        }

        return ApiResponse.success(res, "Product retrieved successfully.", { product });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create new product with optional Cloudinary image upload
 * @route   POST /api/products
 * @access  Private / Admin
 */
const createProduct = async (req, res, next) => {
    try {
        const { name, category, price, originalPrice, description, colors, sizes, tag, isFeatured, inStock } = req.body;

        if (!name || !price || !description) {
            return next(ApiError.badRequest("Please provide product name, price, and description."));
        }

        let imageUrl = req.body.image || "/images/cap.png";
        let cloudinaryPublicId = "";

        // Handle uploaded image file via Multer buffer
        if (req.file) {
            const uploadResult = await uploadToCloudinary(req.file.buffer, {
                folder: "kcttw_drops",
                public_id: `product_${Date.now()}`
            });
            imageUrl = uploadResult.secure_url;
            cloudinaryPublicId = uploadResult.public_id;
        }

        let parsedColors = [{ name: "Black", hex: "#0a0a0a" }];
        if (typeof colors === "string") {
            try {
                parsedColors = JSON.parse(colors);
            } catch (e) {
                parsedColors = colors.split(",").map((c) => ({ name: c.trim(), hex: "#0a0a0a" }));
            }
        } else if (Array.isArray(colors)) {
            parsedColors = colors;
        }

        let parsedSizes = ["Standard"];
        if (typeof sizes === "string") {
            try {
                parsedSizes = JSON.parse(sizes);
            } catch (e) {
                parsedSizes = sizes.split(",").map((s) => s.trim());
            }
        } else if (Array.isArray(sizes)) {
            parsedSizes = sizes;
        }

        const categoryNames = {
            caps: "Signature Caps",
            shirts: "Collared Shirts",
            "round-necks": "Round Necks",
            accessories: "Accessories",
            "limited-drops": "Limited Drops"
        };

        const product = await Product.create({
            name: name.trim(),
            category: category || "caps",
            categoryName: categoryNames[category] || "Signature Collection",
            price: Number(price),
            originalPrice: originalPrice ? Number(originalPrice) : 0,
            image: imageUrl,
            cloudinaryPublicId,
            description: description.trim(),
            colors: parsedColors,
            sizes: parsedSizes,
            tag: tag || "NEW DROP",
            isFeatured: isFeatured === true || isFeatured === "true",
            inStock: inStock !== false && inStock !== "false"
        });

        return ApiResponse.created(res, "Product drop created successfully.", { product });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private / Admin
 */
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        let product = await Product.findById(id);

        if (!product) {
            return next(ApiError.notFound("Product not found."));
        }

        if (req.file) {
            const uploadResult = await uploadToCloudinary(req.file.buffer, {
                folder: "kcttw_drops"
            });
            req.body.image = uploadResult.secure_url;
            req.body.cloudinaryPublicId = uploadResult.public_id;
        }

        Object.assign(product, req.body);
        await product.save();

        return ApiResponse.success(res, "Product updated successfully.", { product });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private / Admin
 */
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return next(ApiError.notFound("Product not found."));
        }

        return ApiResponse.success(res, "Product removed successfully.");
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
