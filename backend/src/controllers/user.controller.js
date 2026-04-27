import * as UserService from '../services/user.service.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const { user, token } = await UserService.registerUser(name, email, password, role, phone);
    res.status(201).json({ success: true, message: 'User registered successfully', data: { user, token } });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await UserService.loginUser(email, password);
    res.status(200).json({ success: true, message: 'Login successful', data: { user, token } });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const data = await UserService.getAllUsers();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const data = await UserService.getUserById(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const data = await UserService.updateProfile(req.user.id, req.body, false);
    res.status(200).json({ success: true, message: 'Profile updated successfully', data });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfileByAdmin = async (req, res, next) => {
  try {
    const data = await UserService.updateProfile(req.params.id, req.body, true);
    res.status(200).json({ success: true, message: 'User profile updated by admin', data });
  } catch (error) {
    next(error);
  }
};

export const uploadDocuments = async (req, res, next) => {
  try {
    const { aadhaarNumber, licenseNumber, panNumber } = req.body;
    const updates = {
      aadhaarNumber,
      licenseNumber,
      panNumber,
      verificationStatus: 'PENDING'
    };

    if (req.files) {
      if (req.files.aadhaarImage) updates.aadhaarImage = `/uploads/docs/${req.files.aadhaarImage[0].filename}`;
      if (req.files.licenseImage) updates.licenseImage = `/uploads/docs/${req.files.licenseImage[0].filename}`;
      if (req.files.panImage) updates.panImage = `/uploads/docs/${req.files.panImage[0].filename}`;
    }

    const data = await UserService.updateProfile(req.user.id, updates, false);
    res.status(200).json({ success: true, message: 'Documents uploaded and awaiting approval', data });
  } catch (error) {
    next(error);
  }
};




