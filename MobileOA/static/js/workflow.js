/**
 * @fileOverview 流程
 * @author angelscat@vip.qq.com
 * 
 */

 // 修改jqueryajax，用于修改ztree请求字段
 $(document).ajaxSend(function(event, jqxhr, settings) {
     
    if(settings.url === API.getOrg ) {
        settings.processData = false;
        jqxhr.setRequestHeader("Content-Type","application/json");
        settings.contentType = 'application/json';
        settings.dataType = 'json';

        var data = {};
        data.sid = localStorage.sId || '-1';;
        data.loginId = localStorage.userId || '-1';
        data.deviceType = 'web';
        data.deviceId = '';

        // 将请求的id和type加入data
        var temp = settings.data.split('&');
        for(var i = 0, item; item = temp[i++]; ) {
            data[item.split('=')[0]] = item.split('=')[1];
        }

        settings.data = JSON.stringify(data);
    }
    console.log(settings);

 });

var App = App || {};
App.Workflow = App.Workflow || {};
App.Net.encrypt = false;

//审批流程管理
App.Workflow.Manage = function(){
    this.defaultPageSize = 20;
    this.page = 0;
    this.init();
}
App.Workflow.Manage.prototype = {
    init: function(){
        var _this = this;
        this.$flowList = $('#formList');
        this.$pager = $('#pager');

        this.pager = new App.UI.Pager({
            el: this.$pager,
            total: 0,
            pageSize: this.defaultPageSize,
            callback: function(page){
                _this.getList(page)
                $(window).scrollTop(0);
            }
        })

        this.getList()
        this.bind();
    },
    bind: function(){
        var _this = this;
        this.$flowList.on('click', '.stop-using', $.proxy(this.stopUsing, this))
        .on('click', '.start-using', $.proxy(this.startUsing, this))
        .on('click', '.publish', $.proxy(this.publish, this))
        .on('click', '.delete', $.proxy(this.del, this))
    },
    getList: function(page){
        var _this = this;
        this.page = page ? page - 1 : this.page;
        // $.get('/workflow/def/list/', {
        //     domain_id: App.Config.companyId
        // }, function(r){
        //     //TODO 异常处理
        //     console.log(r)
        //     _this.flowList = r.ret.data;
        //     _this.buildList();
        //     // if(_this.pager.getTotal() !== r.msg.total) _this.pager.resetTotal(r.msg.total);
        // }, 'json')
        
        var objGetWorkflowList = {
            url: API.getWorkflowList,
            args: {
                domain_id: App.Config.companyId
            },
            success: function(res) {
                _this.flowList = res.ret.workflow_def_list;
                // _this.formList = res;
                _this.buildList(); 
            }
        }
        Ajax(objGetWorkflowList);
    },
    buildList: function(){
        var flowList = this.flowList;
        var _this = this;
        var tpl = '<tr data-id="{id}" id="flow{id}"> \
                        <td>{title}</td>\
                        <td><span class="status{state}">{status}</span></td>\
                        <td>{time}</td>\
                        <td>{actions}</td>\
                    </tr>';

        //表单状态（0:草稿,1：启用,2:停用）
        var status = ['草稿', '启用', '停用', '删除'];

        var list = [];
        $(flowList).each(function(i, flow){
            var item = tpl.replace(/\{id\}/ig, flow.id)
                        .replace('{title}', flow.name)
                        .replace('{state}', flow.status)
                        .replace('{status}', status[flow.status])
                        .replace('{time}', flow.create_time);

            var actions = '';
            var state = flow.status;
            if(state === 0){ //可以编辑、删除、发布
                actions = '<a href="javascript:;" class="publish">发布</a> <a href="'+ WEB_URL +'workflow/edit/?id='+ flow.id +'" class="edit">编辑</a> <a href="javascript:;" class="delete">删除</a>';
                // actions = '<a href="/workflow/edit/?id='+ flow.id +'" class="edit">编辑</a> <a href="javascript:;" class="delete">删除</a>';
            }else if(state === 1){ //可以停用、创建新版本
                actions = '<a href="'+ WEB_URL +'workflow_design.html?id='+ flow.id +'" class="edit">编辑</a> <a href="javascript:;" class="delete">删除</a>';
                // actions = '<a href="javascript:;" class="publish">发布</a> <a href="'+ WEB_URL +'workflow_design.html?id='+ flow.id +'" class="edit">编辑</a> <a href="javascript:;" class="delete">删除</a>';
                // actions = '<a href="javascript:;" class="stop-using">停用</a>';
                // actions = '<a href="javascript:;" class="stop-using">停用</a> <a href="javascript:;" class="create-new-version">创建新版本</a>';
            }else if(state === 2){
                actions = '<a href="javascript:;" class="start-using">启用</a>';
                // actions = '<a href="javascript:;" class="start-using">启用</a> <a href="javascript:;" class="create-new-version">创建新版本</a>';
            }
            item = item.replace('{actions}', actions);
            list.push(item);
        })

        this.$flowList.find('tbody').html(list.join(''));
    },

    stopUsing: function(e){
        var target = $(e.currentTarget);
        var id = target.parents('tr').data('id');
        var _this = this;
        
        // $.post('/workflow/def/update/', {
        //     id: id,
        //     attr_data: JSON.stringify({
        //         status: 2
        //     })
        // }, function(r){
        //     // console.log(r);
        //     if(r.code === 200){
        //         App.success('停用成功');
        //         _this.getList();
        //     }else{
        //         App.fail('停用失败');
        //     }
        // }, 'json')
    },
    startUsing: function(e){
        var target = $(e.currentTarget);
        var id = target.parents('tr').data('id');
        var _this = this;
        
        // $.post('/workflow/def/update/', {
        //     id: id,
        //     attr_data: JSON.stringify({
        //         status: 1
        //     })
        // }, function(r){
        //     // console.log(r);
        //     if(r.code === 200){
        //         App.success('启用成功');
        //         _this.getList();
        //     }else{
        //         App.fail('启用失败');
        //     }
        // }, 'json')
    },
    del: function(e){
        var target = $(e.currentTarget);
        var id = target.parents('tr').data('id');
        var _this = this;
        App.confirm({
            message: '确认删除流程定义吗？',
            callback: function(f){
                if(f){
                    // $.post('/workflow/def/delete/', {
                    //     id: id
                    // }, function(r){
                    //     if(r.code === 200){
                    //         App.success('删除成功');
                    //         _this.getList();
                    //     }else{
                    //         App.fail('删除失败');
                    //     }
                    // }, 'json')
                    var objDeleteWorkflow = {
                        url: API.delWorkflow,
                        args: {
                            workflow_def_id: id
                        },
                        success: function() {
                            App.success('删除成功');
                            _this.getList();
                        },
                        error: function() {
                            App.fail('删除失败');
                        }
                    }

                    Ajax(objDeleteWorkflow);

                }
            }
        })
    },
    publish: function(e){
        var target = $(e.currentTarget);
        var id = target.parents('tr').data('id');
        var _this = this;

        // $.post('/workflow/def/update/', {
        //     id: id,
        //     attr_data: JSON.stringify({
        //         status: 1
        //     })
        // }, function(r){
        //     // console.log(r);
        //     if(r.code === 200){
        //         App.success('发布成功');
        //         _this.getList();
        //     }else{
        //         App.fail('发布失败');
        //     }
        // }, 'json')
    }
}

//表单管理
App.Workflow.ManageForm = function(){
    this.defaultPageSize = 20;
    this.page = 0;

    this._init()
}
App.Workflow.ManageForm.prototype = {
    _init: function(){
        var _this = this;
        this.$formList = $('#formList');
        this.$pager = $('#pager');

        this.pager = new App.UI.Pager({
            el: this.$pager,
            total: 0,
            pageSize: this.defaultPageSize,
            callback: function(page){
                _this.getFormList(page)
                $(window).scrollTop(0);
            }
        })

        this.getFormList()
        this._bind();
    },
    _bind: function(){
        var _this = this;
        this.$formList.on('click', '.stop-using', $.proxy(this.stopUsing, this))
        .on('click', '.start-using', $.proxy(this.startUsing, this))
        .on('click', '.create-new-version', $.proxy(this.createNewVersion, this))
        .on('click', '.publish', $.proxy(this.publish, this))
        .on('click', '.delete', $.proxy(this.del, this))
    },
    // 获取表单列表
    getFormList: function(page){
        var _this = this;
        this.page = page ? page - 1 : this.page;
        // $.get('/form/list_def/', {
        //     page_index: this.page,
        //     page_num: this.defaultPageSize,
        //     domain_id: App.Config.companyId
        // }, function(r){
        //     //TODO 异常处理
        //     // console.log(r)
        //     _this.formList = r.ret;
        //     _this.buildList();
        //     if(_this.pager.getTotal() !== r.ret.total) _this.pager.resetTotal(r.ret.total);
        // }, 'json')
        var objGetFormList = {
            url: API.getFormList,
            args: {},
            success: function(res) {
                _this.formList = res;
                _this.buildList();
                // if(_this.pager.getTotal() !== r.ret.total) _this.pager.resetTotal(r.ret.total);
            }
        }
        Ajax(objGetFormList);

    },
    // 渲染表单列表
    buildList: function(){
        var formList = this.formList;
        var _this = this;
        // var tpl = '<tr data-id="{id}" id="form{id}"> \
        //                 <td>{title}</td>\
        //                 <td>{version}</td>\
        //                 <td><span class="status{state}">{status}</span></td>\
        //                 <td>{time}</td>\
        //                 <td>{actions}</td>\
        //             </tr>';
        var tpl = '<tr data-id="{id}" id="form{id}"> \
            <td>{title}</td>\
            <td>{time}</td>\
            <td>{status}</td>\
            <td>{actions}</td>\
        </tr>';        
        //表单状态（0:草稿,1：启用,2:停用）
        // var status = ['草稿', '启用', '停用'];
        var status = ['未启用', '已启用'];

        var list = [];
        $(formList.data).each(function(i, form){
            var state = form.status;
            form.status = ( form.status == 1 ? '未启用' : '已启用');            
            var item = tpl.replace(/\{id\}/ig, form.id)
                        .replace('{title}', form.name)
                        // .replace('{version}', form.version)
                        // .replace('{state}', form.status)
                        .replace('{time}', form.updateTime)
                        .replace('{status}', form.status);

            var actions = '';
            if(state == 1){ //未启用可以编辑、删除、启用
                actions = '<a href="javascript:;" class="publish">启用</a> <a href="'+ WEB_URL +'form_design.html?id='+ form.id +'" class="edit">编辑</a> <a href="javascript:;" class="delete">删除</a>';
            }else if(state == 2){ //启用不可以做任何操作
                actions = '';
            }
            console.log(state);
                // actions = '<a href="javascript:;" class="stop-using">停用</a> <a href="javascript:;" class="create-new-version">创建新版本</a>';
            // }else if(state === 2){
            //     actions = '<a href="javascript:;" class="start-using">启用</a> <a href="javascript:;" class="create-new-version">创建新版本</a>';
            // }

            // actions = '<a href="javascript:;" class="publish">发布</a> <a href="'+ WEB_URL +'form_design.html?id='+ form.id +'" class="edit">编辑</a> <a href="javascript:;" class="delete">删除</a>';
            // actions = '<a href="'+ WEB_URL +'form_design.html?id='+ form.id +'" class="edit">编辑</a> <a href="javascript:;" class="delete">删除</a>';
            item = item.replace('{actions}', actions);
            list.push(item);
        })
        this.$formList.find('tbody').html(list.join(''));
    },
    stopUsing: function(e){
        var target = $(e.currentTarget);
        var id = target.parents('tr').data('id');
        var _this = this;
        
        // $.post('/form/enable_def/', {
        //     form_def_id: id,
        //     enabled: 0
        // }, function(r){
        //     // console.log(r);
        //     if(r.code === 200){
        //         App.success('停用成功');
        //         _this.getFormList();
        //     }else{
        //         App.fail('停用失败');
        //     }
        // }, 'json')
    },
    startUsing: function(e){
        var target = $(e.currentTarget);
        var id = target.parents('tr').data('id');
        var _this = this;
        
        // $.post('/form/enable_def/', {
        //     form_def_id: id,
        //     enabled: 1
        // }, function(r){
        //     // console.log(r);
        //     if(r.code === 200){
        //         App.success('启用成功');
        //         _this.getFormList();
        //     }else{
        //         App.fail('启用失败');
        //     }
        // }, 'json')
    },
    createNewVersion: function(e){
        var target = $(e.currentTarget);
        var id = target.parents('tr').data('id');
        var _this = this;
        
        // $.post('/form/create_new_version_def/', {
        //     form_def_id: id
        // }, function(r){
        //     // console.log(r);
        //     if(r.code === 200){
        //         App.success('创建新版本成功');
        //         _this.getFormList();
        //     }else{
        //         App.fail('创建新版本失败');
        //     }
        // }, 'json')
    },
    del: function(e){
        var target = $(e.currentTarget);
        var id = target.parents('tr').data('id');
        var _this = this;
        App.confirm({
            message: '确认删除表单吗？',
            callback: function(f){
                if(f){
                    // $.post('/form/del_def/', {
                    //     form_def_id: id
                    // }, function(r){
                    //     if(r.code === 200){
                    //         App.success('删除成功');
                    //         _this.getFormList();
                    //     }else{
                    //         App.fail('删除失败');
                    //     }
                    // }, 'json')
                    var manageForm = {
                        url: API.manageForm,
                        args: {
                            formId: id,
                            status: 0
                        },
                        success: function() {
                            App.success('删除成功');
                            _this.getFormList();
                        },
                        error: function() {
                            App.fail('删除失败');
                        }
                    };
                    Ajax(manageForm);
                }
            }
        })
    },
    publish: function(e){
        var target = $(e.currentTarget);
        var id = target.parents('tr').data('id');
        var _this = this;

        // $.post('/form/publish_def/', {
        //     form_def_id: id
        // }, function(r){
        //     // console.log(r);
        //     if(r.code === 200){
        //         App.success('发布成功');
        //         _this.getFormList();
        //     }else{
        //         App.fail('发布失败');
        //     }
        // }, 'json')
        App.confirm({
            message: '确认启用表单吗？',
            callback: function(f){
                if(f){
                    // $.post('/form/del_def/', {
                    //     form_def_id: id
                    // }, function(r){
                    //     if(r.code === 200){
                    //         App.success('删除成功');
                    //         _this.getFormList();
                    //     }else{
                    //         App.fail('删除失败');
                    //     }
                    // }, 'json')
                    var manageForm = {
                        url: API.manageForm,
                        args: {
                            formId: id,
                            status: 2
                        },
                        success: function() {
                            App.success('启用成功');
                            _this.getFormList();
                        },
                        error: function() {
                            App.fail('启用失败');
                        }
                    };
                    Ajax(manageForm);
                }
            }
        });
        
    }
}

