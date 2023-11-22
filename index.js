const express = require("express");
const app = express();
const port = 3000;

// Import the zeromq.js library
const zmq = require("zeromq");

// Call sell and buy
const performBuyOperation = require("./performBuyOperation");
const performSellOperation = require("./performSellOperation");
// API endpoint for receiving requests from MetaTrader
app.get("/api/placeOrder", async (req, res) => {
  // Extract parameters from the request
  const symbol = req.query.symbol;
  const volume = req.query.volume;
  const orderType = req.query.orderType;

  // Validate the order parameters
  if (!symbol || !volume || !orderType) {
    res.status(400).send("Missing required parameters");
    return;
  }

  // ZeroMQ socket for sending commands to MetaTrader
  const socket = new zmq.Request();

  try {
    // Connect the socket to the MetaTrader ZeroMQ server
    await socket.connect("tcp://127.0.0.1:5555");

    // Construct the request message
    const request = {
      command: "placeOrder",
      symbol: symbol,
      volume: volume,
      orderType: orderType,
    };

    // Send the request to MetaTrader
    await socket.send(JSON.stringify(request));

    // Receive the response from MetaTrader
    const [response] = await socket.receive();

    // Process the response
    const parsedResponse = JSON.parse(response.toString());

    if (parsedResponse.success) {
      console.log(`Order placed successfully: ${parsedResponse.message}`);

      // Perform buy or sell operation based on order type
      if (orderType === "buy") {
        performBuyOperation(symbol, volume);
      } else if (orderType === "sell") {
        performSellOperation(symbol, volume);
      }

      res.send("Order placed successfully");
    } else {
      console.log(`Failed to place order: ${parsedResponse.error}`);
      res.status(500).send("Failed to place order");
    }
  } catch (error) {
    console.log(`Error occurred while placing order: ${error.message}`);
    res.status(500).send("Error occurred while placing order");
  } finally {
    // Close the socket
    socket.close();
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
