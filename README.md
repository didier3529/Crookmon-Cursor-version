# crookmon-game

A framework?agnostic, UI-free JavaScript battle engine for turn-based card duels.  
Zero runtime dependencies ? ESM & CJS ? Browser, Node.js, Deno & Bun ? React hook integration ? Seedable RNG ? Fully tested

---

## Table of Contents

1. [Overview](#overview)  
2. [Features](#features)  
3. [Installation](#installation)  
4. [Quick Start](#quick-start)  
   - [Headless Usage](#headless-usage)  
   - [React Hook Usage](#react-hook-usage)  
5. [API Reference](#api-reference)  
6. [Components](#components)  
7. [Dependencies](#dependencies)  
8. [Development & Build](#development--build)  
9. [Testing](#testing)  
10. [Contributing](#contributing)  
11. [License](#license)  

---

## Overview

`crookmon-game` (a.k.a. CrookmonBattleCore) is a pure-function, finite-state battle engine for card duels. It provides:

- Core engine functions (`initializeBattle`, `processTurn`, `generateAIMove`, etc.)  
- Event subscription API via a lightweight emitter  
- Seedable RNG for deterministic runs  
- Dynamic difficulty scaling through win-streaks  
- A React hook (`useBattleEngine`) for declarative UIs  
- Zero runtime dependencies; ships as ESM & optional CJS  

Use it headlessly in Node.js, Deno, Bun or in the browser, or integrate seamlessly into React.

---

## Features

- UI-agnostic battle engine core  
- Finite State Machine (idle ? selecting ? resolving ? finished)  
- Pluggable AI move generation  
- Damage calculation with critical hits & mitigation  
- Victory evaluation (win/draw)  
- Win-streak scaling for campaigns  
- Event subscription API (`on`, `off`, `once`)  
- React hook integration (`useBattleEngine`)  
- Seedable RNG for testing & reproducibility  
- ESM & CJS bundles with JSDoc/TypeScript definitions  

---

## Installation

```bash
npm install crookmon-game
# or
yarn add crookmon-game
```

### Node Compatibility

This library targets **Node.js 14+**. The analytics service relies on the
`fetch` API. Node 18 and later include `fetch` natively. For Node 14 or 16,
install a polyfill such as [`cross-fetch`](https://www.npmjs.com/package/cross-fetch).

---

## Quick Start

### Headless Usage

```js
import {
  initializeBattle,
  processTurn,
  generateAIMove,
  evaluateVictory,
  advanceWinStreak,
  on,
  off
} from 'crookmon-game';

// 1. Initialize
let battle = initializeBattle({
  playerDeck: [...],
  aiDeck: [...],
  seed: 12345
});

// Subscribe to events
on('turnProcessed', ({ battleState, action }) => {
  console.log('Turn processed:', action, battleState);
});

// 2. Battle loop
while (!evaluateVictory(battle).finished) {
  // Player plays (example)
  battle = processTurn(battle, { type: 'PLAY_CARD', cardId: 'fireball' });

  // AI turn
  const aiAction = generateAIMove(battle, { difficulty: 'medium' });
  battle = processTurn(battle, aiAction);
}

// 3. Evaluate & scale
const result = evaluateVictory(battle);
console.log('Result:', result);
const newHP = advanceWinStreak('player', result);
console.log('Player HP for next battle:', newHP);
```

### React Hook Usage

```jsx
import React from 'react';
import { useBattleEngine } from 'crookmon-game';

function BattleUI({ config }) {
  const { state, dispatch, subscribe } = useBattleEngine(config);

  React.useEffect(() => {
    const unsubscribe = subscribe('victory', result => {
      alert(`Winner: ${result.winner}`);
    });
    return unsubscribe;
  }, [subscribe]);

  if (state.phase === 'idle') {
    return <button onClick={() => dispatch({ type: 'START' })}>Start Battle</button>;
  }

  // render cards, HP, logs, etc.
  return (
    <div>
      <h2>Phase: {state.phase}</h2>
      {/* ... */}
      <button onClick={() => dispatch({ type: 'PLAY_CARD', cardId: 'waterblast' })}>
        Play Waterblast
      </button>
    </div>
  );
}
```

---

## API Reference

```ts
// Core Functions
initializeBattle(config: BattleConfig): BattleState
processTurn(state: BattleState, action: BattleAction): BattleState
generateAIMove(state: BattleState, options?: AIMoveOptions): BattleAction
calculateDamage(attacker: Character, defender: Character, move: Move): number
evaluateVictory(state: BattleState): { finished: boolean; winner?: 'player' | 'ai'; draw?: boolean }
advanceWinStreak(playerId: string, result: VictoryResult): number

// Event API
on(event: string, listener: EventListener): void
off(event: string, listener: EventListener): void
once(event: string, listener: EventListener): void

// React Hook
useBattleEngine(config: BattleConfig): {
  state: BattleState
  dispatch: (action: BattleAction) => void
  subscribe: (event: string, listener: EventListener) => Unsubscribe
}

// Utilities
// (see source for deepClone, merge, randomChoice, etc.)
```

Full JSDoc/TypeScript definitions are included in the package.

---

## Components

### Core Engine Modules

- **initializeBattle.js**  
  Sets up the initial `BattleState`, FSM & event emitter.

- **processTurn.js**  
  Validates & applies a player or AI move, advances FSM, emits events.

- **generateAIMove.js**  
  Chooses an AI action based on state, difficulty profile & RNG.

- **calculateDamage.js**  
  Computes damage with critical hits & defense mitigation.

- **evaluateVictory.js**  
  Determines if the battle is won, lost or drawn.

- **advanceWinStreak.js**  
  Applies HP scaling based on win-streak progress.

- **stateMachine.js**  
  FSM core: defines states & transitions.

- **eventEmitter.js**  
  Lightweight emitter: `on`, `off`, `once`, `emit`.

- **rng.js**  
  Seedable RNG: `setSeed`, `random`, `randomInt`, `getState`, `setState`.

### Utilities

- **utils.js**  
  Helpers: `deepClone`, `merge`, `isObject`, `randomChoice`, etc.

### React Integration

- **useBattleEngine.js**  
  React hook that wraps core APIs into `state`, `dispatch`, `subscribe`.

### Entry & Build

- **index.js**  
  Main entry; re-exports core functions & hook.

- **rollup.config.js**  
  Bundles ESM & CJS outputs.

### Configuration & Types

- package.json, jest.config.js, .eslintrc.js, .prettierrc, tsconfig.json  
- **d.ts** (TypeScript declaration file)  
- **node.js** (Env detection for Node.js builds)

---

## Dependencies

- **Runtime:** None  
- **Peer:** React (for `useBattleEngine`)  
- **Dev:**  
  - rollup & plugins  
  - jest  
  - typescript & typedoc  
  - eslint & prettier  
  - semantic-release (CI/CD)  

---

## Development & Build

```bash
# Clone & install
git clone https://github.com/your-org/crookmon-game.git
cd crookmon-game
npm install

# Build
npm run build   # generates /dist ESM & CJS bundles

# Watch
npm run dev

# Generate docs
npm run docs
```

CI uses GitHub Actions to lint, test, build & semantic-release.

---

## Testing

```bash
npm test        # run Jest suite
npm run coverage
```

All core modules are covered with unit tests under `/__tests__/`.

---

## Contributing

1. Fork the repo  
2. Create a feature branch  
3. Write tests & documentation  
4. Submit a PR against `main`  

Please follow the existing code style and commit message conventions.

---

## License

MIT ? [Your Name or Organization]