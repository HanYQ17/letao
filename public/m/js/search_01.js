$(function () {
    addHistory(); //添加记录的函数
    queryHistory(); //查询记录的函数
    deleteHistory();  //单个删除数据
    clearHistory();  //全部删除

    //区域滚动
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });

    //添加记录的函数
    function addHistory() {
        $('.btn-search').on('tap', function () {  //使用事件委托
            var search = $('.input-search').val().trim(); //获取输入的内容,且内容不能有空格 trim()是去掉两端的空格
            if (search == '') return;  //如果用户输入的是空格,则返回,什么都不做

            var arr = queryHistorydata();  //调用函数获取之前的本地存储
            arr = uniq(arr);  //调用函数去重

            for (var i = 0; i < arr.length; i++) { //判断当前的值是否在数组中存在
                if (arr[i] == search) {
                    arr.splice(i, 1);  //如果存在,把当前的arr[i]从arr数组给删掉
                    i--;  //如果数组中值删掉一个,循环就会减少一次,i--抵消掉
                }
            }
            arr.unshift(search); //把当前的值添加到数组的最前面, push往数组后面添加,unshift是往数组前面添加

            localStorage.setItem('history', JSON.stringify(arr)); //设置本地存储
            $('.input-search').val(''); //清空输入框
            queryHistory();  //调用模板引擎重新渲染

            location = 'productlist.html?search='+search;  //跳转页面,给键值
        })

    }

    //封装模板函数
    function queryHistory() {
        var arr = queryHistorydata();  //获取之前的本地存储
        var html = template('temp', { list: arr });
        $('.history ul').html(html);
    }

    //单个删除数据
    function deleteHistory() {
        $('.history ul').on('tap','li .fa-close',function(){
            var index = $(this).data('index'); //获取自定义属性
            var arr = queryHistorydata();  //获取本地存储
            arr.splice(index,1); //删除当前项
            localStorage.setItem('history',JSON.stringify(arr));  //重新设置本地存储
            queryHistory(); //重新渲染,即调用模板重新生成数据
        })
    }

    //全部删除
    function clearHistory() { 
        $('.history .fa-trash').on('tap',function(){
            localStorage.removeItem('history'); //删除本地的history记录
            queryHistory(); //重新渲染
        })
     }


    //数组去重函数
    function uniq(array) {
        var temp = [];
        for (var i = 0; i < array.length; i++) {
            //如果当前数组的第i项在当前数组中第一次出现的位置是i，才存入数组；否则代表是重复的
            if (array.indexOf(array[i]) == i) {
                temp.push(array[i])
            }
        }
        return temp;
    }

    //获取之前的本地存储封装
    function queryHistorydata() {
        var arr = localStorage.getItem('history'); //获取之前的本地存储
        if (arr == null) {  //如果之前没有记录,就声明一个空数组
            arr = [];
        } else {
            arr = JSON.parse(arr);  //如果之前就有记录,把字符串转成数组
        }
        return arr;  //返回数组
    }
})










