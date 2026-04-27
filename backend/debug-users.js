import sequelize from './src/config/db.js';

const run = async () => {
    try {
        const [users] = await sequelize.query('SELECT email, role, name, phone FROM users');
        console.log(JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
