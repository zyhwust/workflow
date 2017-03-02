<template>
    <div id="groupchart" v-if="visible.display">
        <div id="head">
            <span>发起聊天</span><i class="fa fa-close fa-2x info-close" @click="close()" aria-hidden="true"></i>
        </div>
        <div class="body">
            <div class="left">
                <div class="search-box">
                    <input v-model="condition" @keyup.enter="search" debounce="500" type="text" id="condition"  placeholder="搜索名字、拼音、手机号..."></input>
                    <p>群成员：<span class="fr ">已选{{sitems.length}}人</span></p>
                    <div class="search-box-wrap">
                        <!-- 已选人员列表 -->
                        <div class="checked">
                            <ul class="checked-list">
                                <li class="checked-list-item" v-for="(index, user) in sitems" @click="remove($index)">
                                    <i class="fa fa-close checked1"  aria-hidden= "true"></i>
                                    {{user.userRealname}}<input style="display:none" type="text"  v-bind:value="user.userId"> 
                                </li>
                            </ul>
                            <!-- 搜索结果 -->
                            <div v-if="search_result.length>0" class="search-result">
                                <!-- 成员列表 -->
                                <ul class="search-result-list" >
                                    <li @click="add($index,user)" class="search-result-list-item" v-for="user in search_result">
                                        <div class="info">
                                            <div class="person-icon">
                                                <div v-if="user.checked" class="icon">
                                                    <i class="fa fa-check checked" aria-hidden="true"></i>
                                                </div>
                                                <img :src="user.userImgurl" onerror="this.src = BASE.url+'/upload/avatar/1.png'">
                                            </div>
                                        </div>
                                        <div class="info">
                                            <p class="total">{{user.userRealname}}</p>
                                        </div>
                                    </li>
                                </ul>
                                <!-- 成员列表 -->
                            </div>
                            <!-- 搜索结果 -->
                        </div>
                    </div>
                </div>
                <div class="group-name-box">
                    <p>群名称：</p>
                    <input v-model="groupName"  type="text" id="groupname" placeholder="请输入群名称（非必填）">
                </div>
            </div>
            <div class="right">
                <p>选择群成员：</p>
                <!-- 公司列表 -->
                <ul class="nav nav-tabs">
                    <li>按照
                        <select id="select" v-model="typeId_index">
                            <option v-for="item in types"  v-bind:value ="$index">{{item.typeName}}</option>
                        </select>
                        分组
                    </li>
                </ul>
                <!-- 公司列表 -->
                <div class="members">
                    <div id="r-body">
                        <ul>
                            <li v-for="item in selected">
                                <dep_menubar v-bind:model.sync="item" v-bind:id="id" v-bind:itemid="item.id" v-bind:typeid="types[typeId_index].typeId" keep-alive></dep_menubar>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <!-- 底部 -->
        <div class="foot">
            <button @click="submit()" class="submit">确定</button>
        </div>
        <!-- 底部 -->
    </div>
</template>

<script>
import mo_depMenubar from './mo_depMenubar.vue';

