<template>
    <div id="myinfo" v-if="visible.display">
        <div id="info_header">
            <div class="bg_img" :style="{'background-image':'url('+user_img+')'}" onerror="alert(11)" v-bind:style="bc_img">
            </div>
            <i class="fa fa-close fa-2x info-close" @click="close()" aria-hidden="true"></i>
            <div class="user_info">
                <img class="user_img" :src="user_img" alt="{{user_name}}" onerror="this.src = BASE.url+'/upload/avatar/1.png'">
            </div>  
            <div class="detail-info">
                <div class="name">{{user_name}}</div>
            </div>
            <!-- <div class="certification">钉钉认证：{{company}}</div> -->
        </div>
        <div id="info_content">
            <dl class="detail-box">
                <dt class="box-title">个人信息</dt>
                <dt class="box-item"><label class="info_label">姓名</label><span class="ctn">{{user_name}}</span></dt>
            </dl>
            <dl class="detail-box">
                <dt class="box-title">{{company}}</dt>
                <dt class="box-item"><label class="info_label">部门</label><span class="ctn">{{departmentName}}</span></dt>
                <dt class="box-item"><label class="info_label">职位</label><span class="ctn">{{jobTitle}}</span></dt>
                <dt class="box-item"><label class="info_label">电话</label><span class="ctn">{{user_phone}}</span></dt>
            </dl>
        </div>
        <div id="info_footer">
           <a :class="message_class"  @click="sendMessage"><i class="fa fa-comment  info-icon" aria-hidden="true"></i><span>发消息</span></a>
           <a :class="phone_class" @click="Call"><i class="fa fa-phone  info-icon" aria-hidden="true"></i><span>打电话</span></a>
           <a :class="ding_class" @click="Ding"><i class="fa fa-bolt  info-icon" aria-hidden="true"></i><span>暂未开通</span></a>
        </div>
    </div>
</template>

<script>
export default {
    ready() {
    },
    data () {
        return {
            myphone: localStorage.user,
            user_nickname:'',
            get_userId: this.$root.myinfo,
            //姓名
            user_name:"",
            user_img:"",
            company:"",
            departmentName : "",//部门
            jobTitle : "", //职位
            //手机号码
            user_phone:"",   
            visible:this.$root.myinfo,
            // 创建群聊电话数组
            phones:[],
            message_class:{
            'can_use':false,
            'cant_use':true
            }, 
            phone_class:{
            'can_use':true,
            'cant_use':false
            }, 
            ding_class:{
            'can_use':true,
            'cant_use':false
            }
        } 
    },   
    methods : {
        close:function() {
            this.$root.myinfo.display=false;
            this.$root.overlay.display=false;
            this.$root.myinfo.userId = null;
            //设置昵称
            this.user_nickname = null;
            //设置姓名
            this.user_name = null;
            //部门
            this.departmentName =null;
            //职位
            this.jobTitle = null;
            //手机号码
            this.user_phone = null;
            //设置公司名称
            this.company = null;
            //设置头像
            this.user_img = null;
        },
        Call:function(){
            tools.toast("暂未开通，请稍后！","default");
        },
        Ding:function(){
            tools.toast("暂未开通，请稍后！","default");
        },
        sendMessage: function(){
            var self = this;
            if(localStorage.userId == self.$root.myinfo.userId){
                tools.toast("不能与自己聊天","error");
                return;
            }else{
                var haveMsg = false; 
                for(let k in window.msg){
                    if(window.msg[k].userId == self.$root.myinfo.userId){
                        haveMsg = true;
                        self.$router.go({ path: '/chat/msg/chartContent1/'+window.msg[k].name+'/'+window.msg[k].roomId,append:false});
                        self.close();
                    }
                }
                if(!haveMsg){
                    var msg = {};
                    msg.userId = self.$root.myinfo.userId;
                    msg.name = self.user_name;
                    msg.roomId = self.$root.myinfo.userId;
                    msg.img = BASE.url+"/upload/avatar/"+self.$root.myinfo.userId+".png";
                    msg.color = 0;
                    window.msg.push(msg);
                    self.$router.go({ path: '/chat/msg/chartContent1/'+msg.name+'/'+msg.roomId,append:false});
                    self.close();
                }
            }
            this.$root.myinfo.display=false;
            this.$root.overlay.display=false;
        }
        /*sendMessage: function(){
            var self = this;
            self.phones.push(self.$root.myinfo.userId);
            if(localStorage.userId == self.$root.myinfo.userId){
                tools.toast("不能与自己聊天","error");
                return;
            }else{
                var ids = (self.phones).toLocaleString();
                var obj14171 = {
                    url: '/home/company/1417.spring',
                    args: {
                        "groupName": self.user_name, //群组名称
                        "owner": localStorage.userId, //登陆用户的Id
                        "members": ids
                    },
                    success: function (res) {
                        var data = {};
                        data.jid = "516881172#mo_"+res.data.data.groupid+"@conference.easemob.com";
                        data.name = self.user_name;
                        data.roomId = res.data.data.groupid;
                        data.img = "";
                        data.color = "";
                        friends.push(data);
                        self.$router.go({ path: '/main/msg/chartContent/'+data.name+'/'+data.roomId,append:false});
                        self.close();
                    },
                    asy: false
                }
                Ajax(obj14171);
            }
            this.$root.myinfo.display=false;
            this.$root.overlay.display=false;
        }*/
    },
    watch: {
        'get_userId': {
            handler: function(val, oldVal) {
                var self = this;
                var userId = self.$root.myinfo.userId;
                if (userId) {
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
                                // self.user_nickname = res.data.userNickname;
                                //设置姓名
                                if(res.data.userRealname){
                                    self.user_name = res.data.userRealname;
                                }
                                //手机号码
                                if(res.data.telephone.length==11){
                                    if(self.$root.myinfo.userId == localStorage.userId){
                                        self.user_phone = res.data.telephone;
                                    }else{
                                        var phone = res.data.telephone.substring(0,3);
                                        self.user_phone = phone+"*********";
                                    }
                                }else{
                                    self.user_phone = "无";
                                }
                                //头像
                                self.user_img = BASE.url+"/upload/avatar/"+res.data.userId+".png";
                                //部门
                                if(res.data.departmentName){
                                    self.departmentName = res.data.departmentName;
                                }else{
                                    self.departmentName = "无";
                                }
                                //职位
                                if(res.data.jobTitleIds.length>0){
                                    var jobTitleNames = [];
                                    for(let jobTitle of res.data.jobTitleIds){
                                        jobTitleNames.push(jobTitle.name);
                                    }
                                    self.jobTitle = jobTitleNames.toLocaleString();
                                }else{
                                    self.jobTitle = "无";
                                }
                            } 
                        },
                        asy: true
                    }
                    Ajax(obj);
                }
                
            },
            deep: true
        }
    }
}
</script>

