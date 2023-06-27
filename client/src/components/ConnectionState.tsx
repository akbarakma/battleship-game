import React from 'react';

export function ConnectionState({ isConnected }: IConnectionState) {
  return <div style={{margin: 10}}>
     <p>Socket Connection State: { '' + isConnected }</p>
  </div>;
}

interface IConnectionState { isConnected: any }