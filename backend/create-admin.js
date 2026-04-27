import sequelize from './src/config/db.js';
import User from './src/models/user.model.js';
import bcrypt from 'bcryptjs';

const insertAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ where: { email: 'admin@gmail.com' } });
        if (existingAdmin) {
            console.log('Admin already exists! Updating password just in case...');
            const hashedPassword = await bcrypt.hash('admin@321', 10);
            existingAdmin.password = hashedPassword;
            // The user wants 'ADMIN' but our ENUM is lowercase 'admin'.
            // I will set it to 'admin'.
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log('Admin updated successfully.');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('admin@321', 10);
        
        await User.create({
            name: 'Super Admin',
            email: 'admin@gmail.com',
            password: hashedPassword,
            role: 'admin',
            phone: '0000000000'
        });
        
        console.log('Admin user perfectly inserted!');
        process.exit(0);
    } catch (err) {
        console.error('Failed to insert admin:', err);
        process.exit(1);
    }
};

insertAdmin();
