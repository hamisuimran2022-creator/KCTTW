export const PRODUCTS = [
  {
    id: "cap-signature",
    name: "KCTTW Signature Luxe Cap",
    category: "caps",
    categoryName: "Signature Caps",
    price: 15000,
    originalPrice: 20000,
    image: "/images/cap.png",
    images: ["/images/cap.png", "/images/cap.jpg"],
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
    id: "collared-shirt-premium",
    name: "KCTTW Executive Collared Shirt",
    category: "shirts",
    categoryName: "Collared Shirts",
    price: 25000,
    originalPrice: 32000,
    image: "/assets/collared-shirt2.png",
    images: ["/assets/collared-shirt2.png", "/images/collared-shirt.jpg"],
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
    id: "round-neck-heavyweight",
    name: "KCTTW Heavyweight Round Neck Tee",
    category: "round-necks",
    categoryName: "Round Necks",
    price: 18000,
    originalPrice: 24000,
    image: "/images/round-neck.png",
    images: ["/images/round-neck.png", "/images/round-neck2.png", "/images/round-neck.jpg"],
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
    id: "round-neck-essential",
    name: "KCTTW Heritage Boxy Tee",
    category: "round-necks",
    categoryName: "Round Necks",
    price: 18000,
    originalPrice: 22000,
    image: "/images/round-neck2.png",
    images: ["/images/round-neck2.png", "/images/round-neck2.jpg"],
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

export const CATEGORIES = [
  { id: "all", name: "All Drops" },
  { id: "caps", name: "Signature Caps" },
  { id: "shirts", name: "Collared Shirts" },
  { id: "round-necks", name: "Round Necks" }
];
