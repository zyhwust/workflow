//统一的验证
/*
    使用方法：
    <div class="form-group" data-validate="required|email|..."> ... </div>
    必须用在form-group元素上
    
    然后在适当的地方调用 $('#formId').validate(); 即可初始化
    手动的测试单个表单域是否通过验证：$('#formId').validate('validateField', field);
    手动的测试所有表单域是否通过验证：$('formId').validate('validateAll');
*/
;(function(){
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
            $.error('Method' + method + 'does not exist on $.validate');
        }
    }

})();