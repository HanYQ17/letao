$(function () {

    var currentPage = 1; //当前显示默认第几页
    var totalPages = 1; //总页数

    first_classify();
    addTopCategory();
    exit(); //退出登录


    //渲染
    function first_classify() {
        $.ajax({
            url: '/category/queryTopCategoryPaging',
            data: {
                page: currentPage,
                pageSize: 5
            },
            success: function (data) {
                console.log(data);
                var html = template('firstClassifyTpl', data);
                $('#right tbody').html(html);
                totalPages = Math.ceil(data.total / data.size);
                page();  
            }
        })
    }


    //分页初始化
    function page() {
        $("#page").bootstrapPaginator({
            bootstrapMajorVersion: 3, //对应的bootstrap版本
            currentPage: currentPage, //当前页数
            numberOfPages: 10, //每次显示页数
            totalPages: totalPages, //总页数
            shouldShowPage: true,//是否显示该按钮
            useBootstrapTooltip: false,//是否显示提示
            //点击事件
            onPageClicked: function (event, originalEvent, type, page) {
                currentPage=page;
                first_classify();
            }
        });
    }

    //添加分类
    function addTopCategory(){
        $('#right .btn-addTopCategory').on('click',function(){
            var text = $('.Cate_text').val().trim();
            if(!text){
                alert('分类名不能为空');
                return false; //阻止默认行为
            }
            $.ajax({
                url:'/category/addTopCategory',
                type:'post',
                data:{
                    categoryName:text
                },
                success:function(data){
                    if(data.success){
                        first_classify();
                    }
                }
            })
        })
    }
 
})