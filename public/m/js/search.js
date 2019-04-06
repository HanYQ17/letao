$(function(){

    addHistory(); //添加记录的函数
    queryHistory(); //查询记录的函数
    // deleteHistory();
    // clearHistory();

    //区域滚动
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });

    //添加记录的函数
    function addHistory(){
        $('.btn-search').on('tap',function(){  //使用事件委托
            var search = $('.input-search').val().trim();  //获取输入的内容,且内容不能有空格 trim()是去掉两端的空格
            if(search=="") return; //如果用户输入的是空格,则返回,什么都不做
                
            var arr = localStorage.getItem('searchHistory'); //获取之前的记录
            if(arr==null){ //如果之前没有记录,就声明一个空数组
                arr = [];
            }else{
                arr = JSON.parse(arr);  //如果之前就有记录,把字符串转成数组
            }
            arr = uniq(arr);  //调用数组去重

            for(var i = 0;i<arr.length;i++){  //判断当前的值是否在数组中存在
                if(arr[i]==search){  
                    arr.splice(i,1); //如果存在,把当前的arr[i]从arr数组给删掉
                    i--;  //如果数组中值删掉一个,循环就会减少一次,i--抵消掉
                }
            }

            arr.unshift(search); //把当前的值添加到数组的最前面, push是添加到最后面
            localStorage.setItem('searchHistory',JSON.stringify(arr));  //设置记录

            $('.input-search').val(''); //搜索完成后清空输入框
            queryHistory(); //调用模板引擎
        })
    }

    //数组去重函数
    function uniq(array){   
        var temp = [];
        for(var i = 0; i < array.length; i++) {
            //如果当前数组的第i项在当前数组中第一次出现的位置是i，才存入数组；否则代表是重复的
            if(array.indexOf(array[i]) == i){
                temp.push(array[i])
            }
        }
        return temp;
    }

    // 查询记录的函数
    function queryHistory(){
        var arr = localStorage.getItem('searchHistory');  //取出之前的记录
        if(arr == null){
            arr = [];
        }else{
            arr = JSON.parse(arr);
        }
        var html = template('historyTpl',{rows:arr})  //调用模板引擎
        $('.history ul').html(html); //生成模板引擎
    }
})
