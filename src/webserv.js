class chatroom {
    sessions = [];
}

export default {
    async fetch(request) {
        return await handleErrs(request, requestHandler);
    }
}

async function handleErrs(request, cbfunc) {
    try {
        return await cbfunc(request);
    } catch (err) {
        const upgradeHeader = request.headers.get('Upgrade');
        if (!upgradeHeader || upgradeHeader !== 'websocket') {
            return new Response('Expected Upgrade: websocket', { status: 426 });
        }
        return new Response('Server Error', { status: 500 });
    }
}

async function requestHandler(request) {
    const { method } = request;
    let url = new URL(request.url);

    switch(method) {
        case 'GET':
            return await handleGetRequest(url, request);
        case 'UPGRADE':
            return await handleUpgradeRequest(url, request);
    }
    return new Response('method not supported', { status: 405 })
}

async function handleGetRequest(url, request) {
    let { pathname } = url;
    pathname = pathname.slice(1).split("/");
    
    if (pathname[0] == "room") {
        //add get history function here
        return new Response('not developed yet', { status: 404});
    }
    return new Response('nothing to do here', { status: 418});
}

async function handleUpgradeRequest(url, request) {
    let { pathname } = url;
    pathname = pathname.slice(1).split("/");

    if (pathname[0] == "room") {
        return await initializeChatRoom(url, pathname);
    }
}

async function initializeChatRoom(url, pathname) {
    let roomCode = pathname[1];

    const webSocketPair = new WebSocketPair();
    const client = webSocketPair[0],
        server = webSocketPair[1];

    server.accept();

    chatroom.sessions.push(server);

    server.on("message", async message => {
        let data = JSON.parse(message);

        for (let i = 0; i < chatroom.sessions.length; i += 1) {
            let currSession = chatroom.sessions[i];
            if (currSession.url.slice(1).split("/")[1] == data.room)
            currSession.send(JSON.stringify(data));
        }
    })

    return new Response(null, {
        status: 101,
        websocket: client,
    })
}