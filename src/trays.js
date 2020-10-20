let {app,Menu,Tray,shell,ipcMain,BrowserWindow,nativeImage} = require('electron');
const isDev = process.env.NODE_ENV !== 'production';
var path = require('path')

export const trays = (win) => {

    // 托盘图标设置
    console.log(__dirname,'dirpath')

    // 绑定托盘的右键菜单
    var tpl=[
        {
            label: '打开超信',
            click: () => {
                win.show()
            }
        },
        {
            label: '设置',
            click:function(){
                console.log('打开设置')
            }
        },
        {
            label: '退出',
            click:function(){
                app.isQuiting2 = true
                app.isQuiting = true
                app.quit()
            }
        }
    ]

    let MenuTray=Menu.buildFromTemplate(tpl)

    let unread 
    let read 

    if(isDev){
        unread = path.join(__dirname, '../public/icons.png')
        read = path.join(__dirname, '../public/icons.png')
        console.log(unread,'unread')
    }else{
        unread = path.join(__dirname, '/icons.png')
        read = path.join(__dirname, '/icons.png')
    }

    let imgRead = nativeImage.createFromPath(read)
    // let imgUnread = nativeImage.createFromPath(unread)
    win.setSkipTaskbar(true)

    // tray 分为 mac 和 windows 兼容 todo windows

    let tray = new Tray(imgRead)
    // tray.setImage(imgUnread) 根据状态设置不同图标
    // tray.destroy()
    // tray = new Tray(imgRead)
    // tray.setImage(imgUnread) 根据状态设置不同图标

    tray.setToolTip('提示title')
    tray.setContextMenu(MenuTray)


    // 双击 托盘图标 打开窗口
    tray.on('double-click',function(){
        win.show()
    })
}
