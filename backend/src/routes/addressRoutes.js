import express from 'express';
import { getAddresses, createAddress } from '../controllers/addressController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/user', authMiddleware, getAddresses);
router.post('/add', authMiddleware, createAddress);

export default router;
