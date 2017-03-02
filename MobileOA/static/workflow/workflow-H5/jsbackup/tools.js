var STATIC_URL_H5 = '../img/';
var WEB_URL_H5 = './';
// xss防范
var encodeHtml = function(str) {
    if(typeof str !== 'string') {
        return str;
    }
    return (str + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\x60/g, '&#96;').replace(/\x27/g, '&#39;').replace(/\x22/g, '&quot;');
};

//  消息弹出
var  tools = {
    toast : function (message) {
        var $toast = '<div id="toast"> \
                        <div class="weui-mask_transparent"></div> \
                        <div class="weui-toast"> \
                            <i class="weui-icon-cancel-no-circle weui-icon_toast"></i> \
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