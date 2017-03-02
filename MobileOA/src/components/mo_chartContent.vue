<template>
  <div id="content">
    <!-- 群成员 -->
    <div id="groupmember" class="slideright1">
      <!--<div class="line1"> 群成员 <span class="addmember" :class="{'hide': notOwner}" @click="addGroupMember">&nbsp;+添加群成员</span><span class="close">x</span></div>-->
      <div class="line1"> 群成员 <span class="addmember" :class="{'hide': notOwner}" @click="addGroupMember">&nbsp;+添加群成员</span><span class="close slider-close fa fa-times"></span></div>
      <div class="line2">
        <div v-for="user in groupUsers" class="userItem">
          <img class="userItem-img"  :src="user.img" v-on:error="getDefaultImg"/>
          <div class="userItem-text">{{user.name.substr(user.name.length-2)}}</div>
          <div class="rm-person" :class="{'hide': notOwner}">
            <i class="rm fa fa-times" aria-hidden="true" data-id={{user.id}} data-groupid={{user.groupid}} @click="removePerson"></i>
          </div>
        </div>
      </div>
      <div class="line3">
        <button class="out" @click="quitGroup">退出群聊</button>
      </div>
    </div>
    <!-- 群公告 -->
    <div id="groupnotice" class="slideright1">
      <!--<div class="line1"> 群公告 <span @click="close_gonggao" class="close">x</span></div>-->
      <div class="line1"> 群公告 <span @click="close_gonggao" class="close slider-close fa fa-times"></span></div>
      <div class="line2">
        <div class="line2_label">
          <div v-if="editor" class="line2_label_wrap">
            <label class="">{{editorName}}</label>&nbsp更新于&nbsp<label>{{updateTime}}</label><br>
          </div>
        </div>
        <textarea v-if="edit" class="textarea" id="notice_content" cols="30" rows="10" v-model="notice_content"></textarea>
        <textarea v-else readonly class="textarea" id="editArea" cols="30" rows="10" v-model="notice_content"></textarea>
      </div>
      <div class="line3">
        <button v-if="!edit" class="button" id="edit_gonggao" @click="edit_gonggao()">编辑公告</button>
        <div v-else class="line_wrap">

          <button id="post_gonggao" @click="post_gonggao()">发布公告</button>
          <button id="cancel" @click="cancel()">取消</button>
        </div>
      </div>
    </div>
    <div id="header">
      {{$route.params.name}}
      <img id="usergroup" src="../../static/img/usergroup.png">
      <i id="notice" @click="show_gonggao()" aria-hidden="true" class="fa fa-bullhorn notice-icon"></i>
    </div>
    <div id="allMsg">
      <div class="at-bar">有人@你</div>
      <div id="msgs">

        <div id="msgItem" v-for="item in msgItems[$route.params.id]">
          <mo_chart_message v-bind:msg="item"></mo_chart_message>
        </div>
      </div>
      <div id="wl_faces_box" class="wl_faces_box">
            <div class="wl_faces_content">
                <div class="title">
                    <ul class="emotionHeader">
                        <li class="title_name">常用表情</li>
                        <li class="wl_faces_close"><button
                            id='turnoffFaces_box'>X</button></li>
                    </ul>
                </div>
                <div id="wl_faces_main" class="wl_faces_main">
                    <ul id="emotionUL">
                    </ul>
                </div>
            </div>
            <div class="wlf_icon"></div>
        </div>
    </div>
    <div id="send">
      <div class="left">
        <div id="toolBar">
          <a class="Emotion toolBarIcon" title="发送表情" id="showEmotionDialog"><i class="fa fa-smile-o"></i></a>
          <a class="pic toolBarIcon" title="发送图片"><input id="pic" type="file" accept="image/*"><i class="fa fa-file-photo-o"></i></a>
          <a class="video toolBarIcon" title="发送音频"><input id="video" type="file" accept="audio/*"><i class="fa fa-file-sound-o"></i></a>
          <a class="file toolBarIcon" title="发送文件"><input id="file" type="file"><i class="fa fa-paperclip"></i></a>
        </div>
        <div id="sendMsg" contenteditable="true"></div>
      </div>
      <button id="submit">发送</button>
    </div>

  </div>