//流程管理
App.Workflow.ManageFlow = function(){

}

//表单设计
App.Workflow.FormDesign = function(options){
    this.$el = options.el || $('#WorkflowView');
    this.formId = options.id || null;
    this.isEdit = !!this.formId;

    this.init();
}
App.Workflow.FormDesign.prototype = {
    init: function(){
        //初始化DOM
        this.controlList = new App.Workflow.ControlList();
        this.formContainer = new App.Workflow.Form();
        this.controlSetting = new App.Workflow.ControlSetting();

        this.$el.append(this.controlList.$el)
                .append(this.formContainer.$el)
                .append(this.controlSetting.$el);

        if(this.isEdit){
            this.getFormInfo();
        }

        this.bind();
        $(window).trigger('resize');
    },
    bind: function(){
        var _this = this;
        $('#submit').on('click', $.proxy(this.post, this));
        $(window).on('resize', function(){
            var height = $(window).height();
            var offset = _this.$el.offset();

            _this.$el.css('height', height - offset.top -25);
        })
    },
    //如果是编辑表单，则先获取表单数据
    getFormInfo: function(){
        var _this = this;
        // $.get('/form/get_def/', {
        //     form_def_id: this.formId
        // }, function(r){
        //     _this.formContainer.buildForm(r.ret);
        //     _this.controlSetting.buildForm(r.ret);
        // }, 'json')

        var objGetFormDetail = {
            url: API.getFormDetail,
            args: {
                formId: this.formId
            },
            success: function(res) {
                _this.formContainer.buildForm(res);
                _this.controlSetting.buildForm(res);
            }
        }
        Ajax(objGetFormDetail);
    },
    //提交数据
    post: function(){
        var data = this.controlSetting.getFormData();
        if(!data) return;
        data.item_list = this.formContainer.getData();
        if(!data.item_list) return;

        if(!this.isEdit){ //公司信息
            // data.domain_id = App.Config.companyId;
            // data.domain_name = App.Config.companyName;
            // data.org_id = App.Config.companyId;
            // data.org_name = App.Config.companyName;
        }
        console.log(data);
        if(this.isEdit){
            // 修改表单
            // $.post('/form/update_def/',{
            //     form_def_id: this.formId,
            //     form_def_data: JSON.stringify(data)
            // }, function(r){
            //     if(r.code === 200){
            //         App.success('修改成功');
            //         location.href = WEB_URL + 'manage/form/';
            //     }else{
            //         App.fail('修改失败');
            //     }
            // }, 'json')
            data.id = this.formId;
            var objmodifyForm = {
                url: API.modifyForm,
                args: data,
                success: function() {
                    App.success('修改成功');
                    location.href = WEB_URL + 'form_list.html';
                }
            };
            Ajax(objmodifyForm);
        }else{
            // $.post( API.createForm, {
            //     form_def_data: JSON.stringify(data)
            // }, function(r){
            //     if(r.code === 200){
            //         App.success('创建成功');
            //         location.href = WEB_URL + 'manage/form/';
            //     }else{
            //         App.fail('创建失败');
            //     }
            // },'json')
            // 创建表单
            var objCreateForm = {
                url: API.createForm,
                args: data,
                success: function(res) {
                        App.success('创建成功');
                        location.href = WEB_URL + 'form_list.html';
                    }
                }
                Ajax(objCreateForm);
            }
            
        }
    }


//控件列表
App.Workflow.ControlList = function(){
    this.init();
}
App.Workflow.ControlList.prototype = {
    init:function(){
        this.$el = $($('#formControlListTpl').html());

        this.bind();
    },
    bind: function(){
        var Event = $(document);

        this.$el.find('li').drag('start', function(e, d){

            var el = $('<div>');
            el.append($(this).html());
            el.addClass($(this).attr('class')).addClass('drag-el')
            el.appendTo($('body'));

            return el;
        }).drag(function(e, d){
            $(d.proxy).css({
                top: d.deltaY + (d.startY - $(d.proxy).height() / 4),
                left: d.deltaX + (d.startX - $(d.proxy).width() / 2)
            });

            Event.trigger('draging', {
                e: e,
                d: d
            })
        }).drag('end', function(e, d){
            $(d.proxy).remove();
        })
    }
}

//表单
App.Workflow.Form = function(){
    this.isActive = 0;
    this.sortingEl = null;
    this.widgets = {};
    this.init();
}
App.Workflow.Form.prototype = {
    init:function(){
        this.$el = $($('#formContainerTpl').html());

        this.placeholder = $('<div class="placeholder"></div>');

        this.bind();
        $(window).trigger('resize');
    },
    bind: function(){
        var _this = this;
        var Event = $(document);

        $(window).on('resize', function(){
            var maxHeight = 550;
            var height = $(window).height();
            var offset = _this.$el.find('.form-container').offset();
            _this.$el.find('.form-container').css('height', Math.min(height - offset.top - 25, maxHeight));
        })

        //鼠标放开时
        $(document).on('drop', '#formContainer, .widget-table', $.proxy(this.onDrop, this));
        //进入
        $(document).on('dropstart', '#formContainer, .widget-table', $.proxy(this.onDropStart, this));
        //离开
        $(document).on('dropend', '#formContainer, .widget-table', $.proxy(this.onDropEnd, this));

        // //表格或组也可以拖放
        // $(document).on('drop', '', function(e, d){
        //     console.log(e, d);
        //     e.stopImmediatePropagation();
        // })
        // $(document).on('dropstart', '.widget-table', function(e, d){
        //     console.log(e, d);
        //     e.stopImmediatePropagation();
        // })
        // $(document).on('dropend', '.widget-table', function(e, d){
        //     console.log(e, d);
        //     e.stopImmediatePropagation();
        // })

        //正在拖放
        Event.on('draging', $.proxy(this.onDrag, this));

        //控件效果
        this.$el.on('click', '.form-widget', function(e){
            var timestamp = $(this).data('timestamp');
            var widget = _this.widgets[timestamp];

            _this.$el.find('.form-widget').removeClass('active');
            $(this).addClass('active');

            var isChild = false;
            if($(this).parent().hasClass('widget-group')) isChild = true; //如果是表格子项

            Event.trigger('widget.change',{
                type: widget.type,
                setting: widget.setting,
                isChild: isChild
            });
            e.stopImmediatePropagation();
        }).on('mouseover', '.form-widget', function(e){
            if(_this.isActive) return; //拖放时，不显示效果
            $(this).addClass('hover');
            e.stopImmediatePropagation();
        }).on('mouseout', '.form-widget', function(e){
            $(this).removeClass('hover');
            e.stopImmediatePropagation();
        }).on('click', '.remove', function(e){
            var parent = $(this).parent();
            var timestamp = parent.data('timestamp');
            _this.widgets[timestamp].setting.remove();
            _this.widgets[timestamp] = null;
            delete _this.widgets[timestamp];
            parent.remove();
            Event.trigger('widget.remove');
            e.stopImmediatePropagation();
        })
        $(document).on('click', '.icon-remove-widget', function() {
            var parent = $(this).parent();
            var timestamp = parent.data('timestamp');
            _this.widgets[timestamp].setting.remove();
            _this.widgets[timestamp] = null;
            delete _this.widgets[timestamp];
            parent.remove();
            Event.trigger('widget.remove');
            e.stopImmediatePropagation();
        });
        //拖动排序
        this.$el.on('dragstart', '.form-widget', function(e, d){
            _this.sortingEl = $(this);
            _this.sortingEl.css({
                opacity: 0.5
            })

            var el = $('<div>');
            el.append($(this).data('text'));
            el.addClass( 'control-' + $(this).data('type') ).addClass('drag-el')
            el.appendTo($('body'));

            return el;
        }).on('drag', '.form-widget', function(e, d){
            $(d.proxy).css({
                top: d.deltaY + (d.startY - $(d.proxy).height() / 4),
                left: d.deltaX + (d.startX - $(d.proxy).width() / 2)
            });

            Event.trigger('draging', {
                e: e,
                d: d
            })
        }).on('dragend', '.form-widget', function(e, d){
            _this.sortingEl.css({
                opacity: 1
            })
            _this.sortingEl = null;
            $(d.proxy).remove();
        })

        $.drop({multi: true, mode: 'middle'}); //能够多选
    },
    onDrag: function(e, data){
        this.$el.find('.form-widget').removeClass('active');

        // console.log(data.d)
        var dropEl = data.d.drop[data.d.drop.length - 1]; //bugfix drop事件在live模式下，dd.drop异常
        // console.log(dropEl)
        var dropEl = $(dropEl).hasClass('form-widget') ? $(dropEl).find('.widget-group') : this.$el.find('.form-container'); //在哪个范围内
        if(this.isActive){
            //获取最近的元素，插入占位符
            var closestEl = this.getClosestEl(data.d, dropEl);
            // console.log(closestEl, dropEl);

            if(dropEl.find('.form-widget').length === 0) dropEl.find('.empty-tip').hide();

            if(closestEl){
                if(closestEl.prev().hasClass('placeholder')) return; //不要频繁更新DOM
                closestEl.before(this.placeholder.show());
            }else{
                if(dropEl.children().last().hasClass('placeholder')) return; //不要频繁更新DOM
                dropEl.append(this.placeholder.show());
            }
        }
    },
    onDrop: function(e, d){
        var type = $(d.drag).data('type'); //当前拖放的控件类型
        if(!type){
            var timestamp = this.sortingEl.data('timestamp');
            type = this.widgets[timestamp].type;
        }
        // var closestEl = this.getClosestEl(d); //当前放下的最接近的el
        // console.log(this.isActive)
        if(!this.isActive) return;  // bugfix 只有在拖放容器里，才有效，并且只生效一次。
                                    // 因为drop的相关事件在live模式下会触发多次。


        if(this.placeholder.is(':hidden')) return; //如果placeholder还没插入进去
        // console.log(this.placeholder.parent())
        if(this.placeholder.parent().hasClass('widget-group') && type === 'table') return; //表格不能嵌套表格

        if(this.sortingEl){ //如果只是排序
            // if(closestEl){
            //     closestEl.before(this.sortingEl);
            // }else{
            //     this.$el.append(this.sortingEl);
            // }
            this.placeholder.replaceWith(this.sortingEl);

            this.sortingEl.trigger('click');
        }else{ //新添加控件
            var widget = App.Workflow.Form[type]();
            var timestamp = new Date().getTime();
            widget.form.data('timestamp', timestamp);
            this.widgets[timestamp] = widget;

            // if(closestEl){
            //     closestEl.before(widget.form);
            // }else{
            //     this.$el.append(widget.form);
            // }
            this.placeholder.replaceWith(widget.form);

            widget.form.trigger('click');
        }

        this.isActive = 0;
    },
    onDropStart: function(e, d){
        // console.log(1111, e, d)
        this.isActive++;
        // console.log('start', this.isActive)
    },
    onDropEnd: function(e, d){
        // console.log('end', this.isActive)
        if(this.isActive > 0)
            this.isActive--;
        if(!this.isActive)
            this.placeholder.hide().remove();
    },
    getClosestEl: function(d, dropEl){ //获取最接近的元素
        // if(d.drop.length === 2){
        //     var els = $(d.drop[1]).find('.form-widget');
        // }else{
        //     var els = this.$el.find('.form-widget');
        // }
        var els = dropEl.find('.form-widget');

        if(!els.length) return null;
        var result = null;
        els.each(function(){
            var el = $(this);
            var height = el.height();
            var offset = el.offset();
            if(d.offsetY + $(d.proxy).height() / 2 < offset.top + height / 2){
                result = el;
                return false;
            }
        })
        return result;
    },
    buildForm: function(formInfo){
        // 表单名称
        var name = formInfo.name || '';
        // 表单介绍
        var intro = formInfo.intro || '';
        // var widgetList = formInfo.item_list;
        var widgetList = formInfo.data;

        for(var i = 0, len = widgetList.length; i < len; i++){
            var type = getType(widgetList[i].type);
            var widget = App.Workflow.Form[type](widgetList[i]);
            var timestamp = new Date().getTime();
            widget.form.data('timestamp', timestamp);
            widget.itemId = widgetList[i].item_id;
            this.widgets[timestamp] = widget;

            this.$el.find('.form-container').append(widget.form);

            if(type === 'table'){ //如果是表格，构建表格下的数据
                var table = widget;
                var childList = widgetList[i].child_list;
                var cLen = childList.length;
                if(cLen !== 0) table.form.find('.widget-group').empty();
                for(var j = 0; j < cLen; j++){
                    var type = getType(childList[j].type);
                    var widget = App.Workflow.Form[type](childList[j]);
                    var timestamp = new Date().getTime();
                    widget.form.data('timestamp', timestamp);
                    widget.itemId = childList[j].item_id;
                    this.widgets[timestamp] = widget;

                    //表格属性
                    var tableAttribute = $('#table-attribute').html();
                    if(!$(widget.setting).find('.table-attribute')[0]){
                        $(widget.setting).append(tableAttribute);
                    }
                    if(type !== 'money'){
                        $(widget.setting).find('[name="sum"]').parent().remove();
                    }
                    $(widget.setting).find('[name="key"]').prop('checked', !!childList[j].key_column)
                    $(widget.setting).find('[name="sum"]').prop('checked', !!childList[j].sum)

                    table.form.find('.widget-group').append(widget.form);
                }
            }
        }

        function getType(typeId){
            var type;
            $.each(App.Workflow.Form.type, function(key, value){
                if(typeId == value){
                    type = key;
                    return false;
                }
            })
            return type;
        }
    },
    //验证数据
    // validate: function(){
    //     var flag = true;
    //     //TODO 验证
    //     return flag;
    // },
    //获取表单数据，包括控件类型、设置等
    getData: function(){
        var _this = this;
        // if(!this.validate()) return;

        var formData = [];
        var flag = true;

        // 遍历组件，获取数据
        this.$el.find('.form-container >.form-widget').each(function(){
            var timestamp = $(this).data('timestamp');
            var widget = _this.widgets[timestamp];
            var data = widget.parseData();
            if(widget.setting.find('.error')[0]){
                flag = false;
                widget.form.trigger('click');
            }

            if(widget.itemId){
                data.item_id = widget.itemId;
            }

            if(widget.type === 'table'){
                var children = []
                $(this).find('.form-widget').each(function(){
                    var timestamp = $(this).data('timestamp');
                    var widget = _this.widgets[timestamp];

                    if(widget.setting.find('.error')[0]){
                        flag = false;
                        widget.form.trigger('click');
                        return false;
                    }

                    if(widget.itemId) data.item_id = widget.itemId;
                    children.push(widget.parseData());
                })
                data.child_list = children;
            }

            if(!flag){
                return false;
            }
            formData.push(data);
        })

        // console.log(formData);
        return flag && formData;
    }
}

