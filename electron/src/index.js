const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const { execFile } = require('child_process');
// 忽略证书相关错误
app.commandLine.appendSwitch('ignore-certificate-errors');

const star = new Promise((resolve) => {
  //启动后台服务
  const mypath = path.join(__dirname, '../publish/');
  const ser = execFile(mypath + 'FaceTrain', {
    cwd: mypath,
  });
  const timeout = setTimeout(() => {
    resolve(false);
  }, 5000);
  ser.stdout.on('data', (msg) => {
    if (msg.includes('54321')) {
      clearTimeout(timeout);
      resolve(true);
    }
  });
});

//禁用硬件加速
app.disableHardwareAcceleration();
//关闭菜单栏
Menu.setApplicationMenu(null);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
 
  // and load the index.html of the app.
  //mainWindow.loadFile(path.join(__dirname, './index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
  if (await star) {
    mainWindow.loadURL('https://localhost:54321');
  } else {
    dialog.showErrorBox('Error', 'Service startup timeout');
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
