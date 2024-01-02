const express = require("express");
const axios = require("axios");

const app = express();
const baseUrl = "https://automationontradingview.onrender.com"; // Set the base URL

// TradingView API key
const tvApiKey = "Uox0zM24";

// Route to receive signal via GET
app.get("/signal", async (req, res) => {
  // Authenticate request
  const apiKey = req.query.api_key;
  if (apiKey !== tvApiKey) {
    return res.status(401).send("Unauthorized");
  }

  // Parse signal parameters
  const symbol = req.query.symbol;
  const signal = req.query.signal;

  try {
    // Place order via broker API
    await axios.post(`${baseUrl}/orders`, {
      symbol,
      signal,
    });

    res.send("Order placed");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(80, () => {
  console.log("Listening on port 80");
});
