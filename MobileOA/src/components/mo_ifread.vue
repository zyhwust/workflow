<template>
    <div id="ifread" v-show="visible.display">
        <div class="head">
            <div class="no_type" :class="{'active': tab.unread}" @click="unreadPeople">未&nbsp;看</div>
            <div class="no_type" :class="{'active': tab.read}" @click="readPeople">已&nbsp;看</div>
        </div>
        <div class="read-content">
            <ul id="area">
                <li v-for="item in items">
                    <div class="icon-wrapper">
                        <img :src="item.picture" alt="" onerror="this.src = BASE.url + '/upload/avatar/1.png'">
                    </div>
                    <span class="name-wrapper">{{item.userRealname}}</span>
                    <div class="info-wrapper">
                        <p class="dep">{{item.departmentName}}</p>
                        <p class="position">{{item.jobtitleName}}</p>
                    </div>
                    <div class="type">{{item.roleName}}</div>
                </li>
                <button class="page-wrapper" @click="nextPage()">
                    <span class="next-page">下一页</span>
                </button>        
            </ul>
        </div>

    </div>
</template>

<script>
    export default {
        props: ['informid'],
        ready () {
            var vm = this;
            vm.loadData();
        },
        data () {
            return {
                visible: this.$root.ifread,
                // 选项卡
                tab: {
                    read: true,
                    unread: false
                },
                // 人员数据
                items: [],
                // 分页相关
                page: {
                    cur: 0,
                    size: 20,
                    total: 0
                }
            }
        },
        methods: {
            // 清空选项卡激活状态
            clearTab () {
                var vm = this;
                for(var key in vm.tab) {
                    vm.tab[key] = false;
                }
                vm.page.cur = 1;
            },
            // 点击已看按钮
            readPeople: function() {
                var vm = this;
                if(vm.tab.read === false) {
                    vm.clearTab();
                    vm.items = [];
                }
                vm.tab.read = true;
                if(vm.page.cur - 1 >= vm.page.total) {
                    return;
                }
                vm.loadData();
            },
            // 点击未看按钮
            unreadPeople: function() {
                var vm = this;
                if(vm.tab.unread === false) {
                    vm.clearTab();
                    vm.items = [];
                }
                vm.tab.unread = true;
                if(vm.page.cur - 1 >= vm.page.total) {
                    return;
                }                
                vm.loadData();
            },     
            //  下一页
            nextPage () {
                var vm = this;
                if(vm.page.cur - 1 >= vm.page.total) {
                    return;
                }
                vm.loadData();
            },
            // 加载数据
            loadData () {
                var vm = this;
                vm.items = [];
                var btn = document.querySelector('.page-wrapper');
                tools.busy();
                btn.setAttribute('disabled', true);
                var vm = this,
                    ul = document.querySelector('#area');
                var obj1709 = {
                    url: '/inform/1709.spring',
                    args: {
                        id: vm.informid,
                        page: vm.page.cur ++, 
                        pageSize: vm.page.size,
                        status: (vm.tab.read === true ?　1 : 0)
                    },
                    success: function(res) {
                        for(var i = 0, len = res.data.length; i < len; i++) {
                            res.data[i].picture = BASE.url+'/upload/avatar/' + res.data[i].userId + '.png';
                            if(res.data[i]['jobtitleName'] == '') {
                                res.data[i]['jobtitleName'] = '无';
                            }
                        }
                        vm.page.total = res.total;
                        vm.items = [];
                        vm.items = res.data;
                        ul.scrollTop = 0;
                        btn.removeAttribute('disabled');
                        tools.busy(false);
                    },
                    error: function() {
                        if(vm.page.cur-1 > vm.page.total) {
                            btn.removeAttribute('disabled');
                            tools.busy(false);
                            return;
                        }
                        btn.removeAttribute('disabled');
                        tools.busy(false);
                    },
                }				
                Ajax(obj1709);
            }   
        }
    }
</script>

<style scoped>
#ifread {
    z-index: 9;
    position: absolute;
    width: 395px;
    height: 500px;
    top: 15%;
    left: 50%;
    margin-left: -187px;
    background-color: #FDFDFD;
    border-radius: 4px;
    font-family: \\51AC\9752\9ED1\4F53\7B80\4F53\4E2D\6587,Tahoma,Hiragino Sans GB,Microsoft YaHei,\\5FAE\8F6F\96C5\9ED1,STHeiti,WenQuanYi Micro Hei,SimSun,sans-serif!important;    
}
#ifread .head {
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: #E6F2F8;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}
#ifread .head .no_type:first-child {
    border-top-left-radius: 4px;
}
#ifread .head .no_type:last-child {
    border-top-right-radius: 4px;
}
#ifread .head .no_type,i {
    font-size: 16px;
}
#ifread .head .no_type {
    float: left;
    width: 50%;
    border-color: #c6e0ec;
    border-bottom: 1px solid #e1e1e1;
    color: #7d7d7e;    
}
#ifread .head .no_type:hover {
    cursor: pointer;
}
#ifread .head .no_type.active {
    background-color: #c6e0ec;
    border-color: #c6e0ec;
    font-size: 16px;
    color: #000;        
}
#ifread .head i {
    float: right;
    margin: 15px 8px 15px 0;
    font-size: 18px;
    cursor: pointer;
    color: #5e6166;    
}
#ifread .read-content {
    height: 450px;
}
#ifread .read-content ul {
    width: 100%;
    height: 100%;
    overflow-y: scroll;    
    text-align: center;
}
#ifread .read-content .page-wrapper {
    width: 300px;
    height: 40px;
    line-height: 40px;
    border-radius: 3px;
    border: 0;
    font-size: 13px;
    margin: 20px auto;
    background-color: #008cee;
    color: #fff;   
    cursor: pointer;
}
#ifread .read-content .page-wrapper .next-page {
    background: inherit;
    color: #fff;
    font-size: 14px;    
    border: 0;
}
#ifread .read-content ul li {
    position: relative;
    height: 65px;
    line-height: 65px;
    padding: 8px 21px;    
    cursor: pointer;
}

#ifread .read-content ul li:hover {
    background-color: #dfedfa;
}
#ifread .read-content .icon-wrapper {
    position: absolute;
    top: 50%;
    margin-top: -22.5px;
    left: 25px;
    width: 45px;
    height: 45px;
    border-radius: 50%;        
}
#ifread .read-content .icon-wrapper img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
}
#ifread .read-content .name-wrapper {
    position: absolute;
    height: 49px;
    line-height: 49px;    
    top: 50%;
    margin-top: -24.5px;
    left: 86px;
    font-size: 14px;
}
#ifread .read-content .info-wrapper {
    position: absolute;
    width: 170px;
    height: 49px;
    top: 50%;
    left: 157px;
    margin-top: -24.5px;    
    color: #999;
}
#ifread .read-content .info-wrapper .dep {
    height: 20px;
    line-height: 20px;
    position: absolute;
    top: 5px;
    left: 0;    
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;    
}
#ifread .read-content .info-wrapper .position {
    height: 20px;
    line-height: 20px;
    position: absolute;
    top: 25px;
    left: 0;     
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;    
}
#ifread .read-content .type {
    position: absolute;
    width: 62px;
    height: 49px;
    line-height: 49px;
    top: 50%;
    margin-top: -24.5px;
    left: 300px;
    color: #999;
}
</style>