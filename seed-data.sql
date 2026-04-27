-- ============================================
-- FOOD DELIVERY APP - COMPREHENSIVE SEED DATA
-- ============================================
-- This file contains SQL INSERT statements for populating the database
-- Run this in PostgreSQL if you prefer not to use seedData.js
-- Make sure you're connected to the right database first!

-- ============================================
-- CLEAR EXISTING DATA (optional - uncomment if needed)
-- ============================================
-- DELETE FROM foods CASCADE;
-- DELETE FROM restaurants CASCADE;


-- ============================================
-- INSERT 5 RESTAURANTS
-- ============================================
INSERT INTO restaurants (name, image_url, rating, delivery_time, location, category, "createdAt", "updatedAt") VALUES
('The Gourmet Kitchen', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', 4.5, 30, 'Downtown, City center', 'Continental', NOW(), NOW()),
('Spice Route', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80', 4.2, 25, 'Midtown Mall', 'Indian', NOW(), NOW()),
('Burger Haven', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80', 4.0, 20, 'East Side Plaza', 'Fast Food', NOW(), NOW()),
('Sushi Zen', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80', 4.8, 35, 'North Point', 'Japanese', NOW(), NOW()),
('Pasta Palace', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80', 4.3, 30, 'West End', 'Italian', NOW(), NOW());


-- ============================================
-- INSERT MENU ITEMS (Foods)
-- ============================================

-- THE GOURMET KITCHEN (10 items)
INSERT INTO foods (restaurant_id, name, description, price, image_url, category, "createdAt", "updatedAt") VALUES
((SELECT id FROM restaurants WHERE name = 'The Gourmet Kitchen'), 'Bruschetta with Tomato & Basil', 'Toasted bread with fresh tomatoes, garlic, and basil.', 250, 'https://images.unsplash.com/photo-1572656631137-7935297eff55?w=400&q=80', 'Starters', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'The Gourmet Kitchen'), 'Garlic Bread with Herbs', 'Crispy bread brushed with garlic butter and Italian herbs.', 200, 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&q=80', 'Starters', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'The Gourmet Kitchen'), 'Truffle Pasta Carbonara', 'Creamy pasta with black truffle oil and aged parmesan.', 450, 'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?w=400&q=80', 'Main Course', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'The Gourmet Kitchen'), 'Pan Seared Sea Bass', 'Fresh sea bass with lemon butter sauce and seasonal vegetables.', 520, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', 'Main Course', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'The Gourmet Kitchen'), 'Beef Ribeye Steak', 'Grilled premium beef with truffle mashed potatoes.', 650, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', 'Main Course', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'The Gourmet Kitchen'), 'Cheese & Crackers Board', 'Selection of artisan cheeses and gourmet crackers.', 350, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80', 'Snacks', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'The Gourmet Kitchen'), 'House Red Wine', 'Premium Italian red wine (glass).', 250, 'https://images.unsplash.com/photo-1510812431401-41d2cab2707d?w=400&q=80', 'Beverages', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'The Gourmet Kitchen'), 'Fresh Orange Juice', 'Freshly squeezed organic orange juice.', 120, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80', 'Beverages', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'The Gourmet Kitchen'), 'Chocolate Lava Cake', 'Warm chocolate cake with melting center and vanilla ice cream.', 280, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', 'Desserts', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'The Gourmet Kitchen'), 'Tiramisu', 'Classic Italian layered dessert with mascarpone and espresso.', 220, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80', 'Desserts', NOW(), NOW());

-- SPICE ROUTE (10 items)
INSERT INTO foods (restaurant_id, name, description, price, image_url, category, "createdAt", "updatedAt") VALUES
((SELECT id FROM restaurants WHERE name = 'Spice Route'), 'Paneer Tikka', 'Grilled cottage cheese marinated in yogurt and spices.', 280, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80', 'Starters', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Spice Route'), 'Samosa (2 pcs)', 'Crispy pastry filled with spiced potatoes and peas.', 150, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80', 'Starters', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Spice Route'), 'Chicken 65', 'Spicy fried chicken chunks with curry leaves.', 320, 'https://images.unsplash.com/photo-1599003810694-47a6b0e3b9bb?w=400&q=80', 'Starters', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Spice Route'), 'Butter Chicken', 'Tender chicken in rich tomato and butter gravy.', 380, 'https://images.unsplash.com/photo-1603894584202-93306d7928b8?w=400&q=80', 'Main Course', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Spice Route'), 'Biryani Rice', 'Aromatic fragrant rice with tender meat and spices.', 350, 'https://images.unsplash.com/photo-1612874742237-6526221fceed?w=400&q=80', 'Main Course', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Spice Route'), 'Palak Paneer', 'Cottage cheese in creamy spinach curry.', 300, 'https://images.unsplash.com/photo-1596040565844-1a4defd78ef9?w=400&q=80', 'Main Course', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Spice Route'), 'Pakora (Mixed)', 'Assorted vegetables fried in gram flour batter.', 200, 'https://images.unsplash.com/photo-1585238341710-4853de3409da?w=400&q=80', 'Snacks', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Spice Route'), 'Mango Lassi', 'Yogurt-based drink with fresh mango.', 120, 'https://images.unsplash.com/photo-1553530666-ba2a8e36b1c5?w=400&q=80', 'Beverages', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Spice Route'), 'Masala Chai', 'Traditional Indian spiced tea with milk.', 80, 'https://images.unsplash.com/photo-1597318097319-0d3f81df2c6f?w=400&q=80', 'Beverages', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Spice Route'), 'Gulab Jamun', 'Soft round pastry soaked in sugar syrup.', 150, 'https://images.unsplash.com/photo-1585088289688-86541deafbc0?w=400&q=80', 'Desserts', NOW(), NOW());