//控件设置
App.Workflow.ControlSetting = function(){
    this.init();
    this.tableAttribute = $('#table-attribute').html();
}
App.Workflow.ControlSetting.prototype = {
    init:function(){
        this.$el = $($('#formControlSettingTpl').html());

        this.bind();
    },
    bind: function(){
        var _this = this;
        var Event = $(document);

        Event.on('widget.change', $.proxy(this.onChange, this));
        Event.on('widget.remove', $.proxy(this.onRemove, this));

        this.$el.on('click', '.setting-tab li', function(e){
            var index = $(e.currentTarget).index();
            _this.switchTab(index);
        })


        var inputs = this.$el.find('#formSettingItem [data-type]');
        inputs.each(function(i, input){
            input = $(input)
            var maxLength = parseInt(input.data('maxlength'));
            input.on('keyup', function(){
                var val = $.trim($(this).val());
                if(val.replace(zhReg,'**').length > maxLength * 2){
                    $(this).parents('.setting-field').addClass('error');
                }else{
                    $(this).parents('.setting-field').removeClass('error');
                }
            }).on('blur', function(){
                $(this).trigger('keyup');
            })
        })
    },
    onChange: function(e, data){
        var type = data.type;
        var setting = data.setting;
        var isChild = data.isChild;
        var el = this.$el.find('#controlSettingItem');
        el.find('.widget-setting').hide();
        if(el.has(setting)[0]){
            $(setting).show();
        }else{
            el.append(setting);
        }
        if(isChild){
            if(!$(setting).find('.table-attribute')[0]){
                $(setting).append(this.tableAttribute);
            }

            if(type !== 'money'){
                $(setting).find('[name="sum"]').parent().remove();
            }
        }else{
            $(setting).find('.table-attribute').remove();
        }

        this.switchTab(0);

        //TODO 动态属性验证
    },
    onRemove: function(){
        this.switchTab(1);
    },
    switchTab: function(index){
        var tabs = this.$el.find('.setting-tab li');
        var items = this.$el.find('.tab-item');
        tabs.removeClass('active');
        items.hide();

        tabs.eq(index).addClass('active');
        items.eq(index).show();
    },
    buildForm: function(formInfo){
        this.$el.find('[name="name"]').val(formInfo.name);
        this.$el.find('[name="intro"]').val(formInfo.intro);
    },
    getFormData: function(){
        if(this.$el.find('#formSettingItem [name="name"]').val() === ''){
            this.switchTab(1);
            App.fail('请填写表单名称');
            return false;
        }else if(this.$el.find('#formSettingItem .error')[0]){
            this.switchTab(1);
            return false;
        }else{
            return {
                name: this.$el.find('[name="name"]').val(),
                intro: this.$el.find('[name="intro"]').val()
            }
        }
    }
}


App.Workflow.Form.type = { //对应数据库类型
    'text': 1,
    'textarea': 2,
    'mobile': 3,
    'email': 4,
    'phone': 5,
    'number': 6,
    'money': 7,
    'radio': 8,
    'checkbox': 9,
    'date': 10,
    'daterange': 11,
    'image': 12,
    'file': 13,
    'person': 14,
    'department': 16,
    'tree': 18,
    'description': 19,
    'table': 20,
    'separator': 21,
    'position': 22,
    // 申请人科室
    'dep': 23
}
//表单控件
// App.Workflow.Form['text']
// App.Workflow.Form['textarea']
// App.Workflow.Form['mobile']
// App.Workflow.Form['email']
// App.Workflow.Form['phone']
// App.Workflow.Form['number']
// App.Workflow.Form['money']

// App.Workflow.Form['image']
// App.Workflow.Form['file']
// App.Workflow.Form['person']
// App.Workflow.Form['department']

// App.Workflow.Form['position']
jQuery.each(['dep' ,'text', 'textarea', 'mobile', 'email', 'phone', 'number', 'money', 'image', 'file', 'person', 'department', 'position'], function(i, type){
    App.Workflow.Form[type] = function(data){
        var widget = {
            type: type
        };

        //表单DOM
        widget.form = $($('#'+ type +'-form').html());
        //属性DOM
        widget.setting = $($('#'+ type +'-setting').html());
        //格式化表单属性
        widget.parseData = function(){
            var data = {
                type: App.Workflow.Form.type[type],
                title: widget.setting.find('[name="title"]').val(),
                tooltip: widget.setting.find('[name="placeholder"]').val(),
                required: widget.setting.find('[name="require"]').prop('checked') ? 1 : 0
            }
            //单行输入框、多行输入框
            if(widget.setting.find('[name="length"]')[0]){
                data.length = widget.setting.find('[name="length"]').val() * 1;
            }

            //数字输入框
            if(widget.setting.find('[name="number_type"]')[0]){
                data.number_type = widget.setting.find('[name="number_type"]:checked').val() * 1;
                data.max = widget.setting.find('[name="max"]').val();
                data.min = widget.setting.find('[name="min"]').val();
                data.precis = widget.setting.find('[name="precision"]').val() * 1;
            }

            //金额输入框
            if(widget.setting.find('[name="capital"]')[0]){
                data.capital = widget.setting.find('[name="capital"]').prop('checked') ? 1 : 0;
                data.max = widget.setting.find('[name="max"]').val();
                data.min = widget.setting.find('[name="min"]').val();
                data.precis = widget.setting.find('[name="precision"]').val() * 1;
            }

            //表格属性
            if(widget.setting.find('[name="sum"]')[0]){
                data.sum = widget.setting.find('[name="sum"]').prop('checked') ? 1 : 0;
            }
            if(widget.setting.find('[name="key"]')[0]){
                data.key_column = widget.setting.find('[name="key"]').prop('checked') ? 1 : 0;
            }

            return data;
        }
        //属性验证、表单绑定
        App.Workflow.WidgetBind.init(widget);

        if(data){ //编辑模式下，需要预先输入值
            widget.setting.find('[name="title"]').val(data.title);
            widget.setting.find('[name="placeholder"]').val(data.tooltip);
            widget.setting.find('[name="length"]').val(data.length);
            widget.setting.find('[name="max"]').val(data.max);
            widget.setting.find('[name="min"]').val(data.min);
            widget.setting.find('[name="precision"]').val(data.precis);

            widget.setting.find('[name="require"]').prop('checked', !!data.required);
            widget.setting.find('[name="number_type"][value="'+ data.number_type +'"]').prop('checked', true);
            widget.setting.find('[name="capital"]').prop('checked', !!data.capital);
            widget.setting.find('[name="sum"]').prop('checked', !!data.sum);
            widget.setting.find('[name="key_column"]').prop('checked', !!data.key_column);

            widget.setting.find('input:text').trigger('blur');
            widget.setting.find('input:radio, input:checkbox').trigger('change');
        }

        return widget;
    }
})

// App.Workflow.Form['radio']
// App.Workflow.Form['checkbox']

