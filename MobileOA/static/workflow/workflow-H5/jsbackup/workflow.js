/**
 * @fileOverview 流程发起、流转等
 */
var App = App || {};
var form_ins_id = "";
App.Workflow = App.Workflow || {};
// App.Net.encrypt = false;

// 工作流实例
App.Workflow.WorkflowInsManage = function(options){
    this.$insList = options.el || $('#workflowInsList');
    //1:MySubmit, 2:MyApproving, 3:MyApproved, 4:MyFinish
    this.type = options.type * 1;
    this.init();
}

App.Workflow.WorkflowInsManage.prototype = {
    init: function(){
        this.bind();
        this.getInsList();
    },
    bind: function(){
        if(this.type == 1){
           $(".weui-tab").on("swipeleft",function(){
                window.location.href = "../html/undolist.html";
            });
            $(".weui-tab").on("swiperight",function(){
                window.location.href = "../html/waitmelist.html";
            });

            // 链接
            $(".waitmeLink").on("click",function(){
                window.location.href = "../html/waitmelist.html";
            });
            $(".undoLink").on("click",function(){
                window.location.href = "../html/undolist.html";
            });
        }else if(this.type == 2){
            $(".weui-tab").on("swipeleft",function(){
                window.location.href = "../html/myapprovelist.html";
            });
            $(".weui-tab").on("swiperight",function(){
                window.location.href = "../html/undolist.html";
            });

            // 链接
            $(".undoLink").on("click",function(){
                window.location.href = "../html/undolist.html";
            });
            $(".myapproveLink").on("click",function(){
                window.location.href = "../html/myapprovelist.html";
            });
        }else if(this.type == 3){
            $(".weui-tab").on("swipeleft",function(){
                window.location.href = "../html/waitmelist.html";
            });
            $(".weui-tab").on("swiperight",function(){
                window.location.href = "../html/myapprovelist.html";
            });

            // 链接
            $(".waitmeLink").on("click",function(){
                window.location.href = "../html/waitmelist.html";
            });
            $(".myapproveLink").on("click",function(){
                window.location.href = "../html/myapprovelist.html";
            });
        }
    },
    // 获取流程列表（发起，待审批，已审批，办毕）
    getInsList: function(){
        var _this = this;
        tools.busy(true);
        var urls = [
                    'admin/workflow/2636.spring', //我申请的的各种状态实例
                    'admin/workflow/2637.spring', //待我审批的的各种状态实例
                    'admin/workflow/2638.spring' //我已申请的的各种状态实例
                    ];
        var data = {};
        var url = "";
        if(this.type == 1){
            url = urls[0];
            data = {
                creator_id : App.Config.accountId,
                status : "",
                domain_id : App.Config.companyId
            }
        }else if(this.type == 2){
            url = urls[1];
            data = {
                approver_id : App.Config.accountId,
                status : "",
                domain_id : App.Config.companyId
            }
        }else if(this.type == 3){
            url = urls[2];
            data = {
                operator_id : App.Config.accountId,
                status : "",
                domain_id : App.Config.companyId
            }
        }
        var obj = {
            url: url,
            args: data,
            success: function(res) {
                _this.insList = res.ret.workflow_ins_list;  
                _this.buildList(); 
                tools.busy(false);
            },
            error:function(rst){
                tools.busy(false);
                tools.toast(rst.ret);
            }
        }
        Ajax(obj);
    },
    buildList: function(){
        var _this = this;
        var insList = this.insList;
        var list = [];
        var status = ['创建', '草稿', '审批中', '完成', '流程终止'];
        $(insList).each(function(i, ins){
            var time = ins.update_time.substr(0,19).replace(/T/," ");
            list.push(
                '<a href="./detail.html?id='+ ins.id +'" data-ajax="false" class="weui-media-box weui-media-box_appmsg">\
                    <div class="weui-media-box__hd">\
                        <img class="weui-media-box__thumb" src="../img/icon_qingjia@3x.png">\
                    </div>\
                    <div class="weui-media-box__bd">\
                        <h4 class="weui-media-box__title">'+ ins.form_ins_id +''+ ins.workflow_ins_name +' '+ ins.creator_name +'</h4>\
                        <p class="weui-media-box__desc">\
                            <span class="workflow_progress">'+ status[ins.status] +'</span>\
                        </p>\
                        <p class="weui-media-box__meta">\
                            '+ time +'\
                        </p>\
                    </div>\
                </a>'
            )
        });
        this.$insList.html(list.join(''));
       
        // $(insList).each(function(i, ins){
        //     var users = []
        //     $(ins.todo_list).each(function(i, todo){
        //         users.push(_this.accountList[todo.account_id]);
        //     })
        //     var states = ['创建', '草稿', '审批中', '完成', '终止']
        //     var item = tpl.replace(/\{id\}/ig, ins.id)
        //                 .replace('{title}', ins.name || 'test')
        //                 .replace('{type}', ins.workflow_def_name)
        //                 .replace('{approving}', users.join(','))
        //                 .replace('{state}', states[ins.status])
        //                 .replace('{status}', ins.status)
        //                 .replace('{time}', ins.create_time);
        //     list.push(item);
        // })
        // this.$insList.find('tbody').append(list.join(''));
    }
}

