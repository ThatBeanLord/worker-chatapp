const WebSocket = require("ws");
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

let username;
  
readline.question('Enter your username', name => {
    username = name;
    readline.setPrompt("enter chat messages");
    readline.prompt();
});

let roomCode = "sadisd";
const hostname = "worker-chatapp.beansamuel1234.workers.dev";
let url = "https://" + hostname + "/room/" + roomCode + "/websocket";
websocket = new WebSocket(url);

websocket.addEventListener("message", async event => {
    const data = JSON.parse(event.data);
    if (data.type == "message") {
        console.log(`${data.user}: ${data.data}`)
    }
})

readline.on('line', async msg => {
    if (!msg) {
        return false;
    }

    if (msg == "end chat") {
        readline.closer();
    }

    try {
        websocket.send(JSON.stringify({ type: "message", user: username, data: msg}));
    } catch (err) {
        console.log(err);
    }
})