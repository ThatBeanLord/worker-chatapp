const WebSocket = require('ws');
let username = "greg";
let roomCode = "greg";

const newWebSocket = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(new WebSocket('https://worker-chatapp.beansamuel1234.workers.dev' + "/room/" + roomCode));
    }, 30000)})

const asyncFunction = async () => {
    websocket = await newWebSocket;

    websocket.addEventListener("message", (event) => {
        console.log(event);
        const data = JSON.parse(event.data);
        if (data.type = "message") {
            console.log(data.data);
        }
    })

    websocket.send(JSON.stringify({ type: "message", room: roomCode, user: username, data: "message" }))
}
asyncFunction();