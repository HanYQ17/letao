$(function () {
    var currentPage = 1;
    var totalPages = 1;

    querySecondCategory(); //渲染页面
    addBrand();  //添加品牌
    exit(); //退出登录


    //渲染页面
    function querySecondCategory() {
        $.ajax({
            url: '/category/querySecondCategoryPaging',
            data: {
                page: currentPage,
                pageSize: 3
            },
            success: function (data) {
                // console.log(data);
                var html = template('secondCategoryTpl', data);
                $('#right tbody').html(html);
                totalPages = Math.ceil(data.total / data.size);
                pageSecondCategory(); //调用分页
            }
        })
    }
 
    //初始化分页
    function pageSecondCategory() {
        $("#page").bootstrapPaginator({
            bootstrapMajorVersion: 3, //对应的bootstrap版本
            currentPage: currentPage, //当前页数
            numberOfPages: 10, //每次显示页数
            totalPages: totalPages, //总页数
            shouldShowPage: true,//是否显示该按钮
            useBootstrapTooltip: true,
            //点击事件
            onPageClicked: function (event, originalEvent, type, page) {
                currentPage = page;
                querySecondCategory(); //重新渲染页面
            }

        })
    }

    //添加品牌
    function addBrand() {

        $('#right .btn_add').on('click', function () {
            $.ajax({
                url: '/category/queryTopCategory',
                success: function (data) {
                    // console.log(data);
                    var html = '';
                    for (var i = 0; i < data.rows.length; i++) {
                        html += '<option value="' + data.rows[i].id + '">' + data.rows[i].categoryName + '</option>';
                    }
                    $('#TopCategory').html(html);

                }
            })
        })

        $('#right .select_file').on('change', function () {
            var file = this.files[0]; //获取图片的所有信息
            // console.log(file);
            if (!file) {
                alert('请选择图片');
                return;
            }

            // 使用jquery的ajax提交文件上传,并实现本地预览
            var formData = new FormData(); //创建一个formData格式的对象
            formData.append('pic1', file); //把图片文件放到这个对象里面才可以传
            $.ajax({
                url: '/category/addSecondCategoryPic',
                type: 'post',
                cache: false,
                data: formData,
                processData: false, // 防止数据转成字符串
                contentType: false, // 防止浏览器使用这种编码对文件加密
                cache: false,  //取消浏览器的缓存
                success: function (data) {
                    // console.log(data.picAddr); //如果返回data有数据表示上传成功 成功把图片路径显示到预览图片标签上
                    $('.select-img').attr('src', data.picAddr); //把图片标签src属性改成后台返回真正图片路径
                }
            });
        })

        $('#right .btn-addBrand').on('click', function () {
            var brandName = $('.trademark').val().trim();
            var categoryId = $('#TopCategory option').val();
            var idbrandLogo = $('.select-img').attr('src');
            if (!brandName || !idbrandLogo) {
                alert('品牌和图片不能为空!');
                return false;
            }
            $.ajax({
                url: '/category/addSecondCategory',
                type: 'post',
                data: {
                    brandName:brandName,
                    categoryId:categoryId,
                    brandLogo:idbrandLogo,
                    hot:1
                },
                success:function(data){
                    console.log(data);
                    if(data.success){
                        querySecondCategory();
                        brandName = $('.trademark').val('');
                        idbrandLogo = $('.select-img').attr('src','');
                    }
                }
            })
        })



    }


})