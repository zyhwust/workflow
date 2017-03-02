<template>
    <div id="mo_header">
        <div class="logo">
            武汉市第五医院医家MOA院内办公平台
        </div>
        <div class="info-wrapper" @click="showInfo()">
            <img class="item" :src=user_img alt onerror="this.src = BASE.url + '/upload/avatar/1.png'">
            <span class="item name">{{user_name}}</span>
            <span class="item down"></span>
            <div class="customer-info" v-show="customer_info"> 
                <!-- <p class="worknum">工号：{{user_id}}</p> -->
                <p class="" @click="changepwd">修改密码</p>
                <hr>
                <p class="logout" @click="logout">退出登录</p>
            </div>
        </div>
        <div :class="{'wrap':wrap_display}" @click="hidden()"></div>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                animation: false,
                condition: "",
                wrap_display: false,
                user_img: BASE.url +"/upload/avatar/"+localStorage.userId+".png",
                customer_info: false,
                user_id: localStorage.userId,
                user_name: localStorage.userName,
            }
        },
        ready() {
            //getMsg();
            getWebSocket();
        },
        methods : {
            // 修改密码
            changepwd: function() {
                this.$root.overlay.display = true;
                this.$root.changepwd.display = true;
            },
            // 退出登录
            logout: function() {
                // 关闭聊天
                if(window.chat) {
                    window.chat.close();
                    if(window.chat.closed === false) {
                        return;
                    }
                }
                tools.toast('退出成功', 'success');
                // 退出请求
                var obj1420 = {
                    url: '/home/logout/1420.spring',
                    args: {},
                    success: function() {
                    },
                    error: function() {}
                }
                Ajax(obj1420);
                localStorage.clear();

                var unReadMessages = {};//未读消息
                window.friends = []; //群组列表（前好友列表）
                window.curUserId = null;//当前用户手机号（环信用户id）
                window.conn = null;//环信连接对象
                window.Vuemsg = {};//消息集
                var vm = this;

                // 清除未读消息数
                window.unDealFlow.msg_working_notice = 0;
                window.unDealFlow.msg_working_task = 0;
                window.unDealFlow.msg_working_flow = 0;
                window.unDealFlow.msg_working_meeting = 0;
                window.unDealFlow.msg_working_amount = 0;
                setTimeout(function() {
                    vm.$route.router.go('/login');
                }, 300);

            },            
            showInfo: function() {
                this.customer_info === true ? this.customer_info = false : this.customer_info = true;
            },
            searchPeople: function(){
                this.searchResult = [];
                if(!this.condition){
                    tools.toast("请输入要搜索人员！","error");
                    return;
                }
                var self = this;
                var obj = {
                    url:'/home/user/1012.spring',
                    args:{
                        "searchString" : self.condition
                    },
                    success: function(res){
                        res.data.forEach(function (item){
                            item.userImgurl = BASE.url+"/upload/avatar/"+item.id+".png";
                            item.checked = false;
                            item.userRealname = item.name;
                            item.userId = item.id;
                        });
                        self.searchResult = res.data;
                        self.wrap_display = true;
                    },
                    asy:false
                }
                Ajax(obj);
            },
            showUserInfo(user){
                this.$root.myinfo.userId = user.userId;
                this.$root.overlay.display = true;
                this.$root.myinfo.display = true;
            },
            focus (e) {
                this.animation = "onfocus 166ms";
            },
            blur(e){
                this.animation = "onblur 166ms";
            },
            hidden: function(){
                this.wrap_display = false;
                this.searchResult= [];
            }
        }
    }
