<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>
<script>
export default {
  mounted() {
      // 右键菜单
      let electron = this.$electron
      const {remote} = this.$electron
      const {Menu, MenuItem} = remote;
      const menu = new Menu();
      //右键菜单
      // menu.append(new MenuItem({
      //     label: '放大',
      //     click:function ()  {
      //         console.log('item 1 clicked')
      //     }
      // }));
      // menu.append(new MenuItem({type: 'separator'}));//分割线
      // menu.append(new MenuItem({label: '缩小', type: 'checkbox', checked: true}));//选中
      let MenuList = [
          {
              label: '放大',
              click: () => {
                  console.log('item 1 clicked')
              }
          },
          {
            label: '退出',
            click: () => {
              loginStore.set("isLogin",false)
              removeToken()
              window.location.reload()
              electron.ipcRenderer.send('logout')
            }
          },
          {type: 'separator'},
          {label: '缩小', type: 'checkbox', checked: true},
      ]
      MenuList.map(v=> {
          v = new MenuItem(v)
          menu.append(v)
      })
      

      window.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          menu.popup({window: remote.getCurrentWindow()})
      }, false)
  },
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
