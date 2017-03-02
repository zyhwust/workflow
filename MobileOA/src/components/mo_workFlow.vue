<template>
    <div class="workFlow-content" v-if="showDiv.isWork">
    	<!-- 导航 -->
	    <div class="header">
	   		<div class="flow-head">
	    		<span>{{flowTypeName}}</span>    
		    </div>
		    <div class="apply-flow" @click="applyFlow" v-if="showCreatBtn">
	    		<span class="fa fa-pencil-square-o"></span>
	    		<span>申请流程</span>   
		    </div>
		    <div class="clear-float"></div>
	    </div>
	    <!-- 分类搜索 -->
	    <!-- <div class="work-category" v-if="showDiv.isShow">
	    	<div class="select-type">
		    	<span>审批类型</span>
				<select v-model="choice" @change="showResult">
					<option selected>全部</option>
					<option v-for="option in options" v-bind:value="option.no">{{option.name}}</option>
				</select>
			</div>
		</div> -->
		<!-- 流程列表 -->
		<div class="workFlow-body">
			<div class="detail-content">
				<table>
					<thead>
						<tr>
							<td>标题</td>
							<td>类别</td>
							<td>创建日期</td>
							<td>创建人</td>
							<td>状态</td>
						</tr>
					</thead>
					<tbody>
						<tr v-for="item in cells.data" @click="showDetail($index,item)">
							<td>							
								<span class="detail-title">{{item.workflow_ins_name}}</span>
							</td>
							<td>
								<span>{{item.workflow_def_name}}</span>
							</td>
							<td>
								<span>{{item.create_time}}</span>
							</td>
							<td>
								<span>{{item.creator_name}}</span>
							</td>
							<td>
								<span>{{item.state}}</span>
							</td>
						</tr>
					</tbody>
				</table>
				<!-- 分页 -->		
				<!-- <div class="task-paging">
					<button class="next" @click="prePage">上一页</button>
					<p class="page-num"><span id="current_page">{{page}}</span>/<span id="total_page">{{total}}</span></p>
					<button class="next" @click="nextPage">下一页</button>
				</div> -->
			</div>
		</div>	    
	</div>
	<!--弹出流程类型-->
    <div class="flow-wrap" v-if="comDisplay">
    	<div class="alert-header">
    		<span>选择流程</span>
    		<span class="fa fa-times close-wrap" @click="closeComment"></span>
    	</div>
    	<ul id="workflowDefList">
    		<li class="start-li" v-for="item in workflowType" @click="edit($index,item)" title="{{item.name}}">
    			<div class="workflow-icon"><img :src="imgUrl+icons[$index%5]"></div>
    			<span>{{item.name}}</span>
    		</li>
    	</ul>  	
    </div>
	<!-- 流程表单 -->
	<div class="workFlow-content" v-if="showDiv.isLeave">	   
    	<div class="header">		    		
	    	<div class="goback"  @click="closeEdit">
	    		<span class="fa fa-angle-left fa-1g goback-btn"></span>
		    	<span>返回</span>
		    </div>
		    <span id="workflow_name">{{flow_def_name}}</span>
	    </div>
	    <div class="task-body">
	    	<div class="task-form">
	    		<form class="form-horizontal workflow-form" id="workflowForm"></form>
	    		<!-- <div class="task-input">
	    			<label class="task-input-label">议题标题</label>
	    			<input class="input-line" type="text" v-model="title">
	    		</div>
	    		<div class="task-input">
	    			<label class="task-input-label">议题内容</label>
	    				<textarea class="input-area" v-model="content" placeholder="输入议题内容"></textarea>
	    		</div> -->
	    	</div>
			<div class="task-sub">						
				<button class="task-btn" id="subForm" @click="subWorkflow">提交</button>
			</div>	    		
	    </div>
	</div>
	
