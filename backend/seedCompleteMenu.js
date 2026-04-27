// backend/seedCompleteMenu.js
import { MenuItem, Restaurant, Coupon } from './src/models/index.js';
import sequelize from './src/config/db.js';

// Import the data structure (I'll define it here for convenience in the script)
const foodData = {
  Starters: [
    { id: "11111111-1111-4111-a111-000000000001", name: "Paneer Tikka", price: 280, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398" },
    { id: "11111111-1111-4111-a111-000000000002", name: "Hara Bhara Kebab", price: 220, image: "https://images.unsplash.com/photo-1625944525903-b98d5b7a82d1" },
    { id: "11111111-1111-4111-a111-000000000003", name: "Aloo Tikki", price: 150, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950" },
    { id: "11111111-1111-4111-a111-000000000004", name: "Veg Spring Rolls", price: 180, image: "https://images.unsplash.com/photo-1604908176997-4311c1b9e9a2" },
    { id: "11111111-1111-4111-a111-000000000005", name: "Cheese Corn Balls", price: 200, image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0" },
    { id: "11111111-1111-4111-a111-000000000006", name: "Tomato Soup", price: 120, image: "https://images.unsplash.com/photo-1604908177225-7d8c4e1d3c0f" },
    { id: "11111111-1111-4111-a111-000000000007", name: "Sweet Corn Soup", price: 130, image: "https://images.unsplash.com/photo-1585238342028-4c9c7d9b4e1d" }
  ],
  MainCourse: [
    { id: "22222222-2222-4222-b222-000000000001", name: "Chicken Biryani", price: 350, image: "https://images.unsplash.com/photo-1633945274309-2c16c9682a8c" },
    { id: "22222222-2222-4222-b222-000000000002", name: "Mutton Biryani", price: 420, image: "https://images.unsplash.com/photo-1604908177453-7462950d54a6" },
    { id: "22222222-2222-4222-b222-000000000003", name: "Butter Chicken", price: 380, image: "https://images.unsplash.com/photo-1605478371310-a9f1e96b4ff4" },
    { id: "22222222-2222-4222-b222-000000000004", name: "Palak Paneer", price: 300, image: "https://images.unsplash.com/photo-1628294896516-0c5b1fbb3b70" },
    { id: "22222222-2222-4222-b222-000000000005", name: "Veg Meals", price: 250, image: "https://images.unsplash.com/photo-1604908177015-7b3f1c5f4f4d" }
  ],
  Snacks: [
    { id: "33333333-3333-4333-c333-000000000001", name: "Burger", price: 220, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd" },
    { id: "33333333-3333-4333-c333-000000000002", name: "French Fries", price: 120, image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90" },
    { id: "33333333-3333-4333-c333-000000000003", name: "Sandwich", price: 150, image: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f" },
    { id: "33333333-3333-4333-c333-000000000004", name: "Pizza", price: 300, image: "https://images.unsplash.com/photo-1548365328-9f547fb0953c" }
  ],
  Beverages: [
    { id: "44444444-4444-4444-d444-000000000001", name: "Mango Juice", price: 90, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b" },
    { id: "44444444-4444-4444-d444-000000000002", name: "Cold Coffee", price: 120, image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c" },
    { id: "44444444-4444-4444-d444-000000000003", name: "Lemon Juice", price: 60, image: "https://images.unsplash.com/photo-1551024709-8f23befc6d7f" },
    { id: "44444444-4444-4444-d444-000000000004", name: "Milkshake", price: 140, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699" }
  ],
  Desserts: [
    { id: "55555555-5555-4555-e555-000000000001", name: "Gulab Jamun", price: 120, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950" },
    { id: "55555555-5555-4555-e555-000000000002", name: "Rasgulla", price: 110, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7" },
    { id: "55555555-5555-4555-e555-000000000003", name: "Chocolate Cake", price: 180, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587" },
    { id: "55555555-5555-4555-e555-000000000004", name: "Ice Cream", price: 100, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93" },
    { id: "55555555-5555-4555-e555-000000000005", name: "Brownie", price: 150, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c" },
    { id: "55555555-5555-4555-e555-000000000006", name: "Cupcake", price: 90, image: "https://images.unsplash.com/photo-1587668178277-295251f900ce" },
    { id: "55555555-5555-4555-e555-000000000007", name: "Falooda", price: 140, image: "https://images.unsplash.com/photo-1626074353765-517a681e40be" }
  ]
};

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected');

        let restaurant = await Restaurant.findOne();
        if (!restaurant) {
            restaurant = await Restaurant.create({
                name: "The Antigravity Kitchen",
                address: "Core Grid, Sector 7",
                phone: "000-000-0000"
            });
        }

        const restaurantId = restaurant.id;

        for (const category in foodData) {
            for (const item of foodData[category]) {
                await MenuItem.upsert({
                    id: item.id,
                    restaurantId,
                    name: item.name,
                    price: item.price,
                    imageUrl: item.image,
                    category: category,
                    isAvailable: true
                });
            }
        }

        console.log('🚀 Menu Synchronization Successful');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed:', error);
        process.exit(1);
    }
};

seed();
