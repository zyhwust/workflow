<template>
    <div class="meeting-content" v-if="showDiv.meeting">
    	<!-- 导航 -->
	    <div class="header">
		    <div class="flow-head">
	    		<span>{{meetingTypeName}}</span>    
		    </div>
		    <div class="apply-flow" @click="applyMeeting" v-if="showCreatBtn">
	    		<span class="fa fa-pencil-square-o"></span>
	    		<span>创建会议</span>   
		    </div>
	    </div>	   

	    <div class="meeting-body">
	    	<!-- 会议列表 -->
	    	<div class="meeting-list" v-if="tab.choiceOne||tab.choiceTwo">
	    		<div v-if="items.hasData">
			    	<table>
						<thead>
							<tr>
								<td>会议名称</td>
								<td>开始时间</td>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in items.data" v-link="#" @click="showDetail($index)">
								<td>
									<span title="{{item.title}}">{{item.title}}</span>
								</td>
								<td>
									<span>{{item.startTime}}</span>
								</td>
							</tr>
						</tbody>
					</table>
			    	<!-- 分页 -->		
					<div class="task-paging">
						<button class="next" @click="prePage">上一页</button>
						<p class="page-num"><span id="current_page">{{page}}</span>/<span id="total_page">{{total}}</span></p>
						<button class="next" @click="nextPage">下一页</button>
					</div>	
				</div>    		
	    	</div>
	    		    	    	
	    </div>
	</div>
	<!-- 新建会议 -->
	<div class="meeting-content" v-if="tab.choiceThree">
    	<div class="header">		    		
	    	<div class="meeting-goback"  @click="back">
	    		<span class="fa fa-angle-left fa-1g goback-btn"></span>
		    	<span>返回</span>
		    </div>
	    </div>
	    <div class="meeting-body">
		<!-- 表单 -->
		<form  method="post" id="uploadfile" enctype="mulipart/form-data">
    	<div class="meeting-form">
    		<div class="meeting-input">
    			<label class="meeting-input-label">会议名称</label>
    			<input class="input-line" type="text" v-model="meetingTitle" placeholder="输入会议名称">
    		</div>
    		<div class="meeting-input">
    			<label class="meeting-input-label">会议内容</label>
    				<textarea class="input-area" v-model="meetingContent" placeholder="输入会议详情"></textarea>
    		</div>
    		<div class="meeting-input">
    			<label class="meeting-input-label">开始时间</label>	    			
    			<input class="input-date" id="timePick" type="date" v-model="meetingStartTime">
    			<input class="input-time" type="time" v-model="meetingStartTime2">    		
    		</div>
    		<div class="meeting-input">
    			<label class="meeting-input-label">参会成员</label>	
    			<textarea class="input-area" v-model="meetingUsers" @click="choiceMembers" readonly="readonly" placeholder="点击选择成员"></textarea>  			
    			    		
    		</div>
    		<!-- <div class="meeting-input">
    			<label class="meeting-input-label">会议类型</label>	    			
    			<select class="issues-wrap1" v-model="choice">
					<option v-for="type in types" v-bind:value="type.id" selected>{{type.name}}</option>
				</select>		
    		</div> -->
    		<div class="meeting-input" v-if="issuesForm">
    			<label class="meeting-input-label">议题</label>	    			
    			<select class="issues-wrap2" v-model="issueId" multiple>
    				<option value="">请选择</option>
					<option v-for="issue in issues" v-bind:value="issue.id">{{issue.content}}</option>
				</select>		
    		</div>	    		
    		<div class="meeting-input">
    			<label class="meeting-input-label">会议地址</label>	    			
    			<input class="input-line" type="text" v-model="meetingAddress" placeholder="输入会议地址">    		
    		</div>
    		<div class="meeting-input">
    			<label class="meeting-input-label file-label">附件</label>
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
	    	<div class="meeting-sub">						
				<button class="meeting-btn" id="subForm" @click="addmeeting">提交</button>
			</div>
		</div>	
	</div>
	<!-- 会议详情 -->
	<div class="meeting-content" v-if="showDiv.detail">
	 	<div class="header">
	    	<div class="meeting-goback"  @click="goback">
	    		<span class="fa fa-angle-left fa-1g goback-btn"></span>
		    	<span>会议详情</span>
		    </div>
	    </div>
	    <!-- 会议内容 -->
	    <div class="meeting-body">
		    <div class="meeting-detail">
		    	<div class="detail-head">
		    		<span>{{meetingDetail.title}}</span>
		    	</div>
		    	<div class="detail-body">
		    		<span class="detail-label">会议内容：<span class="detail-content">{{meetingDetail.content}}</span></span>
		    		<span class="detail-label">参会人员：<span class="meeting-party">{{partys}}</span></span>
		    		<div class="time-place">
			    		<span class="detail-time-label">时间：<span class="meeting-start-time">{{meetingDetail.startTime}}</span></span>
			    		<span class="detail-time-label">地点：<span class="meeting-place">{{meetingDetail.address}}</span></span>
		    		</div>
		    	</div>	    	
		    </div>
		    <!-- 会议纪要 -->
		    <div class="meeting-detail">
		    	<div class="detail-head">
		    		<span>会议纪要</span>
		    	</div>
		    	<div class="detail-body">
		    		<span class="detail-label"><span id="meetingTag" class="detail-content"></span></span>
		    	</div>	    	
		    </div>
		    <!-- 会议任务 -->
	    	<div class="meeting-detail">
	    		<div class="detail-head">
		    		<span>参会议题列表</span>
		    	</div>
	    		<ul>
	    			<li class="issue-lists" v-for="subject in meetingDetail.taskList" @click="showIssueDetail($index)">
	    			<!-- <li class="issue-lists" @click="showIssueDetail($index)"> -->
		    			<span class="detail-label mouse-over">{{subject.title}}</span>
		    			<!-- <span class="detail-label">任务内容：<span class="detail-content">{{subject.content}}</span></span>
		    			<span class="detail-time-label">时间：<span class="meeting-start-time">{{subject.createTime}}</span></span>
		    			<span class="detail-label">状态：<span class="detail-content">{{subject.status?'完成':'未完成'}}</span></span> -->
	    			</li>
	    		</ul>
	    	</div>
	    	<!-- 附件 -->
	    	<div class="meeting-detail">
	    		<div class="detail-head">
		    		<span>附件</span>
		    	</div>
	    		<ul>
	    			<li class="file-lists" v-for="appendix in meetingDetail.fileList">
	    				<a class="issue-content" download href="{{Url}}{{appendix.path}}"><span class="fa fa-file-text-o fa-2x file-icon"></span>{{appendix.name}}</a>
	    			</li>
	    		</ul>
	    	</div>
	    	<!-- 会议评论 -->	    	
    		<div class="reply-wrapper">
				<p class="reply-title-wrapper">
					<span class="reply-title">&nbsp;&nbsp;评论({{(detail.reply != null && detail.reply.length > 0) ? detail.reply.length : 0 }})</span> 
				</p>
				<div class="reply-content-wapper">
					<div class="reply-input-wrapper">
						<img class="reply-user-icon item" :src="userPicture" alt="" onerror="this.src = BASE.url + '/upload/avatar/1.png'"	>
						<textarea class="reply-input item" name="" rows="1" id="reply_text" @keydown.enter="sendReply" v-model="reply_content" @keydown="resizeTextarea" @change="resizeTextarea"></textarea>
						<button class="reply-btn item" @click="sendReply">评论</button>
					</div>
					<div class="reply-content">
						<ul class="reply-list">
							<li class="reply-item" v-show="detail.reply != null && detail.reply.length > 0" v-for="item in detail.reply">
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
		    	
	    	<!-- 操作按钮 -->
	    	<div class="oper-btn">
	    		<div class="task-paging">
					<button class="opr-btn" id="endBtn" @click="finishMeeting">结束会议</button>
					<button class="opr-btn" @click="uploadSummary">会议纪要</button>
				</div>
	    	</div>
    	</div>
	</div>
	<!-- 会议纪要 -->
    <div class="meeting-note" v-if="comDisplay">
   		<div class="header">
    		<span>会议纪要</span>
    		<span class="fa fa-times close-wrap" @click="closeComment"></span>
    	</div>
		<textarea id="noteTextarea" class="note-textarea" placeholder="填写会议纪要..." v-model="commentText"></textarea>
    	<div class="btn-group">
    		<button class="send-btn" @click="submit">提交</button>
    	</div>    	
    </div>	
    <!--弹出确认框-->
    <div class="task-confirm" v-if="alertbox">
    	<div class="confirm-head">
    		<span class="fa fa-times" @click="closeAlert"></span>
    	</div> 
    	<div class="confirm-body">   	
    		<span class="confirm-content">是否确认会议结束</span>
    	</div>
    	<div class="confirm-foot">
    		<button class="send-btn" @click="ensure">确定</button>
    		<button class="send-btn" @click="cancel">取消</button>
    	</div>   
    </div>
    <!-- 会议议题详情 -->
    <div class="meeting-note" v-if="issueDisplay">
   		<div class="header">
    		<span>{{issueTitle}}</span>
    		<span class="fa fa-times close-wrap" @click="closeIssue"></span>
    	</div>
    	<div class="issue-detail">
    		<dl>
	    		<dt>议题标题</dt><dd>{{issueDetail[0]}}</dd>
	    		<dt>内容</dt><dd>{{issueDetail[1]}}</dd>
	    		<dt>申请人科室</dt><dd>{{issueDetail[2]}}</dd>
	    		<dt>文件</dt>
	    		<dd>
	    			<p  v-for="item in issueFiles"><a class="issue-content" download href="{{Url}}{{item}}">{{item.split('/').pop()}}</a></p>
	    		</dd>
    		</dl>
    	</div>		 	
    </div>
    <!--会议类型弹出框-->
    <div class="task-confirm" v-if="alertMeetType">
    	<div class="confirm-head">
    		<span class="fa fa-times" @click="closeMeetType"></span>
    	</div> 
    	<ul class="type-lists">
    		<li class="start-li" v-for="type in types" @click="edit($index)">{{type.name}}</li>
    	</ul>    	  
    </div>	
    <!-- 遮罩层 -->
	<div class="page-cover" v-if="isOpen"></div>
