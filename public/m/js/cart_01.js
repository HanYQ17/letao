$(function () {

    // queryCart(); //调用购物车数据
    pullRefresh(); //调用下拉刷新购物车列表
    
    //获取购物车数据
    function queryCart() {
        $.ajax({
            url: '/cart/queryCart',
            success: function (data) {
                console.log(data);
                var html = template('cartTamp', { list: data });
                $('.cart-list').html(html);
                mui('.mui-scroll-wrapper').scroll({
                    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
                });
            }
        })
    }

    //上拉加载下拉刷新
    function pullRefresh() {
        mui.init({
            pullRefresh: {
                container: '#pullrefresh',  //指定下拉刷新的容器
                down: {  //下拉刷新的回调函数
                    callback: pulldownRefresh,
                    auto: true  //初始化完成下拉刷新后马上自动触发一次下拉刷新
                },
                up: {  //上拉加载的回调函数
                    contentrefresh: '正在加载...',
                    callback: pullupRefresh
                }
            }
        });
        /**
         * 下拉刷新具体业务实现
         */
        function pulldownRefresh() {
            setTimeout(function () {
                $.ajax({
                    url: '/cart/queryCartPaging', //查询购物车带分页（需要登录）
                    data: {
                        page: 1,
                        pageSize: 5
                    },
                    success: function (rows) {
                        console.log(rows);
                        var html = template('cartTamp', rows);
                        $('.cart-list').html(html);
                        mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //结束下拉刷新,不结束会一直转圈圈
                        mui('#pullrefresh').pullRefresh().refresh(true); //重置上拉加载
                        page = 1; //page也要重置
                    }
                })
            }, 1000);
        }

        /**
         * 上拉加载具体业务实现
         */
        var page = 1;
        function pullupRefresh() {
            setTimeout(function () {
                page++; //每次上拉加载页数自增
                $.ajax({
                    url: '/cart/queryCartPaging', //查询购物车带分页（需要登录）
                    data: {
                        page: page,
                        pageSize: 3
                    },
                    success: function (rows) {
                        console.log(rows); //这是个对象,不是数组了
                        console.log(rows.data);
                        if (rows.data) {  //有数据,执行
                            var html = template('cartTamp', rows);
                            $('.cart-list').append(html);
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(); //结束上拉效果,不结束会一直转圈圈
                        } else {  //没有数据,结束转圈
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); //加true就是结束转圈,并提示没有更多数据了
                        }
                    }
                })
            }, 1000);
        }
    }
})