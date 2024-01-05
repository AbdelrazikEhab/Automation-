#include <Network\WebSockets\WebSocketServer.mqh>

class MyWebSocketServer : public CWebSocketServer
{
protected:
    virtual void OnConnected(const uint connection) override
    {
        Print("Client connected: ", connection);
    }

    virtual void OnDisconnected(const uint connection) override
    {
        Print("Client disconnected: ", connection);
    }

    virtual void OnReceived(const uint connection, const string& data) override
    {
        Print("Received data from client ", connection, ": ", data);

        // Process the received data and trigger actions based on the signals
        if (data == "buy")
        {
            // Execute buy signal action
        }
        else if (data == "sell")
        {
            // Execute sell signal action
        }
    }
};

MyWebSocketServer server;

// Initializing the WebSocket server
bool OnInit()
{
    if (!server.Start("::1:8080"))
    {
        Print("Failed to start WebSocket server");
        return false;
    }

    Print("WebSocket server started");

    return true;
}

// Running the WebSocket server
void OnTick()
{
    server.Service();
}