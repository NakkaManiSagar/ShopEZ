const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

// ── Models ──────────────────────────────────────────────
const User = require("./models/User");
const Product = require("./models/Product");
const Cart = require("./models/Cart");
const Order = require("./models/Order");

// ── Sample Data ─────────────────────────────────────────

const users = [
  {
    name: "Admin User",
    email: "admin@shopez.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Mani Sagar",
    email: "mani@shopez.com",
    password: "mani1234",
    role: "user",
  },
  {
    name: "Test Customer",
    email: "test@shopez.com",
    password: "test1234",
    role: "user",
  },
];

const products = [
  // ── Electronics ──────────────────────────────────────
  {
    name: "Apple MacBook Air M2",
    description: "13.6-inch Liquid Retina display, M2 chip, 8GB RAM, 256GB SSD. Incredibly thin and powerful laptop for professionals and students.",
    price: 114900,
    discountPrice: 99900,
    category: "Electronics",
    brand: "Apple",
    stock: 15,
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",    isFeatured: true,
    rating: 4.8,
    numReviews: 124,
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise cancellation, 30-hour battery life, multipoint connection. Crystal clear hands-free calling.",
    price: 29990,
    discountPrice: 24990,
    category: "Electronics",
    brand: "Sony",
    stock: 30,
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    isFeatured: true,
    rating: 4.7,
    numReviews: 89,
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "200MP camera, Snapdragon 8 Gen 3, 5000mAh battery, built-in S Pen. The ultimate Android flagship smartphone.",
    price: 134999,
    discountPrice: 119999,
    category: "Electronics",
    brand: "Samsung",
    stock: 20,
    thumbnail: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    isFeatured: true,
    rating: 4.6,
    numReviews: 203,
  },
  {
    name: "iPad Pro 12.9-inch M2",
    description: "Stunning Liquid Retina XDR display, M2 chip, ProMotion technology. Perfect for creative professionals.",
    price: 112900,
    discountPrice: 99900,
    category: "Electronics",
    brand: "Apple",
    stock: 12,
    thumbnail: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80",
    isFeatured: false,
    rating: 4.9,
    numReviews: 67,
  },
  {
    name: "LG 27-inch 4K Monitor",
    description: "27-inch UHD 4K IPS display, 99% sRGB, USB-C connectivity, height-adjustable stand. Perfect for designers and coders.",
    price: 34990,
    discountPrice: 28990,
    category: "Electronics",
    brand: "LG",
    stock: 18,
    thumbnail: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80",
    isFeatured: false,
    rating: 4.5,
    numReviews: 45,
  },
  {
    name: "Logitech MX Master 3S",
    description: "Advanced wireless mouse with 8K DPI sensor, MagSpeed scroll wheel, ergonomic design. Works on any surface.",
    price: 9995,
    discountPrice: 7995,
    category: "Electronics",
    brand: "Logitech",
    stock: 50,
    thumbnail: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
    isFeatured: false,
    rating: 4.7,
    numReviews: 312,
  },

  // ── Clothing ─────────────────────────────────────────
  {
    name: "Premium Cotton Oversized Tee",
    description: "100% organic cotton, relaxed fit, pre-washed for extra softness. Available in multiple colors. Sustainably made.",
    price: 1299,
    discountPrice: 899,
    category: "Clothing",
    brand: "Urban Threads",
    stock: 100,
    thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    isFeatured: true,
    rating: 4.4,
    numReviews: 156,
  },
  {
    name: "Slim Fit Chino Trousers",
    description: "Stretch cotton chino in a modern slim fit. Wrinkle-resistant fabric, multiple pockets, versatile for office or casual wear.",
    price: 2499,
    discountPrice: 1799,
    category: "Clothing",
    brand: "Marks & Spencer",
    stock: 75,
    thumbnail: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80",
    isFeatured: false,
    rating: 4.3,
    numReviews: 88,
  },
  {
    name: "Hooded Zip-Up Sweatshirt",
    description: "Heavyweight fleece hoodie with a kangaroo pocket, adjustable drawstring hood. Perfect for layering in colder months.",
    price: 1999,
    discountPrice: 1499,
    category: "Clothing",
    brand: "H&M",
    stock: 60,
    thumbnail: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&q=80",
    isFeatured: false,
    rating: 4.2,
    numReviews: 74,
  },
  {
    name: "Classic Denim Jacket",
    description: "Timeless denim jacket with a button-up front, chest pockets, and a comfortable regular fit. A wardrobe essential.",
    price: 3499,
    discountPrice: 2599,
    category: "Clothing",
    brand: "Levi's",
    stock: 40,
    thumbnail: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80",
    isFeatured: true,
    rating: 4.6,
    numReviews: 110,
  },

  // ── Footwear ──────────────────────────────────────────
  {
    name: "Nike Air Max 270",
    description: "Lifestyle sneakers with Max Air unit in the heel for all-day comfort. Mesh upper for breathability. Iconic silhouette.",
    price: 12995,
    discountPrice: 9995,
    category: "Footwear",
    brand: "Nike",
    stock: 35,
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    isFeatured: true,
    rating: 4.7,
    numReviews: 284,
  },
  {
    name: "Adidas Ultraboost 23",
    description: "Running shoes with responsive BOOST midsole, Primeknit upper for a sock-like fit. Continental rubber outsole for grip.",
    price: 17999,
    discountPrice: 13999,
    category: "Footwear",
    brand: "Adidas",
    stock: 28,
    thumbnail: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80",
    isFeatured: false,
    rating: 4.6,
    numReviews: 167,
  },
  {
    name: "Leather Chelsea Boots",
    description: "Genuine leather chelsea boots with elastic side panels, stacked heel, and a pull-on tab. Smart-casual versatility.",
    price: 5999,
    discountPrice: 4499,
    category: "Footwear",
    brand: "Clarks",
    stock: 22,
    thumbnail: "https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=500&q=80",
    isFeatured: false,
    rating: 4.4,
    numReviews: 56,
  },
  {
    name: "Puma RS-X Sneakers",
    description: "Bold retro-running design with thick sole, mesh upper, and leather overlays. Chunky and comfortable for everyday wear.",
    price: 8999,
    discountPrice: 6499,
    category: "Footwear",
    brand: "Puma",
    stock: 40,
    thumbnail: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80",
    isFeatured: false,
    rating: 4.3,
    numReviews: 93,
  },

  // ── Home & Living ─────────────────────────────────────
  {
    name: "Dyson V15 Detect Vacuum",
    description: "Cordless vacuum with laser dust detection, 60-minute runtime, HEPA filtration. Powerful suction for all floor types.",
    price: 52900,
    discountPrice: 44900,
    category: "Home & Living",
    brand: "Dyson",
    stock: 10,
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    isFeatured: true,
    rating: 4.8,
    numReviews: 72,
  },
  {
    name: "Instant Pot Duo 7-in-1",
    description: "7-in-1 electric pressure cooker — pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker & warmer.",
    price: 8999,
    discountPrice: 6499,
    category: "Home & Living",
    brand: "Instant Pot",
    stock: 25,
    thumbnail: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&q=80",
    isFeatured: false,
    rating: 4.7,
    numReviews: 198,
  },
  {
    name: "Minimal Desk Lamp LED",
    description: "Adjustable-arm LED desk lamp with 5 brightness levels, USB charging port, touch control, and eye-care technology.",
    price: 2499,
    discountPrice: 1799,
    category: "Home & Living",
    brand: "Philips",
    stock: 45,
    thumbnail: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80",
    isFeatured: false,
    rating: 4.4,
    numReviews: 123,
  },
  {
    name: "Bamboo Bedsheet Set",
    description: "400 thread count bamboo-derived viscose sheets. Silky soft, breathable, and hypoallergenic. Includes flat sheet, fitted sheet, and 2 pillowcases.",
    price: 3499,
    discountPrice: 2499,
    category: "Home & Living",
    brand: "Bedsure",
    stock: 60,
    thumbnail: "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=500&q=80",
    isFeatured: false,
    rating: 4.5,
    numReviews: 87,
  },

  // ── Books ─────────────────────────────────────────────
  {
    name: "Atomic Habits — James Clear",
    description: "An easy and proven way to build good habits and break bad ones. Over 10 million copies sold worldwide. Paperback edition.",
    price: 499,
    discountPrice: 349,
    category: "Books",
    brand: "Penguin",
    stock: 200,
    thumbnail: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80",
    isFeatured: true,
    rating: 4.9,
    numReviews: 542,
  },
  {
    name: "The Psychology of Money",
    description: "Timeless lessons on wealth, greed, and happiness by Morgan Housel. A must-read for anyone who wants to think clearly about money.",
    price: 399,
    discountPrice: 299,
    category: "Books",
    brand: "Jaico Publishing",
    stock: 150,
    thumbnail: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500&q=80",
    isFeatured: false,
    rating: 4.8,
    numReviews: 389,
  },
  {
    name: "Clean Code — Robert C. Martin",
    description: "A handbook of agile software craftsmanship. Learn to write clean, readable, and maintainable code. Essential for developers.",
    price: 699,
    discountPrice: 549,
    category: "Books",
    brand: "Prentice Hall",
    stock: 80,
    thumbnail: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80",
    isFeatured: false,
    rating: 4.7,
    numReviews: 211,
  },
  {
    name: "Deep Work — Cal Newport",
    description: "Rules for focused success in a distracted world. Cal Newport argues that deep work is becoming rare and valuable.",
    price: 449,
    discountPrice: 329,
    category: "Books",
    brand: "Piatkus",
    stock: 120,
    thumbnail: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80",
    isFeatured: false,
    rating: 4.6,
    numReviews: 178,
  },

  // ── Beauty ────────────────────────────────────────────
  {
    name: "The Ordinary Niacinamide 10%",
    description: "High-strength vitamin and mineral blemish formula. Reduces appearance of skin blemishes and congestion. 30ml.",
    price: 699,
    discountPrice: 549,
    category: "Beauty",
    brand: "The Ordinary",
    stock: 80,
    thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80",
    isFeatured: false,
    rating: 4.6,
    numReviews: 431,
  },
  {
    name: "Minimalist SPF 50 Sunscreen",
    description: "Lightweight, non-greasy mineral sunscreen with SPF 50 PA++++. No white cast. Suitable for all skin types. 50g.",
    price: 549,
    discountPrice: 399,
    category: "Beauty",
    brand: "Minimalist",
    stock: 95,
    thumbnail: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&q=80",
    isFeatured: true,
    rating: 4.7,
    numReviews: 267,
  },
  {
    name: "Biotique Bio Honey Gel Face Wash",
    description: "Wild honey and walnut face wash for oily skin. Removes excess oil without stripping moisture. 200ml.",
    price: 299,
    discountPrice: 199,
    category: "Beauty",
    brand: "Biotique",
    stock: 120,
    thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80",
    isFeatured: false,
    rating: 4.3,
    numReviews: 145,
  },

  // ── Sports ────────────────────────────────────────────
  {
    name: "Yoga Mat Premium 6mm",
    description: "Non-slip TPE yoga mat with alignment lines, 6mm thickness for joint support. Includes carry strap. 183cm x 61cm.",
    price: 1999,
    discountPrice: 1299,
    category: "Sports",
    brand: "Boldfit",
    stock: 55,
    thumbnail: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80",
    isFeatured: false,
    rating: 4.5,
    numReviews: 203,
  },
  {
    name: "Adjustable Dumbbell Set 20kg",
    description: "Space-saving adjustable dumbbell set from 2.5kg to 20kg. Quick-lock mechanism, ergonomic grip. Perfect for home gym.",
    price: 4999,
    discountPrice: 3799,
    category: "Sports",
    brand: "PowerBlock",
    stock: 20,
    thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80",
    isFeatured: true,
    rating: 4.6,
    numReviews: 91,
  },
  {
    name: "Whey Protein Isolate 1kg",
    description: "25g protein per serving, less than 1g fat, zero added sugar. Chocolate flavour. Supports muscle recovery and growth.",
    price: 2799,
    discountPrice: 1999,
    category: "Sports",
    brand: "MuscleBlaze",
    stock: 70,
    thumbnail: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&q=80",
    isFeatured: false,
    rating: 4.4,
    numReviews: 334,
  },
  {
    name: "Resistance Bands Set of 5",
    description: "Set of 5 latex resistance bands with varying resistance levels. Includes carry bag and exercise guide. Great for rehab and strength training.",
    price: 799,
    discountPrice: 549,
    category: "Sports",
    brand: "Strauss",
    stock: 90,
    thumbnail: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&q=80",
    isFeatured: false,
    rating: 4.3,
    numReviews: 176,
  },

  // ── Toys ──────────────────────────────────────────────
  {
    name: "LEGO Technic Bugatti Chiron",
    description: "3,599-piece Technic set replicating the Bugatti Chiron. Functional W16 engine, movable spoiler, and openable doors. For ages 16+.",
    price: 22999,
    discountPrice: 18999,
    category: "Toys",
    brand: "LEGO",
    stock: 8,
    thumbnail: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&q=80",
    isFeatured: true,
    rating: 4.9,
    numReviews: 48,
  },
  {
    name: "Hot Wheels 20-Car Gift Pack",
    description: "20 die-cast Hot Wheels cars in 1:64 scale. Random assortment of popular models. Collectible and perfect for gifting.",
    price: 999,
    discountPrice: 749,
    category: "Toys",
    brand: "Hot Wheels",
    stock: 50,
    thumbnail: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=500&q=80",
    isFeatured: false,
    rating: 4.5,
    numReviews: 112,
  },
  {
    name: "Funskool Monopoly Classic",
    description: "The classic property trading board game. Includes board, dice, tokens, houses, hotels, cards, and play money. 2–8 players.",
    price: 799,
    discountPrice: 599,
    category: "Toys",
    brand: "Funskool",
    stock: 65,
    thumbnail: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=500&q=80",
    isFeatured: false,
    rating: 4.4,
    numReviews: 89,
  },

  // ── Other ─────────────────────────────────────────────
  {
    name: "Leather Bifold Wallet",
    description: "Slim genuine leather bifold wallet with RFID blocking, 6 card slots, and a bill compartment. Minimalist and durable.",
    price: 1299,
    discountPrice: 899,
    category: "Other",
    brand: "Fossil",
    stock: 40,
    thumbnail: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80",
    isFeatured: false,
    rating: 4.5,
    numReviews: 134,
  },
  {
    name: "Stainless Steel Water Bottle 1L",
    description: "Double-wall vacuum insulated bottle keeps drinks cold 24 hours or hot 12 hours. BPA-free, leak-proof lid. 1 litre capacity.",
    price: 1499,
    discountPrice: 999,
    category: "Other",
    brand: "Hydro Flask",
    stock: 80,
    thumbnail: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80",
    isFeatured: false,
    rating: 4.7,
    numReviews: 256,
  },
  {
    name: "Moleskine Classic Notebook",
    description: "A5 hardcover ruled notebook with 240 pages, ribbon bookmark, and elastic closure. The legendary notebook for writers and thinkers.",
    price: 999,
    discountPrice: 749,
    category: "Other",
    brand: "Moleskine",
    stock: 100,
    thumbnail: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=500&q=80",
    isFeatured: false,
    rating: 4.6,
    numReviews: 189,
  },
  {
    name: "Portable Bluetooth Speaker",
    description: "360° surround sound, IPX7 waterproof, 20-hour battery, pair two for stereo. Compact and perfect for outdoor use.",
    price: 3999,
    discountPrice: 2799,
    category: "Electronics",
    brand: "JBL",
    stock: 35,
    thumbnail: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
    isFeatured: true,
    rating: 4.6,
    numReviews: 312,
  },
];

// ── Seeder ───────────────────────────────────────────────

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Wipe existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();
    console.log("🗑️  Cleared existing data");

    // Create users (passwords auto-hashed by pre-save hook)
    const createdUsers = await User.create(users);
    console.log(`👤 Created ${createdUsers.length} users`);

    // Create products
    const createdProducts = await Product.create(products);
    console.log(`📦 Created ${createdProducts.length} products`);

    console.log("\n✅ Database seeded successfully!\n");
    console.log("─────────────────────────────────────");
    console.log("🔑 Login Credentials:");
    console.log("   Admin  → admin@shopez.com  / admin123");
    console.log("   User   → mani@shopez.com   / mani1234");
    console.log("   Guest  → test@shopez.com   / test1234");
    console.log("─────────────────────────────────────\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeder error:", error.message);
    process.exit(1);
  }
};

// Run with: node seeder.js
// Destroy with: node seeder.js --destroy
if (process.argv[2] === "--destroy") {
  (async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();
    console.log("🗑️  All data destroyed");
    process.exit(0);
  })();
} else {
  seedDB();
}