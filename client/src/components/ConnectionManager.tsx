import React from 'react';
import { socket } from '../socket';

export function ConnectionManager() {
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <>
      <button style={{ margin: 10 }} onClick={ connect }>Connect</button>
      <button style={{ margin: 10 }} onClick={ disconnect }>Disconnect</button>
    </>
  );
}
