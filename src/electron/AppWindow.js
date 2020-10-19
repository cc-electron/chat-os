const { BrowserWindow } = require('electron')

// export class AppWindow extends BrowserWindow {
//   constructor(config, urlLocation) {
//     const basicConfig = {
//       width: 800,
//       height: 600,
//       webPreferences: {
//         nodeIntegration: true,
//       },
//       show: false,
//       backgroundColor: '#efefef',
//     }
//     const finalConfig = { ...basicConfig, ...config }
//     super(finalConfig)
//     this.loadURL(urlLocation)
//     this.once('ready-to-show', () => {
//       this.show()
//     })
//   }
// }
// console.log(AppWindow,"AppWindow")
// module.exports = AppWindow

const basicConfigs = {
  width: 800,
  height: 600,
  webPreferences: {
    nodeIntegration: true,
  },
  show: false,
  backgroundColor: '#efefef',
}
export const newWindow = (basicConfig = basicConfigs, config) => {
  const finalConfig = { ...basicConfig, ...config }
  return new BrowserWindow(finalConfig);
}



