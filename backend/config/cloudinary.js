const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "demo",
    api_key: process.env.CLOUDINARY_API_KEY || "demo_key",
    api_secret: process.env.CLOUDINARY_API_SECRET || "demo_secret"
});

/**
 * Upload image buffer to Cloudinary with fallback to local base64/placeholder
 */
const uploadToCloudinary = async (buffer, options = {}) => {
    // If Cloudinary credentials are not set, return simulated upload URL
    if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        process.env.CLOUDINARY_CLOUD_NAME === "demo" ||
        !process.env.CLOUDINARY_API_KEY
    ) {
        console.log("📸 [CLOUDINARY DEV MOCK] Image uploaded in sandbox mode");
        return {
            secure_url: options.fallbackUrl || "/images/cap.png",
            public_id: `kcttw_mock_${Date.now()}`
        };
    }

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "kcttw_products",
                resource_type: "image",
                ...options
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    return reject(error);
                }
                resolve(result);
            }
        );

        uploadStream.end(buffer);
    });
};

module.exports = {
    cloudinary,
    uploadToCloudinary
};
