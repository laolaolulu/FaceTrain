const { app, BrowserWindow, Menu } = require('electron');
app.disableHardwareAcceleration();
const { execFile } = require('child_process');

//Menu.setApplicationMenu(null);
const createWindow = () => {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
  });

  win.webContents.on('new-window', function (e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });
  execFile('C:\\maapp\\publish\\FaceTrain.exe', (err, res) => {
    console.log(err);
    console.log(res);
    win.loadURL('https://localhost:7048');
  });
};

app.whenReady().then(() => {
  createWindow();
});
