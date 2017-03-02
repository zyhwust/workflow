<template>
	<div class="detail-content" v-if="items.hasData">
		<table>
			<thead>
				<tr>
					<td>发起人</td>
					<!-- <td>审批摘要</td> -->
					<td>类型</td>
					<td>发起时间</td>
					<td>科室</td>
					<td>状态</td>
				</tr>
			</thead>
			<tbody>
				<tr v-for="item in items.data" v-link="#" @click="showDetail($index,item)">
					<td>
						<img class="user-img" :src="item.userIcon" onerror="this.src = BASE.url + '/MobileOA/src/assets/img/default.jpg'"/>
						<span class="detail-title">{{item.startername}}</span>
					</td>
					<!-- 摘要 -->
					<td>
						<span>{{item.flowname}}</span>
					</td>
					<td>
						<span>{{item.rdt}}</span>
					</td>
					<td>
						<span>{{item.deptname}}</span>
					</td>
					<td>
						<span>{{item.listStatus}}</span>
					</td>
				</tr>
			</tbody>
		</table>
	</div>

	<div class="page-cover" @click="closeDetail" v-if="isOpen"></div>
	<!-- 侧边栏 -->
	<div class="slideright">
      <div class="slider-header">
	      <span>{{detailTitle}}</span>
	      <span class="slider-close fa fa-times" @click="closeDetail"></span>
      </div>
      <div class="slider-body">
        <div class="workflow-detail">
          <div class="detail-head">
          	<img :src="userIcon" onerror="this.src = BASE.url + '/MobileOA/src/assets/img/default.jpg'"/>
          	<div class="">
	          	<span>{{name}}</span>
	          	<span>{{statusTxt}}</span>
          	</div>
          </div>
          <!--非统方流程-->
          <div v-if="currentFlow.fk_flow != '006'" class="detail-message">
          	<!-- <span>类型：</span>
          	<span>金额：</span>
          	<span>明细：</span>
          	<span>说明：</span> -->
          	<span>题目：{{detail.topic_title}}</span>
          	<span>内容：{{detail.content}}</span>
          </div>
          <!--统方流程-->
          <div v-else class="detail-message">
            <span>流水号：{{currentFlowDetails.liushuihao}}</span>
            <span>发起时间：{{currentFlowDetails.starttime}}</span>
            <span>发起人：{{currentFlow.startername}}</span>
            <span>流程详情：{{currentFlowDetails.content}}</span>
            <span>统方开始时间：{{currentFlowDetails.workstarttime}}</span>
            <span>统方截止时间：{{currentFlowDetails.workendtime}}</span>
          </div>
        </div>
        <!-- 流程进度 -->
        <div class="examine-schedule">
        	<ul>
        		<li v-for="step in steps">
        			<!-- <span>{{step.actiontypetext}}</span>        			 -->
        			<div class="examine-step">
        				<div class="examine-arrow"></div>
        				<div class="step-status" id="stepStatus">
        					<span class="{{step.icon}}"></span>
        				</div>
        				<span class="step-name">{{step.empfromt}}</span>
        				<span class="step-name">{{step.ndfromt}}</span>
        				<span class="step-time">{{step.rdt}}</span>
        				<span class="step-exstatus">{{step.exStatus}}</span>
                <span class="step-content">{{step.content||step.msg}}</span>
        			</div>
        		</li>
        	</ul>
        </div>
        <!-- 操作 -->
        <div class="need-examine" v-if="isSendToMe">
          <button class="agree-btn" @click="agree">同意</button>
          <button class="refuse-btn" @click="refuse">拒绝</button>
        </div>
        <div class="start-examine" v-if="isStartFromMe">
          <button class="cancel-btn" @click="cancel">撤销</button>
        </div>
      </div>
    </div>
    <!-- 审批意见 -->
    <div class="comment-form" v-if="comDisplay">
    	<div>
    		<span class="fa fa-times" @click="closeComment"></span>
    	</div>
    	<div class="comment-text">
    		<textarea placeholder="说点什么吧..." v-model="commentText"></textarea>
    	</div>
    	<div>
    		<button class="send-btn" @click="sendComment">发送</button>
    	</div>
    </div>
    <!--弹出确认框-->
    <div class="task-confirm" v-if="alertbox">
      <div class="confirm-head">
        <span class="fa fa-times" @click="closeAlert"></span>
      </div>
      <div class="confirm-body">
        <span class="confirm-content">是否确认撤销</span>
      </div>
      <div class="confirm-foot">
        <button class="send-btn" @click="ensure">确定</button>
        <button class="send-btn" @click="noEnsure">取消</button>
      </div>
    </div>
