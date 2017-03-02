<template>    
	    <table class="table-wrap">
	    	<colgroup>
	            <col width="25%" />
	            <col width="15%" />
	            <col width="10%" />
	            <col width="12%" />
	            <col width="18%" />
	            <col width="10%" />
	            <col width="10%" />
	        </colgroup>
		    <tr :style="{color:model.status ? '' : model.priorityColor}" @click="changeType">
		    	<td>		    		
		    		<span class="task-title" title="{{model.title}}">{{{model.title}}}</span>
		    		<!-- <span @click="toggle"  v-if="isFolder">[{{open ? '-' : '+'}}]</span> -->
		    		<span v-if="isFolder" class="{{open? 'fa fa-caret-down':'fa fa-caret-right'}} jt-style" aria-hidden="true"></span>
		    	</td>
		    	<td>{{model.type}}</td>
		    	<td>{{model.priorityName}}</td>
		    	<td>{{model.deadline}}</td>
		    	<td>{{model.finishTime||'---'}}</td>
		    	<td>{{model.status?'完成':'未完成'}}</td>
		    	<td >
		    		<a class="check-subtask" @click="showDetail">详情</a>		    		
		    	</td>
		    </tr>
		</table>
	    
	    <ul v-show="open"> 
	      <item class="item" v-for="model in model.children" :model="model"></item>
	    </ul>
    
</template>
<script>
	export default{
		name:"item",
		props:['model'],
		data: function () {
		    return {
		      open: false,
		    }
		},
		computed: {
		    isFolder: function () {
		      return this.model.children && this.model.children.length
		    }
		},
		methods:{
			toggle: function (event) {
		    	console.log(this.model.title);
			    if (this.isFolder) {
			       this.open = !this.open
			    }	
		    },
		    changeType: function () {
		    	var vm = this;
		    	vm.toggle();
		    	//接口返回数据
		    	var dataT = '';		    	
			    var obj = {
			    	url:'/home/task/1811.spring',
			    	args:{
						id:this.model.id
					},
					success:function(rst){
						var vm = this;
						dataT = rst.data;
						if(dataT.length == 0){
							tools.toast("没有子任务","default");
						}else{							
							//XSS
							for( var i=0,len=dataT.length;i<len;i++){
								for(var key in dataT[i]){
									dataT[i][key] = encodeHtml(dataT[i][key]);
								}
							}
						}
					},
					error:function(){},
					asy:false
			    };
			    Ajax(obj);
		      	if (!this.isFolder) {		      		
		        	// 添加children属性，并触发视图更新
			        this.model = Object.assign({}, this.model, { children: '' })
			        for (var i = 0,len = dataT.length; i < len; i++) {
			        	dataT[i].title = "&nbsp;&nbsp;&nbsp;&nbsp;"+dataT[i].title;
			        }			        			       
			        this.model.children = dataT;
			        this.open = true;
		      	}
		    },
		    showDetail:function(event){
		    	var vm = this;
		    	this.$dispatch('changeisopen',[true,vm]);
		    	// 阻止事件冒泡
		    	event.stopPropagation();
		    	// vm.$emit('godetail',this.model.name);				
		    },
		},
	}
</script>
<style scoped>
	/*.isHover:active {
	   border:1px solid #dddcdd;
	   border-style: dotted;
	}*/
	.item {
	  cursor: pointer;
	}		
	table{
		width: 95%;
	}
	/*覆盖bass.css样式*/	
	.table-wrap td:nth-child(1) span{
		/*width: 25%;*/
		font-size:12px; 
		width: 160px;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    display: block;
	}	
	.table-wrap .task-title{
    	/*margin-left: 13px;*/
	}	
	.check-subtask{		
	    font-size: 14px;
	    color: #FF9615;
	}
	.check-subtask:hover{
		color: #FF9615;
		text-decoration:underline;
	}
	.table-wrap td{
		position: relative;
		font-size: 12px;
	}
	.jt-style{
		color: #4b4a4b;
	    position: absolute;
	    left: -10px;
	    top: 15px;
	    font-size: 25px;
	}
		
</style>