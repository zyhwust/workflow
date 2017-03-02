<template>
    <div class="task-content" v-if="showDiv.isTask">
    	<!-- 导航 -->
	    <div class="header">
		   <div class="flow-head">
	    		<span>{{taskTypeName}}</span>    
		    </div>
		    <div class="apply-flow" @click="applyTask" v-if="showCreatBtn">
	    		<span class="fa fa-pencil-square-o"></span>
	    		<span>创建任务</span>   
		    </div>
		    <div class="clear-float"></div>
	    </div>	   

	    <div class="task-body">
	    	<!-- 收到的任务 -->
	    	<div class="receive-task" v-if="tab.choiceTwo">
	    		<taskdetail v-bind:items="tasks" v-bind:total="totalPage" v-on:finish="refresh"></taskdetail>
	    	</div>
	    	<!-- 发布的任务 -->
	    	<div class="receive-task" v-if="tab.choiceThree">
	    		<taskdetail v-bind:items="tasks" v-bind:total="totalPage" v-on:finish="refresh"></taskdetail>
	    	</div>	    	
	    </div>
	</div>
	<!--弹出任务类型-->
    <div class="flow-wrap" v-if="comDisplay">
    	<div class="alert-header">
    		<span>选择任务类型</span>
    		<span class="fa fa-times close-wrap" @click="closeComment"></span>
    	</div>
    	<ul>
    		<li class="start-li" v-for="type in types" @click="edit($index)">{{type.name}}</li>
    	</ul>  	
    </div>
	<!-- 发布任务 -->
	<div class="task-edit" v-if="showDiv.isPublish">
	    <div class="alert-header">
    		<span>{{taskName}}</span>
    		<span class="fa fa-times close-wrap" @click="closeEdit"></span>
    	</div>
	    <!-- 选择任务成员 -->
	    <div class="editTask-body">
	    	<form  method="post" id="uploadfile" enctype="mulipart/form-data">
	    	<div class="task-form">
	    		<div class="task-input">
	    			<label class="task-input-label">任务名称</label>
	    			<input class="input-line" type="text" v-model="taskTitle">
	    		</div>
	    		<div class="task-input">
	    			<label class="task-input-label">任务内容</label>
	    			<!-- <div class="task-input-div"> -->
	    				<textarea class="input-area" v-model="taskContent" placeholder="输入任务详情"></textarea>
	    			<!-- </div> -->
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
	    			<!-- <span class="all-staff" @click="choiceMembers">+添加成员</span>
					<div class="input-area show-party">{{taskUsers}}</div>  -->   		
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
				<button class="task-btn" id="subForm" @click="subTask">提交</button>
			</div>	    		
	    </div>
	</div>
	<!-- 遮罩层 -->
	<div class="page-cover" v-if="isOpen"></div>