// 获取列表(index.html)
App.Workflow.WorkflowDefList = function(){
    this.$workflowDefList = $('#workflowDefList');
    this.init();
}
App.Workflow.WorkflowDefList.prototype = {
    init: function(){
        // this.creatNotice(localStorage.unDealNum);
        this.bind();
        tools.busy(true);
        this.getDefList();
    },
    bind: function(){
        var _this = this;
        var obj2637 = {
            url: 'admin/workflow/2637.spring',
            args: {
                approver_id : App.Config.accountId,
                status : "",
                domain_id : App.Config.companyId    
            },
            success: function(res) {
                if(res.code == 200){
                    var firstPageNum = res.ret.workflow_ins_list.length;
                    var otherNum = (res.ret.total_page-1)*10;
                }
               _this.creatNotice(firstPageNum);
            }
        }
        Ajax(obj2637);
    },
    // 生成右上角角标
    creatNotice: function(num){
        // console.log("渲染" +num);
        var num1 = num;
        // console.log(num1);
        if(num1>0 && num1<100){
            $('.notice').text(num).css("display","block");
        }else{

        }
    },
    // 获取可以发起的流程清单
    getDefList: function(){
        var _this = this;
        var objGetWorkflowDefList = {
            url: 'admin/workflow/2605.spring',
            args: {
                domain_id: App.Config.companyId //2605接口
            },
            success: function(res) {
                _this.workflowDefList = res.ret;
                _this.buildDefList(); 
                tools.busy(false);
            }
        }
        Ajax(objGetWorkflowDefList);
    },
    buildDefList: function(){
        var list = [];
        var icons = ['chufang.png', 'yiti.png','apply.png','wupin.png','xiupc.png'];
        $(this.workflowDefList.workflow_def_list).each(function(i, def){
            if(def.status === 1){
                list.push('<a href="'+ WEB_URL_H5 +'create.html?id='+ def.id +'" class="weui-grid">\
                    <div class="weui-grid__icon">\
                        <img src="'+ STATIC_URL_H5 +'icon/'+ icons[i % 2] +'">\
                    </div>\
                    <div class="weui-grid__span">\
                        '+def.name+'\
                    </div>\
                    </a>')
            }
        });
        this.$workflowDefList.html(list.join(''))
    }
}

