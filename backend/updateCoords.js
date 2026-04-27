import sequelize from './src/config/db.js';

const updateData = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB...');

        // Update Restaurants with Coimbatore coordinates using raw SQL to avoid model mapping issues
        await sequelize.query(`
            UPDATE restaurants SET lat = 11.0183, lng = 76.9586 WHERE name = 'The Gourmet Kitchen';
            UPDATE restaurants SET lat = 11.0247, lng = 76.9440 WHERE name = 'Spice Route';
            UPDATE restaurants SET lat = 11.0117, lng = 76.9661 WHERE name = 'Burger Haven';
            UPDATE restaurants SET lat = 10.9997, lng = 76.9537 WHERE name = 'Sushi Zen';
            UPDATE restaurants SET lat = 11.0301, lng = 76.9740 WHERE name = 'Pasta Palace';
        `);

        // Update all user addresses with a default coordinate for testing
        await sequelize.query(`UPDATE addresses SET lat = 11.0168, lng = 76.9558`);

        console.log('✅ Coords updated successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Data update failed:', err.message);
        process.exit(1);
    }
};

updateData();
