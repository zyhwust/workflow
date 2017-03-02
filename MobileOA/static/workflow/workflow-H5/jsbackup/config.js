// 给手机端用于设置userId
function setData(userObj) {
    console.log('start processing \n');
    var data = userObj;
    console.log('userId:' + userObj.userId + '\n');
    localStorage.clear();
    
    localStorage.userId = data.userId || '-1';
    localStorage.userName = data.userRealname || '';
    localStorage.sid = data.sid || '-1';
    localStorage.deviceType = data.deviceType || 'web';
    localStorage.deviceId = data.deviceId || '';
    localStorage.unDealNum = data.unDealNum || '';
    
    // console.log(localStorage.userId);
    // console.log(localStorage.userName);
    // console.log(localStorage.sid);
    // console.log(localStorage.deviceType);
    // console.log(localStorage.deviceId);
}

function clearlocalStorage(){
    localStorage.clear();
}

// var unDealNum = {};
// function setUnDealNum(obj){
//     var data = obj;
//     unDealNum.unDealNum = data.unDealNum;
//     console.log("unDealNum:"+unDealNum.unDealNum);
// }
// var obj = {
//     "unDealNum" : 54
// }
// setUnDealNum(obj);
// 初始化工作流
var App = App || {};
App.Config = App.Config || {};
	
App.Config.accountId = localStorage.userId;
App.Config.accountName = localStorage.userName;
App.Config.companyId = '56fb8aaa17f52a1de0b9677c';
App.Config.companyName = '武汉市第五医院';
App.Config.departmentId = '575e64f86aea11412d46adea';
App.Config.departmentName = '部门名称';		

var PAGE = {
    // 新建审批
    "newWorkflow": '../html/workflow_new.html',
    // 流程详情
    "detail": '../html/workflow_detail.html',
};
// for(var key in PAGE) {
//     PAGE[key] = WEB_URL + PAGE[key];
// }
var API = {
    "getDeflist": 'admin/workflow/2605.spring',
    // 获取工作流定义信息
    "getWorkflowDefInfo":'admin/workflow/2602.spring',
    //创建流程实例
    "createWorkflowIns":'admin/workflow/2631.spring',
    // 获取当前流程实例信息
    "getCurrentInfo":'admin/workflow/2632.spring',
    // 提交工作流实例(流转)
    "submitWorkflowIns":'admin/workflow/2671.spring',
    //获取表单定义的内容
    "getFormInfo":'admin/workflowform/2503.spring',
    //提交表单，更新表单实例
    "submitWorkflow":'admin/workflowform/2504.spring',
    // 获取表单实例列表
    "getFormInsList":'admin/workflowform/2505.spring',
    // 提交流程实例-退回
    "rollback":'admin/workflow/2672.spring',
};


// 测试地址
// var WEB_URL = '../';
var BASE = {};
BASE.url = 'http://localhost:81/MOA/';
BASE.url = 'http://120.132.85.24:8080/MOA/';
// 真实环境
// BASE.url = (document.domain == 'localhost' ? 'http://120.132.85.24:8080' : document.location.origin) + '/MOA/',
// BASE.JFurl = (document.domain == 'localhost' ? 'http://120.132.85.24:8080' : document.location.origin) + '/jflow-web/OA/';
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
        errFn = obj.error,
        asy = obj.asy,
        type = obj.type
        ;
    if(typeof url != 'string' || Object.prototype.toString.call(args).toLowerCase() != '[object object]' || typeof sucFn != 'function') {
        console.log('参数错误2');
        return;
    }
    var data = obj.args;
    data.sid = localStorage.sid || '-1';
    data.loginId = localStorage.userId || '-1';
    data.deviceType = localStorage.deviceType || 'web';
    data.deviceId = '';
    var fun = function(rst) {
        if(rst.code == 200 || rst.code == 1) {
            sucFn(rst);
        }
        if(rst.code != 200 && rst.code != 1) {
            errFn === undefined ? tools.toast(rst.ret) : (typeof errFn === 'function' ? errFn(rst) : App.fail('error'));
        }
    }

    // $.ajax({
    //     url: BASE.url + url,
    //     type: 'post',
    //     async: asy === undefined ? true : (asy === false ? false : true),
    //     contentType: 'application/json',
    //     data: JSON.stringify(data)
    // }).then(fun, function() {tools.toast('网络错误', 'error');});

        // 原生XMLHttpRequest
    var xhr = new XMLHttpRequest();
    var async = asy === undefined ? true : (asy === false ? false : true);
    type = (type === undefined) ? "post" : type;
    xhr.open(type, BASE.url + url, async);
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
            if( (xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 ) {
                var res = JSON.parse(xhr.responseText);
                fun(res);
            }else {
                // tools.busy(false);
                tools.toast('网络不给力');
            }       
        }
    }   
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

//  消息弹出
var  tools = {
    toast : function (message) {
        var $toast = '<div id="toast"> \
                        <div class="weui-mask_transparent"></div> \
                        <div class="weui-toast"> \
                            <p class="weui-toast__content">'+ message +'</p> \
                        </div> \
                    </div>';
        $('body').append($toast);
    },

    busy : function ( canceal ) {
        if(canceal === false)
            $(".loadwrap").remove();
        else {
            // var $div = $("<div class='loadwrap'><div class='load'><span class='fa fa-spinner fa-spin fa-fw fa-2x'></span></div></div>");
            var $div = $("<div class='loadwrap'><span class='fa fa-spinner fa-spin fa-fw fa-2x'></span></div>");
            $("body").append($div);
        }
    }
}

// xss防范
var encodeHtml = function(str) {
    if(typeof str !== 'string') {
        return str;
    }
    return (str + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\x60/g, '&#96;').replace(/\x27/g, '&#39;').replace(/\x22/g, '&quot;');
};