</template>
<script>
	export default {
    	props:['items'],
    	data(){
    		return{
    			operateIndex:'',  //具体流程ID
    			operateWorkId:'',
    			operateFlow:'',
    			agreeOrRefuse:'',
    			fid:'',
    			ndfrom:'', // 来自哪个节点id
    			ndto:'', //走向的下一个节点id
    			statusTxt:'', //审核的状态（文本显示）
    			isOpen:false,
    			name:'',
    			detailTitle:'',
    			status:'',
    			isSendToMe:true,
    			isStartFromMe:true,
    			commentText:'', //输入的文本
    			comDisplay:false,
    			detail:'', //流程题目和内容
    			userIcon:'',
    			steps:[],   //流程进度
          alertbox:false,

          //统方流程
          currentFlow:{},   //当前流程基础信息
          currentArguments:{},   //当前流程请求所需参数
          currentFlowDetails:{}  //当前流程详情
    		}
    	},
    	methods:{
    		//显示具体流程的详细信息
    		showDetail:function(index,item){
    			var vm = this;
          vm.isStartFromMe = false;
          vm.currentFlow = item;
          vm.currentArguments.userId = localStorage.userId;
          vm.currentArguments.sid = localStorage.sid;
          vm.currentArguments.fk_flow = vm.currentFlow.fk_flow;
          vm.currentArguments.shenheren = localStorage.userName;
          vm.currentArguments.workID = vm.currentFlow.workid;
          vm.currentArguments.ispass = localStorage.operate;
          vm.currentArguments.startername = vm.currentFlow.startername;
          vm.currentArguments.fid = '';
          vm.currentArguments.Suffix = '';

          vm.isOpen = true;
    			vm.operateIndex = index;
    			vm.name = vm.items.data[index].startername;
    			vm.detailTitle = vm.items.data[index].startername + vm.items.data[index].flowname;
    			vm.userIcon = vm.items.data[index].userIcon;
    			vm.statusTxt = vm.items.data[index].listStatus;
    			vm.operateWorkId = vm.items.data[index].workid;
    			vm.operateFlow = vm.items.data[index].fk_flow;

          //获取流程详细信息
          if(vm.currentFlow.fk_flow == '006'){
            //统方流程
            //获取fk_node、fid
            let url2056 = BASE.JFurl+'/Jflow/2056?'+'userId='+vm.currentArguments.userId+'&sid='+vm.currentArguments.sid+'&workID='+vm.currentArguments.workID;
            $.ajax({
              type:'get',
              url:url2056,
              success: function (res) {
                res = JSON.parse(res);
                if(res.code == 0){
                  tools.toast(res.msg, 'error');
                  return;
                }
                let data = res.data[0];
                vm.currentArguments.fid = data.fid;
                let fk_node = data.fk_node;
                if(fk_node == 602){
                  vm.currentArguments.Suffix = "jw";
                }else if(fk_node == 604){
                  vm.currentArguments.Suffix = "ld";
                }else{vm.currentArguments.Suffix = "xxk";}
                console.log(vm.currentArguments);

                //获取表单详情
                let url2055 = BASE.JFurl+'/Jflow/2055?'+'userId='+vm.currentArguments.userId+'&sid='+vm.currentArguments.sid+'&fid='+vm.currentArguments.fid;
                console.log(url2055);
                $.ajax({
                  type: 'get',
                  url: url2055,
                  success: function (res) {
                    res = JSON.parse(res);
                    if(res.code == 0){
                      tools.toast(res.msg, 'error');
                    }else{
                      let data = res.data[0];
                      // 防XSS
                      for(var key in data){
                        data[key] = encodeHtml(data[key]);
                      }
                      vm.currentFlowDetails = data;
                      //获取流程审批进度
                      vm.getWorkSchedule(index);
                      $(".slideright").slideLeftShow();
                    }

                  },
                  error: function () {
                    tools.toast("网络错误", 'error');
                  }
                });
              },
              error: function () {
                tools.toast("网络错误", 'error');
              }
            });

          }else{
            //非统方流程
            $.ajax({
              type:'post',
              url:BASE.JFurl+'/Jflow/2051.do',
              data:{
                userId:localStorage.userId,
                sid:localStorage.sid,
                workID:vm.operateWorkId,
              }
            }).then(function(data){
              var rst = JSON.parse(data);
              if(rst.code == 1){
                vm.detail = rst.data[0];
                // 防XSS
                for(var key in vm.detail){
                  vm.detail[key] = encodeHtml(vm.detail[key]);
                }
                console.log(rst.data);
              }else{
                tools.toast(rst.msg, 'error');
              }
            },function(){
              tools.toast("网络错误", 'error');
            });
            //获取流程审批进度
            this.getWorkSchedule(index);
            $(".slideright").slideLeftShow();
          }


    		},
    		//关闭侧边栏和遮照层
    		closeDetail:function(){
    			this.isOpen = false;
    			$(".slideright").slideLeftHide();
    		},
    		//同意按钮事件
    		agree:function(){
    			this.$root.overlay.display = true;
    			this.comDisplay = true;
    			this.agreeOrRefuse = 'agreeFlow';
    		},
    		//拒绝按钮事件
    		refuse:function(){
    			this.$root.overlay.display = true;
    			this.comDisplay = true;
    			this.agreeOrRefuse = 'refuseFlow';
    		},
        closeAlert:function(){
          var vm = this;
          vm.alertbox = false;
          vm.$root.overlay.display = false;
        },
    		// 撤销流程
    		cancel:function(){
          var vm = this;
          vm.alertbox = true;
          vm.$root.overlay.display = true;
    		},
        ensure:function(){
            var vm = this;
            $.ajax({
              type:'post',
              url:BASE.JFurl+'/Jflow/2019.do',
              data:{
                userId:localStorage.userId,
                sid:localStorage.sid,
                workID:vm.operateWorkId,
                fk_flow:vm.operateFlow,
              }
            }).then(function(data){
              var rst = JSON.parse(data);
              if (rst.code == 1) {
                tools.toast("撤销成功", 'success');
                vm.closeDetail();
                console.log(vm.operateIndex);
                vm.items.data.$remove(vm.items.data[vm.operateIndex]);
                // vm.showDetail(vm.operateIndex);
                //提示减1
                // getMsg();
              }else{
                tools.toast(rst.msg, 'error');
              }
            },function(){
              tools.toast("网络错误", 'error');
            });
            vm.closeAlert();
        },
        noEnsure:function(){
          var vm = this;
          vm.closeAlert();
        },
    		//关闭输入框和遮照层
    		closeComment:function(){
    			this.$root.overlay.display = false;
    			this.comDisplay = false;
    		},
        getNowFormatDate:function() {
          var date = new Date();
          var seperator1 = "-";
          var seperator2 = ":";
          var month = date.getMonth() + 1;
          var strDate = date.getDate();
          if (month >= 1 && month <= 9) {
            month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
          }
          var hours = date.getHours();
          var minutes = date.getMinutes();
          var seconds = date.getSeconds();
          if(hours>=0&&hours<=9){
            hours = '0'+hours;
          }
          if(minutes>=0&&minutes<=9){
            minutes = '0'+minutes;
          }
          if(seconds>=0&&seconds<=9){
            seconds = '0'+seconds;
          }
          var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + hours + seperator2 + minutes
            + seperator2 + seconds;
          return currentdate;
        },
    		//发送流程,走下一步
    		sendComment:function(){
    			var vm = this;
          if(vm.currentFlow.fk_flow == '006'){
            //统方流程
            let isPass = 0;
            if(vm.agreeOrRefuse == 'agreeFlow'){
              isPass = 1;
            }else{
              isPass = -1;
            }
            let time = vm.getNowFormatDate();
            let jsonstr='{"shenheren_'+vm.currentArguments.Suffix+'":"'+vm.currentArguments.shenheren+'","ispass_'+vm.currentArguments.Suffix+'":"'+isPass+'","yijian_'+vm.currentArguments.Suffix+'":"'+vm.commentText+'","passtime_'+vm.currentArguments.Suffix+'":"'+time+'"}';
            let data2 = 'userId='+vm.currentArguments.userId+'&sid='+vm.currentArguments.sid+'&workID='+vm.currentArguments.workID+'&fk_flow='+vm.currentArguments.fk_flow+'&jsonstr='+jsonstr;
            console.log(data2);
            let url2054 = BASE.JFurl+'/Jflow/2054';
            $.ajax({
              type:'post',
              url:url2054,
              headers: {
                "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
              },
              data:data2,
              success: function (res) {
                res = JSON.parse(res);
                if(res.code == 1){
                  tools.toast("审核成功", 'success');
                  vm.items.data.$remove(vm.items.data[vm.operateIndex]);
                  //提示减1
                  // getMsg();
                  //此处应该刷新页面，审核过的流程在列表中删除
                  // vm.showDetail(vm.operateIndex);
                }else {
                  tools.toast(res.msg, 'error');
                }
              },
              error: function () {
                tools.toast("网络错误", 'error');
              }
            })

          }else{
            //非统方流程
            if(vm.agreeOrRefuse == 'agreeFlow'){
              $.ajax({
                type:'post',
                url:BASE.JFurl+'/Jflow/2016.do',
                data:{
                  userId:localStorage.userId,
                  sid:localStorage.sid,
                  workID:vm.operateWorkId,
                  fk_flow:vm.operateFlow,
                  note:vm.commentText
                }
              }).then(function(data){
                var rst = JSON.parse(data);
                if(rst.code == 1){
                  // 流程完成，则生成任务
                  if(rst.data.isStopFlow){
                    var obj1807 = {
                        url:'/home/task/1807.spring',
                        args:{
                          title:vm.detail.topic_title,
                          content:vm.detail.content,
                          typeId:3,
                          member:localStorage.userId,
                          descri:"流程生成议题，会议选议题",
                          headUserId:localStorage.userId,
                          source:"system",
                          issueId:vm.operateWorkId,
                        },
                        success:function(rst){
                        },
                        error:function(){
                        },
                        asy:true
                      };
                      Ajax(obj1807);
                  }
                  tools.toast("审核成功", 'success');
                  vm.items.data.$remove(vm.items.data[vm.operateIndex]);
                  //提示减1
                  // getMsg();
                  //此处应该刷新页面，审核过的流程在列表中删除
                  // vm.showDetail(vm.operateIndex);
                }else{
                  tools.toast(rst.msg, 'error');
                  //直接关闭即可
                  // vm.closeComment();
                }
              },function(){
                tools.toast("网络错误", 'error');
              })
            }else{
              $.ajax({
                type:'post',
                url:BASE.JFurl+'/Jflow/2017.do',
                data:{
                  userId:localStorage.userId,
                  sid:localStorage.sid,
                  workID:vm.operateWorkId,
                  fk_flow:vm.operateFlow,
                  fid:vm.fid,
                  currentNodeID:vm.ndto,
                  returnToNodeID:vm.ndfrom,
                  note:vm.commentText,
                }
              }).then(function(data){
                var rst = JSON.parse(data);
                if(rst.code == 1){
                  tools.toast("退回成功", 'success');
                  vm.items.data.$remove(vm.items.data[vm.operateIndex]);
                  //提示减1
                  // getMsg();
                  //此处应该刷新页面，审核过的流程在列表中删除
                  // vm.showDetail(vm.operateIndex);
                }else{
                  tools.toast(rst.msg, 'error');
                  //直接关闭即可
                  // vm.closeComment();
                }
              },function(){
                tools.toast("网络错误", 'error');
              })
            }
          }

    			vm.closeComment();
    			vm.closeDetail();
          vm.commentText = '';
    			// 删除我审批过的流程
	    		// vm.items.data.$remove(vm.items.data[vm.operateIndex]);
    		},
    		//获取流程进度
    		getWorkSchedule:function(index){
    			var vm = this;

    			vm.fid = vm.items.data[index].fid;


          if(vm.currentFlow.fk_flow == '006'){
            //统方流程
            let steps = [];
            var step = {};
            step.icon = 'fa fa-ellipsis-h';
            step.ndfromt = '发起';
            step.empfromt = vm.currentArguments.startername;
            step.rdt = vm.currentFlowDetails.starttime;
            step.exStatus = '申请';
            steps.push(step);

            if(vm.currentFlowDetails.ispass_ld === undefined){
              //未审批
            }else{
              //已审批
              if(vm.currentFlowDetails.ispass_ld){
                var step = {};
                if(vm.currentFlowDetails.ispass_ld == 1){
                  step.icon = 'fa fa-check';
                  step.exStatus = '同意';
                }else{
                  step.icon = 'fa fa-times';
                  step.exStatus = '拒绝';
                }
                step.ndfromt = '领导审批';
                step.empfromt = vm.currentFlowDetails.shenheren_ld;
                step.rdt = vm.currentFlowDetails.passtime_ld;
                let content = vm.currentFlowDetails.yijian_ld||'无';
                step.content = '意见:'+content;
                steps.push(step);
              }
              if(vm.currentFlowDetails.ispass_jw){
                var step = {};
                if(vm.currentFlowDetails.ispass_jw == 1){
                  step.icon = 'fa fa-check';
                  step.exStatus = '同意';
                }else{
                  step.icon = 'fa fa-times';
                  step.exStatus = '拒绝';
                }
                step.ndfromt = '纪委审批';
                step.empfromt = vm.currentFlowDetails.shenheren_jw;
                let content = vm.currentFlowDetails.yijian_jw||'无';
                step.content = '意见:'+content;
                step.rdt = vm.currentFlowDetails.passtime_jw;

                steps.push(step);
              }
              if(vm.currentFlowDetails.ispass_xxk){
                var step = {};
                if(vm.currentFlowDetails.ispass_xxk == 1){
                  step.icon = 'fa fa-check';
                  step.exStatus = '同意';
                }else{
                  step.icon = 'fa fa-times';
                  step.exStatus = '拒绝';
                }
                step.ndfromt = '信息科审批';
                step.empfromt = vm.currentFlowDetails.shenheren_xxk;
                let content = vm.currentFlowDetails.yijian_xxk||'无';
                step.content = '意见:'+content;
                step.rdt = vm.currentFlowDetails.passtime_xxk;
                steps.push(step);
              }
              if(vm.currentFlowDetails.ispass_xxk=='-1'||vm.currentFlowDetails.ispass_jw=='-1'||vm.currentFlowDetails.ispass_ld=='-1'||(vm.currentFlowDetails.ispass_xxk+vm.currentFlowDetails.ispass_jw+vm.currentFlowDetails.ispass_ld==3)){
                var step = {};
                if(vm.currentFlowDetails.ispass_xxk+vm.currentFlowDetails.ispass_jw+vm.currentFlowDetails.ispass_ld==3){
                  step.icon = 'fa fa-check';
                  step.exStatus = '通过';
                }else{
                  step.icon = 'fa fa-times';
                  step.exStatus = '撤销';
                }
                step.ndfromt = '结束';
                step.empfromt = '合并流程';
                step.rdt = vm.currentFlowDetails.workstarttime;
                steps.push(step);
              }
            }
            vm.steps = steps;
          }else{
            //非统方流程
            $.ajax({
              type:'post',
              url:BASE.JFurl+'/Jflow/2041.do',
              data:{
                userId:localStorage.userId,
                sid:localStorage.sid,
                fk_flow:vm.items.data[index].fk_flow,
                workID:vm.items.data[index].workid,
                fid:vm.items.data[index].fid,
              }
            }).then(function(data){
              var rst = JSON.parse(data);
              if(rst.code == 1){
                vm.steps = rst.data.Track;
                //防XSS
                for(var i=0,len=vm.steps.length;i<len;i++){
                  for(var key in vm.steps[i]){
                    vm.steps[i][key] = encodeHtml(vm.steps[i][key]);
                  }
                }
                var datalength = vm.steps.length;
                //我申请的流程中只在能撤销的地方显示撤销按钮（用数组长度来判断流程是否仍然处在第一步）
                if(localStorage.operate == 3){
                  if(datalength>1){
                    vm.isStartFromMe = false;
                  }else{
                    vm.isStartFromMe = true;
                  }
                }
                vm.ndfrom = vm.steps[datalength-1].ndfrom;
                vm.ndto = vm.steps[datalength-1].ndto;
                //创建审批的下一步节点，添加到steps[]的最后
                var nextPerson={
                  empfromt:vm.steps[datalength-1].emptot,
                  ndfromt:vm.steps[datalength-1].ndtot,
                  actiontype:'',
                  // rdt:'',
                }

                for(var i=0;i<vm.steps.length;i++){
                  var actiontype = vm.steps[i].actiontype;
                  // 审核状态提示图标
                  if(actiontype == 1){
                    vm.steps[i].icon = 'fa fa-check';
                    vm.steps[i].exStatus = '同意';
                    // 正在审批的结点
                    vm.steps[datalength] = nextPerson;
                  }else if(actiontype == 2){
                    vm.steps[i].icon = 'fa fa-times';
                    vm.steps[i].exStatus = '退回';
                    // 删除最后节点
                    vm.steps.length = datalength;
                  }else if(actiontype == 5){
                    vm.steps[i].icon = 'fa fa-times';
                    vm.steps[i].exStatus = '撤销';
                    // 删除最后节点
                    vm.steps.length = datalength;
                  }else if(actiontype == 8){
                    vm.steps[i].icon = 'fa fa-check';
                    vm.steps[i].exStatus = '审核通过，流程结束';
                    // 删除最后节点
                    vm.steps.length = datalength;
                  }else{
                    vm.steps[i].icon = 'fa fa-ellipsis-h';
                    vm.steps[i].exStatus = '正在审核';
                  }
                  vm.steps[0].exStatus = '申请';
                }
              }else{
                tools.toast(rst.msg, 'error');
              }
            },function(){
              tools.toast("网络错误", 'error');
            })
          }



    		}
    	},
    	ready(){
    		var vm =this;
    		//为切换操作按钮
    		var operate = localStorage.operate;
    		if(operate == 1){
          vm.isSendToMe = true;
          vm.isStartFromMe = false;
        }else if(operate == 2){
          vm.isSendToMe = false;
          vm.isStartFromMe = false;
        }else if(operate == 3){
          vm.isSendToMe = false;
          vm.isStartFromMe = true;
        }
      }
  	}
