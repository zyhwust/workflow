/**
 * @fileOverview 主脚本文件
 * @author angelscat@vip.qq.com
 * 
 */

/**
 * @namespace
 */
 var App = App || {};

//常用正则
var mailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,4})$/,//邮箱
    pwdReg = /[^0-9a-zA-Z\'\"\!\@\#\$\%\&\(\)\^\_\`\{\}\~\*\-\=\,\:\;\<\>\?\.\+\/\[\\\]\|]/, //密码
    nameReg = /^[\u4E00-\u9FA5a-z0-9_\(\)\s\uFF08-\uFF09]+$/i, //名字规则，中英文、数字、下划线
    zhReg = /[^\x00-\xff]/g//中文
var IMAGE_THUMBNAIL_URL = '/file/thumbnail/';
// var STATIC_URL = '/static/';
var STATIC_URL = '/MOA/MobileOA/static/';
// var WEB_URL = '../../static/';

// App.Fn
App.Fn = App.Fn || {};
App.Fn.generateKey = function(){
    var v = App.Crypto.generateECCKey();

    var q = App.Crypto.computeECDHShareKey("a70df2606464c6c17a2b3060743dd1506282ce187e942de5da766a71351da612", "4306fb28fe49a5667c58ceda36741c496e8b9285db9d52a795ee1f00f994466a39e38a14a654498b6055eda9cfec6510fddaecfa71aceeb4308f00d5be7dfe14");

    var k = App.Crypto.aesEncrypt(q, '012345690112345690212345690312345690412345690512345690612345690712345690812345699812345690a812345690b812345690c812345690d812345690');//, App.Crypto.hashPassword(password));

    var m = '2Q0i4KwG/rlC9YUNchzCIfiMUFr/hj2rDH5M9Ve4Q9o6zjTPJX95RSPpd+t+nCP+D4TohARkdkV1PrdqA4IU7Z+G2S5k9BWR2vgU5V1/a41Di7xPUgsqSEP3P9QxC37U+fw9RvgFNrGGZWdO/pspBZEoyJ7nxlOczBsrLr3Do/7OKceCVlRBE7rDGHQ3fLCj'

    var n = App.Crypto.aesDecrypt(q, m );
    return k;
}

App.Fn.exchangeKey = function(callback){
    if (window.localStorage) {
        // if (sessionStorage.getItem("ecdhKey") != null) {
        //     return false;
        // }
    } 
    else {
        alert("浏览器版本太低，不支持加密传输！");
        App.Net.encrypt = false;
        return false;
    }

    var v = App.Crypto.generateECCKey();
    var clientPubKey = v.pubKey;
    var privateKey = v.privateKey;

    // $.ajax({
    //     type: "post",
    //     url: "/pubkey/exchange/",
    //     dataType: 'json',
    //     data: "client_pubkey=" + clientPubKey,
    //     success: function (result) {
    //         if (result.server_pubkey) {
    //             var ecdhKey = App.Crypto.computeECDHShareKey(privateKey, result.server_pubkey);
    //             localStorage.setItem("ecdhKey", ecdhKey);
    //             callback && callback();
    //         } 
    //         else {
    //             alert("get key failed");
    //         }
    //     },
    //     failure:function() {
    //         alert("请求key值失败")
    //     }
    // })
}

// jQuery(function(){
//     App.Fn.exchangeKey();
// });

App.Fn.isImg = function (file) { //是否是图片文件
    if (file.type) {
        return /^image\/\w+$/.test(file.type);
    } else {
        return /\.(jpg|jpeg|png|gif)$/.test(file);
    }
}

App.Net = App.Net || {}
App.Net.encrypt = false; //是否加密
if(location.hash.indexOf('#debug') >= 0) App.Net.encrypt = false;

//自定义的post和get
// jQuery(['post', 'get']).each(function(i, method){
//     App.Net[method] = function(url, data, callback, type){
//         if ( jQuery.isFunction( data ) ) {
//             type = type || callback;
//             callback = data;
//             data = undefined;
//         }
//         var tmpData, reqData, encryptData;
//         var ecdhKey;
//         if(data){
//             tmpData = {
//                 ret: data,
//                 encrypt: 1
//             }
//             ecdhKey = sessionStorage.getItem("ecdhKey");
//             if(App.Net.encrypt){ //对data进行加密
//                 encryptData = App.Crypto.aesEncrypt(ecdhKey, JSON.stringify(tmpData))
//                 reqData = {cipher: encryptData};
//             }else{
//                 reqData = data;
//             }
//         }else{
//             reqData = data;
//         }
//         return jQuery[method](url, reqData, function(res){
//             if(App.Net.encrypt){ //解密
//                 ecdhKey = sessionStorage.getItem("ecdhKey");
//                 try{
//                     res = App.Crypto.aesDecrypt(ecdhKey, res);
//                 }catch(e){
//                     // TODO retry
//                     App.Fn.exchangeKey(function(){
//                         App.Net[method](url, data, callback, type);
//                     })
//                     return;
//                 }
//             }
//             if(type === 'json'){ //如果是json，先处理
//                 var res = jQuery.parseJSON(res)
//                 if(res.encrypt === 1){
//                     callback(jQuery.parseJSON(res.ret));
//                 }else{
//                     callback(res);
//                 }
//             }else if(type === 'text'){
//                 callback(String(res))
//             }else{ //TODO 其他情况，暂时不考虑
//                 callback(res);
//             }
//         }, 'text')
//     }
// })

//重写jQuery.ajax
App.Net.ajax = jQuery.ajax;
jQuery.ajax = function(url, options){
    if ( typeof url === "object" ) {
        options = url;
        url = undefined;
    }
    if(options.url === '/register/' || options.url === '/pubkey/exchange/'){
        return App.Net.ajax(url, options);
    }
    // if(typeof options.encrypt !== 'undefined' && !options.encrypt){
    //     return App.Net.ajax(url, options);
    // }
    if(!App.Net.encrypt){
        return App.Net.ajax(url, options);
    }else{
        var newOptions;
        newOptions = $.extend(true, {}, options);
        var tmpData, reqData, encryptData;
        var ecdhKey = localStorage.getItem("ecdhKey");
        if(newOptions.data){
            tmpData = {
                ret: newOptions.data,
                encrypt: 1
            };
        }else{
            tmpData = {
                ret: {},
                encrypt: 1
            }
        }
        encryptData = App.Crypto.aesEncrypt(ecdhKey, JSON.stringify(tmpData));
        reqData = {cipher: encryptData};
        newOptions.data = reqData;

        var tmpSuccess = newOptions.success;
        newOptions.success = function(res, status, xhr){
            try{
                res = App.Crypto.aesDecrypt(ecdhKey, res);
            }catch(e){
                App.Fn.exchangeKey(function(){ //重试
                    jQuery.ajax(url, options);
                })
                return;
            }
            var type = options.dataType;
            if(type === 'json'){ //如果是json，先处理
                res = jQuery.parseJSON(res)
                if(res.encrypt === 1){
                    tmpSuccess(jQuery.parseJSON(res.ret), status, xhr);
                }else{
                    tmpSuccess(res, status, xhr)
                }
                
            }else if(type === 'text'){
                res = jQuery.parseJSON(res)
                if(res.encrypt === 1){
                    tmpSuccess(String(res.ret), status, xhr)
                }else{
                    tmpSuccess(res, status, xhr)
                }
                
            }else{ //TODO 其他情况，暂时不考虑
                tmpSuccess(res);
            }
        }
        newOptions.dataType = 'text';

        return App.Net.ajax(url, newOptions);
    }
}

App.UI = App.UI || {};

/*
    提示信息，第二个参数为显示时长，可选
    使用方法：
    App.success('成功');
    App.fail('失败');
    App.success('message', 3000);
*/
jQuery(['success', 'fail']).each(function(i, type){
    App.UI[type] = App[type] = function(message, time){
        if(!document.getElementById('noticeContainer')){
            $('<div class="notice-container" id="noticeContainer"></div>').appendTo($('body'));
        }
        var noticeContainer = $('#noticeContainer').show();
        var style = {
            success: 'alert-success',
            fail: 'alert-danger'
        }
        var notice = $('<div class="alert" role="alert"></div>');
        notice.html(message);
        notice.addClass(style[type]);
        noticeContainer.prepend(notice);
        setTimeout(function(){
            notice.fadeOut(function(){
                notice.remove();
                if(noticeContainer.find('.alert').length === 0) noticeContainer.hide();
            });
        }, time || 3000)
    }
})

/*
    使用方法：
    App.confirm({
        title: '提示标题',
        message: '提示内容',
        callback: function(f){
            //点击确定之后的回调函数
        }
    })
*/
App.confirm = App.UI.confirm = function(options){
    options = $.extend({
        title: '提示',
        callback: function(){}
    }, options);

    var dialog = '<div class="modal fade del-confirm"  tabindex="-1" role="dialog" > \
                    <div class="modal-dialog modal-sm"> \
                        <div class="modal-content"> \
                            <div class="modal-header"> \
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> \
                                <h4 class="modal-title">'+ options.title +'</h4> \
                            </div> \
                            <div class="modal-body"> \
                                <p>'+ options.message +'</p> \
                            </div> \
                            <div class="modal-footer"> \
                                <button type="button" class="btn btn-primary">确定</button> \
                                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button> \
                            </div> \
                        </div> \
                    </div> \
                </div>';
    dialog = $(dialog);
    dialog.appendTo($('body'));
    dialog.modal();
    dialog.on('hidden.bs.modal', function(){
        dialog.remove();
    });
    dialog.on('click', '.btn-primary', function(){
        dialog.modal('hide');
        options.callback(true);
    })
}

/*
    使用方法：
    new App.UI.Pager({
        el:$('#pager'),
        curPage: 1, //可选，默认1
        total: 1000, //总记录数
        pageSize: 20, //每页显示多少记录，可选，默认20
        middleCount: 9, //可选，显示多少个页码标记，默认9
        callback: function(page){ //点击页码之后的回调，参数是当前点击的页码
            //...
        }   
    })
*/
App.UI.Pager = function(options){
    this.$el = options.el; //dom节点

    this.curPage = options.curPage || 1; //当前第几页
    this.total = options.total; //总记录数
    this.pageSize = options.pageSize || 20; //每页显示多少条记录
    this.middleCount = options.middleCount || 9; //显示多少页码

    this.callback = options.callback || function(){}; //回调

    this._init();
}
App.UI.Pager.prototype = {
    _init: function(){
        this._render();
        this._bind();
    },
    _render: function(){
        var pages = [];
        var pageCount = Math.ceil(this.total / this.pageSize); //总共多少页
        if(pageCount <= 1){ //只有一页，不显示分页
            this.$el.html('');
            return;
        }

        pages.push('<ul class="pagination">');

        //上一页
        pages.push('<li class="prev-page '+ (this.curPage === 1 ? 'disabled' : '') +'"><a href="#"><span>&laquo;</span></a></li>');

        //第一页
        pages.push('<li class="'+ (this.curPage === 1 ? 'active' : '') +'" data-page="1"><a href="#">1</a></li>')

        //是否显示...
        if(this.curPage - (this.middleCount - 1) / 2 >= 4){
            pages.push('<li><a href="#">…</a></li>')
        }

        //中间部分
        var start = 2, 
            end = pageCount - 1, 
            left = Math.floor(this.middleCount - 1) / 2,
            right = (this.middleCount % 2) ? (this.middleCount - 1) / 2 : this.middleCount / 2;
        if(this.curPage - left > start + 1){
            start = this.curPage - left;
        }
        if(this.curPage + right < end - 1){
            end = this.curPage + right
        }
        for(; start <= end; start++){
            pages.push('<li class="'+ (this.curPage === start ? 'active' : '') +'" data-page="'+ start +'"><a href="#">'+ start +'</a></li>')
        }

        //是否显示...
        if(this.curPage + (this.middleCount - 1) / 2 <= pageCount - 3){
            pages.push('<li><a href="#">…</a></li>')
        }

        //最后一页
        pages.push('<li class="'+ (this.curPage === pageCount ? 'active' : '') +'" data-page="'+ pageCount +'"><a href="#">'+ pageCount +'</a></li>')

        //下一页
        pages.push('<li class="next-page '+ (this.curPage === pageCount ? 'disabled' : '') +'"><a href="#"><span>&raquo;</span></a></li>');
        
        pages.push('</ul>');
        this.$el.html(pages.join(''));
    },
    _bind: function(){
        var _this = this;
        this.$el.on('click', 'li', function(){
            var page = $(this);
            if(page.hasClass('disabled')) return;
            if(page.hasClass('active')) return;

            var curPage;
            if(page.hasClass('prev-page')){ //上一页
                curPage = _this.curPage - 1;
            }else if(page.hasClass('next-page')){ //下一页
                curPage = _this.curPage + 1;
            }else{ //页码
                curPage = page.attr('data-page');
            }

            _this.goToPage(curPage);

        }).on('click', 'a', function(e){
            e.preventDefault();
        })
    },
    goToPage: function(curPage){
        curPage = parseInt(curPage);
        if(curPage === this.curPage || isNaN(curPage)) return; //如果已经等于当前页，不做任何处理
        var pageCount = Math.ceil(this.total / this.pageSize);
        if(curPage > pageCount) curPage = pageCount;
        if(curPage <= 0) curPage = 1;

        this.curPage = curPage;
        this._render();

        this.callback(curPage);
    },
    resetTotal: function(total){
        this.total = total;
        this._render();
    },
    getTotal: function(){
        return this.total;
    },
    getCurPage: function(){
        return this.curPage;
    },
    resetCurPage: function(curPage){
        this.curPage = curPage;
        this._render();
    }
}

/*
    快速选择
    DOM结构：
        <div class="quick-choose" data-text-target="dname" data-subtext-target="dsname" id="quickChoose">
            <a href="javascript:;" data-sub-text="销售部" data-text="销售部">销售部</a>
            <a href="javascript:;" data-sub-text="技术部" data-text="技术部">技术部</a>
            <a href="javascript:;" data-sub-text="人事部" data-text="人事部">人事部</a>
            <a href="javascript:;" data-sub-text="市场部" data-text="市场部">市场部</a>
            <a href="javascript:;" data-sub-text="计划经营部" data-text="计划经营部">计划经营部</a>
        </div>
    调用：
        App.UI.QuickChoose('.quick-choose');
        App.UI.QuickChoose('#quickChoose');
*/
App.UI.QuickChoose = function(els){
    $(els).each(function(i, el){
        var el = $(el);
        var valueTarget = el.attr('data-value-target'),
            textTarget = el.attr('data-text-target'),
            subtextTarget = el.attr('data-subtext-target');
        el.on('click', 'a', function(){
            el.find('.cur').removeClass('cur');
            $(this).addClass('cur');
            var value = $(this).attr('data-value');
            var text = $(this).attr('data-text') || $(this).text();
            var subtext = $(this).attr('data-sub-text');
            $('#' + valueTarget).val(value);
            $('#' + textTarget).val(text);
            $('#' + subtextTarget).val(subtext)
        })
    })
}

/*
    分享
    App.UI.Share('hide') //隐藏分享
    App.UI.Share({
        el: $('#share'),
        url: 'url', //分享的url，可选，如果没有则默认取el上的url属性
        title: 'title', 标题，同上
        summary: 'summary', 摘要，同上
        pics: 'pics' //图片，同上
    })
*/
App.UI.Share = function(options){
    if(options === 'hide'){
        $('#shareContainer').hide();
        return;
    }

    var $el = $(options.el);
    var tpl = '<ul class="share-list"> \
                    <li><a target="_blank" href="http://connect.qq.com/widget/shareqq/index.html?url={url}&summary={summary}&pics={pics}"><i class="icon icon-qq"></i><span>QQ好友</span></a></li> \
                    <li><a target="_blank" href="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&summary={summary}&pics={pics}"><i class="icon icon-qzone"></i><span>QQ空间</span></a></li> \
                    <li><a target="_blank" href="http://service.weibo.com/share/share.php?url={url}&title={summary}&pic={pics}"><i class="icon icon-weibo"></i><span>微博</span></a></li> \
                    <li><a target="_blank" href="http://widget.renren.com/dialog/share?resourceUrl={url}&srcUrl={url}&title={title}&description={summary}&images={pics}"><i class="icon icon-renren"></i><span>人人网</span></a></li> \
                </ul>';
    if(!document.getElementById('shareContainer')){
        $('body').append('<div class="share-container" id="shareContainer"></div>');

        $('#shareContainer').on('mouseenter', function(){
            clearTimeout(App.UI.Share.st);
        }).on('mouseleave', function(){
            App.UI.Share('hide');
        })
    }

    var shareContainer = $('#shareContainer').show();
    var url = options.url || $el.data('url') || '';
    var title = options.title || $el.data('title') || '';
    var summary = options.summary || $el.data('summary') || '';
    var pics = options.pics || $el.data('pics') || '';

    var html = tpl.replace(/\{url\}/ig, encodeURIComponent(location.protocol + '//' + location.host + url))
                .replace(/\{title\}/ig, encodeURIComponent(title))
                .replace(/\{summary\}/ig, encodeURIComponent(summary))
                .replace(/\{pics\}/ig, encodeURIComponent(pics))

    shareContainer.html(html);
    var offset = $el.offset();

    shareContainer.css({
        top: offset.top + $el.height(),
        left: offset.left - shareContainer.width() + $el.width()
    })
}

//选择用户
App.UI.UserSelector = function(options){
    var $el = $(options.el);
    var dialog;
    if(document.getElementById('selectUserModal')){ //如果已经
        dialog = $('#selectUserModal');
        dialog.data('target', options.el).modal();
    }else{
        dialog = '<div id="selectUserModal" class="modal fade"> \
                        <div class="modal-dialog modal-sm"> \
                            <div class="modal-content"> \
                                <div class="modal-header"> \
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> \
                                    <h4 class="modal-title">人员选择</h4> \
                                </div> \
                                <div class="modal-body" style="max-height: 400px; overflow: auto;"> \
                                    <ul class="department-tree ztree" id="orgTree"></ul> \
                                </div> \
                            </div> \
                        </div> \
                    </div>';
        dialog = $(dialog);
        dialog.appendTo($('body'));
        dialog.data('target', options.el).modal();

        buildTree();
    }

    function buildTree(){
        var treeContainer = dialog.find('#orgTree');
        var url = '/account/org/retrieve_sub_level/';
        var setting = {
            view: {
                autoCancelSelected:false, //是否支持ctrl反选
                dblClickExpand:false, //是否双击打开
                expandSpeed:'fast',//("slow", "normal", or "fast") or 1000
                nameIsHTML:false,//name是否允许html
                selectedMulti:false, //是否支持多选
                showIcon:true,//是否显示icon
                showLine:true,//是否显示虚线
                showTitle:true //是否显示title
            },
            data: {
                keep:{
                    leaf:false,
                    parent:true
                }
            },
            async:{//异步加载所需参数
                autoParam : ['id','type'],
                dataFilter : function(treeId,parentNode,childNodes){
                    var nodes = [];
                    if(childNodes.ret.organization.length){
                        $(childNodes.ret.organization).each(function(i, department){
                            nodes.push({
                                id: department.id,
                                type: 1,
                                name: department.short_name,
                                fname: department.name,
                                sname: department.short_name,
                                isParent: true
                            })
                        })
                    }
                    if(childNodes.ret.account.length){
                        $(childNodes.ret.account).each(function(i, account){
                            nodes.push({
                                id: account.id,
                                account_id: account.id,
                                type: 2, //用户
                                name: account.real_name || name,
                                isParent: false
                            })
                        })
                    }
                    return nodes;
                }, //对返回的节点数据进行预处理。
                enable : true, //是否开启异步加载
                type: 'get',
                url : url
            },
            callback:{ //各种回调
                onClick: function(e, treeId, treeNode){
                    if(treeNode.type === 2){
                        dialog.modal('hide');
                        var target = dialog.data('target');
                        if(!target.find('#user' + treeNode.id)[0]){
                            target.append('<span id="user'+ treeNode.id +'" class="selector-item select-user"> \
                                '+ treeNode.name +' \
                                <a href="javascript:;">&times;</a> \
                                <input type="hidden" value="'+ treeNode.id +'"> \
                            </span>')    
                        }
                    }
                },
                onAsyncSuccess:function(e,treeId,treeNode,msg){ //如果没有子节点了，那么隐藏小三角
                    var childNodes = $.parseJSON(msg);
                    // if(childNodes.comapny) childNodes.company = childNodes.comapny; //bug
                    if(!(childNodes.ret.organization.length || childNodes.ret.account.length)){
                        treeNode.isParent = false;
                        treeNode.iconSkin = 'ico_close ';
                        tree.updateNode(treeNode);
                    }
                }
            }
        };
        // $.get('/account/org/retrieve/?id=' + App.Config.companyId, function(r){ //拿到默认的根目录
        //     var defaultNodes = {
        //         id: r.ret.id,
        //         type: 0,
        //         name: r.ret.name,
        //         fname: r.ret.name,
        //         sname: r.ret.short_name || r.ret.name,
        //         isParent: true
        //     };
        //     var tree = $.fn.zTree.init(treeContainer, setting, defaultNodes);
        //     tree.expandNode(tree.getNodes()[0])
        // }, 'json')
    }

    if(!$el.data('bind')){
        $el.on('click', 'a', function(e){
            $(this).parent().remove();
            e.stopImmediatePropagation();
        })
        $el.data('bind', true);
    }
}

//选择角色
App.UI.RoleSelector = function(options){
    var $el = $(options.el);
    var dialog;
    if(document.getElementById('selectRoleModal')){ //如果已经
        dialog = $('#selectRoleModal');
        dialog.data('target', options.el).modal();
    }else{
        dialog = '<div id="selectRoleModal" class="modal fade"> \
                        <div class="modal-dialog modal-sm"> \
                            <div class="modal-content"> \
                                <div class="modal-header"> \
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> \
                                    <h4 class="modal-title">角色选择</h4> \
                                </div> \
                                <div class="modal-body" style="max-height: 400px; overflow: auto;"> \
                                    <ul class="role-list" id="roleList"></ul> \
                                </div> \
                            </div> \
                        </div> \
                    </div>';
        dialog = $(dialog);
        dialog.appendTo($('body'));
        dialog.data('target', options.el).modal();

        buildList();
    }

    function buildList(){
        var roleList = $('#roleList');
        // $.get('/account/role_def/list/', {
        //     domain_id: App.Config.companyId
        // }, function(r){
        //     var list = [];
        //     $(r.ret).each(function(i, role){
        //         list.push('<li data-id="'+ role.id +'">'+ role.name +'</li>');
        //     })
        //     roleList.html(list.join(''));
        // }, 'json');

        roleList.on('click', 'li', function(){
            dialog.modal('hide');
            var target = dialog.data('target');
            var id = $(this).data('id');
            var name = $(this).text();
            if(!target.find('#role' + id)[0]){
                target.append('<span id="role'+ id +'" class="selector-item select-role"> \
                    '+ name +' \
                    <a href="javascript:;">&times;</a> \
                    <input type="hidden" value="'+ id +'"> \
                </span>')    
            }
        })
    }

    if(!$el.data('bind')){
        $el.on('click', 'a', function(e){
            $(this).parent().remove();
            e.stopImmediatePropagation();
        })
        $el.data('bind', true);
    }
}

//统一的验证
/*
    使用方法：
    <div class="form-group" data-validate="required|email|..."> ... </div>
    必须用在form-group元素上
    
    然后在适当的地方调用 $('#formId').validate(); 即可初始化
    手动的测试单个表单域是否通过验证：$('#formId').validate('validateField', field);
    手动的测试所有表单域是否通过验证：$('formId').validate('validateAll');
*/
;(function($){
    var validate = {
        messages: {
            remote: {
                pending: '',
                error: '',
                fail: ''
            },
            required: '请填写内容',
            email: '请输入正确的邮箱',
            url: '请输入正确的url',
            date: '请输入正确的日期',
            mobile: '请输入正确的手机号',
            idcard: '请输入正确的身份证',
            maxlength: '不能超过{{1}}个字符',
            minlength: '不能少于{{1}}个字符',
            rangelength: '必须是{{1}}-{{2}}个字符',
            number: '请输入数字',
            money:'请输入数字',
            max: '不能大于{{1}}',
            min: '不能小于{{1}}',
            range: '必须在{{1}}-{{2}}之间',
            equalTo: '必须和{{2}}相同'
        },
        rules: {
            remote: function(){ //TODO:远程验证

            },
            required: function(value){
                return $.trim(value) === '';
            },
            email: function(value){
                if($.trim(value) === '') return false;
                return !/^[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(value);
            },
            url: function(value){
                if($.trim(value) === '') return false;
                return !/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
            },
            date: function(value){
                if($.trim(value) === '') return false;
                return !/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
            },
            mobile: function(value){
                if($.trim(value) === '') return false;
                return !/(^(13\d|14[57]|15[^4,\D]|17[678]|18\d)\d{8}|170[059]\d{7})$/.test(value)
            },
            idcard: function(value){
                if($.trim(value) === '') return false;
                return !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
            },
            maxlength: function(value, params){
                if($.trim(value) === '') return false;
                var max = parseInt(params, 10);
                return value.length > max;
            },
            minlength: function(value, params){
                if($.trim(value) === '') return false;
                var min = parseInt(params, 10);
                return value.length < min;
            },
            rangelength: function(value, params){
                if($.trim(value) === '') return false;
                params = params.replace(/[\[\]]/g, '').split(',')
                var min = parseInt(params[0], 10);
                var max = parseInt(params[1], 10);
                return value.length > max || value.length < min;
            },
            number: function(value){
                if($.trim(value) === '') return false;
                return !$.isNumeric(value);
            },
            money: function(value){
                if($.trim(value) === '') return false;
                return !$.isNumeric(value);
            },
            max: function(value, params){
                if($.trim(value) === '') return false;
                value = parseInt(value, 10);
                var max = parseInt(params, 10);
                return value > max;
            },
            min: function(value, params){
                if($.trim(value) === '') return false;
                value = parseInt(value, 10);
                var min = parseInt(params, 10);
                return value < min;
            },
            range: function(value, params){
                if($.trim(value) === '') return false;
                params = params.replace(/[\[\]]/g, '').split(',');
                value = parseInt(value);
                var min = parseInt(params[0], 10);
                var max = parseInt(params[1], 10);
                return value > max || value < min;
            },
            equalTo: function(value, params){
                if($.trim(value) === '') return false;
                params = params.replace(/[\[\]]/g, '').split(',');
                var to = $('#' + params[0])[0] || $('[name='+ params[0] +']')[0];
                to = $(to);
                return value !== to.val();
            }
        },
        success: function(field){
            field.removeClass('has-error').addClass('has-success');
            field.find('.control-msg').empty();
        },
        fail: function(field, msg){
            field.removeClass('has-success').addClass('has-error');
            field.find('.control-msg').text(msg);
        },
        reset: function(field){
            field.removeClass('has-success').removeClass('has-error');
            field.find('.control-msg').text(field.find('.control-msg').data('tips'));
        }
    }
    var methods = {
        init: function(options){ //初始化
            //获取需要验证的表单域
            if(this.data('hasInit')){
                this.find('[data-validate]').removeClass('has-error').removeClass('has-success');
                this.find('[data-validate]').find('.control-msg').empty();
                return;
            }
            var fields = this.find('[data-validate]');

            fields.each(function(){
                var field = $(this);
                var validation = field.data('validate'),
                    target = field.find('input, select, textarea');

                if(field.find('.control-msg').length === 0){ //错误显示
                    field.append('<div class="control-label control-msg"></div>');
                }else{
                    field.find('.control-msg').data('tips', field.find('.control-msg').text()); //暂存提示
                }

                if(target.prop('disabled') || target.prop('readonly')){
                    return;
                }

                target.on('change blur', function(){
                    fields.validate('validateField', field);
                }).on('focus', function(){
                    validate.reset(field);
                })
            })

            this.data('hasInit', true)
            return this;
        },
        validateAll: function(){ //手动验证所有，并返回是否通过验证
            var fields = this.find('[data-validate]');
            var flag = true;
            fields.each(function(){
                var field = $(this);
                var result = fields.validate('validateField', field);
                flag = flag && result;
            })
            return flag;
        },
        validateField: function(field){ //验证单个表单域，并返回是否通过验证
            var validation = field.data('validate'),
                target = field.find('input, select, textarea');
            var value = target.val();
            var flag = true;
            $(validation.split('|')).each(function(i, v){ //验证规则
                var rule = v.split(':')[0],
                    params = v.split(':')[1]

                if(validate.rules[rule]){
                    //如果不通过，以最先的为准。 TODO: 可以多条规则同时显示
                    if(validate.rules[rule](value, params)){
                        var msgInfo = [];
                        if(params){
                            msgInfo = params.replace(/[\[\]]/g, '').split(',');
                        }
                        validate.fail(field, validate.messages[rule].replace('{{1}}', msgInfo[0]).replace('{{2}}', msgInfo[1]).replace('{{3}}' ,msgInfo[2]));
                        flag = false;
                        return false;
                    }
                }
            })
            if(!flag) return false;

            //如果都通过验证
            validate.success(field);
            return true;
        }
    }

    $.fn.validate = function(method){
        if(methods[method]){
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }else if(typeof method === 'object' || !method){
            return methods.init.apply(this, arguments);
        }else{
            $.error('Method' + method + 'does not exist on jQuery.validate');
        }
    }

})(jQuery);