const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');

let mainWindow;

function checkServer(url) {
  return new Promise((resolve) => {
    http
      .get(url, (res) => {
        resolve(res.statusCode === 200 || res.statusCode === 304 || res.statusCode === 404);
      })
      .on('error', () => {
        resolve(false);
      });
  });
}

async function loadAppWithRetry(window, targetUrl, maxRetries = 40) {
  for (let i = 0; i < maxRetries; i++) {
    const isOnline = await checkServer(targetUrl);
    if (isOnline) {
      window.loadURL(targetUrl);
      return;
    }
    // Show a sleek loading state if not yet loaded
    if (i === 0) {
      window.loadURL(
        `data:text/html;charset=utf-8,${encodeURIComponent(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Cockpit IA - Chargement</title>
          <style>
            body {
              margin: 0;
              background-color: #08090C;
              color: #f8fafc;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              overflow: hidden;
            }
            .spinner {
              width: 48px;
              height: 48px;
              border: 3px solid rgba(59, 130, 246, 0.2);
              border-top-color: #3b82f6;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin-bottom: 20px;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            h2 {
              font-size: 16px;
              font-weight: 600;
              margin: 0 0 8px 0;
              letter-spacing: -0.02em;
            }
            p {
              font-size: 12px;
              color: #94a3b8;
              margin: 0;
            }
          </style>
        </head>
        <body>
          <div class="spinner"></div>
          <h2>Démarrage de Cockpit IA...</h2>
          <p>Initialisation du moteur commercial & synchronisation locale</p>
        </body>
        </html>
      `)}`
      );
    }
    await new Promise((r) => setTimeout(r, 800));
  }

  // Fallback if server takes longer
  window.loadURL(targetUrl);
}

function createWindow() {
  const iconPath = path.join(__dirname, '../public/favicon.ico');
  const hasIcon = fs.existsSync(iconPath);

  mainWindow = new BrowserWindow({
    width: 1366,
    height: 860,
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

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  const appUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000';

  loadAppWithRetry(mainWindow, appUrl);

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
