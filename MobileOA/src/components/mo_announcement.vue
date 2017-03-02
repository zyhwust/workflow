<template>
<div class="m-msgBox">
	<!-- 消息接收时间 -->
	<div class="m-timeOfMsg" id="timeOfMsg">
		<span>{{msg.timeOfMsg}}</span>
	</div>
	<!-- 公告消息模板 -->
	<div class="announcement-body" v-if="msg.type == 'announcement'">
		<div id="bubble_Jt" class="bubble_jiantou"></div>
		<!-- 公告头像 -->
		<div class="m-img" id="m-header">
			<i class="fa fa-bullhorn" aria-hidden="true"></i>
		</div>
		<!-- 消息卡片 -->
		<div id="announcement-box" >

			<!-- 标题 -->
			<div id="title">

				<span class="titleTxt">公告</span>
			</div>			
			<!-- 内容 -->
			<div id="m_content">
				<!-- 文章标题 -->
				<p class="msgTitle">{{msg.title}}</p>
				<!-- 图片 -->
				<div id="imgBox">
					<img src={{msg.img}}>
				</div>
				<!-- 文章摘要 -->
				<div id="msgAbstract">
					{{msg.abstract}}
				</div>
				<!-- 文章作者、时间 -->
				<div id="msgInfo">
					<span class="author">{{msg.author}}</span>
					<span class="time">{{msg.time}}</span>
				</div>
				<!-- 文章链接 -->
				<div id="msgLink">
					<a target="__block" href="">查看详情</a>
				</div>
			</div>
		</div>
	</div>

	<!-- 审批消息模板 -->
	<div id="examine-body" v-if="msg.type == 'examine'">
		<div id="bubble_Jt" class="bubble_jiantou" :class="{'bubble_Sp':true}"></div>
		<!-- 审批头像 -->
		<div class="m-img" id="m-header" v-bind:class="{'class-SP':true}">
			<i class="fa fa-check fa-1g" aria-hidden="true"></i>
		</div>
		<div class="examine-box">
			<!-- 标题 -->
			<div id="title">
				<span class="titleTxt">审批</span>
			</div>
			<!-- 内容 -->
			<div id="m_content">
				<!-- 文章标题 -->
				<p class="msgTitle">你的{{msg.title}}申请已同意，请知晓</p>
				<!-- 审批内容 -->
				<div id="msgForm" class="examineStyle">
					<div id="examineType">
						<span id="type1" class="txtColor">{{msg.typeOne}}</span>
						<span id="type2" class="txtStyle">{{msg.typeTwo}}</span>
					</div>
					<div id="startTime">
						<span id="time1" class="txtColor">{{msg.timeOne}}</span>
						<span id="time2" class="txtStyle">{{msg.timeTwo}}</span>
					</div>
					<div id="endTime">
						<span id="endtime1" class="txtColor">{{msg.endTimeOne}}</span>
						<span id="endtime2" class="txtStyle">{{msg.endTimeTwo}}</span>
					</div>
				</div>
				<!-- 同意 -->
				<div id="access">
					<span class="accessType">已同意</span>
				</div>
				<!-- 链接 -->
				<div id="msgLink">
					<a target="__block" href="">查看详情</a>
				</div>
			</div>
		</div>
	</div>
</div>
</template>
<script>
	export default {   
    	props:['msg'],
  	}
</script>
<style scoped>
	.m-msgBox{
		margin-top:10px;
		margin-bottom: 15px;
	}
	.bubble_jiantou{
		background-color: rgb(94, 151, 246);
		/*display: block;*/
		border-color: #e1e0e4;
		position: relative;
	    top: 20px;
	    /*right: auto;*/
	    left: 46px;
	    height: 8px;
	    width: 8px;
	    transform: rotate(45deg);
	    z-index: 10;
	    border: 0;
	    border-left: 1px solid #e1e0e4;
	    border-bottom: 1px solid #e1e0e4;
	    /*margin-left: 50px;
	    margin-top: 10px;*/
	}
	.bubble_Sp{
		background-color: rgb(255, 148, 62);
	}
	.m-timeOfMsg{
		margin-left: 55px;
		line-height: 14px;
		/*margin-top: 15px;*/
		height: 14px;
		font-size: 12px;
		color:#D6D4D4;
	}
	.announcement-body{	
		/*margin-bottom:15px;	*/
		width: 100%;
	}
	#announcement-box{
		margin-left: 50px;
		/*border: 1px solid #E6E5E6;*/
		border-radius: 10px;	
		width: 232px;
		/*height: 295px;*/
		overflow:hidden;
		box-shadow: 2px 3px 10px #949494;
	}
	#title{
		padding: 5px 5px;
		height: 30px;
		width: 100%;
		background-color: rgb(94, 151, 246);
	}
	#title .titleTxt{
		font-size: 16px;
		color: white;
	}
	.m-img{
	    line-height: 40px;
	    text-align: center;
	    width: 40px;
	    height: 40px;
	    border-radius: 40px;
	    background-color: #74BEF2;
	    float: left;
	    font-size: x-large;
	 }
	#m_content{
		padding: 5px 7px;
		/*font-size: 10px;*/
	}
	.msgTitle{
		margin: 3px 0 4px;
		font-size: 14px;
	}
	#imgBox{
		height: 110px;
		width: 100%;
		margin-bottom: 5px;
		position: relative;
		overflow: hidden;
		text-align: center;
	}
	#imgBox img{
		/*width: 100%;*/
		height: 100%;
		/*position: absolute;*/
	}
	#msgAbstract{
		margin-bottom: 4px;
	    display: -webkit-box;
	    -webkit-line-clamp: 3;
	    -webkit-box-orient: vertical;
	    text-overflow: ellipsis;
	    overflow: hidden;
	    font-size: 14px;
	    line-height: 18px;
	}
	#msgInfo{
		color: #bdbebf;
    	font-size: 13px;
	}
	#msgInfo .author{
		float: left;
	    max-width: 50%;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    word-wrap: normal;
	    margin-right: 5px;
	}
	#msgInfo .time{
		margin: 0;
	    padding: 0;
	    border: 0;
	    font: inherit;
	    font-size: 100%;
	    vertical-align: baseline;
	}
	#msgLink{
		cursor: pointer;
	    margin-top: 4px;
	    padding-top: 4px;
	    border-top: 1px solid #e6e5e6;
	    font-size: 15px;
	}
	#msgLink a,.link{
		text-decoration: none;
    	color: #38adff;
	}
	.examine-body{
		/*margin-bottom:15px;	*/
		width: 100%;
	}
	.examine-box{
		margin-left: 50px;
		/*border: 1px solid #E6E5E6;*/
		border-radius: 10px;	
		width: 232px;
		/*height: 150px;*/
		overflow:hidden;
		box-shadow: 2px 3px 10px #949494;
	}
	.examine-box #title{
		padding: 5px 5px;
		height: 30px;
		width: 100%;
		background-color: rgb(255, 148, 62);
	}
	.examineStyle{
		font-size: 14px;
	    width: 100%;
	    color: #222;
	    display: -webkit-box;
	    -webkit-line-clamp: 3;
	    -webkit-box-orient: vertical;
	    text-overflow: ellipsis;
	    overflow: hidden;
	}
	.txtColor{
		color: #858e99;
	}
	.txtStyle{
		color: #222;
    	white-space: pre-wrap;
	}
	.accessType{
		font-size: 14px;
	}
	#m-header i{
		color: white;
	}
	.class-SP{
		background-color: rgb(255, 148, 62);
	}
</style>