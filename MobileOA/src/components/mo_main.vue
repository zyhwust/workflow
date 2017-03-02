<template>
  <div id="app1">
      <mo_overlay></mo_overlay>
      <mo_overlay2></mo_overlay2>
      <mo_myinfo></mo_myinfo>
      <mo_bindphone></mo_bindphone>
      <mo_people></mo_people>
      <mo_header></mo_header>
      <mo_changepwd></mo_changepwd>
      <mo_groupchart></mo_groupchart>
      <div class="content">
        <mo_menu></mo_menu>
        <router-view></router-view>
      </div>
  </div>
</template>

<script>
import mo_header from './mo_header.vue';
import mo_menu from './mo_menu.vue';
import mo_myinfo from './mo_myinfo.vue';
import mo_overlay from './mo_overlay.vue';
import mo_overlay2 from './mo_overlay2.vue';
import mo_groupchart from './mo_groupchart.vue';
import mo_bindphone from './mo_bindphone.vue';
import mo_people from './mo_people.vue';
import mo_changepwd from './mo_changepwd.vue';


export default {
  ready(){
    if(localStorage.telephone==0){
      this.$root.overlay.display = true;
      this.$root.bindphone.display = true;
    }
  },
  data() {
    return {
      // 覆盖层组件
      overlay: {
        display: false
      },
      // 用户信息组件
      myinfo: {
        display: false,
        userId: ''
      },
      // 群聊组件
      groupchart:{
        display: false,
      },

    }
  },
  components: {
    mo_menu,
    mo_header,
    mo_myinfo,
    mo_overlay,
    mo_overlay2,
    mo_groupchart,
    mo_bindphone,
    mo_people,
    mo_changepwd
  },
  replace: true
}
</script>

<style>
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
::-webkit-scrollbar{width:8px;height:8px}
::-webkit-scrollbar-track-piece{background-color:transparent}
::-webkit-scrollbar-thumb{border-radius:9px;background-color:rgba(195,195,195,0.3)}
::-webkit-scrollbar-thumb:hover{background-color:rgba(126,126,126,0.6)}
html,body{
  height: 100%;
  width: 100%;
  font-family: "冬青黑体简体中文","Tahoma","Hiragino Sans GB","Microsoft YaHei","微软雅黑","STHeiti","WenQuanYi Micro Hei",SimSun,sans-serif !important;
  -webkit-font-smoothing:antialiased;
  font-size: 12px;
  font-color: #222;
}
input , button{
  outline: 0;
  font-family: "冬青黑体简体中文","Tahoma","Hiragino Sans GB","Microsoft YaHei","微软雅黑","STHeiti","WenQuanYi Micro Hei",SimSun,sans-serif !important;
  -webkit-font-smoothing:antialiased;
}
ul , li {
  list-style: none;
}
button , li{
  cursor: pointer;
}
a {
  color: #222;
  text-decoration: none;
}
#app1{
  height: 100%;
  background-color: white;
  border-radius: 5px;
}
.content{
  padding-top:50px;
  background-color: #F8FBFF;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content:flex-start;
  align-items: stretch;
}
</style>
