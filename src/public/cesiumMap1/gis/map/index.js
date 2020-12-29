define(function (require, exports, module) {
	//debugger;
    //地图工具栏更多操作显示与隐藏
    var list=$('.map_toolbar_list').children('li');
    list.each(function(index){
        list.eq(index).on('click',function(target){
            for(var i=0;i<list.length;i++) {
                if(i!=index){
                    list.eq(i).removeClass('selected');
                    list.eq(i).find('.map_toolbar_list_more').css("display","none");
                }
            }
            var self=$(this);
            if(self.find('.map_toolbar_list_more').css('display')=="none"){
                $('.map_toolbar_box').css('width',"280px");
                $(this).find('.map_toolbar_list_more').css("display","block");
            }else{
                $('.map_toolbar_box').css('width',"75px");
                $(this).find('.map_toolbar_list_more').css("display","none");
            }

            $(this).toggleClass('selected');
        });
    });
    var Map3d = require('./cesiumap');
    Map3d.init();  	
});