jQuery.each(['radio', 'checkbox'], function(i, type){
    App.Workflow.Form[type] = function(data){
        var widget = {
            type: type
        };

        //表单DOM
        widget.form = $($('#'+ type +'-form').html());
        //属性DOM
        widget.setting = $($('#'+ type +'-setting').html());
        //格式化表单属性
        widget.parseData = function(){
            var data = {
                type: App.Workflow.Form.type[type],
                title: widget.setting.find('[name="title"]').val(),
                tooltip: widget.setting.find('[name="placeholder"]').val(),
                required: widget.setting.find('[name="require"]').prop('checked') ? 1 : 0
            }

            //选项
            var selectList = widget.setting.find('.select-list');
            var list = []
            selectList.find('input').each(function(i, v){
                list.push({
                    name: $(v).val()
                })
            })
            data.option_list = list;

            //表格属性
            if(widget.setting.find('[name="sum"]')[0]){
                data.sum = widget.setting.find('[name="sum"]').prop('checked') ? 1 : 0;
            }
            if(widget.setting.find('[name="key"]')[0]){
                data.key_column = widget.setting.find('[name="key"]').prop('checked') ? 1 : 0;
            }

            return data;
        }
        //属性验证、表单绑定
        App.Workflow.WidgetBind.init(widget);

        //新增选择框
        var selectList = widget.setting.find('.select-list');
        selectList.on('click', '.remove', function(){
            if($(this).hasClass('disabled')) return;
            selectList.find('.add').removeClass('disabled');

            $(this).parents('.list-item').remove();

            if(selectList.find('.list-item').length === 1){
                selectList.find('.remove').addClass('disabled');
            }
        }).on('click', '.add', function(){
            if($(this).hasClass('disabled')) return;
            selectList.find('.remove').removeClass('disabled');

            var item = $(this).parents('.list-item');
            var newItem = item.clone();
            for(var i = 1; i <= 200; i++){
                if(!hasValue(i)){
                    newItem.find('input').val('选项' + i);
                    break;
                }
            }
            item.after(newItem);

            if(selectList.find('.list-item').length === 200){
                selectList.find('.add').addClass('disabled')
            }
        })
        function hasValue(i){
            var flag = false;
            var options = selectList.find('input');
            options.each(function(){
                if($(this).val() === '选项' + i){
                    flag = true;
                    return false;
                }
            })
            return flag;
        }


        if(data){ //编辑模式下，需要预先输入值
            widget.setting.find('[name="title"]').val(data.title);
            widget.setting.find('[name="placeholder"]').val(data.tooltip);

            widget.setting.find('[name="require"]').prop('checked', !!data.required);
            widget.setting.find('[name="sum"]').prop('checked', !!data.sum);
            widget.setting.find('[name="key_column"]').prop('checked', !!data.key_column);

            widget.setting.find('input:text').trigger('blur');
            widget.setting.find('input:radio, input:checkbox').trigger('change');

            $.each(data.option_list, function(i, option){ //选项
                if(widget.setting.find('.list-item').length <= i){
                    var item = widget.setting.find('.list-item:last');
                    var newItem = item.clone();
                    newItem.find('input').val(option.name);
                    item.after(newItem)
                }else{
                    widget.setting.find('.list-item:eq('+ i +')').find('input').val(option.name);
                }
            })
        }


        return widget;
    }
})

// App.Workflow.Form['date']
// App.Workflow.Form['daterange']
jQuery.each(['date', 'daterange'], function(i, type){
    App.Workflow.Form[type] = function(data){
        var widget = {
            type: type
        };

        //表单DOM
        widget.form = $($('#'+ type +'-form').html());
        //属性DOM
        widget.setting = $($('#'+ type +'-setting').html());
        //格式化表单属性
        widget.parseData = function(){
            var data = {
                type: App.Workflow.Form.type[type],
                title: widget.setting.find('[name="title"]').val(),
                tooltip: widget.setting.find('[name="placeholder"]').val(),
                required: widget.setting.find('[name="require"]').prop('checked') ? 1 : 0
            }

            if(widget.setting.find('[name="sub_title"]')[0]){
                data.sub_title = widget.setting.find('[name="sub_title"]').val();
            }

            if(widget.setting.find('[name="date_type"]')[0]){
                data.date_type = widget.setting.find('[name="date_type"]:checked').val() * 1;
            }

            //时间范围
            data.min = widget.setting.find('.min-date input').val(),
            data.max = widget.setting.find('.max-date input').val();

            //表格属性
            if(widget.setting.find('[name="sum"]')[0]){
                data.sum = widget.setting.find('[name="sum"]').prop('checked') ? 1 : 0;
            }
            if(widget.setting.find('[name="key"]')[0]){
                data.key_column = widget.setting.find('[name="key"]').prop('checked') ? 1 : 0;
            }

            return data;
        }
        //属性验证、表单绑定
        App.Workflow.WidgetBind.init(widget);

        //日期控件
        var minDateField = widget.setting.find('.min-date'),
            maxDateField = widget.setting.find('.max-date');

        var now = new Date();
        var timestamp = now.getTime();
        minDateField.find('input').attr('id', 'min' + timestamp).val(now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate());
        maxDateField.find('input').attr('id', 'max' + timestamp).val((now.getFullYear() + 1) + '-' + (now.getMonth() + 1) + '-' + now.getDate());

        minDateField.on('focus', 'input', function(){
            var dateFmt = 'yyyy-MM-dd';
            // if(widget.setting.find('[name="date_type"]')[0] && 
            //     widget.setting.find('[name="date_type"]:checked').val() == 1){
            //     dateFmt = 'yyyy-MM-dd HH:mm';
            // }
            WdatePicker({dateFmt: dateFmt, maxDate:'#F{$dp.$D(\'max'+ timestamp +'\', {d: -1})}'});
        }).on('click', '.show-calendar', function(){
            minDateField.find('input').focus();
        })

        maxDateField.on('focus', 'input', function(){
            var dateFmt = 'yyyy-MM-dd';
            // if(widget.setting.find('[name="date_type"]')[0] && widget.setting.find('[name="date_type"]:checked').val() == 1){
            //     dateFmt = 'yyyy-MM-dd HH:mm';
            // }
            WdatePicker({dateFmt: dateFmt, minDate:'#F{$dp.$D(\'min'+ timestamp +'\', {d: 1})}'});
        }).on('click', '.show-calendar', function(){
            maxDateField.find('input').focus();
        })

        if(data){ //编辑模式下，需要预先输入值
            widget.setting.find('[name="title"]').val(data.title);
            widget.setting.find('[name="sub_title"]').val(data.sub_title);
            widget.setting.find('[name="placeholder"]').val(data.tooltip);
            widget.setting.find('[name="max"]').val(data.max);
            widget.setting.find('[name="min"]').val(data.min);

            widget.setting.find('[name="require"]').prop('checked', !!data.required);
            widget.setting.find('[name="date_type"][value="'+ data.date_type +'"]').prop('checked', true);
            widget.setting.find('[name="sum"]').prop('checked', !!data.sum);
            widget.setting.find('[name="key_column"]').prop('checked', !!data.key_column);

            widget.setting.find('input:text').trigger('blur');
            widget.setting.find('input:radio, input:checkbox').trigger('change');
        }

        return widget;
    }
})

// App.Workflow.Form['tree']
App.Workflow.Form['tree'] = function(data){
    var type = 'tree'
    var widget = {
        type: type
    };

    //表单DOM
    widget.form = $($('#'+ type +'-form').html());
    //属性DOM
    widget.setting = $($('#'+ type +'-setting').html());
    //格式化表单属性
    widget.parseData = function(){
        var data = {
            type: App.Workflow.Form.type[type],
            title: widget.setting.find('[name="title"]').val(),
            tooltip: widget.setting.find('[name="placeholder"]').val(),
            required: widget.setting.find('[name="require"]').prop('checked') ? 1 : 0
        }

        //节点数据
        data.option_list = parseTreeNode();

        //表格属性
        if(widget.setting.find('[name="sum"]')[0]){
            data.sum = widget.setting.find('[name="sum"]').prop('checked') ? 1 : 0;
        }
        if(widget.setting.find('[name="key"]')[0]){
            data.key_column = widget.setting.find('[name="key"]').prop('checked') ? 1 : 0;
        }

        return data;
    }
    //格式化节点数据
    function parseTreeNode(treeNode){
        // console.log(treeNode)
        if(!treeNode){
            var nodes = tree.getNodesByParam('level', 0);
        }else{
            var nodes = treeNode.child;
        }
        var data = [];

        for(var i = 0, len = nodes.length; i < len; i++){
            if(nodes[i].child){
                data.push({
                    name: nodes[i].name,
                    child: parseTreeNode(nodes[i])
                })
            }else{
                data.push({
                    name: nodes[i].name
                })
            }
        }
        return data;
    }    

    //属性验证、表单绑定
    App.Workflow.WidgetBind.init(widget);

    //树形操作
    var treeSelect = widget.setting.find('.tree-select');
    var treeObj = treeSelect.find('ul')

    //初始化tree
    var setting = {
        view: {
            autoCancelSelected:false, //是否支持ctrl反选
            dblClickExpand:false, //是否双击打开
            selectedMulti:false, //是否支持多选
            showIcon: false //是否显示节点图标
        },
        data: {
            keep:{
                leaf:false,
                parent:false
            },
            key:{
                children: 'child'
            }
        },
        edit: {
            enable: true,
            // drag: {
            //     isCopy: false,
            //     isMove: true
            // },
            editNameSelectAll: true,
            showRemoveBtn: false,
            showRenameBtn: false
        },
        async:{
            enable : false //是否开启异步加载
        },
        callback:{
        }
    };
    var treeNode = data ? data.option_list : [{
        id: 1,
        name: '树形选择',
        open: true,
        isParent: true
    }]
    // console.log(treeNode)
    var tree = $.fn.zTree.init(treeObj, setting, treeNode);
    var index = 1;
    //操作
    treeSelect.on('click', '.add',  function(e){
        e.stopImmediatePropagation();

        //添加节点
        var nodes = tree.getSelectedNodes();
        var treeNode = nodes[0] || null;

        //最多3层节点
        if(treeNode && treeNode.level >= 2){
            App.fail('最多3层节点');
            return;
        }

        var newNode = tree.addNodes(treeNode, {
            id: 10000 + index,
            pId: treeNode ? treeNode.id : 0,
            name: "新节点" + (index++)
        });

        tree.editName(newNode[0]);
    }).on('click', '.remove', function(e){
        e.stopImmediatePropagation();

        //删除节点
        var nodes = tree.getSelectedNodes();
        var treeNode = nodes[0];
        if (nodes.length == 0) return;
        tree.removeNode(treeNode, false);
    }).on('click', '.edit', function(e){
        e.stopImmediatePropagation();

        //编辑节点
        var nodes = tree.getSelectedNodes();
        var treeNode = nodes[0];
        if(nodes.length == 0) return;
        tree.editName(treeNode);
    }).on('click','.switch, a', function(e){
        e.stopImmediatePropagation();
    }).on('click', function(){
        //取消选中节点
        tree.cancelSelectedNode();
    })

    if(data){ //编辑模式下，需要预先输入值
        widget.setting.find('[name="title"]').val(data.title);
        widget.setting.find('[name="placeholder"]').val(data.tooltip);

        widget.setting.find('[name="require"]').prop('checked', !!data.required);
        widget.setting.find('[name="sum"]').prop('checked', !!data.sum);
        widget.setting.find('[name="key_column"]').prop('checked', !!data.key_column);

        widget.setting.find('input:text').trigger('blur');
        widget.setting.find('input:radio, input:checkbox').trigger('change');
    }

    return widget;
}

// App.Workflow.Form['description']
App.Workflow.Form['description'] = function(data){
    var type = 'description'
    var widget = {
        type: type
    };

    //表单DOM
    widget.form = $($('#'+ type +'-form').html());
    //属性DOM
    widget.setting = $($('#'+ type +'-setting').html());
    //格式化表单属性
    widget.parseData = function(){
        var data = {
            type: App.Workflow.Form.type[type],
            note: widget.setting.find('[name="note"]').val()
        }

        return data;
    }

    //属性验证、表单绑定
    App.Workflow.WidgetBind.init(widget);

    if(data){ //编辑模式下，需要预先输入值
        widget.setting.find('[name="note"]').val(data.note);
        widget.setting.find('textarea').trigger('blur');
    }

    return widget;
}

// App.Workflow.Form['table']
App.Workflow.Form['table'] = function(data){
    var type = 'table'
    var widget = {
        type: type
    };

    //表单DOM
    widget.form = $($('#'+ type +'-form').html());
    //属性DOM
    widget.setting = $($('#'+ type +'-setting').html());
    //格式化表单属性
    widget.parseData = function(){
        var data = {
            type: App.Workflow.Form.type[type],
            title: widget.setting.find('[name="title"]').val()
        }

        return data;
    }

    //属性验证、表单绑定
    App.Workflow.WidgetBind.init(widget);

    if(data){ //编辑模式下，需要预先输入值
        widget.setting.find('[name="title"]').val(data.title);
        widget.setting.find('input:text').trigger('blur');
    }

    return widget;
}
// App.Workflow.Form['separator'] //TODO
// App.Workflow.Form['group'] //TODO
// App.Workflow.Form['sign'] //TODO

