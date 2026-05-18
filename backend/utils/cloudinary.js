const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

const isConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                    process.env.CLOUDINARY_API_KEY && 
                    process.env.CLOUDINARY_API_SECRET &&
                    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.warn('WARNING: Cloudinary is not configured. File uploads will be processed in memory and NOT saved to the cloud.');
}

const storage = isConfigured ? new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sms-review',
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
  },
}) : multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = { cloudinary, upload, isConfigured };
