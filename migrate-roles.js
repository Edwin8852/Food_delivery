import sequelize from './src/config/db.js';
import bcrypt from 'bcryptjs';

const migrate = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ DB Connected');

        // Step 1: Drop the existing check constraint on role
        console.log('🔧 Dropping old role check constraint...');
        await sequelize.query(`ALTER TABLE users DROP CONSTRAINT IF EXISTS "users_role_check";`);
        console.log('✅ Old constraint removed.');

        // Step 2: Add new uppercase check constraint
        await sequelize.query(`
            ALTER TABLE users ADD CONSTRAINT "users_role_check"
            CHECK (role IN ('USER', 'ADMIN', 'RESTAURANT_OWNER', 'DELIVERY_PARTNER', 'user', 'admin', 'restaurant_owner', 'delivery_partner'));
        `);
        console.log('✅ New constraint added (supports both cases temporarily).');

        // Step 3: Update existing lowercase roles to uppercase
        await sequelize.query(`UPDATE users SET role = 'USER' WHERE role = 'user';`);
        await sequelize.query(`UPDATE users SET role = 'ADMIN' WHERE role = 'admin';`);
        await sequelize.query(`UPDATE users SET role = 'RESTAURANT_OWNER' WHERE role = 'restaurant_owner';`);
        await sequelize.query(`UPDATE users SET role = 'DELIVERY_PARTNER' WHERE role = 'delivery_partner';`);
        console.log('✅ Existing user roles updated to uppercase.');

        // Step 4: Replace constraint with uppercase-only
        await sequelize.query(`ALTER TABLE users DROP CONSTRAINT IF EXISTS "users_role_check";`);
        await sequelize.query(`
            ALTER TABLE users ADD CONSTRAINT "users_role_check"
            CHECK (role IN ('USER', 'ADMIN', 'RESTAURANT_OWNER', 'DELIVERY_PARTNER'));
        `);
        console.log('✅ Final constraint updated (uppercase only).');

        // Step 5: Ensure admin@gmail.com exists with ADMIN role
        const [admins] = await sequelize.query(`SELECT * FROM users WHERE email = 'admin@gmail.com'`);
        const hashedPassword = await bcrypt.hash('admin@321', 10);
        if (admins.length === 0) {
            await sequelize.query(`
                INSERT INTO users (id, name, email, password, role, "createdAt", "updatedAt")
                VALUES (gen_random_uuid(), 'Super Admin', 'admin@gmail.com', '${hashedPassword}', 'ADMIN', NOW(), NOW())
            `);
            console.log('✅ Admin user created: admin@gmail.com / admin@321');
        } else {
            await sequelize.query(`UPDATE users SET role = 'ADMIN', password = '${hashedPassword}' WHERE email = 'admin@gmail.com';`);
            console.log('✅ Admin user updated with ADMIN role and correct password.');
        }

        // Show final user table
        const [users] = await sequelize.query('SELECT email, role FROM users');
        console.log('\n📋 Current Users in DB:');
        console.table(users);

        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    }
};

migrate();
