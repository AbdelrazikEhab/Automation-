const express = require("express");
const bodyParser = require("body-parser");
const WebSocket = require("ws");

const baseUrl = "https://automationontradingview.onrender.com"; // Replace with your desired base URL

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Placeholder function for handling buy signals
function handleBuySignal(signal) {
  // Perform automated actions for buy signals
  console.log("Received buy signal:", signal);
  // Example actions: Execute a trade, send a notification, etc.

  // Send the buy signal to MQL5 script
  sendSignalToMQL5("buy", signal);
}

// Placeholder function for handling sell signals
function handleSellSignal(signal) {
  // Perform automated actions for sell signals
  console.log("Received sell signal:", signal);
  // Example actions: Close a trade, send a notification, etc.

  // Send the sell signal to MQL5 script
  sendSignalToMQL5("sell", signal);
}

// WebSocket client for sending signals to MQL5 script
const ws = new WebSocket(`ws://${baseUrl}`); // Replace with the appropriate WebSocket URL

// Function to send signals to MQL5 script
function sendSignalToMQL5(action, signal) {
  const data = JSON.stringify({ action, signal });
  ws.send(data);
}

app.get("/webhook", (req, res) => {
  const { action, signal } = req.query; // Extract the action and signal from the URL parameters

  // Process the signal
  if (action === "buy") {
    handleBuySignal(signal);
  } else if (action === "sell") {
    handleSellSignal(signal);
  }

  res.sendStatus(200); // Send a success response to TradingView
});

const port = 3000; // Set the desired port number
app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
