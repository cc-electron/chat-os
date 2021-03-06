'use strict'
// https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration
// https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/recipes.html#multiple-pages
import {
  app,
  protocol,
  BrowserWindow,
  Menu,
  ipcMain
} from 'electron'
import {
  createProtocol
} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {
  VUEJS_DEVTOOLS
} from 'electron-devtools-installer'
import { autoUpdater } from "electron-updater"
const isDev = process.env.NODE_ENV !== 'production'
const path = require('path')
const menuTemplate = require('./electron/menu')
import {trays} from './trays'
import {newWindow} from './electron/AppWindow'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win,secondWin,winTray,secondwinTray
app.isQuiting = false

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
  scheme: 'chaoxin',
  privileges: {
    secure: true,
    standard: true
  }
}])

function createWindow(devPath, prodPath) {
  // 设置原生应用菜单
  let menu = Menu.buildFromTemplate(menuTemplate.template)
  Menu.setApplicationMenu(menu)

  // Create the browser window.
  const window = new BrowserWindow({ 
      width: 1200,
      height: 800,
      title: 'chaoxin',
      useContentSize: true,
      fullscreenable: true, //是否允许全屏
      // titleBarStyle: 'hidden',
      // frame: false,
      center: true,
      webPreferences: {
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
      }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    window.loadURL(process.env.WEBPACK_DEV_SERVER_URL + devPath)
    if (!process.env.IS_TEST) window.webContents.openDevTools()
  } else {
    // Load the index.html when not in development
    window.loadURL(`app://./${prodPath}`)
  }

  return window
}


// 退出应用时触发
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 当应用被激活时发出。 各种操作都可以触发此事件, 例如首次启动应用程序、尝试在应用程序已运行时或单击应用程序的坞站或任务栏图标时重新激活它。
app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.isQuiting = false
  app.isQuiting2 = false
  !win.isVisible() && win.show();
  if (win === null) {
    win = createWindow('', 'index.html')
  }
  !secondWin.isVisible() && secondWin.show();
  if (secondWin === null) {
    secondWin = createWindow('subpage', 'subpage.html')
  }
  
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDev && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  // createWindow()
  if (!process.env.WEBPACK_DEV_SERVER_URL) {
    createProtocol('app')
  }
  win = createWindow('', 'index.html')
  secondWin = createWindow('subpage', 'subpage.html')
  
  
  //托盘
  winTray = trays(win)
  //托盘
  secondwinTray = trays(secondWin)

  win.on('close', (event) => {
      // 回收BrowserWindow对象
      // 窗口缩小到最小才能关闭程序
      if(win.isMinimized()||app.isQuiting){
        win = null;
      }else{
        event.preventDefault();
        // win.minimize();
        app.isQuiting = false
        
        win.hide();
        win.setSkipTaskbar(true);
      }

  });
  secondWin.on('close', (event) => {
      // 回收BrowserWindow对象
      // 窗口缩小到最小才能关闭程序
      if(secondWin.isMinimized()||app.isQuiting2){
        secondWin = null;
      }else{
        event.preventDefault();
        // secondWin.minimize();
        app.isQuiting2 = false
        
        secondWin.hide();
        secondWin.setSkipTaskbar(true);
      }

  });

  win.once("ready-to-show", () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
  
  win.on('blur', () => {
    // 弹跳功能 information 只跳一次 critical 直到窗口激活才会停止
    // app.dock.bounce("critical");
    // 更改底部扩展栏图标
    // app.dock.setIcon(path.join(__static, '/appicon.png'));
    
    // 冒泡信息提示
    const badgeString = app.dock.getBadge();
    console.log(badgeString,'badgeString')

    if (badgeString === '') {
      app.dock.setBadge('1');
      console.log(badgeString,'2333badgeString')
    } else {
      app.dock.setBadge((parseInt(badgeString) + 1).toString());
    }

    // let countssss = app.badgeCount;
    // console.log(countssss,'counts')
    // if (badge.count > 0) {
    //     app.dock.setBadge('12345654');
    // } else {
    //     app.dock.setBadge('99000');
    // }
    // if (process.platform === 'darwin') {
    //     app.dock.setBadge('2');
    //     app.setBadgeCount(2);
        
    // }
    

    
  });

  win.on("closed", () => { win = null; });

})
app.on('before-quit',()=>{
  console.log('2333强制退出前！！！')
  app.isQuiting = true
  app.isQuiting2 = true
})
app.on('quit',()=>{
  console.log('2333强制退出了2333！！！')
})

// Exit cleanly on request from parent process in development mode.
if (isDev) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}