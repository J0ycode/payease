# PayEase — Loan Payment Portal

> **Hiring Test Submission: iNav Technologies Pvt. Ltd**

PayEase is a complete end-to-end Payment Collection Mobile Web Application that simplifies EMI payments for loan customers.

## 🔗 Project Links

- **🚀 Live Deployment (Vercel)**: [https://payease-dthv.vercel.app/](https://payease-dthv.vercel.app/)
- **💻 GitHub Repository**: [https://github.com/J0ycode/payease.git](https://github.com/J0ycode/payease.git)

---

## 💡 Developer's Note

For the database layer, **MongoDB + Mongoose** has been chosen for implementation due to limited exposure to PostgreSQL. However, I have intermediate-level knowledge of **MySQL** and SQL database architecture.

---

## 🛠️ Stack & Architecture

This workspace contains two distinct modules:

| Module | Directory | Technology | Role |
|---|---|---|---|
| **Backend API** | [`/payment-collection-backend`](file:///C:/my_pc/bank_web/payment-collection-backend) | Node.js, Express, MongoDB (Mongoose) | REST API exposing customer lookup & payment history |
| **Mobile App** | [`/payment-collection-app`](file:///C:/my_pc/bank_web/payment-collection-app) | React Native (Expo SDK 51), React Navigation v6, Axios | Cross-platform web interface for EMI payments |

---

## 🚀 Quick Start Guide

### 1. Seeding & Running Backend
```bash
cd payment-collection-backend
npm install
# Configure MONGO_URI in .env
npm run seed
npm run dev
```
*Server runs on: http://localhost:5001*

### 2. Running Frontend
```bash
cd payment-collection-app
npm install --legacy-peer-deps
# Configure EXPO_PUBLIC_API_URL in .env
npx expo start --web
```
*Web client opens on: http://localhost:8081*

---

## 🧪 Seeding & Test Accounts

Use the following seeded accounts to test the search lookup and payment functionalities:

| Account Number | Customer Name | Monthly EMI | Original Loan |
|---|---|---|---|
| `ACC001` | Arun Kumar | ₹4,720 | ₹1,00,000 |
| `ACC002` | Priya Nair | ₹3,200 | ₹1,00,000 |
| `ACC003` | Rahul Mehta | ₹2,580 | ₹1,50,000 |
