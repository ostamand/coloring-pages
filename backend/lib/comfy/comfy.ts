async function* websocketAsyncIterator(ws: WebSocket): AsyncIterable<string> {
    const messageQueue: string[] = [];
    const errorQueue: Error[] = [];
    let isClosed = false;

    ws.onmessage = (event) => {
        messageQueue.push(event.data);
    };

    ws.onerror = (event) => {
        errorQueue.push(new Error(`WebSocket error: ${event}`));
    };

    ws.onclose = () => {
        isClosed = true;
    };

    while (!isClosed || messageQueue.length > 0) {
        if (errorQueue.length > 0) {
            throw errorQueue.shift()!;
        }
        if (messageQueue.length > 0) {
            yield messageQueue.shift()!;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 10)); // Small delay to prevent tight loops
        }
    }
}


async function queuePrompt(comfyEndpoint: string, workflow: any) {
    const response = await fetch(`${comfyEndpoint}/prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: workflow }),
    });
    if (!response.ok) {
        throw new Error("Can't call ComfyUI. Check if running");
    }
    const data = await response.json();
    const { prompt_id } = data;
    return prompt_id;
}

/**
 * Queues a prompt for processing by the ComfyUI API.
 * @param {string} comfyEndpoint - The base URL of the ComfyUI endpoint.
 * @param {any} workflow - The workflow configuration to be processed.
 * @returns {Promise<string>} A promise that resolves with the ID of the queued prompt.
 * @throws {Error} If there's an issue making the request or if the response isn't successful.
*/
export async function waitForPrompt(
    endpoint: string,
    ws: WebSocket,
    workflow: any,
) {
    const promptId = await queuePrompt(endpoint, workflow);
    try {
        for await (const msg of websocketAsyncIterator(ws)) {
            const message = JSON.parse(msg);
            if (message.type === "status") {
                const data = message.data;
                if (data.status.exec_info.queue_remaining === 0) {
                    console.log("✅ Execution complete for prompt:", promptId);
                    break;
                }
            }
        }
    } catch (err) {
        console.error("WebSocket error:", err);
    }
}

/**
 * Establishes a WebSocket connection to a server.
 * @param {string} serverAddress - The address of the WebSocket server (e.g., "127.0.0.1:8188").
 * @returns {WebSocket} A WebSocket connection object.
 * @throws {Error} If there's an issue establishing the connection.
 */
export async function connectToWebSocket(serverAddress: string) {
    const clientId = crypto.randomUUID();
    const webSocketUrl = `ws://${serverAddress}/ws?clientId=${clientId}`;
    const ws = new WebSocket(webSocketUrl);
    // Wait for the connection to open
    await new Promise<void>((resolve, reject) => {
        ws.onopen = () => resolve();
        ws.onerror = (err) => reject(err);
    });
    return ws;
}
