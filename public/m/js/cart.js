$(function () {

    // queryCart(); //调用购物车数据
    pullRefresh(); //调用下拉刷新购物车列表
    deleteCart(); //删除功能
    // getSum();
    editCart(); //编辑功能

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

    // 购物车删除功能
    function deleteCart() {
        $('.cart-list').on('tap', '.btn-delete', function () {
            var id = $(this).data('id'); //获取id
            var li = $(this).parent().parent(); //获取li标签,当前的父元素的父元素
            mui.confirm('确认删除该条记录？', 'Hello MUI', ['确认', '取消'], function (e) {
                if (e.index == 0) {
                    $.ajax({
                        url: '/cart/deleteCart',
                        data: {
                            id: id
                        },
                        success: function (data) {
                            // console.log(data);
                            if (data.success) {
                                li.remove(); //移出自己
                                queryCartPaging(); //重新渲染页面
                            }
                        }
                    })
                } else {
                    setTimeout(function () {
                        mui.swipeoutClose(li[0]); //转成dom元素
                    }, 0);
                }
            });
        })
    }

    //购物车编辑功能
    function editCart(){
        $('.cart-list').on('tap','.btn-edit',function(){
            var li = $(this).parent().parent(); //获取要编辑的li元素
            var data = $(this).data('product'); //获取所有数据
            console.log(data);
            // console.log(data);
            var min = +data.productSize.split('-')[0]; //把字符串分割成数组再获取第一个值,记得转number类型
            var max = +data.productSize.split('-')[1]; //把字符串分割成数组再获取第二个值
            data.productSize = [];
            for(var i = min;i<=max;i++){
                data.productSize.push(i);
            }
            var html = template('editCartTpl',data);
            html = html.replace(/[\r\n]/g,''); //弹框模板有字符串回车换行,需要把字符创的回车换行去掉
            mui.confirm(html, '编辑商品', ['确定', '取消'], function(e) {
                if (e.index == 0) {
                    var size = $('.btn-size').data('size');
                    var num = mui('.mui-numbox').numbox().getValue();
                    $.ajax({
                        url:'/cart/updateCart',
                        type:'post',
                        data:{
                            id:data.id,
                            size:size,
                            num:num
                        },
                        success:function(data){
                            if(data.success){
                                queryCartPaging();//调用查询分页列表
                            }
                        }
                    })
                } else {
                    mui.swipeoutClose(li[0]); //把$改为mui,把里转成dom元素
                }
            })

            mui('.mui-numbox').numbox(); //初始化数字框
            $('.btn-size').on('tap',function(){ //已经渲染完了,所以不需要事件委托
                $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
            })
        })
    }

    //计算总金额
    function getSum(){
        var checkeds = $('.mui-checkbox input:checked');
        var sum = 0;
        checkeds.each(function(index,value){
            var price = $(value).data('price');
            var num = $(value).data('num');
            // console.log(price,num);
            var count = price * num;
            sum += count;
        })
        sum = sum.toFixed(2); //保留2位小数
        $('.rental .order-count').html(sum);

    }



    // 带有分页查询购物车列表
    function queryCartPaging(){
        $.ajax({
            url: '/cart/queryCartPaging', //查询购物车带分页（需要登录）
            data: {
                page: 1,
                pageSize: 3
            },
            success: function (rows) {
                console.log(rows);
                if (rows.error) {
                    location = 'login.html?returnUrl=' + location.href;
                } else {
                    var html = template('cartTamp', rows);
                    $('.cart-list').html(html);
                    mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //结束下拉刷新,不结束会一直转圈圈
                    mui('#pullrefresh').pullRefresh().refresh(true); //重置上拉加载
                    page = 1; //page也要重置
                    getSum();
                    $('.mui-checkbox input').on('change',function(){
                        getSum();
                    })
                }
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
                queryCartPaging();
                // $.ajax({
                //     url: '/cart/queryCartPaging', //查询购物车带分页（需要登录）
                //     data: {
                //         page: 1,
                //         pageSize: 5
                //     },
                //     success: function (rows) {
                //         // console.log(rows);
                //         if (rows.error) {
                //             location = 'login.html?returnUrl=' + location.href;
                //         } else {
                //             var html = template('cartTamp', rows);
                //             $('.cart-list').html(html);
                //             mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //结束下拉刷新,不结束会一直转圈圈
                //             mui('#pullrefresh').pullRefresh().refresh(true); //重置上拉加载
                //             page = 1; //page也要重置
                //         }

                //     }
                // })
            }, 500);
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
                        // console.log(rows); //这是个对象,不是数组了
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