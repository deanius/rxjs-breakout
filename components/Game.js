import React, { useEffect } from 'react';
import { fromEvent, merge, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { trigger } from 'rx-helper';

const PADDLE_KEYS = {
  left: 37,
  right: 39
};

const KEY_STATES = {
  left: -1,
  right: 1,
  ground: 0
};

const input$ = merge(
  fromEvent(document, 'keydown', event => {
    switch (event.keyCode) {
      case PADDLE_KEYS.left:
        return KEY_STATES.left;
      case PADDLE_KEYS.right:
        return KEY_STATES.right;
      default:
        return KEY_STATES.ground;
    }
  }),
  fromEvent(document, 'keyup', event => KEY_STATES.ground)
);
const keyStateChanges = input$.pipe(distinctUntilChanged());
const keyState = new BehaviorSubject(KEY_STATES.ground);
keyStateChanges.subscribe(keyState);

export const Game = () => {
  useEffect(() => {
    const sub = keyState.subscribe(keyCode => console.log(keyCode));

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
