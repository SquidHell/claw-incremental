import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from '@playwright/test';

/**
 * Certains environnements (conteneurs CI, bacs a sable) fournissent deja un
 * Chromium sous PLAYWRIGHT_BROWSERS_PATH, avec un numero de build qui ne
 * correspond pas forcement a celui attendu par la version installee de
 * Playwright. On l'utilise tel quel plutot que de telecharger un navigateur.
 */
const providedChromium = process.env.PLAYWRIGHT_BROWSERS_PATH
  ? join(process.env.PLAYWRIGHT_BROWSERS_PATH, 'chromium')
  : null;
const executablePath =
  providedChromium && existsSync(providedChromium) ? providedChromium : undefined;

/**
 * Test de fumee sur un vrai navigateur mobile emule : c'est le seul moyen de
 * verifier que les evenements pointer et la mise a l'echelle entiere marchent
 * ensemble. Chromium est deja present dans l'environnement.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'off',
  },
  projects: [
    {
      // Viewport type telephone en portrait, sur le Chromium deja present dans
      // l'environnement (pas de telechargement de navigateur).
      name: 'mobile',
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        launchOptions: executablePath ? { executablePath } : {},
      },
    },
  ],
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