App.Workflow.WidgetBind = {
    init: function(widget){
        var _this = this;
        this.widget = widget;
        var inputs = widget.setting.find('[data-type]');
        inputs.each(function(i, input){
            var type = $(input).data('type');
            _this[type](input);
        })
    },
    text: function(input){
        var _this = this;
        var widget = this.widget;
        var input = $(input);
        var maxLength = parseInt(input.data('maxlength'));
        var target = input.data('target');

        target = (widget.form || widget.display).find('.' + target);


        input.on('keyup', function(){
            var val = $.trim($(this).val());
            if(val.replace(zhReg,'**').length > maxLength * 2){
                $(this).parents('.setting-field, .node-setting-field').addClass('error');
            }else{
                $(this).parents('.setting-field, .node-setting-field').removeClass('error');
                target.html(val.replace(/\n/ig,'</br>'));
            }
        }).on('blur', function(){
            $(this).trigger('keyup');
        })
    },
    require: function(input){
        var _this = this;
        var widget = this.widget;
        var input = $(input);
        var target = input.data('target');

        target = (widget.form || widget.display).find('.' + target);

        input.on('change', function(){
            if($(this).prop('checked')){
                target.show();
            }else{
                target.hide();
            }
        })
    },
    number: function(input){
        var _this = this;
        var widget = this.widget;
        var input = $(input);

        input.on('blur', function(){
            var val = $.trim($(this).val());
            if($.isNumeric(val) && val * 1 >= 0){
                $(this).parents('.setting-field, .node-setting-field').removeClass('error');
            }else{
                $(this).parents('.setting-field, .node-setting-field').addClass('error');
            }
        })
    },
    capital: function(input){
        var _this = this;
        var widget = this.widget;
        var input = $(input);
        var target = input.data('target');

        target = (widget.form || widget.display).find('.' + target);

        input.on('change', function(){
            if($(this).prop('checked')){
                target.show();
            }else{
                target.hide();
            }
        })
    }
}

//流程
App.Workflow.FlowDesign = function(options){
    this.$el = options.el || $('#FlowDesignView');
    this.flowId = options.id || null;
    this.formId = options.formId;
    this.flowInfo = options.flowInfo || null;
    this.isEdit = !!this.flowId;

    this.init();
}
App.Workflow.FlowDesign.prototype = {
    init: function(){
        //初始化DOM
        this.controlList = new App.Workflow.FlowControl();
        this.controlSetting = new App.Workflow.FlowSetting();

        this.$el.append(this.controlList.$el)
                .append('<div class="flow-node-area" id="flowNodeArea"> \
                        <span class="action-handle switch-handle" id="switchHandle" style="display: none;"></span> \
                        <span class="action-handle remove-handle" id="removeHandle" style="display: none;"></span> \
                    </div>')
                .append(this.controlSetting.$el);

        this.flowContainer = new App.Workflow.Flow({
            formId: this.formId,
            flowInfo: this.flowInfo
        });
        this.$el.find("#flowNodeArea").append(this.flowContainer.$el);

        this.bind();
        $(window).trigger('resize');
    },
    bind: function(){
        var _this = this;
        this.$el.find('#submit').on('click', $.proxy(this.post, this));

        $(window).on('resize', function(){
            var height = $(window).height();
            var offset = _this.$el.offset();

            _this.$el.css('height', height - offset.top -25);
        })
    },
    //提交数据
    post: function(){
        var data = this.controlSetting.getData();
        data.node_map = this.flowContainer.getData();
        data.form_def_no = this.formId;
        data.tag = '';
        data.creator_id = App.Config.accountId;
        data.company_id = App.Config.companyId;
        console.log(data);

        // $.post('/api/workflow/definition/create/', {
        //     workflow_def: JSON.stringify(data)
        // }, function(r){
        //     console.log(r)
        //     // if(r.code === 200){
        //     //     App.success('创建成功');
        //     // }else{
        //     //     App.fail('创建失败');
        //     // }
        // },'json')
    }
}

App.Workflow.FlowControl = function(){
    this.init();
}
App.Workflow.FlowControl.prototype = {
    init: function(){
        this.$el = $($('#flowControlListTpl').html());

        this.bind();
    },
    bind: function(){
        var Event = $(document);

        this.$el.find('li:not(".control-disabled")').drag('start', function(e, d){

            var el = $('<div>');
            el.append($(this).html());
            el.addClass($(this).attr('class')).addClass('drag-el')
            el.appendTo($('body'));

            return el;
        }).drag(function(e, d){
            $(d.proxy).css({
                top: d.deltaY + (d.startY - $(d.proxy).height() / 4),
                left: d.deltaX + (d.startX - $(d.proxy).width() / 2)
            });

            Event.trigger('draging', {
                e: e,
                d: d
            })
        }).drag('end', function(e, d){
            $(d.proxy).remove();
        })
    }
}

