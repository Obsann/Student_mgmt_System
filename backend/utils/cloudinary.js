const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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
  console.warn('WARNING: Cloudinary is not configured. File uploads will be processed and saved to local disk storage.');
}

let storage;

if (isConfigured) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'sms-review',
      allowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    },
  });
} else {
  const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });
}

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = { cloudinary, upload, isConfigured };
