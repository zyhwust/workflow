<template>
    <div id="mo_menu">
        <ul class="title-wrapper">
            <div class="title-item">工作</div>
        </ul>
        <ul>
            <!--通知部分-->
            <li class="item" @click="active('notify')" :class="{'selected': notify.isActive}">
                <div>
                    <span>通知</span>
                    <span class="arrow-right"></span>
                    <span class="arrow-down"></span>
                </div>
                <!--显示消息提示-->
                <div class="hide" :class="{'wpush': msg_count.msg_working_notice> 0}">
                <div class="">
                    <span>{{msg_count.msg_working_notice}}</span>
                </div>
            </li>
            <ul class="sub-tab-wrapper" v-show="notify.isActive" :class="{'selected': notify.isActive}">
                <li class="sub-tab" v-for="item in notify.sub" v-link="item.link">
                    <span class="arrow-orange"></span>
                    <span class="name">{{item.name}}</span>
                </li>
            </ul>
            <!--流程部分-->
            <li class="item" @click="active('workflow')" :class="{'selected': workflow.isActive}">
                <div>
                    <span>流程</span>
                    <span class="arrow-right"></span>
                    <span class="arrow-down"></span>
                </div>

                <!--显示消息提示-->
                <div class="hide" :class="{'wpush': msg_count.msg_working_flow > 0}">
                <div class="">
                    <span>{{msg_count.msg_working_flow}}</span>
                </div>

            </li>
            <ul class="sub-tab-wrapper" v-show="workflow.isActive" :class="{'selected': workflow.isActive}">
                <li class="sub-tab" v-for="item in workflow.sub" v-link="item.link">
                    <span class="arrow-orange"></span>
                    <span class="name">{{item.name}}</span>
                </li>
            </ul>
            <!--任务部分-->
            <li class="item" @click="active('task')" :class="{'selected': task.isActive}">
                <div>
                    <span>任务</span>
                    <span class="arrow-right"></span>
                    <span class="arrow-down"></span>
                </div>

                <!--显示消息提示-->
                <div class="hide" :class="{'wpush': msg_count.msg_working_task > 0}">
                <div class="">
                    <span>{{msg_count.msg_working_task}}</span>
                </div>

            </li>
            <ul class="sub-tab-wrapper" v-show="task.isActive" :class="{'selected': task.isActive}">
                <li class="sub-tab" v-for="item in task.sub" v-link="item.link">
                    <span class="arrow-orange"></span>
                    <span class="name">{{item.name}}</span>
                </li>
            </ul>
            <!--会议部分-->
            <li class="item" @click="active('meeting')" :class="{'selected': meeting.isActive}">
                <div>
                    <span>会议</span>
                    <span class="arrow-right"></span>
                    <span class="arrow-down"></span>
                </div>

                <!--显示消息提示-->
                <div class="hide" :class="{'wpush': msg_count.msg_working_meeting > 0}">
                <div class="">
                    <span>{{msg_count.msg_working_meeting}}</span>
                </div>

            </li>
            <ul class="sub-tab-wrapper" v-show="meeting.isActive" :class="{'selected': meeting.isActive}">
                <li class="sub-tab" v-for="item in meeting.sub" v-link="item.link">
                    <span class="arrow-orange"></span>
                    <span class="name">{{item.name}}</span>
                </li>
            </ul>
        </ul>

        <div class="chat-wrapper">
            <!--<div class="content-wrapper">-->
                <!--<span class="icon-chat"></span>-->
                <!--<span class="text-chat" v-link="{path:'/chat'}">聊天消息</span>-->
            <!--</div>-->
          <div v-on:click="openChat()" class="content-wrapper">
            <span class="icon-chat"></span>
            <!--<span class="text-chat" v-link="{path:'/chat'}">聊天消息</span>-->
            <!--<a href='http://localhost:8080/#!/chat' target="chat"><span class="text-chat text-white">聊天消息</span></a>-->
            <a><span class="text-chat text-white">聊天消息</span></a>
          </div>
        </div>

        <div class="chat-wrapper qrcode">
          <div class="content-wrapper" @click="qrcode">
            扫码下载客户端
          </div>
        </div>        
    </div>