</script>
<style>
	ul{
		list-style: none;
	}
	.detail-content{
		margin-top: 10px;
		font-size: 15px;
	}
	/*table{
		border-spacing: 0;
		border-collapse: collapse;
		width: 100%;
		text-align: left;
	}
	thead{
		border-top: 1px solid #DFDDDD;
		background-color: #f8f8f8;
		height: 40px;
		line-height: 40px;
	}
	tr{
    	border-bottom: 1px solid #DFDDDD;
    	cursor: pointer;
    }
  tbody tr{
		height: 60px;
		line-height: 60px;
	}
  tbody tr:hover{
    background-color: #f7f8fd;
  } 
  td{
    padding-left: 10px;
  }*/
  .detail-title{
  	height: 40px;
  }
	.user-img{
		width: 40px;
		height: 40px;
		vertical-align: middle;
		border-radius:50%;
	}
	.page-cover{
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		/*opacity: 0.5;*/
		/*background-color: #DFDDDD;*/
	}
	.slideright{
		width: 500px;
		display: none;
		position: absolute;
		bottom:0;
    right:0;
    /*top:70px;*/
    height: 94%;
    z-index: 3;
		box-shadow: rgba(0, 0, 0, 0.247059) 0px 7px 21px;
		background-color: white;
		font-size: 15px;
	}
	.slider-header{
		width: 100%;
		/*设定最小宽度，避免隐藏时元素自动换行*/
		min-width: 500px;
		line-height: 50px;
		padding-left: 10px;
		border-bottom: 1px solid #DFDDDD;
		text-align: center;
	}
	.slider-close{
		position: absolute;
		right: 10px;
		line-height: 50px;
		cursor: pointer;
	}
	.slider-body{
		min-width: 500px;
		overflow:auto;
		padding-bottom: 100px;
		height: 90%;
	}
	.workflow-detail{
		padding:10px;
	}
	.detail-head img{
		width: 50px;
		height: 50px;
		float: left;
		border-radius: 50%;
		/*margin-bottom: 10px;*/
	}
	.detail-head span{
		margin-left: 60px;
		display: block;
		line-height: 25px;
	}
	.detail-message{
		margin-top: 10px;
		border-top: 1px solid #DFDDDD;
	}
	.detail-message span{
		display: block;
		margin: 10px;
	}
	.examine-schedule{
		border-top: 1px solid #DFDDDD;
		position: relative;

	}
	.examine-schedule:before{
		content: '';
		position: absolute;
    top: 0px;
    bottom: 40px;
    left: 20px;
    width: 1px;
    display: block;
    background: rgb(224, 224, 224);
	}
	.examine-step{
	  min-height: 50px;
    margin: 30px 10px auto 38px;
    position: relative;
    padding-left: 10px;
    padding-top: 5px;
    padding-bottom: 10px;
    background-color: #e27c3d;
    cursor: default;
    border-radius: 5px;
	}
	.examine-arrow{
	  position: absolute;
    width: 0px;
    height: 0px;
    border-top: 5px dashed  transparent;
    border-bottom: 5px dashed  transparent;
    border-right: 5px solid #e27c3d;
    font-size: 0px;
    line-height: 0px;
    left: -4px;
    bottom: 30px;
	}
	.step-status{
    width: 20px;
    height: 20px;
    position: absolute;
    left: -28px;
    bottom: 25px;
    border-radius: 50%;
    border: 1px solid #DFDDDD;
    background-color: #f5f9ff;
    color: #f6b032;
    text-align: center;
	}
	.step-name{
		color: white;
	}
	.step-time{
		position: absolute;
    top: 33px;
		right: 5px;
		font-size: 11px;
		color: #DFDDDD;
	}
	.step-exstatus{
		display: block;
    font-size: 12px;
    margin-top: 7px;
    color: white;
	}
  .step-content{
    font-size: 12px;
    color: white;
  }
	/*.operate-btn{
		position: fixed;
		bottom: 0px;
		width: 100%;
	}*/
	.need-examine{
		/*height: 50px;*/
		width: 100%;
    min-width: 500px;
		position: absolute;
		bottom: 0px;
		border-top: 1px solid #DFDDDD;
	}
	.need-examine button{
		width: 50%;
		font-size: 15px;
		background-color: #f1eded;
	}
	.agree-btn{
		float: left;
		height: 56px;
		border-left: none;
		border-top: none;
		border-bottom: none;
		border-right: 1px solid #DFDDDD;
	}
	.refuse-btn{
		float: left;
		height: 56px;
		border: none;
	}
	.start-examine{
		/*height: 50px;*/
		width: 100%;
    min-width: 500px;
		position: absolute;
		bottom: 0px;
		border-top: 1px solid #DFDDDD;
	}
	.cancel-btn{
		width: 100%;
    /*height: 100%;*/
    height: 56px;
    background-color: #ac293b;
    border: none;
    color: white;
    font-size: 16px;
	}
	.comment-form{
		width: 500px;
		height: 310px;
		margin: 80px auto;
		position: absolute;
		top: 0;
		left:0;
		bottom: 0;
		right: 0;
		border:1px solid #DFDDDD;
		background-color: #f5f5f5;
		border-radius: 10px;
		text-align: center;
		padding:10px;
		z-index: 10;
	}
	.comment-form span{
		float: right;
		color: #858e99;
		cursor: pointer;
	}
	/*.comment-form span:after{
		content: "";
		clear: both;
		width: 0;
		height: 0;
		display: block;
		visibility: hidden;
	}*/
	.comment-text{
		width: 100%;
		height: 200px;
		margin: 30px auto;
	}
	.comment-text textarea{
		width: 100%;
		height: 100%;
		resize: none;
		padding: 10px;
		font-size: 15px;
    border:none;
	}
	.send-btn{
		margin: auto;
    border: none;
    background-color: #FF8C00;
    color: white;
    width: 20%;
    height: 30px;
    border-radius: 5px;
	}
	.send-btn:hover{
		background-color: #FF9615;
	}
  .task-confirm{
    width: 300px;
    height:200px;
    margin: 80px auto;
    position: absolute;
    top: 0;
    left:0;
    bottom: 0;
    right: 0;
    border:1px solid #DFDDDD;
    background-color: white;
    border-radius: 10px;
    text-align: center;
    z-index: 10;
  }
  .confirm-head{
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #DFDDDD;
    /*margin-bottom: 50px;*/
  }
  .confirm-head span{
    float: right;
    color: #858e99;
    cursor: pointer;
    line-height: 40px;
    margin-right: 10px;
    font-size: 16px;
  }
  .confirm-head span:after{
    content: "";
    clear: both;
    width: 0;
    height: 0;
    display: block;
    visibility: hidden;
  }
  .confirm-body{
    margin: 50px auto 40px auto;
    font-size: 16px;
  }
  .confirm-foot{
    height: 50px;
    line-height: 50px;
    border-top: 1px solid #DFDDDD;
  }
  .send-btn{
    margin: auto;
    border: none;
    background-color: #FF8C00;
    color: white;
    width: 30%;
    border-radius: 5px;
  }
</style>
