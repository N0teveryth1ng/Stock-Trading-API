import axios from "axios";
import { useEffect, useState } from "react";
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTooltip } from "victory";

const Finance = () => {
    const [symbol, setSymbol] = useState('');
    const [data, setData] = useState([]);

    async function fetchData() {
        if (!symbol) return;

        try {
            const res = await axios.get(`http://localhost:5000/stock?symbol=${symbol}`);
            console.log("API Response:", res.data);

            if (!Array.isArray(res.data) || res.data.length === 0) {
                console.error("Invalid API response format:", res.data);
                return;
            }

            // Ensure 'x' is a Date object, filter out invalid prices, and sort by date
            const formattedData = res.data
                .map(item => ({
                    x: new Date(item.x),  // Ensure x is a valid Date object
                    y: item.y ?? null      // Remove null/undefined values
                }))
                .filter(item => item.y !== null) // Remove any null values
                .sort((a, b) => a.x - b.x);      // Sort data by time

            console.log("Formatted Chart Data:", formattedData);
            setData(formattedData);
        } catch (error) {
            console.error("Error fetching stock data:", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [symbol]);

    return (
        <div>
            <h1>Stock Price Tracker</h1>

            <input 
                value={symbol} 
                onChange={(e) => setSymbol(e.target.value.toUpperCase())} 
                placeholder="Enter symbol (AAPL):" 
            />
            <button onClick={fetchData}>Get Data</button>

            {data.length > 0 && (
                <VictoryChart>
                    <VictoryAxis 
                        fixLabelOverlap 
                        tickFormat={(tick) => new Date(tick).toLocaleDateString()} // Better date formatting
                    />
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
    );
}

export default Finance;
