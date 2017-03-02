<template>
    <li>
	    <div>
	      <i v-if="isFolder" class="{{open? 'fa fa-caret-down':'fa fa-caret-right'}}" aria-hidden="true"></i>
	      <span :class="{isHover: isFolder}"
	      @click="toggle">{{model.name}}</span><!-- （{{model.usersNum}}人） -->
	      <i class="fa fa-spinner fa-spin fa-fw loading" v-show="isLoading"></i>
	      <i v-if="allChecked" class="fa fa-check-square-o" @click="checkByDep(b,user)"></i>
	      <i v-else class="fa fa-square-o" @click="checkByDep(b,user)"></i>
	    </div>
		
	    <ul v-show="open" v-if="isFolder" >
	      	<item class="item" v-for="(a,model) in model.children" v-bind:id="Id" v-bind:itemid="model.id" v-bind:typeid="typeid" :model="model" v-bind:checkedall="checkedall">
	      	</item>
	    	<li @click="addperson(user)" class="user" v-for="user in  model.usersInfo">
	    		<div class="img_wrap">
	    			<div v-show="user.checked"  class="icon">
                      <i class="fa fa-check checked1"  aria-hidden= "true"></i>
                    </div>
	    			<img v-bind:src="user.userImgurl" alt="" onerror="this.src = BASE.url+'/upload/avatar/1.png'">
	    		</div>
	    		<div class="userInfo">
	    			{{user.userRealname}}
	    			<br>
	    			<span v-if="typeid == 'departmentId'">{{user.jobtitleName}}</span>
	    			<span v-if="typeid != 'departmentId'">{{user.departmentName}}</span>
	    		</div>
	    		<div class="userStatus">
	    			<span class="guan" v-if="user.roleId==1" for="">管</span>
	    			<span class="zheng" v-if="user.roleId==2" for="">正</span>
	    			<span class="lin" v-if="user.roleId==3" for="">临</span>
	    		</div>
	    	</li>
	    </ul>
    </li>
