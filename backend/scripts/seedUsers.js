const mongoose = require('mongoose');
const User = require('../models/user');      
const Account = require('../models/account'); 
require('dotenv').config();

const names = [
  "John Smith", "Emma Wilson", "Michael Brown", "Sarah Davis", "James Johnson",
  "Lisa Anderson", "David Miller", "Jennifer Taylor", "Robert Jones", "Maria Garcia"
  // ... add more names if needed
];

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    // Clear existing users and accounts
    await User.deleteMany({});
    await Account.deleteMany({});
    console.log('Cleared existing data');

    const users = [];
    for (let name of names) {
      const [firstName, lastName] = name.split(' ');
      const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
      const email = `${username}@example.com`;
      
      const user = new User({
        username,
        email,
        firstName,
        lastName,
        password: '$2b$10$DJVx1xz3JyJQrswVP7HGiuoXpZCFUE8M5OyTMXtGHJSkBK.8nWqG6' // Password123
      });
      
      const savedUser = await user.save();
      console.log(`Created user: ${username}`);

      const account = new Account({
        userId: savedUser._id,
        balance: 1000 + Math.floor(Math.random() * 9000) // Random balance between 1000-10000
      });

      await account.save();
      console.log(`Created account for: ${username}`);
      
      users.push(savedUser);
    }

    console.log(`\nSuccessfully seeded ${users.length} users with accounts`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

seedUsers();