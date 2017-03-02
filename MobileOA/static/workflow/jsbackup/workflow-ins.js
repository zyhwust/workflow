/**
 * @fileOverview 流程发起、流转等 
 */
var App = App || {};
App.Workflow = App.Workflow || {};
App.Net.encrypt = false;
var form_ins_id = "";

jQuery(function(){
    function resize(){
        $('#workflowMain').height($(window).height()- 42)
            .css('overflow', 'auto');
    }
    if(document.getElementById('workflowMain')){
        $(window).on('resize', resize);
        $(window).trigger('resize');
    }
})

App.Workflow.WorkflowInsManage = function(options){
    this.$insList = options.el || $('#insList');
    //1:MySubmit, 2:MyApproving, 3:MyApproved, 4:MyFinish
    this.type = options.type * 1;
    this.$pager = $('#pager');
    this.init();
}

App.Workflow.WorkflowInsManage.prototype = {
    init: function(){
        this.bind();
        this.getInsList();
    },
    bind: function(){        
        this.$pager.on('click', '#prePage', $.proxy(this.prePage, this))
                   .on('click', '#nextPage', $.proxy(this.nextPage, this));
    },
    // 获取流程列表（发起，待审批，已审批，办毕）
    getInsList: function(){
        tools.busy();
        var _this = this;
        var urls = ['admin/workflow/2636.spring', 
                    'admin/workflow/2637.spring', 
                    'admin/workflow/2638.spring'];         
        var data = {};
        if(this.type == 1){
            data={
                creator_id : localStorage.userId,
                status : "",
                domain_id : App.Config.companyId,                
            }
        }else if(this.type == 2){
            data={
                approver_id : localStorage.userId,
                status : "",
                domain_id : App.Config.companyId,                
            } 
        }else if(this.type == 3){
            data={
                operator_id: localStorage.userId,
                status: "",
                domain_id: App.Config.companyId,                
            } 
        }
         
        var obj = {
            url:urls[this.type - 1],
            args:data,
            success:function(res){
                _this.accountList = res.ret.account_real_name;
                _this.insList = res.ret.workflow_ins_list;            
                _this.buildList();
                tools.busy(false);
            },
            error:function(rst){
                tools.busy(false);
                App.fail(rst.ret,1000);
            },
        };
        Ajax(obj);
        // $.get(urls[this.type - 1], {
        //     account_id: App.Config.accountId
        // }, function(r){
        //     _this.accountList = r.ret.account_real_name;
        //     _this.insList = r.ret.workflow_ins;
        //     _this.buildList();
        // }, 'json')
        // _this.accountList = testData.ret.account_real_name;
        // _this.insList = testData.ret.workflow_ins;            
        // _this.buildList();  
    },
    buildList: function(){
        var _this = this;  
        var insList = this.insList;
        // var insList = test.ret.workflow_ins_list;         
        var list = []
        var tpl = '<tr data-id="{id}" id="ins{id}"> \
                        <td>{insId}<a href="'+PAGE.detail+'?id={id}">{title}</a></td>\
                        <td>{type}</td>\
                        <td>{time}</td>\
                        <td>{approving}</td>\
                        <td class="status{status}">{state}</td>\
                    </tr>';

        $(insList).each(function(i, ins){
            // 格式化日期
            var time = ins.create_time.replace(/T/," ").split(".")[0]
            var users = []
            // $(ins.todo_list).each(function(i, todo){
            //     users.push(_this.accountList[todo.account_id]);
            // })
            var states = ['创建', '草稿', '审批中', '完成', '终止']
            var item = tpl.replace(/\{id\}/ig, ins.id)
                        .replace('{insId}', ins.form_ins_id+' ')
                        .replace('{title}', ins.workflow_ins_name || 'test')
                        .replace('{type}', ins.workflow_def_name)
                        .replace('{approving}', ins.creator_name)
                        .replace('{state}', states[ins.status])
                        .replace('{status}', ins.status)
                        .replace('{time}', time);
            list.push(item);
        })  
        this.$insList.find('tbody').html('');      
        this.$insList.find('tbody').append(list.join(''));
    },
    // 上一页
    prePage:function(){
        this.getInsList();
    },
    // 下一页
    nextPage:function(){
        this.getInsList();
    }
}

