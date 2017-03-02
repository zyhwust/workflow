<template>
    <div class="work-content">
    	<ul>
    		<li v-for="item in items" v-link="item.link" @click="getPrag">
    			<div class="work-icon">
    				<span class="{{item.icon}}"></span>
    			</div>    			
    			<span>{{item.name}}</span>
				<!--<div class="hide" :class="{'wpush': undealFlow[item.msgname] > 0}">-->
				<div class="hide">
					<!--<span>{{undealFlow[item.msgname]}}</span>-->
					<span></span>
				</div>
    		</li>
    	</ul>
    </div>
    <router-view></router-view>
</template>
<script>
	export default{
		data(){
			return {
				items:[
					{
						name:'通知',
						icon:'fa fa-bell-o fa-2x',
						link:'/main/work/notify',
						// wpush是否有新消息
						msgname: "msg_workin	g_notice"
					},
					{
						name:'流程',
						icon:'fa fa-pencil-square-o fa-2x',
						link:'/main/work/workFlow', 
						// wpush是否有新消息
						msgname: "msg_working_flow"
					},
					{
						name:'任务',
						icon:'fa fa-file-text-o fa-2x',
						link:'/main/work/task',
						// wpush是否有新消息
						msgname: "msg_working_task"
					},
					{
						name:'会议',
						icon:'fa fa-gavel fa-2x',
						link:'/main/work/conference',
						// wpush是否有新消息
						msgname: "msg_working_meeting"
					}
				],
				
				// undealFlow: window.unDealFlow
			}
		},
		methods:{
			getPrag:function() {
				var vm = this;
				//登陆获取sid
				$.ajax({
					type:'post',
					url:BASE.JFurl+'/Jflow/2001.do',
					//contentType:"application/json",				
					data:{
			    		userId:localStorage.userId,
			    	},
					"success":function(data){
						var rst = JSON.parse(data);
						if(rst.code == 1){
							localStorage.sid = rst.data.sid;
						}else{
							tools.toast(rst.msg, 'error');
						}
					},
					"error":function(){
						tools.toast('网络错误', 'error');
					}					
				});
			}
		}
	}
</script>
<style scoped>
	.work-content{
		min-width:200px;
		border-right: 1px solid #dddcdd;
		background-color: white;
		overflow: auto;
	}
	.work-icon{
		width: 35px;
		height: 30px;
		border-radius: 5px;
		background-color: #ffb734;
		margin: 9px 10px 9px auto;
		float: left;
		text-align: center;
		line-height: 38px;
		color:white;
	}
	.work-content ul{
		list-style: none;
	}
	.work-content ul li{
		position: relative;	
		vertical-align: middle;
		padding-left: 10px;
		height: 50px;
		line-height: 50px;
	}
	.work-content ul li span:nth-child(2){
		font-size: 14px;
	}
	.work-content ul li.v-link-active{
		background-color: #cce4f7;
		color: #008cee;
	}
	.work-content li:first-child .work-icon{
		background-color: #49cdf4;
	}
	.work-content li:nth-child(2) .work-icon {
		background-color: #17e25f;
	}
	.work-content li:nth-child(3) .work-icon {
		background-color: #f8664e;
	}
	.work-content li:last-child .work-icon {
		background-color: #f0b548;
	}
	.work-content .hide {
		display: none;
	}
	/*wpush提示红点样式*/
	.work-content .hide.wpush {
		display: block;
		position: absolute;
		bottom: 34px;
		right: 149px;
		width: 14px;
		height: 14px;
		line-height: 14px;
		background-color: red;
		border-radius: 50%;    
		text-align: center;
	}
	.work-content .wpush span {
		display: block;
		height: 14px;
		line-height: 14px;
		width: 15px;
		font-size: 12px;
		color: #fff;
		text-align: center;
		transform: scale(0.9);
	}
</style>