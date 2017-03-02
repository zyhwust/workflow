<template>
    <div id="mo_forgetPwd" v-if="visible.display">
        <div class="login-wrapper" :class="{'taller':taller}">
            <div class="content-wrapper">
                <div class="content1" >
                    <div class="phone-wrapper">
                        <input type="tel" class="input" v-model="phone" @keyup="canSendCode" @keydown.enter="sendCode" placeholder="请输入手机号" autofocus="autofocus"></input>
                        <button class="btn-sendcode" :class="{'disabled': sendDisabled}" id="send_code1" :disabled="sendDisabled" @click="sendCode">发送验证码</button>
                    </div>
                    <input type="text" class="input" v-model="code" @keyup="canChange" placeholder="请输入验证码"></input>
					<input type="password" class="input" v-model="pwd" @keyup="canChange" placeholder="请输入密码"></input>
					<input type="password" class="input" v-model="pwdAgain" @keyup="canChange" @keydown.enter="changePwd" placeholder="请再次输入密码"></input>
                    <button class="btn-sub" id="btn_register" :class="{'disabled': allowChange}" @click="changePwd" :disabled="allowChange">修改密码</button>
                </div>                
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        // props: ['informid'],
        ready () {
            var vm = this;
            // vm.loadData();
			vm.phone = '';
			vm.code = '';
			vm.pwd = '';
			vm.pwdAgain = '';
        },
        data () {
            return {
                visible: this.$root.forgetPwd,
				phone: '',
				// 验证码
				code: '',
				pwd: '',
				pwdAgain: '',
				// 是否在发送短信
				sending: false,	
				// 判断是否符合发送短信条件,true为不符合
				sendDisabled: true,		
				// 修改按钮是否可点击
				allowChange: true
            }
        },
        methods: {  
			regLegal(label) {
				var reg = {
					phone: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
					pwd: /^\w+$/,
					pwdAgain: /^\w+$/,
					code: /^\d+$/,
					name: /^[\u4E00-\u9FA5]{2,5}$/,
					password: /^\w+$/,
					invitedCode: /^[a-z0-9]+$/i
				}
				return this[label]!=''&&reg[label].test(this[label]);
			},			
			// 能否发送短信验证码
			canSendCode() {
				if(this.sending === true) {
					return;
				}else {
					this.sendDisabled = !this.regLegal('phone');
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
				$('#send_code1').attr('disabled' , 'true');
				$('#send_code1').html(time+'s');
				$('#send_code1').attr('class' , 'btn-sendcode disabled');
				var handler = setInterval(function() {
					$('#send_code1').html(--time+'s');
					if(time==0) {
						$('#send_code1').attr('class' , 'btn-sendcode');
						$('#send_code1').html('发送验证码');
						$('#send_code1').removeAttr('disabled');
						vm.sending = false;
						clearInterval(handler);
					}
				} , 1000);
				// 调用发送验证码接口，判断用户是否需要注册
				$.ajax({
					type:'post',
					url: BASE.url+'/home/company/1422.spring',
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
			// 判断能否修改密码
			canChange() {
				if(this.regLegal('phone')&&this.regLegal('code')&&this.regLegal('pwd')&&this.regLegal('pwdAgain')) {
					this.allowChange = false;
				}else {
					this.allowChange = true;
				}
			},
			// 调用修改密码接口
			changePwd() {
				var vm = this;
				if(vm.pwd != vm.pwdAgain) {
					tools.toast('两次密码输入不一致', 'error');
					return;
				}
				if(vm.allowChange === true) {
					return;
				}
				var obj1423 = {
					url: '/home/company/1423.spring',
					args: {
						"phone": vm.phone,
						"code": vm.code,
						"password": hex_md5(vm.pwd).toUpperCase()	
					},
					success: function() {
						tools.toast('修改成功', 'success');
						vm.$root.forgetPwd.display = false;
						vm.$root.overlay2.display = false;
					}		
				};
				Ajax(obj1423);
			}
        }
    }
</script>

<style>
	#mo_forgetPwd {
	} 
	#mo_forgetPwd .content1 {
		position: relative;
	}
	#mo_forgetPwd .content1 .forget-pwd {
		position: absolute;
		right: 0;
		color: #38adff;
		margin-top: 10px;
		font-size: 14px;
		cursor: pointer;		
	}
	#mo_forgetPwd .content1 .forget-pwd:hover {
		color: #60bdff;
	}
	#mo_forgetPwd .title-wrapper {
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
	#mo_forgetPwd .title-wrapper .MOA {
		font-size: 48px;
		letter-spacing: 2px;
		margin-right: 10px;
	}
	#mo_forgetPwd .login-bg {
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
	#mo_forgetPwd .login-wrapper {
		z-index: 9;
		position: absolute;
		width: 372px;
		height: 321px;		
		top: 50%;
		left: 50%;
		margin-top: -160px;
		margin-left: -186px;
		background: url('../../static/login/login-wrapper.png') no-repeat #e6f2f8;
		border-radius: 5px;
		box-shadow: rgba(0,0,0,0.15) 0 0 8px;;
	}
	#mo_forgetPwd .taller {
		height: 485px;
	}
	#mo_forgetPwd .items-wrapper {
		height: 44px;
		background-color: #e7f0f1;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
	}
	#mo_forgetPwd .items-wrapper .tab-item {
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
	#mo_forgetPwd .items-wrapper .tab-item:first-child {
		border-top-left-radius: 5px;
	}
	#mo_forgetPwd .items-wrapper .tab-item:last-child {
		border-top-right-radius: 5px;
	}
	#mo_forgetPwd .items-wrapper .selected {
		background-color: #c6e0ec;
		border-color: #c6e0ec;
		border-top-left-radius: 3px;
	    border-top-right-radius: 3px;
	    font-size: 14px;
	    color: #000;
	}
	#mo_forgetPwd .content-wrapper {
		padding: 25px 30px 0;
	}
	#mo_forgetPwd .logo-wrapper {
		position: relative;
		margin-left: -33px;
		width: 66px;
		height: 66px;
		left: 50%;
		margin-bottom: 13px;
	}
	#mo_forgetPwd .logo-wrapper .logo{
		position: relative;
		width: 100%;
		height: 100%;
	}
	#mo_forgetPwd .content-wrapper .input {
		width: 312px;
		height: 40px;
		padding: 5px 15px;
		margin-bottom: 15px;
		color: #222;
		font-size: 15px;
		background-color: #deeef5;
		border: 1px solid #baced9;
		border-radius: 3px;
		outline: 0;
	}
	#mo_forgetPwd .content-wrapper .btn-sub {
		width: 312px;
		margin-top: 9px;
		height: 38px;
		line-height: 37px;
		border: 0;
		border-radius: 3px;
		background-color: #008cee;
		color: #fff;
		font-size: 15px;
	}
	#mo_forgetPwd .content-wrapper .btn-sub:hover{
		background-color: #46b2fe;
	}
	#mo_forgetPwd .phone-wrapper .input {
		float: left;
		width: 72%;
	}
	#mo_forgetPwd .phone-wrapper .btn-sendcode {
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
	#mo_forgetPwd .phone-wrapper .btn-sendcode:hover {
		background-color: #46b2fe;
	}
	#mo_forgetPwd .phone-wrapper .btn-sendcode.disabled{
		background-color: #c7c7cc;
		cursor: default;
	}
	#mo_forgetPwd  .btn-sub.disabled{
		background-color: #c7c7cc;
		cursor: default;
	}
	#mo_forgetPwd  .btn-sub.disabled:hover{
		background-color: #c7c7cc;
		cursor: default;
	}
</style>