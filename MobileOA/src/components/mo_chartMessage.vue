<template>
  <div>
    <!--<span class='self'>{{msg.name}}</span><br>{{msg.type}}<br>"-->
    <!--文本消息-->
    <div class="m-msg" v-if="msg.type == 'text'">
      <div class="m-header" v-bind:class="{'m-right-text':msg.from}">{{realName}}</div>
      <div class="m-body">
        <div :name="msg.name" class="m-img" v-bind:class="{'m-color':msg.from,'m-right':msg.from}">{{realName.substr(realName.length-2)}}</div>
        <div class="m-content" v-bind:class="{'m-right':msg.from}">
          {{{msg.data}}}
        </div>
        <div class="clear"></div>
      </div>
    </div>
    <!--图片消息-->
    <div class="m-msg" v-if="msg.type == 'pic'">
      <div class="m-header" v-bind:class="{'m-right-text':msg.from}">{{realName}}</div>
      <div class="m-body">
        <div :name="msg.name" class="m-img" v-bind:class="{'m-color':msg.from,'m-right':msg.from}">{{realName.substr(realName.length-2)}}</div>
        <div class="m-content" v-bind:class="{'m-right':msg.from}">
          <img src="{{msg.data}}" style="max-width: 100%;">
        </div>
        <div class="clear"></div>
      </div>
    </div>
    <!--音频消息-->
    <div class="m-msg" v-if="msg.type == 'video'">
      <div class="m-header" v-bind:class="{'m-right-text':msg.from}">{{realName}}</div>
      <div class="m-body">
        <div :name="msg.name" class="m-img" v-bind:class="{'m-color':msg.from,'m-right':msg.from}">{{realName.substr(realName.length-2)}}</div>
        <div class="m-content" v-bind:class="{'m-right':msg.from}">
          <!--<img src="{{msg.data}}">-->
          <audio src="{{msg.data}}" controls=controls></audio><br/>
        </div>
        <div class="clear"></div>
      </div>
    </div>
    <!--文件消息-->
    <div class="m-msg" v-if="msg.type == 'file'">
      <div class="m-header" v-bind:class="{'m-right-text':msg.from}">{{realName}}</div>
      <div class="m-body">
        <div :name="msg.name" class="m-img" v-bind:class="{'m-color':msg.from,'m-right':msg.from}">{{realName.substr(realName.length-2)}}</div>
        <div class="m-content file" v-bind:class="{'m-right':msg.from}">
          <!--{{msg.data}}-->
          <img class="file-icon" src="../../static/hx_sdk/img/file_link.png">
          <a class="file-link" href="{{msg.data.url}}" download="{{msg.data.filename}}">
            下载文件
          </a><br/>
          {{msg.data.filename}}
          <!--<audio src="{{msg.data}}" controls=controls></audio><br/>-->
        </div>
        <div class="clear"></div>
      </div>
    </div>
    <!--群公告消息-->
    <div class="m-msg" v-if="msg.type == 'notice'">
      <div class="m-header" v-bind:class="{'m-right-text':msg.from}">{{realName}}</div>
      <div class="m-body">
        <div :name="msg.name" class="m-img" v-bind:class="{'m-color':msg.from,'m-right':msg.from}">{{realName.substr(realName.length-2)}}</div>
        <div class="m-content" v-bind:class="{'m-right':msg.from}">
          <div class="content-head"><i aria-hidden="true" class="fa fa-bullhorn notice-icon"></i>群公告：</div>
          {{{msg.data}}}
        </div>
        <div class="clear"></div>
      </div>
    </div>
  </div>
</template>
<script>
  var a =333;
  var testData = {
    'admin2':'../../static/hx_sdk/img/demo.jpg',
    '123':'../../static/hx_sdk/img/img1.jpg',
  }
  export default {
    data: function () {
      var tel = this.msg.name;
      var userObj = JSON.parse(window.localStorage["userObj"]);
      var realName = userObj[tel];
      return {
        typeid:'2',
        tel:tel,
        realName:realName
      };
    },
    props:['msg'],
    methods:{
      init: function () {
        var that = this;
        var name = this.msg.name;
        let imgUrl = BASE.url+"/upload/avatar/"+name+".png";
        if(imgUrl){
//          var element = $('img[name='+name+']');
//          alert(element.html());
//          console.log(element);
          $('div[name='+name+']').html("");
          $('div[name='+name+']').css({
            'background':"url("+imgUrl+") no-repeat",
            'background-size':"100% 100%"
          });
        }

        $(".m-img").click(function () {
          that.$root.myinfo.userId = name;
          that.$root.overlay.display = true;
          that.$root.myinfo.display = true;
        })
      }
    },
    ready: function () {
      this.init();
    }
  }
</script>
<style>
  .m-msg{
    font-size: 13px;
    margin-bottom: 10px;
    font-family: "\51AC\9752\9ED1\4F53\7B80\4F53\4E2D\6587","Tahoma","Hiragino Sans GB","Microsoft YaHei","\5FAE\8F6F\96C5\9ED1","STHeiti","WenQuanYi Micro Hei",SimSun,sans-serif !important;
  }
  .m-header{
    height: 20px;
    line-height: 20px;
    color: #A5ACB5;
    padding-left: 51px;
  }
  .m-body{
    /*float: left;*/
  }
  .m-img{
    line-height: 35px;
    text-align: center;
    width: 35px;
    height: 35px;
    border-radius: 35px;
    background-color: #74BEF2;
    float: left;
    cursor: pointer;
  }
  .m-content{
      background-color: #fff;
      line-height: 21px;
      float: left;
      color: #000;
      margin-left: 10px;
      margin-right: 10px;
      padding: 5px 11px;
      max-width: 70%;
      overflow: hidden;
      word-wrap: break-word;
      word-break: break-all;
      border: 1px solid #e1e0e4;
      border-radius: 6px;
      font-family: "\51AC\9752\9ED1\4F53\7B80\4F53\4E2D\6587","Tahoma","Hiragino Sans GB","Microsoft YaHei","\5FAE\8F6F\96C5\9ED1","STHeiti","WenQuanYi Micro Hei",SimSun,sans-serif !important;
      font-size: 14px;
  }
  .clear{
    clear: both;
  }
  div .m-color{
    background-color: #74BEF2;
  }
  .file{

    width: 250px;
  }
  .file-icon{
    margin-left: 10px;
    display: inline-block;
    vertical-align: middle;
  }
  .file-link{
    margin-left: 20px;
    margin-top: auto;
    margin-bottom: auto;
    display: inline-block;
    /*line-height: 146px;*/
    color: #0077b3;
    vertical-align: middle;
  }
  div .m-right{
    float:right;
    margin-right: 10px;
  }
  .m-content.m-right {
    background-color: #38adff;
    border: 1px solid #38adff;
    line-height: 21px;
    color: #fff;
    margin-left: 10px;
    margin-right: 10px;
    padding: 5px 11px;
    max-width: 70%;
    overflow: hidden;
    word-wrap: break-word;
    word-break: break-all;
    border-radius: 6px;
    font-family: "\51AC\9752\9ED1\4F53\7B80\4F53\4E2D\6587","Tahoma","Hiragino Sans GB","Microsoft YaHei","\5FAE\8F6F\96C5\9ED1","STHeiti","WenQuanYi Micro Hei",SimSun,sans-serif !important;
    font-size: 14px;
  }
  .m-right-text{
    text-align: right;
    padding-right: 62px;
  }
  .content-head{
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #ddd;
  }
  .notice-icon{
    margin-right: 5px;
  }
</style>

