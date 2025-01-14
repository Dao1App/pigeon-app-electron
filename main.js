const { app, BrowserWindow, ipcMain } = require("electron");
app.commandLine.appendSwitch('ignore-certificate-errors')
app.commandLine.appendSwitch('allow-insecure-localhost', 'true')

const server = require("./app/src/");
const keygen = require('./keygen.js');

const initIpc = () => {
  ipcMain.on("need-app-path", (event, arg) => {
    event.reply("app-path", app.getAppPath());
  });
  ipcMain.on("open-external-link", (event, href) => {
    shell.openExternal(href);
  });
};

app.on("ready", () => {
  setApplicationMenu();
  initIpc();
 ipcMain.handle('generateKey', async (event, fileLocation) => {
    try {
      const publicKey = await keygen.cmd(fileLocation);
      return publicKey;
    } catch (error) {
      throw new Error(error.message);
    }
  });

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    title: "Pigeon",
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false,
      enableRemoteModule: true      
    },
  });

  mainWindow.loadURL("https://0.0.0.0:3000");
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

// SSL/TSL: this is the self signed certificate support
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    // On certificate error we disable default behaviour (stop loading the page)
    // and we then say "it is all fine - true" to the callback
    event.preventDefault();
    callback(true);
});

app.on("resize", function (e, x, y) {
  mainWindow.setSize(x, y);
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
