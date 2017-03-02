<template>
	<div class="detail-content" v-if="items.hasData">
		<table>
			<thead>
				<tr>
					<td>任务名</td>
					<td>任务类型</td>
					<td>优先级</td>
					<td>截止日期</td>
					<td>完成时间</td>
					<td>状态</td>
				</tr>
			</thead>
			<tbody>
				<tr v-for="item in items.data" v-link="#" @click="showDetail($index)" :style="{color:item.status ? '' : item.priorityColor}">
					<td>
						<span title="{{item.title}}">{{item.title}}</span>
					</td>
					<td>
						<span>{{item.type}}</span>
					</td>
					<td>
						<span>{{item.priorityName}}</span>
					</td>
					<td>
						<span>{{item.deadline}}</span>
					</td>
					<td>
						<span>{{item.finishTime}}</span>
					</td>
					<td>
						<span :class="{'status-color':item.listStatus=='未完成'}">{{item.listStatus}}</span>
					</td>
				</tr>
			</tbody>
		</table>
		<!-- 分页 -->		
		<div class="task-paging">
			<button class="next" @click="prePage">上一页</button>
			<p class="page-num"><span id="current_page">1</span>/<span id="total_page">{{total}}</span></p>
			<button class="next" @click="nextPage">下一页</button>
		</div>
	</div>
	
	<div class="page-cover" @click="closeDetail" v-if="isOpen"></div>
	<!-- 侧边栏 -->
	<div class="slideright">
      <div class="slider-header"> 
	      <span>任务详情</span>
	      <span class="slider-close fa fa-times" @click="closeDetail"></span>
      </div>
      <!-- 任务状态 -->
      <div class="task-status" :class="{'taskstatus':statusTxt=='未完成'}">{{statusTxt}} {{detail.finishTime}}</div>
      <div class="slider-body">
        <div class="task-detail">
            <div class="detail-head">
	          	<img :src="userIcon" onerror="this.src = BASE.url+'/upload/avatar/1.png'"/>
	          	<div class="">
		          	<span>{{name}}</span>
		          	<span>{{creatDep}}</span>
	          	</div>
	          	<div class="clear-float"></div>
         	</div>
            <div class="detail-message">        	
	          	<span class="detail-label"><p>任务名：</p>{{detail.title}}</span>
	          	<span class="detail-label"><p>任务内容：</p>{{detail.content}}</span>
	          	<span class="detail-label"><p>任务优先级：</p>{{detail.priorityName}}</span>
	          	<span class="detail-label"><p>任务描述：</p>{{detail.descri}}</span>
	          	<span class="detail-label"><p>负责人：</p>{{detail.headUserName}}</span>
	          	<span class="detail-label"><p>负责人电话：</p>{{detail.headUserTelephone}}</span>
	          	<span class="detail-label"><p>任务成员：</p>{{membersName}}</span>
	          	<span class="detail-label"><p>完成时间：</p>{{detail.finishTime}}</span>
	          	<span class="detail-label"><p>截止日期：</p>{{detail.deadline}}</span>
            </div>
            <!-- 附件 -->
            <div class="sub-task">
	          	<div class="subtask-head">
	          		<div class="title-wrap"><span>附件({{filelist.length}})</span></div>	          		
				    <div class="clear-float"></div>
	          	</div>
	          	<ul>
            		<li class="file-lists" v-for="appendix in filelist">    				
	    				<span class="fa fa-file-text-o fa-2x file-icon"></span>
                        <div class="filename-wrap">
                            <span class="files-name">{{appendix.fileName}}</span>
                            <a class="issue-content" download href="{{URL}}{{appendix.fileRealPath}}">下载</a>
                        </div>	    				
	    			</li>
            	</ul>
	        </div>            
	        <div class="sub-task">
	          	<div class="subtask-head">
	          		<div class="title-wrap"><span>子任务({{subtasks.length}})</span></div>
	          		<div class="add-subtask" @click="addSubtask">
			    		<span class="fa fa-pencil-square-o"></span>
			    		<span>添加子任务</span>   
				    </div>
				    <div class="clear-float"></div>
	          	</div>
	          	<ul>
	          		<li class="subtask-list" v-for="item in subtasks" @click="showSubtaskDetail($index)">
	          			<span>{{item.title}}</span>
	          			<span class="{{item.status? 'fa fa-check-circle subtask-status':''}}"></span>
	          		</li>
	          	</ul>
	        </div>
	        <!-- 评论 -->	    	
    		<div class="reply-wrapper">
				<p class="reply-title-wrapper">
					<span class="reply-title">&nbsp;&nbsp;评论({{(reply != null && reply.length > 0) ? reply.length : 0 }})</span> 
				</p>
				<div class="reply-content-wapper">
					<div class="reply-input-wrapper">
						<img class="reply-user-icon item" :src="userPicture" alt="" onerror="this.src = BASE.url + '/upload/avatar/1.png'"	>
						<textarea class="reply-input item" name="" rows="1" id="reply_text" @keydown.enter="sendReply" v-model="reply_content" @keydown="resizeTextarea" @change="resizeTextarea"></textarea>
						<button class="reply-btn item" @click="sendReply">评论</button>
					</div>
					<div class="reply-content">
						<ul class="reply-list">
							<li class="reply-item" v-show="reply != null && reply.length > 0" v-for="item in reply">
								<img class="reply-user-icon wrapper" :src="item.picture" alt="" onerror="this.src = BASE.url + '/upload/avatar/1.png'">
								<div class="wrapper div-wrapper">
									<p class="text"><span class="name">{{item.userRealname}}</span> <span v-show="item.toUserName != ''">回复</span> <span></span>：<span class="reply">{{item.content}}</span></p>
									<p class="time">{{item.createTime}}</p>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div> 
        </div>       
    	<div class="start-examine">
    		<button class="cancel-btn" @click="finish">{{hasFinished? "改为未完成" : "完成"}}</button>
    		<button class="cancel-btn" @click="modify">修改任务</button>
    	</div>
        
      </div>
    </div>
   	<!--弹出确认框-->
    <div class="task-confirm" v-if="comDisplay">
    	<div class="confirm-head">
    		<span class="fa fa-times" @click="closeComment"></span>
    	</div> 
    	<div class="confirm-body">   	
    		<span class="confirm-content">确认修改任务状态</span>
    	</div>
    	<div class="confirm-foot">
    		<button class="send-btn" @click="ensure">确定</button>
    		<button class="send-btn" @click="cancel">取消</button>
    	</div>    	
    </div>
    <!--弹出任务类型-->
    <div class="flow-wrap" v-if="showType">
    	<div class="header">
    		<span>选择任务</span>
    		<span class="fa fa-times close-wrap" @click="closeType"></span>
    	</div>
    	<ul>
    		<li class="start-li" v-for="type in types" @click="edit($index)">{{type.name}}</li>
    	</ul>  	
    </div>
	<!-- 发布任务 -->
	<div class="task-edit" v-if="isPublish">
	    <div class="header">
    		<span>{{taskName}}</span>
    		<span class="fa fa-times close-wrap" @click="closePublish"></span>
    	</div>
	    <!-- 任务表单 -->
	    <div class="editTask-body">
	    	<form  method="post" id="uploadfile" enctype="mulipart/form-data">
	    	<div class="task-form">
	    		<div class="task-input">
	    			<label class="task-input-label">任务名称</label>
	    			<input class="input-line" type="text" v-model="taskTitle">
	    		</div>
	    		<div class="task-input">
	    			<label class="task-input-label">任务内容</label>
	    			<textarea class="input-area" v-model="taskContent" placeholder="输入任务详情"></textarea>
	    		</div>	    		
	    		<div class="task-input">
	    			<label class="task-input-label">优先级</label>	    			
	    			<select v-model="priorityId">
						<option selected v-for="item in priority" v-bind:value="item.id">{{item.name}}</option>
					</select>		
	    		</div>
	    		<div class="task-input">
	    			<label class="task-input-label">截止时间</label>	    			
	    			<input class="input-line" type="date" v-model="taskTimeline">
	    		</div>
	    		<div class="task-input">
	    			<label class="task-input-label">选择成员</label>
	    			<textarea class="input-area show-party" v-model="taskUsers" @click="choiceMembers" readonly="readonly" placeholder="点击选择成员"></textarea>	    		
	    		</div>
	    		<div class="task-input">
	    			<label class="task-input-label">负责人员</label>	    			
	    			<select v-model="choice">
						<option v-for="option in options" v-bind:value="option.userId" selected>{{option.userRealname}}</option>
					</select>		
	    		</div>
	    		<div class="task-input">
	    			<label class="task-input-label">任务描述</label>	    			
	    			<textarea class="input-area" v-model="taskDesc" placeholder="输入任务描述"></textarea>
	    		</div>	    		
	    		<div class="task-input">
	    			<label class="task-input-label">任务来源</label>	    			
	    			<input class="input-line" type="text" v-model="taskSource">    		
	    		</div>

	    		<div class="task-input">
	    			<label class="task-input-label">附件</label>
	    			<input type="file" id="file" @change="uploadOneByone" name="uploadFile" multiple class="upload-file">
	    			<input type="button" onclick="file.click()" id="upButton" value="点击上传文件"/>   	
	    		</div>
	    		<div id='fileList'>
	    			<ul>
	    				<li class="files-list" v-for="file in files">
	    					<span class="fa fa-file-text-o fa-2x upfile-icon"></span>
	    					<span>{{file.name}}</span>
	    				</li>
	    			</ul>
	    		</div>
	    		<div class="clear-float"></div>
	    	</div>
	    	</form>
			<div class="task-sub">						
				<button class="task-btn" @click="subTask">提交</button>
			</div>	    		
	    </div>
	</div>
	<!-- 修改任务 -->
	<div class="task-edit" v-if="modifyTask">
	    <div class="header">
    		<span>修改任务</span>
    		<span class="fa fa-times close-wrap" @click="closeModify"></span>
    	</div>
	    <!-- 任务表单 -->
	    <div class="editTask-body">
	    	<form  method="post" id="uploadfile" enctype="mulipart/form-data">
	    	<div class="task-form">
	    		<div class="task-input">
	    			<label class="task-input-label">任务名称</label>
	    			<input class="input-line" type="text" v-model="taskTitle">
	    		</div>
	    		<div class="task-input">
	    			<label class="task-input-label">任务内容</label>
	    			<textarea class="input-area" v-model="taskContent" placeholder="输入任务详情"></textarea>
	    		</div>
	    		<div class="task-input">
	    			<label class="task-input-label">任务类型</label>	    			
	    			<select v-model="taskTypeId">
						<option v-for="option in types" v-bind:value="option.id">{{option.name}}</option>
					</select>		
	    		</div>
	    		<div class="task-input">
	    			<label class="task-input-label">优先级</label>	    			
	    			<select v-model="priorityId">
						<option v-for="item in priority" v-bind:value="item.id">{{item.name}}</option>
					</select>		
	    		</div>
	    		<div class="task-input">
	    			<label class="task-input-label">截止时间</label>	    			
	    			<input class="input-line" type="date" v-model="taskTimeline">
	    		</div>
	    		<div class="task-input">
	    			<label class="task-input-label">选择成员</label>
	    			<textarea class="input-area show-party" v-model="taskUsers" @click="choiceMembers" readonly="readonly" placeholder="点击选择成员"></textarea>	    		
	    		</div>
	    		<div class="task-input">
	    			<label class="task-input-label">负责人员</label>	    			
	    			<select v-model="choice">
						<option v-for="option in options" v-bind:value="option.userId">{{option.userRealname||option.userName}}</option>
					</select>		
	    		</div>
	    		<div class="task-input">
	    			<label class="task-input-label">任务描述</label>	    			
	    			<textarea class="input-area" v-model="taskDesc" placeholder="输入任务描述"></textarea>
	    		</div>	

	    		<div class="task-input">
	    			<label class="task-input-label">附件</label>
	    			<input type="file" id="file" @change="uploadOneByone" name="uploadFile" multiple class="upload-file">
	    			<input type="button" onclick="file.click()" id="upButton" value="点击上传文件"/>   	
	    		</div>
	    		<div id='fileList'>
	    			<ul>
	    				<li class="files-list" v-for="file in files">
	    					<span class="fa fa-file-text-o fa-2x upfile-icon"></span>
	    					<span>{{file.name}}</span>
	    				</li>
	    			</ul>
	    		</div>
	    		<div class="clear-float"></div>    		
	    		<!-- <div class="task-input">
	    			<label class="task-input-label">任务来源</label>	    			
	    			<input class="input-line" type="text" v-model="taskSource">    		
	    		</div> -->
	    	</div>
	    	</form>
			<div class="task-sub">						
				<button class="task-btn" @click="subModify">提交</button>
			</div>	    		
	    </div>
	</div>
	<!-- 遮罩层 -->
	<div class="subtask-pagecover" v-if="showOverlay"></div>