</template>
<script>
	export default{
		name:"item",
		props:['model','typeid','checkedall'],
		data: function () {
		    return {
		      open: false,
		      isLoading:false,
		      allChecked: false,
		      users: []
		    }
		},
		computed: {
		    isFolder: function () {
		    	//console.log(this.model.id);
		    	//console.log(this.model);
		  //   	var a = this.model.id;
		  //   	var obj1025 = {
				// 	url: '/home/user/1025.spring',
				// 	args: {
				// 		"typeId":departmentId,
			 //     		"id":a
				// 	},
				// 	success: function(rst) {
				// 		// this.model.usersInfo;
				// 	}
				// }
				// Ajax(obj1025);

		      	return true;//this.model.children&&this.model.children.length||this.model.usersInfo
		    }
		},
		watch:{
			'users': {
			    handler: function(val, oldVal) {
			        var self = this;
			        var allChecked = true;
			        if(self.users.length>0){
	        	        for(let user of self.users){
	        	        	if(!user.checked){
	        	        		allChecked = false;
	        	        	}
	        	        }
	        	        var dep = new Object();
    			    	dep.id = self.model.id;
    			    	dep.pid = self.model.pid;
    			    	dep.name = self.model.name;
    			    	dep.detpType = self.typeid;
	        	        if(allChecked){
	        	        	self.allChecked = true;
	        	        	self.addDep(dep);
	        	        }else{
	        	        	self.allChecked = false;
	        	        	self.deleteDep(dep);
	        	        }
			        }
			    },
			    deep: true
			}
		},
		methods:{
			toggle: function () {
		      	this.open = !this.open;

		      	if(!this.open) {
			      	this.$dispatch("unactiveDep", this);
		      	}

			      /*if( this.model.usersInfo ){
			      	return;
			      }	*/	      
		      	if(this.open) {				
		      		this.isLoading = true;
		      	}
		      	this.getUserInfo();
				/*if(this.checkedall){
					alert(21);
					this.checkByDep();
				}*/
		    },
		    
		    // 获取部门成员
		    getUserInfo: function(){
		    	var self = this;
				var obj1025 = {
					url: '/home/user/1025.spring',
					args: {
						"typeId":self.typeid,
						"id":self.model.id
					},
					success: function(rst) {
						// this.model.usersInfo;
						rst.data.forEach(function (item){
							item.userImgurl = BASE.url+"/upload/avatar/"+item.userId+".png";
							item.depId = self.model.id;
							self.$dispatch('checkedUser',item);
							// item.checked = false;
							if(self.checkedall){
								item.checked = true;
								self.allChecked = true;
							}
						});
						self.$set("model.usersInfo", rst.data);
						self.$set("users",rst.data);
						self.isLoading = false;
						self.$dispatch("activeDep", self);
					}
				}
				Ajax(obj1025);
		    },
		    addperson: function(user){
	    		if( user.checked ){
		    		user.checked = false;
		    		this.$dispatch('remove', user);
		    		// this.$dispatch('unCheckedAll');
		    	}else{
		    		user.checked = true;
		    		this.$dispatch('addperson', user);
		    	}
		    	// if(this.is_allChecked()){
		    	// 	this.allChecked = true;
		    	// }else{
		    	// 	this.allChecked = false;
		    	// }
		    },
		    //按照部门全选
		    checkByDep: function(){
		    	if(!this.open) {
		    		if(this.allChecked){
      		    		for(let user of this.model.usersInfo){
      			    		if(user.checked){
      							user.checked = false;
      		    				this.$dispatch('remove', user);
      			    		}
      		    		}
      		    	}else{
      		    		var self = this;
	  					var obj1025b = {
	  						url: '/home/user/1025.spring',
	  						args: {
	  							"typeId":self.typeid,
	  							"id":self.model.id
	  						},
	  						success: function(rst) {
	  							// this.model.usersInfo;
	  							rst.data.forEach(function (item){
	  								item.userImgurl = BASE.url+"/upload/avatar/"+item.userId+".png"; 	
	  								item.depId = self.model.id;
	  								self.$dispatch('checkedUser',item);
	  								// item.checked = false;
	  								if(self.checkedall){
	  									item.checked = true;
	  									self.allChecked = true;
	  								}
	  							});
	  							self.$set("model.usersInfo", rst.data);
	  							self.$set("users",rst.data);
	  							self.isLoading = false;
	  							self.$dispatch("activeDep", self);

					    		for(let user of self.model.usersInfo){
						    		if(!user.checked){
						    			user.checked = true;
							    		self.$dispatch('addperson', user);
						    		}
					    		}
					    		// self.open = true;
	  						}
	  					}
	  					Ajax(obj1025b);
      		    	}
		      	}else{
      		    	if(this.allChecked){
      		    		for(let user of this.model.usersInfo){
      			    		if(user.checked){
      							user.checked = false;
      		    				this.$dispatch('remove', user);
      			    		}
      		    		}
      		    	}else{
      		    		for(let user of this.model.usersInfo){
      			    		if(!user.checked){
      			    			user.checked = true;
      				    		this.$dispatch('addperson', user);
      			    		}
      		    		}
      		    	}
		      	}
		    	
		    	
		    	// if(this.is_allChecked()){
		    	// 	this.allChecked = true;
		    	// }else{
		    	// 	this.allChecked = false;
		    	// }
		    },
		    //检查是否全选
		    is_allChecked: function(){
		    	for(let user of this.model.usersInfo){
		    		if(!user.checked){
		    			var dep = {};
				    	dep.id = this.model.id;
				    	dep.pid = this.model.pid;
				    	dep.detpType = this.typeid;
		    			this.deleteDep(dep);
		    			return false;
		    		}
		    	}
		    	var dep = {};
		    	dep.id = this.model.id;
		    	dep.pId = this.model.pId;
		    	dep.pId = this.model.pId;
		    	dep.detpType = this.typeid;
		    	dep.name = this.model.name;
		    	this.addDep(dep);
		    	return true;
		    },
		    //添加全选部门
		    addDep: function(dep){
		    	this.$dispatch('addDep', dep);
		    },
		    //删除全选部门
		    deleteDep: function(dep){
	    		this.$dispatch('deleteDep', dep);
		    }
		},
		events:{
	        'is_allChecked': function(){
	        	var self = this;
		    	// for(let user of this.model.usersInfo){
		    	// 	if(!user.checked){
		    	// 		allChecked = false;
		    	// 	}
		    	// }
		    	// if(allChecked){
		    	// 	this.allChecked = true;
		    	// }else{
		    	// 	this.allChecked = false;
		    	// }
		    	console.log(self.allChecked);
		    	self.allChecked = true;
		    }
	    }
	}
</script>
<style scoped>
	.isHover:active {
	   border:1px solid #dddcdd;
	   border-style: dotted;
	}
	.fa-folder{
		color: #73B2E8;
	}
	.item {
	  cursor: pointer;
	}
	ul {
	  padding-left: 1em;
	  line-height: 30px;
	}
	.user{
		margin-left: -1em;
		height: 50px;
		margin-top: 5px;
		position: relative;
	}
	.img_wrap{
		position: absolute;
		float: left;
	    margin-right: 17px;
	    width: 33px;
	    height: 33px;
	    border-radius: 50%;
	    /*position: relative;*/
	    -webkit-user-select: none;
	}
	.icon{
		position: absolute;
		top: 0px;
		left: 0px;
		width: 33px;
	    height: 33px;
	    border-radius: 50%;
		background-color: #707275;
    	opacity: 0.9;
	}
	.user img{
		margin-right: 1em;
		width: 100%;
		height: 100%;
    	border-radius: 50%;
	}
	.icon .checked1{
		position: absolute;
    	top: 6px;
	    left: 6px;
	    color: #fff;
	    font-size: 20px;
	    font-weight: inherit;
	}
	.loading{
		color: #757575;
	}
	.userInfo{
		float: left;
		display: inline-block;
		line-height: 20px;
		width: 180px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding-left: 40px;
	}
	.userStatus{
		height: 100%;
		position: absolute;
		right: 5px;
		top: 4px;
	}
	.userStatus span{
		display: block;
		width: 25px;
		height: 25px;
		line-height: 25px;
		padding-left: 6px;
		border-radius: 50%;
		border: 1px solid #ddd;
		color: #fff;
	}
	.guan{
		background-color: #f55151;
	}
	.zheng{
		background-color: #3799df;
	}
	.lin{
		background-color: #fdad49;
	}
</style>