// debug-coupons.js
import { Coupon } from './src/models/index.js';
import sequelize from './src/config/db.js';

const debug = async () => {
    const coupons = await Coupon.findAll();
    console.log(JSON.stringify(coupons, null, 2));
    process.exit(0);
};
debug();
