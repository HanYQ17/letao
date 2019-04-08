$(function () {
    var search;  //声明一个全局变量,因为多处函数也要用到,全局变量尽量放在最前面

    searchProduct(); //调用搜索商品的函数
    nowSearchProduct(); //调用当前页面商品搜索的函数
    sortProduct(); //调用商品的排序
    pullRefresh(); //调用初始化下拉刷新和上拉加载

    // 定义一个搜索商品的函数
    function searchProduct() {
        search = getQueryString('search'); //调用封装好的获取url参数的值的方法 传入参数名获取参数的值
        queryProduct({   //公共函数去搜索商品 把当前search放到参数对象作为实参传递
            proName: search
        });
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

    // 定义当前页面商品搜索的函数
    function nowSearchProduct() {
        $('.btn-search').on('tap', function () {  //给搜索按钮添加点击事件
            search = $('.input-search').val().trim(); //获取当前输入内容
            if (search == "") return;  //为空,则什么都不做,返回
            queryProduct({    //公共函数去搜索商品 把当前search放到参数对象作为实参传递
                proName: search,
            })
        })
    }


    //调用商品的排序
    /* 思路:
        1. 点击了排序按钮做排序 （价格 和 销量）
        2. 知道点击价格还是销量 为了区分排序方式设置一个排序方式属性在a标签上
        3. 点击的时候获取当前属性 data-type排序类型 做对应的排序(点击了价格获取price 就进行price的排序)
        4. 还要获取排序的顺序把顺序存储到标签上 通过data-sort属性设置当前排序的顺序
        5. 判断排序顺序 如果是1 升序 就要改成 2 降序  如果是2改成1
        6. 最后传入排序类型和顺序   
        7. 获取到数据调用模板  渲染模板  */
    function sortProduct() {
        $('.mui-card-header span').on('tap', function () {  //给所有按钮添加点击事件
            var type = $(this).data('type'); //获取当前排序类型
            var sort = $(this).data('sort'); //获取当前的排序顺序
            if (sort == 1) {  //需要修改sort
                sort = 2;   //如果排序顺序是1 即将要变成2  把原来的类名fa-angle-down 换成fa-angle-up
                $(this).children('i').removeClass('fa-angle-down').addClass('fa-angle-up');  
            } else {
                sort = 1;
                $(this).children('i').removeClass('fa-angle-up').addClass('fa-angle-down');
            }
            $(this).data('sort', sort);  //重新赋值,,修改完成sort重新保存到当前元素的data-sort属性上
            $(this).addClass('active').siblings().removeClass('active');  //切换active类名

            var obj = {
                proName: search,
                page: 1,
                pageSize: 2,
            }
            // obj[key] = value 给对象添加一个动态的属性和值
            obj[type] = sort;  //往对象里添加属性和属性值
            queryProduct(obj);  //调用公共函数去查询商品列表
        })
    }


    //封装获取公共API数据
    //params就是参数对象 接收一个传递过来的参数对象 里面有page pageSize proName等数据
    function queryProduct(params) { 
        params.page = params.page || 1;  //根据接口文档,page和pageSize是必填项
        params.pageSize = params.pageSize || 2;
        $.ajax({
            url: "/product/queryProduct",
            data: params
            // {
            //     proName: params.proName,
            //     page: params.page || 1,
            //     pageSize: params.pageSize || 2,
            // }
            ,
            success: function (data) {
                // console.log(data);
                // console.log(data.data);
                var html = template('productTmp', data);  //调用模板
                $('.productlist-main .mui-row').html(html); //手动添加到页面上
            }
        })
    }

    
    //封装初始化下拉刷新和上拉加载
    function pullRefresh() {
        mui.init({
            pullRefresh: {
                container: '#pullrefresh',
                down: {
                    callback: pulldownRefresh
                },
                up: {
                    contentrefresh: '正在加载...',
                    callback: pullupRefresh
                }
            }
        });
        /**
         * 下拉刷新具体业务实现
         */
        function pulldownRefresh() {
            setTimeout(function () {  //为了模拟请求延迟添加一个定时器
                $.ajax({
                    url: "/product/queryProduct",
                    data: {
                        proName: search,
                        page: 1,
                        pageSize: 5, //请求刷新刷新页面
                    },
                    success: function (data) {
                        var html = template('productTmp', data);
                        $('.productlist-main .mui-row').html(html);
                    }
                })
                mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //结束转圈圈 调用结束方法
            }, 1500);
        }

        /**
         * 上拉加载具体业务实现
         * 思路:
             1. 上拉加载更多数据(请求下一页的数据)page默认为1  每次上拉把page++ 变成下一页数据
             2. 渲染使用追加渲染 使用append 追加dom元素（不能使用html）
             3. 结束转圈圈
             4. 如果没有数据 不仅要结束转圈圈还要传一个参数 true 会提示没有数据了
         */
        var page = 1;
        function pullupRefresh() {
            setTimeout(function () {  //为了模拟请求延迟添加一个定时器
                page++; //指定一个page每次上拉就page++ 变成下一页
                $.ajax({
                    url: "/product/queryProduct",
                    data: {
                        proName: search,
                        page: page, //把++之后的page作为请求参数
                        pageSize: 2,  //不能多于要总数
                    },
                    success: function (data) {
                        if (data.data.length > 0) { //可能上拉会没有数据 要判断有数据就调用模板去渲染 
                            var html = template('productTmp', data);
                            $('.productlist-main .mui-row').append(html); //渲染使用追加渲染 使用append 追加dom元素到mui-row（不能使用html）
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(); //有数据还是要结束转圈圈 只是不需要传参
                        } else {
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); //没有数据结转圈圈 并提示没有数据了,参数为true提示没有更多数据了
                        }
                    }
                })
            }, 1500);
        }
    }

















})