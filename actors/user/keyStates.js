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
const keyStateChanges = input$.pipe(distinctUntilChanged());

// The Exports!
export const keyStateSubject = new BehaviorSubject(KEY_STATES.ground);
keyStateChanges.subscribe(keyStateSubject);

export const simKeyStateSubject = new BehaviorSubject(KEY_STATES.ground);
concat(
  after(500, KEY_STATES.left),
  after(500, KEY_STATES.ground),
  after(500, KEY_STATES.right),
  after(500, KEY_STATES.ground)
).subscribe(simKeyStateSubject);
