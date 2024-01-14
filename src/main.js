const WebSocket = require('ws');
let username = "greg";
let roomCode = "greg";
import("./webserv.mjs");

const asyncFunction = async () => {
    let url = new URL('wss://worker-chatapp.beansamuel1234.workers.dev' + "/room/" + roomCode + "/websocket");

    try {
        let websocket = new WebSocket(url);

        if (!websocket) {
            console.log(resp.status);
            console.log(websocket);
            throw new Error("server didn't accept WebSocket");
        }


        websocket.onopen = () => {
            console.log('connection open');
            asb(websocket);
        }

        setTimeout(() => console.log(websocket.readyState), 3000);

    } catch (err) {
        console.log(err);
    }

    /*websocket.addEventListener("message", (event) => {
        console.log(event);
        const data = JSON.parse(event.data);
        if (data.type = "message") {
            console.log(data.data);
        }
    })

    websocket.send(JSON.stringify({ type: "message", room: roomCode, user: username, data: "message" }))
    */
}

const asb = (ws) => {
    ws.addEventListener("message", (event) => {
        console.log("message received:");
        const data = JSON.parse(event.data);
        console.log(data);
        if (data.type == "message") {
            console.log(data);
        }
    })
}
asyncFunction();