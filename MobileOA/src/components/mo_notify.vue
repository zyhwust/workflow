<template>
	<mo_ifread :informid="detail.informid"></mo_ifread>
    <div class="workFlow-content">
    	<!-- 导航栏 -->
		<!--发送通知-->
		<div class="header" v-if="tab.choiceOne">			
			<div class="header-title">
				<span class="icon-back"></span>
				<button class="btn-back" @click="goList('send', this.page2)">返回</button>
			</div>
		</div>			
		<!--收到的通知-->
		<div class="header" v-if="tab.choiceTwo || detail.showaccept">
			<div class="header-title">收到的通知</div>
		</div>			
		<!--发送的通知-->
		<div class="header" v-if="tab.choiceThree || detail.showsend">
			<div class="header-title">发送的通知</div>
			<button class="send-notify" @click="gotoSend()">发通知</button>
		</div>			
		<!--通知详情-->
		<div class="header" v-if="tab.detail">
			<div class="header-title">
				<span class="icon-back"></span>
				<button class="btn-back" @click="goList(detail.type, detail.page)">返回</button>
			</div>
			<button class="send-notify" @click="gotoSend()">发通知</button>
		</div>			

	    <div class="workFlow-body">
	    	<!-- 发起通知 -->
	    	<div class="start-sp" v-if="tab.choiceOne">
				<div class="notify-wrapper">
					<div class="item-wrapper">
						<label for="title" class="item-label"><span class="required">*</span>标&nbsp;&nbsp;题</label>
						<input class="item-body title" type="text" v-model="title" id="title" placeholder="请输入通知标题">
					</div>
					<div class="item-wrapper">
						<label for="" class="item-label"><span class="required">*</span>成&nbsp;&nbsp;员</label>
						<div class="item-body" style="border:0;">
							<span class="all-staff" @click="addStaff">+添加成员</span>
							<div class="staff-list all-staff" id="staff_list">{{staff_list}}</div>
							<div class="staff-list all-staff" id="dep_list">{{dep_list}}</div>
						</div>
					</div>
					<div class="item-wrapper">
						<label for="" class="item-label"><span class="required">*</span>通知内容</label>
						<div class="item-body">
							<textarea class="item-content" v-model="notify_content" name="" id="" cols="30" rows="10"></textarea>
						</div>
					</div>
					<div class="item-wrapper">
						<label for="" class="item-label">上传附件</label>
						<div class="item-body upload-wrapper">
							<form  method="post" id="uploadfile" enctype="mulipart/form-data">
								<input type="file" id="file" name="uploadFile" @change="uploadOneByone" class="upload-file" multiple>
								<input type="button" onclick="file.click()" class="upload-btn" value="点击上传文件">
							</form>
						</div>
					</div>
					<div class="item-wrapper">
						<label for="" id="lab" class="item-label">&nbsp;</label>
						<div class="item-body  file-list">
							<ul>
								<li class="files-list" v-for="file in files">
									<span class="fa fa-file-text-o fa-2x upfile-icon"></span>
									<span>{{file.name}}</span>
								</li>
							</ul>
						</div>
					</div>					
					<div class="button-wrapper publish-wrapper">
						<button class="publish" id="publish" @click="publishNotify">发布</button>
					</div>
				</div>
	    	</div>
			<!--收到的通知列表-->			
			<div class="notify-list" v-if="tab.choiceTwo || detail.showaccept">
				<ul class="list-wrapper">
					<li class="search-wrapper">
						<i class="fa fa-search icon search-icon" aria-hidden="true" @click="searchNotify"></i>
						<input type="text" class="search-input" v-model="search_input" @keyup.enter="searchNotify">
					</li>
					<li class="item" v-for="item in accept_notify" @click="goDetail(item.informId, item.title, item.userRealname, item.createTime, item.content, 'accept', this.page, item.departmentName)">
						<div class="img-wrapper">
							<img :src=item.userImgurl  alt onerror="this.src = BASE.url + '/upload/avatar/1.png'">
							<div :class="{'unread': item.status < 1}"></div>
						</div>
						<div class="article-wrapper">
							<p class="title sub">{{item.title}}</p>
							<p class="article sub">From：{{item.departmentName}}&nbsp;|&nbsp;{{item.content}}</p>
							<p class="datetime sub">{{item.createTime}}</p>
						</div>
						<span class="username">{{item.userRealname}}</span>
					</li>
				</ul>
				<div class="button-wrapper">
					<button class="next" @click="prePage('accept')">上一页</button>
					<p class="page-num"><span id="current_page">{{page}}</span>/<span id="total_page">{{total}}</span></p>
					<button class="next" @click="nextPage('accept')">下一页</button>
				</div>
			</div>
			<!--发起的通知列表-->			
			<div class="notify-list" v-if="tab.choiceThree || detail.showsend">
				<ul class="list-wrapper">
					<li class="item" v-for="item in send_notify" @click="goDetail(item.informId, item.title, item.userRealname, item.createTime, item.content, 'send', page2, item.departmentName)">
						<div class="img-wrapper">
							<img :src=item.userImgurl  alt onerror="this.src = BASE.url + '/upload/avatar/1.png'">
						</div>
						<div class="article-wrapper">
							<p class="title sub">{{item.title}}</p>
							<p class="article sub">From：{{item.departmentName}}&nbsp;|&nbsp;{{item.content}}</p>
							<p class="datetime sub">{{item.createTime}}</p>
						</div>
						<span class="username">{{item.userRealname}}</span>
					</li>
				</ul>
				<div class="button-wrapper">
					<button class="next" @click="prePage('send')">上一页</button>
					<p class="page-num"><span id="current_page">{{page2}}</span>/<span id="total_page">{{total}}</span></p>
					<button class="next" @click="nextPage('send')">下一页</button>
				</div>
			</div>

			<!--通知详情-->
			<div class="detail-wrapper" v-show="tab.detail">
				<!--<div class="goback">
					<p @click="goList(detail.type, detail.page)">返回</p>
				</div>-->
				<div class="title-wrapper">
					<h3>{{detail.title}}</h3>
				</div>
				<div class="info-wrapper">
					<p><span>{{detail.username}}</span>&nbsp;|&nbsp;<span>{{detail.deptName}}</span>&nbsp;|&nbsp;发布于<span>{{detail.time}}&nbsp;</span></p>
					<p class="read" @click="ifread"><span >已看:{{detail.accepted}}人</span>&nbsp;|&nbsp;<span>未看:{{detail.unaccepted}}人</span></p>
				</div>
				<div class="content-wrapper">
					<p id="content-text">{{detail.content}}</p>
				</div>
				<div class="download-wrapper" v-if="detail.file_list != null && detail.file_list.length > 0">
					<p class="download-item-wrapper">
						<span class="download-item" @click="download">&nbsp;&nbsp;下载附件</span>
					</p>
					<ul class="accept-files-wrapper">
						<li class="accept-files" v-for="file in detail.file_list">
							<a href="{{file.path}}" download>
								<span class="fa fa-file-text-o fa-2x accept-icon"></span>
								<span class="filename">{{file.fileName}}</span>
							</a>
						</li>
					</ul>
				</div>
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
			</div>
	    </div>
	</div>
	
