import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'https://battleship-server.akbarakma.site';

export const socket = io(URL, {
  autoConnect: true,
  path: '/battleship-game/socket.io',
});