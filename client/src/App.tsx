import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';
import { MyForm } from './components/MyForm';
import { Board } from './components/Board';
import cryptoRandomString from 'crypto-random-string';
import './App.css';

let gameConnected = false;
export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [randomCode, setRandomCode] = useState(cryptoRandomString({length: 6}));
  const [gameConnectedString, setGameConnectedString] = useState(false);
  const [opponent, setOpponent] = useState('');
  const [playerNumber, setPlayerNumber] = useState<number|null>();

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on(randomCode, (msg) => {
      incomingCodeFunc(msg);
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  const incomingCodeFunc = (socketData: ISocketData) => {
    console.log('someone is connected to you');
    if (!gameConnected) {
      setOpponent(socketData.from);
      gameConnected = true;
      setGameConnectedString(true);
      setPlayerNumber(socketData.playerNumber);
      socket.emit('connect-code', {
        from: socketData.to,
        to: socketData.from,
        gameConnected: true,
        playerNumber: 1,
        playerTurn: 1,
      });
    }
  }

  return (
    <div className="App">
      {
        gameConnectedString ? 
          <div style={{ marginTop: 50, marginBottom: 50 }}>
            <Board opponent={opponent} playerNumber={playerNumber} />
            <hr style={{ marginTop: 50 }} />
          </div>
        : <></>
      }
      <ConnectionState isConnected={ isConnected } />
      <ConnectionManager />
      <MyForm randomCode={randomCode} setPlayerNumber={setPlayerNumber} />
      <div style={{ marginTop: 50 }}>
        <h4>Your Player Code: { randomCode }</h4>
        <h4>Status: { gameConnectedString ? 'Game is Connected': 'Game is Not Connected' }</h4>
      </div>
      <br/>
      
    </div>
  );
}

interface ISocketData {
  from: string;
  to: string;
  gameConnected?: boolean;
  playerTurn?: number;
  playerNumber?: number;
}