import React, { useEffect } from 'react';
import { timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameLoop } from 'rx-helper';

import { keyStateSubject } from '../actors/user/keyStates';

export const Game = ({ keyState = keyStateSubject }) => {
  useEffect(() => {
    const sub = new GameLoop()
      .pipe(takeUntil(timer(3000)))
      .subscribe(({ delta }) => console.log(delta, keyState.value));

    return () => sub.unsubscribe();
  }, []);
  return (
    <canvas
      id="stage"
      width="480"
      height="320"
      style={{ backgroundColor: '#eee' }}
    ></canvas>
  );
};