</template>
<script>
	
	export default {   
    	props:['items','total'],
    	data(){
    		return{
    			userIcon:'',
    			id:'',//任务Id
    			detail:'', //任务详细内容
    			membersName:'', //任务成员
    			hasFinished:'', //任务是否完成    			
    			statusTxt:'', //审核的状态（文本显示）
    			isOpen:false,
    			name:'',
    			status:'', //状态码    		
    			comDisplay:false,  //确认框  
    			operateIndex:'', //表格索引		
    			pagingUrl:'', // 分页请求地址（区分收到/发布的任务列表）
    			page:1,//当前页数
    			subtasks:[
    				{
    					title:"测试",
    				},
    				{
    					title:"测试ce",
    				}
    			],
    			types:'',  //任务类型
    			showType:false,
    			isPublish:false,
    			showOverlay:false,
    			choice:'', //负责人id
    			options:'', //负责人下拉选项值
    			taskUsers:'',
    			usersId:[], //任务成员ID
    			canComplete:true,//确认子任务都完成，父任务才能完成
				reply:[], //评论
				// 用户头像
				userPicture: BASE.url+'/upload/avatar/'+localStorage.userId+'.png',
				// 回复的文本内容
				reply_content: '',
				priority:'',//优先级
				priorityId:'',//优先级Id
				toUserIds:'',//任务成员ID
				taskTypeId:'',//任务类型id（修改任务部分）
				modifyTask:false,//修改任务
				membersId:'',//参与人员id(任务详情里面的人员id)
				members:'',//参与人员信息（任务详情）
				taskTitle:'',//任务标题
				taskContent:'',//任务内容
				taskTimeline:'',
				taskDesc:'',
				taskSource:'',
				filesId:[],
				files:[],
				filelist:'',
				URL:BASE.url,
				creatDep:'',//任务创建人所属部门
    		}
    	},
    	methods:{
    		//显示具体任务的详细信息
    		showDetail:function(index){
    			var vm = this;
    			vm.clearDetailContent();
    			vm.isOpen = true;
    			vm.canComplete = true; //每次加载detail都初始化一次
    			vm.operateIndex = index;
    			// vm.name = vm.items.data[index].createUserName;    			
    			vm.userIcon = vm.items.data[index].userIcon;
    			vm.statusTxt = vm.items.data[index].listStatus;
    			vm.id = vm.items.data[index].id; 
    			  			
    			//获取任务详细信息  			 
    			var obj = {
    				url:'/home/task/1803.spring',
    				args:{
						id:vm.id
					},
					success:function(rst){
						vm.detail = rst.data;
						vm.filelist = rst.fileList;
						//XSS						
						for(var key in vm.detail){
							vm.detail[key] = encodeHtml(vm.detail[key]);
						}
						// 获取创建人信息
						vm.getCreaterInfo(vm.detail.createUserId);
						vm.name = vm.detail.createUserName; 
						var membersName = [];
						vm.membersId = [];
						vm.members = rst.member;
						var member = rst.member;
						for (var i = 0,len=member.length; i < len; i++) {
							membersName.push(member[i].userName);
							vm.membersId.push(member[i].userId);
						}
						vm.toUserIds = vm.membersId.join(',');
						vm.membersName = membersName.join('、');
						console.log(vm.membersName);
						if(vm.detail.status == '0'){
							vm.hasFinished = 0;
							vm.statusTxt = '未完成';
						}else{
							vm.hasFinished = 1;
							vm.statusTxt = '完成';
						}						
						vm.subtasks = rst.childTask;
						// 任务状态
						for (var i=0,len=vm.subtasks.length;i<len;i++) {
							//XSS
							for(var key in vm.subtasks[i]){
								vm.subtasks[i][key] = encodeHtml(vm.subtasks[i][key]);
							}
							vm.subtasks[i].userIcon = BASE.url+"/upload/avatar/"+vm.subtasks[i].createUserId+".png";
							if(vm.subtasks[i].status==1){
								vm.subtasks[i].listStatus="完成";
							}else{
								vm.canComplete = false; //有子任务未完成
								vm.subtasks[i].listStatus="未完成";
							}
						}
					},				
					asy:true
    			}
    			Ajax(obj);	
    			// 获取评论列表
				vm.getReply(vm.items.data[index].id);
    			$(".slideright").slideLeftShow();
    		},
    		// 获取评论列表
			getReply: function(id) {
				var vm = this;
				// 获取评论列表
				var obj2302 = {
					url: '/home/comment/2302.spring',
					args: {
						objectId: id,
						objectTable: 'task'
					},
					success: function(res) {
						vm.reply = res.data;

						if(vm.reply == null) {
							return;
						} 						
						vm.reply.reverse();
						for(let i = 0, len = vm.reply.length; i < len; i++) {
							vm.reply[i].picture = BASE.url+'/upload/avatar/'+vm.reply[i].userId+'.png';
							vm.reply[i].content = encodeHtml(vm.reply[i].content);
						}
					},
					asy: true
				}				
				Ajax(obj2302);
			},
    		//关闭侧边栏和遮照层
    		closeDetail:function(){

    			this.isOpen = false;
    			$(".slideright").slideLeftHide();
    		},   	
    		//改变任务状态
    		finish:function(){
    			var vm = this;   			
    			if(!vm.canComplete){
    				tools.toast("请先完成所有子任务",'error');
    			}else if(!(vm.detail.createUserId == localStorage.userId || vm.detail.headUserId == localStorage.userId)){
    				tools.toast("只有创建人和负责人能做此操作！","error");	
    			}else{
    				vm.$root.overlay.display = true;
    				vm.comDisplay = true;
    			}     			
    		},
    		//关闭弹出框和遮照层
    		closeComment:function(){
    			this.$root.overlay.display = false;
    			this.comDisplay = false;
    		},
    		// 确认改变任务状态
    		ensure:function(){
    			var vm = this;    			
    			var obj = {
    				url:'/home/task/1805.spring',
    				args:{
						id:vm.id,
						status:vm.hasFinished? 0 : 1
					},
					success:function(rst){				
						tools.toast(rst.msg,'success');
						if(vm.hasFinished){
							vm.statusTxt = '未完成';
							vm.hasFinished = 0;
							vm.detail.finishTime = '';
						}else{
							vm.statusTxt = '完成';
							vm.hasFinished = 1;							
						}	
						vm.$emit('finish',vm.page);
						//提示减1
         				getMsg('task'); 
					},
					error:function(rst){
						tools.toast(rst.msg,'error');
					},			
					asy:true
    			};
    			Ajax(obj);
    			vm.closeComment();
    		},
    		// 取消完成任务
    		cancel:function(){
    			var vm = this;
    			vm.closeComment();
    		},
    		// 发送评论
			sendReply: function(event) {
				if(event.keyCode == 13) {
					event.returnValue = false;
					event.preventDefault();
				}
				
				var vm = this;
				var reply = document.getElementById('reply_text');
				var reg = /(.+)/ig;
				if(vm.reply_content == '' || reg.test(vm.reply_content) === false) {
					tools.toast('请输入评论内容', 'error');
					reply.style.height = 'auto';
					return;
				}
				var reply_content = vm.reply_content;
				vm.reply_content = '';

				// 临时新增数据，增强用户体验
				if(vm.reply != null && vm.reply.length > 0) {
					var time = new Date();
					var y = time.getFullYear(),
						m = time.getMonth()+1,
						d = time.getDate(),
						h = time.getHours(),
						min = time.getMinutes(),
						s = time.getSeconds();
					var tmp_reply = {
						content: encodeHtml(reply_content),
						createTime: y + '-' + m + '-' + d + ' ' +h + ':' + m,
						picture: vm.userPicture,
						pid: 0,
						toUserId: 0,
						toUserName: '',
						userId: localStorage.userId,
						userRealname: localStorage.userName
					}
					vm.reply.unshift(tmp_reply);					
				}

				// 发送评论
				var obj2301 = {
					url: '/home/comment/2301.spring',
					args: {
						userId: localStorage.userId,
						userRealname: localStorage.userName, 
						toUserName: '', 
						toUserId: '',
						objectId: vm.id,
						objectTable: 'task',
						content: reply_content,
						pid: 0,
						// 发送通知的用户组
						toUserIds: vm.toUserIds
					},
					success: function(res) {
						vm.reply_content = '';
						var reply = document.getElementById('reply_text');
						reply.style.height = 'auto';
						vm.getReply(vm.id);
					},
					error: function() {
					},
					asy: true
				}				
				Ajax(obj2301);				

			},
			// 评论输入框textarea高度自适应
			resizeTextarea: function() {
				var vm = this;
				var reply = document.getElementById('reply_text');
				var reg = /(.+)/ig;
				if(reg.test(vm.reply_content) === false) {
					vm.reply_content = '';
					reply.style.height = '30px';
					return;
				}
				reply.style.height = 'auto';
				reply.style.height = reply.scrollHeight + 'px';
			},
    		// 上一页
    		prePage: function() {
    			var vm = this;
				var cur = parseInt($('#current_page').html());
				if(--cur <= 0) {
					tools.toast("已经是第一页","default");
					return false;
				}
				tools.busy();
				// 拉取收到的任务列表
				var obj = {
					url: vm.pagingUrl,
					args: {
						page: vm.page - 1,
						pageSize: BASE.pageSize,
						userId: localStorage.userId
					},
					success: function(rst) {
						tools.busy(false);						
						// getSuccess(rst);
						vm.items.data = rst.data;
						var DATA = vm.items.data;
						if(DATA.length>0){
							vm.items.hasData = true;
						}else{
							vm.items.hasData = false;
							tools.toast("没有更多数据", 'default');
						}
						// 任务状态
						for (var i=0,len=DATA.length;i<len;i++) {
							//防XSS
							for(var key in vm.items.data[i]){
								vm.items.data[i][key] = encodeHtml(vm.items.data[i][key]);
							}
							vm.items.data[i].userIcon = BASE.url+"/upload/avatar/"+localStorage.userId+".png";
							if(vm.items.data[i].status==1){
								vm.items.data[i].listStatus="完成";
							}else{
								vm.items.data[i].listStatus="未完成";
							}
						}	
						vm.total = rst.total;
						vm.page --;
						$('#current_page').html(vm.page);						
					},
					error: function() {
						tools.busy(false);
					},
					asy: false
				}
				Ajax(obj);				
			},
			// 下一页
    		nextPage: function() {
				var cur = parseInt($('#current_page').html()),
					total = parseInt($('#total_page').html());
				if(cur >= total) {
					tools.toast("已经是最后一页","default");
					return;
				}
				var vm = this;
				tools.busy();
				// 拉取收到的通知列表
				var obj = {
					url: vm.pagingUrl,
					args: {
						page: vm.page + 1,
						pageSize: BASE.pageSize,
						userId: localStorage.userId
					},
					success: function(rst) {
						tools.busy(false);
						vm.items.data = rst.data;
						var DATA = vm.items.data;
						if(DATA.length>0){
							vm.items.hasData = true;
						}else{
							vm.items.hasData = false;
							tools.toast("没有更多数据", 'default');
						}
						// 任务状态
						for (var i=0,len=DATA.length;i<len;i++) {
							//防XSS
							for(var key in vm.items.data[i]){
								vm.items.data[i][key] = encodeHtml(vm.items.data[i][key]);
							}
							vm.items.data[i].userIcon = BASE.url+"/upload/avatar/"+vm.items.data[i].createUserId+".png";
							if(vm.items.data[i].status==1){
								vm.items.data[i].listStatus="完成";
							}else{
								vm.items.data[i].listStatus="未完成";
							}
						}
						vm.total = rst.total;
						vm.page ++;
						$('#current_page').html(vm.page);
					},
					error: function() {
						tools.busy(false);
					},
					asy: false
				}
				Ajax(obj);				
			},
			addSubtask:function(){
				var vm = this;				
				if(vm.statusTxt == '完成'){
					tools.toast("任务已完成，无法添加子任务","error");
				}else if(!(vm.detail.createUserId == localStorage.userId || vm.detail.headUserId == localStorage.userId)){
    				tools.toast("只有创建人和负责人能做此操作！","error");	
    			}else{
					vm.showOverlay = true;
					vm.showType = true;
					vm.getPublish();
				}				
			},
			//显示具体子任务的详细信息
    		showSubDetail:function(index){
    			var vm = this;    			
    			vm.canComplete = true;
    			vm.operateIndex = index;    			 			
    			vm.userIcon = vm.subtasks[index].userIcon;
    			vm.statusTxt = vm.subtasks[index].listStatus;
    			vm.id = vm.subtasks[index].id;
    			//获取任务详细信息  			 
    			var obj = {
    				url:'/home/task/1803.spring',
    				args:{
						id:vm.id
					},
					success:function(rst){
						vm.detail = rst.data;
						vm.filelist = rst.fileList;
						//XSS
						for(var key in vm.detail){
							vm.detail[key] = encodeHtml(vm.detail[key]);
						}
						// 获取创建人信息
						vm.getCreaterInfo(vm.detail.createUserId);
						vm.name = vm.detail.createUserName;   
						var membersName = [];
						vm.membersId = [];
						vm.members = rst.member;
						var member = rst.member;
						for (var i = 0,len=member.length; i < len; i++) {
							membersName.push(member[i].userName);
							vm.membersId.push(member[i].userId);
						}
						vm.toUserIds = vm.membersId.join(',');
						vm.membersName = membersName.join('、');
						console.log(vm.membersName);
						if(vm.detail.status == '0'){
							vm.hasFinished = 0;
							vm.statusTxt = '未完成';
						}else{
							vm.hasFinished = 1;
							vm.statusTxt = '完成';
						}						
						vm.subtasks = rst.childTask;
						// 任务状态
						for (var i=0,len=vm.subtasks.length;i<len;i++) {
							//XSS
							for(var key in vm.subtasks[i]){
								vm.subtasks[i][key] = encodeHtml(vm.subtasks[i][key]);
							}
							vm.subtasks[i].userIcon = BASE.url+"/upload/avatar/"+vm.subtasks[i].createUserId+".png";
							if(vm.subtasks[i].status==1){
								vm.subtasks[i].listStatus="完成";
							}else{
								vm.canComplete = false; //有子任务未完成
								vm.subtasks[i].listStatus="未完成";
							}
						}
					},				
					asy:true
    			}
    			Ajax(obj);	
    			// 获取评论列表
				vm.getReply(vm.subtasks[index].id);
    			$(".slideright").slideLeftShow();
    		},
			// 查看子任务详情
			showSubtaskDetail:function(index){
				var vm = this;
				$(".slideright").slideLeftHide();
				vm.showSubDetail(index);				
			},
			getPublish:function(){
				var vm = this;			
				var obj = {
					url:'/home/task/1806.spring',
					args:{},
					success:function(rst){
						vm.types = rst.data;
					},				
					asy:true
				}
				Ajax(obj);
			},
			// 获取优先级列表
			getPriority:function(){
				var vm = this;			
				var obj = {
					url:'/home/task/1810.spring',
					args:{},
					success:function(rst){
						vm.priority = rst.data;
						//防XSS
						for (var i=0,len=vm.priority.length; i < len; i++) {
							for(var key in vm.priority[i]){
								vm.priority[i][key] = encodeHtml(vm.priority[i][key]);
							}
						}
					},				
					asy:true
				}
				Ajax(obj);
			},
			edit:function(index){
				var vm = this;
				vm.showType = false;
				vm.taskName = vm.types[index].name;
				vm.taskId = vm.types[index].id;
				vm.isPublish = true;
				this.getPriority();
			},
			closeType:function(){
				var vm = this;
				vm.showOverlay = false;
				vm.showType = false;
			},
			closePublish:function(){
				var vm = this;
				vm.showOverlay = false;
				vm.isPublish = false;
				vm.files = [];
				vm.filesId = [];
			},
			// 选择成员
			choiceMembers:function(){
				var vm = this;
				vm.$root.people.haveDepId = false;
				vm.$root.overlay.display = true;
				vm.$root.people.display = true;
				vm.$root.people.users = [];
				vm.taskUsers = '';
				vm.$root.people.success = function(){
					vm.$root.overlay.display = false;
					vm.$root.people.display = false;
					vm.options = vm.$root.people.users;
					// 取出users中的人员姓名，拼接成字符串
					var obj = vm.$root.people.users;
					var objName = [];
					for (var i=0,len=obj.length; i < len; i++) {
						objName[i] = obj[i].userRealname;
						vm.usersId[i] = obj[i].userId;
					}
					vm.taskUsers = objName.join("、");
					vm.$root.people.users = [];
				}
			},
			toDate:function(str){
				var sd=str.split("-");
    			return sd;
			},
			//上传附件，并显示
    		uploadOneByone:function(){
    			var vm = this;
    			tools.busy();
    			$('#uploadfile').ajaxForm();
				var options={
					url:BASE.url+"/home/files/2201.spring",
					type:"post",
					data:{
						userId:localStorage.userId
					},
					success:function(data){
						var rst = JSON.parse(data);
						if(rst.code==1) {
							vm.filesId.push(rst.data.filesList[0].fileId);
							console.log(vm.filesId);
							var fileObj = {
								name:$("#file").val().split("\\").pop(),
								trueName:rst.data.filesList[0].fileTrueName,
								realPath:rst.data.filesList[0].realPath
							};
							tools.busy(false);
							console.log(fileObj);
							vm.files.push(fileObj);
							console.log(vm.files);							
						}else {
							tools.busy(false);
							tools.toast("上传文件失败，请重新试传","error");	
						}
					},
					error:function(data){
						tools.busy(false);
						tools.toast("上传文件失败","error");
					},
					timeout: 20000
				};
				$("#uploadfile").ajaxSubmit(options);
    		},		
			// 发布子任务
			subTask:function(){
				var vm = this;
				if(vm.taskTitle==''){
					tools.toast("请填写任务名","error");
					return;
				}else if(vm.taskContent==''){
					tools.toast("请填写任务内容","error");
					return;
				}else if(vm.priorityId==''){
					tools.toast("请选择任务优先级","error");
					return;
				}else if(vm.taskTimeline==''){
					tools.toast("请填写截止日期","error");
					return;
				}else if(!vm.compareDate(vm.taskTimeline)){
					tools.toast("截至时间不能小于当前日期","error");
					return;
				}else if(vm.usersId==''){
					tools.toast("请选择人员","error");
					return;
				}else if(vm.choice==''){
					tools.toast("请选择负责人","error");
					return;
				}else if(vm.taskDesc==''){
					tools.toast("请填写任务描述","error");
					return;
				}
				$(".task-btn").attr('disabled', 'true');
				tools.busy();									
				var obj = {
					url:'/home/task/1804.spring',
					args:{
						title:vm.taskTitle,
						content:vm.taskContent,
						typeId:vm.taskId,
						deadline:vm.taskTimeline,
						member:vm.usersId,
						descri:vm.taskDesc,
						createUserId:localStorage.userId,
						headUserId:vm.choice,
						source:vm.taskSource,
						pTaskId:vm.id,
						priorityId:vm.priorityId,
						fileIds:vm.filesId,  //filepath
					},
					success:function(rst){
						tools.busy(false);
						tools.toast("发布成功","success");						
						vm.taskTitle = '';
						vm.taskContent = '';
						vm.choice = '';
						vm.taskTimeline = '';
						vm.usersId = [];
						vm.taskUsers = '',
						vm.taskDesc = '';
						vm.options = '';
						vm.priorityId = '';
						vm.files = [];
						vm.taskSource = localStorage.userName;
						vm.showOverlay = false;
						vm.isPublish = false;
						//刷新子任务列表
						var obj = {
		    				url:'/home/task/1803.spring',
		    				args:{
								id:vm.id
							},
							success:function(rst){
								vm.subtasks = rst.childTask;
								vm.filelist = rst.fileList;
								// 任务状态
								for (var i=0,len=vm.subtasks.length;i<len;i++) {
									vm.subtasks[i].userIcon = BASE.url+"/upload/avatar/"+vm.subtasks[i].createUserId+".png";
									if(vm.subtasks[i].status==1){
										vm.subtasks[i].listStatus="完成";
									}else{
										vm.subtasks[i].listStatus="未完成";
									}
								}
							},				
							asy:true
		    			}
		    			Ajax(obj);
					},
					error:function(rst){
						tools.busy(false);
						tools.toast(rst.msg,"error");
						$('.task-btn').removeAttr('disabled');
					},			
					asy:true
				};
				Ajax(obj);
			},
			// 清空detail中的所有内容
			clearDetailContent:function(){
				var vm = this;
				vm.statusTxt = '';
				vm.name = '';
				vm.detail = '';
				vm.membersName = '';
				vm.subtasks = '';
				vm.hasFinished = '';
				vm.reply = '';
			},
			modify:function(){
				var vm = this;				
				if(vm.statusTxt == '完成'){
					tools.toast("任务已完成，无法修改","default");
				}else if(vm.detail.createUserId != localStorage.userId){
					tools.toast("您没有修改任务的权限","default");
				}else{			
					vm.showOverlay = true;				
					vm.modifyTask = true;
					vm.getPriority();
					vm.getPublish();
					vm.taskTitle = vm.detail.title;
					vm.taskContent = vm.detail.content;					
					vm.taskTypeId = vm.detail.typeId
					vm.priorityId = vm.detail.priorityId;
					vm.taskTimeline = vm.detail.deadline;
					// 负责人id
					vm.choice = vm.detail.headUserId;
					// 负责人选项
					vm.options = vm.members;
					vm.taskDesc = vm.detail.descri;
					// 详情里面的参与人员ids。如果修改时点击选人，则vm.usersId被新的人员id覆盖
					vm.usersId = vm.membersId;
				}
			},
			closeModify:function(){
				var vm = this;
				vm.modifyTask = false;
				vm.showOverlay = false;
				vm.taskTitle = '';
				vm.taskContent = '';
				vm.choice = '';
				vm.taskTimeline = '';
				vm.usersId = [];
				vm.taskUsers = '',
				vm.taskDesc = '';
				vm.priorityId = '';
				vm.taskTypeId = '';
				vm.files = [];
				vm.filesId = [];
			},
			// 修改任务
			subModify:function(){
				var vm = this;
				if(vm.taskTitle==''){
					tools.toast("请填写任务名","error");
					return;
				}else if(vm.taskContent==''){
					tools.toast("请填写任务内容","error");
					return;
				}else if(vm.priorityId==''){
					tools.toast("请选择任务优先级","error");
					return;
				}else if(vm.taskTimeline==''){
					tools.toast("请填写截止日期","error");
					return;
				}else if(!vm.compareDate(vm.taskTimeline)){
					tools.toast("截至时间不能小于当前日期","error");
					return;
				}else if(vm.choice==''){
					tools.toast("请选择负责人","error");
					return;
				}else if(vm.taskDesc==''){
					tools.toast("请填写任务描述","error");
					return;
				}
				$(".task-btn").attr('disabled', 'true');
				tools.busy();									
				var obj = {
					url:'/home/task/1813.spring',
					args:{
						id:vm.id,
						title:vm.taskTitle,
						content:vm.taskContent,
						typeId:vm.taskTypeId,
						deadline:vm.taskTimeline,
						member:vm.usersId,
						descri:vm.taskDesc,
						headUserId:vm.choice,
						priorityId:vm.priorityId,
						toUsers:vm.usersId,
						fileIds:vm.filesId,  //filepath
					},
					success:function(rst){
						tools.busy(false);
						tools.toast("修改成功","success");	
						vm.$emit('finish',vm.page);					
						vm.taskTitle = '';
						vm.taskContent = '';
						vm.choice = '';
						vm.taskTimeline = '';
						vm.usersId = [];
						vm.taskUsers = '',
						vm.taskDesc = '';
						vm.options = '';
						vm.priorityId = '';
						vm.members = '';
						vm.membersId = '';
						vm.taskTypeId = '';
						vm.files = [];
						vm.filesId = [];
						vm.showOverlay = false;
						vm.modifyTask = false;
						//刷新任务详情
						var obj = {
		    				url:'/home/task/1803.spring',
		    				args:{
								id:vm.id
							},
							success:function(rst){
								vm.detail = rst.data;
								vm.filelist = rst.fileList;
								//XSS						
								for(var key in vm.detail){
									vm.detail[key] = encodeHtml(vm.detail[key]);
								}
								vm.name = vm.detail.createUserName; 
								var membersName = [];
								vm.membersId = [];
								vm.members = rst.member;
								var member = rst.member;
								for (var i = 0,len=member.length; i < len; i++) {
									membersName.push(member[i].userName);
									vm.membersId.push(member[i].userId);
								}
								vm.toUserIds = vm.membersId.join(',');
								vm.membersName = membersName.join('、');
								console.log(vm.membersName);
								if(vm.detail.status == '0'){
									vm.hasFinished = 0;
									vm.statusTxt = '未完成';
								}else{
									vm.hasFinished = 1;
									vm.statusTxt = '完成';
								}								
							},				
							asy:true
		    			}
		    			Ajax(obj);
					},
					error:function(rst){
						tools.busy(false);
						tools.toast(rst.msg,"error");
						$('.task-btn').removeAttr('disabled');
					},			
					asy:true
				};
				Ajax(obj);
			},	
			//获取任务创建人信息
			getCreaterInfo:function(id){
				var vm = this;
				var obj1001 = {
					url:'/home/user/1001.spring',
    				args:{
						userId:id
					},
					success:function(rst){
						vm.creatDep = rst.data.departmentName;
					},
					asy:true
				}
				Ajax(obj1001);
			},
			/* 
				[比较当前时间和截止时间]
			*/
			compareDate:function(time){
				var vm = this;
				var dateN = new Date();
				// var yearN = dateN.getFullYear();
				// var monthN = (dateN.getMonth()+1);
				// var dateN = dateN.getDate();
				var deadTime = vm.toDate(time);
				var	date = new Date(parseInt(deadTime[0]),parseInt(deadTime[1])-1,parseInt(deadTime[2]),23,59,59);
				if(dateN > date){
					return false
				}else{
					return true;
				}				
								
			}
    	},
    	ready(){
    		var vm = this;
    		var operate = localStorage.operateflag;
    		if(operate == 1){
    			// vm.hasFinished = 0;
    			vm.pagingUrl = '/home/task/1801.spring';
    		}else{
    			// vm.hasFinished = 1;
    			vm.pagingUrl = '/home/task/1802.spring';
    		}
    	}
  	}
