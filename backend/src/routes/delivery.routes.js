import express from 'express';
import * as DeliveryController from '../controllers/delivery.controller.js';
import { protect, authorize } from '../shared/middleware/auth.middleware.js';
import { uploadDocs } from '../shared/middleware/upload.middleware.js';

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 📁 Ensure upload dir exists
const uploadDir = 'uploads/proof';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 📸 Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `proof-${Date.now()}${path.extname(file.originalname)}`)
});

const upload = multer({ storage });

const router = express.Router();

router.use(protect);
router.use(authorize('DELIVERY_PARTNER', 'ADMIN'));

router.get('/profile', DeliveryController.getProfile);
router.get('/orders', DeliveryController.getAssignedOrders);

router.put('/accept/:id', DeliveryController.acceptOrder);
router.put('/reject/:id', DeliveryController.rejectOrder);
router.put('/pickup/:id', DeliveryController.markPickedUp);
router.put('/ontheway/:id', DeliveryController.markOutForDelivery);
router.put('/deliver/:id', DeliveryController.markDelivered);


router.get('/history', DeliveryController.getHistory);
router.get('/earnings', DeliveryController.getEarnings);
router.put('/status', DeliveryController.updateOnlineStatus);
router.post('/location', DeliveryController.updateLocation);

// 🏦 Wallet & Payment proof
router.put('/payment/:id', DeliveryController.updatePaymentStatus);
router.post('/upload-docs', protect, uploadDocs.fields([
  { name: 'aadhaar_image', maxCount: 1 },
  { name: 'license_image', maxCount: 1 },
  { name: 'pan_image', maxCount: 1 }
]), DeliveryController.uploadDocuments);


router.post('/upload-proof/:id', upload.single('image'), (req, res) => {

  if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
  res.status(200).json({ success: true, url: `/uploads/proof/${req.file.filename}` });
});

export default router;
