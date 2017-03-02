<template>
	<mo_overlay></mo_overlay>
	<mo_overlay2></mo_overlay2>
	<mo_forgetpwd></mo_forgetpwd>
	<div id="ma_login">
		<div class="title-wrapper">
			<p><span class="MOA">MOA</span><span>医家</span><span>|</span><span>武汉市第五医院</span></p>
		</div>
		<div class="login-bg"></div>
		<div class="login-wrapper" :class="{'taller':taller}">
			<ul class="items-wrapper">
				<!--<li class="tab-item" :class="{'selected':tabIsActive.code}" @click="changeTab('code')">扫码登录</li>-->
				<li class="tab-item" :class="{'selected':tabIsActive.code}">扫码登录</li>
				<li class="tab-item" :class="{'selected':tabIsActive.pwd}" @click="changeTab('pwd')">密码登录</li>
				<li class="tab-item" :class="{'selected':tabIsActive.msg}" @click="changeTab('msg')">验证码登录</li>
			</ul>
			<div class="content-wrapper">
				<div class="content1" v-if="tabIsActive.pwd">
					<div class="logo-wrapper">
						<img class="logo" src="../../@3.png" alt>
					</div>
					<input type="tel" class="input" v-model="phone" @keyup="canPwdlogin" placeholder="请输入手机号或人事工号" value="" autofocus></input>
					<input type="password" class="input" v-model="pwd" @keyup="canPwdlogin" @keydown.enter="pwdLogin" placeholder="请输入密码"></input>
					<button class="btn-sub" :class="{'disabled': allowPwdLogin}" :disabled="allowPwdLogin" @click="pwdLogin">登录</button>
					<span class="forget-pwd" @click="forgetPwd">忘记密码</span>
				</div>
				<div class="content1" v-if="tabIsActive.msg">
					<div class="logo-wrapper">
						<img class="logo" src="../../@3.png" alt>
					</div>
					<div class="phone-wrapper">
						<input type="tel" class="input" v-model="phone" @focus="canCodelogin" @keyup="canSendCode" @keydown.enter="sendCode" placeholder="请输入手机号" autofocus="autofocus"></input>
						<button class="btn-sendcode" :class="{'disabled': sendDisabled}" id="send_code" :disabled="sendDisabled" @click="sendCode">发送验证码</button>
					</div>
					<input type="text" class="input" v-model="code" @keyup="canCodelogin" placeholder="请输入验证码"></input>

					<input type="text" class="input" v-if="needRegister" v-model="name" @keyup="canCodelogin" placeholder="请输入姓名"></input>
					<input type="password" class="input" v-if="needRegister" v-model="password" @keyup="canCodelogin" @keydown.enter="codeLogin" placeholder="请输入密码"></input>
					<input type="text" class="input" v-if="needRegister" v-model="invitedCode" @keyup="canCodelogin" @keydown.enter="codeLogin" placeholder="请输入邀请码"></input>
					<button class="btn-sub" id="btn_register" :class="{'disabled': allowCodeLogin}" @click="codeLogin" :disabled="allowCodeLogin">登录</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import mo_overlay from './mo_overlay.vue';
	import mo_overlay2 from './mo_overlay2.vue';
	import mo_forgetpwd from './mo_forgetPwd.vue';
	export default {
		components: {
			mo_overlay,
			mo_overlay2,
			mo_forgetpwd
		},
		data () {
			return {
				// 判断是否符合发送短信条件,true为不符合
				sendDisabled: true,
				// 判断是否符合密码登录条件
				allowPwdLogin: false,
				// 判断是否符合验证码登录条件
				allowCodeLogin: true,
				// 判断登录方式
				tabIsActive: {
					'pwd': true,
					'code': false,
					'msg': false
				},
				// 用户电话
				phone: '',
				// 用户密码
				password: '',
				// 用户短信验证码
				code: '',
				// 用户姓名
				name: '',
				// 用户密码
				pwd: '',
				// 是否需要注册
				needRegister: false,
				// 是否在发送短信
				sending: false,
				// 邀请码
				invitedCode: ''
			}
		},
		created() {
			var vm = this;
			// if(localStorage.isLogined == 'true') {
			// 	vm.$root.huanxin(
			// 		function(){
			// 			this.$route.router.go('main');
			// 		}
			// 	);
			// }
		},
		computed: {
			// 用户注册加高div
			taller: function() {
				var temp = this.tabIsActive.msg&&this.needRegister
				return temp;
			}
		},
		methods: {
			// 忘记密码
			forgetPwd() {
				var vm = this;
				vm.$root.overlay2.display = true;
				vm.$root.forgetPwd.display = true;
			},
			getSid:function(){
				var vm = this;
				//登陆获取sid
				$.ajax({
					type:'post',
					asy: false,
					url:BASE.JFurl+'/Jflow/2001.do',
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
			},
			// 切换登录方式
			changeTab(tab) {
				for(var key in this.tabIsActive) {
					this.tabIsActive[key] = false;
				}
				this.tabIsActive[tab] = true;
			},
			/**
			 * 验证各种字段是否非法
			 * @param  {string} label 字段名称
			 * @return {false}       非法
			 */
			regLegal(label) {
				var reg = {
					phone: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
					pwd: /^\w+$/,
					code: /^\d+$/,
					name: /^[\u4E00-\u9FA5]{2,5}$/,
					password: /^\w+$/,
					invitedCode: /^[a-z0-9]+$/i
				}
				return this[label]!=''&&reg[label].test(this[label]);
			},
			// 判断能否通过密码方式登录
			canPwdlogin() {
				if(this.regLegal('phone')&&this.regLegal('pwd')) {
					this.allowPwdLogin = false;
				}else {
					this.allowPwdLogin = false;
				}
			},
			// 能否发送短信验证码
			canSendCode() {
				if(this.sending === true) {
					return;
				}else {
					this.sendDisabled = !this.regLegal('phone');
				}
			},
			// 判断能否通过验证码方式登录
			canCodelogin() {
				if(this.needRegister === false) {
					if(this.regLegal('phone')&&this.regLegal('code')) {
						this.allowCodeLogin = false;
					}else {
						this.allowCodeLogin = true;
					}
				}
				if(this.needRegister === true) {
					if(this.regLegal('phone')&&this.regLegal('code')&&this.regLegal('name')&&this.regLegal('password')&&this.regLegal('invitedCode')) {
						this.allowCodeLogin = false;
					}else {
						this.allowCodeLogin = true;
					}
				}
			},
			// 发送短信验证码
			sendCode() {
				if(this.sendDisabled === true||this.sending === true) {
					return;
				}
				this.sending = true;
				var send_flag = false,
					time = 60,
					vm = this;
				$('#send_code').attr('disabled' , 'true');
				$('#send_code').html(time+'s');
				$('#send_code').attr('class' , 'btn-sendcode disabled');
				var handler = setInterval(function() {
					$('#send_code').html(--time+'s');
					if(time==0) {
						$('#send_code').attr('class' , 'btn-sendcode');
						$('#send_code').html('发送验证码');
						$('#send_code').removeAttr('disabled');
						vm.sending = false;
						clearInterval(handler);
					}
				} , 1000);
				// 调用发送验证码接口，判断用户是否需要注册
				$.ajax({
					type:'post',
					url: BASE.url+'/home/company/1409.spring',
					contentType: 'application/json',
					data:JSON.stringify({
						"phone": vm.phone,
					}),
				}).then(function(rst) {
					if(rst.code == 2) {
						vm.needRegister = true;
						$('#btn_register').html('注册');
					}
					if(rst.code == 0 || rst.code == 3) {
						alert(rst.msg);
					}
				} , function() {alert('error');});
			},
			// 用户账号密码登录
			pwdLogin() {
				tools.busy();
				if(this.allowPwdLogin === true) {
					tools.busy(false);
					return;
				}
				var vm = this;
				if(vm.phone == '' || vm.pwd == '') {
					tools.busy(false);
					return tools.toast('用户名或密码错误', 'error');
				}
				if(this.regLegal('phone')) {
					// 电话号码登陆
					$.ajax({
						type:'post',
						url: BASE.url+'/home/company/1406.spring',
						contentType: 'application/json',
						data:JSON.stringify({
							"phone": vm.phone,
							"personnelId": "",
							"userPassword": hex_md5(vm.pwd).toUpperCase(),
							"deviceType": 'web'
						}),
					}).then(function(rst) {
						if(rst.code!=1) {
							tools.toast(rst.msg,"error");
							tools.busy(false);
							return;
						}
						if(rst.code == 1) {
							// localStorage.isLogined = true;
							localStorage.phone = vm.phone;
							localStorage.personnelId = vm.phone; // 人事工号
							localStorage.deviceId = "" //deviceId
							localStorage.type = "web" //type
							localStorage.telephone = rst.data.telephone; // 是否绑定手机0 未绑定 1绑定
							localStorage.id = rst.data.id;	// 人员ID
							localStorage.userId = rst.data.id;	// 人员ID
							localStorage.userName = rst.data.realname; // 人员姓名
							localStorage.pwd = hex_md5(vm.pwd).toUpperCase(); //密码
							localStorage.HXpsw = rst.data.HXpsw; //环信密码
							localStorage.sid = rst.data.sid; // sid
							vm.getSid();

							// getMsg();
							getWebSocket();
						}
						tools.busy(false);
						vm.$root.huanxin(
							function(){
								this.$route.router.go('main');
							});

			// 			if(rst.code!=1) {
			// 				tools.toast(rst.msg,"error");
			// 				tools.busy(false);
			// 				return;
			// 			}
			// 			localStorage.phone = vm.phone; // 电话号码
			// 			localStorage.deviceId = "" //deviceId
			// 			localStorage.type = "web" //type
			// 			localStorage.userId = rst.data[0].id;  // 人员ID
			// 			localStorage.id = rst.data.id;	// 人员ID
			// 			localStorage.pwd = hex_md5(vm.pwd).toUpperCase();
            // localStorage.HXpsw = rst.data.HXpsw; //环信密码
			// 			vm.$root.huanxin(
			// 				function(){
			// 					this.$route.router.go('main');
			// 				});
					} , function() {alert('error');});
				}else{
					// 工号登陆
					$.ajax({
						type:'post',
						url: BASE.url+'/home/company/1406.spring',
						contentType: 'application/json',
						data:JSON.stringify({
							"phone": "",
							"personnelId": vm.phone,
							"userPassword": hex_md5(vm.pwd).toUpperCase(),
							"deviceType": 'web'
						}),
					}).then(function(rst) {
            console.log(rst);
						if(rst.code!=1) {
							tools.toast(rst.msg,"error");
							tools.busy(false);
							return;
						}
						if(rst.code == 1) {
							// localStorage.isLogined = true;
							localStorage.personnelId = vm.phone; // 人事工号
							localStorage.deviceId = "" //deviceId
							localStorage.type = "web" //type
							localStorage.telephone = rst.data.telephone; // 是否绑定手机0 未绑定 1绑定
							localStorage.id = rst.data.id;	// 人员ID
							localStorage.userId = rst.data.id;	// 人员ID
							localStorage.userName = rst.data.realname; // 人员姓名
							localStorage.pwd = hex_md5(vm.pwd).toUpperCase(); //密码
							localStorage.HXpsw = rst.data.HXpsw; //环信密码
							localStorage.sid = rst.data.sid; // sid
							vm.getSid();

							// getMsg();
							getWebSocket();
						}
						tools.busy(false);
						vm.$root.huanxin(
							function(){
								this.$route.router.go('main');
							});
					} , function() {alert('error');});
				}
			},
			// 用验证码登录
			codeLogin() {
				if(this.allowCodeLogin === true) {
					return;
				}
				var vm = this;
				if(vm.needRegister === true) {
					vm.register();
					return;
				}
				$.ajax({
					type:'post',
					url: BASE.url+'/home/login/1412.spring',
					contentType: 'application/json',
					data:JSON.stringify({
						"phone": vm.phone,
						"code": vm.code
					}),
				}).then(function(rst) {
					if(rst.code!=1) {
						alert(rst.msg);
						return;
					}
					localStorage.user = vm.phone;
					localStorage.pwd = vm.pwd;
					vm.$root.huanxin(
						function(){
							this.$route.router.go('main');
						});
				} , function() {alert('error');});
			},
			// 注册用户
			register() {
				var vm = this;
				// 调用注册接口
				$.ajax({
					type:'post',
					url: BASE.url+'/home/login/1413.spring',
					contentType: 'application/json',
					data:JSON.stringify({
						"phone": vm.phone,
						"password": vm.password,
						"name": vm.name,
						"invitedCode":vm.invitedCode,
						"code": vm.code
					}),
				}).then(function(rst) {
					if(rst.code!=1) {
						alert(rst.msg);
						return;
					}
					// 调用登录接口跳转至系统
					$.ajax({
						type:'post',
						url: BASE.url+'/home/company/1406.spring',
						contentType: 'application/json',
						data:JSON.stringify({
							"userTelephone": vm.phone,
							"userPassword": vm.password
						}),
					}).then(function(rst) {
						if(rst.code!=1) {
							alert(rst.msg);
							return;
						}
						localStorage.userId = rst.data[0].id;
						localStorage.user = vm.phone;
						// localStorage.pwd = vm.pwd;
						vm.$root.huanxin(
							function(){
								this.$route.router.go('main');
							});
					} , function() {alert('error');});
					/*var options = {
						username : vm.phone,
						password : vm.password,
						appKey : '516881172#mo',
						success : function(result) {
							alert('注册成功');
							localStorage.user = vm.phone;
							localStorage.pwd = vm.pwd;
							// 调用登录接口跳转至系统
							$.ajax({
								type:'post',
								url: BASE.url+'/home/company/1406.spring',
								contentType: 'application/json',
								data:JSON.stringify({
									"userTelephone": vm.phone,
									"userPassword": vm.pwd
								}),
							}).then(function(rst) {
								if(rst.code!=1) {
									alert(rst.msg);
									return;
								}
								localStorage.userId = rst.data[0].id;
								localStorage.user = vm.phone;
								localStorage.pwd = vm.pwd;
								vm.$root.huanxin(
									function(){
										this.$route.router.go('main');
									});
							} , function() {alert('error');});
						},
						error : function(e) {
							alert('注册环信失败');
						}
					};
					Easemob.im.Helper.registerUser(options);*/
				} , function() {alert('error');});
			}
		}
	}
</script>

<style>
	#ma_login {
		/*position: relative;
		width: 100%;
		height: 100%;
		background: url('../../static/login/main-bg.png') no-repeat #5a83b7;;
		background-size: cover;*/

		position: relative;
		width: 1200px;
		height: 700px;
		margin: 0 auto;
		top: 50%;
		-webkit-transform: translateY(-50%);
		transform: translateY(-50%);	
	} 
	#ma_login .content1 {
		position: relative;
	}
	#ma_login .content1 .forget-pwd {
		position: absolute;
		right: 0;
		color: #38adff;
		margin-top: 10px;
		font-size: 14px;
		cursor: pointer;		
	}
	#ma_login .content1 .forget-pwd:hover {
		color: #60bdff;
	}
	#ma_login .title-wrapper {
		position: absolute;
		top: 122px;
		left: 127px;
		height: 50px;
		line-height: 50px;
		font-size: 25px;
		color: #fff;
		background-color: #1f7eef;
		text-align: left;		
		/* text-shadow: 1px 1px 1px; */
		letter-spacing: 7px;
		border-radius: 1px;
	}
	#ma_login .title-wrapper .MOA {
		font-size: 48px;
		letter-spacing: 2px;
		margin-right: 10px;
	}
	#ma_login .login-bg {
		position: absolute;
		top: 184px;
		left: 127px;
		width: 540px;
		height: 343px;		
		background: url('../../static/login/login-bg.png') center center no-repeat #e6f2f8;
		background-size: contain;	
		border-radius: 5px;
		box-shadow: 0 0 8px rgba(0,0,0,.15);			
		}
	#ma_login .login-wrapper {
		position: absolute;
		top: 184px;
		left: 687px;
		width: 372px;
		height: 343px;
		background: url('../../static/login/login-wrapper.png') no-repeat #e6f2f8;
		border-radius: 5px;
		box-shadow: rgba(0,0,0,0.15) 0 0 8px;;
	}
	#ma_login .taller {
		height: 485px;
	}
	#ma_login .items-wrapper {
		height: 44px;
		background-color: #e7f0f1;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
	}
	#ma_login .items-wrapper .tab-item {
		float: left;
		width: 33.3333333%;
		height: 46px;
		line-height: 46px;
		border-color: #c6e0ec;
		font-size: 13px;
		border-bottom: 1px solid #e1e1e1;
		color: #7d7d7e;;
		text-align: center;
	}
	#ma_login .items-wrapper .tab-item:first-child {
		border-top-left-radius: 5px;
	}
	#ma_login .items-wrapper .tab-item:last-child {
		border-top-right-radius: 5px;
	}
	#ma_login .items-wrapper .selected {
		background-color: #c6e0ec;
		border-color: #c6e0ec;
		border-top-left-radius: 3px;
	    border-top-right-radius: 3px;
	    font-size: 14px;
	    color: #000;
	}
	#ma_login .content-wrapper {
		padding: 25px 30px 0;
	}
	#ma_login .logo-wrapper {
		position: relative;
		margin-left: -33px;
		width: 66px;
		height: 66px;
		left: 50%;
		margin-bottom: 13px;
	}
	#ma_login .logo-wrapper .logo{
		position: relative;
		width: 100%;
		height: 100%;
	}
	#ma_login .content-wrapper .input {
		width: 312px;
		height: 40px;
		padding: 5px 15px;
		margin-bottom: 10px;
		color: #222;
		font-size: 15px;
		background-color: #deeef5;
		border: 1px solid #baced9;
		border-radius: 3px;
		outline: 0;
	}
	#ma_login .content-wrapper .btn-sub {
		display: block;
		width: 312px;
		margin-top: 15px;
		height: 38px;
		line-height: 37px;
		border: 0;
		border-radius: 3px;
		background-color: #008cee;
		color: #fff;
		font-size: 15px;
	}
	#ma_login .content-wrapper .btn-sub:hover{
		background-color: #46b2fe;
	}
	#ma_login .phone-wrapper .input {
		float: left;
		width: 72%;
	}
	#ma_login .phone-wrapper .btn-sendcode {
		float: right;
		width: 80px;
		height: 40px;
		line-height: 40px;
		border: 0;
		border-radius: 3px;
		font-size: 13px;
		background-color: #008cee;
		color: #fff;
	}
	#ma_login .phone-wrapper .btn-sendcode:hover {
		background-color: #46b2fe;
	}
	#ma_login .phone-wrapper .btn-sendcode.disabled{
		background-color: #c7c7cc;
		cursor: default;
	}
	#ma_login  .btn-sub.disabled{
		background-color: #c7c7cc;
		cursor: default;
	}
	#ma_login  .btn-sub.disabled:hover{
		background-color: #c7c7cc;
		cursor: default;
	}
</style>
