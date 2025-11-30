export let client_id = Date.now();
const socket = new WebSocket(`wss://tone-bring-grill-fcc.trycloudflare.com/ws/${client_id}`);
export default socket;