</template>
<script>
  var testData = [
    {name:"张三",data:"百度百科是百度公司推出的一部内容开放、自由的网络百科全书平台。其测试版于2006年4月20日上线，正式版在2008年4月21日发布，截至2016年4月，百度百科已经收录了超过1300多万的词条，参与词条编辑的网友超过580万人，几乎涵盖了所有已知的知识领域。",type:'text'},
    {name:"张三",data:"自由的网络百科全书平台",type:'text'},
    {name:"张三",data:"自由的网络百科全书平台",type:'text'},
    {name:"张三",data:"自由的网络百科全书平台",type:'text'},
    {name:"王",data:"https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png",type:'pic'}
  ];
  import mo_chartMessage from './mo_chartMessage.vue'
  function uploadFile(json){
    $.ajax({
      type:'post',
      url:'https://a1.easemob.com/516881172/mo/chatfiles',
      headers:{
        "restrict-access":true,
        "Authorization":"Bearer YWMtUtcbXii1EeagbMmoA4yzugAAAVZF3gGbuR5mT6dnNk0umBbWhVUyaY6E7qY"
      },
      data:JSON.stringify({ "file":'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png' }),
      success: function (data) {
        alert("ok");
        $("#allMsg").append("<span class='self'>admin2</span>:"+"<br/><img src='"+data.uri+"/"+data.entities[0].uuid+"'><br>");
      },
      error: function () {
        alert("error");
      }
    })
  }

  export default {
    route: {
      data: function (transition) {
        var name = this.$route.params.id;
        var data,msgItems = {};
        Vuemsg[name] = Vuemsg[name]||[];
        msgItems[name] = Vuemsg[name];
        this.name = name;
        this.msgItems = msgItems;
        var groupUsers = [];
        var userObj = JSON.parse(window.localStorage["userObj"]);

        //获取群成员
        this.getGroupMember();
        // var groupsid = name;
        // var obj1416 = {
        //   url: '/home/company/1416.spring',
        //   args: {
        //     groupId: groupsid,
        //   },
        //   success: function (res) {
        //     for(let i=0;i<1;i++){
        //       let affiliations = res.data.data[i].affiliations;
        //       for(let j=0;j<affiliations.length;j++){
        //         // 将群主放在第一个显示，避免显示删除按钮
        //         if(affiliations[j].member) {
        //           var tel = affiliations[j].member;
        //           var img = BASE.url+"/upload/avatar/"+tel+".png";
        //           var name = userObj[tel];
        //           // 群组id
        //           var groupid = res.data.data[i].id;
        //           groupUsers.push({name:name,img:img, id: tel, groupid: groupid});
        //         }
        //         if(affiliations[j].owner) {
        //           var tel = affiliations[j].owner;
        //           var img = BASE.url+"/upload/avatar/"+tel+".png";
        //           var name = userObj[tel];
        //           // 群组id
        //           var groupid = res.data.data[i].id;
        //           groupUsers.unshift({name:name,img:img, id:tel, groupid: groupid});
        //         }
        //       }
        //     }
        //   },
        //   asy: false
        // }
        // Ajax(obj1416);

        // 判断是否有群公告
        var vue = this;
        var obj160111 = {
          url: '/home/company/1601.spring',
          args: {
            "groupId": name,
            "userName": localStorage.userId
          },
          success: function (res) {
            if(res.code==1){
              if(res.data && res.data.status==0){
                if(res.data.editor == localStorage.userId){

                }else{
                  vue.show_gonggao();
                  //执行回掉
                  vue.yidu(res.data.noticeId);
                }
              }
            }
          },
          asy: true
        }
        Ajax(obj160111);
        // this.groupUsers = groupUsers;

        //判断是否有新的@
        var atInfo = window.atInfo;
        this.atInfo = atInfo;

      }
    },
    components: {
      mo_chart_message:mo_chartMessage
    },
    replace: true,
    data: function () {
      Vuemsg = Vuemsg||{};
      var name = this.$route.params.id;
      Vuemsg[name] = Vuemsg[name]||[];
      var data,msgItems = {};
      msgItems[name] = Vuemsg[name];
      var groupUsers = [];

      var atInfo = window.atInfo;
      return {
        name:name,
        msgItems:msgItems,
        groupUsers:groupUsers,
        notice_content: "没有公告",
        edit: false,
        noticeid : "",
        content  : "没有公告",
        updateTime  : "",
        editor  : "",
        editorName: "",
        status : "",
        // 判断是否是群主，是否可以删除群成员
        notOwner: true,
		atInfo:atInfo,
      }
    },
    watch:{
      'msgItems': {
        handler: function (val, oldVal) {
          $('#allMsg').scrollTop($('#allMsg')[0].scrollHeight);
        },
        deep: true
      },
      'atInfo[name]': {
        handler: function (val, oldVal) {
//          alert('changed');
          this.atHandler();
        },
        deep: true
      },
      'groupUsers': {
        handler: function (val, oldVal) {
          //@功能测试
          var names = this.groupUsers;
          var config = {
            at: "@",
            data: names,
            startWithSpace: false,
            insertTpl: "<span class='at-item'>${atwho-at}${name}</span>",
          }
          $('#sendMsg').atwho(config);
        },
        deep: true
      },
    },
    events: {
      'at-msg': function (msg) {
        // 事件回调内的 `this` 自动绑定到注册它的实例上
        this.atHandler()
      }
    },
    methods: {
      //获取默认图片
      getDefaultImg: function (event) {
        var target = event.target;
        target.src = BASE.url+'/MobileOA/src/assets/img/default.jpg';
      },
      // 获取群成员
      getGroupMember() {
        var vm = this;
        var groupsid = this.name;
        var groupUsers = [];
        var userObj = JSON.parse(window.localStorage["userObj"]);
        var obj1416 = {
          url: '/home/company/1416.spring',
          args: {
            groupId: groupsid,
          },
          success: function (res) {
            vm.notOwner = true;
            for(let i=0;i<1;i++){
              let affiliations = res.data.data[i].affiliations;
              for(let j=0;j<affiliations.length;j++){
                // 判断当前用户是否是群主，可以删除成员
                if(affiliations[j].owner == localStorage.userId) {
                  vm.notOwner = false;
                }
                // 将群主放在第一个显示，避免显示删除按钮
                if(affiliations[j].member) {
                  var tel = affiliations[j].member;
                  var img = BASE.url+"/upload/avatar/"+tel+".png";
                  var name = userObj[tel];
                  // 群组id
                  var groupid = res.data.data[i].id;
                  groupUsers.push({name:name,img:img, id: tel, groupid: groupid});
                }
                if(affiliations[j].owner) {
                  var tel = affiliations[j].owner;
                  var img = BASE.url+"/upload/avatar/"+tel+".png";
                  var name = userObj[tel];
                  // 群组id
                  var groupid = res.data.data[i].id;
                  groupUsers.unshift({name:name,img:img, id:tel, groupid: groupid});
                }
              }
            }
            vm.groupUsers = groupUsers;
          },
          asy: true
        }
        Ajax(obj1416);
      },
      //@处理函数
      atHandler: function () {
        var atItem = this.atInfo[this.name];
        if(atItem){
          if(atItem.isNew == true){
            $('.at-bar').css('display','block');
            $('.at-bar').css('width',$('#msgs').css('width'));
            $('.at-bar').click(function () {
//              alert(atItem.position);
              $('.at-bar').css('display','none');
              var node = $('#msgs').children()[atItem.position];
              node.scrollIntoView();
              node.style.backgroundColor = '#A5C7DA';
              setTimeout(function () {
                node.style.backgroundColor = 'white';
              },1000)
            })
            atItem.isNew = false;
          }
        }
      },
      // 添加群成员
      addGroupMember() {
        let vm = this;
        vm.$root.overlay.display = true;
        vm.$root.people.display = true;

        this.$root.people.success = function() {
          $('.submit').attr('disabled', 'true');
          // 将$root.people.user中的数据处理为字符串
          var users = vm.$root.people.users,
            userids = [];
          for(let i = 0, len = users.length; i < len; i++) {
              userids.push(users[i].userId);
          }
          userids = userids.join(',');
          var obj1205 = {
            url: '/home/company/1205.spring',
            args: {
              groupId: vm.name,
              userNames: userids
            },
            success: function(res) {
              vm.$route.router.go('/chat/msg');
              vm.$root.people.users = [];
              vm.getGroupMember();
              tools.toast('添加成功', 'success');
              $('.submit').removeAttr('disabled');
            },
            error: function() {
              $('.submit').removeAttr('disabled');
            }
          }
          Ajax(obj1205);
          this.$root.overlay.display = false;
          this.$root.people.display = false;
        }
      },
      // 删除群组成员
      removePerson(e) {
        var vm = this;
        if(!window.confirm('确认要删除该成员吗')) {
          return;
        }
        var groupid = e.target.dataset.groupid,
            personid = e.target.dataset.id;
        var obj1206 = {
          url: '/home/company/1206.spring',
          args: {
            "groupId": groupid,
            "userNames": personid
          },
          success: function(res) {
            vm.$route.router.go('/chat/msg');
            tools.toast('删除成功', 'success');
            vm.getGroupMember();
          }
        }
        Ajax(obj1206);
      },
      // 退出群组
      quitGroup() {
        var vm = this;
        if(!window.confirm('确认退出群聊吗')) {
          return;
        }
        var groupid = vm.name,
            personid = localStorage.userId;
        var obj1206 = {
          url: '/home/company/1206.spring',
          args: {
            "groupId": groupid,
            "userNames": personid
          },
          success: function(res) {
            vm.$route.router.go('/chat/msg');
            for(let i = 0 , len = window.friends.length; i< len; i++) {
              if(window.friends[i].roomId !== undefined) {
                 if(window.friends[i].roomId == vm.name) {
                    window.friends.splice(i, 1);
                  }
              }
            }
            for(let i = 0 , len = window.conversation.length; i< len; i++) {
              if(window.conversation[i].roomId !== undefined) {
                 if(window.conversation[i].roomId == vm.name) {
                    window.conversation.splice(i, 1);
                  }
              }
            }              
            tools.toast('退出成功', 'success');
            vm.getGroupMember();
          }
        }
        // 如果是群主，直接删除群组
        var obj1203 = {
          url: '/home/company/1203.spring',
          args: {
            "groupId": groupid,
          },
          success: function(res) {
            vm.$route.router.go('/chat/msg');
            for(let i = 0 , len = window.friends.length; i< len; i++) {
              if(window.friends[i].roomId !== undefined) {
                 if(window.friends[i].roomId == vm.name) {
                    window.friends.splice(i, 1);
                  }
              }
            }
            for(let i = 0 , len = window.conversation.length; i< len; i++) {
              if(window.conversation[i].roomId !== undefined) {
                 if(window.conversation[i].roomId == vm.name) {
                    window.conversation.splice(i, 1);
                  }
              }
            }            
            tools.toast('退出成功', 'success');
            vm.getGroupMember();
          }
        }
        if(vm.notOwner === true) {
          Ajax(obj1206);
        }
        if(vm.notOwner === false) {
          Ajax(obj1203);
        }
      },
      //群公告控制
      show_gonggao:function(){
        //调取群公告
        var that = this;

        //获取分类列表
        var obj = {
          url: '/home/company/1601.spring',
          args: {
            "groupId": that.name,
            "userName": localStorage.userId
          },
          success: function (res) {
            if(res.code===1){
              if(res.data!=null){
                that.noticeid = res.data.noticeId;
                that.notice_content  = res.data.content;
                that.updateTime  = res.data.updateTime;
                that.editor  = res.data.editor;
                that.editorName = res.data.editorName;
                that.status = res.data.status;
                //执行回掉
                that.yidu(res.data.noticeId);
              }
            }
          },
          asy: true
        }
        Ajax(obj);
        $("#groupnotice").slideLeftShow();
      },
      //该用户已读公告回调接口
      yidu:function(data){
        var noticeId = data;
        // alert(noticeId);

        var obj = {
          url: '/home/company/1603.spring',
          args: {
            "noticeId": noticeId,
            "userName": localStorage.userId
          },
          success: function (res) {
            if(res.code===1){

            }
          },
          asy: true
        }
        Ajax(obj);
      },
      close_gonggao:function(){
        $("#groupnotice").slideLeftHide();
        this.notice_content="没有公告",
        this.noticeid = "";
        this.updateTime  = "";
        this.editor  = "";
        this.status = "";
        this.edit = false;
      },
      // 编辑公告
      edit_gonggao:function(){
          this.edit = true;
          $("#notice_content").focus();
      },
      cancel:function(){
        this.edit = false;
      },
      //发布公告
      post_gonggao:function(){
        var that = this;

        var obj = {
          url: '/home/company/1602.spring',
          args: {
            "groupId": that.name,
            "editor": localStorage.userId,
            "content" : that.notice_content
          },
          success: function (res) {
            if(res.code===1){
              tools.toast("发布成功","success");
              that.sendtxt(that.notice_content);
              // that.yidu();
              //缺少noticeid 无法执行回掉
              that.edit = false;
              $("#groupnotice").slideLeftHide();
            }

          },
          asy: true
        }
        Ajax(obj);
      },
      sendtxt(data){
        var that = this;
        var msg = "群公告："+data;
        var to = that.name;
        var options = {
          to: to,
          msg: msg,
          type: "groupchat",
          success: function () {
            var emoJson = Easemob.im.EMOTIONS;
            var emotionData = emoJson.map;
            var emotionPath = emoJson.path;
            var src = "";
            var html = msg;
            for (var key in emotionData) {
              src = emotionPath + emotionData[key];
              var imgTag = '<img src="' + src + '">';
              while(true){
                if(html.indexOf(key)!=-1){
                  html = html.replace(key, imgTag);
                }else{
                  break;
                }
              }
            }
            that.msgItems[that.name].push({name:curUserId,data:html,type:'notice',from:true});
            $("#sendMsg").html("");
            $("#sendMsg").focus();
          },
          completed: function() {
            alert('completed');
          },
          error: function() {
            alert('error');
          },
          beforeSend: function() {
            alert('berforesend');
          }
        };
        //发送文本消息接口
        conn.sendTextMessage(options);
      },
      init: function () {
        var that = this;


        Easemob.im.EMOTIONS = {
          path: 'static/hx_sdk/img/faces/'
          , map: {
            '[):]': 'ee_1.png',
            '[:D]': 'ee_2.png',
            '[;)]': 'ee_3.png',
            '[:-o]': 'ee_4.png',
            '[:p]': 'ee_5.png',
            '[(H)]': 'ee_6.png',
            '[:@]': 'ee_7.png',
            '[:s]': 'ee_8.png',
            '[:$]': 'ee_9.png',
            '[:(]': 'ee_10.png',
            '[:\'(]': 'ee_11.png',
            '[:|]': 'ee_12.png',
            '[(a)]': 'ee_13.png',
            '[8o|]': 'ee_14.png',
            '[8-|]': 'ee_15.png',
            '[+o(]': 'ee_16.png',
            '[<o)]': 'ee_17.png',
            '[|-)]': 'ee_18.png',
            '[*-)]': 'ee_19.png',
            '[:-#]': 'ee_20.png',
            '[:-*]': 'ee_21.png',
            '[^o)]': 'ee_22.png',
            '[8-)]': 'ee_23.png',
            '[(|)]': 'ee_24.png',
            '[(u)]': 'ee_25.png',
            '[(S)]': 'ee_26.png',
            '[(*)]': 'ee_27.png',
            '[(#)]': 'ee_28.png',
            '[(R)]': 'ee_29.png',
            '[({)]': 'ee_30.png',
            '[(})]': 'ee_31.png',
            '[(k)]': 'ee_32.png',
            '[(F)]': 'ee_33.png',
            '[(W)]': 'ee_34.png',
            '[(D)]': 'ee_35.png'
          }
        };
        var that = this;

        //文本消息
        $("#submit").click(function () {
          var msg = $('#sendMsg').text();
          if(msg == null||msg == ""){
            return ;
          }
          var to = that.name;
          var options = {
            to: to,
            msg: msg,
            type: "groupchat",
            success: function () {
              var emoJson = Easemob.im.EMOTIONS;
              var emotionData = emoJson.map;
              var emotionPath = emoJson.path;
              var src = "";
              var html = msg;
              for (var key in emotionData) {
                src = emotionPath + emotionData[key];
                var imgTag = '<img src="' + src + '">';
                while(true){
                  if(html.indexOf(key)!=-1){
                    html = html.replace(key, imgTag);
                  }else{
                    break;
                  }
                }
              }
              that.msgItems[that.name].push({name:curUserId,data:html,type:'text',from:true});
              $("#sendMsg").html("");
              $("#sendMsg").focus();
            },
            completed: function() {
              alert('completed');
            },
            error: function() {
              alert('error');
            },
            beforeSend: function() {
              alert('berforesend');
            }
          };
          //发送文本消息接口
          conn.sendTextMessage(options);
        });

        //显示表情
        var emotionFlag = false;
        var toggle = false;
        $('#showEmotionDialog').click(function () {
          if(toggle){
            $("#wl_faces_box").fadeOut("slow");
            toggle = false;
          }else{
            if (emotionFlag) {
              $('#wl_faces_box').css({
                "display": "block"
              });
              toggle = true;
              return;
            }
            emotionFlag = true;
            // Easemob.im.Helper.EmotionPicData设置表情的json数组
            var sjson = Easemob.im.EMOTIONS,
              data = sjson.map,
              path = sjson.path;

            for (var key in data) {
              var emotions = $('<img>').attr({
                "id": key,
                "src": path + data[key],
                "style": "cursor:pointer;"
              }).click(function () {
                var txt = $("#sendMsg").text();
                $("#sendMsg").html(txt + this.id);
                $("#sendMsg").focus();
              });
              $('<li class="emotionLi">').append(emotions).appendTo($('#emotionUL'));
            }
            $('#wl_faces_box').css({
              "display": "block"
            });
            toggle = true;
          }

        })
        //关闭表情窗口
        $("#turnoffFaces_box").click(function () {
          $("#wl_faces_box").fadeOut("slow");
        })
      },

      //发送图片
      sendPic: function () {
        var that = this;
        //图片接收者，如“test1”
        var to = that.name;
        var fileInputId = "pic";
        if (to == null) {
          alert("请选择联系人");
          return;
        }
        //fileInputId：文件选择输入框的ID，SDK自动根据ID自动获取文件对象（含图片，或者其他类型文件）
        var fileObj = Easemob.im.Helper.getFileUrl(fileInputId);
        if (fileObj.url == null || fileObj.url == '') {
          alert("请选择发送图片");
          return;
        }
        var filetype = fileObj.filetype;
        var filename = fileObj.filename;
        if (filetype in  {
            "jpg": true,
            "gif": true,
            "png": true,
            "bmp": true
          }) {
          var opt = {
            type:'groupchat',
            fileInputId: fileInputId,
            to: to,
            onFileUploadError: function (error) {
              //处理图片上传失败
              alert("处理图片上传失败");
            },
            onFileUploadComplete: function (data) {
              //处理图片上传成功，如本地消息显示
              that.msgItems[that.name].push({name:localStorage.userId,data:data.uri+"/" + data.entities[0].uuid,type:'pic',from:true});
              $("#pic").val("");
              $("#sendMsg").focus();
            }
          };
          conn.sendPicture(opt);
          return;
        }
        alert("不支持此图片类型" + filetype);
      },
      sendVideo: function () {
        var that = this;
        //音频接收者，如“test1”
        var to = that.name;
        var fileInputId = "video";
        if (to == null) {
          alert("请选择联系人");
          return;
        }
        //fileInputId：文件选择输入框的ID，SDK自动根据ID自动获取文件对象（含图片，或者其他类型文件）
        var fileObj = Easemob.im.Helper.getFileUrl(fileInputId);
        if (fileObj.url == null || fileObj.url == '') {
          alert("请选择发送图片");
          return;
        }
        var filetype = fileObj.filetype;
        var filename = fileObj.filename;
        if (filetype in  {
            "mp3": true,
            "wma": true,
            "wav": true,
            "avi": true
          }) {
          var option = {
            type:'groupchat',
            fileInputId: fileInputId,
            to: to,
            onFileUploadError: function (error) {
              //处理图片上传失败
              alert(error.msg);
            },
            onFileUploadComplete: function (data) {
              //处理图片上传成功，如本地消息显示
              that.msgItems[that.name].push({name:localStorage.userId,data:data.uri+"/" + data.entities[0].uuid,type:'video',from:true});
              $("#video").val("");
              $("#sendMsg").focus();
            }
          };
          conn.sendAudio(option);
          return;
        }
        alert("不支持此音频文件类型" + filetype);
      },
      sendFile: function () {
        var that = this;
        //音频接收者，如“test1”
        var to = that.name;
        var fileInputId = "file";
        if (to == null) {
          alert("请选择联系人");
          return;
        }
        //fileInputId：文件选择输入框的ID，SDK自动根据ID自动获取文件对象（含图片，或者其他类型文件）
        var fileObj = Easemob.im.Helper.getFileUrl(fileInputId);
        if (fileObj.url == null || fileObj.url == '') {
          alert("请选择发送文件");
          return;
        }
        var filetype = fileObj.filetype;
        var filename = fileObj.filename;
        if (filetype in  {"jpg": true,"gif": true,"png": true,"bmp": true,"mp3": true,
            "wma": true,"wav": true,"avi": true,'txt': true
          }) {
          var option = {
            type:'groupchat',
            fileInputId: fileInputId,
            to: to,
            onFileUploadError: function (error) {
              //处理图片上传失败
              alert(error.msg);
            },
            onFileUploadComplete: function (data) {
              //处理图片上传成功，如本地消息显示
              var index = $("#file").val().split('\\').length-1;

              var msg = {};
              msg.url = data.uri+"/" + data.entities[0].uuid;
              msg.filename = $("#file").val().split('\\')[index];
              that.msgItems[that.name].push({name:localStorage.userId,data:msg,type:'file',from:true});
              $("#file").val("");
              $("#sendMsg").focus();
            }
            // ext:{"extmsg":"extends messages"}//用户自扩展的消息内容（群聊用法相同）
          };
          conn.sendFile(option);
          return;
        }
        alert("不支持此文件类型" + filetype);
      },
    },
    ready: function () {
      var that = this;
      this.init();

      //判断是否有新的@
      var atInfo = window.atInfo;
      this.atInfo = atInfo;
      this.atHandler();


      $("#pic").change(function () {
        that.sendPic();
      });
      $("#video").change(function () {
        that.sendVideo();
      });
      $("#file").change(function () {
        that.sendFile();
      });
      $("#sendMsg").keydown(function(e){
        e.stopPropagation();
        if(e.keyCode==13&& e.ctrlKey){
          e.preventDefault();
          $("#submit").click();
        }
      })
      $("#usergroup").click(function () {
        $("#groupmember").slideLeftShow();
      })
      $(".close").click(function () {
        $("#groupmember").slideLeftHide();
      })
      $(".line2").on("click",".userItem-img", function () {
        var tmp = this.src.split('/').pop();
        var name = tmp.split('.')[0];
        that.$root.myinfo.userId = name;
        that.$root.overlay.display = true;
        that.$root.myinfo.display = true;
      })

    }
  }
