import express from 'express';
import * as AddressController from '../controllers/address.controller.js';
import { protect } from '../shared/middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

// Address Management Routes
router.get('/user', AddressController.getAddresses);
router.post('/add', AddressController.createAddress);

// Legacy/Base Routes
router.get('/', AddressController.getAddresses);
router.post('/', AddressController.createAddress);
router.put('/:id', AddressController.updateAddress);
router.delete('/:id', AddressController.deleteAddress);

export default router;