//流程发起(creat.html)
App.Workflow.WorkflowCreate = function(options){
    this.workflowId = options.id;
    this.workflow = {};
    this.$workflowType = $('#workflowType');
    this.init();
}
App.Workflow.WorkflowCreate.prototype = {
    init: function(){
        this.bind();
        this.getWorkflowDefInfo();
    },
    bind: function(){

    },
    getWorkflowDefInfo: function(){
        var _this = this;
        //查看工作流定义(2602)
        var objGetWorkflowDefInfo = {
            url:'admin/workflow/2602.spring', 
            args: {
                workflow_def_id:this.workflowId
            },
            success: function(res) {
                _this.$workflowType.text(res.ret.workflow_def.name);
                _this.workflow = res.ret.workflow_def;
                //生成表单
                _this.formIns = new App.Workflow.FormIns({
                    formId: _this.workflow.form_def_id,
                    callback: function(){
                        _this.submit();
                    }
                })
            },
            error:function(rst){
                tools.busy(false);
                tools.toast(rst.ret);
            },
            asy: false
        }
        Ajax(objGetWorkflowDefInfo);   
    },
    createWorkflowIns: function(){ //创建流程实例
        var _this = this;
        // 创建流程实例(2631)
        var obj2631 = {
            url: 'admin/workflow/2631.spring',  
            args: {
                workflow_ins: JSON.stringify({
                    workflow_def_id: _this.workflowId,
                    workflow_def_name: _this.workflow.name,
                    form_def_id: _this.workflow.form_def_id,
                    form_ins_id: form_ins_id.toString(),
                    workflow_ins_name: _this.workflow.name,
                    creator_id: App.Config.accountId,
                    creator_name: App.Config.accountName,
                    domain_id: App.Config.companyId 
                }),   
            },
            success: function(res) {
                _this.workflowIns = res.ret.workflow_ins;
                _this.getCurrentInfo();
            },
            error:function(rst){
                tools.busy(false);
                tools.toast(rst.ret);
            }
        }
        Ajax(obj2631);
    },
    getCurrentInfo: function(){
        var _this = this;
        // 查看流程实例(2632)
        var obj2632 = {
            url: 'admin/workflow/2632.spring',  // 查看流程实例
            args: {
                workflow_ins_id: this.workflowIns.id, 
                account_id: App.Config.accountId            
            },
            success: function(res) {
                _this.curInsInfo = res.ret;
                _this.submitWorkflowIns();
            },
            error:function(rst){
                tools.busy(false);
                tools.toast(rst.ret);
            }
        }
        Ajax(obj2632);
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
        // 提交流程实例-前进
        var obj2671 = {
        url: 'admin/workflow/2671.spring',  
            args: {
                workflow_ins_id: _this.workflowIns.id,
                account_id: App.Config.accountId,
                account_name: App.Config.accountName,
                cur_seq_id: _this.curInsInfo.cur_node.seq_id,
                comment:'', 
                next_node_list: nextNodeList
            },
            success: function(res) {
                if(res.code==200){
                    tools.busy(false);
                    tools.toast("创建成功");
                    setTimeout(function(){
                        window.location.href = document.referrer;
                    }, 1000)
                }else{
                    tools.toast("创建失败");
                }
            },
            error:function(rst){
                tools.busy(false);
                tools.toast(rst.ret);
            }
        }
        Ajax(obj2671);
    },
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
    }
}

//表单实例
App.Workflow.FormIns = function(options){
    this.formId = options.formId;
    this.callback = options.callback || function(){};
    this.$formContainer = options.container || $('#workflowForm');
    this.$btnSubmit = $('#btnSubmit');
    this.$btnCancel = $('#btnCancel');
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
        // this.$formContainer.on('submit', $.proxy(this.submit, this));
        this.$btnSubmit.on('click', $.proxy(this.submit, this));
        this.$btnCancel.on('click', function(){
            window.location.href = document.referrer;
        })
    },
    getFormInfo: function(){ //获取表单定义的内容
        var _this = this;
        var obj2503 = {
            url: 'admin/workflowform/2503.spring',  // 获取表单定义的内容
            args: {
                formId: this.formId
            },
            success: function(res) {
                _this.formDef = res.data;
                _this.buildForm();
            },
            error:function(rst){
                tools.busy(false);
                tools.toast(rst.ret);
            }
        }
        Ajax(obj2503);
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
        tools.busy(true);
        _this.$btnSubmit.attr('disabled', 'disabled');
        if(!this.$formContainer.validate('validateAll')) {
            tools.busy(false);
            _this.$btnSubmit.removeAttr('disabled');
            return false;
        }
        //构建数据
        var itemValues = []

        $(this.widgets).each(function(i, widget){
            var value = widget.val();
            itemValues.push({
                item_id: widget.data.id,
                item_value: typeof value === 'object' ? JSON.stringify(value) : value
            })
        });
        var name = this.widgets[0].val();
        var obj2504 = {
            url:'admin/workflowform/2504.spring',
            args: {
                formId : this.formId,
                map : itemValues
            },
            success: function(r) {
                if(r.code === 1){
                    // 将表单实例id存入全局变量
                    form_ins_id = r.data;
                    _this.callback();
                }
            },
            error:function(rst){
                tools.busy(false);
                _this.$btnSubmit.removeAttr('disabled');
                tools.toast(rst.ret);
            }
        }
        Ajax(obj2504);
    }
}

