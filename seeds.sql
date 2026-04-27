-- Seed Data for Food Delivery App

-- 1. Insert a default admin and restaurant owner (Password: 'password123' - hashed for bcrypt later if needed, but for seeds we can just use strings if we don't have a seeder script)
-- Note: In a real app, passwords must be hashed. For this demonstration, the user should register via the UI.
-- However, we can add some restaurants and foods that will be immediately visible.

-- 2. Insert Restaurants
INSERT INTO restaurants (name, image_url, rating, delivery_time, location, category) VALUES
('The Gourmet Kitchen', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', 4.5, 30, 'Downtown, City center', 'Continental'),
('Spice Route', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80', 4.2, 25, 'Midtown Mall', 'Indian'),
('Burger Haven', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80', 4.0, 20, 'East Side Plaza', 'Fast Food'),
('Sushi Zen', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80', 4.8, 35, 'North Point', 'Japanese'),
('Pasta Palace', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80', 4.3, 30, 'West End', 'Italian');

-- 3. Insert Foods (Linking to restaurants using names for subquery)
-- The Gourmet Kitchen
INSERT INTO foods (restaurant_id, name, description, price, image_url, category) VALUES
((SELECT id FROM restaurants WHERE name = 'The Gourmet Kitchen'), 'Truffle Pasta', 'Creamy pasta with black truffle oil and parmesan.', 450, 'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?w=400&q=80', 'Main Course'),
((SELECT id FROM restaurants WHERE name = 'The Gourmet Kitchen'), 'Bruschetta', 'Toasted bread with tomatoes, garlic, and basil.', 250, 'https://images.unsplash.com/photo-1572656631137-7935297eff55?w=400&q=80', 'Starters');

-- Spice Route
INSERT INTO foods (restaurant_id, name, description, price, image_url, category) VALUES
((SELECT id FROM restaurants WHERE name = 'Spice Route'), 'Butter Chicken', 'Tender chicken in a rich tomato and butter gravy.', 380, 'https://images.unsplash.com/photo-1603894584202-93306d7928b8?w=400&q=80', 'Main Course'),
((SELECT id FROM restaurants WHERE name = 'Spice Route'), 'Paneer Tikka', 'Grilled cottage cheese with spices.', 280, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80', 'Starters');

-- Burger Haven
INSERT INTO foods (restaurant_id, name, description, price, image_url, category) VALUES
((SELECT id FROM restaurants WHERE name = 'Burger Haven'), 'Classic Cheeseburger', 'Juicy beef patty with cheddar cheese and fresh veggies.', 220, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', 'Main Course'),
((SELECT id FROM restaurants WHERE name = 'Burger Haven'), 'Onion Rings', 'Crispy batter-fried onion rings.', 120, 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&q=80', 'Snacks');

-- Sushi Zen
INSERT INTO foods (restaurant_id, name, description, price, image_url, category) VALUES
((SELECT id FROM restaurants WHERE name = 'Sushi Zen'), 'Salmon Nigiri', 'Fresh salmon slices over pressed rice.', 320, 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&q=80', 'Main Course'),
((SELECT id FROM restaurants WHERE name = 'Sushi Zen'), 'Miso Soup', 'Traditional fermented soybean paste soup.', 150, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80', 'Starters');

-- Pasta Palace
INSERT INTO foods (restaurant_id, name, description, price, image_url, category) VALUES
((SELECT id FROM restaurants WHERE name = 'Pasta Palace'), 'Lasagna', 'Layered pasta with meat sauce and cheese.', 400, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80', 'Main Course'),
((SELECT id FROM restaurants WHERE name = 'Pasta Palace'), 'Tiramisu', 'Classic Italian coffee-flavored dessert.', 180, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80', 'Desserts');
