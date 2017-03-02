<template>
  <!-- 聊天窗口 -->
  <div id="msgWindow">
  <!-- 标题 -->
    <div id="header">
      <img :src="userImg" class="headIcon" >
      <span class="userName">{{$route.params.name}}</span>
    </div>

    <div id="historyMsg" >
      <div v-for="item in items">
         <announcement_view v-bind:msg="item"></announcement_view>
      </div>      
    </div>
  </div>
  <router-view></router-view>
</template>

<script>
  import mo_announcement from 'components/mo_announcement.vue'
  export default{
    components: {
      announcement_view:mo_announcement
    },
    replace: true, 
    data:function() {
      // 模拟数据
      return { 
        items:[
            {
              timeOfMsg:'2016-6-7 20:34',
              type:'announcement',                        
              title:"快速上手新企业尊享办公套件",
              img:"http://ww2.sinaimg.cn/crop.0.0.1080.1080.1024/d773ebfajw8eum57eobkwj20u00u075w.jpg",
              abstract:"快速上手新企业尊享办公套件，只需要简单几步操作就可以用上考勤打卡、签到、审批、日志，随时随地高效办公。",
              author:"光强",
              time:"6-7 20:34"              
            },
            {
              timeOfMsg:'2016-6-7 20:34',
              type:'announcement',                        
              title:"快速上手新企业尊享办公套件",
              img:"http://ww2.sinaimg.cn/crop.0.0.1080.1080.1024/d773ebfajw8eum57eobkwj20u00u075w.jpg",
              abstract:"快速上手新企业尊享办公套件，简单几步操作就可以用上考勤打卡、签到、审批、日志，随时随地高效办公。",
              author:"光强",
              time:"6-7 20:34"              
            },
            {
              timeOfMsg:'2016-6-7 20:34',
              type:'examine',
              title:"请假",
              typeOne:"请假类型：",
              typeTwo:"结婚",
              timeOne:"开始时间：",
              timeTwo:"2016-06-07 23:19",
              endTimeOne:"结束时间：",
              endTimeTwo:"2016-06-10"
            },
            {
              timeOfMsg:'2016-6-7 20:34',
              type:'examine',
              title:"出差",
              typeOne:"出差地点：",
              typeTwo:"四川省阿坝藏族羌族自治州九寨沟县",
              timeOne:"开始时间：",
              timeTwo:"2016-06-07 23:19",
              endTimeOne:"结束时间：",
              endTimeTwo:"2016-06-10"
            }
        ],
        
        userImg:"http://ww2.sinaimg.cn/crop.0.0.1080.1080.1024/d773ebfajw8eum57eobkwj20u00u075w.jpg",
      }
    },
    
  }

</script>

<style>
  #msgWindow{
    width: 100%;
    height:100%;
  }
  #msgWindow #header{
    width:100%;
    height:8%;
    /*font-size:20px;*/
    border-bottom:1px solid #E6E5E6;
  }
  #header img{
    width:40px;
    height:40px;
    vertical-align:middle;
    border-radius:50px;
  }
  
  #historyMsg{
    width:100%;
    height:92%;
    overflow:scroll;
    padding-left: 10px;
  }
  /*#historyMsg img{
    width:40px;
    height:40px;
    vertical-align:middle;
    border-radius:50px;
  }*/
  
</style>