//流程发起
App.Workflow.WorkflowCreate = function(options){
    this.workflowId = options.id;
    this.$workflowType = $('#workflowType');    
    this.workflow = {},
    this.init();
}
App.Workflow.WorkflowCreate.prototype = {
    init: function(){
        this.bind();
        this.getWorkflowDefInfo();
        // this.createWorkflowIns();
    },
    bind: function(){
       
    },
    getWorkflowDefInfo: function(){
        var _this = this;
        tools.busy();
        var objGetWorkflowDefInfo = {
            url:API.getWorkflowDefInfo,
            args: {
                workflow_def_id:this.workflowId
            },
            success: function(res) {
                _this.$workflowType.text(res.ret.workflow_def.name);
                _this.workflow = res.ret.workflow_def;
                //生成表单
                _this.formIns = new App.Workflow.FormIns({
                    formId: _this.workflow.form_def_id,
                    // formInsId: this.workflowIns.form_ins_id,
                    callback: function(){
                        _this.submit();
                    }
                });
                tools.busy(false);
            },
            error:function(rst){
                tools.busy(false);
                App.fail(rst.ret,1000);
            },
            asy: false
        }
        Ajax(objGetWorkflowDefInfo);                
    },
    createWorkflowIns: function(){ //创建流程实例
        var _this = this;
        var objCreateWorkflowIns = {
            type:'post',
            url:API.createWorkflowIns,
            args: {   
                workflow_ins: JSON.stringify({
                    workflow_def_id: _this.workflowId,
                    workflow_def_name: _this.workflow.name,
                    form_def_id: _this.workflow.form_def_id,                    
                    form_ins_id: form_ins_id.toString(),
                    workflow_ins_name: _this.workflow.name,
                    creator_id: App.Config.accountId,
                    creator_name: App.Config.accountName,
                    domain_id: App.Config.companyId,
                }),  
            },
            success: function(res) {
                _this.workflowIns = res.ret.workflow_ins;
                _this.getCurrentInfo();
            },
            error:function(rst){
                tools.busy(false);
                App.fail(rst.ret,1000);
            },
        };
        Ajax(objCreateWorkflowIns);
    },
    getCurrentInfo: function(){
        var _this = this;       
        var objGetCurrentInfo = {
            url:API.getCurrentInfo,
            args: {
                workflow_ins_id:this.workflowIns.id,
                account_id:App.Config.accountId              
            },
            success: function(res) {
                _this.curInsInfo = res.ret;
                _this.submitWorkflowIns();
            },
            error:function(rst){
                tools.busy(false);
                App.fail(rst.ret,1000);
            }
        }
        Ajax(objGetCurrentInfo);
    },
    submitWorkflowIns: function(){
        var _this = this;
        // 设置next_node_list参数，获取cur_node中的id，找到next_node中的id
        var nextNodeList = [];
        var next_seq = _this.curInsInfo.cur_node.next_node.seq_id_list;

        for(var i = 0, len = next_seq.length; i < len; i++ ) {
            var next_seq_id = next_seq[i],
                seq_id = '';
            for(var j = 0, len = _this.curInsInfo.next_node.length; j < len; j++ ) {
                if(_this.curInsInfo.next_node[j].seq_id == next_seq_id) {
                    seq_id = _this.curInsInfo.next_node[j].seq_id;
                    var tempObj = {};
                    tempObj.seq_id = seq_id;
                    nextNodeList.push(tempObj);
                    break;
                }
            }
        }

        // var next_seq_id = _this.curInsInfo.cur_node.next_node.seq_id_list[0];
        // var seq_id = '';

        // for(var i = 0, len = _this.curInsInfo.next_node.length; i < len; i++ ) {
        //     if(_this.curInsInfo.next_node[i].seq_id == next_seq_id) {
        //         seq_id = _this.curInsInfo.next_node[i].seq_id;
        //     }
        // }
        // seq_id = [{"seq_id":"2"},{"seq_id":"3"},{"seq_id":"4"}]
        // 提交流程实例-前进
        var obj2671 = {
        url: API.submitWorkflowIns,  
            args: {               
                workflow_ins_id: _this.workflowIns.id,
                account_id: App.Config.accountId,
                account_name: App.Config.accountName,
                cur_seq_id: _this.curInsInfo.cur_node.seq_id,
                comment:'', 
                next_node_list: nextNodeList
            },
            success: function(res) {
                App.success('提交成功');
                location.href = 'workflow.html';
            },
            error:function(rst){
                tools.busy(false);
                App.fail(rst.ret,1000);
            }
        }
        Ajax(obj2671);
    },
    // createFormIns: function(){ //表单实例
    //     var _this = this;
    //     this.formIns = new App.Workflow.FormIns({
    //         formId: this.workflow.form_def_id,
    //         formInsId: this.workflowIns.form_ins_id,
    //         callback: function(name, type){
    //             var workflow_def_name = _this.curInsInfo.workflow_ins.workflow_def_name;
    //             var now = new Date();
    //             var title = workflow_def_name + 
    //                         '-' + 
    //                         App.Config.accountName + 
    //                         '-' + 
    //                         now.getFullYear() +
    //                         '-' +
    //                         (now.getMonth() + 1) +
    //                         '-' +
    //                         now.getDate()
    //             console.log(name+','+type+','+title);                
    //             _this.submit();
    //             // $.post('/workflow/ins/update/', {
    //             //     id: _this.workflowIns.id,
    //             //     attr_data: JSON.stringify({
    //             //         name: title
    //             //     })
    //             // }, function(r){
    //             //     if(r.code === 200){
    //             //         if(!type){
    //             //             _this.submit();
    //             //         }else{
    //             //             _this.saveDraft();
    //             //         }
    //             //     }
    //             // }, 'json')
    //             // 修改流程实例
                
    //         }
    //     })
    // },
    saveDraft: function(){ //TODO保存草稿

    },
    submit: function(){ //提交流程
        //TODO
        //如果下个节点只有一个，并且下个节点不需要选择审批人，则直接提交
        //否则
        //如果下个节点有多个，那么需要弹出选择下个审批节点（单选还是全选）
        //并且
        //如果下个节点（不论单选还是多选）需要选择审批人，那么需要弹出审批人选择
        var _this = this;
        _this.createWorkflowIns();
        // $.post('/workflow/ins/submit/', {
        //     workflow_ins_id: this.curInsInfo.workflow_ins.id,
        //     account_id: App.Config.accountId,
        //     cur_seq_id: this.curInsInfo.cur_node.seq_id,
        //     next_node_list: JSON.stringify([{
        //         seq_id: this.curInsInfo.next_node[ this.curInsInfo.cur_node.next_node.seq_id_list[0] ].seq_id,
        //         account_id_list: []
        //     }])
        // }, function(r){
        //     if(r.code === 200){
        //         App.success('提交成功');
        //         location.href = WEB_URL + 'workflow/';
        //     }else{
        //         App.fail('提交失败')
        //     }
        // }, 'json')
        
        // 提交流程实例-前进
        // var _this = this;
        // var next_seq_id = _this.curInsInfo.cur_node.next_node.seq_id_list[0];
        // var seq_id = '';

        // for(var i = 0, len = _this.curInsInfo.next_node.length; i < len; i++ ) {
        //     if(_this.curInsInfo.next_node[i].seq_id == next_seq_id) {
        //         seq_id = _this.curInsInfo.next_node[i].seq_id;
        //     }
        // }
        // var obj2671 = {
        //     url:'admin/workflow/2671.spring',
        //     args: {
        //         workflow_ins_id: _this.workflowIns.id,
        //         account_id: App.Config.accountId,
        //         account_name: App.Config.accountName,
        //         cur_seq_id: _this.curInsInfo.cur_node.seq_id,
        //         comment:'', 
        //         next_node_list: JSON.stringify([{
        //             // seq_id: _this.curInsInfo.next_node[ _this.curInsInfo.cur_node.next_node.seq_id_list[0] ].seq_id,
        //             seq_id: seq_id,                    
        //             account_id_list: []
        //         }])  
        //     },
        //     success: function(res) {
        //         App.success('提交成功');
        //         location.href = 'workflow.html';
        //     },
        //     asy:false
        // }
        // Ajax(obj2671);
    },   
}

