import bcrypt from 'bcryptjs';
import { generateToken } from '../shared/auth/jwt.js';
import { User } from '../models/index.js';
import { CustomError } from '../shared/error-handling/customError.js';

export const registerUser = async (name, email, password, role = 'USER', phone) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new CustomError('User already exists', 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hashedPassword, role, phone });
  const token = generateToken({ id: user.id, role: user.role });

  const { password: _, ...userWithoutPassword } = user.toJSON();
  return { user: userWithoutPassword, token };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new CustomError('Invalid credentials', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new CustomError('Invalid credentials', 401);
  }

  const token = generateToken({ id: user.id, role: user.role });
  const { password: _, ...userWithoutPassword } = user.toJSON();

  return { user: userWithoutPassword, token };
};

export const getAllUsers = async () => {
  return await User.findAll({ attributes: { exclude: ['password'] } });
};

export const getUserById = async (id) => {
  const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
  if (!user) throw new CustomError('User not found', 404);
  return user;
};

export const updateProfile = async (id, data, isAdmin = false) => {
  const user = await User.findByPk(id);
  if (!user) throw new CustomError('User not found', 404);

  let updateData;
  if (isAdmin) {
    // Admin can update almost everything except fundamental DB fields
    const { id: _, password: __, ...filtered } = data;
    updateData = filtered;
  } else {
    // Users can only update their personal public info
    const { id: _, password: __, role: ___, isVerified: ____, email: _____, ...filtered } = data;
    updateData = filtered;
  }
  
  await user.update(updateData);
  
  const { password: _, ...updatedUser } = user.toJSON();
  return updatedUser;
};


