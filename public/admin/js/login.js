$(function(){
    $('.btn-login').on('click',function(){
        var username = $('#inputEmail3').val().trim();
        var password = $('#inputPassword3').val().trim();
        if(!username || !password){
            alert('请输入用户名和密码');
        }
        $.ajax({
            url:'/employee/employeeLogin',
            type:'post',
            data:{
                username:username,
                password:password
            },
            success:function(data){
                console.log(data);
                if(data.error){
                    alert(data.message);
                }else{
                    location = 'index.html'
                }
            }
        })
    })
})