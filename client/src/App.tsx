import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';
import { MyForm } from './components/MyForm';
import Board from './components/Board';
import cryptoRandomString from 'crypto-random-string';
import './App.css';
import BoardPrepare from './components/Board/BoardPrepare';

let gameConnected = false;
type Cell = {
  id: number;
  color: string;
  status: string
};

const ROWS = 10;
const COLS = 10;

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [randomCode, setRandomCode] = useState(cryptoRandomString({length: 6}));
  const [gameConnectedString, setGameConnectedString] = useState(false);
  const [opponent, setOpponent] = useState('');
  const [playerNumber, setPlayerNumber] = useState<number|null>();
  const [playerTurn, setPlayerTurn] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerGrid, setPlayerGrid] = useState<Cell[]>([]);
  const [opponentGrid, setOpponentGrid] = useState<Cell[]>([]);
  const [status, setStatus] = useState('Picking Location to Attack');
  const [isGameFinished, setIsGameFinished] = useState(false);
  
  const createGrid = () => {
    const initialGrid: Cell[] = [];
    for (let id = 0; id < ROWS * COLS; id++) {
      initialGrid.push({ id, color: 'white', status: 'blank' });
    }
    return initialGrid;
  };

  useEffect(() => {
    const blankGrid = createGrid();
    setPlayerGrid(blankGrid);
    setOpponentGrid(blankGrid);
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
    if (socketData.from === randomCode) return;
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
    } else {
      if (socketData.isGameFinished) {
        setPlayerGrid(socketData.toGrid);
        setIsGameFinished(true);
        setStatus('Sorry You Loss');
      } else {
        if (socketData.gameStarted) {
          if (socketData.fromGrid) {
            setOpponentGrid(socketData.fromGrid);
            if (socketData.toGrid) {
              setPlayerGrid(socketData.toGrid);
              if (socketData.playerTurn) {
                setPlayerTurn(socketData.playerTurn);
              }
            }
          }
        } else {
          if (socketData.fromGrid) {
            setOpponentGrid(socketData.fromGrid);
            if (gameStarted) {
              socket.emit('connect-code', {
                to: opponent,
                from: randomCode,
                playerNumber: playerNumber,
                playerTurn: 1,
                fromGrid: playerGrid,
                gameStarted: true,
              });
            }
          }
        }
      }
    }
  }

  return (
    <div className="App">
      <h1 className='m-3'>BattleShip Online Game</h1>
      <div style={{ marginTop: 50, marginBottom: 50 }}>
      {
        gameConnectedString ? (
          <>
            {
              gameStarted ? 
              <Board
                opponentCode={opponent}
                randomCode={randomCode}
                playerGrid={playerGrid}
                opponentGrid={opponentGrid}
                setOpponentGrid={setOpponentGrid}
                playerTurn={playerTurn}
                setPlayerTurn={setPlayerTurn}
                playerNumber={playerNumber}
                setStatus={setStatus}
                status={status}
                setIsGameFinished={setIsGameFinished}
                isGameFinished={isGameFinished}
              /> : 
              <BoardPrepare
                opponentCode={opponent}
                setGameStarted={setGameStarted}
                gameStarted={gameStarted}
                playerGrid={playerGrid}
                setPlayerGrid={setPlayerGrid}
                randomCode={randomCode}
                playerNumber={playerNumber}
              /> }
            <hr style={{ marginTop: 50 }} />
          </>
        ) : <></>
      }
      </div>
      <ConnectionState isConnected={ isConnected } />
      {/* <ConnectionManager /> */}
      <MyForm randomCode={randomCode} setPlayerNumber={setPlayerNumber} />
      <div style={{ marginTop: 50 }}>
        <h4>Your Player Code: { randomCode }</h4>
        <h4>Status: { gameConnectedString ? 'Game is Connected': 'Game is Not Connected' }</h4>
        <p>If the socket connection is not connected, try refreshing the web as the server use free service</p>
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
  gameStarted?: boolean;
  fromGrid?: any;
  toGrid?: any;
  isGameFinished?: boolean;
  playerWon?: number;
}