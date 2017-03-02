<template>
    <div id="mo_dep">
        <div class="content-head">
        	<p class="head-title">{{companyName}}</p>
        </div>
        <div class="company-wrapper">
    	<ul class="company-title">
    		<li>
    			<span>{{companyName}}</span><span>&nbsp;>&nbsp;&nbsp;{{depName}}</span>
    		</li>
    	</ul>
    	<ul class="company-content" id="user_list">
    		<li class="list-item" v-for="item in items" @click="showInfo(item.userId)">
    			<div class="info">
    				<div class="person-icon">
    					<img :src=item.userPicture alt onerror="this.src = BASE.url + '/upload/avatar/1.png'">
    				</div>

    			</div>
    			<div class="info">
    				<p class="total">{{item.userRealname}}</p>
    			</div>
    		</li>
    	</ul>
        </div>
    </div>
</template>
<script>
	export default {
		route: {
      //TODO 更换接口
		  data: function (transition) {
		    this.depName = transition.to.params.depName;
		    var vm = this;
		//     $.ajax({
		//     	type:'post',
		//     	url: BASE.url+'/home/user/1025.spring',
		//     	contentType: 'application/json',
		//     	data:JSON.stringify({
		//     		"typeId":transition.to.params.typeId,
		//     		"id":transition.to.params.depId
		//     	}),
		//     }).then(function(rst) {

		//     	if(rst.code!=1) {
		//     		alert(rst.msg);
		//     		return;
		//     	}
		//     	vm.companyName = localStorage.companyName;
		//     	if(rst.data==null || rst.data=='') {
		//     		vm.items = [];
		//     		return;
		//     	}
		//     	for(var i = 0 ,len = rst.data.length ; i< len; i++){
		//     		rst.data[i].userPicture = BASE.url+'/upload/avatar/'+rst.data[i].userTelephone+'.png';
		//     	}
		//     	vm.items = rst.data;
        //   console.log(vm.items)
		//     } , function() {alert('error');});
			var obj1025 = {
				url: '/home/user/1025.spring',
				args: {
					"typeId":transition.to.params.typeId,
		     		"id":transition.to.params.depId
				},
				success: function(rst) {
					vm.companyName = localStorage.companyName;
					if(rst.data==null || rst.data=='') {
						vm.items = [];
						return;
					}
					for(var i = 0 ,len = rst.data.length ; i< len; i++){
						rst.data[i].userPicture = BASE.url+'/upload/avatar/'+rst.data[i].userId+'.png';
					}
					vm.items = rst.data;
				}
			}
			Ajax(obj1025);
		  }
		},
		data () {
			return {
				companyName: '',
				depName: '',
				items: []
			}
		},
		methods: {
			showInfo(userId) {
				this.$root.myinfo.userId = userId;
				this.$root.overlay.display = true;
				this.$root.myinfo.display = true;
			}
		}
	}
</script>
<style>
	a {
		display: block;
	}
	#mo_dep {
		width: 80%;
		border-right: 1px solid #e6e5e6;
		/* overflow: auto; */
		height: 100%;
		font-size: 14px;
	}
	#mo_dep .company-wrapper {
		height: 90%;
		overflow: auto;
	}
	#mo_dep .content-head {
		height: 51px;
		line-height: 51px;
		text-align: left;
		border-bottom: 1px solid #dddcdd;
		color: #707275;
	}
	#mo_dep .content-head .head-title {
		float: left;
	    margin-left: 19px;
	    max-width: 60%;
	    color: #000000;
	}
	#mo_dep .company-title {
		margin-top: 19px;
		margin-left: 19px;
		color: #707275;
	}
	#mo_dep .company-content {
		margin-top: 10px;
		/* min-height: 650px;
		max-height: 650px; */
		/*overflow: auto;*/
	}
	#mo_dep .company-content .list-item {
		height: 65px;
		padding: 8px 21px;
	}
	#mo_dep .company-content .list-item:hover{
		background-color: #dfedfa;
	}
	#mo_dep .info .total {
		margin-top: 12px;
		color: #000000;
	}
	#mo_dep .info .person-icon {
		float: left;
		margin-right: 17px;
		width: 45px;
		height: 45px;
		border-radius: 50%;
	}
	#mo_dep .info img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
</style>
