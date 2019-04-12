 //退出登录
 function exit() {
    $('#right .title .right').on('click', function () {
        $.ajax({
            url: '/employee/employeeLogout',
            success: function (data) {
                if (data.success) {
                    location = 'login.html';
                } else {
                    alert('退出失败!');
                }
            }
        })
    })
}