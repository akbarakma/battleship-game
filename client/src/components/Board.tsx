import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Board.css';
import { socket } from '../socket';

type Cell = {
  id: number;
  color: string;
  status: string
};

const ROWS = 10;
const COLS = 10;

interface IBoard {
  opponentCode: string;
  playerGrid: Cell[];
  opponentGrid: Cell[];
  setOpponentGrid: any;
  playerTurn: number;
  setPlayerTurn: any;
  playerNumber: number | null | undefined;
  randomCode: string;
  status: string;
  setStatus: any;
  setIsGameFinished: any;
  isGameFinished: boolean;
}

export default function Board({
  opponentCode,
  playerGrid,
  opponentGrid,
  setOpponentGrid,
  playerTurn,
  setPlayerTurn,
  playerNumber,
  randomCode,
  status,
  setStatus,
  setIsGameFinished,
  isGameFinished,
}: IBoard) {
  const [selectedId, setSelectedId] = useState(-1);
  const [tempOpponentGrid, setTempOpponentGrid] = useState<Cell[]>([]);

  useEffect(() => {
    const newGrid = [...opponentGrid];
    setTempOpponentGrid(newGrid);
  }, [opponentGrid]);

  const handleClick = (id: number) => {
    if (playerTurn === playerNumber) {
      setSelectedId(id);
      const updatedGrid = [...opponentGrid];
      if (updatedGrid[id].color !== 'white') {
        updatedGrid[id] = { ...updatedGrid[id], color: 'blue' };
        setTempOpponentGrid(updatedGrid);
      }
    }
  };

  const checkIsOpponentBoardReady = (grid: Cell[]) => {
    let isReady = false;
    for (let i = 0; i < grid.length; i++) {
      if (grid[i].color !== 'white') {
        isReady = true;
        break;
      }
    }
    return isReady;
  }

  const checkIfWin = (grid: Cell[]) => {
    let isWin = true;
    grid.map((data) => {
      if (data.status === 'ship') {
        isWin = false;
      }
    });
    if (isWin) {
      socket.emit('connect-code', {
        to: opponentCode,
        from: randomCode,
        playerNumber: playerNumber,
        playerTurn: 1,
        toGrid: grid,
        gameStarted: true,
        isGameFinished: true,
        playerWon: playerNumber,
      });
      setIsGameFinished(true);
      setStatus('Congratulation!! You WON!!');
    }
    return isWin;
  }

  const handleAttackButton = () => {
    if (selectedId >= 0 && opponentGrid[selectedId].status !== 'hit' && opponentGrid[selectedId].status !== 'miss') {
      if (opponentGrid[selectedId].status === 'ship') {
        setStatus('HIT');
        const updatedGrid = [...opponentGrid];
        updatedGrid[selectedId] = { ...updatedGrid[selectedId], color: 'red', status: 'hit' };
        setOpponentGrid(updatedGrid);
        checkIfWin(updatedGrid);
      } else {
        setStatus('Select grid to attack');
        const updatedGrid = [...opponentGrid];
        updatedGrid[selectedId] = { ...updatedGrid[selectedId], color: 'green', status: 'miss' };
        setOpponentGrid(updatedGrid);
        checkIfWin(updatedGrid);
        const newTurn = playerTurn === 1 ? 2 : 1;
        setPlayerTurn(newTurn);
        socket.emit('connect-code', {
          to: opponentCode,
          from: randomCode,
          playerNumber: playerNumber,
          playerTurn: newTurn,
          fromGrid: playerGrid,
          toGrid: updatedGrid,
          gameStarted: true,
          gameConnected: true,
        });
      }
      setSelectedId(-1);
    }
  }

  return (
    <div className="App">
      <h1>Playing Against Player {opponentCode}</h1>
      <Container>
        <Row>
          <Col xs={4}>
            <h1>Your Board</h1>
            <div className="grid">
              {playerGrid.map(cell => (
                <div
                  key={cell.id}
                  className="cell"
                  style={{ backgroundColor: cell.color }}
                  onClick={() => handleClick(cell.id)}
                />
              ))}
            </div>
          </Col>
          <Col xs={4}>
            {
              !checkIsOpponentBoardReady(opponentGrid) ?
              <>
                <h1>Waiting for opponent ...</h1>
              </> :
              <>
                <h1>Place Your Target on the Board</h1>
                <div className="grid">
                  {tempOpponentGrid.map(cell => (
                    <div
                      key={cell.id}
                      className="cell"
                      style={{ backgroundColor: (cell.status === 'ship' && cell.color !== 'blue') ? 'white' : cell.color }}
                      // style={{ backgroundColor: 'white' }}
                      onClick={() => handleClick(cell.id)}
                    />
                  ))}
                </div>
              </>
            }
            
            
          </Col>
          <Col xs={4}>
            <h1>Option</h1>
            {
              playerNumber === playerTurn ?
              <>
                <Button onClick={handleAttackButton}>
                  Attack
                </Button>
              </> :
              <>
                <Button disabled={true}>
                  Waiting for Opponent
                </Button>
              </>
            }
            <h1>Status: </h1>
            {
              (playerNumber === playerTurn) ?
              <>
                <h2>{status}</h2>
              </> :
              <>
                {
                  isGameFinished ? <h2>{status}</h2> : <h2>Waiting for Opponent</h2>
                }
              </>
            }
          </Col>
        </Row>
      </Container>
    </div>
  );
};

// type ShipName = 'Carrier' | 'Battleship' | 'Cruiser' | 'Submarine' | 'Destroyer';

// type IPlayerShip = {
//   [key in ShipName]: {
//     label: string,
//     size: number,
//   }
// }