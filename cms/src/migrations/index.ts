import * as migration_20260206_234629 from './20260206_234629';
import * as migration_20260207_081446 from './20260207_081446';
import * as migration_20260207_182843 from './20260207_182843';
import * as migration_20260209_213000 from './20260209_213000';
import * as migration_20260209_220000 from './20260209_220000';

export const migrations = [
  {
    up: migration_20260206_234629.up,
    down: migration_20260206_234629.down,
    name: '20260206_234629',
  },
  {
    up: migration_20260207_081446.up,
    down: migration_20260207_081446.down,
    name: '20260207_081446',
  },
  {
    up: migration_20260207_182843.up,
    down: migration_20260207_182843.down,
    name: '20260207_182843',
  },
  {
    up: migration_20260209_213000.up,
    down: migration_20260209_213000.down,
    name: '20260209_213000',
  },
  {
    up: migration_20260209_220000.up,
    down: migration_20260209_220000.down,
    name: '20260209_220000',
  },
];
