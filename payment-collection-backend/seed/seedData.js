/**
 * Seed script — populates the database with sample loan customers for testing.
 * Run with: node seed/seedData.js
 *
 * WARNING: This deletes all existing Customer documents before inserting.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('../models/Customer');

const customers = [
  {
    accountNumber: 'ACC001',
    customerName: 'Arun Kumar',
    issueDate: new Date('2023-01-15'),
    interestRate: 12.5,
    tenure: 24,
    emiDue: 4720,
    loanAmount: 100000,
    status: 'active',
  },
  {
    accountNumber: 'ACC002',
    customerName: 'Priya Nair',
    issueDate: new Date('2023-06-01'),
    interestRate: 10.0,
    tenure: 36,
    emiDue: 3200,
    loanAmount: 100000,
    status: 'active',
  },
  {
    accountNumber: 'ACC003',
    customerName: 'Rahul Mehta',
    issueDate: new Date('2022-09-10'),
    interestRate: 11.0,
    tenure: 48,
    emiDue: 2580,
    loanAmount: 150000,
    status: 'active',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Customer.deleteMany();
    console.log('🗑️  Cleared existing customers');

    const inserted = await Customer.insertMany(customers);
    console.log(`🌱 Seeded ${inserted.length} customers:`);
    inserted.forEach((c) => console.log(`   • ${c.accountNumber} — ${c.customerName}`));

    console.log('\n✅ Seed complete!');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
