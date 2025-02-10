const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(
    cors({
      origin: "http://localhost:5173", // React frontend URL
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
    })
  );
  
app.use(express.json());

app.get('/stock', async (req, res) => {
    const { symbol } = req.query;
    console.log('Symbol received:', symbol);

    if (!symbol || typeof symbol !== 'string' || symbol.length < 1) {
        return res.status(400).json({ error: "Invalid stock symbol" });
    }

    try {
        const requestUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
        console.log('Request URL:', requestUrl);       

        const response = await axios.get(requestUrl);
        const chartData = response.data.chart?.result?.[0];

        if (!chartData) {
            return res.status(400).json({ error: "Invalid response format" });
        }

        const timestamps = chartData.timestamp || [];
        const prices = chartData.indicators?.quote?.[0]?.open || [];

        if (timestamps.length === 0 || prices.length === 0) {
            return res.status(400).json({ error: "No stock data found" });
        }

        const formattedData = timestamps.map((time, index) => ({
            x: new Date(time * 1000), // Convert Unix timestamp to Date object
            y: prices[index]
        }));

        console.log("Yahoo Finance Data:", formattedData);
        res.json(formattedData);

    } catch (error) {
        console.error("Couldn't fetch details:", error.message);

        if (error.response) {
            console.error('API Response:', error.response.data);
        }

        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend server running at port ${PORT}`));
