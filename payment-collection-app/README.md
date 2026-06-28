# payment-collection-app

> React Native (Expo) mobile app for EMI payment collection.

### 🔗 Project Links
- **🚀 Live App (Vercel)**: [https://payease-dthv.vercel.app/](https://payease-dthv.vercel.app/)
- **💻 GitHub Repository**: [https://github.com/J0ycode/payease.git](https://github.com/J0ycode/payease.git)

## Stack
- **React Native** + **Expo** SDK 51
- **React Navigation** — Native Stack
- **Axios** — HTTP client
- **react-native-dotenv** — Environment variable injection

---

## Screen Flow

```
HomeScreen          → Enter account number → Search
  └── LoanDetailScreen   → View loan info + payment form
        ├── SuccessScreen        → Payment confirmation + transaction ID
        └── PaymentHistoryScreen → All past payments
```

---

## Quick Start

### Prerequisites
- Node.js >= 18
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator / Android Emulator or Expo Go app

### Setup

```bash
git clone https://github.com/your-username/payment-collection-app.git
cd payment-collection-app
npm install
cp .env.example .env
```

### Environment Variables (`.env`)

```env
API_URL=http://localhost:5000/api
# For production: API_URL=http://your-ec2-ip:5000/api
```

### Run

```bash
npx expo start
# Scan QR code with Expo Go, or press 'a' for Android / 'i' for iOS
```

---

## Test Accounts (after seeding backend)

| Account | Name | EMI |
|---------|------|-----|
| `ACC001` | Arun Kumar | ₹4,720 |
| `ACC002` | Priya Nair | ₹3,200 |
| `ACC003` | Rahul Mehta | ₹2,580 |

---

## Project Structure

```
payment-collection-app/
├── App.jsx                          # Entry point
├── babel.config.js                  # react-native-dotenv config
├── src/
│   ├── api/
│   │   └── index.js                 # Axios instance (base URL from .env)
│   ├── components/
│   │   ├── LoanCard.jsx             # Dark card with loan details
│   │   ├── PaymentForm.jsx          # Amount input + confirmation alert
│   │   ├── PaymentHistoryItem.jsx   # Single payment row card
│   │   ├── ConfirmationModal.jsx    # Modal overlay for payment success
│   │   └── Spinner.jsx              # Full-screen loading indicator
│   ├── screens/
│   │   ├── HomeScreen.jsx           # Account number search
│   │   ├── LoanDetailScreen.jsx     # Loan info + payment form
│   │   ├── PaymentHistoryScreen.jsx # Payment history list
│   │   └── SuccessScreen.jsx        # Animated success confirmation
│   ├── navigation/
│   │   └── AppNavigator.jsx         # Stack navigator (4 screens)
│   └── utils/
│       └── formatters.js            # INR currency, date formatters
```

---

## Production Deployment

For a production build, use EAS Build:

```bash
npm install -g eas-cli
eas login
eas build --platform android   # .apk / .aab
eas build --platform ios       # .ipa
```

Make sure your `.env` has the EC2 API URL:
```env
API_URL=http://your-ec2-ip:5000/api
```
