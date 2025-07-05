/**
 * @type {String[]}
 */
let tiles = [];

const TILE_COUNT = 12;
const LAYERS = 3;
let isTilePressing = false;

const GameStateEnum = {
  Playing: 'playing',
  Lose: 'lose',
  Win: 'win',
};

const GameState = {
  state: GameStateEnum.Playing,
  get: () => this.state,
  set: (state) => (this.state = state),
};

const INITIAL_TILES_MATCH = [
  {color: '#ffef5e', count: 0, id: 'yellow'},
  {color: '#5ee2ff', count: 0, id: 'blue'},
  {color: '#5effc7', count: 0, id: 'slime'},
  {color: '#74ff5e', count: 0, id: 'green'},
];

const body = document.querySelector('body');

const tileRetrieverElement = document.createElement('div');

/**
 *
 * @param {number} min
 * @param {number} value
 * @param {number} max
 * @returns number
 */
const clamp = (min, value, max) => {
  return value <= min ? min : value >= max ? max : value;
};

/**
 *
 * @param {MouseEvent} event
 * @param {String} id
 */
async function tileClick(event, id) {
  if (tiles.length >= 7) {
    return;
  }

  if (isTilePressing) return;

  isTilePressing = true;

  const {left, top} = tileRetrieverElement.getBoundingClientRect();
  event.target.style.top = `${top + 10}px`;
  event.target.style.left = `${10 + left + 110 * tiles.length}px`;
  tiles.push(id);
  await new Promise((res) => setTimeout(res, 100));

  event.target.style.position = 'static';
  tileRetrieverElement.appendChild(event.target);
  await checkTriple(id);
  isTilePressing = false;
  event.target.removeEventListener('click', (event) => tileClick(event, id));
}

/**
 *
 * @param {String} id
 * @returns
 */
async function checkTriple(id) {
  if (tiles.length < 3) {
    return;
  }

  const threeMatchesArray = tiles.filter((t) => t.match(id.split('-')[1]));

  if (threeMatchesArray.length === 3) {
    for (const el of threeMatchesArray) {
      const tileElementToRemove = document.querySelector(`#${el}`);
      tileRetrieverElement.removeChild(tileElementToRemove);
    }

    tiles = tiles.filter((t) => !t.match(id.split('-')[1]));
    return;
  }

  if (tiles.length >= 7) {
    GameState.set(GameStateEnum.Lose);
    displayLoseModal();
  }
}

const displayLoseModal = () => {
  const modal = document.createElement('div');
  modal.classList.add('loseModalContainer');
  const modalChild = document.createElement('div');
  modalChild.classList.add('loseModalCard');
  modalChild.textContent = 'Please Refresh page to start the game again';
  modal.appendChild(modalChild);
  body.appendChild(modal);
};

/**
 * used to initialize the tiles before rendering the scene
 */
const renderInitialTiles = () => {
  GameState.set(GameStateEnum.Playing);

  for (let i = 0; i <= TILE_COUNT; i++) {
    const tileElement = document.createElement('div');
    tileElement.classList.add('tile');

    /* POSITION */

    // TOP VALUE
    const topRand = Math.random() * 100;
    const topRand2 = Math.random() * 2;

    const topClamp = clamp(
      body.clientHeight / 4,
      body.clientHeight / topRand,
      body.clientHeight / 2
    );

    tileElement.style.top = `${topClamp * topRand2}px`;

    // LEFT VALUE
    const leftRand = Math.random() * 100;
    const leftRand2 = Math.random() * 2;

    const leftClamp = clamp(
      body.clientWidth / 4,
      body.clientWidth / leftRand,
      body.clientWidth / 2
    );

    tileElement.style.left = `${leftClamp * leftRand2}px`;

    /* BACKGROUND */

    const colorFound = INITIAL_TILES_MATCH.find(
      (t) => t.count != Math.floor(TILE_COUNT / INITIAL_TILES_MATCH.length)
    );

    if (!colorFound) {
      return;
    }
    colorFound.count += 1;
    // tileElement.style.background = `rgb(255, ${255 - Math.floor(topRand)}, ${
    //   255 - Math.floor(topRand)
    // })`;
    tileElement.style.background = colorFound.color;
    tileElement.id = `tile-${colorFound.id}-${i}`;

    tileElement.addEventListener('click', (event) =>
      tileClick(event, tileElement.id)
    );

    tileRetrieverElement.classList.add('tileRetriever');

    body.appendChild(tileElement);
    body.appendChild(tileRetrieverElement);
  }
};

window.addEventListener('load', () => {
  renderInitialTiles();
});
