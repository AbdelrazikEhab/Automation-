const express = require("express");
const axios = require("axios");

const app = express();
const baseUrl = "https://automationontradingview.onrender.com";

app.use(express.json());

// Route to receive signals via POST
app.post("/webhook", async (req, res) => {
  try {
    // Extract signal information from the request body
    const signal = req.query.signal;
    const symbol = req.query.symbol;

    // Perform processing or validation on the signal data
    if (signal !== "buy" && signal !== "sell") {
      return res.status(400).send("Invalid signal");
    }

    // Perform symbol validation
    if (!isValidSymbol(symbol)) {
      return res.status(400).send("Invalid symbol");
    }

    // Send the signal to the desired destination
    await axios.post(`${baseUrl}/api/signal`, {
      signal,
      symbol,
    });

    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error.message);
    res.sendStatus(500);
  }
});

// Symbol validation function
function isValidSymbol(symbol) {
  // Add your symbol validation logic here
  // Example: Check if the symbol exists in a predefined list or matches a specific format
  const symbolList = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "XAUUSD"];
  return symbolList.includes(symbol);
}

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
