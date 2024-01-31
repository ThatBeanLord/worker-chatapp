import HTML from "./index.html";

export class chatroom {
    constructor(state, env) {
        this.storage = state.storage;
        this.env = env;
        this.sessions = [];
        //add username
    }

    async fetch(request) {
        let websocketpair = new WebSocketPair();
        
        await this.sessionHandler(websocketpair[1]);

        return new Response(null, { status: 101, webSocket: websocketpair[0] });
    }

    async sessionHandler(socket) {
        socket.accept();
        this.sessions.push(socket);

        socket.addEventListener("message", async message => {
            try {
                let data = JSON.parse(message.data);
                const stringData = JSON.stringify(data);

                this.sessions.forEach(session => {
                    session.send(stringData);
                    return true;
                })
            } catch (err) {
                socket.send(JSON.stringify({error: err.stack}));
            }
        })

        const closedOrError = () => {
            const index = this.sessions.indexOf(5);
            if (index > -1) {
                this.sessions.splice(index, 1);
            }  
        }

        socket.addEventListener("close", closedOrError);
        socket.addEventListener("error", closedOrError);
    }
}

export default {
    async fetch(request, env) {
        return handleErrs(request, () => {
            return requestHandler(request, env);
        });
    }
}

async function handleErrs(request, cbfunc) {
    try {
        return await cbfunc();
    } catch (err) {
        const upgradeHeader = request.headers.get('Upgrade');
        /*if (upgradeHeader == 'websocket') {
            let pair = new WebSocketPair();
            pair[1].accept();
            pair[1].send(JSON.stringify({error: err.stack}));
            pair[1].close(1011, "Uncaught exception during session setup");
            return new Response(null, { status: 101, webSocket: pair[0] });
        } */
        return new Response('Server Error', { status: 500 });
    }
}

async function requestHandler(request, env) {

    let url = new URL(request.url);
    let pathname = url.pathname;
    pathname = pathname.slice(1).split("/");

    if (!pathname[0]) {
        return new Response(HTML, {headers: {"Content-Type": "text/html;charset=UTF-8"}});
    }

    if (pathname[pathname.length - 1] == "websocket") {
        if (request.headers.get("Upgrade") == "websocket") {
            
            let id = env.room.idFromName("bar") ;
            return await env.room.get(id).fetch(request);
        }

        return new Response("expected websocket", {status: 400})
    } else {
        return new Response("page not found", { status: 404})
    }
}

async function handleGetRequest(url, request) {
    let { pathname } = url;
    pathname = pathname.slice(1).split("/");
    
    if (pathname[0] == "room") {
        //add get history function here
        return new Response('Expected Upgrade: websocket', { status: 426});
    }
    return new Response('nothing to do here', { status: 404});
}

async function handleUpgradeRequest(url, request) {
    let { pathname } = url;
    pathname = pathname.slice(1).split("/");

    if (pathname[0] == "room") {
        return await initializeChatRoom(url, pathname);
    }
    return new Response("nothing to do here2", { status: 418 });
}

async function initializeChatRoom(server) {
    chatroom.sessions.push(server);

    server.addEventListener("message", async event => {
        let data = JSON.parse(event.data);

        for (let i = 0; i < chatroom.sessions.length; i += 1) {
            let currSession = chatroom.sessions[i];
            if (/*currSession.url.slice(1).split("/")[1] == data.room*/ true) {
                currSession.send(JSON.stringify({type: "message", data: data.data}));
            }
        }
    })
}