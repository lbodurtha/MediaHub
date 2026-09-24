import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      name: 'shared',
      root: './packages/shared',
      environment: 'node',
    },
  },
  {
    test: {
      name: 'server',
      root: './server',
      environment: 'node',
    },
  },
  {
    test: {
      name: 'client',
      root: './client',
      environment: 'jsdom',
    },
  },
]);
