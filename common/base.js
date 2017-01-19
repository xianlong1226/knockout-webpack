module.exports = {
    ajaxBase: function(url, type, data, callback) {
        $.ajax({
            url: url,
            type: type,
            cache: false,
            data: data,
            success: function(result) {
                if($.trim(result.result) === 'failed' && $.trim(result.message) === '未正常登录'){
                    return location.href = result.data.returnurl;
                }
                if (callback) {
                    callback(result);
                }
            },
            error: function(xhr,message) {
                if(xhr.status == 403){
                    return location.href = 'triallogin.html';
                }
                console.error(xhr);
                console.error(message);
                jynotify.error('网络异常',3000);
            }
        });
    },
    ajaxGet: function(url, data, callback) {
        this.ajaxBase(url, 'get', data, callback);
    },
    ajaxPost: function(url, data, callback) {
        this.ajaxBase(url, 'post', data, callback);
    }
}