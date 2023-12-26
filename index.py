import json
import websocket
import threading

def on_message(ws, message):
    print('Received message:', message)
    data = json.loads(message)

    if 'm' in data and 'supertrend' in data['m']:
        supertrend_data = data['m']['supertrend']

        for item in supertrend_data:
            signal_type = item['type']
            signal_price = item['p']
            timestamp = item['time']

            if signal_type == 'buy':
                print(f'Buy signal at {signal_price} (timestamp: {timestamp})')
            elif signal_type == 'sell':
                print(f'Sell signal at {signal_price} (timestamp: {timestamp})')

def on_error(ws, error):
    print('WebSocket error:', error)

def on_close(ws):
    print('WebSocket connection closed')

# Define the WebSocket URL for the XAU/USD symbol
symbol = 'XAUUSD'
url = 'wss://data.tradingview.com/socket.io/websocket?symbol={symbol}'

# Connect to the WebSocket API
ws = websocket.WebSocketApp(url,
                            on_message=on_message,
                            on_error=on_error,
                            on_close=on_close)

# Authenticate with TradingView (replace with your TradingView username and password)
auth_payload = {
    'action': 'auth',
    'params': {
         'login': 'bitcoin027@gmail.com',
        'password': 'bitcoin027@123'
    }
}

def send_auth_payload():
    ws.send(json.dumps(auth_payload))

# Subscribe to the Supertrend indicator updates for the XAU/USD symbol
subscribe_payload = {
    'action': 'subscribe',
    'params': {
        'symbol': symbol,
        'interval': '1',  # Time interval (1 minute)
        'supertrend': 'true'
    }
}

def send_subscribe_payload():
    ws.send(json.dumps(subscribe_payload))

# Start a separate thread to run the WebSocket connection
ws_thread = threading.Thread(target=ws.run_forever)
ws_thread.start()

# Authenticate and subscribe after a short delay to ensure the connection is established
# Adjust the delay time as needed (in seconds)
auth_timer = threading.Timer(5, send_auth_payload)
subscribe_timer = threading.Timer(7, send_subscribe_payload)

auth_timer.start()
subscribe_timer.start()