import sequelize from '../src/config/db.js';
import { MenuItem } from '../src/models/index.js';
import { Op } from 'sequelize';

const updates = [
    { search: '%Hara Bhara%', url: 'https://images.unsplash.com/photo-1606491956689-2ea8c5369512?q=80&w=800' },
    { search: '%Orange Juice%', url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=800' },
    { search: '%Mango Smoothie%', url: 'https://images.unsplash.com/photo-1523047974632-8032f72398d2?q=80&w=800' },
    { search: '%Lemonade%', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800' },
    { search: '%Tomato Soup%', url: 'https://images.unsplash.com/photo-1547592110-803652014eac?q=80&w=800' },
    { search: '%Paneer Tikka%', url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800' },
    { search: '%Samosa%', url: 'https://images.unsplash.com/photo-1625944525903-b98d5b7a82d1?q=80&w=800' }
];

async function updateDB() {
    try {
        console.log('⏳ Starting DB Image Sync (Robust Mode)...');
        for (const update of updates) {
            const [count] = await MenuItem.update(
                { imageUrl: update.url },
                { where: { name: { [Op.iLike]: update.search } } }
            );
            console.log(`✅ Updated ${count} entries matching "${update.search}"`);
        }
        console.log('🚀 DB Sync Complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Sync Failed:', error);
        process.exit(1);
    }
}

updateDB();
