<template>
    <div id="mo_rela">
        <div class="content-head">
        	<p class="head-title">我的群组</p>
        </div>
        <ul class="company-title">
        	<li>
        		<span>我的群组</span>
        	</li>
        </ul>
        <ul class="company-content">
        	<li class="list-item" v-for="item in items" v-on:click="checkMsg(item.groupid)" v-link="{path:'/chat/msg/chartContent/'+item.groupname+'/'+item.groupid}">
        		<div class="group-icon">
        			<div class="index index{{index_l}}" v-for="(index_l , list) in item.members">
        				<img :src=list.userPicture alt onerror="this.src = BASE.url + '/upload/avatar/1.png'">
        			</div>
        		</div>
        		<div>
        			<div class="info">
        				<p>{{item.groupname}}</p>
        			</div>
        			<div class="info">
        				<p class="total">{{item.affiliations_count}}人</p>
        			</div>
        		</div>
        	</li>
        </ul>
    </div>
</template>
<script>
	export default {
		ready () {
			this.getChatGroups();
		},
		data () {
			return {
				items: []
			}
		},
		methods: {
      //更新会话列表
      checkMsg:function(roomId){
        console.log(roomId);
        var flag = window.conversation.some(function (item) {
          if(item.roomId == roomId){
            return true;
          }else{return false;}
        })
        if(!flag){
          var item = window.friends.filter(function (item) {
            if(item.roomId == roomId){
              return true;
            }else{return false;}
          });
          item = item[0];
          item.img = "./static/hx_sdk/img/demo.jpg";
          item.color = 0;
          window.conversation.unshift(item);
        }
      },
			// 获取群组列表
			getChatGroups: function() {
				var vm = this ,
					url = 'https://a1.easemob.com/516881172/mo/users/'+localStorage.userId+'/joined_chatgroups';
				var obj1415 = {
					url: '/home/company/1415.spring',
					args: {
						username: localStorage.userId
					},
					success: function(data) {
						vm.items = data.data.data;
						// 获取群组详细信息
						var groupsid = '';
						// 生成请求环信id
						for(var i = 0 , len = vm.items.length ; i < len ; i++) {
							groupsid+= vm.items[i].groupid;
							if(i< len-1) {
								groupsid+= ',';
							}
						}
						// 请求环信群组详情接口
						var obj1416 = {
							url: '/home/company/1416.spring',
							asy: false,
							args: {
								groupId: groupsid,

							},
							success: function(data) {
								var rst = data.data;
								// 数据处理
								for(var i = 0 , len = vm.items.length ; i < len ; i++) {
									for(var k = 0 ,lenk = rst.data.length; k< lenk; k++) {
										if(vm.items[i].groupid == rst.data[k].id) {
											vm.items[i].members = rst.data[k].affiliations;
											vm.items[i].affiliations_count = rst.data[k].affiliations_count;
										}
									}
									// 成员设置头像
									for(var j = 0 , lent = vm.items[i].members.length; j < lent ; j++) {
										if(j == 4) {
											break;
										}
										var user = vm.items[i].members[j].member || vm.items[i].members[j].owner;
										vm.items[i].members[j].userPicture = BASE.url+'/upload/avatar/'+user+'.png';
										(vm.items[i].members.length > 4) && (vm.items[i].members.length = 4);
									}
								}
							}
						}
						Ajax(obj1416);
					}
				}
				Ajax(obj1415);
			}
		}
	}
</script>
<style>
	a {
		display: block;
	}
	#mo_rela {
		width: 80%;
		border-right: 1px solid #e6e5e6;
		overflow: auto;
		font-size: 14px;
		border-bottom-right-radius: 5px;
	}
	#mo_rela .content-head {
		height: 51px;
		line-height: 51px;
		text-align: left;
		border-bottom: 1px solid #dddcdd;
		color: #707275;
	}
	#mo_rela .content-head .head-title {
		float: left;
	    margin-left: 19px;
	    max-width: 60%;
	    color: #000000;
	}
	#mo_rela .company-title {
		margin-top: 19px;
		margin-left: 19px;
		color: #707275;
	}
	#mo_rela .company-content {
		margin-top: 10px;
	}
	#mo_rela .company-content .list-item {
		padding: 12px 21px 6px 21px;
	}
	#mo_rela .company-content .list-item:hover{
		background-color: #dfedfa;
	}
	.company-content .list-item .info {
		margin-top: 1px;
		margin-bottom: 8px;
	}
	.list-item .info .total {
		color: #7d7d7e;
	}
	#mo_rela .group-icon {
		float: left;
		position: relative;
		width: 45px;
		height: 45px;
		margin-right: 15px;
	}
	#mo_rela .group-icon .index {
		position: absolute;
		width: 22.5px;
		height: 22.5px;
	}
	#mo_rela .group-icon .index img{
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	#mo_rela .group-icon .index0 {
		top: 0;
		left: 0;
	}
	#mo_rela .group-icon .index1 {
		top: 0;
		right: 0;
	}
	#mo_rela .group-icon .index2 {
		bottom: 0;
		left: 0;
	}
	#mo_rela .group-icon .index3 {
		bottom: 0;
		right: 0;
	}
</style>