//表单实例
App.Workflow.FormIns = function(options){
    this.formId = options.formId;
    this.formInsId = options.formInsId;
    this.callback = options.callback || function(){};
    this.$formContainer = options.container || $('#workflowForm');
    this.$btnSubmit = $('#btnSubmit');
    this.init();
}
App.Workflow.FormIns.prototype = {
    init: function(){
        this.widgets = [];

        this.bind();
        this.getFormInfo();
    },
    bind: function(){
        var _this = this;
        this.$formContainer.on('submit', $.proxy(this.submit, this));
        this.$btnSubmit.on('click', function(){
            _this.$formContainer.trigger('submit');
        })
    },
    getFormInfo: function(){ //获取表单定义的内容
        var _this = this;        
        var objCreateFormIns = {
            url:API.getFormInfo,
            args:{
                formId:this.formId,               
            },
            success: function(res) {
                _this.formDef = res.data;
                _this.buildForm();
            },
            error:function(rst){
                tools.busy(false);
                App.fail(rst.ret,1000);
            }
        }
        Ajax(objCreateFormIns);           
    },
    buildForm: function(){ //根据表单定义构建表单
        var _this = this;
        $(this.formDef).each(function(i, item){
            var type = App.Workflow.FormIns.type[item.type]
            var widget = App.Workflow.FormIns[type](item);
            _this.widgets.push(widget);
            _this.$formContainer.append(widget.display);
        })

        this.$formContainer.validate();
    },
    submit: function(){ //提交表单，更新表单实例
        var _this = this;
        tools.busy();
        _this.$btnSubmit.attr('disabled', 'disabled');
        if(!this.$formContainer.validate('validateAll')) {
            tools.busy(false);
            // _this.$btnSubmit.removeAttr('disabled');
            $("#btnSubmit").removeAttr('disabled');
            return false;
        }
        //构建数据
        var itemValues = []        
        $(this.widgets).each(function(i, widget){
            var value = widget.val();
            itemValues.push({
                item_id: widget.data.id,//item_id
                item_value: typeof value === 'object' ? JSON.stringify(value) : value
            })
        });
        var name = this.widgets[0].val();
        var obj2504 = {
            url:API.submitWorkflow,
            args:{
                formId:this.formId,                
                map:itemValues,                
            },
            success: function(res) {
                // 将表单实例id存入全局变量
                form_ins_id = res.data;
                _this.callback();
                // _this.$btnSubmit.removeAttr('disabled');
                //更新成功之后回调流程创建        
                // _this.callback(itemValues[0].item_value);                
            },
            error:function(rst){
                tools.busy(false);
                $("#btnSubmit").removeAttr('disabled');
                // _this.$btnSubmit.removeAttr('disabled');
                App.fail(rst.ret,1000);
            }
        }
        Ajax(obj2504);        
        
        return false;
    }
}