-- BURGER HAVEN (9 items)
INSERT INTO foods (restaurant_id, name, description, price, image_url, category, "createdAt", "updatedAt") VALUES
((SELECT id FROM restaurants WHERE name = 'Burger Haven'), 'Chicken Wings (6 pcs)', 'Crispy wings with BBQ sauce.', 280, 'https://images.unsplash.com/photo-1585528638938-d5b3ef13ee60?w=400&q=80', 'Starters', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Burger Haven'), 'Classic Cheeseburger', 'Juicy beef patty with cheddar cheese and fresh vegetables.', 220, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', 'Main Course', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Burger Haven'), 'Double Bacon Burger', 'Double patty with crispy bacon, cheese, and sauce.', 320, 'https://images.unsplash.com/photo-1521462177385-6f62ee140204?w=400&q=80', 'Main Course', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Burger Haven'), 'Grilled Chicken Burger', 'Tender grilled chicken breast with fresh toppings.', 200, 'https://images.unsplash.com/photo-1562547256-5-e67f59bac519?w=400&q=80', 'Main Course', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Burger Haven'), 'Onion Rings', 'Crispy batter-fried onion rings.', 120, 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&q=80', 'Snacks', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Burger Haven'), 'Fries with Cheese', 'Golden fries topped with melted cheddar cheese.', 140, 'https://images.unsplash.com/photo-1599599810694-47a6b0e3b9bb?w=400&q=80', 'Snacks', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Burger Haven'), 'Coca Cola (Large)', 'Ice-cold cola drink.', 100, 'https://images.unsplash.com/photo-1554866585-3f5e548c68ae?w=400&q=80', 'Beverages', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Burger Haven'), 'Milkshake - Vanilla', 'Creamy vanilla milkshake with whipped cream.', 150, 'https://images.unsplash.com/photo-1578272996442-48f60103fc96?w=400&q=80', 'Beverages', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Burger Haven'), 'Ice Cream Sundae', 'Vanilla ice cream with chocolate sauce and toppings.', 180, 'https://images.unsplash.com/photo-1563805042-7684c019e157?w=400&q=80', 'Desserts', NOW(), NOW());

-- SUSHI ZEN (9 items)
INSERT INTO foods (restaurant_id, name, description, price, image_url, category, "createdAt", "updatedAt") VALUES
((SELECT id FROM restaurants WHERE name = 'Sushi Zen'), 'Miso Soup', 'Traditional fermented soybean paste soup.', 150, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80', 'Starters', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Sushi Zen'), 'Edamame', 'Boiled soybeans with sea salt.', 180, 'https://images.unsplash.com/photo-1609501676725-7186f017a4b5?w=400&q=80', 'Starters', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Sushi Zen'), 'Salmon Nigiri (8 pcs)', 'Fresh salmon slices over pressed rice.', 320, 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&q=80', 'Main Course', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Sushi Zen'), 'California Roll', 'Crab, avocado, and cucumber rolled in rice and seaweed.', 280, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&q=80', 'Main Course', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Sushi Zen'), 'Dragon Roll', 'Shrimp tempura and cucumber topped with avocado.', 350, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&q=80', 'Main Course', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Sushi Zen'), 'Gyoza (6 pcs)', 'Pan-fried dumplings with dipping sauce.', 200, 'https://images.unsplash.com/photo-1609501676725-7186f017a4b5?w=400&q=80', 'Snacks', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Sushi Zen'), 'Sake (1 glass)', 'Traditional Japanese rice wine.', 180, 'https://images.unsplash.com/photo-1510812431401-41d2cab2707d?w=400&q=80', 'Beverages', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Sushi Zen'), 'Green Tea', 'Hot Japanese green tea.', 100, 'https://images.unsplash.com/photo-1597318097319-0d3f81df2c6f?w=400&q=80', 'Beverages', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Sushi Zen'), 'Mochi Ice Cream', 'Chewy rice cake wrapped around ice cream.', 150, 'https://images.unsplash.com/photo-1585088289688-86541deafbc0?w=400&q=80', 'Desserts', NOW(), NOW());

-- PASTA PALACE (10 items)
INSERT INTO foods (restaurant_id, name, description, price, image_url, category, "createdAt", "updatedAt") VALUES
((SELECT id FROM restaurants WHERE name = 'Pasta Palace'), 'Caprese Salad', 'Fresh mozzarella, tomato, and basil with olive oil.', 200, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80', 'Starters', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Pasta Palace'), 'Spaghetti Bolognese', 'Thin pasta with rich meat sauce and parmesan.', 320, 'https://images.unsplash.com/photo-1612874742237-6526221fceed?w=400&q=80', 'Main Course', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Pasta Palace'), 'Fettuccine Alfredo', 'Ribbon pasta in creamy parmesan sauce.', 300, 'https://images.unsplash.com/photo-1645112411341-6c4ee32510fd?w=400&q=80', 'Main Course', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Pasta Palace'), 'Lasagna', 'Layered pasta with meat sauce and melted cheese.', 400, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80', 'Main Course', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Pasta Palace'), 'Penne Arrabbiata', 'Tube pasta with spicy tomato and garlic sauce.', 280, 'https://images.unsplash.com/photo-1621996346565-411f2646c3d0?w=400&q=80', 'Main Course', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Pasta Palace'), 'Garlic Knots', 'Soft dough knots brushed with garlic butter.', 120, 'https://images.unsplash.com/photo-1585238341710-4853de3409da?w=400&q=80', 'Snacks', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Pasta Palace'), 'Chianti Wine (Glass)', 'Italian red wine from Tuscany.', 220, 'https://images.unsplash.com/photo-1510812431401-41d2cab2707d?w=400&q=80', 'Beverages', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Pasta Palace'), 'Italian Soda', 'Sparkling water with Italian fruit syrup.', 100, 'https://images.unsplash.com/photo-1554866585-3f5e548c68ae?w=400&q=80', 'Beverages', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Pasta Palace'), 'Tiramisu', 'Classic Italian dessert with mascarpone and espresso.', 220, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80', 'Desserts', NOW(), NOW()),
((SELECT id FROM restaurants WHERE name = 'Pasta Palace'), 'Panna Cotta', 'Smooth Italian cream dessert with berry compote.', 200, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', 'Desserts', NOW(), NOW());


-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the data was inserted correctly:

-- SELECT COUNT(*) as total_restaurants FROM restaurants;
-- SELECT COUNT(*) as total_menu_items FROM foods;
-- SELECT category, COUNT(*) as count FROM foods GROUP BY category ORDER BY category;
-- SELECT r.name, COUNT(f.id) as menu_count FROM restaurants r LEFT JOIN foods f ON r.id = f.restaurant_id GROUP BY r.id, r.name ORDER BY r.name;

-- ============================================
-- END OF SEED DATA
-- ============================================
