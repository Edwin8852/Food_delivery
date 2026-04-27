import sequelize from './src/config/db.js';

const checkTables = async () => {
    try {
        await sequelize.authenticate();
        const [results, metadata] = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log('Tables in DB:', results.map(r => r.table_name));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkTables();
