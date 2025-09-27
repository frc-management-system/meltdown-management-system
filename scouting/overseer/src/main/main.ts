import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import path from 'node:path';
import isDev from 'electron-is-dev';
import electronSquirrelStartup from 'electron-squirrel-startup';
import { management } from './management';
import { template } from './template';

if (electronSquirrelStartup) app.quit();

let mainWindow: BrowserWindow | null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      preload: path.join(__dirname, '../preload/preload.js'),
    },
    icon: path.join(__dirname, './assets/logo.png'),
  });

  nativeTheme.themeSource = 'light'; 

  // Vite dev server URL

  // dev
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.removeMenu();
    mainWindow.loadURL(`file://${path.join(__dirname, '../renderer/index.html')}`);
  }

  mainWindow.on('closed', (): null => (mainWindow = null));
}

app.whenReady().then((): void => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow == null) {
    createWindow();
  }
});

ipcMain.handle('isDev', (): boolean => {
  return isDev;
});

management();
template();
