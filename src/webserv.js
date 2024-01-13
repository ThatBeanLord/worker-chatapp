export default {
    async fetch(request, env) {
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
        } else {
            return new Response('Server Error', { status: 500 });
        }
    }
}

async function requestHandler(request) {
    let url = new URL(request.url);

    //add in return root functionality

    if (request.header)
}