</template>
<script>
	export default {
		route:{
		    data:function(transition){
		      	var vm = this;
		        var flowType = transition.to.params.type;
		        if(flowType == 'apply'){
		        	vm.showCreatBtn = true;
		        	vm.cells.data = [];
		        	vm.flowTypeName = '我发起的流程';
		          	vm.showFour();
		          	vm.closeEdit();
		        }else if (flowType == 'examine') {
		        	vm.showCreatBtn = false;
		        	vm.cells.data = [];
		        	vm.flowTypeName = '待我审批的流程';
		          	vm.showTwo();
		          	vm.closeEdit();	         	
		        }else if (flowType == 'examined') {
		        	vm.showCreatBtn = false;
		        	vm.cells.data = [];
		        	vm.flowTypeName = '我已审批的流程';
		          	vm.showThree();
		          	vm.closeEdit();
		        }else if (flowType == 'copy') {
		        	vm.showCreatBtn = false;
		        	vm.cells.data = [];
		        	vm.flowTypeName = '流程综合统计';
		          	vm.showFive();
		          	vm.closeEdit();
		        }
		    },
		    // 切换路由时卸载以下两个css文件
		    canDeactivate:function(transition){
		    	removejscssfile("workflow","css");
		        removejscssfile("bootstrap.min","css");
		    	transition.next();
		    }
	    },
		data () {
			return {
				userInfo:{
					userId:localStorage.userId,	
					userName:localStorage.userName,
				},				
				showDiv:{
					isWork:true,
					isLeave:false,
					// hasData:true,
					// isShow:false,
				},
				tab:{
					choiceOne:false,
					choiceTwo:false,
					choiceThree:false,
					choiceFour:false,
					choiceFive:false,					
				},
				cells:{
					hasData:false,
					data:'',
				},
				states: ['创建', '草稿', '审批中', '完成', '终止'],
				icons: ['yitiS.png', 'applyS.png','chufangS.png','wupinS.png','xiupcS.png'],
				accountList:'',//流程审批人
				workflowType:'',							
				comDisplay:false,
				flowTypeName:'',
				typeId:'',
				typeUrl:'',
				userId:localStorage.userId,	
				choice:'',
				title:'',
				content:'',	
				showCreatBtn:true, //控制创建流程按钮显示	
				imgUrl:	BASE.url+'/MobileOA/static/img/icon/',
				// workflowName:'',//新建流程的类型
				workflow:null,//工作流定义
				widgets:[],//表单属性
				form_ins_id:'',//表单实例id
				flow_def_id:'',//流程定义id
				flow_def_name:'',//流程定义名
				workflowFunc:{
					'text':null,
					'mobile':null,
					'email':null,
					'phone':null,
					'number':null,
					'money':null,
					'dep':null,
					'textarea':null,
					'radio':null, 
					'checkbox':null,
					'date':null,
					'daterange':null,
					'description':null,
					'file':null,
				},
				App:{					
					type:{
					    '1':'text',
					    '2':'textarea',
					    '3':'mobile',
					    '4':'email' ,
					    '5':'phone',
					    '6': 'number',
					    '7': 'money',
					    '8': 'radio',
					    '9': 'checkbox',
					    '10': 'date',
					    '11': 'daterange',
					    '12': 'image',
					    '13': 'file',
					    '14': 'person',
					    '16': 'department',
					    '18': 'tree',
					    '19': 'description',
					    '20': 'table',
					    '21': 'separator',
					    '22': 'position',
					    '23': 'dep'
					},
				},				
			}
		},
		methods: {
			//申请流程
			applyFlow:function(){
				var vm = this;
				vm.$root.overlay.display = true;
				vm.comDisplay = true;
				vm.getCanStartFlow();
			},
			closeComment:function(){
				var vm = this;
				vm.$root.overlay.display = false;
				vm.comDisplay = false;
			},
			closeEdit:function(){
				var vm = this;
				vm.showDiv.isLeave = false;
				vm.showDiv.isWork = true;
				removejscssfile("workflow","css");
		        removejscssfile("bootstrap.min","css");
			},
			goback:function(){
				this.showDiv.isWork = true;
				this.showDiv.isLeave = false;
			},
			//获取当前登录人可以发起的流程类型
			getCanStartFlow:function(){
		        var vm = this;  
		        var obj = {
    				url: API.getDeflist,
    				args:{
						domain_id: App.Config.companyId
					},
					success:function(rst){				
						vm.workflowType = rst.ret.workflow_def_list;
						//防XSS
						$(vm.workflowType).each(function(i,item){
							vm.workflowType[i].name = encodeHtml(item.name);
						});
					},
					error:function(rst){
		                tools.toast(BASE.error, 'error');
					},			
					asy:true
    			};
    			Ajax(obj);				
			},			
			// 流程详情
			showDetail:function(i,item){
				var vm = this;
			},
			showTwo:function () {
				var vm = this;	
				tools.busy();	
				//获取待我审批的流程列表
				var obj = {
    				url: '/admin/workflow/2637.spring',
    				args:{
						approver_id : localStorage.userId,
		                status : "",
		                domain_id : App.Config.companyId,
					},
					success:function(rst){
						tools.busy(false);
					 	// vm.accountList = rst.ret.account_real_name;
		                vm.cells.data = rst.ret.workflow_ins_list;  
		                $(vm.cells.data).each(function(i,item){
		                	vm.cells.data[i] = encodeHtml(item);
		                	vm.cells.data[i].create_time = item.create_time.replace(/T/," ").split(".")[0];
		                	vm.cells.data[i].state = vm.states[item.status];
		                })        
					},
					error:function(rst){
						tools.busy(false);
		                tools.toast(BASE.error, 'error');
					},			
					asy:true
    			};
    			Ajax(obj);
			},
			showThree:function () {
				var vm = this;
				tools.busy();
				//获取待我审批的流程列表
				var obj = {
    				url: '/admin/workflow/2638.spring',
    				args:{
						operator_id : localStorage.userId,
		                status : "",
		                domain_id : App.Config.companyId,
					},
					success:function(rst){
						tools.busy(false);
					 	// vm.accountList = rst.ret.account_real_name;
		                vm.cells.data = rst.ret.workflow_ins_list;  
		                $(vm.cells.data).each(function(i,item){
		                	vm.cells.data[i] = encodeHtml(item);
		                	vm.cells.data[i].create_time = item.create_time.replace(/T/," ").split(".")[0];
		                	vm.cells.data[i].state = vm.states[item.status];
		                })        
					},
					error:function(rst){
						tools.busy(false);
		                tools.toast(BASE.error, 'error');
					},			
					asy:true
    			};
    			Ajax(obj);
			},
			showFour:function () {
				var vm = this;
				tools.busy();		
				//获取我发起的流程列表
				var obj = {
    				url: '/admin/workflow/2636.spring',
    				args:{
						creator_id : localStorage.userId,
		                status : "",
		                domain_id : App.Config.companyId,
					},
					success:function(rst){
						tools.busy(false);
					 	// vm.accountList = rst.ret.account_real_name;
		                vm.cells.data = rst.ret.workflow_ins_list;  
		                $(vm.cells.data).each(function(i,item){
		                	vm.cells.data[i] = encodeHtml(item);
		                	vm.cells.data[i].create_time = item.create_time.replace(/T/," ").split(".")[0];
		                	vm.cells.data[i].state = vm.states[item.status];
		                })        
					},
					error:function(rst){
						tools.busy(false);
		                tools.toast(BASE.error, 'error');
					},			
					asy:true
    			};
    			Ajax(obj);
			},
			// showFive:function () {
			// 	for(var key in this.tab){
			// 		if(this.tab[key]==true){
			// 			this.tab[key]=false;
			// 		}
			// 	}
			// 	// localStorage.operate = 2;
			// 	this.tab.choiceFive = true;
			// 	this.showDiv.isShow = true;
			// 	this.cells.hasData = false;
			// },
			
			//点击流程类型，弹出编辑流程
			edit:function(index,item){
				var vm = this;
				vm.comDisplay = false;
				vm.$root.overlay.display = false;
				vm.showDiv.isWork = false;
				vm.showDiv.isLeave = true;
				// vm.workflowName = item.name;
				vm.flow_def_id = item.id;
				vm.flow_def_name = item.name;
				vm.getWorkflowDefInfo(item);
				// 构建表单时引入以下两个css文件
				var arr = [];
				arr[0] = "static/css/workflow.css";
				arr[1] = "static/css/bootstrap.min.css";
				loadCss(arr);											
			},
			getWorkflowDefInfo:function(item){
		        var vm = this;
		        tools.busy();
		        var obj = {
		            url:API.getWorkflowDefInfo,
		            args: {
		                workflow_def_id:vm.flow_def_id
		            },
		            success: function(rst) {
		            	tools.busy(false);
		                vm.workflow = rst.ret.workflow_def;
		                //生成表单
		                vm.formIns = vm.AppWorkflowFormIns({
		                    formId: vm.workflow.form_def_id,
		                    // formInsId: this.workflowIns.form_ins_id,
		                    callback: function(){
		                        vm.submit();
		                    }
		                });		                
		            },
		            error:function(rst){
		                tools.busy(false);
		                tools.toast(rst, 'error');
		            },
		            // asy: false
		        }
		        Ajax(obj);                
		    },
		    // 表单实例
		    AppWorkflowFormIns:function(option){
		    	var vm = this;
		    	vm.formArgs = {
			    	callback : option.callback || function(){},
			    	// option:option
				    // formContainer : $("#workflowForm")
				}
		    	//获取表单定义的内容
		    	var objCreateFormIns = {
		            url:API.getFormInfo,
		            args:{
		                formId:option.formId,               
		            },
		            success: function(rst) {
		                vm.formDef = rst.data;
		                vm.buildForm(vm.formDef,vm.formArgs);
		            },
		            error:function(rst){
		                tools.busy(false);
		                tools.toast(rst.ret, 'error');
		            }
		        }
		        Ajax(objCreateFormIns);
		    },
		    buildForm:function(formDef,formArgs){
		    	var vm = this;
		    	// 清空
		    	vm.widgets = [];
		    	$(formDef).each(function(i, item){
		            var type = vm.App.type[item.type]
		            var widget = vm.workflowFunc[type](item);
		            vm.widgets.push(widget);
		            $("#workflowForm").append(widget.display);
		        })
		        $("#workflowForm").validate();
		    },
		    // 提交表单			
			subWorkflow:function(){
				var vm = this;
				tools.busy();
		        $("#subForm").attr('disabled', 'disabled');
		        if(!$("#workflowForm").validate('validateAll')) {
		            tools.busy(false);
		            // vm.$btnSubmit.removeAttr('disabled');
		            $("#subForm").removeAttr('disabled');
		            return false;
		        }
		        //构建数据
		        var itemValues = []        
		        $(vm.widgets).each(function(i, widget){
		            var value = widget.val();
		            itemValues.push({
		                item_id: widget.data.id,//item_id
		                item_value: typeof value === 'object' ? JSON.stringify(value) : value
		            })
		        });
		        // var name = vm.widgets[0].val();
		        var obj2504 = {
		            url:API.submitWorkflow,
		            args:{
		                formId:vm.workflow.form_def_id,                
		                map:itemValues,                
		            },
		            success: function(res) {
		                vm.form_ins_id = res.data;
		                vm.createWorkflowIns();
		                // vm.callback();		                             
		            },
		            error:function(rst){
		                tools.busy(false);
		                $("#subForm").removeAttr('disabled');
		                tools.toast(rst.ret, 'error');
		            }
		        }
		        Ajax(obj2504);       		        
			},
			//创建流程实例
			createWorkflowIns: function(){ 
		        var vm = this;
		        var objCreateWorkflowIns = {
		            type:'post',
		            url:API.createWorkflowIns,
		            args: {   
		                workflow_ins: JSON.stringify({
		                    workflow_def_id: vm.flow_def_id,
		                    workflow_def_name: vm.flow_def_name,
		                    form_def_id: vm.workflow.form_def_id,                    
		                    form_ins_id: vm.form_ins_id.toString(),
		                    workflow_ins_name: vm.workflow.name,
		                    creator_id: vm.userInfo.userId,
		                    creator_name: vm.userInfo.userName,
		                    domain_id: App.Config.companyId,
		                }),  
		            },
		            success: function(res) {
		                var workflowIns = res.ret.workflow_ins;
		                vm.getCurrentInfo(workflowIns);
		            },
		            error:function(rst){
		                tools.busy(false);
		                tools.toast(rst.ret, 'error');
		            },
		        };
		        Ajax(objCreateWorkflowIns);
		    },
		    getCurrentInfo: function(workflowIns){
		        var vm = this;       
		        var objGetCurrentInfo = {
		            url:API.getCurrentInfo,
		            args: {
		                workflow_ins_id:workflowIns.id,
		                account_id:vm.userInfo.userId              
		            },
		            success: function(res) {
		                var curInsInfo = res.ret;
		                vm.submitWorkflowIns(curInsInfo,workflowIns);
		            },
		            error:function(rst){
		                tools.busy(false);
		                tools.toast(rst.ret, 'error');
		            }
		        }
		        Ajax(objGetCurrentInfo);
		    },
		    submitWorkflowIns: function(curInsInfo,workflowIns){
		        var vm = this;
		        // 设置next_node_list参数，获取cur_node中的id，找到next_node中的id
		        var nextNodeList = [];
		        var next_seq = curInsInfo.cur_node.next_node.seq_id_list;

		        for(var i = 0, len = next_seq.length; i < len; i++ ) {
		            var next_seq_id = next_seq[i],
		                seq_id = '';
		            for(var j = 0, len = curInsInfo.next_node.length; j < len; j++ ) {
		                if(curInsInfo.next_node[j].seq_id == next_seq_id) {
		                    seq_id = curInsInfo.next_node[j].seq_id;
		                    var tempObj = {};
		                    tempObj.seq_id = seq_id;
		                    nextNodeList.push(tempObj);
		                    break;
		                }
		            }
		        }

		        // var next_seq_id = vm.curInsInfo.cur_node.next_node.seq_id_list[0];
		        // var seq_id = '';

		        // for(var i = 0, len = vm.curInsInfo.next_node.length; i < len; i++ ) {
		        //     if(vm.curInsInfo.next_node[i].seq_id == next_seq_id) {
		        //         seq_id = vm.curInsInfo.next_node[i].seq_id;
		        //     }
		        // }
		        // seq_id = [{"seq_id":"2"},{"seq_id":"3"},{"seq_id":"4"}]
		        // 提交流程实例-前进
		        var obj2671 = {
		        url: API.submitWorkflowIns,  
		            args: {               
		                workflow_ins_id: workflowIns.id,
		                account_id: vm.userInfo.userId,
		                account_name: vm.userInfo.userName,
		                cur_seq_id: curInsInfo.cur_node.seq_id,
		                comment:'', 
		                next_node_list: nextNodeList
		            },
		            success: function(res) {
		            	tools.busy(false);
		            	tools.toast('提交成功', 'success');
		            	vm.closeEdit();
		                // location.href = 'workflow.html';
		            },
		            error:function(rst){
		                tools.busy(false);
		                tools.toast(rst.ret, 'error');
		            }
		        }
		        Ajax(obj2671);
		    },


			
			//分类搜索
			// showResult:function(){
			// 	var vm = this;
			// 	var data = '',
			// 		Url = '';
			// 	if(vm.choice == '全部'){
			// 		data = {
			// 			userId:vm.userId,
			// 			sid:localStorage.sid,
			// 		};
			// 		if(localStorage.operate == 1){
			// 			Url = BASE.JFurl+'/Jflow/2012.do';						
			// 			vm.Ajax(Url,data);
			// 		}else if(localStorage.operate == 2){
			// 			Url = BASE.JFurl+'/Jflow/2037.do';
			// 			vm.Ajax(Url,data);
			// 		}else{
			// 			return;
			// 		}
			// 	}else{
			// 		data = {
			// 			userId:vm.userId,
			// 			sid:localStorage.sid,	
			// 			fk_flow:vm.choice,
			// 		};
			// 		Url = vm.typeUrl;
			// 		vm.Ajax(Url,data);					
			// 	}
			// },
			
			
			// 封装获取流程的方法
			// Ajax:function(url,data){	
			// 	var vm = this;
			// 	var data = data;	
			// 	$.ajax({
			// 		type:'post',
			// 		url:url,				
			// 		data:data
			// 	}).then(function(data){
			// 		var rst = JSON.parse(data);
			// 		if(rst.code == 1){
			// 			vm.cells.data = rst.data;
			// 			var datalength = vm.cells.data.length;
			// 			// var newData = [];
			// 			// for (var i=0; i < datalength; i++){
			// 			// 	// 在我已经审批中删除我自己发起的流程（按道理就不该存在，不过后台还是返回了）
			// 			// 	if(vm.cells.data[i].starter != vm.userId){
			// 			// 		newData[i] = vm.cells.data[i];
			// 			// 	}							
			// 			// }
			// 			// vm.cells.data = newData;
			// 			// datalength = vm.cells.data.length;
			// 			if(datalength>0){
			// 				vm.cells.hasData = true;
			// 			}else{
			// 				vm.cells.hasData = false;
			// 			}										
			// 			for (var i=0; i < datalength; i++){
			// 				//防XSS
			// 				for(var key in vm.cells.data[i]){
			// 					vm.cells.data[i][key] = encodeHtml(vm.cells.data[i][key]);
			// 				}
			// 				vm.cells.data[i].userIcon = BASE.url+"/upload/avatar/"+vm.cells.data[i].starter+".png";
			// 				if(vm.cells.data[i].wfstate == '3'){
			// 					vm.cells.data[i].listStatus = '审核完成';
			// 				}else if(vm.cells.data[i].wfstate == '2'){
			// 					vm.cells.data[i].listStatus = '正在审核';
			// 				}else if(vm.cells.data[i].wfstate == '5'){
			// 					vm.cells.data[i].listStatus = '已退回';
			// 				}
			// 			}  
			// 		}else{
			// 			tools.toast(rst.msg, 'error');
			// 		}
			// 	},function(){
			// 		tools.toast("网络错误", 'error');
			// 	})
			// },

			// 定义构建表单函数
			creatFormFuncDef:function(){
				var vm = this;				
				jQuery.each(['text', 'mobile', 'email', 'phone', 'number', 'money','dep'], function(i, type){
				    vm.workflowFunc[type] = function(data){
				        var widget = {
				            data: data,
				            type: type
				        }        
				        var tpl = '<div class="form-group"> \
				                        <label class="col-sm-4 control-label">{title}</label> \
				                        <div class="col-sm-4"> \
				                            <input type="text" id="{id}" class="form-control" placeholder="{tooltip}"> \
				                        </div> \
				                        <div class="col-sm-4 control-label control-msg"> \
				                            {required} \
				                        </div> \
				                    </div>'
				        tpl = tpl.replace(/\{id\}/ig, data.id)
				                        .replace(/\{title\}/ig, data.title)
				                        .replace(/\{tooltip\}/ig, data.tooltip)
				                        .replace(/\{required\}/ig, data.required ? '<em>*</em>' : '')

				        var validations = [];

				        if(data.required){
				            validations.push('required')
				        }
				        if(data.length){
				            validations.push('maxlength:' + data.length);
				        }
				        if(type === 'mobile' || type === 'email' || type === 'number' || type === 'money'){
				            validations.push(type)
				        }
				        if(data.max){
				            validations.push('max:' + data.max);
				        }
				        if(data.min){
				            validations.push('min:' + data.min);
				        }
				        widget.display = $(tpl).attr('data-validate', validations.join('|'));
				        // 部门控件默认填充用户所属部门，且不可编辑
				        if(type === 'dep'){
				            var obj1001 = {
				                url:'/home/user/1001.spring',
				                args:{
				                    userId:localStorage.userId
				                },
				                success:function(rst){
				                    widget.display.find('#' + data.id).val(rst.data.departmentName);
				                },
				            }
				            Ajax(obj1001);
				            // $(tpl).attr('disable', 'disable');
				            widget.display.find('#' + data.id).attr('readOnly',true);
				        }
				        widget.val = function(){
				            return widget.display.find('#' + data.id).val();
				        }

				        return widget;
				    }
				})
				jQuery.each(['radio', 'checkbox'], function(i, type){
				    vm.workflowFunc[type] = function(data){
				        var widget = {
				            data: data,
				            type: type
				        }    
				        var tpl = '<div class="form-group"> \
				                        <label class="col-sm-4 control-label">{title}</label> \
				                        <div class="col-sm-4"> \
				                            <select id="{id}" class="form-control" style="color: #999;"> \
				                                <option value="" selected>{tooltip}</option> \
				                            </select> \
				                        </div> \
				                        <div class="col-sm-4 control-label control-msg"> \
				                            {required} \
				                        </div> \
				                    </div>'
				        tpl = tpl.replace(/\{id\}/ig, data.id)
				                        .replace(/\{title\}/ig, data.title)
				                        .replace(/\{tooltip\}/ig, data.tooltip)
				                        .replace(/\{required\}/ig, data.required ? '<em>*</em>' : '')

				        var validations = [];
				        if(data.required){
				            validations.push('required')
				        }

				        widget.display = $(tpl).attr('data-validate', validations.join('|'));
				        widget.display.on('change', 'select', function(){
				            var val = $(this).val();
				            if(val){
				                $(this).css('color', '#555');
				            }else{
				                $(this).css('color', '#999')
				            }
				        })

				        var options = [];
				        $(data.option_list).each(function(i, option){
				            options.push('<option value="'+ option.name +'">'+ option.name +'</option>')
				        })
				        widget.display.find('select').append(options.join(''));

				        if(type === 'checkbox'){
				            widget.display.find('select').prop('multiple', true);
				        }

				        widget.val = function(){
				            return widget.display.find('#' + data.id).val();
				        }
				        return widget;
				    }
				})
				vm.workflowFunc['textarea'] = function(data){
				    var widget = {
				        data: data,
				        type: 'textarea'
				    }        
				    var tpl = '<div class="form-group"> \
				                    <label class="col-sm-4 control-label">{title}</label> \
				                    <div class="col-sm-4"> \
				                        <textarea type="text" id="{id}" rows="5" class="form-control" placeholder="{tooltip}"></textarea> \
				                    </div> \
				                    <div class="col-sm-4 control-label control-msg"> \
				                        {required} \
				                    </div> \
				                </div>'
				    tpl = tpl.replace(/\{id\}/ig, data.id)
				                    .replace(/\{title\}/ig, data.title)
				                    .replace(/\{tooltip\}/ig, data.tooltip)
				                    .replace(/\{required\}/ig, data.required ? '<em>*</em>' : '')

				    var validations = [];
				    if(data.required){
				        validations.push('required')
				    }
				    if(data.length){
				        validations.push('maxlength:' + data.length);
				    }

				    widget.display = $(tpl).attr('data-validate', validations.join('|'));

				    widget.val = function(){
				        return widget.display.find('#' + data.id).val();
				    }

				    return widget;
				}
				vm.workflowFunc['date'] = function(data){
				    var widget = {
				        data: data,
				        type: 'date'
				    }        
				    var tpl = '<div class="form-group"> \
				                    <label class="col-sm-4 control-label">{title}</label> \
				                    <div class="col-sm-4"> \
				                        <div class="input-group"> \
				                            <input type="text" id="{id}" class="form-control" placeholder="{tooltip}"> \
				                            <span class="input-group-btn"> \
				                                <button class="btn btn-default" type="button"> \
				                                    <i class="fa fa-calendar"></i> \
				                                </button> \
				                            </span> \
				                        </div> \
				                    </div> \
				                    <div class="col-sm-4 control-label control-msg"> \
				                        {required} \
				                    </div> \
				                </div>'
				    tpl = tpl.replace(/\{id\}/ig, data.id)
				                    .replace(/\{title\}/ig, data.title)
				                    .replace(/\{tooltip\}/ig, data.tooltip)
				                    .replace(/\{required\}/ig, data.required ? '<em>*</em>' : '')

				    var validations = [];
				    if(data.required){
				        validations.push('required')
				    }
				    widget.display = $(tpl).attr('data-validate', validations.join('|'));

				    widget.display.on('focus', 'input', function(){	
				       var dateFmt = 'yyyy-MM-dd';				      
				       WdatePicker({dateFmt: dateFmt, minDate: data.min, maxDate: data.max});
				    }).on('click', '.input-group-btn', function(){
				        widget.display.find('input').focus();
				    })

				    widget.val = function(){
				        return widget.display.find('#' + data.id).val();
				    }

				    return widget;
				}

				vm.workflowFunc['daterange'] = function(data){
				    var widget = {
				        data: data,
				        type: 'daterange'
				    }        
				    var tpl = '<div class="form-group min-date"> \
				                    <label class="col-sm-4 control-label">{title}</label> \
				                    <div class="col-sm-4"> \
				                        <div class="input-group"> \
				                            <input type="text" class="form-control" placeholder="{tooltip}"> \
				                            <span class="input-group-btn"> \
				                                <button class="btn btn-default" type="button"> \
				                                    <i class="glyphicon glyphicon-calendar"></i> \
				                                </button> \
				                            </span> \
				                        </div> \
				                    </div> \
				                    <div class="col-sm-4 control-label control-msg"> \
				                        {required} \
				                    </div> \
				                </div> \
				                <div class="form-group max-date"> \
				                    <label class="col-sm-4 control-label">{sub_title}</label> \
				                    <div class="col-sm-4"> \
				                        <div class="input-group"> \
				                            <input type="text" class="form-control" placeholder="{tooltip}"> \
				                            <span class="input-group-btn"> \
				                                <button class="btn btn-default" type="button"> \
				                                    <i class="glyphicon glyphicon-calendar"></i> \
				                                </button> \
				                            </span> \
				                        </div> \
				                    </div> \
				                    <div class="col-sm-4 control-label control-msg"> \
				                        {required} \
				                    </div> \
				                </div>'
				    tpl = tpl.replace(/\{id\}/ig, data.id)
				                    .replace(/\{title\}/ig, data.title)
				                    .replace(/\{sub_title\}/ig, data.sub_title)
				                    .replace(/\{tooltip\}/ig, data.tooltip)
				                    .replace(/\{required\}/ig, data.required ? '<em>*</em>' : '')

				    var validations = [];
				    if(data.required){
				        validations.push('required')
				    }
				    widget.display = $('<div>')
				    widget.display.append( $(tpl).attr('data-validate', validations.join('|')) );
				    //日期控件
				    var minDateField = widget.display.find('.min-date'),
				        maxDateField = widget.display.find('.max-date');

				    var now = new Date();
				    var timestamp = now.getTime();
				    minDateField.find('input').attr('id', 'min' + timestamp);
				    maxDateField.find('input').attr('id', 'max' + timestamp);

				    minDateField.on('focus', 'input', function(){
				        var dateFmt = 'yyyy-MM-dd';
				        WdatePicker({dateFmt: dateFmt, minDate: data.min, maxDate:'#F{$dp.$D(\'max'+ timestamp +'\', {d: -1})}'});
				    }).on('click', '.input-group-btn', function(){
				        minDateField.find('input').focus();
				    })

				    maxDateField.on('focus', 'input', function(){
				        var dateFmt = 'yyyy-MM-dd';
				        WdatePicker({dateFmt: dateFmt, maxDate: data.max, minDate:'#F{$dp.$D(\'min'+ timestamp +'\', {d: 1})}'});
				    }).on('click', '.input-group-btn', function(){
				        maxDateField.find('input').focus();
				    })
				    widget.display.find('input:eq(0)').val(data.min);
				    widget.display.find('input:eq(1)').val(data.max);
				    widget.val = function(){
				        return {
				            start: widget.display.find('input:eq(0)').val(),
				            end: widget.display.find('input:eq(1)').val(),
				        }
				    }

				    return widget;
				}

				vm.workflowFunc['description'] = function(data){
				    var widget = {
				        data: data,
				        type: 'description'
				    }        
				    var tpl = '<div class="form-group"> \
				                    <div class="col-sm-4 col-sm-offset-4"> \
				                        {title} \
				                    </div> \
				                </div>'
				    tpl = tpl.replace(/\{title\}/ig, data.note)
				    widget.display = $(tpl);
				    widget.val = function(){
				        return null
				    }

				    return widget;
				}

				vm.workflowFunc['file'] = function(data){
				    var widget = {
				        data: data,
				        type: 'file'
				    }
				    var tpl = '<div class="form-group file-upload"> \
				                    <label class="col-sm-4 control-label">{title}</label> \
				                    <div class="col-sm-4"> \
				                        <div class="input-group"> \
				                            <input type="file" class="ipt-file"> \
				                            <input type="text" id="{id}" class="form-control" placeholder="{tooltip}"> \
				                            <span class="input-group-btn"> \
				                                <button class="btn btn-default" type="button"> \
				                                    <i class="fa fa-paperclip"></i> \
				                                </button> \
				                            </span> \
				                        </div> \
				                    </div> \
				                    <div class="col-sm-4 control-label control-msg"> \
				                        {required} \
				                    </div> \
				                    <div class="col-sm-4 col-sm-offset-4 file-list"> \
				                    </div> \
				                </div>'
				    tpl = tpl.replace(/\{id\}/ig, data.id)
				                    .replace(/\{title\}/ig, data.title)
				                    .replace(/\{tooltip\}/ig, data.tooltip)
				                    .replace(/\{required\}/ig, data.required ? '<em>*</em>' : '')

				    var validations = [];
				    if(data.required){
				        validations.push('required')
				    }
				    widget.display = $(tpl).attr('data-validate', validations.join('|'));

				    var fileListValue = [];
				    var filePath = [];

				    var iptFile = widget.display.find('.ipt-file');
				    var fileList = widget.display.find('.file-list');

				    iptFile.on('change', function(e){
				        var file = this.files[0];
				        //init
				        var item = '<p><span class="file-name">'+ file.name +'</span><a class="close" href="javascript:;" style="display: none;"><span>&times;</span></a><span class="percent"></span></p>'
				        item = $(item);
				        var percent = item.find('.percent')
				        fileList.prepend(item)

				        //upload
				        var fd = new FormData();
				        // fd.append('name', file.name);
				        fd.append('uploadFile', file);
				        fd.append('userId', localStorage.userId);
				        
				        App.Net.ajax({
				            url: BASE.url+"/home/files/2201.spring",
				            method: 'post',
				            dataType: 'json',
				            contentType: false,
				            processData: false,
				            data: fd,				            
				            success: function(r){
				                if(r.data.filesList[0].fileName){
				                    //uploaded
				                    fileListValue.push(r.data.filesList[0].fileName);
				                    item.find('a').data('fileid', r.data.filesList[0].fileId).show();
				                    percent.remove();
				                    // filePath = r.data.filesList[0].realPath;
				                    filePath.push(r.data.filesList[0].realPath);
				                }
				            }
				        })
				    });

				    fileList.on('click', 'a', function(e){
				        var target = $(this);
				        var id = target.data('id');
				        deleteFile(id);
				        target.parent().remove();
				    })

				    function deleteFile(id){
				        for(var i = 0, len = fileListValue.length; i < len; i++){
				            if(id === fileListValue.grid_id){
				                fileListValue.splice(i, 1);
				                break;
				            }
				        }
				    }

				    widget.val = function(){
				        // return widget.display.find('#' + data.item_id).val();
				        return JSON.stringify(filePath);
				    }

				    return widget;
				}
			}
			
		},
		ready(){
			var vm = this;
			vm.creatFormFuncDef();
		}
	}