App.Workflow.FormIns.type = {}
for(key in App.Workflow.Form.type){
    App.Workflow.FormIns.type[App.Workflow.Form.type[key]] = key;
}
App.Workflow.FormIns.type[23] = 'dep';
jQuery.each(['text', 'mobile', 'email', 'phone', 'number', 'money','dep'], function(i, type){
    App.Workflow.FormIns[type] = function(data){
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

App.Workflow.FormIns['textarea'] = function(data){
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
    tpl = tpl.replace(/\{id\}/ig, data.item_id)
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
        return widget.display.find('#' + data.item_id).val();
    }

    return widget;
}

jQuery.each(['radio', 'checkbox'], function(i, type){
    App.Workflow.FormIns[type] = function(data){
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
        tpl = tpl.replace(/\{id\}/ig, data.item_id)
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
            return widget.display.find('#' + data.item_id).val();
        }
        return widget;
    }
})

App.Workflow.FormIns['date'] = function(data){
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
                                    <i class="glyphicon glyphicon-calendar"></i> \
                                </button> \
                            </span> \
                        </div> \
                    </div> \
                    <div class="col-sm-4 control-label control-msg"> \
                        {required} \
                    </div> \
                </div>'
    tpl = tpl.replace(/\{id\}/ig, data.item_id)
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
        return widget.display.find('#' + data.item_id).val();
    }

    return widget;
}

