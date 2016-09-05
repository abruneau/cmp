'use strict';
var app, electron;

electron = require('electron');

app = electron.app;

var mainWindow = null;

const {
	Menu
} = electron;

function createWindow() {
	// Create the browser window.
	mainWindow = new electron.BrowserWindow({
		width: 800,
		height: 600
	});

	// and load the index.html of the app.
	mainWindow.loadURL(`file://${__dirname}/index.html`);

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
}

app.on('ready', function () {
	createWindow();

	var template = [{
		label: 'Edit',
		submenu: [{
			role: 'undo'
		}, {
			role: 'redo'
		}, {
			type: 'separator'
		}, {
			role: 'cut'
		}, {
			role: 'copy'
		}, {
			role: 'paste'
		}, {
			role: 'pasteandmatchstyle'
		}, {
			role: 'delete'
		}, {
			role: 'selectall'
		}, ]
	}, {
		label: 'View',
		submenu: [{
			label: 'Reload',
			accelerator: 'CmdOrCtrl+R',
			click(item, focusedWindow) {
				if (focusedWindow) {
					focusedWindow.reload();
				}
			}
		}, {
			label: 'Toggle Developer Tools',
			accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
			click(item, focusedWindow) {
				if (focusedWindow) {
					focusedWindow.webContents.toggleDevTools();
				}
			}
		}, {
			role: 'togglefullscreen'
		}]
	}, {
		role: 'window',
		submenu: [{
			role: 'minimize'
		}, {
			role: 'close'
		}, ]
	}, {
		role: 'help',
		submenu: [{
			label: 'Learn More',
			click() {
				require('electron').shell.openExternal('https://github.com/abruneau/cmp');
			}
		}, ]
	}, ];

	if (process.platform === 'darwin') {
		const name = app.getName();
		template.unshift({
			label: name,
			submenu: [{
				role: 'about'
			}, {
				type: 'separator'
			}, {
				role: 'services',
				submenu: []
			}, {
				type: 'separator'
			}, {
				role: 'hide'
			}, {
				role: 'hideothers'
			}, {
				role: 'unhide'
			}, {
				type: 'separator'
			}, {
				role: 'quit'
			}, ]
		});
		// Window menu.
		template[3].submenu = [{
			label: 'Close',
			accelerator: 'CmdOrCtrl+W',
			role: 'close'
		}, {
			label: 'Minimize',
			accelerator: 'CmdOrCtrl+M',
			role: 'minimize'
		}, {
			label: 'Zoom',
			role: 'zoom'
		}, {
			type: 'separator'
		}, {
			label: 'Bring All to Front',
			role: 'front'
		}];
	}

	var menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});
