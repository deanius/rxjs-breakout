import React from 'react';

import { Game } from '../components/Game';
import { simKeyState } from '../actors/user/keyStates';

export default {
  title: 'Game'
};

export const playableCanvas = () => <Game />;
export const simulatedMovement = () => <Game keyState={simKeyState} />;