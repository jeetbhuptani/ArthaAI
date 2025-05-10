## Democratizing Financial Wisdom for Every Indian

ArthaAI is an AI-powered personal finance platform designed specifically for Indian users. It leverages advanced AI models to provide personalized financial guidance, investment analysis, and educational resources in a user-friendly manner.

![ArthaAI Logo](./client/public/Logo.png)

## Features

### 💬 Financial Learning Chat
Engage in natural conversations about personal finance with an AI assistant that understands Indian financial contexts, communicates in Hinglish when appropriate, and provides culturally relevant examples.

### 📊 Investment Comparator
Compare different investment options like mutual funds, stocks, FDs, PPF, and real estate with projected returns based on real-time Indian market data.

### 📝 Tax Analysis & Planning
Upload and analyze financial documents, track GST payments and credits, and receive AI-powered tax optimization suggestions.

### 📄 Bills & ITR Analyzer
Upload financial documents and receipts to extract key information with simple Hinglish explanations.

### 🧮 Portfolio Insights
Get personalized investment distribution recommendations based on your risk profile, financial goals, and Indian market conditions.

### 📰 Financial News
Stay updated with the latest financial news from Indian markets with AI-powered summaries and explanations.

## Technology Stack

- **Frontend:** React, TypeScript, Vite, ShadCN, Tailwind CSS, Framer Motion, Zod, React Charts
- **Backend:** Node.js, Express
- **AI:** Google Gemini API
- **Database:** MongoDB
- **Cloud:** Cloudinary, GCP
- **Authentication:** JWT

## Getting Started

### Prerequisites
- Node.js (v20 or newer)
- MongoDB
- API keys for Gemini AI and optional market data providers

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/ArthaAI.git
cd ArthaAI
```

2. Install server dependencies
```
cd server
npm install
```

3. Install client dependencies
```
cd ../client
npm install
```

4. Create environment files

Create `.env` file in the server directory with the following variables:
```
#Environment Configuration
PORT=5000

#Database Configuration
MONGO_URI=your mongodb url

#Gemini API Configuration
GEMINI_API_KEY=your gemini api key - model 2.0 flash
GEMINI_API_KEY2=your gemini api key - model 2.0 flash

#Authentication Configuration
JWT_SECRET=your key

#Investment Rates API Configuration
ALPHA_VANTAGE_API_KEY= https://www.alphavantage.co/
MARKETSTACK_API_KEY=http://marketstack.com/

# News API Configuration
WORLD_NEWS_API_KEY=https://worldnewsapi.com/
```

Set `vite.config.js` file in the client directory:
```
proxy: {
      '/api': {
        target: 'your backend url',
        changeOrigin: true,
        secure: false,
      },
    },
```

5. Run the application
```
# Start the server
cd server
npm run dev

# In a new terminal, start the client
cd client
npm run dev
```

## Contributing

Contributions are welcome! Please check out our Contributing Guidelines for details.

## Security

For security concerns, please refer to our Security Policy.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built during the Ignosis Hackathon
- Financial data providers and API services
- Open source community for the amazing tools and libraries

---

© 2025 Jeet Bhuptani. All rights reserved.
