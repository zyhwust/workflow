<template>
  <div id="mo_menu">
    <div class="avatar">
      <div class="img" @click="showInfo"><img :src="user_img" alt="{{user_name}}"></div>
      <div class="username"><span>{{user_name}}</span></div>
    </div>
    <ul>
      <li  v-for="(index, item) in items" v-link="item.link" class="item" :class="{'selected':item.active}" @click="active">
        <i class="{{item.icon}}" aria-hidden="true"></i>
        <span>{{item.name}}</span>
        <!--<div class="hide" :class="{'wpush': msg_count.msg_working_amount > 0}">-->
        <div class="hide">
          <!--<span>{{msg_count.msg_working_amount}}</span>-->
          <span></span>
        </div>
      </li>
    </ul>

    <!-- 新加操作 -->
    <ul class="extra-options">
      <li @click="show_tip_menu">
        <i class="fa fa-plus" aria-hidden="true"></i>
        <span>创建</span>
      </li>
      <!-- <li  @click="show_tip_menu_op">
        <i class="fa fa-cog" aria-hidden="true"></i>
        <span>设置</span>
      </li> -->
    </ul>
    <div class="tip-menu" v-bind:style="{display:tip_menu_display}">
      <ul class="tip-menu-list">
        <li @click="groupchart">发起群聊</li>
        <!--<li @click="isCoding">企业群聊天</li>-->
        <!--<li @click="isCoding">DING一下</li>-->
        <!--<li @click="isCoding">添加好友</li>-->
      </ul>
    </div>
    <div class="tip-menu-op" v-bind:style="{display:tip_menu_op_display}">
      <ul class="tip-menu-list">
        <li @click="isCoding">设置</li>
        <li @click="isCoding">修改密码</li>
        <li @click="isCoding">下载应用</li>
        <li @click="logout">退出登录</li>
      </ul>
    </div>
    <div class="wrap" v-bind:style="{display:wrap_display}" @click="hidden_tip_menu"></div>
  </div>
</template>
<script>
  export default {
    ready() {
    this.getInfo();
    // window.onbeforeunload = function() {
    //   localStorage.isLogined = false;
    // }
  },
  data () {
    return {
      items:[
        {
          name: "消息",
          icon: "fa fa-book",
          link: "/chat/msg",
        },
        {
          name: "联系人",
          icon: "fa fa-user",
          link: "/chat/contact",
        },
//        {
//          name: "群组",
//          icon: "fa fa-comments",
//          link: "/chat/group",
//        }
      ],
      phone: localStorage.user,
      userId: localStorage.userId,
      user_name:"请登录！",
      user_img: BASE.url +"/upload/avatar/"+localStorage.userId+".png",
      tip_menu_display:"none",
      tip_menu_op_display:"none",
      wrap_display:"none",
      // wpush消息总数
      // msg_count: window.unDealFlow

    }
  },
  methods : {
    isCoding: function() {
      tools.toast('功能尚未开放', 'success');
    },
    logout: function() {
      tools.toast('退出成功', 'success');
      // localStorage.isLogined = false;
      localStorage.clear();

      var unReadMessages = {};//未读消息
      window.friends = []; //群组列表（前好友列表）
      window.curUserId = null;//当前用户手机号（环信用户id）
      window.conn = null;//环信连接对象
      window.Vuemsg = {};//消息集
      var vm = this;

      setTimeout(function() {
        vm.$route.router.go('/login');
      }, 700);

    },
    show_tip_menu: function(){
      if(this.tip_menu_display==="none"){
        this.tip_menu_op_display= "none";
        this.tip_menu_display = "block";
        this.wrap_display = "block";
      }else{
        this.tip_menu_display= "none";
      }
    },
    show_tip_menu_op: function(){
      if(this.tip_menu_op_display==="none"){
        this.tip_menu_display= "none";
        this.tip_menu_op_display = "block";
        this.wrap_display = "block";
      }else{
        this.tip_menu_op_display= "none";
      }
    },
    hidden_tip_menu: function(){
      this.tip_menu_display= "none";
      this.tip_menu_op_display= "none";
      this.wrap_display = "none";
    },
    groupchart:function() {
      var id = this.phone;
      this.$root.groupchart.userId = "id";
      this.$root.overlay.display = true;
      this.$root.groupchart.display = true;
      //关闭按钮
      this.hidden_tip_menu();
    },
    active: function(){
      //关闭按钮
      this.hidden_tip_menu();
    },
    showInfo: function(){
      this.$root.myinfo.userId = localStorage.userId;
      this.$root.overlay.display = true;
      this.$root.myinfo.display = true;
    },
    getInfo: function () {
      var that = this;
      var userId = that.userId;
      var obj = {
        url: '/home/user/1001.spring',
        args: {
          "userId" : userId
        },
        success: function (res) {
          if(res.code!=1) {
            tools.toast(res.msg,"error");
            return;
          }
          if(res.code == 1) {
            //设置昵称
            that.user_nickname = res.data.userNickname;
            //设置姓名
            that.user_name = res.data.userRealname;
            localStorage.userName = that.user_name;
            //手机号码
            that.user_phone = res.data.userTelephone;
          }
        },
        asy: true
      }
      Ajax(obj);
    }
  }
  }
</script>

<style scoped>
  #mo_menu{
    width: 150px;
    background-color: #2f323a;
    /*opacity: .9;*/
    flex-shrink:0;
    flex-grow: 0;
    border-right: 1px solid #dddcdd;
  }
  .avatar{
    text-align: center;
    margin: 20px 0;
  }
  .avatar .img{
    height: 100px;
    border-radius: 50px;
  }
  .avatar .img img{
    width: 88px;
    height: 88px;
    border-radius: 44px;
    box-shadow: 0px 2px 4px #888;
  }
  .username{
    margin-top: 10px;
    margin-bottom: 20px;
    font-size: 18px;
  }
  #mo_menu ul{
    list-style: none;
  }
  #mo_menu ul li{
    position: relative;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    padding: 0 20px;
  }
  #mo_menu ul li.v-link-active{
    background-color: #3a3e46;
    color: #f4f4f4;
    border-left: 3px solid #d88d30;
  }
  /*新加样式*/
  #mo_menu .extra-options{
    position: absolute;
    bottom: 20px;
    /*bottom: 3px;*/
    /*margin-top: 200px;*/
    /*position: relative;*/
    /*height: 100%;*/
    /*width: 100%;*/
  }
  #mo_menu .tip-menu{
    background-color: #fff;
    position: absolute;
    bottom: 70px;
    z-index: 333;
  }
  #mo_menu .tip-menu-op{
    background-color: #fff;
    position: absolute;
    bottom: 60px;
    z-index: 333;
  }
  .wrap{
    /*display: none;*/
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
  }
  /*wpush提示红点样式*/
  #mo_menu .hide {
    display: none;
  }
  #mo_menu .item:first-child .hide.wpush {
    display: block;
    position: absolute;
    bottom: 28px;
    right: 40px;
    width: 14px;
    height: 14px;
    line-height: 14px;
    background-color: red;
    border-radius: 50%;
    text-align: center;
  }
  #mo_menu .wpush span {
    display: block;
    height: 14px;
    line-height: 14px;
    width: 15px;
    font-size: 12px;
    color: #fff;
    text-align: center;
    transform: scale(0.9);
  }
  #mo_menu ul .item:hover {
     /*background-color: #2f323a; */
  }
  .tip-menu-list li{
    color: #271f1f;
  }
</style>
