import React from 'react';

import { Game } from '../components/Game';
import { simKeyStateSubject } from '../actors/user/keyStates';

export default {
  title: 'Game'
};

export const playableCanvas = () => <Game />;
export const simulatedMovement = () => <Game keyState={simKeyStateSubject} />;
