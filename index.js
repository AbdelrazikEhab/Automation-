const express = require("express");
const TradingView = require("tradingview-api-adapter");
const zmq = require("zeromq");

const app = express();
const port = 3000;

// Create ZeroMQ socket
const zmqSocket = zmq.socket("push");
const endpoint = "tcp://127.0.0.1:5555"; // Replace with the actual ZeroMQ endpoint
console.log(Replace);

// Function to fetch indicators from TradingView using tradingview-api-adapter
async function fetchIndicators(symbol, exchange) {
  try {
    const adapter = new TradingView();

    adapter
      .Quote(`${exchange}:${symbol}`, ["lp", "ch", "chp"])
      .listen((data) => {
        console.log("Last price: ", data.lp);
        console.log("Price change: ", data.ch);
        console.log("Price change in percent: ", data.chp);

        // Perform trading operations and send response to MQL5
        const decision = makeTradingDecision(data);
        sendResponseToMQL5(decision);
      });
  } catch (error) {
    console.error("Error fetching indicators from TradingView:", error.message);
  }
}

// Function to make trading decision based on indicator data
function makeTradingDecision(data) {
  const lastPrice = data.lp;
  const priceChange = data.ch;
  const priceChangePercent = data.chp;

  // Implement your trading strategy based on the indicator data
  if (priceChange > 0 && priceChangePercent > 0) {
    return "buy";
  } else if (priceChange < 0 && priceChangePercent < 0) {
    return "sell";
  } else {
    return "hold";
  }
}

// Function to send trading decision response to MQL5 using ZeroMQ
function sendResponseToMQL5(decision) {
  zmqSocket.send(decision);
  console.log("Response sent to MQL5:", decision);
}

// API endpoint for fetching indicators and making trading decision
app.post("/trading-decision/:symbol/:exchange", (req, res) => {
  const symbol = req.params.symbol;
  const exchange = req.params.exchange;

  if (!symbol || !exchange) {
    res.status(400).send("Symbol and exchange are required.");
    return;
  }

  fetchIndicators(symbol, exchange);
  res.send("Trading decision process started");
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
