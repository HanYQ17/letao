// 入口函数
$(function () {
	initLeftScroll();// 调用初始化左侧的函数
	initRightScroll();// 调用初始化右侧的函数
	queryTopCategory();// 调用查询左侧分类列表
	querySecondCategory(1);// 调用查询右侧分类列表的函数 默认查第一个传人id为1





	// 调用初始化左侧的函数
	function initLeftScroll() {
		mui('.mui-scroll-wrapper.left').scroll({
			indicators: false,
			deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});
	}

	// 调用初始化右侧的函数
	function initRightScroll() {
		mui('.mui-scroll-wrapper.right').scroll({
			indicators: true,
			deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});

	}

	// 调用查询左侧分类列表
	function queryTopCategory() {
		$.ajax({
			url: "/category/queryTopCategory",
			//$.ajax默认是get请求和json格式,可以不写
			success: function (data) {
				// console.log(data);
				var html = template('categoryLeftTpl', data); //data是个对象,不用大括号包着
				// var html = template('categoryLeftTpl',{list:data}); //如果data是数组,才要大括号包着成为一个对象
				$('.left ul').html(html);
				toggleSecondCategory(); //根据左边分类显示不同内容
				$('.left ul li:first-child').addClass('active')
			}
		})
	}

	// 调用查询右侧分类列表的函数 默认查第一个传人id为1
	function querySecondCategory(id) {
		$.ajax({
			url: '/category/querySecondCategory',
			data: {
				id: id
			},
			success: function (obj) {
				// console.log(obj);
				var html = template('categoryRightTpl', obj);
				$('.right .mui-row').html(html);

			}
		})
	}

	// 切换右侧分类列表数据
	function toggleSecondCategory() {
		var lis = $('.left ul li');
		lis.on('tap', function () {  //click换成tap,原因:tap能够解决延迟问题
			// console.log(this.dataset['id']);  //原生获取自定义属性
			// console.log($(this).data('id'));  //zepto的函数方式封装了函数会获取数据并做类型转换 (推荐使用)
			var id = $(this).data('id');
			querySecondCategory(id);  //把id传给右侧分类的函数
			$(this).addClass('active').siblings().removeClass('active');





		})
	}





















})


