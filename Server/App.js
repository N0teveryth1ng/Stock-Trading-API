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


const api = 'NZ2VE8T9LP36JA4U';

app.get('/stock', async (req, res) => {

    const {symbol} = req.query;
    console.log('symbol received:', symbol);

    if (!symbol || typeof symbol !== 'string' || symbol.length < 1) {
        return res.status(400).json({ error: "Invalid stock symbol" });
      }
      
    try {
        const requestUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${api}`;
        console.log('request url', requestUrl);       
       
        const response = await axios.get(requestUrl);

        if (!response.data["Time Series (Daily)"]) {
            return res.status(400).json({ error: "Invalid response format" });
        }


        res.json(response.data);
    } catch (error) {
        console.error("couldn't fetch details ", error.message)

        if(error.response) {
            console.error('api response: ', error.response.data);
        }

          res.status(500).json({ error: 'failed to fetch data'});
    }
})


const PORT = 5000;
app.listen(PORT, () => console.log(`server running at port ${PORT}`))