App.Workflow.FormIns.type = {1: "text", 2: "textarea", 3: "mobile", 4: "email", 5: "phone", 6: "number", 7: "money", 8: "radio", 9: "checkbox", 10: "date", 11: "daterange", 12: "image", 13: "file", 14: "person", 16: "department", 18: "tree", 19: "description", 20: "table", 21: "separator", 22: "position"};
App.Workflow.FormIns.type[23] = 'dep';
$.each(['text', 'mobile', 'email', 'phone', 'number', 'money','dep'], function(i, type){
    App.Workflow.FormIns[type] = function(data){
        var widget = {
            data: data,
            type: type
        }
        var tpl = '<div class="weui-cell form-group"> \
                    <div class="weui-cell__hd"><label class="weui-label">{title}</label></div> \
                    <div class="weui-cell__bd"> \
                        <input class="weui-input" id="{id}" '+ (type === 'number' || type === 'money' ? 'type="number" pattern="[0-9]*"' : 'type="text"') +' placeholder="{tooltip}"/> \
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
            var obj10011 = {
                url:'home/user/1001.spring',
                args:{
                    userId:localStorage.userId
                },
                success:function(rst){
                    widget.display.find('#' + data.id).val(rst.data.departmentName);
                }
            }
            Ajax(obj10011);
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
    var tpl = '<div class="weui-cell form-group"> \
                    <div class="weui-cell__hd"><label for="" class="weui-label">{title}</label></div> \
                    <div class="weui-cell__bd"> \
                        <textarea class="weui-textarea" id="{id}" placeholder="{tooltip}" rows="3"></textarea> \
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

$.each(['radio', 'checkbox'], function(i, type){
    App.Workflow.FormIns[type] = function(data){
        var widget = {
            data: data,
            type: type
        }        
        var tpl = '<div class="weui-cell weui-cell_select weui-cell_select-after form-group"> \
                        <div class="weui-cell__hd"><label for="" class="weui-label">{title}</label></div> \
                        <div class="weui-cell__bd"> \
                            <select class="weui-select" id="{id}"> \
                                <option value="" selected>{tooltip}</option> \
                            </select> \
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
    var tpl = '<div class="weui-cell form-group"> \
                    <div class="weui-cell__hd"><label for="" class="weui-label">{title}</label></div> \
                    <div class="weui-cell__bd"> \
                        <input class="weui-input " id="{id}" type="text" placeholder="{tooltip}"> \
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
    var tpl = '<div class="weui-cell form-group min-date"> \
                    <div class="weui-cell__hd"><label for="" class="weui-label">{title}</label></div> \
                    <div class="weui-cell__bd"> \
                        <input class="weui-input" type="text" placeholder="{tooltip}"> \
                    </div> \
                </div> \
                <div class="weui-cell max-date"> \
                    <div class="weui-cell__hd"><label for="" class="weui-label">{sub_title}</label></div> \
                    <div class="weui-cell__bd"> \
                        <input class="weui-input" type="text" placeholder="{tooltip}"> \
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
    var tpl = '<div class="weui-cells__title">{title}</div>'
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
    var tpl = '<div><div class="weui-cell"> \
                    <div class="weui-cell__hd"><label for="" class="weui-label">{title}</label></div> \
                    <div class="weui-cell__bd"> \
                        <span class="weui-file"> \
                            <em>{tooltip}</em> \
                            <input type="hidden" id="widget{id}"> \
                            <input type="file" class="ipt-file"> \
                            <img src="../img/icon_attachment.png"> \
                        </span> \
                    </div> \
                </div> \
                <div class="weui-cell file-list-container" style="display: none;"> \
                    <div class="weui-cell__hd"><label for="" class="weui-label"></label></div> \
                    <div class="weui-cell__bd"> \
                        <div class="weui-file-list file-list"> \
                        </div> \
                    </div> \
                </div></div>'
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
    var fileListContainer = widget.display.find('.file-list-container');

    iptFile.on('change', function(e){
        var file = this.files[0];
        //init
        var item = '<p><span class="file-name">'+ file.name +'</span><a class="weui-icon-clear" href="javascript:;" style="display: none;"><span>&times;</span></a><span class="percent"></span></p>'
        item = $(item);
        var percent = item.find('.percent')
        fileListContainer.show();
        fileList.prepend(item)

        //upload
        var fd = new FormData();
        // fd.append('name', file.name);
        // fd.append('file', file);
        fd.append('uploadFile', file);
        fd.append('userId',localStorage.userId);
        // fd.append('domain_id', App.Config.companyId);
        $.ajax({
            url: BASE.url + "home/files/2201.spring",
            type: 'post',
            dataType: 'json',
            contentType: false,
            processData: false,
            data: fd,
            xhr: function(){
                var myXhr = $.ajaxSettings.xhr();
                if(myXhr.upload){
                    //uploading
                    myXhr.upload.addEventListener('progress', function(e){
                        percent.css({
                            width: e.loaded / file.size * 100 + '%'
                        })
                    }, false)
                }
                return myXhr;
            },
            success: function(r){
                if(r.data.filesList[0].fileName){
                    //uploaded
                    fileListValue.push(r.data.filesList[0].fileName);
                    item.find('a').data('fileid', r.data.filesList[0].fileId).show();
                    percent.remove();
                    // filePath = r.data.filesList[0].realPath;
                    filePath.push(r.data.filesList[0].realPath);
                }
                // if(r.name){
                //     //uploaded
                //     fileListValue.push(r);
                //     item.find('a').data('fileid', r.grid_id).show();
                //     percent.remove();
                //     filePath = r.data.filesList[0].realPath;
                // }
            }
        })
    });

    fileList.on('click', 'a', function(e){
        var target = $(this);
        var id = target.data('id');
        deleteFile(id);
        target.parent().remove();
        if(fileListValue.length === 0) {
            fileListContainer.hide();
        }
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
        // return widget.display.find('#widget' + data.item_id).val();
        return JSON.stringify(filePath);
    }

    return widget;
}
//image,file,person,department,tree,description,table,position

// 工作流详情 detail.html
App.Workflow.WorkflowInsDetail = function(options){
    this.id = options.id;
    this.creator_id = "";
    // this.$workflowInsName = $('#workflowInsName');
    this.$workflowInsInfo = $('#workflowInsInfo');
    this.$workflowInsStatus = $('#workflowInsStatus');
    this.$workflowInsActions = $('#workflowInsActions');
    this.$btnSubmit = $('#btnAgree');
    this.$btnRefuse = $('#btnRefuse');
    this.$btnCancel = $('#btnCancel');
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
                                .on('click', '#btnRefuse', $.proxy(this.refuse, this))
                                .on('click', '#btnCancel', $.proxy(this.cancel, this));
    },
    getWorkflowInsInfo: function(){
        var _this = this;
        var status = ['创建', '草稿', '审批中', '完成', '流程终止'];
        /*$.get('/workflow/ins/retrieve/', {
            id: this.id,
            account_id: App.Config.accountId
        }, function(r){
            if(r.code === 200){
                _this.workflowInsInfo = r.ret;
                if(_this.workflowInsInfo.cur_node){
                    _this.$workflowInsActions.show();
                    if(!_this.workflowInsInfo.cur_node.rollback_list.length){
                        _this.$workflowInsActions.find('#btnRefuse').data('disabled', true);
                        _this.$workflowInsActions.find('#btnRefuse').remove();
                    }
                }

                // _this.$workflowInsName.text(_this.workflowInsInfo.workflow_ins.name)
                _this.getFormInsInfo();
                _this.buildStatus();
            }
        }, 'json')*/
        var obj2632 = {
            url: 'admin/workflow/2632.spring',  // 查看流程实例
            args: {
                workflow_ins_id: _this.id, 
                account_id: App.Config.accountId            
            },
            success: function(r) {
                if(r.code === 200){
                    _this.workflowInsInfo = r.ret;
                    // if(_this.workflowInsInfo.cur_node){
                    //     _this.$workflowInsActions.show();
                    //     if(!_this.workflowInsInfo.cur_node.rollback.length){
                    //         // _this.$workflowInsActions.find('#btnRefuse').data('disabled', true);
                    //         _this.$workflowInsActions.find('#btnRefuse').remove();
                    //     }
                    // }
                    //完成则屏蔽操作
                    if(_this.workflowInsInfo.workflow_ins.status == 3){ //流程结束
                        _this.$workflowInsActions.remove();
                    }else if(!_this.workflowInsInfo.cur_node){  //当前结点是否需要您审批
                        _this.$btnSubmit.remove();
                        _this.$btnRefuse.remove();
                        if(_this.workflowInsInfo.cur_node){
                            if(!_this.workflowInsInfo.cur_node.rollback.length || localStorage.userId == _this.workflowInsInfo.workflow_ins.operation_list[0].account_id){
                                _this.$workflowInsActions.find('#btnRefuse').remove();
                            }
                        }
                    }

                    if(localStorage.userId !== r.ret.workflow_ins.creator_id || _this.workflowInsInfo.workflow_ins.status == 4){  //如果您不是流程创建人移除撤销键
                        _this.$btnCancel.remove();
                    }
                    
                    if(_this.$workflowInsActions.children().length == 0){   //没有三个按钮则移除操作栏
                        _this.$workflowInsActions.remove();
                    }
                    
                    _this.creator_id = r.ret.workflow_ins.creator_id;
                    $('#workflowId').text(r.ret.workflow_ins.form_ins_id);
                    $('#workflowStatus').text(status[r.ret.workflow_ins.status]);
                    _this.buildUserInfo(r.ret.workflow_ins.creator_id);
                    _this.getFormInsInfo();
                    _this.buildStatus();
                }
            },
            error:function(rst){
                tools.busy(false);
                tools.toast(rst.ret);
            },
            asy: false
        }
        Ajax(obj2632);
        // 测试
        // if(detail1.code === 200){
        //         _this.workflowInsInfo = detail1.ret;
        //         if(_this.workflowInsInfo.cur_node){
        //             _this.$workflowInsActions.show();
        //             if(!_this.workflowInsInfo.cur_node.rollback_list.length){
        //                 _this.$workflowInsActions.find('#btnRefuse').data('disabled', true);
        //                 _this.$workflowInsActions.find('#btnRefuse').remove();
        //             }
        //         }

        //         // _this.$workflowInsName.text(_this.workflowInsInfo.workflow_ins.name)
        //         _this.getFormInsInfo();
        //         _this.buildStatus();
        //     }
    },
    buildUserInfo: function(id){
        var obj1001 = {
            url:'home/user/1001.spring',
            args:{
                userId: id
            },
            success:function(rst){
                $('#userName').text(rst.data.userRealname);
                
                $('#dep').text(rst.data.departmentName);
            }
        }
        Ajax(obj1001);
    },
    getFormInsInfo: function(){
        var _this = this;
        /*$.when($.get('/form/get_inst/', {
            form_inst_id: this.workflowInsInfo.workflow_ins.form_ins_id
        }), $.get('/form/get_def/', {
            form_def_id : this.workflowInsInfo.workflow_ins.form_def_id
        })).then(function(formInsInfo, formDefInfo){
            _this.formInsInfo = formInsInfo[0].ret;
            _this.formDefInfo = formDefInfo[0].ret;

            _this.buildInfo();
        })*/
        var obj2503 = {
            url: 'admin/workflowform/2503.spring',  // 获取表单定义的内容
            args: {
                formId: this.workflowInsInfo.workflow_ins.form_def_id,
            },
            success: function(res) {
                _this.formDefInfo = res.data;
                _this.get_inst();
            }
        }
        Ajax(obj2503);
        
        // 测试
        // _this.formInsInfo = formInsInfo.ret;
        // _this.formDefInfo = formDefInfo.ret;
        // _this.buildInfo();
    },
    get_inst: function(){
        var _this = this;
        var obj2505 = {
            url: 'admin/workflowform/2505.spring',  // 获取表单实例列表
            args: {
                formId: this.workflowInsInfo.workflow_ins.form_def_id,
                form_ins_id: this.workflowInsInfo.workflow_ins.form_ins_id
                // sid:'58ba297a30534499b2d8595115f26575',
                // loginId:'2873',
                // deviceType:'web',
                // deviceId:'',  
            },
            success: function(res) {
                console.log(res);
                _this.formInsInfo = res.data[0];
                // _this.formInsInfo = res.data;
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
        html.push('<p><label class="weui-form-preview__label">　</label><span class="weui-form-preview__value">'+ this.workflowInsInfo.workflow_ins.form_ins_id +''+ this.workflowInsInfo.workflow_ins.workflow_ins_name +'</span></p>')
        $(formDefInfo).each(function(i, item){
            //TODO 不同类型显示不同的值
            if(item.type === 11 && values[item.id]){ //日期区间
                var value = values[item.id];
                value = $.parseJSON(value);
                html.push('<p><label class="weui-form-preview__label">'+ value.start +'</label><span class="weui-form-preview__value">'+ value.start +'</span></p>');
                html.push('<p><label class="weui-form-preview__label">'+ value.end +'</label><span class="weui-form-preview__value">'+ value.end +'</span></p>');
            }else if(item.type === 13){
                var value = values[item.id];
                value = $.parseJSON(value);
                var files = [];
                $(value).each(function(i, item){
                    files.push('<span style="display: block;"><a download href="'+BASE.url+''+item+'">'+ item.split('/').pop() +'</a></span>');
                })
                html.push('<p><label class="weui-form-preview__label">'+ item.title +'</label><span class="weui-form-preview__value">'+ files.join('') +'</span></p>');
            }else{
                html.push('<p><label class="weui-form-preview__label">'+ item.title +'</label><span class="weui-form-preview__value">'+ values[item.id] +'</span></p>');
            }
        });
        this.$workflowInsInfo.html(html.join(''));
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
                url:'home/user/1001.spring',
                args:{
                    userId:accountIds[i]
                },
                success:function(rst){
                    // vm.creatDep = rst.data.departmentName;
                    accountList[accountId] = rst.data.userRealname;
                    
                },
                asy:false
            }
            Ajax(obj1001);
        }
        build();        

        function build(){
            $(workflowIns.operation_list).each(function(i ,item){
                var time = item.create_time.substr(0,19).replace(/T/," ");
                list.push('<li '+ (item.operation.indexOf('WorkflowInsRollback') >= 0 ? 'class="fail"' : 'class="current"') +'> \
                            <div class="name"> \
                                <span><i class="fa fa-check iconCheck" aria-hidden="true"></i></span> \
                            </div> \
                            <div class="status"> \
                                <span class="arrow"></span> \
                                <div class="userImg">\
                                    <img src="http://120.132.85.24:8080/MOA/upload/avatar/'+ item.account_id +'.png" alt="">\
                                </div>\
                                <p class="colorBlack"><strong class="userName1">'+ accountList[item.account_id] +'</strong></p>\
                                <p class="node-name">'+ item.seq_id_name +'</p> \
                                <p class="comment">'+ (item.operation_label || '') +'</p> \
                                <p class="comment">'+ (item.comment || '') +'</p> \
                                <p class="time">'+ time +'</p> \
                            </div> \
                        </li>')
            });

            var todoUsers = [];
            $(workflowIns.todo_list).each(function(i ,item){
                var user = {
                    id : item.account_id,
                    name : accountList[item.account_id]
                }
                todoUsers.push(user);
                // todoUsers.push(accountList[item.account_id]);
            });
            if(workflowIns.status == 4){
                list.push('<li class="current"> \
                                <div class="name"> \
                                    <span><i class="fa fa-check iconCheck" aria-hidden="true"></i></span> \
                                </div> \
                                <div class="status"> \
                                    <span class="arrow"></span> \
                                    <p class="node-name">流程终止</p> \
                                    <p class="comment"></p> \
                                    <p class="time"></p> \
                                </div> \
                            </li>')
            }else{
                if(todoUsers.length){
                    var noticeMsg = (_this.creator_id == todoUsers[0].id) ? '待'+todoUsers[0].name+'确认' : todoUsers[0].name+'审批中'; 
                    list.push('<li class="fail"> \
                                <div class="name"> \
                                    <span><i></i></span> \
                                </div> \
                                <div class="status"> \
                                    <span class="arrow"></span> \
                                    <div class="userImg">\
                                        <img src="http://120.132.85.24:8080/MOA/upload/avatar/'+ todoUsers[0].id +'.png" alt="">\
                                    </div>\
                                    <p class="colorBlack"><strong class="userName1">'+ todoUsers[0].name +'</strong></p>\
                                    <p class="node-name">'+ noticeMsg +'</p> \
                                    <p class="time"></p> \
                                </div> \
                            </li>')
                }else{
                    list.push('<li class="current"> \
                                <div class="name"> \
                                    <span><i class="fa fa-check iconCheck" aria-hidden="true"></i></span> \
                                </div> \
                                <div class="status"> \
                                    <p class="node-name">流程结束</p> \
                                    <p class="comment"></p> \
                                    <p class="time"></p> \
                                </div> \
                            </li>')
                }
            }
            

            _this.$workflowInsStatus.html(list.join(''));
        }
    },
    cancel: function(){
        var self = this;
        var obj2674 = {
            url: 'admin/workflow/2674.spring',
            args: {
                workflow_ins_id: self.id,
                creator_id : self.creator_id
            },
            success: function(res) {
                console.log(res);
                if(res.ret.workflow_ins.status == 4){
                    tools.busy(false);
                    tools.toast("撤销成功");
                    setTimeout(function(){
                        window.location.href = document.referrer;
                    }, 1000)
                }else{
                    tools.busy(false);
                    tools.toast("撤销失败");
                }
            },
            error:function(rst){
                tools.busy(false);
                tools.toast(rst.ret);
            }
        }
        Ajax(obj2674);
    },
    agree: function(){
        var self = this;
        // console.log($('.workflow-agree').css("display"));
        if($('.workflow-agree').css("display") == "none"){
            $('.workflow-agree').css("display","block");
            $('.goBack').on('click',function(){
                $('.workflow-agree').css("display","none");
            });
            $('#submit').on('click',function(){
                self.agreeSubmit();
            });
        }
    },
    agreeSubmit: function(){
        var _this = this;
        // 设置next_node_list参数，获取cur_node中的id，找到next_node中的id
        var nextNodeList = [];
        tools.busy(true);
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
        url: 'admin/workflow/2671.spring',  
            args: {
                workflow_ins_id: _this.id,
                account_id: App.Config.accountId,
                account_name: App.Config.accountName,
                cur_seq_id: _this.workflowInsInfo.cur_node.seq_id,
                comment: $('#commentTextArea').val(), 
                next_node_list: nextNodeList
            },
            success: function(res) {
                if(res.code==200){
                    tools.busy(false);
                    tools.toast("审核成功");
                    setTimeout(function(){
                        window.location.href = document.referrer;
                    }, 1000)
                }else{
                    tools.toast("审核失败");
                }
            },
            error:function(rst){
                tools.busy(false);
                tools.toast(rst.ret);
            }
        }
        Ajax(obj2671);
    },
    refuse: function(e){
        var _this = this;
        if($(e.currentTarget).data('disabled')) return;
        var workflowInsInfo = this.workflowInsInfo;
        var rollback_list = workflowInsInfo.cur_node.rollback;
        
        var actionsheet = '<div> \
                            <div class="weui-mask" id="iosMask" style="display: none"></div> \
                            <div class="weui-actionsheet" id="iosActionsheet"> \
                                <div class="weui-actionsheet__menu" id="select"> \
                                </div> \
                                <div class="weui-actionsheet__action"> \
                                    <div class="weui-actionsheet__cell" id="iosActionsheetCancel">取消</div> \
                                </div> \
                            </div> \
                        </div>'
        

        actionsheet = $(actionsheet).appendTo($('body'));

        var $iosActionsheet = $('#iosActionsheet');
        var $iosMask = $('#iosMask');

        function hideActionSheet() {
            $iosActionsheet.removeClass('weui-actionsheet_toggle');
            $iosMask.fadeOut(200, function(){
                $iosMask.parent().remove();
            });
        }

        $iosMask.on('click', hideActionSheet);
        $('#iosActionsheetCancel').on('click', hideActionSheet);

        var select = actionsheet.find('#select');
        var options = [];
        $(rollback_list).each(function(i, item){
            options.push('<div class="weui-actionsheet__cell refuse-type" data-type="'+ item.rollback_category +'">'+ item.label +'</div>');
        });
        select.html(options.join(''));

        $iosActionsheet.addClass('weui-actionsheet_toggle');
        $iosMask.fadeIn(200);

        select.on('click', '.refuse-type', function(){
            var type = $(this).data('type');
            _this.refuse1(type);
            // _this.refuseSubmit(type);
            hideActionSheet();
        })
    },
    refuse1: function(type){
        var self = this;
        if($('.workflow-agree').css("display") == "none"){
            $('.workflow-agree').css("display","block");
            $('.goBack').on('click',function(){
                $('.workflow-agree').css("display","none");
            });
            $('#submit').on('click',function(){
                self.refuseSubmit(type);
            });
        }
    },
    refuseSubmit: function(type){
        var _this = this;
        var workflowInsInfo = this.workflowInsInfo;
        tools.busy(true);
        // 提交流程实例-后退
        var obj2672 = {
        url: 'admin/workflow/2672.spring',  
            args: {
                workflow_ins_id: _this.id,
                account_id: App.Config.accountId,
                account_name: App.Config.accountName,
                cur_seq_id: _this.workflowInsInfo.cur_node.seq_id,
                comment: $('#commentTextArea').val(), 
                rollback_category: type.toString(),
                spec_seq_id: ''
            },
            success: function(res) {
                if(res.code==200){
                    tools.busy(false);
                    tools.toast("驳回成功");
                    setTimeout(function(){
                        window.location.href = document.referrer;
                    }, 1000)
                }else{
                    tools.toast("驳回失败");
                }
            },
            error:function(rst){
                tools.busy(false);
                tools.toast(rst.ret);
            }
        }
        Ajax(obj2672);
    }
}