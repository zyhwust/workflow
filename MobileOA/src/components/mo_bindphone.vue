<template>
  <div id="bindphone" v-if="visible.display">
    <div id="info_header">
      <span class="title">绑定手机号码</span>
      <i class="fa fa-close fa-2x info-close" @click="close()" aria-hidden="true"></i>
    </div>
    <div id="info_content">

      <div class="list">

        <div class="input-item">
          <input class="input" id="personnelId" type="text" placeholder="{{personnelId}}" disabled="disabled"></input>
        </div>

        <div class="input-item">
          <input class="input" id="name" v-model="name" type="text" placeholder="请输入您的姓名"></input>
        </div>

        <div class="input-item">
          <input class="input" id="phone" v-model="phone" type="text" placeholder="请输入手机号码"></input>
          <button class="btn-sendcode " id="send_code"  @click="sendCode()">发送验证码</button>
        </div>

        <div class="input-item">
          <input class="input" v-model="code" type="text" placeholder="请输入验证码"/></input>
        </div>

        <div class="input-item">
          <input class="input" id="pwd" v-model="pwd" type="password" placeholder="请输入密码"></input>
        </div>

        <div class="input-item">
          <input class="input" id="pwd1" v-model="pwd1" type="password" placeholder="请再次输入密码"></input>
        </div>

        <div class="input-item">
          <button @click="submit()" class="btn-sendcode" id="submit" >确定</button>
        </div>

      </div>

    </div>
  </div>
</template>

<script>

export default {
  ready() {
  },
  data(){
    return {
      visible:this.$root.bindphone,
      personnelId:localStorage.personnelId,
      sendDisabled:false,
      sending:false,
      phone:"",
      code:"",
      userId:localStorage.userId,
      pwd: "",
      pwd1: "",
      name: ""
    }
  },
  methods : {
    close: function () {
      this.$root.bindphone.display=false;
      this.$root.overlay.display=false;
    },
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
    // 发送短信验证码
    sendCode() {
      // console.log("rst.msg");
      if(this.sendDisabled === true||this.sending === true) {
        return;
      }
      if(!this.phone){
        tools.toast("请输入手机号！","error");
        return;
      }
      if(!this.regLegal('phone')){
        tools.toast("手机号格式不正确！","error");
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
      var obj = {
        url: '/home/company/1409.spring',
        args: {
          "phone": vm.phone
        },
        success: function (rst) {
          if(rst.code == 1) {
            tools.toast("发送成功","success");
            return;
          }
          if(rst.code == 0 || rst.code == 3) {
            alert(rst.msg);
          }
        },
        asy: false
      }
      Ajax(obj);
    },
    submit: function () {
      if(!this.name){
        tools.toast("请输入您的名字！","error");
        return;
      }
      if(this.name != localStorage.userName){
        tools.toast("您的名字输入错误！","error");
        return;
      }
      if(!this.phone){
        tools.toast("请输入手机号！","error");
        return;
      }
      if(!this.code){
        tools.toast("请输入验证码！","error");
        return;
      }
      if(!this.pwd){
        tools.toast("请输入密码！","error");
        return;
      }
      if(this.pwd!=this.pwd1){
        tools.toast("两次输入的密码不同！","error");
        return;
      }
      var vm = this;
      if(this.phone&&this.personnelId&&this.userId){
        // 调用绑定手机号接口
        var obj = {
          url: '/home/login/1413.spring',
          args: {
            "phone": vm.phone,
            "code": vm.code,
            "userId": vm.userId,
            "password": hex_md5(vm.pwd).toUpperCase()
          },
          success: function (res) {
            if(res.code!=1) {
              tools.toast(res.msg,"error");
              return;
            }
            if(res.code == 1){
              localStorage.phone = vm.phone;
              localStorage.telephone = 1;
              tools.toast("绑定成功！","success");
              vm.close();
            }
          },
          asy: false
        }
        Ajax(obj);
      }
    }
  }
}
</script>

<style scoped>
#bindphone{
  position: fixed;
  left: 50%;
  top:50%;
  width: 375px;
  height: 511px;
  margin-left: -187.5px;
  margin-top: -255.5px;
  box-shadow: rgba(0,0,0,0.15) 0 0 6px;
  border-radius: 9px;
  display: flex;
  flex-flow: column nowrap;
  background: url(/static/img/login-wrapper.cf01c34.png) no-repeat #e6f2f8;
  /*background-size: 100%;*/
  z-index: 100;
}
#info_header{
    height: 50px;
    border-bottom: 1px solid #ede9e5;
    background-color: rgb(249, 249, 249);
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    position: relative;
    overflow: hidden;
    color: #262a2f;
}
.title{
  position: absolute;
  left: 130px;
  top: 15px;
  font-size: 17px;
}
.info-close{
  position: absolute;
  top: 10px;
  right: 7px;
  width: 21px;
  height: 21px;
  cursor: pointer;
  color: #5e6166;
  font-size: 25px;
  font-weight: lighter;
}
#info_content{
  -webkit-flex: 1;
  /*background-color: #fff;*/
  max-width: 375px;
  overflow-y: auto;
}
.list{
  padding-top: 50px;
  width: 300px;
  margin: 0 auto;
}
.input-item{
  margin: 10px auto;
}
.input{
  height: 40px;
  width: 300px;
  text-indent: 10px;
  border-radius: 3px;
  border: 1px solid #ccc;
}
#phone{
  width: 190px;
}
#send_code{
  width: 100px;
  height: 40px;
  line-height: 40px;
  border-radius: 3px;
  border: 0;
  font-size: 13px;
  float: right;
  background-color: #008cee;
  color: #fff;
}
#submit{
  width: 300px;
  height: 40px;
  line-height: 40px;
  border-radius: 3px;
  border: 0;
  font-size: 13px;
  margin-top: 20px;
  background-color: #008cee;
  color: #fff;
}


.user_info{
  position: absolute;
  left: 23px;
  top: 51px;
  width: 57px;
  height: 57px;
  border-radius: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  box-sizing: border-box;
  border: 2px solid #fff;
}
.user_img{
  width: 100%;
  height: 100%;
}
.detail-info{
  position: absolute;
  left: 89px;
  top: 71px;
}
.name{
  display: inline-block;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  line-height: 20px;
  color: #fff;
  font-size: 19px;
}
.certification{
  position: absolute;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    padding: 5px 5px 5px 23px;
    background-color: rgba(0,0,0,0.2);
    line-height: 17px;
    color: #fff;
    font-size: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;
}

.detail-box{
  margin: 15px 5px 0 25px;
  padding-bottom: 11px;
}
.box-item{
  position: relative;
  margin-top: 13px;
  line-height: 20px;
}

.info_label{
  width: 18%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  margin-right: 3em;
  color: #aeaeb2;
  font-size: 15px;
}
#info_footer{
  min-height: 53px;
  border-top: 1px solid #e3e3e5;
  background-color: #f9f9f9;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
}
.can_use{
  box-sizing: border-box;
  float: left;
  width: 33.33%;
  margin-top: 18px;
  border-right: 1px solid #d7d6d9;
  text-align: center;
  cursor: pointer;
  color: #aeaeb2;
  font-size: 15px;
}
.cant_use{
  box-sizing: border-box;
  float: left;
  width: 33.33%;
  margin-top: 18px;
  border-right: 1px solid #d7d6d9;
  text-align: center;
  cursor: pointer;
  color: #38adff;
  font-size: 15px;
}
.info-icon{
  height: 17px;
  width: 17px;
  margin-right: 3px;
}
</style>