</script>
<style>
  #content{
    font-family: "楷体";
    width: 100%;
    height:100%;
    /*background-color: #f2f2f2;*/
  }
  #header{
    /*position: relative;*/
    padding-left: 20px;
    line-height: 45px;
    font-size: 15px;
    width: 100%;
    height: 50px;
    border-bottom: solid 1px #E6E5E6;
    font-family: "\51AC\9752\9ED1\4F53\7B80\4F53\4E2D\6587","Tahoma","Hiragino Sans GB","Microsoft YaHei","\5FAE\8F6F\96C5\9ED1","STHeiti","WenQuanYi Micro Hei",SimSun,sans-serif !important;
  }
  .fr{
    float: right;
  }
  #allMsg{
    position: relative;
    padding: 10px;
    width: 100%;
    height: 60%;
    border-bottom: solid 1px #E6E5E6;
    overflow: auto;
  }
  #allMsg .self{
    margin-top: 5px;
    font-size: 14px;
    color: green;
  }
  #allMsg .friend{
    font-size: 14px;
    color: red;
  }
  #allMsg .at-bar{
    display: none;
    position: fixed;
    color: #fff;
    width: 100%;
    padding-left: 10px;
    height: 30px;
    line-height: 30px;
    background-color: #5CACEE;
    font-size: 15px;
    cursor: pointer;
    font-family: "\51AC\9752\9ED1\4F53\7B80\4F53\4E2D\6587","Tahoma","Hiragino Sans GB","Microsoft YaHei","\5FAE\8F6F\96C5\9ED1","STHeiti","WenQuanYi Micro Hei",SimSun,sans-serif !important;
  }
  #send{
    height: 30.8%;
  }
  .left{
    float: left;
    width: 85%;
    height: 100%;
  }
  #toolBar{
    width: 100%;
    height: 20%;
    padding: 5px 0 5px 10px;
  }
  #toolBar .Emotion{
    display:inline-block;
    width:20px;height:20px;
    /*background:url("../../static/hx_sdk/img/icon.png") no-repeat;*/
    /*background-size: 100% 100%;*/
    background-position: 0 -90px;
    position:relative; overflow:hidden;
  }
  #toolBar .pic{
    display:inline-block;
    width:20px;height:20px;
    /*background:url("../../static/hx_sdk/img/icon.png") no-repeat;*/
    /*background-size: 100% 100%;*/
    background-position: 0 -151px;
    position:relative; overflow:hidden;
  }
  #toolBar .video{
    display:inline-block;
    width:20px;height:20px;
    /*background:url("../../static/hx_sdk/img/icon.png") no-repeat;*/
    background-position: 0 -457px;
    position:relative; overflow:hidden;
  }
  #toolBar .file{
    display:inline-block;
    width:20px;height:20px;
    /*background:url("../../static/hx_sdk/img/icon.png") no-repeat;*/
    background-position: 0 -215px;
    position:relative; overflow:hidden;
  }
  #toolBar input{position:absolute; right:0; top:0; opacity:0;}
  #sendMsg{
    padding: 10px;
    width: 100%;
    height: 80%;
    resize: none;
    border: none;
    outline: none;
    border-bottom: solid 1px #E6E5E6;
    background-color: #fff;
    overflow: scroll;
    font-size: 14px;
    word-wrap:break-word;
    word-break:break-all;
    font-family: "\51AC\9752\9ED1\4F53\7B80\4F53\4E2D\6587","Tahoma","Hiragino Sans GB","Microsoft YaHei","\5FAE\8F6F\96C5\9ED1","STHeiti","WenQuanYi Micro Hei",SimSun,sans-serif !important;
  }
  #submit{
    float: right;
    width: 15%;
    height: 100%;
    resize: none;
    border: #E6E5E6 1px solid;
    border-bottom: solid 1px #E6E5E6;
    background-color: #eee;
  }
  .title_name{
      font-size:20px;
      float:left;
      list-style:none;
  }
  .wl_faces_close{
      float:right;
      list-style:none;
  }
  .wl_faces_box{
    position: fixed;
    background:#FFFFFF;
    top: 255px;
    left: 413px;
    display:none;
    width:300px;
    height:180px;
    border:1px solid #E6E5E6;
    z-index:10000;
  }
  .wl_faces_main{
    padding-top:30px;
  }
  .emotionLi{
      float:left;
      list-style:none;
  }
  #emotion{
    padding:10px;
    width:100%;
    height:40px;
    border-bottom:solid 1px #E6E5E6;
  }
  #emotion img{
    width:18px;
    height:18px;
  }
  #content #header #usergroup{
    width: 16px;
    height: 16px;
    float: right;
    margin-top: 15px;
    margin-right: 16px;
    border-radius: 0!important;
  }
  #content .slideright1{
    width: 350px;
    display: none;
    position: absolute;
    bottom: 0;
    right: 0;
    top: 50px;
    z-index: 3;
    box-shadow: rgba(0, 0, 0, 0.247059) 0px 7px 21px;
    background-color: white;
    font-size: 15px;
    background-color: #f4f4f4;
  }
  #content .slideright1 .line1{
    line-height: 50px;
    height: 50px;
    font-size: 16px;
    border-bottom: 1px #ddd solid;
    padding-left: 5px;
    padding-right: 10px;
    width: 100%;
    min-width: 350px;
  }
  #content .slideright1 .line1 .close{
    /*display: inline-block;
    font-size: 32px;
    float: right;
    color: #ddd;
    cursor: pointer;*/
    font-size: 18px;
    opacity: 0.7;
  }
  #content .slideright1 .line2{
    height: calc(100% - (100px));
    width: 100%;
    padding: 10px;
    overflow: auto;
    min-width: 350px;
    background-color: #fff;
  }
  #content .slideright1 .line2 .userItem{
    display: inline-block;
    vertical-align: top;
    width: 40px;
    height: 60px;
    margin: 10px;
  }
  #content .slideright1 .line2 .userItem-img{
    vertical-align: top;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
  }
  #content .slideright1 .line2 .userItem-text{
    width: 40px;
    height: 20px;
    min-height: 20px;
    text-align: center;
    line-height: 20px;
    font-size: 14px;
  }
  #content .slideright1 .line3{
    width: 100%;
    height: 50px;
    line-height: 50px;
    margin: 0 auto;
    text-align: center;
  }
   .slideright1 .line3 button{
    outline: 0;
    border-radius: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    display: inline-block;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
    text-decoration: none;
    background-color: #008cee;
    color: #fff;
    width: 136px;
    height: 34px;
    font-size: 14px;
    border: 0;
  }
  /*群公告*/
  #content #header #notice{
    float: right;
    margin-top: 15px;
    margin-right: 16px;
    border-radius: 0!important;
  }
  #content .textarea{
    width: 90%;
    border: none;
    padding: 0;
    line-height: 20px;
    color: #222;
    outline: none;
    resize: none;
  }
  .line2_label{
    height: 20px;
    margin: 10px 0;
  }
  /*删除群成员*/
  #groupmember .userItem {
    position: relative;
  }
  #groupmember .userItem:hover .rm-person {
    display: block;
  }
  #groupmember .userItem:first-child:hover .rm-person {
    display: none;
  }
  #groupmember .hide {
    display: none;
  }
  #groupmember .userItem:hover .rm-person.hide {
    display: none;
  }
  #groupmember .rm-person {
    display: none;
    position: absolute;
    top: 25px;
    right: 0;
    width: 18px;
    height: 18px;
    line-height: 18px;
    background-color: #fff;
    border-radius: 50%;
    text-align: center;
  }
  #groupmember .rm {
    background-color: #b6b5b5;
    width: 14px;
    height: 14px;
    line-height: 14px;
    color: #fff;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    cursor: pointer;
  }
  #groupmember .rm:hover {
    background-color: #ec3d3c;
  }
  /*退出群聊*/
  #groupmember .out-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 75px;
    line-height: 86px;
    text-align: center;
  }
  #groupmember .line3 .out {
    border: 0;
    border-radius: 5px;
    background-color: #ED3C3B;
    color: #fff;
  }
  #groupmember .line3 .out:hover {
    background-color: #ff685d;
  }
  /*添加群成员*/
  #groupmember .addmember {
    color: #38adff;
    font: 15px '微软雅黑';
    cursor: pointer;
  }
  #groupmember .addmember:hover {
    color: #6dc3ff;
  }
  .at-item{
    color:#006EFD;
    cursor: pointer;
  }
  .m-content.m-right .at-item {
    color: #d1ecfd;
  }
  .m-content.m-right .at-item:hover {
    color: #e3f3fd;
  }
  .toolBarIcon{
    cursor: pointer;
    font-size: 18px;
    margin-right: 10px;
    color: #464656;
  }
  .toolBarIcon:hover{
    font-size: 18px;
    margin-right: 10px;
    color: #008cee;
  }
</style>
