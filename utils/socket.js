import io from "socket.io-client";
const socket = io("https://3.110.128.27.nip.io",{
  transports: ["websocket"]
});

export default socket;