<style scoped>
#myinfo{
    position: fixed;
    left: 50%;
    top:50%;
    width: 375px;
    height: 511px;
    margin-left: -187.5px;
    margin-top: -255.5px;
    box-shadow: rgba(0,0,0,0.15) 0 0 6px;
    border-radius: 3px;
    background-color: #fff;
    display: flex;
    flex-flow: column nowrap;
    z-index: 10;
}
#info_header{
    height: 150px;
    border-bottom: 1px solid #ede9e5;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    position: relative;
    overflow: hidden;
}
.bg_img{
    background: #aaa;  
    -webkit-filter: blur(29px);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.7;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    overflow: hidden;
    background-size: 100%;    
}
.info-close{
    position: absolute;
    top: 10px;
    right: 7px;
    width: 21px;
    height: 21px;
    cursor: pointer;
    color: #fff;
    font-size: 15px;
}
.info-close:hover{
    color: #EC6666;
}
.user_info{
    position: absolute;
    left: 23px;
    top: 51px;
    width: 57px;
    height: 57px;
    border-radius: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    box-sizing: border-box;
    border: 2px solid #fff;
}
.user_img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
}
.detail-info{
    position: absolute;
    left: 89px;
    top: 71px;
}
.name{
    display: inline-block;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    line-height: 20px;
    color: #fff;
    font-size: 19px;
}
.certification{
    position: absolute;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    padding: 5px 5px 5px 23px;
    background-color: rgba(0,0,0,0.2);
    line-height: 17px;
    color: #fff;
    font-size: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;
}
#info_content{
    -webkit-flex: 1;
    background-color: #fff;
    max-width: 375px;
    overflow-y: auto;
}
.detail-box{
    margin: 15px 5px 0 25px;
    padding-bottom: 11px;
}
.box-item{
    position: relative;
    margin-top: 13px;
    line-height: 20px;
}
.box-title{
    font-size: 17px;
}
.info_label{
    width: 18%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    margin-right: 3em;
    color: #aeaeb2; 
    font-size: 15px; 
}
#info_footer{
    min-height: 53px;
    border-top: 1px solid #e3e3e5;
    background-color: #f9f9f9;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
}  
.can_use{
    box-sizing: border-box;
    float: left;
    width: 33.33%;
    margin-top: 18px;
    border-right: 1px solid #d7d6d9;
    text-align: center;
    cursor: pointer;
    color: #aeaeb2;
    font-size: 15px;
}
.cant_use{
    box-sizing: border-box;
    float: left;
    width: 33.33%;
    margin-top: 18px;
    border-right: 1px solid #d7d6d9;
    text-align: center;
    cursor: pointer;
    color: #38adff;
    font-size: 15px;
}
.info-icon{
    height: 17px;
    width: 17px;
    margin-right: 3px;
}
</style>
