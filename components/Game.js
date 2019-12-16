import React, { useEffect } from 'react';
import { of } from 'rxjs';
import { withLatestFrom, scan } from 'rxjs/operators';
import { GameLoop } from 'rx-helper';

import { keyStateChanges } from '../actors/user/keyStates';
import { CANVAS, INITIAL_WORLD } from './board';

export const Game = ({ children, keyState = keyStateChanges }) => {
  useEffect(() => {
    const canvas = document.getElementById('stage');
    const context = canvas.getContext('2d');
    drawWorld(INITIAL_WORLD, context, canvas);
    const sub = new GameLoop()
      .pipe(
        // For some reason GameLoop doesn't give us true deltas, so calculate them
        scan((previous, current) => ({
          elapsed: current.delta,
          delta: current.delta - previous.elapsed
        })),
        withLatestFrom(keyState, of(canvas)),
        scan(
          (world, [tick, keyState, canvas]) =>
            worldUpdater(world, { tick, keyState, canvas }),
          INITIAL_WORLD
        )
      )
      .subscribe(world => {
        drawWorld(world, context, canvas);
      });

    return () => sub.unsubscribe();
  }, []);
  return (
    <>
      <canvas
        id="stage"
        width={CANVAS.width}
        height={CANVAS.height}
        style={{ backgroundColor: '#eee' }}
      ></canvas>
      {children}
    </>
  );
};

////// WORLD UPDATING
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const PADDLE_SPEED = 240;

const BALL_RADIUS = 10;
const BALL_SPEED = 60 / 1000;

function worldUpdater(world, { tick, keyState, canvas }) {
  const { delta } = tick;
  const direction = keyState;
  const { paddle, ball } = world;

  updatePaddle(paddle, direction, delta, canvas);
  updateBall(ball, delta);
  return world;
}

function updatePaddle(paddle, direction, delta, canvas) {
  let newX = paddle.x + (direction * delta * PADDLE_SPEED) / 1000;

  paddle.x = Math.max(
    Math.min(newX, canvas.width - PADDLE_WIDTH / 2),
    PADDLE_WIDTH / 2
  );
}

function updateBall(ball, delta = 0) {
  ball.position.x = ball.position.x + ball.direction.x * delta * BALL_SPEED;
  ball.position.y = ball.position.y + ball.direction.y * delta * BALL_SPEED;

  if (
    ball.position.x < BALL_RADIUS ||
    ball.position.x > CANVAS.width - BALL_RADIUS
  ) {
    ball.direction.x = -ball.direction.x;
  }
}

/////// CANVAS RENDERING ////////
function drawWorld(world, context) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  drawPaddle(world.paddle.x, context);
  drawBall(world.ball, context);
}
function drawBall(ball, context) {
  context.beginPath();
  context.arc(ball.position.x, ball.position.y, BALL_RADIUS, 0, Math.PI * 2);
  context.fill();
  context.closePath();
}

function drawPaddle(position, context) {
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
