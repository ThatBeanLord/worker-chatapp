import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });



wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        const data = JSON.parse(message);

        if (data.type === "message") {
            wss.clients.forEach((client) => {
                if (client.readyState == WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "message", data: data.data }));
                }
            })
        }
    })
})