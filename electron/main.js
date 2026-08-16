const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

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
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
    ...(hasIcon ? { icon: iconPath } : {}),
  });

  const appUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000';

  mainWindow.loadURL(appUrl);

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
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
