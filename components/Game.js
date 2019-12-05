import React, { useEffect } from 'react';
import { timer, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameLoop } from 'rx-helper';

import { keyStateChanges } from '../actors/user/keyStates';

export const Game = ({ keyState = keyStateChanges }) => {
  useEffect(() => {
    const currrentKeyState = new BehaviorSubject(0);
    keyState.subscribe(currrentKeyState);
    const canvas = document.getElementById('stage');
    const context = canvas.getContext('2d');

    const PADDLE_WIDTH = 100;
    const PADDLE_HEIGHT = 20;

    function drawPaddle(position) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.beginPath();
      context.rect(
        position - PADDLE_WIDTH / 2,
        context.canvas.height - PADDLE_HEIGHT,
        PADDLE_WIDTH,
        PADDLE_HEIGHT
      );
      context.fill();
      context.closePath();
    }

    const sub = new GameLoop()
      .pipe(takeUntil(timer(3000)))
      .subscribe(({ delta }) => {
        const position = (currrentKeyState.value + 1) * 240;
        drawPaddle(position);
      });

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