App.Workflow.Flow = function(options){
    this.isActive = 0;
    this.nodes = {};
    this.flowId = options && options.flowId;
    this.formId = options.formId;
    this.flowInfo = options.flowInfo;
    this.isSubFlow = !!this.flowId;
    this.index = this.isSubFlow ? this.flowId : 1;
    this.init();
}
App.Workflow.Flow.prototype = {
    init: function(){
        this.$el = $($('#flowContainerTpl').html());
        this.getFormData();
        // this.initNode();
        this.bind();
        $(window).trigger('resize');
    },
    bind: function(){
        var _this = this;
        var Event = $(document);

        $(window).on('resize', function(){
            var maxHeight = 550;
            var height = $(window).height();
            var offset = _this.$el.offset();
            _this.$el.css('height', Math.min(height - offset.top - 25, maxHeight));
        })

        this.$el.on('drop', '.node-arrow', $.proxy(this.onDrop, this));
        this.$el.on('dropstart', '.node-arrow', $.proxy(this.onDropStart, this));
        this.$el.on('dropend', '.node-arrow', $.proxy(this.onDropEnd, this));

        Event.on('draging', $.proxy(this.onDrag, this));

        this.$el.on('click', '.flow-node', function(e){
            if( !$(this).hasClass('node-normal') && !$(this).hasClass('node-subflow') ) return;

            var timestamp = $(this).data('timestamp');
            var node = _this.nodes[timestamp];

            _this.$el.find('.flow-node').removeClass('active');
            $(this).addClass('active');

            Event.trigger('node.change',{
                type: node.type,
                setting: node.setting
            });
            e.stopImmediatePropagation();
        }).on('mouseover', '.flow-node:not(.node-arrow-normal, .node-begin, .node-end), .flow-node-group', function(e){
            // if(_this.isActive) return;
            var offset = $(this).offset();
            var parentOffset = $('#flowNodeArea').offset();
            if($(this).hasClass('node-arrow')){
                $('#removeHandle').hide();
                $('#switchHandle').css('top',offset.top - parentOffset.top).show();
            }else if($(this).hasClass('flow-node-group')){
            }else{
                $('#removeHandle').css('top',offset.top - parentOffset.top).show();
                $('#removeHandle').css('left', $(this).width() + 36);
            }
            $(this).addClass('hover');
            // e.stopImmediatePropagation();
        }).on('mouseout', '.flow-node, .flow-node-group', function(e){
            var toElement = $(e.toElement);
            if(toElement.hasClass('action-handle')) return;
            $(this).removeClass('hover');
            $('#switchHandle, #removeHandle').hide();
        }).on('click', '.remove', function(e){
            e.stopImmediatePropagation();
            
            // alert('删除节点');  
            var node = $(this).parent();
            var timestamp = node.data('timestamp');

            //如果删除的是子流程节点，则同时处理子流程
            var subflow = _this.nodes[timestamp].subflow;
            if(subflow){
                subflow.destory();
            }

            // 删除节点需要判断上下节点是否为分支
            // 是否为分支里的节点，如果是，则直接删除，如果否，则如下：
            // 1、前后都为分支，则将该节点替换为空节点
            // 2、仅前一个节点为分支，则同时删除后一个箭头
            // 3、仅后一个节点为分支，则同时删除前一个箭头
            // 4、前后都不为分支，则同时删除后一个箭头

            if(node.parents('.flow-node-group')[0]){
                var group = node.parents('.flow-node-group');
                if(group.find('.flow-node').length <=4) return; //最少保留4个节点，其中两个是分支箭头和合并箭头
                
                _this.deleteNode(timestamp);
            }else{
                if(node.next().hasClass('flow-node-group') && node.prev().hasClass('flow-node-group')){
                    //新增空节点
                    var blankNode = _this.createNode('blank');

                    node.after(blankNode.display);
                }else if(node.prev().hasClass('flow-node-group')){
                    //同时删除下一个箭头
                    var next = node.next();
                    _this.deleteNode(next.data('timestamp'));
                }else if(node.next().hasClass('flow-node-group')){
                    //同时删除上一个箭头
                    var prev = node.prev();
                    _this.deleteNode(prev.data('timestamp'));
                }else{
                    //同时删除下一个箭头
                    var next = node.next();
                    _this.deleteNode(next.data('timestamp'));
                }
                _this.deleteNode(timestamp);
            }
        }).on('click', '.remove-group', function(e){
            // alert('删除分支') 
            // 删除分支需要新增普通箭头
            var node = $(this).parent();
            var timestamp = node.data('timestamp');
            var arrow = _this.createNode('arrowNormal');
            node.after(arrow.display);

            node.find('.flow-node').each(function(){
                var timestamp = $(this).data('timestamp');
                _this.deleteNode(timestamp);
            })

            _this.deleteNode(timestamp);

            e.stopImmediatePropagation();
        }).on('click', '.add', function(e){
            // alert('增加节点')
            e.stopImmediatePropagation()

            // $(this).next().show();
            $(this).next().find('a').eq(0).trigger('click');
        }).on('click', '.add-node ul a', function(e){
            e.stopImmediatePropagation();

            var type = $(this).data('type');
            var node = _this.createNode(type);
            $(this).parents('.add-node').before(node.display);

            $(this).parents('ul').hide();
        }).on('click', '.switch', function(e){
            // alert('切换'); 
            e.stopImmediatePropagation();

            var el = $(this).parent();
            var timestamp = el.data('timestamp');
            var node = _this.nodes[timestamp];
            var type = node.type;

            if(type === 'normal' || type === 'subflow'){
                //标准操作节点和子流程操作节点切换
                var text1 = '标准操作节点';
                var text2 = '子流程操作节点';

                var dialog = $('#switchNodeTpl').html();
                if(type === 'normal'){
                    dialog = dialog.replace('{src}', text1).replace('{dst}', text2);
                }else{
                    dialog = dialog.replace('{src}', text2).replace('{dst}', text1);
                }
                dialog = $(dialog);
                dialog.appendTo($('body')).modal();

                dialog.on('click','#btnConfirm', function(){
                    type = type ==='normal' ? 'subflow' : 'normal';
                    var newNode = _this.createNode(type);
                    el.after(newNode.display);

                    _this.deleteNode(el.data('timestamp'));

                    dialog.modal('hide');
                }).on('hidden.bs.modal', function(){
                    dialog.off().remove();
                })
            }else if(type === 'arrowBranch'){
                //TODO 分支箭头切换
                var dialog = $('#switchArrowBranchTpl').html();
                dialog = $(dialog);
                dialog.appendTo($('body')).modal();

                dialog.find('input:radio[value="'+ node.branch.type +'"]').prop('checked', true);
                dialog.find('[name="branch_number"]').val(node.branch.num);

                dialog.on('click','#btnConfirm', function(){
                    node.branch.type = dialog.find('input:checked').val() * 1;
                    node.branch.num = dialog.find('[name="branch_number"]').val() * 1;

                    dialog.modal('hide');
                }).on('hidden.bs.modal', function(){
                    dialog.off().remove();
                })
            }else if(type === 'arrowMerge'){
                //TOO 合并箭头切换
                var dialog = $('#switchArrowMergeTpl').html();
                dialog = $(dialog);
                dialog.appendTo($('body')).modal();

                dialog.find('input:radio[value="'+ node.merge.type +'"]').prop('checked', true);
                dialog.find('[name="merge_number"]').val(node.merge.num);

                dialog.on('click','#btnConfirm', function(){
                    node.merge.type = dialog.find('input:checked').val() * 1;
                    node.merge.num = dialog.find('[name="merge_number"]').val() * 1;
                    
                    dialog.modal('hide');
                }).on('hidden.bs.modal', function(){
                    dialog.off().remove();
                })
            }
        }).on('click', '.entrance', function(e){
            e.stopImmediatePropagation();

            // alert('进入子流程'); 
            var node = $(this).parent();
            var timestamp = node.data('timestamp');

            if(!_this.nodes[timestamp].subflow){
                var subflow = new App.Workflow.Flow({ //相当于重新定义一个流程
                    flowId: timestamp,
                    formId: _this.formId
                });
                _this.nodes[timestamp].subflow = subflow;
                subflow.$el.attr('id', subflow.$el.attr('id') + timestamp)
                            .data('target', _this.$el.attr('id'))
            }else{
                var subflow = _this.nodes[timestamp].subflow;
            }

            //显示效果，两个流程之间进行切换
            _this.$el.after(subflow.$el);
            subflow.$el.css('left', 320).show();
            _this.$el.animate({
                left: -320
            }, function(){
                _this.$el.css('left', 0).hide();
            })
            subflow.$el.animate({
                left: 0
            })

            Event.trigger('node.change');
        }).on('click', '.back', function(){//返回上一流程
            var flow = $(this).parents('.flow-container');
            var target = flow.data('target');
            target = $('#' + target);

            //显示效果，两个流程之间进行切换
            target.css('left', -320).show();
            target.animate({
                left: 0
            });
            flow.animate({
                left: 320
            }, function(){
                flow.css('left', 0).hide();
            })

            Event.trigger('node.change');
        })

        $('#switchHandle, #removeHandle').on('mouseover', function(){
            // _this.st && clearTimeout(_this.st);
        }).on('mouseout', function(){
            _this.$el.find('.flow-node').removeClass('hover');
            $('#switchHandle, #removeHandle').hide();
        }).on('click', function(){
            if($(this).hasClass('switch-handle')){
                _this.$el.find('.flow-node.hover .switch').trigger('click');
            }else{
                _this.$el.find('.flow-node.hover .remove').trigger('click');
            }
            _this.$el.find('.flow-node').removeClass('hover');
            $('#switchHandle, #removeHandle').hide();
        })

        $(document).on('click', function(){
            _this.$el.find('.add-node ul').hide();
        })
    },
    //获取表单信息
    getFormData: function(){
        var _this = this;
        // $.get('/form/get_def/', {
        //     form_def_id: this.formId
        // }, function(r){
        //     _this.formItems = r.ret.item_list;
        //     if(_this.flowInfo){
        //         _this.initEditFlow();
        //     }else{
        //         _this.initNode();    
        //     }
        // }, 'json')

        var objGetFormDetail = {
            url: API.getFormDetail,
            args: {
                formId: this.formId
            },
            success: function(res) {
                _this.formItems = res.data;
                if(_this.flowInfo){
                    _this.initEditFlow();
                }else{
                    _this.initNode();    
                }   
            }
        }
        Ajax(objGetFormDetail);

    },
    //初始化开始节点、标准箭头、结束节点
    initNode: function(){
        var _this = this;
        if(this.isSubFlow){
            this.$el.append('<div class="back-hd"><a href="#" class="back">&laquo;返回</a> 上一个流程</div>');
        }

        $.each(['begin', 'arrowNormal', 'end'], function(i, type){
            var node = _this.createNode(type);

            _this.$el.append(node.display);
        })
    },
    // 第三步解析节点
    initEditFlow: function(){
        var _this = this;
        var nodes = this.flowInfo.node_map;
        var node = nodes['0'];
        var createNode = this.createNode('begin');//开始节点
        this.$el.append(createNode.display); 
        while(node.next_node){
            var seq_id_list = node.next_node.seq_id_list;
            node = nodes[seq_id_list[0]];
            if(seq_id_list.length > 1){ //分支
                //创建分支节点
                var branchNode = this.createNode('branch')

                //创建分支箭头
                var lastNode = nodes[node.last_node.seq_id_list[0]];
                var arrowBranch = this.createNode('arrowBranch', lastNode.next_node.type);
                branchNode.display.append(arrowBranch.display);

                //普通节点
                for(var i = 0, len = seq_id_list.length; i < len; i++){
                    createNode = this.createNode('normal', nodes[seq_id_list[i]]);
                    branchNode.display.append(createNode.display);
                }

                //合并箭头
                var nextNode = nodes[node.next_node.seq_id_list[0]];
                var arrowMerge = this.createNode('arrowMerge', nextNode.last_node.type);
                branchNode.display.append(arrowMerge.display);

                this.$el.append(branchNode.display)

            }else{ //普通节点
                // if(node.last_node.seq_id_list.length === 1){ //上一个节点不是分支的时候，需要先增加一个箭头
                //     createNode = this.createNode('arrowNormal');
                //     this.$el.append(createNode.display);
                // }
                if(node.last_node === null) {
                    createNode = this.createNode('arrowNormal');
                    this.$el.append(createNode.display);
                }else if (node.last_node.seq_id_list.length === 1) {
                    createNode = this.createNode('arrowNormal');
                    this.$el.append(createNode.display);
                }

                if(node.seq_id === '#'){ //结束节点
                    var createNode = this.createNode('end');//开始节点
                    this.$el.append(createNode.display); 
                }else{
                    //普通节点
                    createNode = this.createNode('normal', node)
                    this.$el.append(createNode.display);
                }
            }
        }
    },
    onDrag: function(e, data){
        // this.isActive = true;
        // console.log('draging', data);
    },
    onDrop: function(e, data){
        var _this = this;
        console.log('drop', data);

        // drop的时候需要判断
        // 1、标准操作节点或子流程操作节点
        //     1）drop在标准箭头上，则节点插入该箭头后，并自动在该节点后补全标准箭头
        //     2）drop在分支箭头上，则节点插入该箭头前，并自动在该节点前补全标准箭头
        //     3）drop在合并箭头上，则节点插入该箭头后，并自动在该节点后补全标准箭头
        // 2、分支
        //     1）drop在标准箭头上，则标准箭头替换为分支；
        //     2）drop在分支箭头上，则分支插入该箭头前，并自动在该分支后补全空白节点
        //     3）drop在合并箭头上，则分支插入该箭头后，并自动在该分支前补全空白节点

        var type = $(data.drag).data('type');
        var timestamp = $(data.drop).data('timestamp');
        var dropType = this.nodes[timestamp].type;

        console.log(type, dropType)

        if(type === 'normal' || type === 'subflow'){
            var node = _this.createNode(type);

            var arrow = _this.createNode('arrowNormal');

            if(dropType === 'arrowNormal'){
                $(data.drop).after(arrow.display);
                $(data.drop).after(node.display);
            }else if(dropType === 'arrowBranch'){
                var dropEl = $(data.drop).parents('.flow-node-group');
                dropEl.before(arrow.display);
                dropEl.before(node.display);
            }else if(dropType === 'arrowMerge'){
                var dropEl = $(data.drop).parents('.flow-node-group');
                dropEl.after(arrow.display);
                dropEl.after(node.display);
            }

            node.display.trigger('click');
        }else if(type === 'branch'){
            var node = _this.createNode(type);

            $.each(['arrowBranch', 'normal', 'normal', 'arrowMerge'], function(i, type){
                var subNode = _this.createNode(type);

                node.display.append(subNode.display);

                if(i === 2){
                    node.display.append($('#addNodeTpl').html());
                }
            });

            var blankNode = _this.createNode('blank');

            if(dropType === 'arrowNormal'){
                $(data.drop).replaceWith(node.display);
            }else if(dropType === 'arrowBranch'){
                var dropEl = $(data.drop).parents('.flow-node-group');
                dropEl.before(node.display);
                dropEl.before(blankNode.display);
            }else if(dropType === 'arrowMerge'){
                var dropEl = $(data.drop).parents('.flow-node-group');
                dropEl.after(node.display);
                dropEl.after(blankNode.display);
            }

            node.display.find('.node-normal:eq(0)').trigger('click');
        }
    },
    onDropStart: function(e, data){
        console.log('drop start', e);
        $(e.currentTarget).addClass('hover');
    },
    onDropEnd: function(e, data){
        console.log('drop end', e);
        $(e.currentTarget).removeClass('hover');
        // this.isActive = false;
    },
    destory: function(){
        var _this = this;
        this.$el.find('.flow-node').each(function(){
            var timestamp = $(this).data('timestamp');
            _this.deleteNode(timestamp);
        })
        this.$el.remove();
    },
    createNode: function(type, data){
        var timestamp = this.index++;
        var node;
        if(type === 'normal'){
            node = App.Workflow.Flow[type](this.formItems, data);
        }else{
            node = App.Workflow.Flow[type](data);
        }
        node.display.data('timestamp', timestamp);
        this.nodes[timestamp] = node;

        return node;
    },
    deleteNode: function(timestamp){
        this.nodes[timestamp].setting && this.nodes[timestamp].setting.remove();
        this.nodes[timestamp].display.remove();
        this.nodes[timestamp].subflow && this.nodes[timestamp].subflow.destory();
        this.nodes[timestamp] = null;
        delete this.nodes[timestamp];
    },
    validate: function(){
        var flag = true;

        //TODO验证
        return flag;
    },
    getData: function(i){
        var _this = this;
        if(!this.validate()) return;
        if(this.$el.find('.flow-node').length <= 3) return null; //如果只是初始化了开始节点和结束节点，返回null

        var index = 0;//id编号
        var prefix = i ? i + '-' : ''; //如果是子流程，需要前缀
        var flowData = {};//流程数据

        this.$el.find('.flow-node:not(".node-arrow")').each(function(){
            var el = $(this);
            el.data('seq_id', ''+index);
            if(el.hasClass('node-end')){
                el.data('seq_id', '#')
            }
            index += 1;
        })

        this.$el.find('>.flow-node:not(".node-arrow"), >.flow-node-group').each(function(){
            var el = $(this);
            // if(el.hasClass('flow-node-group')){ //如果是分支，分支里包含了 分支箭头、节点组、合并箭头
            //     //分支箭头
            //     // var arrowBranch = el.find('.flow-node:first');
            //     // var timestamp = arrowBranch.data('timestamp');
            //     // var node = _this.nodes[timestamp];
            //     // var data = node.parseData();
            //     // data.node_id = prefix + 's' + index;
            //     // index++;
            //     // data.attr.to = prefix + index;
            //     // flowData[data.node_id] = data;

            //     //分支节点
            //     var length = el.find('.flow-node').length;
            //     var branch = el.find('.flow-node:gt(0):lt('+ (length-2) +')');
            //     var data = {
            //         node_id: prefix + index,
            //         type: App.Workflow.Flow.type['branch'],
            //         attr:{
            //             node_map:{}
            //         }
            //     }
            //     branch.each(function(i, v){
            //         var el = $(this);
            //         var timestamp = el.data('timestamp');
            //         var node = _this.nodes[timestamp];
            //         var subData = node.parseData();
            //         subData.node_id = prefix + index + '-' + i;

            //         //如果是子流程
            //         if(node.type === 'subflow'){
            //             subData.attr.node_map = node.subflow && node.subflow.getData(subData.node_id);
            //         }

            //         data.attr.node_map[subData.node_id] = subData;
            //     })
            //     flowData[data.node_id] = data;

            //     //合并箭头
            //     // var arrowMerge = el.find('.flow-node:last');
            //     // var timestamp = arrowMerge.data('timestamp');
            //     // var node = _this.nodes[timestamp];
            //     // var data = node.parseData();
            //     // data.node_id = prefix + 's' + index;
            //     // index++;
            //     // //如果下一个节点是结束节点，那么to指向'#'，否则指向下一个节点id；
            //     // data.attr.to = prefix + (el.next().hasClass('node-end') ? '#' : index);
            //     // flowData[data.node_id] = data;

            // }else{ //非分支，包含 开始、结束节点、普通箭头、标准节点、子流程等
            //     var timestamp = el.data('timestamp');
            //     var node = _this.nodes[timestamp];
            //     var data = node.parseData();

            //     if(el.hasClass('node-arrow')){ //如果是箭头
            //         data.node_id = prefix + 's' + index;
            //         index++;
            //         //如果下一个节点是结束节点，那么to指向'#'，否则指向下一个节点id；
            //         data.attr.to = prefix + (el.next().hasClass('node-end') ? '#' : index);
            //     }else if(el.hasClass('node-end')){ //如果是结束节点
            //         data.node_id = prefix + '#';
            //     }else{ //其他节点
            //         data.node_id = prefix + index;
            //     }

            //     //如果是子流程，那么要获取子流程里面的节点信息，直接传入prefix调用getData即可，递归调用
            //     if(node.type === 'subflow'){
            //         data.attr.node_map = node.subflow ? node.subflow.getData(data.node_id) : {};
            //     }

            //     flowData[data.node_id] = data;
            // }

            if(el.hasClass('flow-node-group')){ //分支
                var len = el.find('.flow-node').length;
                var branch = el.find('.flow-node:gt(0):lt('+ (len - 2) +')');
                
                //分支箭头
                var arrowBranch = el.find('.flow-node:first');
                var timestamp = arrowBranch.data('timestamp');
                var arrowBranchNode = _this.nodes[timestamp];
                var arrowBranchData = arrowBranchNode.parseData();

                //合并箭头
                var arrowMerge = el.find('.flow-node:last');
                var timestamp = arrowMerge.data('timestamp');
                var arrowMergeNode = _this.nodes[timestamp];
                var arrowMergeData = arrowMergeNode.parseData();

                // 分支里面所有的节点的前置和后置都是一样的
                var last_node = {
                        // type: arrowBranchData.attr.arrow_type,
                        type: 1, // 设置分支节点前驱
                        seq_id_list: [el.prev().data('seq_id')]
                    },
                    next_node = {
                        type: arrowMergeData.attr.arrow_type,
                        seq_id_list: [el.next().data('seq_id')]
                    };

                branch.each(function(){
                    var el = $(this);
                    var timestamp = el.data('timestamp');
                    var seq_id = el.data('seq_id');
                    var node = _this.nodes[timestamp];
                    var data = node.parseData();
                    data.seq_id = seq_id;
                    data.last_node = last_node;
                    data.next_node = next_node;

                    flowData[data.seq_id] = data;
                })
            }else{
                var timestamp = el.data('timestamp');
                var seq_id = el.data('seq_id');
                var node = _this.nodes[timestamp];
                var data = node.parseData();
                data.seq_id = seq_id;

                // 前置节点
                if(el.hasClass('node-begin')){ //开始节点
                    var last_node = null;
                }else{
                    var prevNode = el.prev();
                    if(prevNode.hasClass('node-arrow')){
                        prevNode = prevNode.prev();
                    }
                    if(prevNode.hasClass('flow-node-group')){ //所有分支里的节点都是前置节点
                        var seq_id_list = [];
                        //获取分支里节点id
                        prevNode.find('.flow-node:not(".node-arrow")').each(function(){
                            var el = $(this);
                            seq_id_list.push(el.data('seq_id'));
                        })
                        
                        //获取分支条件
                        var arrowMerge = prevNode.find('.flow-node:last');
                        var timestamp = arrowMerge.data('timestamp');
                        var arrowMergeNode = _this.nodes[timestamp];
                        var arrowMergeData = arrowMergeNode.parseData();

                        // 设置会签节点的last_node type=2
                        var last_node = {
                            // type: arrowMergeData.attr.arrow_type,
                            type: 2,
                            seq_id_list: seq_id_list
                        }
                    }else{
                        var last_node = {
                            type: 1,
                            seq_id_list: [prevNode.data('seq_id')]
                        }
                    }
                }

                if(last_node){
                    data.last_node = last_node;
                }

                //后置节点
                if(el.hasClass('node-end')){
                    var next_node = null;
                }else{
                    var nextNode = el.next();
                    if(nextNode.hasClass('node-arrow')){
                        nextNode = nextNode.next();
                    }
                    if(nextNode.hasClass('flow-node-group')){ //所有分支里的节点都是前置节点
                        var seq_id_list = [];
                        //获取分支里节点id
                        nextNode.find('.flow-node:not(".node-arrow")').each(function(){
                            var el = $(this);
                            seq_id_list.push(el.data('seq_id'));
                        })
                        
                        //获取分支条件
                        var arrowBranch = nextNode.find('.flow-node:first');
                        var timestamp = arrowBranch.data('timestamp');
                        var arrowBranchNode = _this.nodes[timestamp];
                        var arrowBranchData = arrowBranchNode.parseData();

                        var next_node = {
                            // type: arrowBranchData.attr.arrow_type,
                            type: 2,
                            seq_id_list: seq_id_list
                        }
                    }else{
                        var next_node = {
                            type: 1,
                            seq_id_list: [nextNode.data('seq_id')]
                        }
                    }
                }

                if(next_node){
                    data.next_node = next_node;
                }

                flowData[data.seq_id] = data;
            }

        })

        // console.log(flowData);
        return flowData;
    }
}

