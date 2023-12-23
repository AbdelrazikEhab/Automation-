import zmq
from tradingview_ta import TA_Handler, Interval

# Create ZeroMQ socket
context = zmq.Context()
zmqSocket = context.socket(zmq.PUSH)
endpoint = "tcp://127.0.0.1:5555"  # Replace with the actual ZeroMQ endpoint
zmqSocket.connect(endpoint)

# Function to fetch indicators from TradingView
def fetch_indicators(symbol, exchange):
    try:
        handler = TA_Handler()
        handler.set_symbol_as(symbol)
        handler.set_exchange_as_crypto_or_stock(exchange)
        handler.set_screener_as_crypto()
        handler.set_interval_as(Interval.INTERVAL_1_DAY)

        analysis = handler.get_analysis()
        last_price = analysis.indicators['close']
        price_change = analysis.indicators['change']
        price_change_percent = analysis.indicators['change_percent']

        # Perform trading operations and send response to MQL5
        decision = make_trading_decision(price_change, price_change_percent)
        send_response_to_mql5(decision)

    except Exception as e:
        print("Error fetching indicators from TradingView:", str(e))

# Function to make trading decision based on indicator data
def make_trading_decision(price_change, price_change_percent):
    if price_change > 0 and price_change_percent > 0:
        return "buy"
    elif price_change < 0 and price_change_percent < 0:
        return "sell"
    else:
        return "hold"

# Function to send trading decision response to MQL5 using ZeroMQ
def send_response_to_mql5(decision):
    zmqSocket.send_string(decision)
    print("Response sent to MQL5:", decision)

# Main function to start the automation
def main():
    symbol = input("Enter symbol: ")
    exchange = input("Enter exchange: ")

    fetch_indicators(symbol, exchange)

if __name__ == "__main__":
    main()