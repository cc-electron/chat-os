const { remote, ipcRenderer } = require('electron')
const Store = require('electron-store')
const settingsStore = new Store({ name: 'Settings' })
const qiniuConfigArr = ['#savedFileLocation', '#accessKey', '#secretKey', '#bucket']

const $ = (selector) => {
  const result = document.querySelectorAll(selector)
  return result.length > 1 ? result : result[0]
}

document.addEventListener('DOMContentLoaded', () => {
  let savedLocation = settingsStore.get('savedFileLocation')
  console.log(savedLocation,'savedLocation')
  if (savedLocation) {
    $('#savedFileLocation').value = savedLocation
  }
  // get the saved config data and fill in the inputs
  qiniuConfigArr.forEach(selector => {
    const savedValue = settingsStore.get(selector.substr(1))
    if (savedValue) {
      $(selector).value = savedValue
    }
  })
  $('#select-new-location').addEventListener('click', () => {

    remote.dialog.showOpenDialog(null,{
      properties: ['openDirectory'],
      message: '选择文件的存储路径',
    }).then((path) => {
      console.log(path.filePaths[0], 'path')
      if (Array.isArray(path.filePaths)) {
        $('#savedFileLocation').value = path.filePaths[0]
      }
    })
  })
  $('#settings-form').addEventListener('submit', (e) => {
    e.preventDefault()
    qiniuConfigArr.forEach(selector => {
      if ($(selector)) {
        let { id, value } = $(selector)
        console.log('id: ', id)
        console.log('value: ', value)
        settingsStore.set(id, value ? value : '')
      }
    })
    // sent a event back to main process to enable menu items if qiniu is configed
    ipcRenderer.send('config-is-saved')
    // remote.getCurrentWindow().close()
  })
  $('.nav-tabs').addEventListener('click', (e) => {
    e.preventDefault()
    $('.nav-link').forEach(element => {
      element.classList.remove('active')
    })
    e.target.classList.add('active')
    $('.config-area').forEach(element => {
      element.style.display = 'none'
    })
    $(e.target.dataset.tab).style.display = 'block'
  })
})