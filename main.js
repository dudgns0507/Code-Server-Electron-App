const { app, Menu, BrowserWindow, globalShortcut } = require("electron");
var path = require('path')
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    fullscreen: false,
    webPreferences: {
        nodeIntegration: true
    },
    icon: path.join(__dirname, 'default_dark.png')
  });

  app.on('browser-window-focus', () => {
    globalShortcut.register('f5', function() {
      mainWindow.reload()
    })
    globalShortcut.register('CommandOrControl+R', function() {
      mainWindow.reload()
    })
  });

  app.on('browser-window-blur', () => {
      globalShortcut.unregister('CommandOrControl+R');
      globalShortcut.unregister('F5');
  });

  mainWindow.loadURL("https://code.cropo.me/");
  
  mainWindow.on("closed", function() {
    try {
      Electron.session.defaultSession.clearCache(() => {})
    } catch {

    }
    mainWindow = null;
  });

  const template = [
    {
      label: "Application",
      submenu: [
        {
          label: "About Application",
          selector: "orderFrontStandardAboutPanel:"
        },
        { type: "separator" },
        {
          label: "Quit",
          accelerator: "Command+Q",
          click: function() {
            app.quit();
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        {
          label: "Select All",
          accelerator: "CmdOrCtrl+A",
          selector: "selectAll:"
        }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.on("ready", createWindow);

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on(
  "certificate-error",
  (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
  }
);