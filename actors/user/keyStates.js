import { concat, fromEvent, merge, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { after } from 'rx-helper';

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
  fromEvent(document, 'keyup', () => KEY_STATES.ground)
);

// The Exports!
export const keyStateChanges = input$.pipe(distinctUntilChanged());

export const simKeyState = concat(
  after(800, KEY_STATES.ground),
  after(500, KEY_STATES.left),
  after(500, KEY_STATES.ground),
  after(500, KEY_STATES.right),
  after(500, KEY_STATES.ground)
);