App.Workflow.FlowSetting = function(){
    this.init();
}
App.Workflow.FlowSetting.prototype = {
    init: function(){
        this.$el = $($('#flowControlSettingTpl').html());

        this.bind();
    },
    bind: function(){
        var Event = $(document);

        Event.on('node.change', $.proxy(this.onChange, this));
    },
    onChange: function(e, data){
        this.$el.find('.node-setting').hide();
        if(!data) return;

        var type = data.type;
        var setting = data.setting;

        if(this.$el.has(setting)[0]){
            $(setting).show();
        }else{
            this.$el.append(setting);
        }
    },
    getData: function(){
        return {
            name: this.$el.find('[name="name"]').val(),
            intro: this.$el.find('[name="intro"]').val()
        }
    }
}

App.Workflow.Flow.type = {
    'normal': 1,
    'begin': 2,
    'end': 2,
    'blank': 2,
    'subflow': 3,
    'branch': 4,
    'arrowNormal': 5,
    'arrowBranch': 6,
    'arrowMerge': 7
}
//开始节点
App.Workflow.Flow['begin'] = function(data){
    var node = {
        type: 'begin'
    };
    node.display = $($('#node-begin').html());
    node.setting = null;
    node.parseData = function(){
        var data = {
            name: '开始节点',
            // type: 0,
            approve: {
                type: 0
            },
            next_node: {}
        }
        return data;
    }

    return node;
}
//结束节点
App.Workflow.Flow['end'] = function(data){
    var node = {
        type: 'end'
    };
    node.display = $($('#node-end').html());
    node.setting = null;
    node.parseData = function(){
        var data = {
            name: '结束节点',
            // type: 0,
            last_node: {}
        }

        return data;
    }

    return node;
}
//空白节点
App.Workflow.Flow['blank'] = function(data){
    var node = {
        type: 'blank'
    };
    node.display = $($('#node-blank').html());
    node.setting = null;
    node.parseData = function(){
        var data = {
            name: '空白节点',
            type: 0
        }

        return data;
    }

    return node;
}
//标准节点
App.Workflow.Flow['normal'] = function(formItems, data){
    var node = {
        type: 'normal'
    };
    node.display = $($('#node-normal').html());
    node.setting = $($('#setting-normal').html());
    node.parseData = function(){
        if(node.setting.find('[name="node_type"]:checked').val() == 2){
            var data = {
                name: '空白节点',
                type: 0
            }
        }else{
            //表单权限
            // var visible = [],
            //     editable = [];
            // node.setting.find('.node-info-form .node-setting-field').each(function(){
            //     var id = $(this).data('id');

            //     if($(this).find('[name="visible"]').prop('checked')){
            //         visible.push(id);
            //     }
            //     if($(this).find('[name="editable"]').prop('checked')){
            //         editable.push(id);
            //     }
            // })

            // var data = {
            //     type: App.Workflow.Flow.type[node.type],
            //     attr: {
            //         name: node.setting.find('[name="node_name"]').val(),
            //         approver: {
            //             type: 2,
            //             value: ''
            //         },
            //         operation_sign_visible: node.setting.find('[name="sign_display"]:checked') * 1 === 1,
            //         operation_approve_lable: node.setting.find('[name="agree"]').val(),
            //         operation_deny_list: {
            //             return_start: node.setting.find('[name="return_start"]').prop('checked'),
            //             return_last_step: node.setting.find('[name="return_last_step"]').prop('checked'),
            //             terminate: node.setting.find('[name="terminate"]').prop('checked'),
            //             return_node_1: null,
            //             return_node_2: null,
            //             return_node_3: null, 
            //         },
            //         form_permit: {
            //             visible_form_item_list:visible,
            //             ediable_form_item_list:editable
            //         }
            //     }
            // }

            
            var rollback_list = [];
            if(node.setting.find('[name="return_start"]').prop('checked')){
                rollback_list.push({
                    // type: 1,
                    rollback_category: 1,
                    label: '退回到发起',
                    seq_id: ''
                })
            }
            if(node.setting.find('[name="return_last_step"]').prop('checked')){
                rollback_list.push({
                    // type: 2,
                    rollback_category: 2,
                    label: '退回到上一步',
                    seq_id: ''
                })
            }
            if(node.setting.find('[name="terminate"]').prop('checked')){
                rollback_list.push({
                    // type: 4,
                    rollback_category: 4,
                    label: '终止流程',
                    seq_id: ''
                })
            }
            if(node.setting.find('[name="return_before"]').prop('checked')){
                rollback_list.push({
                    // type: 3,
                    rollback_category: 3,
                    label: '退回到指定节点',
                    seq_id: '' //TODO
                })
            }
            if(!node.setting.find('[name="refuse"]').prop('checked'))  {
                rollback_list = [];
            }
            var approveType = node.setting.find('[name="approver_type"]').val() * 1;
            var role_def_id_list = [];
            var account_id_list = [];
            if(approveType === 3 || approveType === 6){
                node.setting.find('.user-selector input').each(function(){
                    account_id_list.push($(this).val());
                })
            }else if(approveType === 4 || approveType === 5){
                node.setting.find('.user-selector input').each(function(){
                    role_def_id_list.push($(this).val());
                })
            }
            // 如果类型为自动通过，approver_category必须为null
            if(node.setting.find('[name="node_approval_type"]').val()*1 === 0) {
                approveType = null;
            }
            var data = {
                name: node.setting.find('[name="node_name"]').val(),
                // type: node.setting.find('[name="node_approval_type"]').val(),
                approve: {
                    type: node.setting.find('[name="node_approval_type"]').val() || 0, 
                    approver_category: approveType,
                    label: node.setting.find('[name="agree"]').val(),
                    role_list: role_def_id_list, //TODO
                    account_id_list: account_id_list //TODO
                },
                rollback: rollback_list,
                last_node: {

                },
                next_node: {

                }
            }

        }

        return data;
    }

    App.Workflow.WidgetBind.init(node);

    //属性相关 节点绑定操作
    node.setting.on('change', '[name="node_type"]', function(){//标准和空节点切换
        var type = $('[name="node_type"]:checked').val() * 1;
        node.setting.find('.node-type').hide();
        node.setting.find('.node-type').eq(type - 1).show();
        if(type === 1){
            node.setting.find('[data-type]').trigger('blur');
        }else if(type === 2){
            node.display.find('.node-name').text('空白节点');
        }
    }).on('change', '[name="node_info"]', function(){ //基本信息和表单信息切换
        var type = $('[name="node_info"]:checked').val() * 1;
        node.setting.find('.node-info').hide();
        node.setting.find('.node-info').eq(type - 1).show();
    }).on('focus', '[name="agree"]' ,function(){ //同意
        $(this).next().show();
    }).on('blur', '[name="agree"]', function(){
        var ipt = $(this);
        setTimeout(function(){
            ipt.next().hide();
        }, 100)
    }).on('click', '.agree-actions a', function(e){//同意操作
        node.setting.find('[name="agree"]').val($(this).text());
    }).on('change', '[name="refuse"]', function(){ //拒绝
        node.setting.find('[name="refuse-action"]').prop('disabled', !$(this).prop('checked'))
        $(this).prop('checked') && node.setting.find('[name="refuse-action"]').focus();
    }).on('focus', '[name="refuse-action"]', function(){ //拒绝操作
        $(this).next().show();
    }).on('click', '.refuse-actions, [name="refuse-action"]', function(e){
        e.stopImmediatePropagation();
    }).on('change', '[name="approver_type"]', function(){ 
        var type = $(this).val() * 1;
        var userSelector = node.setting.find('.user-selector');
        if(type === 3 || type === 4 || type === 5){
            userSelector.html('').show();
            userSelector.trigger('click');
        }else{
            userSelector.hide();
        }
    }).on('click', '.user-selector', function(){
        var type = node.setting.find('[name="approver_type"]').val() * 1;
        if(type === 3){
            App.UI.UserSelector({el: $(this)});
        }else if(type === 4){
            App.UI.RoleSelector({el: $(this)});
        }else if(type === 5) {
            App.UI.RoleSelector({el: $(this)});
        }
        // if(type === 5) {
        //     App.UI.RoleSelector({el: $(this)});
        // }
    })
    $(document).on('click', '[name="refuse"]', function(){
        node.setting.find('.refuse-actions').parent().hide();
    })

    //表单数据
    var formInfo = node.setting.find('.node-info-form');
    var list = [];
    if($.isArray(formItems)){
        $.each(formItems, function(i, item){
            list.push('<div class="node-setting-field" data-id="'+ item.item_id +'"> \
                    <div class="field-title">'+ item.title +'</div> \
                    <div class="field-ipt"> \
                        <label><input type="checkbox" class="ipt-checkbox" name="visible" checked>可见</label> \
                        <label><input type="checkbox" class="ipt-checkbox" name="editable" checked>可编辑</label> \
                    </div> \
                </div>')
        });

        formInfo.html(list.join(''));
    }

    // 编辑数据初始化
    if(data){
        //name
        node.setting.find('[name="node_name"]').val(data.name).trigger('blur');
        //审批人
        node.setting.find('[name="approver_type"]').val(data.approve.approver_category);
        //通过label
        node.setting.find('[name="agree"]').val(data.approve.label);
        //通过条件
        node.setting.find('[name="node_approval_type"]').val(data.approve.type);
        //拒绝操作
        // if(data.rollback_list.length){
        //     node.setting.find('[name="refuse"]').prop('checked', true);

        //     $(data.rollback_list).each(function(i, rollback){
        //         var type = rollback.type;
        //         node.setting.find('.refuse-actions input').eq(type - 1).prop('checked', true);
        //     })
        // }
        if(data.rollback.length){
            node.setting.find('[name="refuse"]').prop('checked', true);
            // node.setting.find('[name="refuse"]').change();
            // node.setting.find('[name="refuse-action"]').show();
            node.setting.find('.refuse-actions').parent().show();

            $(data.rollback).each(function(i, rollback){
                var type = rollback.rollback_category;
                node.setting.find('.refuse-actions input').eq(type - 1).prop('checked', true);
            })
        }
    }

    return node;
}
//子流程节点
App.Workflow.Flow['subflow'] = function(data){
    var node = {
        type: 'subflow'
    };
    node.display = $($('#node-subflow').html());
    node.setting = $($('#setting-subflow').html());
    node.parseData = function(){
        var data = {
            type: App.Workflow.Flow.type[node.type],
            attr:{}
        }
        return data;
    }

    App.Workflow.WidgetBind.init(node);

    node.setting.on('click', function(){

    })

    return node;
}
//标准箭头
App.Workflow.Flow['arrowNormal'] = function(data){
    var node = {
        type: 'arrowNormal'
    };
    node.display = $($('#node-arrow-normal').html());
    node.setting = null;
    node.parseData = function(){
        var data = {
            type: App.Workflow.Flow.type[node.type],
            attr:{to: null}
        }
        return data;
    }

    return node;
}
//分支箭头
App.Workflow.Flow['arrowBranch'] = function(data){
    var node = {
        type: 'arrowBranch'
    };
    node.display = $($('#node-arrow-branch').html());
    node.branch = {
        type: data || 1,
        num: 2
    }
    node.setting = null;
    node.parseData = function(){
        var data = {
            type: App.Workflow.Flow.type[node.type],
            attr:{
                to: null,
                arrow_type: node.branch.type,
                min_select_num: node.branch.num
            }
        }
        return data;
    }

    return node;
}
//合并箭头
App.Workflow.Flow['arrowMerge'] = function(data){
    var node = {
        type: 'arrowMerge'
    };
    node.display = $($('#node-arrow-merge').html());
    node.merge = {
        type: data || 1,
        num: 2
    }
    node.setting = null;
    node.parseData = function(){
        var data = {
            type: App.Workflow.Flow.type[node.type],
            attr:{
                to: null,
                arrow_type: node.merge.type,
                min_select_num: node.merge.num
            }
        }
        return data;
    }

    return node;
}
//分支节点
App.Workflow.Flow['branch'] = function(){
    var node = {
        type: 'branch'
    };
    node.display = $($('#node-branch').html());
    node.setting = null;
    node.parseData = function(){
        return {};
    }

    return node;
}

