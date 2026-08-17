const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');

let mainWindow = null;
let serverInstance = null;
let isQuitting = false;
let currentPort = 3000;

// 1. Dynamic Port Allocator (Avoid conflicts with existing processes)
function findAvailablePort(startPort = 3000) {
  return new Promise((resolve) => {
    const server = http.createServer();
    server.listen(startPort, 'localhost', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

// 2. Start Embedded Next.js HTTP Server
async function startEmbeddedServer() {
  const isDev = !app.isPackaged && process.env.NODE_ENV !== 'production';
  const appDir = app.isPackaged
    ? path.join(process.resourcesPath, 'app')
    : path.resolve(__dirname, '..');

  currentPort = await findAvailablePort(3000);
  console.log(`[Cockpit IA] Lancement du serveur Next.js embarqué sur le port ${currentPort} depuis: ${appDir} (Dev: ${isDev})`);

  try {
    const next = require('next');
    const nextApp = next({
      dev: isDev,
      dir: appDir,
      port: currentPort,
      hostname: 'localhost',
    });

    const handle = nextApp.getRequestHandler();
    await nextApp.prepare();

    return new Promise((resolve, reject) => {
      serverInstance = http.createServer((req, res) => {
        handle(req, res);
      });

      serverInstance.listen(currentPort, 'localhost', (err) => {
        if (err) return reject(err);
        const url = `http://localhost:${currentPort}`;
        console.log(`[Cockpit IA] ✓ Serveur Next.js embarqué prêt sur ${url}`);
        resolve(url);
      });
    });
  } catch (err) {
    console.error('[Cockpit IA] Erreur initialisation serveur embarqué:', err);
    throw err;
  }
}

// 3. Stop Embedded Server
function stopEmbeddedServer() {
  if (serverInstance) {
    console.log('[Cockpit IA] Arrêt du serveur embarqué...');
    try {
      serverInstance.close();
    } catch (e) {}
    serverInstance = null;
  }
}

// 4. Loading Splash Screen with 3D Gyroscope Emblem
function getLoadingHTML() {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Cockpit IA - Initialisation</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #08090C;
      color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      width: 100vw;
      user-select: none;
      overflow: hidden;
    }
    .card {
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(51, 65, 85, 0.6);
      border-radius: 20px;
      padding: 36px 44px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(12px);
      max-width: 480px;
      text-align: center;
    }
    .brand-emblem {
      position: relative;
      width: 76px;
      height: 76px;
      border-radius: 20px;
      background: #0a0e1a;
      border: 1px solid rgba(56, 189, 248, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 12px 35px -6px rgba(0, 0, 0, 0.8), 0 0 25px rgba(37, 99, 235, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.15);
      margin-bottom: 20px;
      overflow: hidden;
    }
    .glow-bg {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.3) 0%, rgba(99, 102, 241, 0.15) 50%, transparent 75%);
      filter: blur(8px);
      pointer-events: none;
    }
    .emblem-svg {
      width: 54px;
      height: 54px;
      position: relative;
      z-index: 1;
      filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.6));
    }
    .outer-arc {
      transform-origin: 50px 50px;
      animation: spinClockwise 8s linear infinite;
    }
    .inner-arc {
      transform-origin: 50px 50px;
      animation: spinCounterClockwise 5s linear infinite;
    }
    .core-sphere {
      transform-origin: 50px 50px;
      animation: pulseQuantum 2.5s ease-in-out infinite alternate;
    }
    @keyframes spinClockwise {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes spinCounterClockwise {
      from { transform: rotate(0deg); }
      to { transform: rotate(-360deg); }
    }
    @keyframes pulseQuantum {
      0% { transform: scale(0.92); opacity: 0.88; }
      100% { transform: scale(1.08); opacity: 1; filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.9)); }
    }
    .title {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 6px;
      color: #ffffff;
    }
    .subtitle {
      font-size: 13px;
      color: #94a3b8;
      margin-bottom: 24px;
      line-height: 1.4;
    }
    .spinner-ring {
      width: 36px;
      height: 36px;
      border: 3px solid rgba(59, 130, 246, 0.15);
      border-top-color: #38bdf8;
      border-radius: 50%;
      animation: spin 0.9s cubic-bezier(0.6, 0.2, 0.4, 0.8) infinite;
      margin-bottom: 16px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .status-text {
      font-size: 12px;
      font-weight: 500;
      color: #38bdf8;
      letter-spacing: 0.01em;
    }
    .steps {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid rgba(51, 65, 85, 0.4);
      text-align: left;
      font-size: 11px;
      color: #64748b;
    }
    .step-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #38bdf8;
      box-shadow: 0 0 8px #38bdf8;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand-emblem">
      <div class="glow-bg"></div>
      <svg class="emblem-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle class="outer-arc" cx="50" cy="50" r="38" stroke="url(#cyanGrad)" stroke-width="5" stroke-linecap="round" stroke-dasharray="190 50" />
        <circle class="inner-arc" cx="50" cy="50" r="26" stroke="url(#purpleGrad)" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="125 40" />
        <circle class="core-sphere" cx="50" cy="50" r="13" fill="url(#coreGrad)" />
        <defs>
          <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00f2fe" />
            <stop offset="50%" stop-color="#38bdf8" />
            <stop offset="100%" stop-color="#2563eb" />
          </linearGradient>
          <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8" />
            <stop offset="60%" stop-color="#818cf8" />
            <stop offset="100%" stop-color="#c084fc" />
          </linearGradient>
          <radialGradient id="coreGrad" cx="38%" cy="38%" r="62%">
            <stop offset="0%" stop-color="#67e8f9" />
            <stop offset="45%" stop-color="#38bdf8" />
            <stop offset="85%" stop-color="#1d4ed8" />
            <stop offset="100%" stop-color="#0f2b66" />
          </radialGradient>
        </defs>
      </svg>
    </div>
    <div class="title">Cockpit IA</div>
    <div class="subtitle">Gestion Commerciale & Automatisation des Ventes</div>
    <div class="spinner-ring"></div>
    <div class="status-text" id="statusMsg">Chargement du moteur commercial et des styles...</div>
    <div class="steps">
      <div class="step-item"><span class="dot"></span> Démarrage du serveur embarqué ultra-rapide</div>
      <div class="step-item"><span class="dot"></span> Initialisation des connecteurs IA & Catalogue</div>
    </div>
  </div>
</body>
</html>`;
}

// 5. Recovery Fallback Screen
function getRecoveryHTML(port) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Cockpit IA - Connexion</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #08090C;
      color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      overflow: hidden;
    }
    .card {
      background: #0e1628;
      border: 1px solid #1e293b;
      border-radius: 20px;
      padding: 36px 40px;
      max-width: 520px;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    h2 {
      font-size: 18px;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 8px;
    }
    p {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .btn-primary {
      background: #2563eb;
      color: #ffffff;
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>Initialisation en cours...</h2>
    <p>Le serveur local finalise son démarrage. Cliquez ci-dessous pour rafraîchir la page.</p>
    <button class="btn-primary" onclick="window.location.reload()">🔄 Rafraîchir l'application</button>
  </div>
</body>
</html>`;
}

// 6. Create Window & Initialize
async function createWindow() {
  const iconPath = path.join(__dirname, '../public/favicon.ico');
  const hasIcon = fs.existsSync(iconPath);

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Cockpit IA - Gestion Commerciale & Stocks',
    backgroundColor: '#08090C',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
    ...(hasIcon ? { icon: iconPath } : {}),
  });

  // Display window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Show 3D splash screen while server starts
  mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(getLoadingHTML())}`);

  try {
    const targetUrl = await startEmbeddedServer();
    if (!isQuitting && mainWindow) {
      mainWindow.loadURL(targetUrl);
    }
  } catch (err) {
    console.error('[Cockpit IA] Échec au démarrage du serveur embarqué:', err);
    if (mainWindow) {
      mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(getRecoveryHTML(currentPort))}`);
    }
  }

  // Open external links safely in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http') && !url.includes(`localhost:${currentPort}`)) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => {
  isQuitting = true;
  stopEmbeddedServer();
});

app.on('will-quit', () => {
  stopEmbeddedServer();
});

app.on('window-all-closed', () => {
  stopEmbeddedServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
