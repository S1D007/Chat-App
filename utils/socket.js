import io from "socket.io-client";
const socket = io("https://3.109.181.36.nip.io",{
  transports: ["websocket"]
});

export default socket;
