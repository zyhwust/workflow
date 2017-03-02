<template>
    <div id="people" v-if="visible.display">
        <div id="head">
            <span>选择人员</span><i class="fa fa-close fa-2x info-close" @click="close()" aria-hidden="true"></i>
        </div>
        <div class="body">
            <div class="left">
                <div class="search-box">
                    <p>请输入要选择人员名字：</p>
                    <input v-model="condition" @keyup.enter="searchPeople" debounce="500" type="text" id="condition"  placeholder="搜索名字以回车键结束！"></input>
                    <p v-if="!allChecked">已选{{sitems.length}}人<span @click="removeAll()" class="fr pointer">全部删除</span></p>
                    <p v-else>已选全部人员<span @click="checkAll()" class="fr pointer">取消全选</span></p>
                    <div class="search-box-wrap">
                        <!-- 已选人员列表 -->
                        <div class="checked">
                            <ul class="checked-list">
                                <li v-show="!allChecked" class="checked-list-item" v-for="(index, user) in sitems" @click="remove($index,user)">
                                    <i class="fa fa-close checked1"  aria-hidden= "true"></i>
                                    {{user.userRealname}}<input style="display:none" type="text"  v-bind:value="user.userId"> 
                                </li>
                                <li v-show="allChecked" @click="unCheckedAll()" class="checked-list-item">
                                    <i class="fa fa-close checked1"  aria-hidden= "true"></i>
                                    全部人员
                                </li>
                            </ul>
                            <ul v-if="deps.length>0" class="depList">
                                <li class="checked-list-item" v-for="(index, dep) in deps">
                                    {{dep.name}}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="group-name-box">
                </div>
            </div>
            <div v-show="search_result.code == 1" class="right">
                <p>搜索结果：</p>
                <!-- 搜索结果 -->
                <div  class="search-result">
                    <div class="search-result_nav">
                        <i class="fa fa-close fa-2x search-close" @click="closeSearchResult()" aria-hidden="true"></i>
                    </div>
                    <!-- 成员列表 -->
                    <ul class="search-result-list" >
                        <span v-if="search_result.user">人员列表</span>
                        <!-- <span v-show="search_result.users.length==0">没有相应人员</span> -->
                        <li @click="add($index,user)" class="search-result-list-item user" v-for="user in search_result.users">
                            <div class="img_wrap">
                                <div v-show="user.checked"  class="icon">
                                  <i class="fa fa-check checked1"  aria-hidden= "true"></i>
                                </div>
                                <img v-bind:src="user.userImgurl" alt="" onerror="this.src = BASE.url+'/upload/avatar/1.png'">
                            </div>
                            <div class="userInfo">
                                {{user.userRealname}}
                                <br>
                                <span v-if="typeid == 'departmentId'">{{user.jobtitleName}}</span>
                                <span v-if="typeid != 'departmentId'">{{user.departmentName}}</span>
                            </div>
                            <div class="userStatus">
                                <span class="guan" v-if="user.roleId==1" for="">管</span>
                                <span class="zheng" v-if="user.roleId==2" for="">正</span>
                                <span class="lin" v-if="user.roleId==3" for="">临</span>
                            </div>
                        </li>
                        <span v-if="search_result.dep">群组列表</span>
                        <!-- <span v-show="search_result.deps.length==0">没有相应群组</span> -->
                        <li  v-for="dep in search_result.deps">
                            <dep_menubar1 v-bind:model.sync="dep" v-bind:id="dep.deptId" v-bind:itemid="dep.id" v-bind:typeid="types[typeId_index].typeId" v-bind:checkedall="allChecked" keep-alive></dep_menubar1>
                        </li>
                    </ul>
                    <!-- 成员列表 -->
                </div>
                <!-- 搜索结果 -->
            </div>
            <div v-else class="right">
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
                <div v-if="typeId_index == 0" class="searchDep">
                    <i class="fa fa-search search-icon"></i>
                    <input v-model="condition1" @keyup.enter="searchDep()" type="text" placeholder="请输入要搜索的部门">
                </div>
                <div class="members">
                    <div id="r-body">
                        <ul>
                            <div v-if="$root.people.haveDepId" id="option">
                                <span @click="checkAll()" v-if="!allChecked" class="checkAll">全选</span>
                                <span @click="checkAll()" v-if="allChecked" class="checkAll">取消全选</span>
                            </div>
                            <li v-show="!allChecked" v-for="item in selected">
                                <dep_menubar1 v-bind:model.sync="item" v-bind:id="id" v-bind:itemid="item.id" v-bind:typeid="types[typeId_index].typeId" v-bind:checkedall="allChecked" keep-alive></dep_menubar1>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 公司列表 -->
            </div>
            
        </div>
        <!-- 底部 -->
        <div class="foot">
            <button v-if="$root.people.haveDepId" @click="submit()" class="submit">确定</button>
            <button v-else @click="submit1()" class="submit">确定</button>
        </div>
        <!-- 底部 -->
    </div>
