$(function () {

    var id = getQueryString('id'); //多出需要id数据,放在全局里

    queryProductDetail(); //商品详情数据
    addCart(); //调用加入购物车




    //商品详情数据
    function queryProductDetail() {
        $.ajax({
            url: '/product/queryProductDetail',
            data: {
                id: id
            },
            success: function (obj) {
                console.log(obj);

                //获取尺码
                var min = +obj.size.split('-')[0];
                var max = +obj.size.split('-')[1];
                obj.size = [];
                for (var i = min; i <= max; i++) {
                    obj.size.push(i);
                }
                console.log(obj.size);


                var html = template('detailTmp', obj);
                $('#main').html(html);
                //获得slider插件对象
                var gallery = mui('#main .mui-slider');
                gallery.slider({
                    interval: 1000//自动轮播周期，若为0则不自动播放，默认为0；
                });
                mui('.mui-numbox').numbox(); //初始化按钮

                //区域滚动
                mui('.mui-scroll-wrapper').scroll({
                    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
                });

                $('.btn-size').on('tap', function () {
                    $(this).addClass('active').siblings().removeClass('active');
                })
            }
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

    //调用加入购物车
    function addCart() {
        $('.btn-add-cart').on('tap', function () {
            var size = $('.btn-size.active').data('size'); //获取尺寸
            if (!size) {
                mui.toast('请选择尺寸', { duration: 'short', type: 'div' });
                return;
            }
            var num = mui('.mui-numbox').numbox().getValue(); //获取数量

            //加入购物车
            $.ajax({
                url: '/cart/addCart',
                type: 'post',
                data: {
                    productId: id,
                    num: num,
                    size: size
                },
                success: function (data) {
                    if (data.error) {
                        location = 'login.html?returnUrl=' + location.href;  //要把当前的url传过去,登录成功后根据这个网址再跳回来
                    } else {
                        //提示是否跳转到购物车
                        var btnArray = ['是', '否'];
                        mui.confirm('是否跳转', '', btnArray, function (e) {
                            if (e.index == 0) {
                                location = 'cart.html';
                            } else {
                                mui.toast('继续添加', { duration: '1000', type: 'div' });
                            }
                        })
                    }
                }
            })
        })
    }

})