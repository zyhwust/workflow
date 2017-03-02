<template>
	<!-- 消息列表 -->
	<div id="msgTable">
		<div id="groupsTab" v-bind:style="{display:isOpen}">
			<ul>
				<li  v-for="(index,item) in msg" v-on:click="notify1(index)" v-link="{path:'/chat/msg/chartContent1/'+item.name+'/'+item.roomId}">
					<div class="m-groups-imgs">
						<img class="m-msg-img" :src="item.img" v-on:error="getDefaultImg" :alt="item.name">
					</div>
					<div class="comments_info">
						<span class="comments_name">{{item.name}}</span>
						<div class="notify" v-bind:style="{opacity:item.color}"></div>
						<!--<span class="comments_desc">{{item.color}}</span>-->
					</div>
				</li>
				<li  v-for="(index,item) in items" v-on:click="notify(index)" v-link="{path:'/chat/msg/chartContent/'+item.name+'/'+item.roomId}">
					<div class="m-groups-imgs">
						<img v-for="i in members[index]" class="m-groups-img" :src="i.img" :alt="item.name" v-on:error="getDefaultImg">
					</div>
					<div class="comments_info">
				  		<span class="comments_name">{{item.name}}</span>
			  			<div class="notify" v-bind:style="{opacity:item.color}"></div>
				  		<!--<span class="comments_desc">{{item.color}}</span>-->
					</div>
			    </li>
			</ul>
		</div>
	</div>
	<router-view></router-view>
</template>
<script>
var groupId='';
export default{
	data: function () {
  		return {
			items:[],     //群组列表
			msg:[],       //消息列表
			members:[],
			color:'red',
			isOpen:'block',
  		}
	},
	route:{
	  data:function(transition){
		groupId = transition.to.params.id;
		if(groupId!=undefined){
		  this.isOpen = 'block';
		}
	  }
	},
	ready: function () {
	  	this.items = window.conversation;
	  	this.msg = window.msg;
		if(groupId!=undefined){
			$("#groups i").attr('class','fa fa-angle-down');
	  	}
	},
	watch:{
	  	'items': {
			handler: function (val, oldVal) {
			  	let that = this;
			  	var groupsid = '';
			  	// 生成请求环信id
			  	for(var i = 0 , len = that.items.length ; i < len ; i++) {
					let roomId = that.items[i].roomId;
					groupsid+= roomId;
					if(i< len-1) {
					  	groupsid+= ',';
					}
			  	}

			  	var obj1416 = {
					url: '/home/company/1416.spring',
					args: {
					  	groupId: groupsid,
					},
					success: function (res) {
				  		for(let i=0;i<that.items.length;i++){
							let affiliations = res.data.data[i].affiliations;
							let index;
							let nowId = res.data.data[i].id;
							for(let k=0;k<that.items.length;k++){
							  	if(that.items[k].roomId == nowId){
								index = k;
						  		}
							}
							let members = [];
							for(let j=0;j<affiliations.length;j++){
							  	if(j==4){
									break;
							  	}
							  	var name = affiliations[j].owner||affiliations[j].member;
							  	var img = BASE.url+"/upload/avatar/"+name+".png";
							  	members.push({name:name,img:img});
							}
							that.members.$set(index,members);
					  	}
					},
					asy: false
			  	}
			  	Ajax(obj1416);
			},
			deep: true
		},
	  	'msg': {
			handler: function (val, oldVal) {
			},
			deep: true
	  	}
	},
	methods:{
	  	notify(i){
			this.items[i].color = 0;
	  	},
	  	notify1(i){
			this.msg[i].color = 0;
	  	},
		getDefaultImg: function (event) {
		  	var target = event.target;
		  	target.src = BASE.url+'/MobileOA/src/assets/img/default.jpg';
		},
		init: function () {
	  	}
	}
}
</script>
<style>
	#msgTable{
	width: 263px;
	background: #fdfdfd;
	flex-shrink:0;
	flex-grow: 0;
	overflow: auto;
	border-right: 1px solid #dddcdd;
  }

	#msgTable .m-groups{
		text-align: left;
		font-size: 15px;
		line-height: 30px;
		border:none;
	  background: #ccc;
	  padding: 5px;
	  width: 100%;
	  border-bottom: 1px solid #dddcdd;
	  height: 50px;
	}
	#msgTable .m-basic{
		text-align: left;
		font-size: 15px;
		line-height: 30px;
		border:none;
		background: #f2f2f2;
		padding: 5px;
		width: 100%;
		border-bottom: 1px solid #dddcdd;
	}

	#groupsTab{
		display: none;
	}
	#basicTab{
		background-color: white;
		width: 300px;
		display: none;
	}
	#msgTable ul{
		list-style: none;
	}
	#msgTable ul li{
		background: #fdfdfd;
		padding: 5px;
		/*border-bottom:1px solid #dddcdd;*/
	}
	#msgTable ul li:hover{
		background-color: #f3f2f2;
		border-bottom: #aaa;
	}
	#msgTable ul li.v-link-active{
		background-color: #c8cbce;
    	color: #fff;
    	font-size: 16px;
	}
	#msgTable button:hover{
		background-color: #e5f0fa;
	}
  .m-groups-imgs{
	display: inline-block;
	width: 66px;
	height: 66px;
	margin: 0;
	padding: 0;
	border-radius: 50%;
  }
  .m-msg-img{
	border-radius: 50%;
	width: 50px;
	height: 50px;
	border: 0;
	margin: 1px;
	padding: 0;
	float: left;
  }
  .m-groups-imgs .m-groups-img{

	border-radius: 50%;
	width: 30px;
	height: 30px;
	border: 0;
	margin: 1px;
	padding: 0;
	float: left;
  }
  /*.m-groups_info{*/
	/*display: inline-block;*/
  /*}*/
  .notify{
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background-color: red;
  }
</style>
