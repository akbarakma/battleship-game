import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'http://159.223.74.255';

export const socket = io(URL, {
  autoConnect: true,
  path: '/battleship-game/socket.io',
});