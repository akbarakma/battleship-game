import React, { useEffect, useState } from 'react';
import { socket } from '../socket';
import { Table } from 'react-bootstrap';
import { getRandomArbitrary } from '../helpers/getRandomNumber';

export function Board({ opponent, playerNumber }: IBoard) {
  const [boardArr, setBoardArr] = useState<IBoardArr[][]>([]);
  const [playerTurn, setPlayerTurn] = useState(1);
  const [shipLengthArr, setShipLengthArr] = useState([5,4,3,2]);

  useEffect(() => {
    const tempArr: any = [[]];
    for (let i = 0; i < 10; i++) {
      const temp = [];
      for (let j = 0; j < 10; j++) {
        temp.push({
          cordinate: `${i}-${j}`,
          isYourShip: false,
          status: '-',
        });
      }
      tempArr.push(temp);
    }
    setBoardArr(tempArr);
  }, []);

  useEffect(() => {
    setBoard();
  }, [boardArr]);

  const setBoard = () => {
    return <Table bordered size='sm'>
    <tbody>
      {
        boardArr.map((data, index) => {
          return (
            <tr key={index}>
              {data.map((data2: IBoardArr, index) => {
                return (
                  <td
                    style={data2.status === 'x' ? {backgroundColor: 'black'} : {}}
                    key={index}
                    onClick={() => {
                      const splitted = data2.cordinate.split('-');
                      const tempBoardArr: IBoardArr[][] = JSON.parse(JSON.stringify(boardArr));
                      tempBoardArr[Number(splitted[0])+1][Number(splitted[1])].status = 'x';
                      setBoardArr(tempBoardArr);
                    }}>{data2.cordinate}
                  </td>
                )
              })}
            </tr>
          )
        })
      }
    </tbody>
  </Table>
  }
  return (
    <div>
      <h1>Player Number: {playerNumber}</h1>
      <h1>Playing Againts Player: {opponent}</h1>
      <h1>{ playerTurn === playerNumber ? 'Your Turn' : 'Waiting for the opponent Turn' }</h1>
      <div style={{ paddingLeft: 500, paddingRight: 500 }}>
        { setBoard() }
      </div>
    </div>
  );
}

interface IBoard {
  opponent: string;
  playerNumber: number | null | undefined;
}

interface IBoardArr {
  cordinate: string;
  isYourShip: boolean;
  status: string;
}