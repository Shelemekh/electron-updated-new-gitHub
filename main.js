const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

let mainWindow;

// log.transports.file.level = 'info';
// log.transports.file.file = __dirname + 'log.log';

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/index.html#v${app.getVersion()}`);
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  mainWindow.once('ready-to-show', () => {
   
    log.info('before trigger check updates ad notifications')
    autoUpdater.checkForUpdatesAndNotify();
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
 log.info("autoUpdater update method run");
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
 log.info("autoUpdater update_downloaded method run");
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
 log.info("autoUpdater restart_app method run");
  autoUpdater.quitAndInstall();
});
