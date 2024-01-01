from flask import Flask, request, jsonify
import MetaTrader5 as mt5

app = Flask(__name__)

# MetaTrader 5 login credentials
login = "123"
password = "abc"
server = "Broker Server"

@app.route('/', methods=['POST'])
def receive_signal():

    # Initialize MetaTrader 5
    mt5.initialize()
    mt5.login(login, password, server=server)

    # Parse signal data
    data = request.get_json()
    signal = data['signal']

    if signal == "BUY":
        place_order(mt5.ORDER_TYPE_BUY)
    elif signal == "SELL": 
        place_order(mt5.ORDER_TYPE_SELL)

    # Return success response
    return jsonify({"status": "Order placed"}), 200

def place_order(action):

    # Place order
    order = mt5.order_send(
        symbol="EURUSD",
        volume=0.1, 
        type=mt5.ORDER_TYPE_MARKET,
        action=action  
    )  

    # Check for errors  
    if order.retcode != mt5.TRADE_RETCODE_DONE:
        print("Order failed")
       
if __name__ == '__main__':

    # Run Flask app
    app.run(host='0.0.0.0', port=5000)