</template>
<script>
	var filesId = [];
	export default {
		data () {
			return {	
				isOpen:false,			
				showDiv:{
					meeting:true,
					detail:false,
				},
				tab:{
					choiceOne:false,
					choiceTwo:false,
					choiceThree:false,									
				},				
				items:{
					hasData:true,
					data:[]
				},  //会议列表
				types:[],	//会议类型选项
				page:1,	
				meetingTitle:'',						
				meetingContent:'',
				meetingStartTime:'', //日期
				meetingStartTime2:'', //时间					
				meetingAddress:'',
				meetingUsers:'', //任务成员名称
				usersId:'', //任务成员ID				
				issues:'', //议题选项
				issueId:'', //议题ID
				choice:'', // 会议类型ID
				/*会议详情*/
				meetingDetail:{  
					title:'',
					content:'',
					startTime:'',
					address:'',
					status:'',
					tag:'无会议纪要',
					userId:'',
					userName:'',
					userList:[],  //参会人员					
					fileList:[], //附件
					taskList:[],  //任务
				},
				partys:'' , //返回参会人员姓名
				comDisplay:false,
				meetingSub:'', //会议id  
				commentText:'',  //会议纪要
				status:'', //会议状态码
				total:1, //总页数
				alertbox:false, //弹出框
				undealFlow: window.unDealFlow,
				files:[],   //文件列表
				Url:BASE.url,
				meetingTypeName:'',
				listIndex:'', //记录索引值
				tag:'无会议纪要',  //会议纪要
				detail:{
					reply:[], //评论
				},
				// 用户头像
				userPicture: BASE.url+'/upload/avatar/'+localStorage.userId+'.png',
				// 回复的文本内容
				reply_content: '',
				taskid:[], //完成任务需要的任务id
				showCreatBtn:true,
				toUserIds:'',
				issueDisplay:false,//议题
				issueTitle:'',
				issueDetail:'',
				issueFiles:'',//议题文件
				alertMeetType:false,//会议类型弹出框
				issuesForm:true,//是否显示议题表单
				meetingTypeId:'',//存储会议类型id
			}
		},
		route:{
		    data:function(transition){
		      	var vm = this;
		        var meetingType = transition.to.params.type;
		        if(meetingType == 'undone'){
		        	vm.showCreatBtn = true;
		        	vm.meetingTypeName = '未完成的会议';
		          	vm.showTwo();
		          	vm.goback();
		        }else if (meetingType == 'finish') {
		        	vm.showCreatBtn = false;
		        	vm.meetingTypeName = '已结束的会议';
		          	vm.showOne(1);
		          	vm.goback();
		        }
		    }
	    },
		methods: {	
			// 点击结束会议
			finishMeeting:function(){
				var vm = this;
				if(localStorage.userId == vm.meetingDetail.userId)	{
					vm.alertbox = true;
					vm.isOpen = true;  
				}else{
					tools.toast("权限不够，只有创建者有权限处理！","error");
	    			return;
				}			
			},
			applyMeeting:function(){
				var vm = this;
				vm.alertMeetType = true;
				vm.isOpen = true;
				// 请求会议类型列表
				var obj = {
					url:'/home/meeting/1906.spring',
					args:{
						userId:localStorage.userId
					},
					success:function(rst){
						vm.types = rst.data;

					},				
					asy:true
				};
				Ajax(obj);

				// var jsNode = document.getElementsByTagName("body")[0];
				// var element = document.createElement("script");
				// element.src = './static/datetimepicker/jquery-ui.js';
				// jsNode.appendChild(element);
				// var element = document.createElement("script");
				// element.src = './static/datetimepicker/jquery-ui-slide.min.js';
				// jsNode.appendChild(element);
				// var element = document.createElement("script");
				// element.src = './static/datetimepicker/jquery-ui-timepicker-addon.js';
				// jsNode.appendChild(element);
				// var cssNode = document.getElementsByTagName("head")[0];
				// var element = document.createElement("link");
				// element.href = './static/datetimepicker/jquery-ui.css';
				// cssNode.appendChild(element);
				// $("#timePick").timepicker();
			},
			edit:function(index){
				var vm = this;
				vm.meetingTypeId = this.types[index].id;
				vm.closeMeetType();
				if(this.types[index].id == 2){//若选择了院办会议					
					// 请求议题列表
					var obj = {
						url:'/home/task/1808.spring',
						args:{},
						success:function(rst){
							vm.issues = rst.data;						
						},				
						asy:true
					};
					Ajax(obj);
					vm.issuesForm = true;//显示议题表单
					vm.showThree();
				}else{
					vm.issuesForm = false;//不显示议题表单
					vm.showThree();
				}
			},
			closeMeetType:function(){
				var vm = this;
				vm.alertMeetType = false;
				vm.isOpen = false;
			},
			//关闭弹出框
			closeAlert:function(){
				var vm = this;
				vm.alertbox = false;
				vm.isOpen = false;
			},
			//确认结束会议
			ensure:function(){
				var vm = this;				
				var obj = {
    				url:'/home/meeting/1902.spring',
    				args:{
    					meetingId:vm.meetingSub,
    				},
    				success:function(rst){
    					//议题任务生成会议时，议题任务完成
    					if(vm.taskid != ''){
	    					var obj1809 = {
			    				url:'/home/task/1809.spring',
			    				args:{
			    					ids:vm.taskid
			    				},
			    				success:function(rst){
			    				},
			    				error:function(){
			    				},
			    				asy:true
			    			};
			    			Ajax(obj1809);
		    			}
		    			tools.toast(rst.msg,"success");
    					//提示减1
         				getMsg('meeting');
         				vm.goback();
         				vm.items.data.$remove(vm.items.data[vm.listIndex]); 					
    				},
    				error:function(){
    					tools.toast(rst.msg,"error");
    				},
    				asy:true
    			};
    			Ajax(obj);
    			vm.closeAlert();
			},
			cancel:function(){
				var vm = this;
    			vm.closeAlert();
			},
			uploadSummary:function(){
				var vm = this;
				if(localStorage.userId == vm.meetingDetail.userId)	{
					if('tag' in vm.meetingDetail){							
						this.commentText = vm.meetingDetail.tag;
					}				
					this.isOpen = true;
	    			this.comDisplay = true;
	    		}else{
	    			tools.toast("权限不够，只有创建者有权限处理！","error");
	    			return;
	    		}
			},
			//关闭输入框和遮照层
    		closeComment:function(){
    			this.isOpen = false;
    			this.comDisplay = false;
    			this.commentText = '';
    		},
    		//上传会议纪要
    		submit:function(){
    			var vm = this;
    			if(vm.commentText == ''){
    				tools.toast("请填写后再提交","error");
    				return;
    			}
    			var obj = {
    				url:'/home/meeting/1905.spring',
    				args:{
    					meetingId:vm.meetingSub,
    					tag:vm.commentText,
    				},
    				success:function(rst){
    					var tagText = document.querySelector('#meetingTag');
						var temp = vm.commentText.replace(/\r\n|\n/g, '<br/>');
						tagText.innerHTML = temp;
    					vm.closeComment();
    				},
    				error:function(){
    					vm.closeComment();
    				},
    				asy:true
    			};
    			Ajax(obj);
    			
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
							filesId.push(rst.data.filesList[0].fileId);
							console.log(filesId);
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
							$('#subForm').removeAttr('disabled');
						}
					},
					error:function(data){
						tools.busy(false);
						tools.toast("上传文件失败","error");
						$('#subForm').removeAttr('disabled');
					},
					timeout: 20000
				};
				$("#uploadfile").ajaxSubmit(options);
    		},
    		toDate:function(str){
				var sd=str.split("-");
    			return sd;
			},
			timeToDate:function(str){
				var sd=str.split(":");
    			return sd;
			},
			// 提交会议表单			
			addmeeting:function(){
				var vm = this;				
				console.log(vm.meetingStartTime+' '+vm.meetingStartTime2);
				console.log(filesId);
				var filesIdList = filesId.join(",");
				console.log(filesIdList);
				if(vm.meetingTitle==''){
					tools.toast("请填写会议标题","error");
					return;
				}else if(vm.meetingContent==''){
					tools.toast("请填写会议内容","error");
					return;
				}else if(vm.meetingStartTime==''){
					tools.toast("请填写开始日期","error");
					return;
				}else if(vm.meetingStartTime2==''){
					tools.toast("请填写开始时间","error");
					return;
				}else if(!vm.compareDate(vm.meetingStartTime,vm.meetingStartTime2)){
					tools.toast("开始时间不能小于当前时间","error");
					return;
				}else if(vm.meetingUsers==''){
					tools.toast("请选择人员","error");
					return;
				}else if(vm.meetingAddress==''){
					tools.toast("请填写开会地址","error");
					return;
				}
				if(vm.issueId instanceof Array){
					if (vm.issueId[0] == '') {
						vm.issueId.shift();
					}
		            vm.issueId = vm.issueId.join(',');
		        }
		        console.log(vm.issueId);

		        $(".meeting-btn").attr('disabled', 'true');	
		        var dateTime = 	vm.meetingStartTime+' '+vm.meetingStartTime2;
		        var formArgs = '';
		        if(vm.meetingTypeId == 2){
		        	formArgs = {
		        		title:vm.meetingTitle,
						content:vm.meetingContent,
						userId:localStorage.userId,
						startTime:dateTime,
						taskIds:vm.issueId,
						type:vm.meetingTypeId,
						address:vm.meetingAddress,
						fileIds:filesIdList,  //filepath
						userIds:vm.usersId
		        	}
		        }else{
		        	formArgs = {
		        		title:vm.meetingTitle,
						content:vm.meetingContent,
						userId:localStorage.userId,
						startTime:dateTime,
						// taskIds:vm.issueId,
						type:vm.meetingTypeId,
						address:vm.meetingAddress,
						fileIds:filesIdList,  //filepath
						userIds:vm.usersId
		        	}
		        }
		        	
		        tools.busy();			
				var obj = {
					url:'/home/meeting/1901.spring',
					args:formArgs,
					success:function(rst){
						tools.busy(false);
						tools.toast(rst.msg,"success");	
						filesIdList = '';						
						vm.back();
						vm.showTwo();
					},
					error:function(rst){
						tools.busy(false);
						tools.toast(rst.msg,"error");
						$('.meeting-btn').removeAttr('disabled');
					},			
					asy:true
				};
				Ajax(obj);				
			},
			// 选择参会人员
			choiceMembers:function(){
				var vm = this;
				vm.$root.people.haveDepId = false;
				vm.$root.overlay.display = true;
				vm.$root.people.display = true;
				vm.$root.people.users = [];
				vm.meetingUsers = '';
				vm.$root.people.success = function(){
					vm.$root.overlay.display = false;
					vm.$root.people.display = false;
					// 取出users中的人员姓名，拼接成字符串
					var obj = vm.$root.people.users;
					var objName = [];
					var objId = [];
					for (var i=0,len=obj.length; i < len; i++) {
						objName[i] = obj[i].userRealname;
						objId[i] = obj[i].userId;
					}
					// 是否选择了自己						
					if(!vm.in_array(localStorage.userId,objId)){
						//没有 则插入创建人ID和姓名
						objId.push(localStorage.userId);
						objName.push(localStorage.userName);
					}
					vm.meetingUsers = objName.join(",");
					vm.usersId = objId.join(",");
					vm.$root.people.users = [];
				}
			},
			//判断数组中是否包含某个值
			in_array:function(needle, haystack) {
			  	var i = 0, n = haystack.length;
			  	for (;i < n;++i){
			    	if (haystack[i] == needle)
			      		return true;
				}
			  	return false;
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
				if(vm.detail.reply != null && vm.detail.reply.length > 0) {
					var time = new Date();
					var y = time.getFullYear(),
						m = time.getMonth()+1,
						d = time.getDate(),
						h = time.getHours(),
						min = time.getMinutes(),
						s = time.getSeconds();
					var tmp_reply = {
						content: encodeHtml(reply_content),
						createTime: y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s,
						picture: vm.userPicture,
						pid: 0,
						toUserId: 0,
						toUserName: '',
						userId: localStorage.userId,
						userRealname: vm.username
					}
					vm.detail.reply.unshift(tmp_reply);					
				}
				// 发送评论
				var obj2301 = {
					url: '/home/comment/2301.spring',
					args: {
						userId: localStorage.userId,
						userRealname: localStorage.userName,
						toUserName: '',
						toUserId: '',
						objectId: vm.meetingSub,
						objectTable: 'meeting',
						content: reply_content,
						pid: 0,
						// 发送通知的用户组
						toUserIds: vm.toUserIds
					},
					success: function(res) {
						vm.reply_content = '';
						var reply = document.getElementById('reply_text');
						reply.style.height = 'auto';
						vm.getReply(vm.meetingSub);
						tools.busy(false);
					},
					error: function() {
						tools.busy(false);
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
			// 获取已经结束的会议列表
			showOne:function () {
				for(var key in this.tab){
					if(this.tab[key]==true){
						this.tab[key]=false;
					}
				}
				this.tab.choiceOne = true;
				tools.busy();
				var vm = this;
				vm.page = 1;
				vm.status = 1;
				var obj = {
					url:'/home/meeting/1903.spring',
					args:{
						userId:localStorage.userId,
						status:1,
						rows:BASE.pageSize,
						page:1,
					},
					success:function(rst){
						tools.busy(false);
						vm.items.data = rst.data;						
						var DATA = vm.items.data;
						if(DATA == null){
							vm.items.hasData = false;
							tools.toast("无数据", 'default');
						}else{
							//防XSS
							for (var i=0,len=vm.items.data.meetingInfo.length; i < len; i++) {
								for(var key in vm.items.data.meetingInfo[i]){
									vm.items.data.meetingInfo[i][key] = encodeHtml(vm.items.data.meetingInfo[i][key]);
								}
							}
							vm.items.data = rst.data.meetingInfo;
							vm.items.hasData = true;
							vm.total = rst.data.totalPages;
						}
					},
					error: function() {
						tools.busy(false);
					},			
					asy:true
				};
				Ajax(obj);
			},
			// 获取未完成的会议列表
			showTwo:function () {
				var vm = this;
				vm.page = 1;
				for(var key in vm.tab){
					if(vm.tab[key]==true){
						vm.tab[key]=false;
					}
				}				
				vm.tab.choiceTwo = true;
				tools.busy();
				var vm = this;
				vm.status = 0;
				var obj = {
					url:'/home/meeting/1903.spring',
					args:{
						userId:localStorage.userId,
						status:0,
						rows:BASE.pageSize,
						page:1,
					},
					success:function(rst){
						tools.busy(false);
						vm.items.data = rst.data;
						var DATA = vm.items.data;
						if(DATA == null){
							vm.items.hasData = false;
							tools.toast("无数据", 'default');
						}else{
							//防XSS
							for (var i=0,len=vm.items.data.meetingInfo.length; i < len; i++) {
								for(var key in vm.items.data.meetingInfo[i]){
									vm.items.data.meetingInfo[i][key] = encodeHtml(vm.items.data.meetingInfo[i][key]);
								}
							}
							vm.items.data = rst.data.meetingInfo;
							vm.items.hasData = true;
							vm.total = rst.data.totalPages;
						}
					},	
					error: function() {
						tools.busy(false);
					},			
					asy:true			
				};
				Ajax(obj);	
			},
			// 显示新建会议表单
			showThree:function () {
				var vm = this;					
				vm.showDiv.meeting = false;			
				vm.tab.choiceThree = true;					
			},
			// 从表单页面返回时清空表单数据
			clearFormDate:function(){
				var vm = this;
				vm.meetingTitle = '';
				vm.meetingContent = '';
				vm.issueId = '';
				vm.meetingStartTime = '';
				vm.meetingStartTime2 = '';
				vm.$root.people.users = '';
				vm.usersId = '';
				vm.meetingAddress = '';				
				vm.meetingUsers = '';
				vm.files.length = 0;
				filesId = [];
			},
			back:function(){
				var vm = this;
				vm.tab.choiceThree = false;
				vm.showDiv.meeting = true;
				vm.clearFormDate();
			},
			// 从详情页面返回
			goback:function(){
				//返回的时候清空数据
				var vm = this;
				vm.meetingDetail = '';
				vm.partys = '';
				vm.tag = '';
				vm.showDiv.meeting = true;				
				vm.showDiv.detail = false;
			},
			// 会议详情
			showDetail:function(index){
				var vm = this;
				vm.meetingSub = vm.items.data[index].id;
				vm.showDiv.meeting = false;
				vm.showDiv.detail = true;
				vm.listIndex = index;
				tools.busy();
				var obj = {
					url:'/home/meeting/1904.spring',
					args:{
						meetingId:vm.items.data[index].id
					},
					success:function(rst){
						tools.busy(false);
						vm.meetingDetail = rst.data;
						// 防XSS
						for(var key in vm.meetingDetail){
							vm.meetingDetail[key] = encodeHtml(vm.meetingDetail[key]);
						}

						if('tag' in vm.meetingDetail){							
							// 处理文本中的换行符
							var tagText = document.querySelector('#meetingTag');
							var temp = vm.meetingDetail.tag.replace(/\r\n|\n/g, '<br/>');
							tagText.innerHTML = temp;
						}else{
							$('#meetingTag').text('');
						}						
						var userObj = vm.meetingDetail.userList;
						var len = userObj.length;
						var partysName = [];
						if(vm.meetingDetail.status == 1){
							$("#endBtn").attr('disabled' , 'disabled');
							$("#endBtn").css({
								'background-color':'gray',
							})
						}else{
							$("#endBtn").removeAttr('disabled');
						}
						var membersId = [];
						for (var i = 0; i < len; i++) {
							partysName[i] = userObj[i].userName;
							membersId[i] = userObj[i].id;
						}
						vm.partys = partysName.join("、");
						vm.toUserIds = membersId.join(",");
						// 获取taskid,并生成数组
						var tasks = vm.meetingDetail.taskList;
						var tasklen = tasks.length;
						if(tasklen>0){
							for (var i = 0; i < tasklen; i++) {
								vm.taskid[i] = tasks[i].taskId;
								// 防XSS
								for(var key in tasks[i]){
									 tasks[i][key] = encodeHtml(tasks[i][key]);
								}
							}
						}else{
							vm.taskid = '';
						}
					},
					error: function() {
						tools.busy(false);
					},
					asy:true,
				};
				Ajax(obj);
				// 获取评论列表
				vm.getReply(vm.items.data[index].id);
			},
			// 获取评论列表
			getReply: function(id) {
				var vm = this;
				// 获取评论列表
				var obj2302 = {
					url: '/home/comment/2302.spring',
					args: {
						objectId: id,
						objectTable: 'meeting'
					},
					success: function(res) {
						vm.detail.reply = res.data;
						if(vm.detail.reply == null) {
							return;
						} 						
						vm.detail.reply.reverse();
						for(let i = 0, len = vm.detail.reply.length; i < len; i++) {
							vm.detail.reply[i].picture = BASE.url+'/upload/avatar/'+vm.detail.reply[i].userId+'.png';
							vm.detail.reply[i].content = encodeHtml(vm.detail.reply[i].content);
						}
					},
					asy: true
				}				
				Ajax(obj2302);
			},
			// 显示议题详情
			showIssueDetail:function(index){
				var vm = this;
				vm.issueTitle = vm.meetingDetail.taskList[index].title,
				vm.isOpen = true;
				vm.issueDisplay = true;
				var obj = {
					url:'/admin/workflowform/2505.spring',
					args:{
						formId: '20',
                		form_ins_id: vm.meetingDetail.taskList[index].issueId,
					},
					success:function(rst){
						var detailArray = rst.data[0].item_value_list;
						var tempArr = [];						
						$(detailArray).each(function(i, item){							
							tempArr[i] = item.item_value;
							if (i == 3) {
								item.item_value = $.parseJSON(item.item_value);
								vm.issueFiles = item.item_value;							
							}else{
								//防XSS
								item.item_value = encodeHtml(item.item_value);
							}							
						})
						vm.issueDetail = tempArr;												
					},
					error: function() {
						tools.toast("数据加载失败","error");
					},
					asy:true,
				};
				Ajax(obj);				
			},
			// 关闭议题
			closeIssue:function(){
				var vm = this;
				vm.isOpen = false;
				vm.issueDisplay = false;
			},
			// 上一页
			prePage:function(){
				var vm = this;
				var cur = parseInt($('#current_page').html());
				if(--cur <= 0) {
					tools.toast("已经是第一页","default");
					return false;
				}
				tools.busy();				
				// 拉取收到的会议列表
				var obj = {
					url:'/home/meeting/1903.spring',
					args: {
						userId:localStorage.userId,
						status:vm.status,
						rows:BASE.pageSize,
						page:vm.page-1,
					},
					success: function(rst) {	
						tools.busy(false);					
						vm.items.data = rst.data;
						var DATA = vm.items.data;
						if(DATA == null){
							vm.items.hasData = false;
							tools.toast("无数据", 'default');
						}else{
							//防XSS
							for (var i=0,len=vm.items.data.meetingInfo.length; i < len; i++) {
								for(var key in vm.items.data.meetingInfo[i]){
									vm.items.data.meetingInfo[i][key] = encodeHtml(vm.items.data.meetingInfo[i][key]);
								}
							}
							vm.items.data = rst.data.meetingInfo;
							vm.items.hasData = true;
							vm.total = rst.data.totalPages;
						}
						vm.page--;
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
				// 拉取收到的会议列表
				var obj = {
					url: '/home/meeting/1903.spring',
					args: {
						userId:localStorage.userId,
						status:vm.status,
						rows:BASE.pageSize,
						page:vm.page+1,
					},
					success: function(rst) {
						tools.busy(false);
						vm.items.data = rst.data;
						var DATA = vm.items.data;
						if(DATA == null){
							vm.items.hasData = false;
							tools.toast("无数据", 'default');
						}else{
							//防XSS
							for (var i=0,len=vm.items.data.meetingInfo.length; i < len; i++) {
								for(var key in vm.items.data.meetingInfo[i]){
									vm.items.data.meetingInfo[i][key] = encodeHtml(vm.items.data.meetingInfo[i][key]);
								}
							}
							vm.items.data = rst.data.meetingInfo;
							vm.items.hasData = true;
							vm.total = rst.data.totalPages;
						}
						vm.page++;
					},
					error: function() {
						tools.busy(false);
					},
					asy: false
				}
				Ajax(obj);				
			},
			/* 
				[比较当前时间和截止时间]
			*/
			compareDate:function(time,time2){
				var vm = this;
				//选择的时间转换成数组
				var deadTime = vm.toDate(time);
				var timePick = vm.timeToDate(time2); 

				var dateN = new Date();			
				var	date = new Date(parseInt(deadTime[0]),parseInt(deadTime[1])-1,parseInt(deadTime[2]),parseInt(timePick[0]),parseInt(timePick[1]));
				if(dateN > date){
					return false
				}else{
					return true;
				}				
			},
		},
		ready(){
			var vm = this;
			// vm.showOne();		
		}
	}

</script>
<style scoped>
	.meeting-content{
		width:100%;
		height: 100%;
		background-color: #F4F4F4;
		border-radius: 5px;
	}
	.header{
		height: 70px;
		line-height: 70px;
		font-size: 16px;
		border-bottom: 1px solid #dddcdd;
		background-color: #F7F8FD;
	}
	.flow-head{
		height: 70px;
	    float: left;
	    line-height: 70px;
	    padding: 0 20px;	    
	}
	.flow-head span{
		font: normal 12px Arial,verdana,Hiragino Sans GB,"宋体",Microsoft Yaheim;
		font-weight: bold;
		font-size: 14px;
		color: #666;
	}
	.apply-flow{
		height: 32px;
	    float: right;
	    line-height: 32px;
	    padding: 0 10px;
	    background-color: #ff8c00;
	    color: white;
	    margin-right: 20px;
	    margin-top: 18px;
	    cursor: pointer;
	}
	ul{
		list-style: none;
	}
	.header ul li{	
		float: left;
		width: 33.33%;	
		height: 50px;
		line-height: 50px;
		text-align: center;
		position: relative;
	}
	.header ul li.selected{
		color: #008cee;
		border-bottom: solid 2px #00a0e9;
	}
	.hide{
		display: none;
	}
	/*wpush提示红点样式*/
	.header .hide.wpush {
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
	.header .wpush span {
		display: block;
		height: 14px;
		line-height: 14px;
		width: 15px;
		font-size: 12px;
		color: #fff;
		text-align: center;
		transform: scale(0.9);
	}
	.meeting-body{
		padding-top: 10px;
		height: calc(100% - 70px);
		overflow: auto;
	}	
    tbody tr td:nth-child(1) span{
    	width: 160px;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    display: block;
    }
	.start-li{		
		font-size: 14px;
		border-bottom:1px solid #E5E5E5;
		height: 40px;
	    line-height: 40px;
	    text-indent: 10px;
	}
	.start-li:hover{
		background-color: #fcfcfc;
	}	
	/*发布任务*/	
	.meeting-goback{
	    height: 70px;
	    float: left;
	    line-height: 70px;
	    cursor: pointer;
	    padding: 0 10px;
	    position: relative;
	}
	.goback-btn{
		margin-right: 10px;
	}
	.meeting-form{
		width: 100%;
		padding-left: 130px;
	}
	.meeting-input{
		margin:10px auto;
	}
	.issues-wrap1{
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
	.issues-wrap2{
		width: 77%;
		margin-right: 15px;
	    font-size: 15px;
	    height: 100px;
	    line-height: 30px;
	    padding-left: 8px;
	    padding-right: 8px;
	    border: 1px solid #e1e1e1;
	    border-radius: 4px;
	    background: #FFF;
	    border-radius: 3px;
	    font-size: 14px;
	}
	.meeting-input-label{
		float: left;
		margin-right: 15px;
		font-size: 14px;
		text-align: right;
		width: 80px;
		margin-top: 10px;
	}
	.file-label{
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
	.upload-file{
		display:none;
		/*line-height: 40px;*/
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
		/*border: 1px solid;*/
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
	.clear-float{
		clear: both;
	}
	.meeting-sub {
		text-align: center;
		height: 50px;
		margin-bottom: 10px;
		margin-top: 30px;
	}
	.meeting-btn {
		width: 50%;
		height: 40px;
		border-radius: 5px;
		border:none;
		background-color: #FF8C00;
		color: white;
		font-size: 16px;
	}
	.meeting-btn:hover{
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
	    /* border-radius: 5px; */
	    font-size: 16px;
	}
	.next:hover{
		background-color: #FF9615;
	}
	.opr-btn{
		display: inline-block;
	    width: 10%;
	    height: 38px;
	    background-color: #FF8C00;
	    color: #fff;
	    border: 0;
	    outline: 0;
	    font-size: 16px;
	}
	.opr-btn:hover{
		background-color: #FF9615;
	}
	.page-num{
		display: inline-block;
		width: 10%;
		font-size: 14px;
		color: #FF8C00;
	}
	.meeting-detail{
		width: 90%;
		box-shadow: 1px 1px 4px #888888;
		margin:10px auto;
		font-size: 14px;
		border-radius: 10px;
		overflow: hidden;
	}
	.meeting-detail ul{
		padding:10px;
	}
	.meeting-detail ul li{
		margin-bottom: 10px;
		border-bottom: 1px solid #dcdcdc;
	}
	.meeting-detail ul li:last-child {
		border-bottom: none;
	}
	.issue-label{
		color: #767272;
	}
	.detail-head{
		width: 100%;
	    height: 30px;
	    line-height: 30px;
	    border-bottom: 1px solid #ddd8dd;
	    background-color: #f7f8fd;
	    color: #000;
	    font: normal 14px Arial,verdana,Hiragino Sans GB,"\5B8B\4F53",Microsoft Yaheim;
	}
	.detail-head span{
		margin-left: 10px;
	}
	.detail-body{
		width: 100%;
		padding: 10px;
	}
	.detail-label{
		display: block;
		margin-bottom: 10px;
		color: #767272;
		word-break: break-all;
	}
	.mouse-over:hover{
		color: #2e45f8;
	}
	.detail-content{
		color: black;
	}
	.meeting-party{
		color: #0c84d7;
	}
	.detail-time-label{
		display: block;
		margin-bottom: 10px;
		color: #767272;
	}
	.meeting-start-time{
		color: black;
	}
	.meeting-place{
		color: black;
	}
	.oper-btn{
		margin:20px auto;
	}
	.meeting-note{
		width: 600px;
		height: 300px;
		margin: 80px auto;
		position: absolute;
		top: 0;
		left:0;
		bottom: 0;
		right: 0;
		border:1px solid #DFDDDD;
		background-color: white;
		border-radius: 10px;
		z-index: 10;
		overflow: hidden;
	}
	.meeting-note .header{
		height: 40px;
	    line-height: 40px;
	    padding: 0 10px;
	}
	.meeting-note .close-wrap{
		float: right;
    	line-height: 40px;
    	color: #ddd8dd;
	}
	.meeting-note .close-wrap:after{
		content: "";
		clear: both;
		width: 0;
		height: 0;
		display: block;
		visibility: hidden;
	}
	.note-textarea{
		width: 100%;
		height: 70%;
		resize: none;
		padding: 10px;
		font-size: 15px;
		border:none;
		outline: none;
		border-bottom: 1px solid #DFDDDD;
	}
	.btn-group{
		text-align: center;
		margin-top:10px;
	}
	.send-btn{
		margin: auto;
	    border: none;
	    background-color: #FF8C00;
	    color: white;
	    width: 20%;
	    height: 30px;
	    border-radius: 5px;
	}
	.send-btn:hover{
		background-color: #FF9615;
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
	.issue-content{
		color: #767272;
		margin-bottom: 10px;
	}
	.file-icon{
		margin-right: 10px;
	}
	a:hover{
		color: #2e45f8;
	}
	.reply-wrapper {
		padding: 20px 70px 20px 70px;
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
	.input-date{
		padding-left: 10px;
	    height: 40px;
	    width: 37%;
	    border: 1px solid #ddd8dd;
	    border-radius: 3px;
	    font-size: 14px;
	}
	.input-time{
		padding-left: 10px;
	    height: 40px;
	    width: 39%;
	    border: 1px solid #ddd8dd;
	    border-radius: 3px;
	    font-size: 14px;
	    margin-left: 6px;
	}
	.page-cover{
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 3;
		opacity: 0.1;
		background-color: #000;
	}
	.issue-detail{
		font-size: 14px;
		overflow: auto;
		height: 260px;
	}
	dl{
		padding: 20px 0;
	}
	dt{
		display: inline-block;
	    width: 40%;
	    text-align: right;
	    clear: both;
	    color: #999;
	    font-weight: normal;
	    padding: 5px 10px;
	    vertical-align: text-top;
	}
	dd{
		display: inline-block;
	    width: 58%;
	    padding: 5px 10px;
	    vertical-align: text-top;
	}
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button{
	    -webkit-appearance: none !important;
	    margin: 0; 
	}
	.type-lists{

	}
</style>