</template>
<script>
import mo_ifread from './mo_ifread.vue';
	export default {
		components: {
			mo_ifread
		},
		route: {
		//TODO 更换接口
		data: function (transition) {
			var vm = this;
			var type = transition.to.params.type;	
			if(type == '' || type === undefined) {
				vm.showTwo();
			}
			if(type == 'accept') {
				vm.showTwo();
			}
			if(type == 'send') {
				vm.showThree();
			}
		}
		},		
		data () {
			return {				
				tab:{
					choiceOne: false,
					choiceTwo: true,
					choiceThree: false,
					detail: false
				},
				page: 1,
				// 收到的通知每页显示条数
				pageSize: 15,
				page2: 1,
				// 发送的通知每页显示条数
				pageSize2: 15,
				// 总页数
				total: 1,
				// 员工列表
				staff: [],
				// 用于显示的员工字符串
				staff_list: '',
				// 选中部门列表
				deps: [],
				// 用于显示的部门字符串
				dep_list: '',
				// 通知标题
				title: '',
				// 通知内容
				notify_content: '',
				// 收到的通知列表 
				accept_notify: [],
				send_notify: [],
				// 通知详情
				detail: {
					informid: '',
					title: '',
					content: '',
					username: '',
					time: '',
					// 总人数
					toUserIds: 0,
					// 已读人数
					accepted: 0,
					// 未读人数
					unaccepted: 0,
					// 通知类型(收到的,发起的)
					type: '',
					// 原来的页码(要返回的页码)
					page: '',
					// 用来判断显示哪种类型列表，否则会触发watch
					showsend: false,
					showaccept: false,
					// 通知详情文件列表
					file_list: [],
					// 部门名称
					deptName: '',
					// 评论列表
					reply: []
				},
				// 已收到通知搜索框输入
				search_input: '',
				//上传文件列表
				files:[],
				// 回复的文本内容
				reply_content: '',
				// 用户姓名
				username: localStorage.userName,
				// 用户头像
				userPicture: BASE.url+'/upload/avatar/'+localStorage.userId+'.png'
			}
		},
		// watch:{ 
		// 	"tab.choiceTwo" (newOne,oldOne){
		// 		if(newOne == true) {
		// 			this.showTwo();
		// 		}
		// 	},
		// 	"tab.choiceThree" (newOne,oldOne){
		// 		if(newOne == true) {
		// 			this.showThree();
		// 		}
		// 	}
    	// },
		computed: {
			// 提交的接收通知人员id(老版本字符串)
			// staffList: function() {
			// 	var staff_list = '',
			// 		vm = this;
			// 	for(var key in vm.staff) {
			// 		staff_list += vm.staff[key].userId + ',';
			// 	}
			// 	staff_list = staff_list.slice(0, -1);
			// 	return staff_list;
			// }

			// 提交的接收通知人员id(新版本提交数组)
			staffList: function() {
				var staff_list = [],
					vm = this;
				for(var key in vm.staff) {
					staff_list.push(vm.staff[key].userId);
				}
				return staff_list;
			},
			depList: function() {
				var dep_list = [],
					vm = this;
				for(var key in vm.deps) {
					dep_list.push(vm.deps[key].id);
				}
				return dep_list;				
			},		
		},
		methods: {
			// 查看已读未读人员
			ifread: function() {
				var vm = this;
				// 调用子组件加载数据方法（不推荐）
				vm.$children[0].$data.tab.unread = true;
				vm.$children[0].$data.tab.read = false;
				vm.$children[0].$data.page.cur = 1;
				vm.$children[0].$data.page.total = 0;
				vm.$children[0].loadData();
				vm.$root.overlay2.display = true;
				vm.$root.ifread.display = true;
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
						userRealname: vm.username, 
						toUserName: '', 
						toUserId: '',
						objectId: vm.detail.informid,
						objectTable: 'inform',
						content: reply_content,
						pid: 0,
						// 发送通知的用户组
						toUserIds: vm.detail.toUserIds
					},
					success: function(res) {
						// 未读人数
						vm.reply_content = '';
						var reply = document.getElementById('reply_text');
						reply.style.height = 'auto';
						vm.getReply(vm.detail.informid);
					},
					error: function() {
					},
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
			// 跳转到发送通知页面
			gotoSend: function() {
				var vm = this;
				for(let key in this.tab){
					if(this.tab[key]==true){
						this.tab[key]=false;
					}
				}	
				vm.files = [];
				vm.detail.showaccept = false;
				vm.detail.showsend = false;						
				vm.tab.choiceOne = true;
			},
			// 添加通知人员
			addStaff: function() {
				var vm = this;
				vm.staff = [];
				vm.deps = [];
				vm.$root.people.dept_type = '';
				vm.$root.people.deps = [];
				vm.$root.people.users = [];
				vm.staff_list = '';
				vm.dep_list = '';

				vm.$root.people.haveDepId = true;
				vm.$root.overlay.display = true;
				vm.$root.people.display = true;

				vm.$root.people.success = function() {
					vm.dept_type = vm.$root.people.deptType;
					vm.staff = vm.$root.people.users;
					vm.deps = vm.$root.people.deps;
					var staff_list = [];
					var dep_list = [];
					for(var key in vm.staff) {
						staff_list.push(vm.staff[key].userRealname);
					} 	
					for(var key in vm.deps) {
						dep_list.push(vm.deps[key].name);
					}
					if(dep_list.length != 0) {
						vm.$root.people.haveDepId = true;
					}
					vm.staff_list = staff_list.join(',');
					vm.dep_list = dep_list.join(',');
					vm.$root.people.users = [];
					vm.$root.people.deps = [];
					vm.$root.people.display = false;
					vm.$root.overlay.display = false;
				}
			},
			// 添加通知人员
			addDep: function() {
				var vm = this;
				vm.$root.people.deps = [];
				vm.$root.overlay2.display = true;
				vm.$root.people.display = true;
				vm.$root.people.success = function() {
					vm.deps = vm.$root.people.deps;
					var dep_list = [];
					for(var key in vm.deps) {
						dep_list.push(vm.deps[key].id);
					} 	
					$('#dep_list').html(dep_list.join(','));
					// vm.$root.people.deps = [];
					vm.$root.people.display = false;
					vm.$root.overlay2.display = false;
				}
			},
			// 发布通知
			publishNotify:  function() {
				var vm = this;
				if(vm.title == '') {
					tools.toast('标题不能为空', 'error');
					return;
				}
				if((vm.staffList == [] || vm.staffList == '') && (vm.depList == [] || vm.depList == '')) {
					tools.toast('成员不能为空', 'error');
					return;
				}
				if(vm.notify_content == '') {
					tools.toast('内容不能为空', 'error');
					return;
				}
				$('.publish').attr('disabled', 'true');
				tools.busy();
				// 老版本发布通知接口
				// var obj1701 = {
				// 	url: '/inform/1701.spring',
				// 	args: {
				// 		send: localStorage.userId,
				// 		accept: vm.staffList,
				// 		title: vm.title,
				// 		content: vm.notify_content
				// 	},
				// 	success: function() {
				// 		tools.toast('发布成功', 'success');
				// 		$('.publish').removeAttr('disabled');
				// 		vm.tab.choiceOne = false;
				// 		// vm.tab.choiceThree = true;
				// 		vm.showThree();
				// 	},
				// 	error: function() {
				// 		tools.toast('发布失败', 'error');
				// 		$('.publish').removeAttr('disabled');
				// 	}
				// }
				// Ajax(obj1701);
				
				// 新版本发布通知接口
				var file_ids = [];
				for(let k in vm.files) {
					file_ids.push(vm.files[k].id);
				}
				var obj1706 = {
					url: '/inform/1706.spring',
					args: {
						send: localStorage.userId,
						acceptUser: vm.staffList || [],
						acceptDept: vm.depList || [],
						deptType: vm.dept_type || '',
						title: vm.title,
						content: vm.notify_content,
						// 附件
						// attachment: vm.files
						fileIds: file_ids
					},
					success: function() {
						tools.toast('发布成功', 'success');
						$('.publish').removeAttr('disabled');
						vm.tab.choiceOne = false;
						// vm.tab.choiceThree = true;
						// 清空通知内容
						vm.staffList = [];
						vm.depList = [];
						vm.staff_list = '';
						vm.dep_list = '';
						vm.title = '';
						vm.notify_content = '';
						vm.showThree();
						tools.busy(false);
					},
					error: function() {
						tools.busy(false);
						tools.toast('发布失败', 'error');
						$('.publish').removeAttr('disabled');
					}					
				}
				Ajax(obj1706);
			},
			// 查看通知详情
			goDetail: function(id, title, name, time, content, type, page, deptName) {
				document.querySelectorAll('.reply-input')[0].setAttribute('disabled', 'true');
				document.querySelectorAll('.reply-btn')[0].setAttribute('disabled', 'true');
				var vm = this;

				for(let key in this.tab){
					if(this.tab[key]==true){
						this.tab[key]=false;
					}
				}
				for(let key in vm.detail) {
					vm.detail[key] = null;
				}
				vm.detail.unaccepted = 0,
				vm.detail.accepted = 0;
				vm.detail.page = 0;

				vm.detail.informid = id,
				vm.detail.title = encodeHtml(title),
				vm.detail.username = name,
				vm.detail.time = time;
				// vm.detail.content = encodeHtml(content),
				// 处理文本中的换行符
				var contentText = document.querySelector('#content-text');
				var temp = content.replace(/\r\n|\n/g, '<br/>');
				contentText.innerHTML = temp;

				vm.detail.type = type,
				vm.detail.page = page;
				vm.detail.deptName = deptName;

				var reply = document.getElementById('reply_text');
				reply.style.height = 'auto';
				// 确认已读消息
				var obj1704 = {
					url: '/inform/1704.spring',
					args: {
						informId: id,
						accept: localStorage.userId,
						status : '1'	
					},
					success: function() {
						// 刷新提示消息数目
						getMsg('inform');						
					},
					error: function() {}
				}
				Ajax(obj1704);
				
				tools.busy();
				// 显示通知详情
				var obj1703 = {
					url: '/inform/1703.spring',
					args: {
						id: id
					},
					success: function(res) {
						// 附件
						vm.detail.file_list = res.fileList;
						for(let key in vm.detail.file_list) {
							vm.detail.file_list[key].path = BASE.url + vm.detail.file_list[key].fileRealPath;
						}

						// 未读人数
						if(res.data.Accept == null || res.data.Accept == '') {
							tools.busy(false);
							return;
						}
						// 设置总人数
						vm.detail.toUserIds = res.data.Accept;

						// 设置未读人数
						var unaccept_num =  res.data.Accept.split(',').length - (res.data.Accepted === null ? 0 : res.data.Accepted.split(',').length);
						vm.detail.unaccepted = unaccept_num;
						// 设置已读人数
						if(res.data.Accepted == null || res.data.Accepted == '') {
							tools.busy(false);
							document.querySelector('.reply-input').removeAttribute('disabled');
							document.querySelector('.reply-btn').removeAttribute('disabled');							
							return;
						}
						var accept_num = res.data.Accepted.split(',').length;
						vm.detail.accepted = accept_num;

						document.querySelector('.reply-input').removeAttribute('disabled');
						document.querySelector('.reply-btn').removeAttribute('disabled');
						tools.busy(false);
					},
					error: function() {
						document.querySelector('.reply-input').removeAttribute('disabled');
						document.querySelector('.reply-btn').removeAttribute('disabled');						
						tools.busy(false);
					}
				}
				Ajax(obj1703);

				// 获取评论列表
				vm.getReply(id);

				vm.tab.detail = true;
			},
			// 获取评论列表
			getReply: function(id) {
				var vm = this;
				// 获取评论列表
				var obj2302 = {
					url: '/home/comment/2302.spring',
					args: {
						objectId: id,
						objectTable: 'inform'
					},
					success: function(res) {
						vm.detail.reply = res.data;

						if(vm.detail.reply == null) {
							tools.busy(false);
							return;
						} 
						for( let i = 0, len = vm.detail.reply.length; i < len; i++) {
							vm.detail.reply[i].content = encodeHtml(vm.detail.reply[i].content);
						}
						vm.detail.reply.reverse();
						for(let i = 0, len = vm.detail.reply.length; i < len; i++) {
							vm.detail.reply[i].picture = BASE.url+'/upload/avatar/'+vm.detail.reply[i].userId+'.png';
						}
					},
				}				
				Ajax(obj2302);
			},
			// 返回通知列表
			goList: function(type, page) {
				tools.busy(false);
				var vm = this;
				for(let key in this.tab){
					if(this.tab[key]==true){
						this.tab[key]=false;
					}
				}
				for(let key in vm.detail) {
					vm.detail[key] = null;
				}
				vm.detail.unaccepted = 0,
				vm.detail.accepted = 0;
				vm.detail.page = 0;
				vm.showList(type, page);

			},
			prePage: function(type) {
				tools.busy();
				var page_type = '',
					size_type = '',
					notify_type = ''
					;
				if(type == 'accept') {
					page_type = 'page',
					size_type = 'pageSize',
					notify_type = 'accept_notify';
				}
				if(type == 'send') {
					page_type = 'page2',
					size_type = 'pageSize2',
					notify_type = 'send_notify';
				}
				if(parseInt(this[page_type]) <= 1) {
					tools.busy(false);
					return false;
				}

				document.querySelectorAll('.next')[0].setAttribute('disabled', 'true');
				document.querySelectorAll('.next')[1].setAttribute('disabled', 'true');				
				var vm = this;
				// 拉取收到的通知列表
				var obj1702 = {
					url: '/inform/1702.spring',
					args: {
						page: vm[page_type] - 1,
						pageSize: vm[size_type],
						// accept: localStorage.userId
					},
					success: function(res) {
						vm[notify_type] = res.data;
						for(var key in vm[notify_type]) {
							vm[notify_type][key].userImgurl = BASE.url + '/upload/avatar/' + vm[notify_type][key].userImgurl;
							for(var key2 in vm[notify_type][key]) {
								vm[notify_type][key][key2] = encodeHtml(vm[notify_type][key][key2]);
							}
						}
						vm[page_type] --;
						tools.busy(false);
						document.querySelectorAll('.next')[0].removeAttribute('disabled');
						document.querySelectorAll('.next')[1].removeAttribute('disabled');						
					},
					error: function() {
						tools.busy(false);
						document.querySelectorAll('.next')[0].removeAttribute('disabled');
						document.querySelectorAll('.next')[1].removeAttribute('disabled');							
					}
				}
				if(type == 'accept') {
					obj1702.args.accept = localStorage.userId;
				}
				if(type == 'send') {
					obj1702.args.send = localStorage.userId;
				}
				Ajax(obj1702);				
			},
			nextPage: function(type) {	
				tools.busy();
				var page_type = '',
					size_type = '',
					notify_type = ''
					;
				if(type == 'accept') {
					page_type = 'page',
					size_type = 'pageSize',
					notify_type = 'accept_notify';
				}
				if(type == 'send') {
					page_type = 'page2',
					size_type = 'pageSize2',
					notify_type = 'send_notify';
				}
				if(parseInt(this[page_type]) >= parseInt(this.total)) {
					tools.busy(false);
					return;
				}

				document.querySelectorAll('.next')[0].setAttribute('disabled', 'true');
				document.querySelectorAll('.next')[1].setAttribute('disabled', 'true');					
				var vm = this;
				// 拉取收到的通知列表
				var obj1702 = {
					url: '/inform/1702.spring',
					args: {
						page: vm[page_type] + 1,
						pageSize: vm[size_type],
					},
					success: function(res) {
						vm[notify_type] = res.data;
						for(var key in vm[notify_type]) {
							vm[notify_type][key].userImgurl = BASE.url + '/upload/avatar/' + vm[notify_type][key].userImgurl;
							for(var key2 in vm[notify_type][key]) {
								vm[notify_type][key][key2] = encodeHtml(vm[notify_type][key][key2]);
							}							
						} 
						vm[page_type] ++;
						tools.busy(false);
						document.querySelectorAll('.next')[0].removeAttribute('disabled');
						document.querySelectorAll('.next')[1].removeAttribute('disabled');							
					},
					error: function(res) {
						tools.busy(false);
						document.querySelectorAll('.next')[0].removeAttribute('disabled');
						document.querySelectorAll('.next')[1].removeAttribute('disabled');	
					}
				}
				if(type == 'accept') {
					obj1702.args.accept = localStorage.userId;
				}
				if(type == 'send') {
					obj1702.args.send = localStorage.userId;
				}
				Ajax(obj1702);				
			},
			// 返回通知列表函数
			showList: function(type, page) {
				tools.busy(false);
				var vm = this;
				var notify_type = '';
				if(type == 'accept') {
					notify_type = 'accept_notify';
				}
				if(type == 'send') {
					notify_type = 'send_notify';
				}
				var obj1702 = {
					url: '/inform/1702.spring',
					args: {
						page: page,
						pageSize: vm.pageSize,
					},
					success: function(res) {
						vm[notify_type] = res.data;
						for(var key in vm[notify_type]) {
							vm[notify_type][key].userImgurl = BASE.url + '/upload/avatar/' + vm[notify_type][key].userImgurl;
							for(var key2 in vm[notify_type][key]) {
								vm[notify_type][key][key2] = encodeHtml(vm[notify_type][key][key2]);
							}
						}
						vm.total = res.total;
						tools.busy(false);
					}
				}
				// 设置通知类型
				obj1702.args[type] = localStorage.userId;
				Ajax(obj1702);

				if(type == 'accept') {
					vm.detail.showaccept = true;
					vm.detail.showsend = false;
					vm.page = page;
				}else {
					vm.detail.showsend = true;
					vm.detail.showaccept = false;
					vm.page2 = page;
				}
			},
			// 搜索已收到的通知
			searchNotify: function() {
				tools.busy();
				var vm = this;
				vm.tab.choiceTwo = true;
				// 清空detail信息
				for(let key in vm.detail) {
					vm.detail[key] = null;
				}
				vm.detail.unaccepted = 0,
				vm.detail.accepted = 0;
				vm.detail.page = 0;
				vm.detail.showaccept = false;
				vm.detail.showsend = false;

				// 清除页码
				vm.page = 1;
				// 拉取收到的通知列表
				var obj1702 = {
					url: '/inform/1702.spring',
					args: {
						page: 1,
						pageSize: vm.pageSize,
						accept: localStorage.userId,
						searchString: vm.search_input
					},
					success: function(res) {
						vm.accept_notify = res.data;
						for(var key in vm.accept_notify) {
							vm.accept_notify[key].userImgurl = BASE.url + '/upload/avatar/' + vm.accept_notify[key].userImgurl;
								for(var key2 in vm.accept_notify[key]) {
									vm.accept_notify[key][key2] = encodeHtml(vm.accept_notify[key][key2]);
								}							
						}
						vm.total = res.total;
						tools.busy(false);
					},
					error: function() {
						tools.busy(false);
					}
				}
				Ajax(obj1702);			
			},
    		//上传附件，并显示
    		uploadOneByone:function(){
				tools.busy();
    			var vm = this,
					filesId = [];
				$('#lab').css('display', 'block');
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
							tools.busy(false);
							filesId.push(rst.data.filesList[0].fileId);
							var fileObj = {
								id:rst.data.filesList[0].fileId,
								// name:rst.data.filesList[0].fileName,
								name: $('#file').val().split('\\').pop(),
								trueName:rst.data.filesList[0].fileTrueName,
								realPath:rst.data.filesList[0].realPath
							};
							vm.files.push(fileObj);
						}else {
							tools.busy(false);
							tools.toast('上传文件失败，请重新试传', 'error');
							$('#publish').removeAttr('disabled');
						}
					},
					error:function(data){
						tools.busy(false);
						tools.toast('上传文件失败', 'error');
						$('#publish').removeAttr('disabled');
					},
					timeout: 20000
				};
				$("#uploadfile").ajaxSubmit(options);
    		},
			// 下载附件
			download: function() {

			},			
			showOne:function () {
				var vm = this;
				for(var key in this.tab){
					if(this.tab[key]==true){
						this.tab[key]=false;
					}
				}
				this.staff = [];
				// 清空detail信息
				for(let key in vm.detail) {
					vm.detail[key] = null;
				}
				vm.detail.unaccepted = 0,
				vm.detail.accepted = 0;
				vm.detail.page = 0;
				vm.detail.showaccept = false;
				vm.detail.showsend = false;

				// 清空文件列表
				vm.files = [];
				this.tab.choiceOne = true;		
			},
			showTwo: function() {
				for(var key in this.tab){
					if(this.tab[key]==true){
						this.tab[key]=false;
					}
				}
				this.tab.choiceTwo = true;	
				var vm = this;
				// 清空detail信息
				for(let key in vm.detail) {
					vm.detail[key] = null;
				}
				vm.detail.unaccepted = 0,
				vm.detail.accepted = 0;
				vm.detail.page = 0;
				vm.detail.showaccept = false;
				vm.detail.showsend = false;

				// 清除页码
				vm.page = 1;
				// 拉取收到的通知列表
				var obj1702 = {
					url: '/inform/1702.spring',
					args: {
						page: 1,
						pageSize: vm.pageSize,
						accept: localStorage.userId
					},
					success: function(res) {
						vm.accept_notify = res.data;
						for(var key in vm.accept_notify) {
							vm.accept_notify[key].userImgurl = BASE.url + '/upload/avatar/' + vm.accept_notify[key].userImgurl;
							for(var key2 in vm.accept_notify[key]) {
								vm.accept_notify[key][key2] = encodeHtml(vm.accept_notify[key][key2]);
							}							
						}
						vm.total = res.total;
						tools.busy(false);
					},
					error: function(res) {
						vm.total =1;
						tools.busy(false);
					}
				}
				Ajax(obj1702);
			},
			showThree: function() {
				for(var key in this.tab){
					if(this.tab[key]==true){
						this.tab[key]=false;
					}
				}
				this.tab.choiceThree = true;
				var vm = this;

				// 清空detail信息
				for(let key in vm.detail) {
					vm.detail[key] = null;
				}
				vm.detail.unaccepted = 0,
				vm.detail.accepted = 0;
				vm.detail.page = 0;
				vm.detail.showaccept = false;
				vm.detail.showsend = false;

				// 清除页码
				vm.page2 = 1;

				// 发起收到的通知列表
				var obj1702 = {
					url: '/inform/1702.spring',
					args: {
						page: 1,
						pageSize: vm.pageSize2,
						send: localStorage.userId
					},
					success: function(res) {
						vm.send_notify = res.data;
						for(var key in vm.send_notify) {
							vm.send_notify[key].userImgurl = BASE.url + '/upload/avatar/' + vm.send_notify[key].userImgurl;
							for(var key2 in vm.send_notify[key2]) {
								vm.send_notify[key2] = encodeHtml(vm.send_notify[key2]);
							}							
						}
						vm.total = res.total;
						tools.busy(false);
					},
					error: function(res) {
						vm.total =1;
						tools.busy(false);
					}
				}
				Ajax(obj1702);
			},		
		},
	}

