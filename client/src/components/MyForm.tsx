import React, { useState } from 'react';
import { socket } from '../socket';

export function MyForm({ randomCode, setPlayerNumber }: IMyForm) {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(event: any) {
    event.preventDefault();
    setIsLoading(true);

    socket.timeout(5000).emit('connect-code', {
      to: value,
      from: randomCode,
      playerNumber: 2,
      playerTurn: 1,
    }, () => {
      setIsLoading(false);
    });
  }

  return (
    <form onSubmit={ onSubmit }>
      <p>Enter Opponent's Code:</p>
      <input onChange={ e => setValue(e.target.value) } />

      <button style={{marginLeft:5}} type="submit" disabled={ isLoading }>Submit</button>
    </form>
  );
}

interface IMyForm {
  randomCode: string;
  setPlayerNumber: any;
}
