import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const seedData = async () => {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Clear existing data (in correct order to handle foreign keys)
    console.log('🗑️ Clearing existing data...');
    await client.query('DELETE FROM cart CASCADE').catch(() => {});
    await client.query('DELETE FROM order_items CASCADE').catch(() => {});
    await client.query('DELETE FROM orders CASCADE').catch(() => {});
    await client.query('DELETE FROM foods CASCADE');
    await client.query('DELETE FROM restaurants CASCADE');

    // Insert Restaurants
    console.log('📍 Inserting Restaurants...');
    await client.query(`
      INSERT INTO restaurants (name, image_url, rating, delivery_time, location, category) VALUES
      ('The Gourmet Kitchen', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', 4.5, 30, 'Downtown, City center', 'Continental'),
      ('Spice Route', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80', 4.2, 25, 'Midtown Mall', 'Indian'),
      ('Burger Haven', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80', 4.0, 20, 'East Side Plaza', 'Fast Food'),
      ('Sushi Zen', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80', 4.8, 35, 'North Point', 'Japanese'),
      ('Pasta Palace', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80', 4.3, 30, 'West End', 'Italian')
    `);

    // Insert Foods (Menu Items) - Comprehensive Menu with All Categories
    console.log('🍽️ Inserting Menu Items...');
    
    const foodInserts = [
      // ================================
      // THE GOURMET KITCHEN
      // ================================
      // Starters
      {
        restaurant: 'The Gourmet Kitchen',
        name: 'Bruschetta with Tomato & Basil',
        description: 'Toasted bread with fresh tomatoes, garlic, and basil.',
        price: 250,
        image: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?w=400&q=80',
        category: 'Starters'
      },
      {
        restaurant: 'The Gourmet Kitchen',
        name: 'Garlic Bread with Herbs',
        description: 'Crispy bread brushed with garlic butter and Italian herbs.',
        price: 200,
        image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&q=80',
        category: 'Starters'
      },
      // Main Course
      {
        restaurant: 'The Gourmet Kitchen',
        name: 'Truffle Pasta Carbonara',
        description: 'Creamy pasta with black truffle oil and aged parmesan.',
        price: 450,
        image: 'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?w=400&q=80',
        category: 'Main Course'
      },
      {
        restaurant: 'The Gourmet Kitchen',
        name: 'Pan Seared Sea Bass',
        description: 'Fresh sea bass with lemon butter sauce and seasonal vegetables.',
        price: 520,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
        category: 'Main Course'
      },
      {
        restaurant: 'The Gourmet Kitchen',
        name: 'Beef Ribeye Steak',
        description: 'Grilled premium beef with truffle mashed potatoes.',
        price: 650,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
        category: 'Main Course'
      },
      // Snacks
      {
        restaurant: 'The Gourmet Kitchen',
        name: 'Cheese & Crackers Board',
        description: 'Selection of artisan cheeses and gourmet crackers.',
        price: 350,
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80',
        category: 'Snacks'
      },
      // Beverages
      {
        restaurant: 'The Gourmet Kitchen',
        name: 'House Red Wine',
        description: 'Premium Italian red wine (glass).',
        price: 250,
        image: 'https://images.unsplash.com/photo-1510812431401-41d2cab2707d?w=400&q=80',
        category: 'Beverages'
      },
      {
        restaurant: 'The Gourmet Kitchen',
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed organic orange juice.',
        price: 120,
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80',
        category: 'Beverages'
      },
      // Desserts
      {
        restaurant: 'The Gourmet Kitchen',
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with melting center and vanilla ice cream.',
        price: 280,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
        category: 'Desserts'
      },
      {
        restaurant: 'The Gourmet Kitchen',
        name: 'Tiramisu',
        description: 'Classic Italian layered dessert with mascarpone and espresso.',
        price: 220,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80',
        category: 'Desserts'
      },

      // ================================
      // SPICE ROUTE
      // ================================
      // Starters
      {
        restaurant: 'Spice Route',
        name: 'Paneer Tikka',
        description: 'Grilled cottage cheese marinated in yogurt and spices.',
        price: 280,
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80',
        category: 'Starters'
      },
      {
        restaurant: 'Spice Route',
        name: 'Samosa (2 pcs)',
        description: 'Crispy pastry filled with spiced potatoes and peas.',
        price: 150,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80',
        category: 'Starters'
      },
      {
        restaurant: 'Spice Route',
        name: 'Chicken 65',
        description: 'Spicy fried chicken chunks with curry leaves.',
        price: 320,
        image: 'https://images.unsplash.com/photo-1599003810694-47a6b0e3b9bb?w=400&q=80',
        category: 'Starters'
      },
      // Main Course
      {
        restaurant: 'Spice Route',
        name: 'Butter Chicken',
        description: 'Tender chicken in rich tomato and butter gravy.',
        price: 380,
        image: 'https://images.unsplash.com/photo-1603894584202-93306d7928b8?w=400&q=80',
        category: 'Main Course'
      },
      {
        restaurant: 'Spice Route',
        name: 'Biryani Rice',
        description: 'Aromatic fragrant rice with tender meat and spices.',
        price: 350,
        image: 'https://images.unsplash.com/photo-1612874742237-6526221fceed?w=400&q=80',
        category: 'Main Course'
      },
      {
        restaurant: 'Spice Route',
        name: 'Palak Paneer',
        description: 'Cottage cheese in creamy spinach curry.',
        price: 300,
        image: 'https://images.unsplash.com/photo-1596040565844-1a4defd78ef9?w=400&q=80',
        category: 'Main Course'
      },
      // Snacks
      {
        restaurant: 'Spice Route',
        name: 'Pakora (Mixed)',
        description: 'Assorted vegetables fried in gram flour batter.',
        price: 200,
        image: 'https://images.unsplash.com/photo-1585238341710-4853de3409da?w=400&q=80',
        category: 'Snacks'
      },
      // Beverages
      {
        restaurant: 'Spice Route',
        name: 'Mango Lassi',
        description: 'Yogurt-based drink with fresh mango.',
        price: 120,
        image: 'https://images.unsplash.com/photo-1553530666-ba2a8e36b1c5?w=400&q=80',
        category: 'Beverages'
      },
      {
        restaurant: 'Spice Route',
        name: 'Masala Chai',
        description: 'Traditional Indian spiced tea with milk.',
        price: 80,
        image: 'https://images.unsplash.com/photo-1597318097319-0d3f81df2c6f?w=400&q=80',
        category: 'Beverages'
      },
      // Desserts
      {
        restaurant: 'Spice Route',
        name: 'Gulab Jamun',
        description: 'Soft round pastry soaked in sugar syrup.',
        price: 150,
        image: 'https://images.unsplash.com/photo-1585088289688-86541deafbc0?w=400&q=80',
        category: 'Desserts'
      },

      // ================================
      // BURGER HAVEN
      // ================================
      // Starters
      {
        restaurant: 'Burger Haven',
        name: 'Chicken Wings (6 pcs)',
        description: 'Crispy wings with BBQ sauce.',
        price: 280,
        image: 'https://images.unsplash.com/photo-1585528638938-d5b3ef13ee60?w=400&q=80',
        category: 'Starters'
      },
      // Main Course
      {
        restaurant: 'Burger Haven',
        name: 'Classic Cheeseburger',
        description: 'Juicy beef patty with cheddar cheese and fresh vegetables.',
        price: 220,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
        category: 'Main Course'
      },
      {
        restaurant: 'Burger Haven',
        name: 'Double Bacon Burger',
        description: 'Double patty with crispy bacon, cheese, and sauce.',
        price: 320,
        image: 'https://images.unsplash.com/photo-1521462177385-6f62ee140204?w=400&q=80',
        category: 'Main Course'
      },
      {
        restaurant: 'Burger Haven',
        name: 'Grilled Chicken Burger',
        description: 'Tender grilled chicken breast with fresh toppings.',
        price: 200,
        image: 'https://images.unsplash.com/photo-1562547256-5-e67f59bac519?w=400&q=80',
        category: 'Main Course'
      },
      // Snacks
      {
        restaurant: 'Burger Haven',
        name: 'Onion Rings',
        description: 'Crispy batter-fried onion rings.',
        price: 120,
        image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&q=80',
        category: 'Snacks'
      },
      {
        restaurant: 'Burger Haven',
        name: 'Fries with Cheese',
        description: 'Golden fries topped with melted cheddar cheese.',
        price: 140,
        image: 'https://images.unsplash.com/photo-1599599810694-47a6b0e3b9bb?w=400&q=80',
        category: 'Snacks'
      },
      // Beverages
      {
        restaurant: 'Burger Haven',
        name: 'Coca Cola (Large)',
        description: 'Ice-cold cola drink.',
        price: 100,
        image: 'https://images.unsplash.com/photo-1554866585-3f5e548c68ae?w=400&q=80',
        category: 'Beverages'
      },
      {
        restaurant: 'Burger Haven',
        name: 'Milkshake - Vanilla',
        description: 'Creamy vanilla milkshake with whipped cream.',
        price: 150,
        image: 'https://images.unsplash.com/photo-1578272996442-48f60103fc96?w=400&q=80',
        category: 'Beverages'
      },
      // Desserts
      {
        restaurant: 'Burger Haven',
        name: 'Ice Cream Sundae',
        description: 'Vanilla ice cream with chocolate sauce and toppings.',
        price: 180,
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e157?w=400&q=80',
        category: 'Desserts'
      },

      // ================================
      // SUSHI ZEN
      // ================================
      // Starters
      {
        restaurant: 'Sushi Zen',
        name: 'Miso Soup',
        description: 'Traditional fermented soybean paste soup.',
        price: 150,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80',
        category: 'Starters'
      },
      {
        restaurant: 'Sushi Zen',
        name: 'Edamame',
        description: 'Boiled soybeans with sea salt.',
        price: 180,
        image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b5?w=400&q=80',
        category: 'Starters'
      },
      // Main Course
      {
        restaurant: 'Sushi Zen',
        name: 'Salmon Nigiri (8 pcs)',
        description: 'Fresh salmon slices over pressed rice.',
        price: 320,
        image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&q=80',
        category: 'Main Course'
      },
      {
        restaurant: 'Sushi Zen',
        name: 'California Roll',
        description: 'Crab, avocado, and cucumber rolled in rice and seaweed.',
        price: 280,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&q=80',
        category: 'Main Course'
      },
      {
        restaurant: 'Sushi Zen',
        name: 'Dragon Roll',
        description: 'Shrimp tempura and cucumber topped with avocado.',
        price: 350,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&q=80',
        category: 'Main Course'
      },
      // Snacks
      {
        restaurant: 'Sushi Zen',
        name: 'Gyoza (6 pcs)',
        description: 'Pan-fried dumplings with dipping sauce.',
        price: 200,
        image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b5?w=400&q=80',
        category: 'Snacks'
      },
      // Beverages
      {
        restaurant: 'Sushi Zen',
        name: 'Sake (1 glass)',
        description: 'Traditional Japanese rice wine.',
        price: 180,
        image: 'https://images.unsplash.com/photo-1510812431401-41d2cab2707d?w=400&q=80',
        category: 'Beverages'
      },
      {
        restaurant: 'Sushi Zen',
        name: 'Green Tea',
        description: 'Hot Japanese green tea.',
        price: 100,
        image: 'https://images.unsplash.com/photo-1597318097319-0d3f81df2c6f?w=400&q=80',
        category: 'Beverages'
      },
      // Desserts
      {
        restaurant: 'Sushi Zen',
        name: 'Mochi Ice Cream',
        description: 'Chewy rice cake wrapped around ice cream.',
        price: 150,
        image: 'https://images.unsplash.com/photo-1585088289688-86541deafbc0?w=400&q=80',
        category: 'Desserts'
      },

      // ================================
      // PASTA PALACE
      // ================================
      // Starters
      {
        restaurant: 'Pasta Palace',
        name: 'Caprese Salad',
        description: 'Fresh mozzarella, tomato, and basil with olive oil.',
        price: 200,
        image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80',
        category: 'Starters'
      },
      // Main Course
      {
        restaurant: 'Pasta Palace',
        name: 'Spaghetti Bolognese',
        description: 'Thin pasta with rich meat sauce and parmesan.',
        price: 320,
        image: 'https://images.unsplash.com/photo-1612874742237-6526221fceed?w=400&q=80',
        category: 'Main Course'
      },
      {
        restaurant: 'Pasta Palace',
        name: 'Fettuccine Alfredo',
        description: 'Ribbon pasta in creamy parmesan sauce.',
        price: 300,
        image: 'https://images.unsplash.com/photo-1645112411341-6c4ee32510fd?w=400&q=80',
        category: 'Main Course'
      },
      {
        restaurant: 'Pasta Palace',
        name: 'Lasagna',
        description: 'Layered pasta with meat sauce and melted cheese.',
        price: 400,
        image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80',
        category: 'Main Course'
      },
      {
        restaurant: 'Pasta Palace',
        name: 'Penne Arrabbiata',
        description: 'Tube pasta with spicy tomato and garlic sauce.',
        price: 280,
        image: 'https://images.unsplash.com/photo-1621996346565-411f2646c3d0?w=400&q=80',
        category: 'Main Course'
      },
      // Snacks
      {
        restaurant: 'Pasta Palace',
        name: 'Garlic Knots',
        description: 'Soft dough knots brushed with garlic butter.',
        price: 120,
        image: 'https://images.unsplash.com/photo-1585238341710-4853de3409da?w=400&q=80',
        category: 'Snacks'
      },
      // Beverages
      {
        restaurant: 'Pasta Palace',
        name: 'Chianti Wine (Glass)',
        description: 'Italian red wine from Tuscany.',
        price: 220,
        image: 'https://images.unsplash.com/photo-1510812431401-41d2cab2707d?w=400&q=80',
        category: 'Beverages'
      },
      {
        restaurant: 'Pasta Palace',
        name: 'Italian Soda',
        description: 'Sparkling water with Italian fruit syrup.',
        price: 100,
        image: 'https://images.unsplash.com/photo-1554866585-3f5e548c68ae?w=400&q=80',
        category: 'Beverages'
      },
      // Desserts
      {
        restaurant: 'Pasta Palace',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with mascarpone and espresso.',
        price: 220,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80',
        category: 'Desserts'
      },
      {
        restaurant: 'Pasta Palace',
        name: 'Panna Cotta',
        description: 'Smooth Italian cream dessert with berry compote.',
        price: 200,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
        category: 'Desserts'
      }
    ];

    for (const food of foodInserts) {
      await client.query(
        `INSERT INTO foods (restaurant_id, name, description, price, image_url, category) 
         VALUES (
           (SELECT id FROM restaurants WHERE name = $1),
           $2, $3, $4, $5, $6
         )
         ON CONFLICT DO NOTHING`,
        [food.restaurant, food.name, food.description, food.price, food.image, food.category]
      );
    }

    console.log('✅ All menu data inserted successfully!');

    // Verify the data with detailed breakdown
    const restaurantCount = await client.query('SELECT COUNT(*) FROM restaurants');
    const foodCount = await client.query('SELECT COUNT(*) FROM foods');
    
    // Get breakdown by category
    const categoryBreakdown = await client.query(`
      SELECT category, COUNT(*) as count 
      FROM foods 
      GROUP BY category 
      ORDER BY category
    `);
    
    // Get breakdown by restaurant
    const restaurantBreakdown = await client.query(`
      SELECT r.name, COUNT(f.id) as menu_count
      FROM restaurants r
      LEFT JOIN foods f ON r.id = f.restaurant_id
      GROUP BY r.id, r.name
      ORDER BY r.name
    `);
    
    console.log(`\n📊 DATABASE SUMMARY:`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`   Total Restaurants: ${restaurantCount.rows[0].count}`);
    console.log(`   Total Menu Items: ${foodCount.rows[0].count}`);
    
    console.log(`\n📂 BREAKDOWN BY CATEGORY:`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    categoryBreakdown.rows.forEach(row => {
      console.log(`   • ${row.category}: ${row.count} items`);
    });
    
    console.log(`\n🍽️ BREAKDOWN BY RESTAURANT:`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    restaurantBreakdown.rows.forEach(row => {
      console.log(`   • ${row.name}: ${row.menu_count} items`);
    });

  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n✅ Seeding complete!');
  }
};

seedData();