App.Workflow.FormIns['daterange'] = function(data){
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
    tpl = tpl.replace(/\{id\}/ig, data.item_id)
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

App.Workflow.FormIns['description'] = function(data){
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

App.Workflow.FormIns['file'] = function(data){
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
                                    <i class="glyphicon glyphicon-folder-close"></i> \
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
    tpl = tpl.replace(/\{id\}/ig, data.item_id)
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
            url: BASE.url+"home/files/2201.spring",
            method: 'post',
            dataType: 'json',
            contentType: false,
            processData: false,
            data: fd,
            // xhr: function(){
            //     var myXhr = $.ajaxSettings.xhr();
            //     if(myXhr.upload){
            //         //uploading
            //         myXhr.upload.addEventListener('progress', (e) => {
            //             percent.css({
            //                 width: e.loaded / file.size * 100 + '%'
            //             })
            //         }, false)
            //     }
            //     return myXhr;
            // },
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
//image,file,person,department,tree,description,table,position


App.Workflow.WorkflowInsDetail = function(options){
    this.id = options.id;
    this.$workflowInsName = $('#workflowInsName');
    this.$workflowInsInfo = $('#workflowInsInfo');
    this.$workflowInsStatus = $('#workflowInsStatus');
    this.$workflowInsActions = $('#workflowInsActions');
    this.init();
}

App.Workflow.WorkflowInsDetail.prototype = {
    init: function(){
        this.bind();
        this.getWorkflowInsInfo();
        // this.getFormInsInfo();
    },
    bind: function(){
        this.$workflowInsActions.on('click', '#btnAgree', $.proxy(this.agree, this))
                                .on('click', '#btnRefuse', $.proxy(this.refuse, this));
    },
    // 获取流程详情
    getWorkflowInsInfo: function(){
        tools.busy();
        var _this = this;
        // $.get('/workflow/ins/retrieve/', {
        //     id: this.id,
        //     account_id: App.Config.accountId
        // }, function(r){
        //     if(r.code === 200){
        //         _this.workflowInsInfo = r.ret;
        //         if(_this.workflowInsInfo.cur_node){
        //             _this.$workflowInsActions.show();
        //             if(!_this.workflowInsInfo.cur_node.rollback_list.length){
        //                 _this.$workflowInsActions.find('#btnRefuse').prop('disabled', true);
        //             }
        //         }

        //         _this.$workflowInsName.text(_this.workflowInsInfo.workflow_ins.name)
        //         _this.getFormInsInfo();
        //         _this.buildStatus();
        //     }
        // }, 'json')
        var obj2632 = {
            url: API.getCurrentInfo,  
            args: {
                workflow_ins_id: _this.id, 
                account_id: App.Config.accountId,                              
            },
            success: function(r) {
                _this.workflowInsInfo = r.ret;
                if(_this.workflowInsInfo.cur_node){
                    // 动态设置同意按钮文本
                    _this.$workflowInsActions.find('#btnAgree').html(_this.workflowInsInfo.cur_node.approve.label);
                    _this.$workflowInsActions.show();
                    // 若发起人是当前用户，则屏蔽驳回按钮
                    if(!_this.workflowInsInfo.cur_node.rollback.length || localStorage.userId == _this.workflowInsInfo.workflow_ins.operation_list[0].account_id){
                        _this.$workflowInsActions.find('#btnRefuse').data('disabled', true);
                        _this.$workflowInsActions.find('#btnRefuse').remove();
                    }
                }

                _this.$workflowInsName.text(_this.workflowInsInfo.workflow_ins.form_ins_id+' '+_this.workflowInsInfo.workflow_ins.workflow_ins_name);
                _this.getFormInsInfo();
                _this.buildStatus();
                tools.busy(false);
            },
            error:function(rst){
                tools.busy(false);
                App.fail(rst.ret,1000);
            }
        }
        Ajax(obj2632);               
    },
    getFormInsInfo: function(){
        var _this = this;
        // $.when($.get('/form/get_inst/', {
        //     form_inst_id: this.workflowInsInfo.workflow_ins.form_ins_id
        // }), $.get('/form/get_def/', {
        //     form_def_id : this.workflowInsInfo.workflow_ins.form_def_id
        // })).then(function(formInsInfo, formDefInfo){
        //     _this.formInsInfo = formInsInfo[0].ret;
        //     _this.formDefInfo = formDefInfo[0].ret;

        //     _this.buildInfo();
        // })
        var obj2503 = {
            url: API.getFormInfo,  // 获取表单定义的内容
            args: {
                formId: this.workflowInsInfo.workflow_ins.form_def_id,                
            },
            success: function(res) {
                _this.formDefInfo = res.data;                
                _this.get_inst();
            }
        }
        Ajax(obj2503);       
    },
    get_inst: function(){
        var _this = this;
        var obj2505 = {
            url: API.getFormInsList,  // 获取表单实例列表
            args: {
                formId: this.workflowInsInfo.workflow_ins.form_def_id,
                form_ins_id: this.workflowInsInfo.workflow_ins.form_ins_id,                
            },
            success: function(res) {
                _this.formInsInfo = res.data[0];                             
                _this.buildInfo();
            }
        }
        Ajax(obj2505);
    },
    buildInfo: function(){
        var formDefInfo = this.formDefInfo;
        var formInsInfo = this.formInsInfo;

        var values = {};
        $(formInsInfo.item_value_list).each(function(i, item){
            values[item.item_id] = item.item_value;
        })

        var html = []
        $(formDefInfo).each(function(i, item){
            //TODO 不同类型显示不同的值
            if(item.type === 11 && values[item.id]){
                var value = values[item.id];
                value = $.parseJSON(value);
                html.push('<dt>'+ item.title +'</dt><dd>'+ value.start +'</dd>');
                html.push('<dt>'+ item.sub_title +'</dt><dd>'+ value.end +'</dd>');
            }else if(item.type === 13){
                var value = values[item.id];
                value = $.parseJSON(value);
                var files = [];
                $(value).each(function(i, item){
                    files.push('<p style="margin:0 0 10px;"><a download href="'+BASE.url+''+item+'">'+item.split('/').pop()+'</a></p>');
                })
                html.push('<dt>'+ item.title +'</dt><dd>'+ files.join('') +'</dd>');
            }else{
                html.push('<dt>'+ item.title +'</dt><dd>'+ values[item.id] +'</dd>');
            }
        });

        this.$workflowInsInfo.html('<dl>' + html.join('') + '</dl>');
    },
    buildStatus: function(){
        var _this = this;
        var list = [];
        var workflowIns = this.workflowInsInfo.workflow_ins;
        var accountIds = [], accountList = {};
        $(workflowIns.operation_list.concat(workflowIns.todo_list)).each(function(i ,item){
            accountIds.push(item.account_id);
        });
        // $(workflowIns.todo_list).each(function(i ,item){
        //     accountIds.push(item.account_id);
        // });
        for(var i=0,len=accountIds.length;i<len;i++){
            var accountId = accountIds[i];
            var obj1001 = {
                url:'/home/user/1001.spring',
                args:{
                    userId:accountIds[i]
                },
                success:function(rst){
                    accountList[accountId] = rst.data.userRealname;                   
                },
                asy:false
            }
            Ajax(obj1001);
        }
        // $.get('/account/org_user/batch_retrieve/', {
        //     id_list: JSON.stringify(accountIds)
        // }, function(r){
        //     $(r.ret).each(function(i ,user){
        //         accountList[user.id] = user.real_name;
        //     })
        //     build();
        // }, 'json')
        // $(buildStatus_json.ret).each(function(i ,user){
        //     accountList[user.id] = user.real_name;
        // })
        build();        

        function build(){
            $(workflowIns.operation_list).each(function(i ,item){
                item.comment = encodeHtml(item.comment);
                var time = item.create_time.replace(/T/," ").split(".")[0];
                list.push('<li> \
                            <div class="name"> \
                                <span><i>'+ accountList[item.account_id] +'</i></span> \
                            </div> \
                            <div class="status"> \
                                <span class="arrow"></span> \
                                <p class="node-name">'+ item.seq_id_name +'</p> \
                                <p class="comment">'+ (item.operation_label || '') +'</p> \
                                <p class="comment">'+ (item.comment || '') +'</p> \
                                <p class="time">'+ time +'</p> \
                            </div> \
                        </li>')
            });

            var todoUsers = [];
            $(workflowIns.todo_list).each(function(i ,item){
                todoUsers.push(accountList[item.account_id]);
                // 在分支节点的情况下，如果当前用户为当前审批节点，显示当前用户姓名
                if(item.account_id == localStorage.userId){
                    todoUsers[0] = accountList[localStorage.userId];
                }
            });            
            if(todoUsers.length){
                list.push('<li class="current"> \
                            <div class="name"> \
                                <span><i>'+ todoUsers[0] +'</i></span> \
                            </div> \
                            <div class="status"> \
                                <span class="arrow"></span> \
                                <p class="comment">审批中</p> \
                                <p class="time"></p> \
                            </div> \
                        </li>')
            }else{
                list.push('<li> \
                            <div class="name"> \
                                <span><i>'+"结束"+'</i></span> \
                            </div> \
                        </li>')
            }

            _this.$workflowInsStatus.html('<ul>' + list.join('') + '</ul>');
        }
    },
    agree: function(){
        if(!this.agreeDialog){
            var dialog = '<div class="modal fade"> \
                            <div class="modal-dialog"> \
                                <div class="modal-content"> \
                                    <div class="modal-header"> \
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> \
                                        <h4 class="modal-title">审批意见</h4> \
                                    </div> \
                                    <div class="modal-body"> \
                                        <form class="form-horizontal"> \
                                            <div class="form-group hide TODO"> \
                                                <label class="col-sm-2 control-label">审批节点</label> \
                                                <div class="col-sm-10"> \
                                                    <div class="radio"> \
                                                      <label> \
                                                        <input type="radio" name="optionsRadios" value="1"> \
                                                        审批节点1 \
                                                      </label> \
                                                    </div> \
                                                    <div class="radio"> \
                                                      <label> \
                                                        <input type="radio" name="optionsRadios" value="1"> \
                                                        审批节点2 \
                                                      </label> \
                                                    </div> \
                                                    <div class="radio"> \
                                                      <label> \
                                                        <input type="radio" name="optionsRadios" value="1"> \
                                                        审批节点3 \
                                                      </label> \
                                                    </div> \
                                                </div> \
                                            </div> \
                                            <div class="form-group"> \
                                                <label class="col-sm-2 control-label">审批意见</label> \
                                                <div class="col-sm-10"> \
                                                    <textarea class="form-control"></textarea> \
                                                </div> \
                                            </div> \
                                        </form> \
                                    </div> \
                                    <div class="modal-footer"> \
                                        <button type="button" class="btn btn-primary">确定</button> \
                                        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button> \
                                    </div> \
                                </div> \
                            </div> \
                        </div>';
            dialog = $(dialog).appendTo($('body'));
            this.agreeDialog = dialog;

            dialog.on('click', '.btn-primary', $.proxy(this.agreeSubmit, this));
        }

        this.agreeDialog.modal();
    },
    agreeSubmit: function(){
        var workflowInsInfo = this.workflowInsInfo;
        tools.busy();
        var _this = this;
        // 设置next_node_list参数，获取cur_node中的id，找到next_node中的id
        var nextNodeList = [];
        var next_seq = _this.workflowInsInfo.cur_node.next_node.seq_id_list;

        for(var i = 0, len = next_seq.length; i < len; i++ ) {
            var next_seq_id = next_seq[i],
                seq_id = '';
            for(var j = 0, len = _this.workflowInsInfo.next_node.length; j < len; j++ ) {
                if(_this.workflowInsInfo.next_node[j].seq_id == next_seq_id) {
                    seq_id = _this.workflowInsInfo.next_node[j].seq_id;
                    var tempObj = {};
                    tempObj.seq_id = seq_id;
                    nextNodeList.push(tempObj);
                    break;
                }
            }
        }
        // var next_seq_id = _this.workflowInsInfo.cur_node.next_node.seq_id_list[0];
        // var seq_id = '';

        // for(var i = 0, len = _this.workflowInsInfo.next_node.length; i < len; i++ ) {
        //     if(_this.workflowInsInfo.next_node[i].seq_id == next_seq_id) {
        //         seq_id = _this.workflowInsInfo.next_node[i].seq_id;
        //     }
        // }
        // 提交流程实例-前进
        var obj2671 = {
            url: API.submitWorkflowIns,  
            args: {                
                workflow_ins_id: _this.id,
                account_id: App.Config.accountId,
                account_name: App.Config.accountName,
                cur_seq_id: _this.workflowInsInfo.cur_node.seq_id,
                comment:_this.agreeDialog.find('textarea').val(),
                next_node_list: nextNodeList
            },
            success: function(res) {
                tools.busy(false);
                App.success('提交成功');
                location.href = 'workflow.html';
            },
            error:function(rst){
                tools.busy(false);
                App.fail(rst.ret,1000);
            }
        }
        Ajax(obj2671);
    },
    refuse: function(){
        var workflowInsInfo = this.workflowInsInfo;
        var rollback_list = workflowInsInfo.cur_node.rollback;
        if(!this.refuseDialog){
            var dialog = '<div class="modal fade"> \
                            <div class="modal-dialog"> \
                                <div class="modal-content"> \
                                    <div class="modal-header"> \
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> \
                                        <h4 class="modal-title">审批意见</h4> \
                                    </div> \
                                    <div class="modal-body"> \
                                        <form class="form-horizontal"> \
                                            <div class="form-group"> \
                                                <label class="col-sm-2 control-label">退回到</label> \
                                                <div class="col-sm-10"> \
                                                    <select class="form-control"></select> \
                                                </div> \
                                            </div> \
                                            <div class="form-group"> \
                                                <label class="col-sm-2 control-label">审批意见</label> \
                                                <div class="col-sm-10"> \
                                                    <textarea class="form-control"></textarea> \
                                                </div> \
                                            </div> \
                                        </form> \
                                    </div> \
                                    <div class="modal-footer"> \
                                        <button type="button" class="btn btn-primary">确定</button> \
                                        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button> \
                                    </div> \
                                </div> \
                            </div> \
                        </div>';
            dialog = $(dialog).appendTo($('body'));
            this.refuseDialog = dialog;

            var select = dialog.find('select');
            var options = [];
            $(rollback_list).each(function(i, item){
                options.push('<option value="'+ item.rollback_category +'">'+ item.label +'</option>')
            });
            select.html(options.join(''));

            dialog.on('click', '.btn-primary', $.proxy(this.refuseSubmit, this))
                .on('change', 'select', function(){
                    if($(this).val() == 3){
                        alert('TODO 退回到指定节点');
                    }
                })
        }

        this.refuseDialog.modal();
    },
    refuseSubmit: function(){
        var _this = this;
        var workflowInsInfo = this.workflowInsInfo;
        tools.busy();
        // 提交流程实例-退回
        var obj2672 = {
            url: API.rollback,  
            args: {               
                workflow_ins_id: _this.id,
                account_id: App.Config.accountId,
                account_name: App.Config.accountName,
                cur_seq_id: _this.workflowInsInfo.cur_node.seq_id,
                comment:_this.refuseDialog.find('textarea').val(),
                rollback_category:_this.refuseDialog.find('select').val().toString(),
                spec_seq_id: ''                
            },
            success: function(res) {
                tools.busy(false);
                App.success('提交成功');
                location.href = 'workflow.html';
            },
            error:function(rst){
                tools.busy(false);
                App.fail(rst.ret,1000);
            }
        }
        Ajax(obj2672);
    }
}

App.Workflow.WorkflowDefList = function(){
    this.$workflowDefList = $('#workflowDefList');
    this.init();
}
App.Workflow.WorkflowDefList.prototype = {
    init: function(){
        this.bind();
        this.getDefList();
    },
    bind: function(){

    },
    // 获取可以发起的流程清单
    getDefList: function(){
        tools.busy();
        var _this = this;        
        var objGetWorkflowDefList = {
            url: API.getDeflist,
            args: {
                domain_id: App.Config.companyId
            },
            success: function(res) {
                _this.workflowDefList = res.ret;
                _this.buildDefList(); 
                tools.busy(false);
            },
            error:function(rst){
                tools.busy(false);
                App.fail(rst.ret,1000);
            }
        }
        Ajax(objGetWorkflowDefList);               
    },
    buildDefList: function(){
        var list = [];
         var icons = ['yitiS.png', 'applyS.png','chufangS.png','wupinS.png','xiupcS.png'];
        $(this.workflowDefList.workflow_def_list).each(function(i, def){
            if(def.status === 1){               
                list.push('<li><a href="'+PAGE.newWorkflow+'?id='+ def.id +'"> \
                <span class="weui-grid__icon" style="background-image:url('+ STATIC_URL+'img/icon/'+ icons[i % 5] +')">'+ def.name +'</span> \
                </a></li>')    
            }
        });

        this.$workflowDefList.html(list.join(''))
    }
}