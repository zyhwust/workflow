<template>
  <div id="bindphone" v-if="visible.display">
    <div id="info_header">
      <span class="title">修改密码</span>
      <i class="fa fa-close fa-2x info-close" @click="close()" aria-hidden="true"></i>
    </div>
    <div id="info_content">

      <div class="list">
       
        <div class="input-item">
          <input class="input" v-model="originPwd" type="password" placeholder="请输入原始密码"/></input>
        </div>

        <div class="input-item">
          <input class="input" id="pwd" v-model="newPwd" type="password" placeholder="请输入新密码"></input>
        </div>

        <div class="input-item">
          <input class="input" id="pwd1" v-model="newPwdRepeat" type="password" placeholder="请再次输入新密码"></input>
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
      visible:this.$root.changepwd,
      personnelId:localStorage.personnelId,
      userId:localStorage.userId,
      originPwd: "",
      newPwd: "",
      newPwdRepeat: ""
    }
  },
  methods : {
    close: function () {
      this.$root.changepwd.display=false;
      this.$root.overlay.display=false;
    },
    submit: function () {
      if(!this.originPwd || !this.newPwd || !this.newPwdRepeat){
        tools.toast("请输入密码！","error");
        return;
      }
      if(this.newPwd!=this.newPwdRepeat){
        tools.toast("两次输入的密码不同！","error");
        return;
      }
      var vm = this;
      if(this.personnelId&&this.userId){
        // 调用绑定手机号接口
        var obj1033 = {
          url: '/home/user/1033.spring',
          args: {
            "oldPassword": hex_md5(vm.originPwd).toUpperCase(),
            "userId": vm.userId,
            "newPassword": vm.newPwd,            
          },
          success: function (res) {
            tools.toast("修改成功！","success");
            vm.close();
            vm.originPwd = '';
            vm.newPwd = '';
            vm.newPwdRepeat = '';
          }
        }
        Ajax(obj1033);
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
  height: 335px;
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
  left: 50%;
  transform: translateX(-50%);
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
  padding-top: 30px;
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
