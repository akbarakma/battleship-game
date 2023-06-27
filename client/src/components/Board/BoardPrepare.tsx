import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './BoardPrepare.css';
import { socket } from '../../socket';

type Cell = {
  id: number;
  color: string;
  status: string
};

const ROWS = 10;
const COLS = 10;

interface IBoardPrepare {
  opponentCode: string;
  setGameStarted: any;
  gameStarted: boolean;
  playerGrid: Cell[];
  setPlayerGrid: any;
  randomCode: string;
  playerNumber: number | null | undefined;
}

export default function BoardPrepare({
  opponentCode,
  setGameStarted,
  gameStarted,
  playerGrid,
  setPlayerGrid,
  randomCode,
  playerNumber
}: IBoardPrepare) {
  const [playerDirection, setPlayerDirection] = useState('right');
  const [playerShip, setPlayerShip] = useState([
  {
    label: 'Carrier',
    size: 5,
    count: 1,
  }, {
    label: 'Battleship',
    size: 4,
    count: 1,
  }, {
    label: 'Cruiser',
    size: 3,
    count: 1,
  }, {
    label: 'Submarine',
    size: 3,
    count: 1,
  }, {
    label: 'Destroyer',
    size: 2,
    count: 1,
  }]);
  const [selectedShip, setSelectedShip] = useState('None');

  const isGridColored = (row: number, col: number) => {
    return playerGrid[row * COLS + col].color !== 'white';
  };

  const handleClick = (id: number, direction: string) => {
    if (selectedShip === 'None' && !gameStarted) {
      console.log('select ship first');
      return;
    }
    const findShip = playerShip.find((data) => data.label === selectedShip);
    if (!findShip) return;
    if (!findShip.count) return;
    const numGrids = findShip.size - 1;
    const row = Math.floor(id / COLS);
    const col = id % COLS;

    const cell = playerGrid[id];

    // If the cell has already been changed or it's already colored or adjacent cells are colored, do nothing
    if (cell.color !== 'white') {
      return; // {doNothing}
    }

    setPlayerGrid(() => {
      const updatedGrid = [...playerGrid];
      let success = false;

      if (direction === 'up' && row >= (numGrids)) {
        const startRow = row - numGrids;
        const endRow = row;

        let validChange = true;
        for (let r = startRow; r <= endRow; r++) {
          if (isGridColored(r, col)) {
            validChange = false;
            break;
          }
        }

        if (validChange) {
          for (let r = startRow; r <= endRow; r++) {
            updatedGrid[r * COLS + col] = { ...updatedGrid[r * COLS + col], color: 'cyan', status: 'ship' };
          }
          success = true;
        }
      } else if (direction === 'down' && row <= ROWS - (numGrids + 1)) {
        const startRow = row;
        const endRow = row + numGrids;

        let validChange = true;
        for (let r = startRow; r <= endRow; r++) {
          if (isGridColored(r, col)) {
            validChange = false;
            break;
          }
        }

        if (validChange) {
          for (let r = startRow; r <= endRow; r++) {
            updatedGrid[r * COLS + col] = { ...updatedGrid[r * COLS + col], color: 'cyan', status: 'ship' };
          }
          success = true;
        }
      } else if (direction === 'left' && col >= (numGrids)) {
        const startCol = col - numGrids;
        const endCol = col;

        let validChange = true;
        for (let c = startCol; c <= endCol; c++) {
          if (isGridColored(row, c)) {
            validChange = false;
            break;
          }
        }

        if (validChange) {
          for (let c = startCol; c <= endCol; c++) {
            updatedGrid[row * COLS + c] = { ...updatedGrid[row * COLS + c], color: 'cyan', status: 'ship' };
          }
          success = true;
        }
      } else if (direction === 'right' && col <= COLS - (numGrids + 1)) {
        const startCol = col;
        const endCol = col + numGrids;

        let validChange = true;
        for (let c = startCol; c <= endCol; c++) {
          if (isGridColored(row, c)) {
            validChange = false;
            break;
          }
        }

        if (validChange) {
          for (let c = startCol; c <= endCol; c++) {
            updatedGrid[row * COLS + c] = { ...updatedGrid[row * COLS + c], color: 'cyan', status: 'ship' };
          }
          success = true;
        }
      }
      if (success) {
        const newPlayerShip = playerShip.map((data) => {
          if (data.label === selectedShip) {
            return {
              ...data,
              count: 0,
            }
          } else {
            return data;
          }
        });
        setPlayerShip(newPlayerShip);
      }

      return updatedGrid;
    });
  };

  const onShipButtonClick = (shipLabel: string) => {
    setSelectedShip(shipLabel)
  }

  const renderShipOption = () => {
    return playerShip.map((data, idx) => {
      const shipLabel = data.label;
      const shipSize = data.size;
      const shipCount = data.count;
      return (
        <Button key={idx} className='mb-3' size='sm' disabled={shipCount ? false : true} onClick={ () => onShipButtonClick(shipLabel) }>
          {shipLabel}. size: {shipSize}. count: {shipCount}
        </Button>
      )
      
    });
  }

  const startGame = () => {
    let valid = true;
    playerShip.map((data) => {
      if (data.count) {
        valid = false;
      }
    });
    if (valid) {
      setGameStarted(true);
      socket.emit('connect-code', {
        to: opponentCode,
        from: randomCode,
        playerNumber: playerNumber,
        playerTurn: 1,
        fromGrid: playerGrid,
        gameStarted: false,
        gameConnected: true,
      });
    }
  }


  return (
    <div className="App">
      <h1>Playing Against Player {opponentCode}</h1>
      <Container>
        <Row>
          <Col xs={4}>
            <h1>Your Board</h1>
          </Col>
          <Col xs={4}>
            <h1>Place Your Ship on the Board</h1>
            <div className="grid">
              {playerGrid.map(cell => (
                <div
                  key={cell.id}
                  className="cell"
                  style={{ backgroundColor: cell.color }}
                  onClick={() => handleClick(cell.id, playerDirection)}
                />
              ))}
            </div>
          </Col>
          <Col xs={4}>
            <h1>Option</h1>
            <h1>Ship Selected:</h1>
            <h3>{selectedShip}</h3>
            <Row style={{ marginTop: 50 }}>
              <Col className="d-grid gap-2">
                {
                  renderShipOption()
                }
              </Col>
              <Col>
                <Row style={{ marginBottom: 10 }}>
                  <h3>Direction: </h3>
                  <h3>{playerDirection}</h3>
                  <Button size='sm' className='mb-3' onClick={ () => setPlayerDirection('up') }>
                    Up
                  </Button>
                  <Button size='sm' className='mb-3' onClick={ () => setPlayerDirection('down') }>
                    Down
                  </Button>
                  <Button size='sm' className='mb-3' onClick={ () => setPlayerDirection('left') }>
                    Left
                  </Button>
                  <Button size='sm' className='mb-3' onClick={ () => setPlayerDirection('right') }>
                    Right
                  </Button>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <Button className="mt-3" onClick={ startGame }>
          Start Game
        </Button>
      </Container>
    </div>
  );
};