</template>

<script>
import mo_depMenubar1 from './mo_depMenubar1.vue';
export default {
    data () {
        return {
            visible: this.$root.people,
            condition: "", //人员搜索条件
            condition1: "",//部门搜索条件
            sitems:[], //选定人员
            deps:[], //全选部门列表
            ids:[], //创建群组，选定人员id
            search_result: {}, //搜索结果
            allChecked: false,
            treeData:{},
            types:[], //后台获取公司结构
            selected:[],
            typeId_index:0,
            activeDep: []
        } 
    },
    components:{
        dep_menubar1 : mo_depMenubar1,
    },
    replace:true,
    ready () {
        this.getTree();
    },
    watch:{
        "typeId_index" (newOne,oldOne){
            this.selected = this.types[newOne].data;
            this.$set("activeDep",[]);
        },
        "search_result.users" (newOne,oldOne){
            // this.selected = this.types[newOne].data;
            // this.$set("activeDep",[]);
        }
    },
    methods : {
        getTree:function(){
            //获取分类列表
            var vm = this;
            var obj = {
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
            // this.sitems.forEach(function(item){
            //     item.checked = false;
            // });
            // this.sitems = [];
            // 清空搜索条件
            this.condition = "";
            this.condition1 = "";
            this.$root.people.display=false;
            this.$root.overlay.display=false;
        },
        // 关闭搜索结果
        closeSearchResult:function(){
            this.search_result = {};
        },
        //清除已选择人员
        removeAll: function(){
            if(this.allChecked){
                this.allChecked = false;
                return;
            }
            //清空选中成员
            this.sitems.forEach(function(item){
                item.checked = false;
            });
            this.sitems = [];
            this.deps = [];
        },
        is_allChecked: function(){
            if(this.sitems.length==this.items.length){
                this.allcheck = true;
            }else{
                this.allcheck = false;
            }
        },
        // 从已选成员列表中删除人员
        remove:function (index,user) {
            this.sitems[index].checked = false;
            this.sitems.splice(index, 1);
            this.$emit('deleteDep',user);
            // 删除搜索列表中的部门选中状态
            var deptId = user.depId;
            if(this.search_result.deps){
                for(let dep of this.search_result.deps){
                    if(dep.deptId == deptId){
                        dep.checked = false;
                    }
                }
            }
        },
        // 全选
        checkAll:function(){
            if(!this.allChecked){
                this.allChecked = true;
            }else{
                this.allChecked = false;
            }
            this.allcheck = !this.allcheck;
        },
        // 搜索人员
        searchPeople: function(){
            this.search_result = {};
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
                    res.data.forEach(function (item){
                        item.userImgurl = BASE.url+"/upload/avatar/"+item.id+".png";
                        item.checked = false;
                        item.userRealname = item.name;
                        item.userId = item.id;
                        // item.departmentName = "急诊科";
                    });
                    res.data.forEach(function (item){
                        // if(item.userId == localStorage.userId){
                        //     item.checked = true;
                        // }else{
                        //     self.$emit('checkedUser',item);
                        // }
                        self.$emit('checkedUser',item);
                    });
                    self.$set("search_result.users",res.data);
                    self.search_result.user = true;
                    self.search_result.code = 1;
                },
                asy:false
            }
            Ajax(obj);
        },
        // 搜索部门
        searchDep:function(){
            var self = this;
            if(!this.condition1){
                tools.toast("请输入关键字搜索","error");
                return;
            }
            var typeId = this.types[this.typeId_index].typeId;
            let obj = {
                url: '/home/user/1032.spring',
                args: {
                    searchString : self.condition1,
                    typeId : typeId
                },
                success: function (res) {
                    if(res.code == 1){
                        if(typeId == "departmentId"){
                            res.data.forEach(function (item){
                                var checked = false;
                                for(let dep of self.deps){
                                    if(item.deptId == dep.id){
                                        checked = true;
                                        break;
                                    }
                                }
                                item.checked = checked;
                                item.name = item.deptName;
                                item.id = item.deptId;
                            });
                            self.$set("search_result.deps",res.data);
                        }
                    }
                    self.search_result.code = 1;
                    self.search_result.dep = true;
                    self.condition1 = "";
                    // console.log(self.search_result);
                },
                asy: false
            }
            Ajax(obj);
        },
        // 搜索结果中添加人员
        add: function(index,user){
            // if(user.userId != localStorage.userId){
                if( user.checked ){
                    this.search_result.users[index].checked = false;
                    this.$dispatch('remove', user);
                }else{
                    this.search_result.users[index].checked = true;                    
                    this.sitems.push(user);
                    // this.$emit('addperson', user);
                    // this.sitems.push(user);
                    
                    // this.$emit('checkeUserByDep',user.userId);
                }
            // }
        },
        //取消全选
        unCheckedAll: function(){
            this.allChecked = false;
        },
        submit:function(){
            if(this.allChecked){
                var self = this;
                var deps = [];
                var tree = this.selected;
                for(let k in tree){
                    function traverseTree(tree){
                        var dep = {};
                        dep.id = tree.id;
                        dep.pid = tree.pId;
                        dep.name = tree.name;
                        // dep.deptType = self.types[self.typeId_index].typeId;
                        deps.push(dep);
                        if(tree.children!=null){
                            for (var i = 0; i<tree.children.length;  i++) {
                                traverseTree(tree.children[i]);
                            }
                        }
                    }  
                    traverseTree(tree[k]);
                }
                // 添加所选部门
                this.$root.people.deptType = this.types[this.typeId_index].typeId;
                this.$root.people.deps = deps;
                this.$root.people.users = [];
                // 添加所人员
                // this.$root.people.users = [];
            }else{
                this.ids = [];
                var deps = this.deps;
                var sitems = this.sitems;
                // 去除全选部门的人员
                if(deps.length > 0){
                    for(let i in sitems){
                        var inDep = false;
                        for(let j in deps){
                            if(sitems[i].depId == deps[j].id){
                                inDep = true;
                            }
                        }
                        if(!inDep){
                            this.ids.push(sitems[i]);
                        }
                    }
                }else{
                    this.ids=this.sitems;
                }
                
                // 添加所选部门
                this.$root.people.deptType = this.types[this.typeId_index].typeId;
                this.$root.people.deps = deps;
                this.$root.people.users = this.ids;
            }
            if( toString.call(this.$root.people.success) === "[object Function]"){
                this.$root.people.success.call(this.$root);
                this.$root.people.success = null;
            }
            
        },
        submit1:function(){
            this.ids=[];
            for(let k in this.sitems){
                this.ids.push(this.sitems[k]);
            }
            if(this.ids.length==0){
                tools.toast("请选择至少一个人员","error");
                return;
            }

            // 添加所人员
            this.$root.people.users = this.ids;

            if( toString.call(this.$root.people.success) === "[object Function]"){
                this.$root.people.success.call(this.$root);
                this.$root.people.success = null;
            }
            console.log(this.$root.people.deps);
        }
    },
    events:{
        // 添加人员（已选列表中添加）
        'addperson':function(msg){
            this.sitems.push(msg);
            msg.checked = true;
        },
        // 删除人员（已选列表中删除）
        'remove':function(msg){
            for(let k in this.sitems){
                if(this.sitems[k].userId ===  msg.userId){
                    this.sitems.splice(k,1);
                }
            }
        },
        // 检查人员是否被选中
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
        },
        // 添加部门（部门列表中添加）
        'addDep':function(dep){
            var notIn = false;
            for(let k in this.deps){
                if(this.deps[k].id == dep.id){
                    notIn = true;
                }
            }
            if(!notIn){
                this.deps.push(dep);
            }
        },
        // 删除部门（部门列表中添加）
        'deleteDep':function(dep){
            for(let k in this.deps){
                if(this.deps[k].id ===  dep.id){
                    this.deps.splice(k,1);
                }
            }
        },
        'deleteDep1':function(index){
            var depId = this.sitems[index].depId;
            for(let k in this.deps){
                if(this.deps[k].id == depId){
                    this.deps.splice(k,1);
                }
            }
        },
        'unCheckedAll':function(dep){
            this.allChecked = false;
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
#people{
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
#people .body{
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
#people .body .left{
    float: left;
    width: 380px;
    display: flex;
    flex-direction:column;
}
#people .body .right{
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
    height: 350px;
    max-height: 350px;
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
#people .checked .last{
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
    height: 350px;
    border: 1px solid #e1e1e1;
    overflow: scroll;
}
#people .company-content .list-item {
    height: 50px;
    padding: 8px 21px;
}
#people .company-content .list-item:hover{
    background-color: #dfedfa;
}
#people .info .total {
    margin-top: 3px;
    color: #000000;
}
#people .info .person-icon {
    float: left;
    margin-right: 17px;
    width: 33px;
    height: 33px;
    border-radius: 50%;
    position: relative;
}
#people .info img {
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
    margin-left: 8px;
    margin-top: 5px;
    color: #fff;
}
#people .foot{
    width: 100%;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: #fff;
}
#people .foot .submit{
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
    background-color: #fff;
    height: 380px;
    overflow: scroll;
}
.search-result-list-item{
    display: inline-block;
    width: 200px;
    border: 0;
    margin: 5px;
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
.depList{
    padding: 10px;
    border-top: 1px solid #e1e1e1;
}
.checkAll{
    color: #0583dc;
    cursor: pointer;
    direction: line;
}
.checkAll:hover{
    color: #36434e;
    font-size: 13px;
    text-decoration: underline;
}
.search-result_nav{
    line-height: 20px;
    margin-right: 3px;
}
.search-close{
    margin-top: 2px;
    margin-right: 2px;
    font-size: 20px;
    float: right;

}
.user{
    margin-left: -1em;
    position: relative;
}
.icon{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 33px;
    height: 33px;
    border-radius: 50%;
    background-color: #707275;
    opacity: 0.9;
}
.user img{
    margin-right: 1em;
    width: 100%;
    height: 100%;
    border-radius: 50%;
}
.icon .checked1{
    position: absolute;
    top: 6px;
    left: 6px;
    color: #fff;
    font-size: 20px;
    font-weight: inherit;
}
.loading{
    color: #757575;
}
.img_wrap{
    position: absolute;
    float: left;
    margin-left: 3px;
    width: 33px;
    height: 33px;
    border-radius: 50%;
    -webkit-user-select: none;
}
.userInfo{
    float: left;
    display: inline-block;
    line-height: 20px;
    width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-left: 45px;
}
.userStatus{
    height: 100%;
    position: absolute;
    right: 5px;
    top: 4px;
}
.userStatus span{
    display: block;
    width: 25px;
    height: 25px;
    line-height: 25px;
    padding-left: 6px;
    border-radius: 50%;
    border: 1px solid #ddd;
    color: #fff;
}
.guan{
    background-color: #f55151;
}
.zheng{
    background-color: #3799df;
}
.lin{
    background-color: #fdad49;
}
/*搜索部门*/
.searchDep{
    position: relative;
    width: 100%;
    height: 30px;
}
.searchDep input{
    width: 100%;
    height: 30px;
    border: none;
    padding-left: 3em;
}
.search-icon{
    position: absolute;
    font-size: 15px;
    top: 8px;
    left: 10px;
}
.name_option{
    color: #008cee;
}
.pointer{
    cursor: pointer;
}
</style>