</script>
<style scoped>
	ul{
		list-style: none;
	}
	.detail-content{
		margin-top: 10px;
		font-size: 15px;
	}
	table{
		border-spacing: 0;
		border-collapse: collapse;
		width: 95%;
		text-align: left;
	}	
    td{
    	/*padding-left: 10px;*/
    	width: 230px;
    }
    tbody tr td:nth-child(1) span{
    	width: 160px;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    display: block;
    }
    .status-color{
    	color: #FF8C00;
    }
    .detail-title{
    	height: 40px;
    }
	.user-img{
		width: 40px;
		height: 40px;
		vertical-align: middle;
		border-radius:50%;
	}
	.page-cover{
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		/*opacity: 0.5;*/
		/*background-color: #DFDDDD;*/
	}
	.slideright{
		width: 500px;
		display: none;
		position: absolute;
		bottom:0;
	    right:0;	    
	    height: calc(100% - 50px);
	    z-index: 3;
		box-shadow: rgba(0, 0, 0, 0.247059) 0px 7px 21px;
		background-color: white;
		font-size: 15px;
	}
	.slider-header{
		width: 100%;
		/*设定最小宽度，避免隐藏时元素自动换行*/
		min-width: 500px;
		line-height: 50px;
		height: 50px;
		padding-left: 10px;
		border-bottom: 1px solid #DFDDDD;
		text-align: center;
	}
	.slider-close{
		position: absolute;
		right: 10px;
		line-height: 50px;
		cursor: pointer;
	}
	.slider-body{
		min-width: 500px;
		overflow:auto;		
		height: calc(100% - 85px);
	}
	.task-detail{
		padding:10px;
	}
	.detail-head img{
		width: 50px;
		height: 50px;
		float: left;
		border-radius: 50%;
	}
	.detail-head span{
		margin-left: 60px;
		display: block;
		line-height: 25px;
	}	
	.sub-task{
		margin-top: 20px;	   
	}
	.subtask-head{	
	    padding-bottom: 10px;
		border-bottom: 1px solid #DFDDDD;
	}
	.title-wrap{
		border-left: 3px solid #FF8C00;
	    padding-left: 8px;
	    float: left;
	}
	.title-wrap span{
		color: #333;
    	font: normal 14px Arial,verdana,Hiragino Sans GB,"\5B8B\4F53",Microsoft Yaheim;
    	font-size: 14px;
	}
	.add-subtask{
		float: right;
	    background-color: #FF8C00;
	    color: white;
	    padding: 5px;
	    font-size: 13px;
	    cursor: pointer;
	}
	.clear-float{
		content: "";
		clear: both;
		width: 0;
		height: 0;
		display: block;
		visibility: hidden;
	}
	.subtask-list{
		height: 40px;
		line-height: 40px;
		border-bottom: 1px solid #DFDDDD;
		padding-left: 10px;
		color: gray;
	}
	.subtask-list:hover{
		background-color: #fcfcfc;
	}
	.subtask-status{
		font-size: 25px;
	    height: 40px;
	    line-height: 40px;
	    float: right;
	    color: #4f6af7;
	}
	.detail-label p{
		color: gray;
		display: inline;
	}	
	.task-status{
		border-top: 1px solid #DFDDDD;
	    height: 35px;
	    width: 100%;
	    line-height: 35px;
	    text-align: center;
	    font-size: 15px;
	    background-color: #34dcb5;
	    color: white;
	}
	.task-status.taskstatus{
		border-top: 1px solid #DFDDDD;
		height: 35px;
		width: 100%;
		line-height: 35px;
		text-align: center;
		font-size: 15px;
		background-color: #ab2e2e;
		color: white;
	}
	.start-examine{
		height: 50px;
	    line-height: 50px;
	    width: 350px;
	    position: absolute;
	    bottom: 0;
	    border-top: 1px solid #dfdddd;	    
	    background: aliceblue;
	}
	.cancel-btn{
		width: 100px;
	    height: 30px;
	    font-size: 15px;
	    margin-left: 10px;
	    background-color: #ffa933;
	}
	.task-confirm{
		width: 300px;
		height:200px;
		margin: 80px auto;
		position: absolute;
		top: 0;
		left:0;
		bottom: 0;
		right: 0;
		border:1px solid #DFDDDD;
		background-color: white;
		border-radius: 10px;
		text-align: center;
		z-index: 10;
	}
	.confirm-head{
		width: 100%;
		height: 40px;		
		line-height: 40px;
		border-bottom: 1px solid #DFDDDD;
	}
	.confirm-head span{
		float: right;
		color: #858e99;
		cursor: pointer;
		line-height: 40px;
		margin-right: 10px;	
		font-size: 16px;
	}
	.confirm-head span:after{
		content: "";
		clear: both;
		width: 0;
		height: 0;
		display: block;
		visibility: hidden;
	}
	.confirm-body{
		margin: 50px auto 40px auto;
		font-size: 16px;
	}	
	.confirm-foot{
		height: 50px;
		line-height: 50px;
		border-top: 1px solid #DFDDDD;
	}
	.send-btn{
		margin: auto;
	    border: none;
	    background-color: #FF8C00;
	    color: white;
	    width: 30%;	   
	    border-radius: 5px;
	}
	.send-btn:hover{
		background-color: #FF9615;
	}
	.task-paging{
		width: 100%;
		height: 50px;
		text-align: center;
		margin-top: 10px;
	}
	.next{
		display: inline-block;
	    width: 7%;
	    height: 38px;
	    background-color: #FF8C00;
	    color: #fff;
	    border: 0;
	    outline: 0;
	    font-size: 16px;
	}
	.next:hover{
		background-color: #FF9615;
	}
	.page-num{
		display: inline-block;
		width: 10%;
		font-size: 14px;
		color: #FF8C00;
	}
	/*添加任务部分*/
	.flow-wrap{
		width: 450px;
		height:400px;
		margin: 60px auto;
		position: absolute;
		top: 0;
		left:0;
		bottom: 0;
		right: 0;
		border:1px solid #DFDDDD;
		background-color: white;
		z-index: 4;
		box-shadow: 1px 1px 1px #8c8c8c;
	}
	.flow-wrap .header{
		height: 44px;
	    line-height: 44px;
	    padding: 0 10px;
	    border-bottom: 1px solid #DFDDDD;
	    font-size: 16px;
	}
	.close-wrap{
		float: right;
    	line-height: 44px;
    	color: #ddd8dd;
	}
	.start-li{
		border-bottom: 1px solid #DFDDDD;
	    height: 40px;
	    line-height: 40px;
	    padding-left: 10px;
	    font-size: 14px;
	}
	.start-li:hover{
		background-color: #fcfcfc;
	}
	.task-edit{
		width: 720px;
		/*height: 665px;*/
		margin: 52px auto 0px auto;
		position: absolute;
		top: 0;
		left:0;
		right: 0;
		border:1px solid #DFDDDD;
		background-color: white;
		z-index: 5;
		box-shadow: 1px 1px 1px #8c8c8c;
	}
	.task-edit .header{
		height: 44px;
	    line-height: 44px;
	    padding: 0 10px;
	    border-bottom: 1px solid #DFDDDD;
	    font-size: 14px;
	}
	.editTask-body{
		height: 560px;
		overflow: auto;
	}
	.task-form{
		width: 100%;
		padding-left: 30px;
	}
	.task-input{
		margin:10px auto;
	}
	.task-input select{
		width: 77%;
	    margin-right: 15px;
	    font-size: 15px;
	    height: 40px;
	    line-height: 30px;
	    padding-left: 8px;
	    padding-right: 8px;
	    border: 1px solid #e1e1e1;
	    border-radius: 4px;
	    background: #FFF;
	     border-radius: 3px;
	    font-size: 14px;
	}
	.show-party{
		color: blue;
	}
	.task-input-label{
		float: left;
		margin-right: 15px;
		font-size: 14px;
		text-align: right;
		width: 80px;
		margin-top: 10px;
	}
	
	.input-line{
		padding-left: 10px;
		height: 40px;
		width: 77%;
		border: 1px solid #ddd8dd;
		border-radius: 3px;
		font-size: 14px;
	}
	.input-area{
		width: 77%;
		height: 80px;
		border: 1px solid #ddd8dd;
		padding: 10px;
		border-radius: 3px;
		font-size: 14px;
		/*resize: none;*/
	}
	.task-sub {
		text-align: center;
		height: 50px;
	}
	.task-btn {
		width: 50%;
		height: 40px;
		border-radius: 5px;
		border:none;
		background-color:#FF8C00;
		color: white;
		font-size: 16px;
	}
	.task-btn:hover{
		background-color: #FF9615;
	}
	.subtask-pagecover{
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 3;
		opacity: 0.1;
		background-color: #000;
	}
	.reply-wrapper {
		margin-top: 17px;
	}
	.reply-wrapper .reply-content-wapper {
		padding: 20px;
		margin-top: 20px;
		background: #f2f4f7;
		border: 1px solid #e4e9ef;
	}
	.reply-wrapper .reply-content-wapper .reply-content {
		padding-left: 43px;
	}
	.reply-wrapper .reply-content-wapper .reply-input-wrapper:after {
		content: ' ';
		display: block;
		clear: both;
	}
	.reply-content-wapper .reply-input-wrapper .item {
		display: block;
		float: left;
		margin-right: 10px;
	}
	.reply-wrapper .reply-content-wapper .reply-user-icon {
		width: 32px;
		height: 32px;
		border-radius: 50%;		
	}
	.reply-wrapper .reply-content-wapper .reply-input {
		height: 30px;
		line-height: 22px;
		min-height: 22px;
		width: calc(100% - 132px);
		font-size: 13px;
		overflow: hidden;
		border: 0;
		padding: 4px;		
		resize: none;
		border: 1px solid #e4e9ef;
	}
	.reply-wrapper .reply-content-wapper .reply-btn {
		width: 60px;
		height: 32px;
		border: 0;
		background-color: #FF8C00;
		color: #fff;		
	}
	.reply-wrapper .reply-list:after {
		content: ' ';
		display: block;
		clear: both;
	}
	.reply-wrapper .reply-list .reply-item {
		height: 62px;
		padding: 10px;
		cursor: default;
	}
	.reply-wrapper .reply-list .reply-item:after {
		content: ' ';
		display: block;
		clear: both;
	} 	
	.reply-wrapper .reply-item .text {
		margin: 8px 0;
	}
	.reply-wrapper .reply-item .time {
		margin: 8px 0;
		color: #999;
	}	
	.reply-wrapper .reply-item .name {
		color: #ff7f00;
	}
	.reply-wrapper .reply-item .reply {
		color: #555;
		word-wrap: break-word;
		word-break: break-all;
	}
	.reply-wrapper .reply-list .wrapper {
		float: left;
		margin-right: 8px;
	
	}
	.reply-wrapper .reply-list .wrapper.div-wrapper {
		width: calc(100% - 66px);
		border-bottom: 0.5px solid #DFDFDF;	
	}
	.reply-wrapper .reply-title-wrapper {
		height: 20px;
		line-height: 20px;
		border-left: solid 3px #FF8C00;
		
	}
	.reply-wrapper .reply-title-wrapper .reply-title {
		color: #333;
		font: normal 14px Arial,verdana,Hiragino Sans GB,"\5B8B\4F53",Microsoft Yaheim;
	}	
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button{
	    -webkit-appearance: none !important;
	    margin: 0; 
	}
	.upload-file{
		display:none;
	}
	#upButton{
		border:1px solid #ccc; 
	    background:#fff; 
	    color:#ff8c00; 
	    padding:5px 15px;
		border-radius: 5px;
		height: 40px;
		cursor: pointer;
	}
	#fileList{
	    width: 77%;
	    margin-left: 95px;
	}
	#fileList li{
		float: left;
		margin:10px;
	}
	.upfile-icon{
		color: #9e9b9b;
	}
	.detail-files{
		padding-top: 10px;
	}
	.file-lists{
		margin-top: 10px;
	}	
	.file-icon{
		float: left;
		color: #909090;
		margin-right: 10px;
        font-size: 34px;
	}
	.issue-content{
        font-size: 10px;
        color: gray;
    }
	a:hover{
		color: #0033CC;
		text-decoration:underline;
	}
</style>