</script>
<style scoped>
    #mo_header{
        position: absolute;
        width: 100%;
        height: 50px;
        background-image: url(../../static/public/headerbg.png);
        line-height: 48px;
        box-shadow: 1px 1px 1px #bbb;
        /*避免搜索框被遮住*/
        z-index: 6;
    }
    #mo_header .logo{
        margin-left: 10px;
        height: 100%;
        line-height: 1;
        display: inline-block;
        -webkit-user-select: none ;
        -moz-user-select: none ;
        -ms-user-select: none ;
        -o-user-select: none ;
        user-select: none ;
        float: left;
        margin-left: 15px;
        line-height: 50px;
        color: #f8fbff;
        font-size: 17px;    
    }
    #mo_header .logo img{
        height: 50px;
    }

    @keyframes onfocus
    {
        from {background: #0280d8;width: 168px;}
        to {background: #fff;width: 220px;}
    }
    @keyframes onblur
    {
        from {background: #fff;width: 220px;}
        to {background: #0280d8;width: 168px;}
    }
    .search{
        display: inline-block;
        position: relative;
        float: right;
        margin-right: 5px;
    }
    .search input{
        height: 40px;
        border-radius: 20px;
        padding-left: 25px;
    }
    .search input:focus{
        width: 220px;
        color: #222;
        border-color: #fff;
        background-color: #fff;
        /*box-shadow: inset 0 1px 3px rgba(0,0,0,0.2),0 1px 15px rgba(255,255,255,0.3);*/
    }
    .search input::-webkit-input-placeholder{
        /*color: #b5ccdd;*/
    }
    .search .icon1{
        position: absolute;
        left: 8px;
        top: 15px;
        margin-right: 11px;
        font-size: 16px;
        color: #b5ccdd;
    }
    /*新加搜索样式*/
    #searchResult{
        position: absolute;
        top: 50px;
        right: 0px;
        width: 250px;
        height: 500px;
        min-height: 450px;
        max-height: 600px;
        overflow-x: hidden;
        overflow-y: auto; 
        background-color: #ffffff;
        box-shadow: rgba(0,0,0,0.15) 0 0 6px;
        border-radius: 7px;
        z-index: 6;
    }
    #searchResult .list li{
        display: block;
        height: 50px;
        width: 100%;
        cursor: pointer;
        padding: 5px 10px;
        margin-bottom: 2px;
        clear: both;
        border-bottom: 1px #eee solid;
    }
    #searchResult .userList .user {
        position: relative;
        width: 180px;
        float: right;
        display: inline-block;
        height: 100%;
        line-height: 100%;
    }
    .userList userName{
        display: inline-block;
    }
    .userList option{
        display: inline-block;
    }
    #searchResult .list li:hover{
        background-color: #eaf3fa;
    }
    #searchResult .list .userImg{
        position: absolute;
        left: -50px;
        top: -5px;
        width: 38px;
        height: 38px;
        float: left;
        border-radius: 50%;
        margin-right: 10px;
    }
    #searchResult .list .userImg img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
    #searchResult .list .userName{
        float: left;
        height: 100%;
        line-height: 100%;
    }
    #searchResult .list .option{
        float: right;
        margin-top: 10px;
        margin: 5px 0px;
    }
    #searchResult .list .option p{
        margin-top: 10px;
        margin-right: 5px;
        color: #008cee;
    }
    .notice{
        width: 100%;
        height: 100px;
        line-height: 100px;
        text-align: center;
        font-size: 16px;
    }
    .wrap{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 5;
        /*background-color: #ddd;*/
    }

    #mo_header .info-wrapper {
        position: relative;
        float: right;
        width: 137px;
        height: 48px;
        line-height: 48px;
        border-left: 1px solid #473f55;
        padding: 5px;  
        font: normal 14px Arial,verdana,Hiragino Sans GB,"宋体",Microsoft Yaheim;
        color: #fff;
    }
    #mo_header .info-wrapper .item {
        float: left;
    }
    #mo_header .info-wrapper:hover {
        cursor: pointer;
    }
    #mo_header .info-wrapper .item.name {
        font-size: 13px;
        margin: 11px 0px 4px 4px;
    }
    #mo_header .info-wrapper img {
        height: 32px;
        width: 32px;
        border-radius: 50%;
        margin: 4px 5px 4px 4px;
    }
    #mo_header .info-wrapper .item.down {
        width: 12px;
        height: 12px;
        background: url(../../static/public/down.png);
        margin: 11px 12px 4px 4px;
    }
    #mo_header .info-wrapper .customer-info {
        position: absolute;
        bottom: -91px;
        right: 10px;
        width: 193px;
        height: 90px;
        background: #414060;
        border-radius: 3px;
    }
    #mo_header .info-wrapper .customer-info p:hover {
        background-color: rgb(95, 94, 130);
    }
    #mo_header .info-wrapper .customer-info hr {
        height: 1px;
        border: 1px;
        background-color: #666;   
    }
    #mo_header .customer-info p {
        height: 45px;
        line-height: 45px;
        padding-left: 25px;
        font-size: 12px;
    }
    #mo_header .customer-info .worknum {
        border-bottom: 1px solid #3a3956;
        color: #a0a0b0;
    }
</style>