</template>
<script>
    export default {
        ready() {
          this.getInfo();
        //   window.onbeforeunload = function() {
        //             localStorage.isLogined = false;
        //         }
        },
        data () {
            return {
                notify: {
                    isActive: false,
                    link: '',
                    sub: [{
                        name: '收到的通知',
                        link: '/main/notify/accept'
                    },
                    {
                        name: '发送的通知',
                        link: '/main/notify/send'
                    }]
                },
                workflow: {
                    isActive: false,
                    link: '',
                    sub: [
                        {
                            name: '我发起的',
                            link: '/main/workFlow/apply'
                        },
                        {
                            name: '待我审批',
                            link: '/main/workFlow/examine'
                        },
                        {
                            name: '我已审批',
                            link: '/main/workFlow/examined'
                        },
                        {
                            name: '综合统计',
                            link: '/main/workFlow/copy'
                        }
                    ]
                },
                task: {
                    isActive: false,
                    link: '',
                    sub: [
                        {
                            name: '收到的任务',
                            link: '/main/task/accept'
                        },
                        {
                            name: '发布的任务',
                            link: '/main/task/send'
                        },
                        {
                            name: '综合查询',
                            link: '/main/search'
                        }
                    ]
                },
                meeting: {
                    isActive: false,
                    link: '',
                    sub: [
                        {
                            name: '未完成的会议',
                            link: '/main/conference/undone'
                        },
                        {
                            name: '已结束的会议',
                            link: '/main/conference/finish'
                        }
                    ]
                },
                phone: localStorage.user,
                userId: localStorage.userId,
                user_name:"请登录！",
                user_img: BASE.url +"/upload/avatar/"+localStorage.userId+".png",
                tip_menu_display:"none",
                tip_menu_op_display:"none",
                wrap_display:"none",
                // 消息推送信息
                msg_count: window.unDealFlow

            }
        },
        methods : {
            // 跳转到二维码页面
            qrcode: function() {
                var ip_address = (document.domain == 'localhost' ? 'http://120.132.85.24:8080' : document.location.origin)
                window.open(ip_address + '/MOA/MobileOA/qrcode.html');
            },
            openChat:function(){
              var url = location.origin+location.pathname+'#!/chat';
              window.chat = window.open(url,'chat');
            },
            isCoding: function() {
                tools.toast('功能尚未开放', 'success');
            },
            logout: function() {
                tools.toast('退出成功', 'success');
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
            active: function(type){
                var vm = this;
                vm.notify.isActive = false;
                vm.workflow.isActive = false;
                vm.task.isActive = false;
                vm.meeting.isActive = false;

                if(type === 'workflow') {
                    vm.$route.router.go('/main/workFlow/apply');
                }
                vm[type].isActive = true;
                //关闭按钮
                // this.hidden_tip_menu();
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

<style>
    #mo_menu{
        width: 180px;;
        background-color: #221D23;
        flex-shrink:0;
        flex-grow: 0;
        border-right: 1px solid #dddcdd;
        color: #bbb;
        /*border-bottom-left-radius: 5px;*/
    }
    #mo_menu .title-wrapper {
        height: 25px;
        color: #656465;
        font: normal 12px Arial,verdana,Hiragino Sans GB,"宋体",Microsoft Yaheim;
        border-bottom: 1px solid #332F34;
    }
    #mo_menu .title-wrapper .title-item {
        margin: 28px 0 8px 11px;
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
        padding: 0 0 0px 20px;
        font: normal 12px Arial,verdana,Hiragino Sans GB,"宋体",Microsoft Yaheim;
    }
    #mo_menu ul li div {
        /*height: 40px; */
        line-height: 40px;
    }
    #mo_menu ul .item:hover {
        background-color: #2E262F;
    }
    #mo_menu ul li.v-link-active{
        color: #ff8c00
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
        bottom: 110px;
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
        height: 0;
        transition: all 0.2s ease-in;
    }
	#mo_menu .item .hide.wpush {
        display: block;
		position: absolute;
		top: 8px;
        left: 45px;
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
		/* width: 14px; */
		font-size: 12px;
		color: #fff;
		text-align: center;
		transform: scale(0.9);
	}

    #mo_menu .sub-tab {
        height: 40px;
        line-height: 40px;
    }
    #mo_menu .sub-tab .name:hover {
        color: #cecbcb;
    }
    #mo_menu ul li.v-link-active:hover {
        color: #ff8c00;
    }
    #mo_menu .selected {
        background-color: #110E11;
    }
    #mo_menu .arrow-right {
        float: right;
        width: 16px;
        height: 16px;
        margin: 12px 10px 0 0 ;
        background-image: url(../../static/public/spread.png);
    }
    #mo_menu .arrow-orange {
        float: left;
        display: inline-block;
        width: 16px;
        background-image: url(../../static/public/orangeangle.png);
        height: 16px;
        margin: 12px 7px 0 10px;
    }

    #mo_menu .chat-wrapper {
        margin-top: 50px;
        padding: 24px;
        color: #fff;
        font: normal 14px Arial,verdana,Hiragino Sans GB,"宋体",Microsoft Yaheim;
    }
    #mo_menu .chat-wrapper.qrcode {
        margin-top: 5px;
    }
    #mo_menu .chat-wrapper .content-wrapper {
        height: 32px;
        line-height: 32px;
        border-radius: 16px;
        background-color: #2da426;
        text-align: center;
    }
    #mo_menu .chat-wrapper:hover {
        cursor: pointer;
    }
    #mo_menu .chat-wrapper .icon-chat {
        float: left;
        margin: 2px 5px 0 16px;
        display: inline-block;
        width: 26px;
        height: 26px;
        background: #2da426 url("../../static/public/im-btn.png") no-repeat;
    }
    #mo_menu .chat-wrapper .text-chat {
        float: left;
    }
    #mo_menu .chat-wrapper .text-white {
      color: #fff;
    }
</style>
