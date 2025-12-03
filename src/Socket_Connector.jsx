export let client_id = Date.now();
const socket = new WebSocket(`wss://pump-cloud-kyle-joined.trycloudflare.com/ws/${client_id}`);
export default socket;