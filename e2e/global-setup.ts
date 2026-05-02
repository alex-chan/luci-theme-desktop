import { execSync } from 'child_process';
import * as path from 'path';

/**
 * When E2E_DEPLOY=1, runs deploy.sh so the router matches local sources before tests.
 * DEPLOY_ROUTER is passed as the first argument (default in deploy.sh: 192.168.100.2).
 */
async function globalSetup(): Promise<void> {
  if (process.env.E2E_DEPLOY !== '1') return;

  const router = process.env.DEPLOY_ROUTER ?? '192.168.100.2';
  const root = process.cwd();
  execSync(`bash deploy.sh ${router}`, {
    cwd: root,
    stdio: 'inherit',
  });
}

export default globalSetup;