App.Workflow.WorkflowDesign = function(options){

    this.$el = $('#workflowDesign');
    this.defaultPageSize = 100;
    this.page = 0;
    this.workflowId = options.id || null;
    this.isEdit = !!this.workflowId;
    this.init();
}

App.Workflow.WorkflowDesign.prototype = {
    init: function(){
        var _this = this;
        this.$formList = $('#formList');
        this.$pager = $('#pager');
        this.$workflowMain = $('#workflowMain');
        this.$workflowBasicForm = $('#workflowBasicForm');
        this.$stepActions = $('#stepActions');

        this.pager = new App.UI.Pager({
            el: this.$pager,
            total: 0,
            pageSize: this.defaultPageSize,
            callback: function(page){
                _this.getFormList(page)
                $(window).scrollTop(0);
            }
        })

        if(this.isEdit){
            this.getFlowInfo();
        }

        this.$workflowBasicForm.validate();
        this.bind();
        $(window).trigger('resize');
    },
    bind: function(){
        var _this = this;
        this.$el
            .on('click', '#step1Next', $.proxy(this.step1Next, this))   //第一步：下一步
            .on('click', '#step2Prev', $.proxy(this.step2Prev, this))   //第二步：上一步
            .on('click', '#step2Next', $.proxy(this.step2Next, this))   //第二步：下一步
            .on('click', '#step3Draft', $.proxy(this.step3Draft, this)) //第三步：暂存
            .on('click', '#step3Save', $.proxy(this.step3Save, this))   //第三步：保存并发布

        this.$formList.on('click', 'tr', function(){
            $(this).find('input').prop('checked', true);
        })

        $(window).on('resize', function(){
            var height = $(window).height();
            var offset = _this.$workflowMain.offset();
            _this.$workflowMain.css('height', height - offset.top - 25);
        })
    },
    // 查看工作流定义
    getFlowInfo: function(){
        var _this = this;
        // $.get('/workflow/def/retrieve/', {
        //     id: this.workflowId
        // }, function(r){
        //     if(r.code === 200){
        //         _this.flowInfo = r.ret;
        //         _this.initBasicForm();
        //     }
        // }, 'json')
        var objGetWorkflowDetail = {
            url: API.getWorkflowDetail,
            args: {
                workflow_def_id: this.workflowId
            },
            success: function(res) {
                _this.flowInfo = res.ret.workflow_def;
                _this.initBasicForm();
            }
        };
        Ajax(objGetWorkflowDetail);
    },
    initBasicForm: function(){
        this.$workflowBasicForm.find('[name="name"]').val(this.flowInfo.name);
        this.$workflowBasicForm.find('[name="intro"]').val(this.flowInfo.intro);
    },
    //获取表单列表
    step1Next: function(){
        if(!this.$workflowBasicForm.validate('validateAll')) return;
        this.switchStep(2)
        this.page = 0;
        this.getFormList();
    },
    step2Prev: function(){
        this.switchStep(1)
    },
    step2Next: function(){
        if(this.$formList.find('input:checked').length === 0){
            App.fail('请选择表单');
            return;
        }

        this.formId = this.$formList.find('input:checked').val();
        this.formNo = this.$formList.find('input:checked').data('no');
        this.switchStep(3)
        this.initFlowDesign();
    },
    step3Draft: function(){

    },
    // 创建流程
    step3Save: function(){
        var _this = this;
        var data = {
            name: this.$workflowBasicForm.find('[name="name"]').val(),
            intro: this.$workflowBasicForm.find('[name="intro"]').val()
            // tag: this.$workflowBasicForm.find('[name="tag"]').val()
        };
        data.node_map = this.flowDesign.flowContainer.getData();
        data.form_def_id = this.formNo.toString();
        data.creator_id = App.Config.accountId;
        data.domain_id = App.Config.companyId;
        data.status = 1;
        // console.log(data);

        var url, postData;
        if(this.isEdit){
            // url = '/workflow/def/update/';
            url = API.modifyWorkflow;
            // postData = {
            //     id: this.workflowId,
            //     attr_data: JSON.stringify(data)
            // }
            // data.workflow_def_id = this.workflowId;
            // var test = {};
            // test.name = '院办666',
            // test.workflow_def_id = "58676e1b4a04950a4c91e3f0";
            var objModifyWorkflow = {
                url: API.modifyWorkflow,
                args: {
                    workflow_def_id: this.workflowId,
                    attr_data: JSON.stringify(data)
                },
                success: function() {
                    App.success('修改成功');
                    location.href = WEB_URL + 'workflow_list.html';
                }
            }
            console.log(objModifyWorkflow.args);
            Ajax(objModifyWorkflow);
            // $.post(url, postData, function(r){
            //     // console.log(r)
            //     if(r.code === 200){
            //         App.success(_this.isEdit ? '修改成功' :'创建成功');
            //         location.href = WEB_URL + 'manage/workflow/';
            //     }else{
            //         App.fail(_this.isEdit ? '修改失败' :'创建失败');
            //     }
            // },'json')
        }else{
            url = API.createWorkflow;
            // postData = {
            //     workflow_def: JSON.stringify(data)
            // }
            var objCreateWorkflow = {
                url: url,
                args: {
                    workflow_def: data
                },
                success: function() {
                     App.success('创建成功');
                     location.href = WEB_URL + 'workflow_list.html';
                },
                error: function() {
                    App.fail('创建失败');
                }
            }
            Ajax(objCreateWorkflow);
        }
    },
    switchStep: function(step){
        this.$stepActions.find('a').hide();
        $('#workflowMain .step').hide()
        $('#workflowMain .step').eq(step - 1).show();
        switch(step){
            case 1:
                $('#step1Next').show();
                break;
            case 2:
                $('#step2Prev, #step2Next').show();
                break;
            case 3:
                $('#step3Draft,#step3Save').show();
                break;
        }
    },
    // 请求审批选择表单列表
    getFormList: function(page){
        var _this = this;
        this.page = page ? page - 1 : this.page;
        // $.get('/form/list_enabled_def/', {
        //     page_index: this.page,
        //     page_num: this.defaultPageSize,
        //     domain_id: App.Config.companyId
        // }, function(r){
        //     //TODO 异常处理
        //     // console.log(r)
        //     // r.msg = [{
        //     //     id: '56e8fb075c2fb1440e7e8abd',
        //     //     name: '测试阿斯发',
        //     //     intro: '发萨法司法',
        //     //     version: 1,
        //     //     status: 1,
        //     //     create_time: '2016-03-16 14:25',
        //     //     update_time: '2016-03-16 14:25'
        //     // },{
        //     //     id: '56e8fb075c2fb1440e7e8abd',
        //     //     name: '测试阿斯发',
        //     //     intro: '发萨法司法',
        //     //     version: 1,
        //     //     status: 1,
        //     //     create_time: '2016-03-16 14:25',
        //     //     update_time: '2016-03-16 14:25'
        //     // }]
        //     _this.formList = r.ret.data;
        //     _this.buildList();
        //     if(_this.pager.getTotal() !== r.ret.total) _this.pager.resetTotal(r.ret.total);
        // }, 'json')

        var objgetFormList = {
            url: API.getFormList,
            args: {},
            success: function(res) {
                _this.formList = res.data;
                _this.buildList();
                // if(_this.pager.getTotal() !== r.ret.total) _this.pager.resetTotal(r.ret.total);
            }
        }
        Ajax(objgetFormList);
    },
    // 工作流选择表单列表
    buildList: function(){
        var formList = this.formList;
        var _this = this;
        // var tpl = '<tr data-id="{id}" id="form{no}"> \
        //                 <td><input type="radio" data-no="{no}" name="form" value="{id}"></td>\
        //                 <td>{title}</td>\
        //                 <td>{version}</td>\
        //                 <td>{time}</td>\
        //                 <td>{intro}</td>\
        //             </tr>';
        var tpl = '<tr data-id="{id}" id="form{no}"> \
            <td><input type="radio" data-no="{no}" name="form" value="{id}"></td>\
            <td>{title}</td>\
            <td>{time}</td>\
        </tr>';        

        var list = [];
        $(formList).each(function(i, form){
            if(form.status != 2) {
                return;
            }
            var item = tpl.replace(/\{id\}/ig, form.id)
                        // .replace(/\{no\}/ig, form.no)
                        .replace(/\{no\}/ig, form.id)
                        .replace('{title}', form.name)
                        .replace('{time}', form.updateTime)
                        // .replace('{version}', form.version)
                        // .replace('{intro}', form.intro)
                        // .replace('{time}', form.update_time);
                        
            list.push(item);
        })

        this.$formList.find('tbody').html(list.join(''));
        if(this.isEdit){
            this.$formList.find('#form' + this.flowInfo.form_def_no + ' input').prop('checked', true);
        }
    },
    initFlowDesign: function(){
        this.flowDesign = new App.Workflow.FlowDesign({
            el: $('#FlowDesignView'),
            formId: this.formId,
            id: this.workflowId,
            flowInfo: this.flowInfo || null
        })
    },
    //最终提交
    submit: function(){

    }
}