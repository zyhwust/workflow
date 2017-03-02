<template>
    <div id="mo_org">
        <div class="content-head">
        	<p class="head-title">{{companyName}}</p>
        </div>
        <ul class="company-title">
        	<li>
        		<span>{{companyName}}</span>
        	</li>
        </ul>
        <ul class="company-content">
        	<li class="list-item" v-for="item in items"  v-link="{path: '/chat/contact/dep/'+item.deptId+'/'+item.deptName+'/'+'departmentId'}">
        		<div class="info">
        			<p>{{item.deptName}}</p>
        		</div>
        		<div class="info">
        			<p class="total">{{item.usersNum}}人</p>
        		</div>
        	</li>

        </ul>
    </div>
    <router-view></router-view>
</template>
<script>
	export default {
		ready () {
			var vm = this;

      //获取公司架构
      var obj1301 = {
        url: '/home/company/1301.spring',
        args: {
          "userId": localStorage.userId
        },
        success: function (rst) {
          if(rst.code!=1) {
            alert(rst.msg);
            return;
          }
          vm.companyName = rst.companyName ,
            vm.items = rst.data;
        },
        asy: true
      }
      Ajax(obj1301);

		},
		data () {
			return {
				companyName: '',
				items: []
			}
		}
	}
</script>
<style>
	a {
		display: block;
	}
	#mo_org {
		height: 100%;
		width: 80%;
		background-color: #fdfdfd;
		border-right: 1px solid #e6e5e6;
		font-size: 14px;
	}
	#mo_org .content-head {
		height: 51px;
		line-height: 51px;
		text-align: left;
		border-bottom: 1px solid #dddcdd;
		color: #707275;
	}
	#mo_org .content-head .head-title {
		float: left;
	    margin-left: 19px;
	    max-width: 60%;
	    color: #000000;
	}
	#mo_org .company-title {
		margin-top: 19px;
		margin-left: 19px;
		color: #707275;
	}
	#mo_org .company-content {
		overflow: auto;
		height: 80%;
		margin-top: 10px;
	}
	#mo_org .company-content .list-item {
		padding: 8px 21px;
	}
	#mo_org .company-content .list-item:hover{
		background-color: #dfedfa;
	}
	.company-content .list-item .info {
		margin-top: 1px;
		margin-bottom: 8px;
	}
	.list-item .info .total {
		color: #7d7d7e;
	}
</style>
