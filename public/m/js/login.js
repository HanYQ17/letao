$(function () {



    login(); //调用登录事件





    function login() {

        $('.btn-login').on('tap', function () {
            var userName = $('.userName').val();
            if(!userName){
                mui.toast('请输入用户名',{ duration:'short', type:'div' }) 
                return;
            }
            var password = $('.password').val();
            if(!password){
                mui.toast('请输入密码',{ duration:'short', type:'div' }) 
                return;
            }
            $.ajax({
                url: '/user/login',
                type: 'post',
                data: {
                    username: userName,
                    password: password
                },
                success: function (data) {
                    if (data.error) {
                        mui.toast('请输入正确的用户名或密码', { duration: 'short', type: 'div' })
                    } else {
                        var returnUrl = getQueryString('returnUrl');
                        location = returnUrl;
                    }
                }
            })
        })
    }

    //获取url值的函数     从网上查找
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURI(r[2]);  //解码方式要改成decodeURI
        }
        return null;
    }



})