</template>
<script>
	
	import mo_taskdetail from 'components/mo_taskdetail.vue'	
	export default {
		components:{
			taskdetail:mo_taskdetail
		},
		replace:true,
		route:{
		    data:function(transition){
		      	var vm = this;
		        var taskType = transition.to.params.type;
		        if(taskType == 'accept'){
		        	vm.showCreatBtn = false;
		        	vm.taskTypeName = '收到的任务';
		          	vm.showTwo(1);
		        }else if (taskType == 'send') {
		        	vm.showCreatBtn = true;
		        	vm.taskTypeName = '发布的任务';
		          	vm.showThree();
		        }
		    }
	    },
		data () {
			return {				
				showDiv:{
					isTask:true,
					isPublish:false,
				},
				tab:{
					choiceOne:false,
					choiceTwo:false,
					choiceThree:false,									
				},				
				tasks:{
					hasData:true,
					data:'',
				},
				types:'',				
				taskName:'',
				taskId:'',
				undealFlow: window.unDealFlow,
				options:'', //负责人下拉选项值
				taskTitle:'',						
				taskContent:'',	
				taskTimeline:'',
				taskUsers:'',
				choice:'', //负责人id
				taskDesc:'',
				taskSource:localStorage.userName,
				usersId:[], //任务成员ID
				totalPage:1,//总页数
				taskTypeName:'',
				comDisplay:false,
				isOpen:false,
				showCreatBtn:true, //显示创建任务按钮
				priority:'',//优先级
				priorityId:'',//优先级Id
				filesId:[],
				files:[],
			}
		},
		methods: {
			applyTask:function(){
				var vm = this;
				vm.isOpen = true;
				vm.comDisplay = true;
				vm.getPublish();
			},
			closeComment:function(){
				var vm = this;
				vm.isOpen = false;
				vm.comDisplay = false;
			},
			closeEdit:function(){
				var vm = this;
				vm.isOpen = false;
				vm.showDiv.isPublish = false;
				vm.files = [];
				vm.filesId = [];
			},
			// 完成任务之后，根据页码刷新界面
			refresh:function(arg){
				var vm = this;
				if(localStorage.operateflag == 1){
					vm.showTwo(arg);
				}else{
					vm.showThree(arg);
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
			// 发布任务			
			subTask:function(){
				var vm = this;					
				var aa = vm.taskTitle +"|"+ vm.taskContent +"|"+ vm.taskId+"|"+vm.taskTimeline+"|"+vm.usersId +"|"+ vm.taskDesc +"|"+ localStorage.userId +"|"+ vm.choice +"|"+vm.taskSource;
				console.log(aa);
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
						priorityId:vm.priorityId,
						fileIds:vm.filesId,  //filepath
					},
					success:function(rst){
						tools.busy(false);
						tools.toast("发布成功","success");
						// vm.showDiv.isTask = true;
						vm.showDiv.isPublish = false;
						vm.isOpen = false;
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
						vm.filesId = [];
						vm.taskSource = localStorage.userName;	
						vm.showThree();					
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
			showTwo:function (curPage) {
				var vm = this;
				for(var key in vm.tab){
					if(vm.tab[key]==true){
						vm.tab[key]=false;
					}
				}				
				vm.tab.choiceTwo = true;
				tools.busy();
				localStorage.operateflag = 1
				// 获取收到的任务列表
				var obj = {
					url:'/home/task/1801.spring',
					args:{
						page:curPage,
						pageSize:BASE.pageSize,
						userId:localStorage.userId
					},
					success:function(rst){
						tools.busy(false);
						vm.tasks.data = rst.data;
						var DATA = vm.tasks.data;
						vm.totalPage = rst.total;
						if(DATA.length>0){
							vm.tasks.hasData = true;
						}else{
							vm.tasks.hasData = false;
							tools.toast("没有收到任务", 'default');
						}
						// 任务状态
						for (var i=0,len=DATA.length;i<len;i++) {
							//防XSS
							for(var key in vm.tasks.data[i]){
								vm.tasks.data[i][key] = encodeHtml(vm.tasks.data[i][key]);
							}
							vm.tasks.data[i].userIcon = BASE.url+"/upload/avatar/"+vm.tasks.data[i].createUserId+".png";
							if(vm.tasks.data[i].status==1){
								vm.tasks.data[i].listStatus="完成";
							}else{
								vm.tasks.data[i].listStatus="未完成";
							}
						}
					},
					error: function() {
						tools.busy(false);
					},			
					asy:true
				};
				Ajax(obj);

			},
			showThree:function () {
				var vm = this;
				for(var key in this.tab){
					if(this.tab[key]==true){
						this.tab[key]=false;
					}
				}				
				this.tab.choiceThree = true;
				tools.busy();
				localStorage.operateflag = 2;	
				// 获取发布的任务列表
				var obj = {
					url:'/home/task/1802.spring',
					args:{
						page:1,
						pageSize:BASE.pageSize,
						userId:localStorage.userId
					},
					success:function(rst){
						tools.busy(false);
						vm.tasks.data = rst.data;
						var DATA = vm.tasks.data;
						vm.totalPage = rst.total;
						if(DATA.length>0){
							vm.tasks.hasData = true;
						}else{
							vm.tasks.hasData = false;
							tools.toast("没有发布任务", 'default');
						}
						// 任务状态
						for (var i=0,len=DATA.length;i<len;i++) {
							//防XSS
							for(var key in vm.tasks.data[i]){
								vm.tasks.data[i][key] = encodeHtml(vm.tasks.data[i][key]);
							}
							vm.tasks.data[i].userIcon = BASE.url+"/upload/avatar/"+localStorage.userId+".png";
							if(vm.tasks.data[i].status==1){
								vm.tasks.data[i].listStatus="完成";
							}else{
								vm.tasks.data[i].listStatus="未完成";
							}
						}
					},	
					error: function() {
						tools.busy(false);
					},			
					asy:true
				};
				Ajax(obj);
				
			},
			//点击任务列表进行发布任务
			edit:function(index){
				this.comDisplay = false;
				this.taskName = this.types[index].name;
				this.taskId = this.types[index].id;
				// this.$root.overlay.display = true;
				this.showDiv.isPublish = true;
				this.getPriority();
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
			//获取当前登录人可以发布的任务
			getPublish:function(){
				var vm = this;			
				var obj = {
					url:'/home/task/1806.spring',
					args:{},
					success:function(rst){
						vm.types = rst.data;
						//防XSS
						for (var i=0,len=vm.types.length; i < len; i++) {
							for(var key in vm.types[i]){
								vm.types[i][key] = encodeHtml(vm.types[i][key]);
							}
						}
					},				
					asy:true
				}
				Ajax(obj);
			},	
			/* 
				[比较当前时间和截止时间]
			*/
			compareDate:function(time){
				var vm = this;
				var dateN = new Date();	
				var deadTime = vm.toDate(time);
				var	date = new Date(parseInt(deadTime[0]),parseInt(deadTime[1])-1,parseInt(deadTime[2]),23,59,59);
				console.log(date);
				console.log(dateN);
				if(dateN > date){
					return false
				}else{
					return true;
				}					
			},	
			
		},
		ready(){
			var vm = this;
		}
	}

</script>
<style scoped>
	.task-content{
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
	
	.task-body{
		/*height: 89%;*/
		overflow: auto;
		height: calc(100% - 70px);
	}
	.publish-task{
		margin-left:10px;
		margin-bottom: 100px;
	}
	.start-li{		
		font-size: 14px;
		border-bottom:1px solid #E5E5E5;
		height: 40px;
	    line-height: 40px;
	    text-align: center;
	}
	.start-li:hover{
		background-color: #fcfcfc;
	}
	/*发布任务*/	
	.task-form{
		width: 100%;
		/*padding-left: 150px;*/
		padding-left: 30px;
	}
	.task-input{
		margin:10px auto;
		/*line-height: 30px;*/
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
	.flow-wrap{
		width: 300px;
	    height: 200px;
	    margin: 60px auto;
	    position: absolute;
	    /* text-align: center; */
	    top: 0;
	    left: 0;
	    bottom: 0;
	    right: 0;
	    border-radius: 6px;
	    background-color: white;
	    z-index: 4;
		box-shadow: 1px 1px 1px #8c8c8c;
	}
	.alert-header{
		height: 40px;
	    line-height: 40px;
	    padding: 0 10px;
	    border-bottom: 1px solid #f4f4f4;
	    font-size: 14px;
	    font-family: monospace;
	    font-weight: bold;
	    color: #636363;
	}
	.close-wrap{
		float: right;
    	line-height: 40px;
    	color: #ddd8dd;
	}
	.task-edit{
		width: 720px;
		margin: 52px auto 0px auto;
		position: absolute;
		top: 0;
		left:0;
		right: 0;
		border-radius: 6px;
		/*border:1px solid #DFDDDD;*/
		background-color: white;
		z-index: 5;
		box-shadow: 1px 1px 1px #8c8c8c;
	}
	/*.task-edit .header{
		height: 44px;
	    line-height: 44px;
	    padding: 0 10px;
	    font-size: 14px;
	}*/
	.alert-header{
		height: 40px;
	    line-height: 40px;
	    padding: 0 10px;
	    border-bottom: 1px solid #f4f4f4;
	    font-size: 14px;
	    font-family: monospace;
	    font-weight: bold;
	    color: #636363;
	}
	.editTask-body{
		height: 560px;
		overflow: auto;
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
	.clear-float{
		content: "";
		clear: both;
		width: 0;
		height: 0;
		display: block;
		visibility: hidden;
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
</style>