</script>
<style scoped>
	.workFlow-content{
		width:100%;
		height: 100%;
		background-color: #F4F4F4;
		border-radius: 5px;
	}
	.header{
		position: relative;
		height: 70px;
		line-height: 70px;
		font-size: 16px;
		border-bottom: 1px solid #dddcdd;
		background-color: #F7F8FD;
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
	.workFlow-body{
		height: calc(100% - 70px);
		overflow: auto;
	}
	.start-sp{
		margin-left:10px;
		margin-bottom: 100px;
	}
	.notify-wrapper {
		width: 80%;
		margin: 20px auto;
	}
	.notify-wrapper .item-wrapper {
		width: 100%;
		padding: 0 25px 10px 10px;
		line-height: 50px;
		font-family: "冬青黑体简体中文","Tahoma","Hiragino Sans GB","Microsoft YaHei","微软雅黑","STHeiti","WenQuanYi Micro Hei",SimSun,sans-serif !important;
	}
	.notify-wrapper .item-wrapper:after {
		content: ' ';
		display: block;
		clear: both;
	}
	.notify-wrapper .item-wrapper #lab {
		display: none;
	}
	.notify-wrapper .item-wrapper .item-label {
		float: left;
		width: 20%;
		max-width: 140px;
		font-size: 15px;
		text-align: right;
		padding-right: 20px;
	}
	.notify-wrapper .item-wrapper .item-body {
		float: left;
		width: 80%;
		max-width: 700px;
		border: 1px solid #e1e1e1;
		border-radius: 4px;
		margin-bottom: 10px;
		font-size: 15px;
		outline: 0;
	}
	.notify-wrapper .item-wrapper .item-body.upload-wrapper {
		border: 0;
	}
	.notify-wrapper .item-wrapper .upload-file {
		width: 0;
	}
	.notify-wrapper .item-wrapper .upload-btn {
		color: #FF8C00;
		border-radius: 5px;
		height: 40px;
		cursor: pointer;
		border: 1px solid #ccc;
		background: #fff;
		padding: 5px 15px;
	}
	.notify-wrapper .item-wrapper .files-list {
		float: left;
		margin: 10px;
		font-size: 13px;
	}
	.notify-wrapper .item-body.file-list {
		border: 0;
		margin-bottom: 0;
		
	}
	.notify-wrapper .item-wrapper .files-list .upfile-icon {
		color: #9e9b9b;
	}
	.notify-wrapper .item-wrapper .all-staff {
		font-size: 15px;
		color: #FF8C00;
		cursor: pointer;
		border: 0;
	}
	.notify-wrapper .item-wrapper .staff-list {
		width: 300px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.required {
		color: red;
	}
	.notify-wrapper .item-wrapper .title {
		height: 37px;
    	margin-top: 8px;
		padding-left: 10px;
	}
	.notify-wrapper .item-body .item-content {
		float: left;
		width: 100%;
		background: #fff;
		font-size: 15px;
		font-family: inherit;
		padding: 5px;
		border: 0;
	}
	.notify-wrapper .button-wrapper {
		width: 100%;
		height: 50px;
		text-align: center;
	}
	.notify-wrapper .button-wrapper.publish-wrapper::after {
		content: ' ';
		display: block;
		clear: both;
	}
	.notify-wrapper .button-wrapper .publish {
		width: 50%;
		height: 38px;
		margin: 20px 0;
		background-color: #FF8C00;
		color: #fff;
		border: 0;
		outline: 0;
		border-radius: 5px;
		font-size: 16px;;
	}
	.notify-wrapper .upload-wrapper {
		border: 0;
	}
	.notify-wrapper .button-wrapper .publish:hover {
		background-color: #FF9615;
	}
	/*收到的通知样式*/
	.workFlow-content .notify-list {
		width: 100%;
		text-align: center;
	}
	.workFlow-content .notify-list:after {
		display: block;
		content: ' ';
		clear: both;
	}
	.workFlow-content .notify-list .list-wrapper {
		width: 75%;
		height: 100%;
		margin: 20px auto;
		overflow: auto;
		
	}
	/*收到的通知搜索样式*/
	.workFlow-content .notify-list .search-wrapper {
		position: absolute;
		top: 65px;
		right: 27px;
		width: 322px;
		height: 40px;
		line-height: 40px;
		background-color: #FF8C00;		
		text-indent: 2em;
		padding: 10px 20px;
		margin-bottom: 10px;
		text-align: center;
		border: 0;
    	outline: 0;
		border: 1px solid #e1e1e1;
		border-radius: 4px;
	}
	.workFlow-content .notify-list .search-icon {
		position: absolute;
		top: 50%;
		right: 0px;
		transform: translate(-50% , -50%);
		font-size: 16px;
		z-index: 1;
	}
	.workFlow-content .notify-list .search-input {
		/*width: 70%;*/
		width: 97%;
		height: 72%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50% , -50%);
    	border: 0;
    	border-radius: 13px;		
		text-indent: 2em;
		font-size: 14px;
	}
	.workFlow-content .notify-list .item {
		position: relative;
		width: 100%;
		height: 110px;
		padding: 10px 20px;
		margin-bottom: 10px;
		text-align: center;
		background-color: #fff;
		border: 1px solid #e1e1e1;
		border-radius: 3px;
	}
	.workFlow-content .notify-list .item:hover {
		box-shadow: 0 1px 1px rgba(43,59,93,0.15),0 0 10px rgba(43,59,93,0.15);
	}
	.workFlow-content .notify-list .username {
		    position: absolute;
			top: 63px;
			left: 20px;
			width: 60px;
			font-size: 13px;
	}
	.workFlow-content .notify-list .item:after {
		display: block;
		content: ' ';
		clear: both;
	}
	.workFlow-content .notify-list .img-wrapper {
		float: left;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		margin-right: 20px;
	}
	.workFlow-content .notify-list .img-wrapper img{
		width: 100%;
		height: 60px;
		border-radius: 50%;
	}
	.workFlow-content .notify-list .article-wrapper {
		float: left;
	}
	.workFlow-content .notify-list .article-wrapper .sub {
		text-align: left;
		margin-bottom: 15px;
	}
	.workFlow-content .notify-list .article-wrapper .title {
		width: 253px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;		
		font-size: 15px;
	}
	.workFlow-content .notify-list .article-wrapper .article {
		width: 253px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		font-size: 12px;
		color: #999;
	}
	.workFlow-content .notify-list .article-wrapper .datetime {
		font-size: 11px;
		color: #bbb;
		margin-bottom: 0;
	}
	.notify-list .button-wrapper {
		width: 100%;
		height: 50px;
		text-align: center;
	}
	.notify-list .button-wrapper .next {
		display: inline-block;
		width: 7%;
		height: 38px;
		background-color: #FF8C00;
		color: #fff;
		border: 0;
		outline: 0;
		border-radius: 5px;
		font-size: 16px;;
	}
	.notify-list .button-wrapper .next:hover {
		background-color: #FF9615;
	}
	.notify-list .button-wrapper .page-num {
		display: inline-block;
		width: 10%;
		font-size: 14px;
		color: #FF8C00;
	}
	/*未读消息样式*/
	.notify-list .unread {
		position: absolute;
		top: 12px;
		left: 66px;
		height: 16px;
		width: 16px;
		background-color: #57ABFF;
		border-radius: 50%;
		border: 2px solid #fff;
	}
	/*通知详情样式*/
	.detail-wrapper {
		width: 80%;
		min-width: 700px;
		min-height: 500px;
	    padding: 10px 20px;
		margin: 20px auto;
		background-color: #fff;
		
	}
	.detail-wrapper .goback {
		padding: 0px 20px 20px 20px;
	}
	.detail-wrapper .goback {
		width: 20%;
		height: 20px;
		cursor: pointer;
		font-size: 14px;
		color: rgb(0, 140, 238);
	}
	.detail-wrapper .title-wrapper {
		height: 46px;
    	line-height: 46px;
		padding: 0 20px;
		margin-top: 23px;
		text-align: left;
		border-bottom: solid 1px rgba(153, 153, 153, 0.42);
	}	
	.detail-wrapper .title-wrapper h3 {
		width: 50%;
		font-size: 16px;
		font-family: '宋体';
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.detail-wrapper .info-wrapper {
	    height: 60px;
		padding: 10px 20px;
		color: #999;
	}
	.detail-wrapper .info-wrapper p:first-child {
		margin-bottom: 5px;
	}
	.detail-wrapper .info-wrapper .read {
		cursor: pointer;
	}
	.detail-wrapper .info-wrapper .read:hover {
		color: #38adff;
	}
	.detail-wrapper .content-wrapper {
		/*height: 200px;*/
		/*height: 170px;*/
		padding: 10px 20px 20px 20px;
		border-bottom: solid 1px rgba(153, 153, 153, 0.42);
		font-size: 15px;
		font-family: '宋体';
		overflow: auto;
	}
	.detail-wrapper .content-wrapper p {
		margin-bottom: 10px;
		word-break: break-word;
	}
	.detail-wrapper .download-wrapper {
		padding: 10px 20px 10px 20px;
		font-size: 14px;
		color: rgb(0, 140, 238);
	}
	.detail-wrapper .download-wrapper .download-item-wrapper {
		height: 20px;
		border-left: 3px solid #FF8C00;
	}
	.detail-wrapper .download-wrapper .download-item {
		color: #333;
		font: normal 14px Arial,verdana,Hiragino Sans GB,"宋体",Microsoft Yaheim;
	}
	.detail-wrapper .download-wrapper .accept-files-wrapper {
		margin-top: 10px;
	}
	.detail-wrapper .download-wrapper .accept-files-wrapper:after {
		content: ' ';
		display: block;
		clear: both;
	}
	.detail-wrapper .accept-files-wrapper .accept-files {
		float: left;
		margin: 13px 20px 10px 0;
		font-size: 13px;
	}
	.detail-wrapper .accept-files-wrapper .accept-files:hover .filename {
		color: rgb(0, 140, 238);
	}
	.detail-wrapper .accept-files-wrapper .accept-files .accept-icon {
		color: #9e9b9b;
	}
	.detail-wrapper .accept-files-wrapper .accept-files .filename {
		color: #000000;
	}
	.detail-wrapper .reply-wrapper {
		padding: 20px;
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
		margin-top: 2px;
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
	.detail-wrapper .reply-wrapper .reply-title-wrapper {
		height: 20px;
		line-height: 20px;
		border-left: solid 3px #FF8C00;
		
	}
	.reply-wrapper .reply-title-wrapper .reply-title {
		color: #333;
		font: normal 14px Arial,verdana,Hiragino Sans GB,"\5B8B\4F53",Microsoft Yaheim;
	}

	.header .header-title {
		display: inline-block;
		width: 120px;
		margin-left: 20px;
		font: normal 12px Arial,verdana,Hiragino Sans GB,"宋体",Microsoft Yaheim;
		font-weight: bold;
		font-size: 14px;
		color: #666;
	}
	.header .send-notify {
		display: inline-block;
		position: absolute;
		top: 50%;
		right: 20px;
		transform: translateY(-50%);
		width: 90px;
		height: 32px;
		border: 0;
		background-color: #FF8C00;
		color: #fff;
		font: normal 12px "宋体",Microsoft Yaheim;
	}
	.header .icon-back {
		position: absolute;
		top: 50%;
		left: 20px;
		transform: translateY(-50%);		
		width: 18px;
		height: 32px;
		background: url(../../static/public/triangle.png);
	}
	.header .btn-back {
		position: absolute;
		top: 50%;
		left: 37px;
		-webkit-transform: translateY(-50%);
		transform: translateY(-50%);
		width: 60px;
		height: 32px;
		border: 0;
		background-color: #FF8C00;
		color: #fff;
		font: normal 12px "\5B8B\4F53",Microsoft Yaheim;
	}
	.header .send-notify:hover {
		background-color: #FF9615;
	}
</style>