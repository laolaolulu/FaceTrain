const { app, BrowserWindow, Menu } = require('electron');
app.disableHardwareAcceleration();
const { execFile } = require('child_process');

Menu.setApplicationMenu(null);
const createWindow = () => {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
  });

  win.webContents.on('new-window', function (e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });

  execFile('FaceTrain.exe', {
    cwd: `${__dirname}/publish`,
  });
  win.loadURL('http://localhost:5000');
};

app.whenReady().then(() => {
  createWindow();
});

app.on('ready', function () {
  console.log(__dirname);
});