export default {  
    data () {
        return {
            visible: this.$root.groupchart,
            condition: "", //搜索条件
            groupName: "", //群组名称
            sitems:[], //选定人员
            ids:[], //创建群组，选定人员id
            search_result: [], //搜索结果
            allcheck: false,
            treeData:{},
            types:[], //后台获取公司结构
            selected:[],
            typeId_index:0,
            activeDep: []
        } 
    },
    components:{
        dep_menubar:mo_depMenubar,
    },
    replace:true,
    ready () {
        this.getTree();
    },    
    watch:{
        "typeId_index" (newOne,oldOne){
            this.selected = this.types[newOne].data;
            this.$set("activeDep",[]);
        }
    },
    methods : {
        getTree:function(){
            //获取分类列表
            let vm = this;
            let obj = {
                url: '/home/user/1024.spring',
                args: {},
                success: function (res) {
                    var data = res.data;
                    vm.types = data;
                    vm.selected = vm.types[vm.typeId_index].data;
                },
                asy: true
            }
            Ajax(obj);
        },
        close:function() {
            //清空选中成员
            this.sitems.forEach(function(item){
                item.checked = false;
            });
            this.sitems = [];
            // 清空搜索条件
            this.condition = "";
            // 清空群组名称
            this.groupName = "";
            this.$root.groupchart.display=false;
            this.$root.overlay.display=false;
        },
        is_allChecked: function(){
            if(this.sitems.length==this.items.length){
                this.allcheck = true;
            }else{
                this.allcheck = false;
            }
        },
        remove:function (index) {      
            this.sitems[index].checked = false;
            this.sitems.splice(index, 1);
            this.$dispatch("removeUser",index);
        },
        checkall:function(){
            if(!this.allcheck){
                this.sitems = [];
                for(let kk in this.items){
                    this.sitems.push(this.items[kk]);
                    this.items[kk].checked = true;
                }
            }else{
                this.sitems = [];
                for(let kk in this.items){
                    this.items[kk].checked = false;
                }
            }
            this.allcheck = !this.allcheck;
        },
        search: function(){
            if(!this.condition){
                tools.toast("请输入要搜索内容！","error");
                return;
            }
            var self = this;
            var obj = {
                url:'/home/user/1012.spring',
                args:{
                    "searchString" : self.condition
                },
                success: function(res){
                    if(res.data.length == 0){
                        tools.toast("没有该人员！","error");
                    }
                    res.data.forEach(function (item){
                        item.userImgurl = BASE.url+"/upload/avatar/"+item.id+".png";
                        item.checked = false;
                        item.userRealname = item.name;
                        item.userId = item.id;
                    });
                    res.data.forEach(function (item){
                        if(item.userId == localStorage.userId){
                            item.checked = true;
                        }else{
                            self.$emit('checkedUser',item);
                        }
                    });
                    self.search_result = res.data;
                },
                asy:false
            }
            Ajax(obj);
        },
        add: function(index,user){
            if(user.userId != localStorage.userId){
                if( user.checked ){
                    //user.checked = false;
                    // this.$dispatch('remove', user);
                }else{
                    this.$emit('addperson', user);
                    // this.sitems.push(user);
                    //this.sitems[index].checked = true;
                    this.$emit('checkeUserByDep',user.userId);
                }
            }
        },
        submit:function(){
            var that = this;
            this.ids = [];
            for(let k in this.sitems){
                this.ids.push(this.sitems[k].userId);
            }
            if(this.ids.length==0){
                tools.toast("请选择人员！","error");
                return;
            }
            if(!this.groupName){
                tools.toast("群名称不能为空！","error");
                return;
            }
            var ids = this.ids.toString();
            //获取值
            var obj14171 = {
                url: '/home/company/1417.spring',
                args: {
                    "groupName": that.groupName, //群组名称
                    "owner": localStorage.userId, //登陆用户的Id
                    "members": ids
                },
                success: function (res) {
                    var data = {};
                    data.jid = "516881172#mo_"+res.data.data.groupid+"@conference.easemob.com";
                    data.name = that.groupName;
                    data.roomId = res.data.data.groupid;
                    data.img = "";
                    data.color = "";
                    friends.push(data);
                    conversation.push(data);
                    that.$router.go({ path: '/chat/msg/chartContent/'+data.name+'/'+data.roomId,append:false});
                    that.close();
                },
                asy: false
            }
            Ajax(obj14171);
        }
    },
    events:{
        'addperson':function(msg){
            this.sitems.push(msg);
            msg.checked = true;
            this.search_result = [];
        },
        'remove':function(msg){
            for(let k in this.sitems){
                if(this.sitems[k].userId ===  msg.userId){
                    this.sitems.splice(k,1);
                }
            }
            this.search_result = [];
        },
        'checkedUser'(item){
            var it = this.sitems;
            for(var index in it){
                if(item.userId === it[index].userId){
                    item.checked  = true;
                    it[index] = item;
                    return;
                }
            }
            item.checked  = false;
        },
        'activeDep'( dep ){
            this.activeDep.push(dep);
        },
        'unactiveDep'(target){
            for( let index in this.activeDep){
                if (target.model.id === this.activeDep[index].model.id){
                    this.activeDep.splice(index,1);
                    break;
                }
            }
        },
        'checkeUserByDep' (userId){
            let self = this;
            let i=this.sitems.length-1;
            for(; i >=0 ;i-- ){
                if(this.sitems[i].userId === userId)
                    break;
            }
            if(i<0)return;
            for(let dep of this.activeDep){
                let uinfo = dep.model.usersInfo;
                for(let user of uinfo){
                    if(user.userId === userId){
                        user.checked  = true;
                        this.sitems[i] = user;
                        return;
                    }
                }
            }
        }
    }
}
</script>

