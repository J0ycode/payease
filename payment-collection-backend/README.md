# payment-collection-backend

> Node.js + Express + MongoDB backend for the Payment Collection App.

## Stack
- **Node.js** + **Express.js** — REST API
- **MongoDB** + **Mongoose** — Database & ODM
- **PM2** — Process manager for production

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/customers` | All active customers |
| GET | `/api/customers/:account_number` | Customer by account number |
| POST | `/api/payments` | Submit an EMI payment |
| GET | `/api/payments/:account_number` | Payment history for account |

### POST `/api/payments` — Request Body
```json
{
  "accountNumber": "ACC001",
  "paymentAmount": 4720
}
```

---

## Local Development

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)

### Setup

```bash
git clone https://github.com/your-username/payment-collection-backend.git
cd payment-collection-backend
npm install
cp .env.example .env
# Edit .env and set your MONGO_URI
```

### Environment Variables (`.env`)

```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/payment_db
NODE_ENV=development
```

### Seed Sample Data

```bash
npm run seed
# Inserts: ACC001 (Arun Kumar), ACC002 (Priya Nair), ACC003 (Rahul Mehta)
```

### Run Dev Server

```bash
npm run dev
# Server running on http://localhost:5001
```

---

## AWS EC2 Deployment

```bash
# 1. SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# 2. Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2
sudo npm install -g pm2

# 4. Clone repo
git clone https://github.com/your-username/payment-collection-backend.git
cd payment-collection-backend

# 5. Create .env
nano .env   # Add PORT, MONGO_URI, NODE_ENV=production

# 6. Install & start
npm install --production
pm2 start server.js --name payment-backend
pm2 save
pm2 startup

# 7. Open port 5001 in EC2 Security Group (inbound rule):
#    Custom TCP | Port 5001 | Source 0.0.0.0/0
```

### CI/CD (GitHub Actions)

Add these secrets to your GitHub repository:

| Secret | Value |
|--------|-------|
| `EC2_HOST` | Public IP of your EC2 instance |
| `EC2_SSH_KEY` | Contents of your `.pem` private key |

Every push to `main` auto-deploys via SSH.

---

## Data Models

### Customer
| Field | Type | Description |
|-------|------|-------------|
| accountNumber | String (unique) | Loan account identifier |
| customerName | String | Full name |
| issueDate | Date | Loan disbursement date |
| interestRate | Number | Annual rate (%) |
| tenure | Number | Duration in months |
| emiDue | Number | Monthly EMI amount (₹) |
| loanAmount | Number | Total loan amount (₹) |
| status | String | active / closed / defaulted |

### Payment
| Field | Type | Description |
|-------|------|-------------|
| customerId | ObjectId | Reference to Customer |
| accountNumber | String | Denormalized for fast queries |
| paymentDate | Date | When payment was made |
| paymentAmount | Number | Amount paid (₹) |
| status | String | success / failed / pending |
| transactionId | String | Auto-generated (TXNxxxxxxxxx) |
