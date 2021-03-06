import { concat, fromEvent, of } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  switchMap,
  filter,
  tap
} from 'rxjs/operators';
import { after, trigger, on } from 'rx-helper';

const PADDLE_KEYS = {
  left: 37,
  right: 39
};

const KEY_STATES = {
  left: -1,
  right: 1,
  ground: 0
};

function directionFrom(keyCode) {
  switch (keyCode) {
    case PADDLE_KEYS.left:
      return KEY_STATES.left;
    case PADDLE_KEYS.right:
      return KEY_STATES.right;
    default:
      return KEY_STATES.ground;
  }
}

// Tranlation:
// Every keydown (fromEvent):
// - Cancel the waiting on the previous keyup (switchMap)
// - Emit the direction corresponding to the keyCode (of(directionFrom))
// - After that (concat).. Emit a 0 when a keyUp comes in for that keyCode
const input$ = fromEvent(document, 'keydown').pipe(
  // prettier-ignore
  switchMap(({ keyCode }) => concat(
    of(directionFrom(keyCode)),
    wrapUpWithZeroFor(keyCode)
  ))
);
function wrapUpWithZeroFor(keyCode) {
  return fromEvent(document, 'keyup').pipe(
    filter(e => e.keyCode == keyCode),
    map(() => KEY_STATES.ground)
  );
}

// The Exports!
export const directionChanges = input$.pipe(
  distinctUntilChanged(),
  tap(dir => trigger('user/direction', dir))
);

on('user/direction', ({ type, payload }) => console.log(type, payload));

export const simKeyState = concat(
  after(800, KEY_STATES.left),
  after(800, KEY_STATES.right),
  after(1600, KEY_STATES.left),
  after(800, KEY_STATES.ground)
);

export const simFastKeyStates = concat(
  after(100, KEY_STATES.left),
  after(100, KEY_STATES.right),
  after(200, KEY_STATES.left),
  after(100, KEY_STATES.ground),
  after(100, KEY_STATES.right),
  after(100, KEY_STATES.left),
  after(100, KEY_STATES.right),
  after(100, KEY_STATES.left),
  after(100, KEY_STATES.right)
);
