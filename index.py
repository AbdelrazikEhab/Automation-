import websocket
import MetaTrader5 as mt5

def on_message(ws, message):
    # Process the received message
    print("Received message:", message)

    # Check if the message contains a buy or sell signal
    if "BUY_SIGNAL" in message:
        # Execute a buy order
        order = mt5.order_send(
            symbol="XAUUSD",
            action=mt5.ORDER_TYPE_BUY,
            volume=0.01,
            slippage=3,
            type=mt5.ORDER_TYPE_MARKET,
            magic=123456,
            comment="Buy order"
        )
        if order.retcode != mt5.TRADE_RETCODE_DONE:
            print("Failed to execute buy order")

    elif "SELL_SIGNAL" in message:
        # Execute a sell order
        order = mt5.order_send(
            symbol="XAUUSD",
            action=mt5.ORDER_TYPE_SELL,
            volume=0.01,
            slippage=3,
            type=mt5.ORDER_TYPE_MARKET,
            magic=123456,
            comment="Sell order"
        )
        if order.retcode != mt5.TRADE_RETCODE_DONE:
            print("Failed to execute sell order")

def on_error(ws, error):
    # Handle any errors that occur
    print("Error:", error)

def on_close(ws):
    # Perform cleanup tasks when the connection is closed
    print("Connection closed")

def on_open(ws):
    # Subscribe to the TradingView alert
    ws.send('{"action": "subscribe", "symbol": "XAUUSD", "alert": "YOUR_ALERT_NAME"}')

# Initialize MetaTrader 5 library
mt5.initialize()
server = "EXNESS_SERVER"  # Replace with the appropriate server name provided by EXNESS
login = 12345678  # Replace with your MT5 login
password = "YOUR_PASSWORD"  # Replace with your MT5 password

# Connect to the MT5 server
mt5.login(login, password, server=server)

# Create a websocket connection
websocket.enableTrace(True)
ws = websocket.WebSocketApp("wss://data.tradingview.com/socket.io/websocket", on_message=on_message, on_error=on_error, on_close=on_close)
ws.on_open = on_open

# Start the websocket connection
ws.run_forever()