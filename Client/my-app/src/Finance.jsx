import axios from "axios";
import { useEffect, useState } from "react";
// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTooltip } from "victory";

// const cors = require('cors');



const Finance = () => {

    const [symbol, setSymbol] = useState('');
    const [data ,setData] = useState([]);


    async function fetchData() {

        if(!symbol) return;

        try{
            const res = await axios.get(`http://localhost:5000/stock?symbol=${symbol}`);
            console.log('api response: ', res.data); 

            if (!res.data || !res.data["Time Series (Daily)"]) {
                console.error("Invalid API response format:", res.data);
                return;
            }

            const timeSeries = res.data['Time Series (Daily)'];
            const formattedData = Object.keys(timeSeries).map(time => ({ time,
                x: new Date(time),
                y: parseFloat(timeSeries[time]["1. open"])
             })).reverse();  

            console.log("vantage data", formattedData);
            setData(formattedData)
        } catch (error) {
            console.error('invalid fetching', error);
    }
} 

  useEffect(() => {
    fetchData();
  }, [symbol])

  return(
    <div>
        
        <h1>Stock Price Tracker</h1>

        <input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="enter symbol (APPL): " />
        <button onClick={fetchData}>get data</button>

        {data.length > 0 && (
             <VictoryChart>
             <VictoryAxis fixLabelOverlap />
             <VictoryAxis dependentAxis />
             <VictoryLine 
               data={data} 
               style={{ data: { stroke: "#8884d8" } }} 
               labels={({ datum }) => `${datum.y}`}
               labelComponent={<VictoryTooltip />}
             />
           </VictoryChart>
        )} 

    </div>
  )

}

export default Finance

