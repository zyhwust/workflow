<template>
	<div id="app">
		<router-view></router-view>
		<audio id="tishiyin" src="../static/tishiyin.mp3" style="display: none"></audio>
	</div>
</template>

<script>

var unReadMessages = {};//未读消息
window.friends = []; //群组列表（前好友列表）

window.conversation = []; //会话列表

window.msg = [];    //单聊列表
window.curUserId = null;//当前用户手机号（环信用户id）
window.conn = null;//环信连接对象
window.Vuemsg = {};//消息集
window.atInfo = {};
//数组元素去重
function uniqueArray(data){
    data = data || [];
    var a = {};
    for (var i=0; i<data.length; i++) {
	   var v = data[i];
	   if (typeof(a[v]) == 'undefined'){
	       a[v] = 1;
	   }
    };
    data.length=0;
    for (var i in a){
	   data[data.length] = i;
    }
    return data;
}


export default {
  ready() {
		this.huanxin();
  },
  data() {
		return {
			unDealFlow:'',
			// 覆盖层组件
			overlay: {
				display: false
			},
			overlay2: {
				display: false
			},
			// 用户信息组件
			myinfo: {
			display: false,
			userId: ''
			},
			// 用户创建群聊
			groupchart: {
			display: false,
			// userId: ''
			},
			// 绑定手机组件
			bindphone:{
			display: false
			},
			people:{
			display: false, //是否显示
					users: [],      //userId列表
					deps:[],        //部门Id列表
					deptType:"",    //选择分类类型Id
					// data:{},
					haveDepId: false,//是否需要userId
					success: null   //回掉函数
			},
			// 修改密码组件
			changepwd: {
				display: false
			},
			// 通知已读未读组件
			ifread: {
				display: false
			},
			// 忘记密码组件
			forgetPwd: {
				display: false
			}
		}
  },

  methods: {
    //收到所有类型消息都执行的回调
    onReceivedMsg:function(roomId,type){
      //更新会话列表
      if(type != "chat") {
        console.log(roomId);
        var flag = window.conversation.some(function (item) {
          if (item.roomId == roomId) {
            return true;
          } else {
            return false;
          }
        })
        if (!flag) {
          var item = window.friends.filter(function (item) {
            if (item.roomId == roomId) {
              return true;
            } else {
              return false;
            }
          });
          item = item[0];
          item.img = "./static/hx_sdk/img/demo.jpg";
          item.color = 0;
          window.conversation.unshift(item);
        }
      }
      //更新消息是否已读提醒
      unReadMessages[roomId] = 1;
      for(let i=0;i<window.conversation.length;i++){
        if(window.conversation[i].roomId == roomId){
          window.conversation[i].color = 1;
        }
      }

      for(let i=0;i<window.conversation.length;i++){
        if(window.conversation[i].roomId==roomId){
          var tmpRoom = window.conversation.splice(i,1);
          window.conversation.unshift(tmpRoom[0]);
          break;
        }
      }
    },
    huanxin: function(cb) {
      var that = this;
	  // 环信初始化
	  let conn = new Easemob.im.Connection();
	  conn.open({
		apiUrl: Easemob.im.config.apiURL,
		user: localStorage.userId,
		pwd: localStorage.HXpsw,
		appKey: "516881172#mo"
	  });
	  conn.init({
		onOpened:function () {
      curUserId = conn.context.userId;
		  conn.listRooms({
			success : function(rooms) {
			  if(window.friends.length>0){
				return;
			  }
			  var userList = [];
			  var groupsid = '';
			  // 生成请求环信id
			  for(var i = 0 , len = rooms.length ; i < len ; i++) {
				var item = rooms[i]; //群聊对象
				item.img = "./static/hx_sdk/img/demo.jpg";
				item.color = unReadMessages[item.roomId]||0;
				window.friends.unshift(item);
				var name = item.roomId;
				Vuemsg[name] = Vuemsg[name]||[];

				groupsid+= name;
				if(i< len-1) {
				  groupsid+= ',';
				}
			  }

			  //获取用户所有群组
			  var obj1416 = {
				url: '/home/company/1416.spring',
				args: {
				  groupId: groupsid,
				},
				success: function (res) {
				  for(let i=0;i<rooms.length;i++){
					let affiliations = res.data.data[i].affiliations;
					for(let j=0;j<affiliations.length;j++){
					  let name = affiliations[j].owner||affiliations[j].member;
					  userList.push(name);
					}
				  }
				},
				asy: false
			  }
			  Ajax(obj1416);

			  userList = uniqueArray(userList);
			  //获取用户昵称
			  var obj1011 = {
				url: '/home/user/1011.spring',
				args: {
				  userIds : userList,
				},
				success: function (res) {
				  var userObj = res.data;
				  var userId = localStorage.userId;
				  var userName = userObj[userId];
				  localStorage.userName = userName;
				  window.localStorage["userObj"] = JSON.stringify(userObj);
				},
				asy: false
			  }
			  Ajax(obj1011);

			},
			error : function(e) {
			  alert("error")
			}
		  });
		  conn.setPresence();
		},

        //处理单聊
        manageChat: function(message,from){
            if(message.type == "chat"){
                var haveMsg = false;
                if(window.msg.length > 0){
                    //判断是否有此单聊
                    for(let k in window.msg){
                        if(window.msg[k].userId == from){
                            haveMsg = true;
                        }
                    }
                    if(!haveMsg){
                        this.addMsg(message,from);
                    }
                }else{
                    this.addMsg(message,from);
                }
                return true;
            }
        },

        //生成消息
        addMsg:function(message,from){
            var obj = {
                url: '/home/user/1001.spring',
                args: {
                    "userId" : from
                },
                success: function (res) {
                    if(res.data.userRealname){
                        var msg = {};
                        msg.userId = message.from;
                        msg.name = res.data.userRealname;
                        msg.roomId = message.from;
                        msg.img = BASE.url+"/upload/avatar/"+message.from+".png";
                        msg.color = "";
                        window.msg.push(msg);
                    }
                },
                asy: true
            }
            Ajax(obj);
        },

		onTextMessage:function (message) {
			console.log(message);
			var name = message.to;
			var from = message.from;
			var data = message.data;
			if(from == localStorage.userId){
				return;
			}

			//处理单聊
            if(this.manageChat(message,from)){
                name = message.from;
            }

			// 处理群公告
			if(data.length>4){
				var a = data.substring(0,4);
				if(a=="群公告："||a=="群公告:"){
					var notice = data.substring(4);
					Vuemsg[name] = Vuemsg[name]||[];
					Vuemsg[name].push({name:from,data:notice,type:'notice'});
				}else{
					Vuemsg[name] = Vuemsg[name]||[];
					Vuemsg[name].push({name:from,data:data,type:'text'});
				}
			}else{
				Vuemsg[name] = Vuemsg[name]||[];
				Vuemsg[name].push({name:from,data:data,type:'text'});
				console.log(Vuemsg[name]);
			}

			//处理@
			var atName = localStorage.userName;
			if(data.includes('@'+atName)){
				var tishiyin = document.querySelector('#tishiyin');
				tishiyin.play();
				var position = Vuemsg[name].length-1;
				var obj = {
					roomId:name,
					position:position,
					isNew:true,
				}
				window.atInfo[name] = obj;
				that.$broadcast('at-msg', obj);
			}
			that.onReceivedMsg(name,message.type);
		},
		onEmotionMessage:function (message) {
		  console.log(message);
		  var name = message.to;
		  var from = message.from;
		  var emoData = message.data;
		  var html = "";

            //处理单聊
            if(this.manageChat(message,from)){
                name = message.from;
            }

		  for (var i in emoData) {
			var a = emoData[i];
			var c = a.type;
			if (c == "emotion") {
			  var b = a.data;
			  html += '<img src="' + b + '">';
			} else if (c == "txt") {
			  var b = a.data;
			  html += '<span>' + b + '</span>';
			}
		  }
		  Vuemsg[name] = Vuemsg[name]||[];
		  Vuemsg[name].push({name:from,data:html,type:'text'});
		  that.onReceivedMsg(name,message.type);
		},
		onPictureMessage:function (message) {
		  var name = message.to;
		  var from = message.from;
          	//处理单聊
            if(this.manageChat(message,from)){
                name = message.from;
            }
		  Vuemsg[name] = Vuemsg[name]||[];
		  Vuemsg[name].push({name:from,data:message.url,type:'pic'});
		  that.onReceivedMsg(name,message.type);
		},
		onAudioMessage:function (message) {
		  var name = message.to;
		  var from = message.from;

          //处理单聊
            if(this.manageChat(message,from)){
                name = message.from;
            }

		  Vuemsg[name] = Vuemsg[name]||[];
		  Vuemsg[name].push({name:from,data:message.url,type:'video'});
		  that.onReceivedMsg(name,message.type);
		},
		onFileMessage:function(message) {
		  var name = message.to;
		  var from = message.from;
		  //处理单聊
            if(this.manageChat(message,from)){
                name = message.from;
            }
		  Vuemsg[name] = Vuemsg[name]||[];
		  Vuemsg[name].push({name:from,data:message,type:'file'});
		  that.onReceivedMsg(name,message.type);
		},
		onClosed:function () {
//          alert("关闭聊天！");
		  conn.clear();
		  conn.onClosed();
		}
	  });
	  window.conn = conn;
	  cb&&cb.call(this);
	}
  },
  replace: true
}


