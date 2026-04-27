import express from 'express';
import * as UserController from '../controllers/user.controller.js';
import { protect, authorize } from '../shared/middleware/auth.middleware.js';
import { uploadDocs, uploadAvatar } from '../shared/middleware/upload.middleware.js';

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/', protect, authorize('ADMIN'), UserController.getUsers);

router.get('/me', protect, UserController.getMe);
router.put('/update', protect, UserController.updateProfile);
router.put('/update/:id', protect, authorize('ADMIN'), UserController.updateUserProfileByAdmin);

router.post('/upload-doc', protect, uploadDocs.single('document'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
  res.status(200).json({ success: true, url: `/uploads/docs/${req.file.filename}` });
});

router.post('/bulk-upload', protect, uploadDocs.fields([
  { name: 'aadhaarImage', maxCount: 1 },
  { name: 'licenseImage', maxCount: 1 },
  { name: 'panImage', maxCount: 1 }
]), UserController.uploadDocuments);


router.post('/upload-avatar', protect, uploadAvatar.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
  res.status(200).json({ success: true, url: `/uploads/avatars/${req.file.filename}` });
});

export default router;