<style scoped>
p{
    padding: 5px 0;
}
.fr{
    float: right;
}
#groupchart{
    width: 676px;
    min-height: 545px;
    height: auto;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -338px;
    margin-top: -275px;
    overflow: hidden;
    z-index: 9;
    box-shadow: rgba(0,0,0,0.15) 0 0 6px;
    background-color: #fafafc;
    display: -webkit-box;
    display: -moz-box;
    display: box;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-flow: column nowrap;
    -moz-flex-flow: column nowrap;
    flex-flow: column nowrap;
    border-radius: 3px;
}
#head{
    height: 50px;
    line-height: 52px;
    text-align: center;
    background-color: #fff;
    padding: 0 30px;
    position: relative;
    border-bottom: 1px solid #ececed;
    border-radius: 3px;
}
#groupchart .body{
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  box-flex: 1;
  -webkit-flex: 1;
  -moz-flex: 1;
  -ms-flex: 1;
  flex: 1;
  padding: 12px;
  overflow-y: auto;

}
#groupchart .body .left{
  float: left;
  width: 380px;
  display: flex;
  flex-direction:column;
}
#groupchart .body .right{
  float: right;
  width: 240px;
}
.info-close{
  position: absolute;
  top: 10px;
  right: 7px;
  width: 21px;
  height: 21px;
  cursor: pointer;
}
.search-box{
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  box-flex: 1;
  -webkit-flex: 1;
  -moz-flex: 1;
  -ms-flex: 1;
  flex: 2;
}
.group-name-box{
  flex: 1;
}
.search-box-wrap{
  border: 1px solid #e1e1e1;
  height: 310px;
  max-height: 310px;
  background-color: #fff;
  border-radius: 3px;
  overflow: scroll;
}
#condition{
  width: 100%;
  height: 40px;
  padding-left: 1em;
  text-align: left;
  border: none;
  border: 1px solid #ddd;
}
.checked-list{
  margin: 10px;
}
.checked-list-item{
  display: inline-block;
  margin: 5px;
  padding: 5px;
  border: 1px solid #e1e1e1;
}

#groupchart .checked .last{
  display: inline-block;
  margin: 5px;
  padding: 5px;
  border: 0;
}

.check-all{
  display: block;
  margin-left: 30px;
  margin-top: 15px;
  margin-bottom: 10px;
}
input[type="checkbox"] {
  margin-right: 8px;
}
#groupname{
  box-sizing: border-box;
  width: 100%;
  color: #222;
  font-size: 14px;
  border: 1px solid #e1e1e1;
  border-radius: 3px;
  background-color: #fff;
  padding: 10px;
  outline: 0;
}
.nav-tabs {
  border-bottom: 1px solid #ddd;
}
.nav {
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
    height: 33px;
    line-height: 33px;
    background-color: #5299c7;
    border-top-radius: 4px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    color: #fff;
    opacity: 0.7;
}
.nav-tabs>li {
  float: left;
  text-align: center;
  margin-bottom: -1px;
}
.nav>li {
  display: block;
  text-align: center;
  text-indent: 1em;
}
.nav-tabs>li.active{
  background-color: #fff;
}
.members{
  border-radius: 3px;
  background-color: #fff;
  height: 380px;
  border: 1px solid #e1e1e1;
  overflow: scroll;

}
#groupchart .company-content .list-item {
  height: 50px;
  padding: 8px 21px;
}
#groupchart .company-content .list-item:hover{
  background-color: #dfedfa;
}
#groupchart .info .total {
  /*margin-top: 3px;*/
  color: #000000;
}
#groupchart .info .person-icon {
  float: left;
  margin-right: 17px;
  width: 33px;
  height: 33px;
  border-radius: 50%;
  position: relative;
}
#groupchart .info img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  
}
.user-wrap{
  width: 100%;
}
.icon{
  position: absolute;
  left: 0;
  top: 0;
  width: 33px;
  height: 33px;
  background-color: rgba(0,0,0,0.6);
  border-radius: 50%;
}
.icon .checked{
    color: #fff;
    font-size: 25px;
    font-weight: inherit;
    margin-left: 5px;
    margin-top: 5px;
    color: #fff;
}
#groupchart .foot{
  width: 100%;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: #fff;
}
#groupchart .foot .submit{
  width: 136px;
  height: 34px;
  background-color: #008cee;
  color: #fff;
  border: 0;
  outline: 0;
  border-radius: 3px;
  margin: 2px 0;
}
.search-result{
  border-radius: 3px;
  background-color: #fafafc;
  height: 250px;
  overflow: scroll;
}
.search-result-list-item{
  display: inline-block;
  width: 200px;
  border: 0;
  margin: 10px;
}
.isHover:active {
  border:1px solid #dddcdd;
  border-style: dotted;
}
.fa-folder{
  color: #73B2E8;
}
.item {
  cursor: pointer;
}
ul {
  padding-left: 1em;
  line-height: 30px;
}
.select{
  width: 20px;
}
</style>