//jq扩展
jQuery.fn.slideLeftHide = function( speed, callback ) {
  this.animate({
	width : "hide",
	paddingLeft : "hide",
	paddingRight : "hide",
	marginLeft : "hide",
	marginRight : "hide"
  }, speed, callback );
};
jQuery.fn.slideLeftShow = function( speed, callback ) {
  this.animate({
	width : "show",
	paddingLeft : "show",
	paddingRight : "show",
	marginLeft : "show",
	marginRight : "show"
  }, speed, callback );
};
</script>

<style>
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
::-webkit-scrollbar{width:8px;height:8px}
::-webkit-scrollbar-track-piece{background-color:transparent}
::-webkit-scrollbar-thumb{border-radius:9px;background-color:rgba(195,195,195,0.3)}
::-webkit-scrollbar-thumb:hover{background-color:rgba(126,126,126,0.6)}

html,body{
  height: 100%;
  width: 100%;
  font-family: "冬青黑体简体中文","Tahoma","Hiragino Sans GB","Microsoft YaHei","微软雅黑","STHeiti","WenQuanYi Micro Hei",SimSun,sans-serif !important;
  -webkit-font-smoothing:antialiased;
  font-size: 12px;
  /*font: ;-color: #222;*/
  overflow: hidden;
}
input , button{
  outline: 0;
  font-family: "冬青黑体简体中文","Tahoma","Hiragino Sans GB","Microsoft YaHei","微软雅黑","STHeiti","WenQuanYi Micro Hei",SimSun,sans-serif !important;
  -webkit-font-smoothing:antialiased;
}
ul , li {
  list-style: none;
}
button , li{
  cursor: pointer;
}
a {
  color: #222;
  text-decoration: none;
}
#app{
  height: 100%;
	position: relative;
	width: 100%;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
	/*background-color: white;
	border-radius: 7px;*/
}
.content{
  padding-top: 70px;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content:flex-start;
  align-items: stretch;
}
</style>
