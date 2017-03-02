var BASE = {};
// 接口路径
// 测试环境
// ASE.url = 'http://120.132.85.24:8080/MOA',
// BASE.JFurl = 'http://120.132.85.24:8080/jflow-web/OA',
// 真实环境
BASE.url = (document.domain == 'localhost' ? 'http://120.132.85.24:8080' : document.location.origin) + '/MOA',
BASE.JFurl = (document.domain == 'localhost' ? 'http://120.132.85.24:8080' : document.location.origin) + '/jflow-web/OA',

// BASE.url = 'http://localhost:81/MOA',
// BASE.JFurl = 'http://localhost:81/jflow-web/OA';
BASE.pageSize = 10,
// ajax请求报错
BASE.error = '网络错误';

// 初始化工作流
var App = App || {};
App.Config = App.Config || {};
    
App.Config.accountId = localStorage.userId;
App.Config.accountName = localStorage.userName;
App.Config.companyId = '56fb8aaa17f52a1de0b9677c';
App.Config.companyName = '武汉市第五医院';
App.Config.departmentId = '575e64f86aea11412d46adea';
App.Config.departmentName = '部门名称';     


var API = {
    "getDeflist": '/admin/workflow/2605.spring',
    // 获取工作流定义信息
    "getWorkflowDefInfo":'/admin/workflow/2602.spring',
    //创建流程实例
    "createWorkflowIns":'/admin/workflow/2631.spring',
    // 获取当前流程实例信息
    "getCurrentInfo":'/admin/workflow/2632.spring',
    // 提交工作流实例(流转)
    "submitWorkflowIns":'/admin/workflow/2671.spring',
    //获取表单定义的内容
    "getFormInfo":'/admin/workflowform/2503.spring',
    //提交表单，更新表单实例
    "submitWorkflow":'/admin/workflowform/2504.spring',
    // 获取表单实例列表
    "getFormInsList":'/admin/workflowform/2505.spring',
    // 提交流程实例-退回
    "rollback":'/admin/workflow/2672.spring',
};

// xss防范
var encodeHtml = function(str) {
    if(typeof str !== 'string') {
        return str;
    }
    return (str + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\x60/g, '&#96;').replace(/\x27/g, '&#39;').replace(/\x22/g, '&quot;');
};

/**
 * [ajax请求封装函数]
 * @url  {[string]}         [请求地址]
 * @args {[object]}         [发送参数(可为空)]
 * @success {[function]}         [code为1时执行函数]
 * @error {[function]}         [code不为1时执行函数(可为空)]
 * @asy {[boolean]}         [是否为异步/true为默认值异步(可为空)]
 */
function Ajax(obj) {

    if(Object.prototype.toString.call(obj).toLowerCase() != '[object object]') {
        console.log('参数错误1');
        return;
    }
    var url = obj.url,
        args = obj.args,
        sucFn = obj.success,
        errFn = obj.error || function(rst) {tools.toast(rst.msg, 'error')},
        asy = obj.asy
        ;
    if(typeof url != 'string' || Object.prototype.toString.call(args).toLowerCase() != '[object object]' || typeof sucFn != 'function') {
        console.log('参数错误2');
        return;
    }
    var data = obj.args;
    data.sid = localStorage.sid || '-1';
    data.loginId = localStorage.userId || '-1';
    data.deviceType = 'web';
    data.deviceId = '';
    var fun = function(rst) {
        if(rst.code == 200 || rst.code == 1) {
            sucFn(rst);
        }
        if(rst.code == 404) {
            window.location.href = BASE.url + '/MobileOA/dist/index.html#!/login';
            return;
        }
        if(rst.code != 200 && rst.code != 1) {
            errFn(rst);
        }
    }

    // $.ajax({
    //     url: BASE.url + url,
    //     type: 'post',
    //     async: asy === undefined ? true : (asy === false ? false : true),
    //     contentType: 'application/json',
    //     data: JSON.stringify(data),
    //     timeout: 10000
    // }).then(fun, function() {
    //     tools.busy(false);
    //     tools.toast('网络不给力', 'error');
    // });


    // 原生XMLHttpRequest
    var xhr = new XMLHttpRequest();
    var async = asy === undefined ? true : (asy === false ? false : true);
    xhr.open('post', BASE.url + url, async);
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
            if( (xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 ) {
                var res = JSON.parse(xhr.responseText);
                fun(res);
            }else {
                tools.busy(false);
                tools.toast('网络不给力', 'error');
            }       
        }
    }   
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));

}

//验证
function regLegal(label) {
  var reg = {
    phone: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
    pwd: /^\w+$/,
    code: /^\d+$/,
    name: /^[\u4E00-\u9FA5]{2,5}$/,
    password: /^\w+$/,
  }
  return this[label]!=''&&reg[label].test(this[label]);
}


//  消息弹出
var  tools = {
    toast : function (message,type) {
        type = type || "default";
        var $div = $("<div class='toastwrap'><div class='toast'>"+message+"</div></div>");
        $div.find(".toast").addClass(type);
        $("body").append($div);
        $div.fadeIn(500,function(){
            var $this = $(this);
            setTimeout(function(){
                $this.fadeOut(1000,function(){
                $this.remove();
            });
            },1000);
        });
    },
    busy : function ( canceal ) {
        if(canceal === false)
            $(".loadwrap").remove();
        else {
            // var $div = $("<div class='loadwrap'><div class='load'><span class='fa fa-spinner fa-spin fa-fw fa-2x'></span></div></div>");
            // var $div = $("<div class='loadwrap'><span class='fa fa-spinner fa-spin fa-fw fa-2x'></span></div>");
            // $("body").append($div);
            if($(".loadwrap").length != 0) {
                return;
            }
            var $div = $("<div class='loadwrap'><span class='fa fa-spinner fa-spin fa-fw fa-2x'></span></div>");
            $("body").append($div);
        }
    }
}

// 加载css
var loadCss = function(arr) {
    var head = document.querySelector('head');
    for(var i = 0, item; item = arr[i++]; ) {
        var stylesheet = document.createElement('link');
        stylesheet.setAttribute('rel', 'stylesheet');
        stylesheet.setAttribute('href', item);
        head.insertBefore(stylesheet, head.firstChild);
    }
}
var removejscssfile =  function(filename, filetype){
    var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none";
    var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none";
    var allsuspects=document.getElementsByTagName(targetelement);
    for (var i=allsuspects.length; i>=0; i--){
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
            allsuspects[i].parentNode.removeChild(allsuspects[i])
    }
}
// 顺序执行js，参数为js地址数组
var loadScript = function(arr) {
    var script = document.createElement('script');
    script.src = arr.shift();
    script.onload = function() {
        if(arr.length === 0) {
            return;
        }     
        loadScript(arr);   
    }
    document.querySelector('body').appendChild(script);
}
