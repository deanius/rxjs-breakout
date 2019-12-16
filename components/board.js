export const CANVAS = {
  width: 480,
  height: 320
};

const BRICK_ROWS = 5;
const BRICK_COLUMNS = 7;
const BRICK_HEIGHT = 20;
const BRICK_GAP = 3;

const INITIAL_OBJECTS = {
  ball: {
    position: {
      x: CANVAS.width / 2,
      y: CANVAS.height / 2
    },
    direction: {
      x: 2,
      y: 2
    }
  },
  bricks: factory(),
  score: 0
};

function factory() {
  let width =
    (CANVAS.width - BRICK_GAP - BRICK_GAP * BRICK_COLUMNS) / BRICK_COLUMNS;
  let bricks = [];

  for (let i = 0; i < BRICK_ROWS; i++) {
    for (let j = 0; j < BRICK_COLUMNS; j++) {
      bricks.push({
        x: j * (width + BRICK_GAP) + width / 2 + BRICK_GAP,
        y: i * (BRICK_HEIGHT + BRICK_GAP) + BRICK_HEIGHT / 2 + BRICK_GAP + 20,
        width: width,
        height: BRICK_HEIGHT
      });
    }
  }

  return bricks;
}
