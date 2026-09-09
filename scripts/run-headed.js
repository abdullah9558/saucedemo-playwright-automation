const { spawnSync } = require('node:child_process');

const result = spawnSync(
  process.execPath,
  ['--test', 'tests/checkout.test.js'],
  {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: {
      ...process.env,
      HEADED: '1',
      SLOW_MO: process.env.SLOW_MO || '800'
    }
  }
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