</script>
<style scoped>
	.workFlow-content{
		width:100%;
		height: 100%;
		background-color: #F4F4F4;
		border-radius: 5px;
	}
	.header{
		height: 70px;
		line-height: 70px;
		font-size: 16px;
		border-bottom: 1px solid #dddcdd;
		background-color: #F7F8FD;
	}
	.flow-head{
		height: 70px;
	    float: left;
	    line-height: 70px;
	    padding: 0 20px;
	}
	.flow-head span{
		font: normal 12px Arial,verdana,Hiragino Sans GB,"宋体",Microsoft Yaheim;
		font-weight: bold;
		font-size: 14px;
		color: #666;
	}
	.apply-flow{
		height: 32px;
	    float: right;
	    line-height: 32px;
	    padding: 0 10px;
	    background-color: #ff8c00;
	    color: white;
	    margin-right: 20px;
	    margin-top: 18px;
	    cursor: pointer;
	}
	ul{
		list-style: none;
	}
	.header ul li{	
		float: left;
		width: 20%;	
		height: 50px;
		line-height: 50px;
		text-align: center;
		position: relative;
	}
	.header ul li.selected{
		color: #008cee;
		border-bottom: solid 2px #00a0e9;
	}
	.hide{
		display: none;
	}
	
	.workFlow-body{
		/*padding-top: 10px;
		overflow: auto;
		padding-bottom: 200px;
		height: calc(100% - 121px);*/
		padding-top: 10px;
		height: calc(100% - 70px);
		overflow: auto;
	}
	.flow-wrap{
		width: 450px;
	    height: 400px;
	    margin: 60px auto;
	    position: absolute;
	    top: 0;
	    left: 0;
	    bottom: 0;
	    right: 0;
	    border-radius: 6px;
	    /* border: 1px solid #DFDDDD; */
	    background-color: white;
	    box-shadow: 1px 1px 5px #4e4e4e;
	    z-index: 10;
	}
	.alert-header{
		height: 40px;
	    line-height: 40px;
	    padding: 0 10px;
	    border-bottom: 1px solid #f4f4f4;
	    font-size: 14px;
	    font-family: monospace;
	    font-weight: bold;
	    color: #636363;
	}
	.close-wrap{
		float: right;
    	line-height: 40px;
    	color: #ddd8dd;
	}
	#workflowDefList{
		height: 360px;
		overflow: auto;
	}
	.start-li{				
		width: 122px;
	    height: 100px;
	    border: 1px solid #c6e0ec;
	    /*display: inline-block;*/
	    float: left;
	    margin: 10px;
	    text-align: center;
	    padding: 5px 0;
	    overflow: hidden;
	    border-radius: 5px;
	    
	}
	.start-li:hover{
		background-color: #c6e0ec;
	}
	.workFlow-content .header{
		text-align: center;
	}
	.workFlow-content .header .goback{
	    height: 70px;
	    float: left;
	    line-height: 70px;
	    cursor: pointer;
	    padding: 0 10px;
	    position: relative;
	}
	.workFlow-content .header .goback-btn{
		margin-right: 10px;
	}	
	/*.workFlow-content .header .goback-btn:after{
		content: "";
		clear: both;
		display:block;
		width: 0;
		height: 0;
		visibility:hidden;
	}*/
	/*.work-category{
		margin: auto 10px;
		padding: 10px;
		border-bottom: 1px solid #dddcdd;
	}*/
	/*清除浮动*/
	/*.work-category:after {
		content: "";
		clear: both;
		display:block;
		width: 0;
		height: 0;
		visibility:hidden;
	}	
	.select-type{
		float: left;
		font-size: 15px;
		height: 30px;
		line-height: 30px;
		margin-right:20px;
	}
	.select-type select{
		margin-left: 5px;
	    margin-right: 15px;
	    font-size: 15px;
	    height: 30px;
	    line-height: 30px;
	    padding-left: 8px;
	    padding-right: 8px;
	    border: 1px solid #e1e1e1;
	    border-radius: 4px;
	    background: #FFF;
	}*/
	
	
	.task-body{
		padding-top: 10px;
		height: 90%;
		overflow: auto;
	}
	/*.task-form{
		width: 100%;
		padding-left: 30px;
	}
	.task-input{
		margin:10px auto;
	}
	.task-input-label{
		float: left;
		margin-right: 15px;
		font-size: 14px;
		text-align: right;
		width: 80px;
		margin-top: 10px;
	}
	
	.input-line{
		padding-left: 10px;
		height: 40px;
		width: 77%;
		border: 1px solid #ddd8dd;
		border-radius: 3px;
		font-size: 14px;
	}
	.input-area{
		width: 77%;
		max-width: 77%;
		height: 150px;
		border: 1px solid #ddd8dd;
		padding: 10px;
		border-radius: 3px;
		font-size: 14px;
	}*/
	.task-sub {
		text-align: center;
		height: 50px;
	}
	.task-btn {
		margin: 20px auto;
		width: 50%;
		height: 40px;
		border-radius: 5px;
		border:none;
		background-color: #FF8C00;
		color: white;
		font-size: 16px;
	}
	.task-btn:hover{
		background-color: #FF9615;
	}	
	.clear-float{
		content: "";
		clear: both;
		width: 0;
		height: 0;
		display: block;
		visibility: hidden;
	}
	#workflow_name{
		margin: 0 auto;
	}

</style>