<template>
    <div id="mo_contact">
        <ul class="sub-menu-tab">
        	<li class="sub-menu-item" :class="{'selected': tab.isOrgActive}" @click="showOrg" v-link="{name:'org'}">架构</li>
        	<li class="sub-menu-item" @click="showRela" :class="{'selected': tab.isRelaActive}" v-link="{name:'rela'}">群组</li>
        </ul>
        <ul id="mo_content">
        	<ul v-if="tab.isOrgActive">
            <div class="item-wrapper">
              <i class="fa fa-sitemap fa-2x i-org" aria-hidden="true"></i>
              <span class="company-title">{{companyName}}</span>
            </div>
            <!--<li v-for="item in items" v-link="{path: '/main/contact/dep/'+item.deptId+'/'+item.deptName}">-->
              <!--<div class="item-wrapper">-->
                <!--<div class="div-icon"> </div>-->
                <!--<span>{{item.deptName}}</span>-->
              <!--</div>-->
            <!--</li>-->
            <li v-for="(index, item) in types" v-on:click = "showSub(item.typeId,index)">
              <div class="item-wrapper">
                <div class="div-icon"> </div>
                <span>{{item.typeName}}</span>
              </div>
              <ul v-if="typeId == item.typeId" v-on:click = "seb(e)">
                <li v-for="(index, item) in children" v-on:click="checkSub(item.id,index)" v-link="{path: '/chat/contact/dep/'+item.id+'/'+item.name+'/'+typeId}">
                  <div class="item-wrapper">
                    <div class="div-sub-icon"> </div>
                    <span>{{item.name}}</span>
                    <mo_treeitem v-bind:model="model" v-bind:id="id" v-bind:itemid="item.id" v-bind:typeid="typeId"></mo_treeitem>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
          <li v-if="tab.isRelaActive">
            <div class="item-wrapper">
              <i class="fa fa-users fa-lg i-org" aria-hidden="true"></i>
              <span class="company-title">我的群组</span>
            </div>
          </li>
        </ul>
    </div>
    <router-view></router-view>
</template>
<script>
  import testData_Type from './testData.json';
  import mo_treeItem from './mo_treeItem.vue';


	export default {
		ready () {
//    测试数据
//      this.types = testData_Type;
      this.types = [];


			var vm = this;
			// $.ajax({
			// 	type:'post',
			// 	url: BASE.url+'/home/company/1301.spring',
			// 	contentType: 'application/json',
			// 	data:JSON.stringify({
			// 		"userId": localStorage.userId
			// 	}),
			// }).then(function(rst) {
			// 	if(rst.code!=1) {
			// 		alert(rst.msg);
			// 		return;
			// 	}
			// 	vm.companyName = rst.companyName ,
			// 	localStorage.companyName = rst.companyName;
			// 	vm.items = rst.data;
			// } , function() {alert('error');});

			var obj2 = {
				url: '/home/company/1301.spring',
				args: {
					"userId": localStorage.userId
				},
				success: function(rst) {
					vm.companyName = rst.companyName ,
					localStorage.companyName = rst.companyName;
					vm.items = rst.data;
				}
			}
			Ajax(obj2);

      //获取分类列表
      var obj = {
        url: '/home/user/1024.spring',
        args: {},
        success: function (res) {
          vm.types = res.data;
          //          vm.types = testData_Type;
        },
        asy: true
      }
      Ajax(obj);

		},
    components:{
      mo_treeitem:mo_treeItem,
    },
		data () {
			return {
				tab: {
					isOrgActive: true ,
					isRelaActive: false
				},
				companyName: '',
				items: [],

        types:[],
        typeId:0,
        children:[],
        id:0,
        model:[],
			}
		},
		methods: {
			// 切换企业架构视图
			showOrg () {
				this.tab.isOrgActive = true;
				this.tab.isRelaActive = false;
			},
			// 切换群组视图
			showRela () {
				this.tab.isRelaActive = true;
				this.tab.isOrgActive = false;
			},
      showSub (id,index) {
        if(this.typeId == id){
          this.typeId = 0;
        }else{
          this.typeId = id;
          this.children = this.types[index].data;
        }
      },
      seb (e){
        e = e || window.event;
        e.stopPropagation();
      },
      checkSub(id,index){

        if(this.id == id){
          this.id = 0;
        }else{
          this.id = id;
          this.model = this.children[index].children;
        }
      }
		}
	}




</script>
<style>
	body {
		font-size: 14px;
	}
	ul,li,ol{
		list-style: none;
	}
	#mo_contact {
		width: 360px;
		overflow: auto;
		border-right: 1px solid #e6e5e6;
		font-size: 14px;
	}
	#mo_content {
		overflow: auto;
	}
	.sub-menu-tab {
		overflow: hidden;
		border-bottom: 1px solid #dddcdd;
		color: #707275;
	}
	.sub-menu-item {
		position: relative;
		float: left;
		display: list-item;
		width: 50%;
		height: 50px;
		line-height: 50px;
		text-align: center;
		cursor: pointer;
		list-style: none;
	}
	.sub-menu-item.selected {
		color: #008cee;
		border-bottom: solid 2px #00a0e9;
	}
	.item-wrapper {
		padding: 10px 0 10px 27px;
	}
	.item-wrapper .company-title {
		color: #008cee;
	}
	#mo_contact .item-wrapper.selected {
		color: #008cee;
	}
	.i-org {
		margin-right: 10px;
	}
	.div-icon {
		float: left;
		width: 15px;
		height: 15px;
		margin: 0 13px;
		color: #e1e0e4;
		border-left: solid 1px #e1e0e4;
		border-bottom: solid 1px #e1e0e4;
	}
  .div-sub-icon {
    float: left;
    width: 15px;
    height: 15px;
    margin: 0 13px 0 40px;
    color: #e1e0e4;
    border-left: solid 1px #e1e0e4;
    border-bottom: solid 1px #e1e0e4;
  }
	#mo_contact ul li.v-link-active{
	    color: #008cee;
	}
</style>
