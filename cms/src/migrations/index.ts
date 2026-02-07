import * as migration_20260206_234629 from './20260206_234629';
import * as migration_20260207_081446 from './20260207_081446';

export const migrations = [
  {
    up: migration_20260206_234629.up,
    down: migration_20260206_234629.down,
    name: '20260206_234629',
  },
  {
    up: migration_20260207_081446.up,
    down: migration_20260207_081446.down,
    name: '20260207_081446'
  },
];
