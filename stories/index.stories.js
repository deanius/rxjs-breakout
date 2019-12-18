import React from 'react';
import { after } from 'rx-helper';
import { Game } from '../components/Game';
import { simKeyState, simFastKeyStates } from '../actors/user/keyStates';

export default {
  title: 'Game'
};

export const playableCanvas = () => {
  const game = (
    <Game>
      <br />
      <input
        id="focusme"
        style={{ outline: 'none', border: 'none', color: 'transparent' }}
      />
    </Game>
  );
  after(100, () => {
    document.getElementById('focusme').focus();
  }).subscribe();
  return game;
};
export const simulatedMovement = () => <Game direction$={simKeyState} />;
export const fastMovement = () => <Game direction$={simFastKeyStates} />;
