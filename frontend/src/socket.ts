const WS_BASE = import.meta.env.VITE_SOCKET_BASE;

if (!WS_BASE) {
  throw new Error("VITE_SOCKET_BASE is not defined");
}

const protocol = window.location.protocol === "https:" ? "wss" : "ws";

const url = WS_BASE.replace(/^ws(s)?:\/\//, `${protocol}://`);

export const socket = new WebSocket(url);