$(function () {
    var currentPage = 1; //当前显示默认第几页
    var totalPages = 1; //总页数
    queryUser(); //获取数据  (获取数据后就要调用初始化分页,点击事件后又要重新渲染页面)
    exit(); //退出登录
    updateUser(); //状态修改
 
    //获取数据
    function queryUser() {
        $.ajax({
            url: '/user/queryUser',
            data: {
                page: currentPage, //参数要记得替换成currentPage
                pageSize: 5
            },
            success: function (data) {
                console.log(data);
                var html = template('userTpl', data);
                $('#right .content tbody').html(html);
                totalPages = Math.ceil(data.total / data.size);  //获取总页数 = 总数 / 显示数 ,向上取整
                page(); //分页  不能放在全局调用,请求完数据知道总页数才能初始化分页
            }
        })
    }

    //初始化分页
    function page() {
        $("#page").bootstrapPaginator({
            bootstrapMajorVersion: 3, //对应的bootstrap版本
            currentPage: currentPage, //当前页数
            numberOfPages: 10, //每次显示页数
            totalPages: totalPages, //总页数
            shouldShowPage: true,//是否显示该按钮
            useBootstrapTooltip: false,
            //点击事件
            onPageClicked: function (event, originalEvent, type, page) {
                currentPage = page;  //page代表点击的页
                queryUser(); //鼠标点击了页数就要重新渲染页面
            }
        })
    }

    //状态修改
    function updateUser() {
        $('#right tbody').on('click', '.btn_index', function () {
            var id = $(this).data('id');
            var isDelete = $(this).data('isDelete');
            isDelete = isDelete ? 0 : 1; //修改isDelete的值,如果之前是0则变成1,是1变成0  判断isDelete是否等于1,等于返回0,否则返回1
            $.ajax({
                url: '/user/updateUser',
                type: 'post',
                data: {
                    id: id,
                    isDelete: isDelete
                },
                success: function (data) {
                   if(data.success){
                    queryUser(); //修改成功必须重新渲染
                   }
                }
            })
        })
    }
})