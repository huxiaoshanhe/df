/**
 * Created by Administrator on 2015/12/7.
 */
$(function() {
    $(".left_list .close").click(function(){
        $(this).children().toggle();
        $(this).next().toggle();
    });
    $(".list_list .aon1").click(function(){
        $(".list_list a").removeClass("on1 on2");
        $(this).addClass("on1");
    });
    $(".list_next .aon2").click(function(){
        $(".list_list a").removeClass("on1 on2");
        $(this).addClass("on2");
    });

    function goTop() {
        var left = ($(window).width()-1000)/2+1020;
        $('.go-top').css('left',left+'px').click(function() {
            $(window).scrollTop(0);
        });
        $(window).scroll(function(){
            var top = $(window).scrollTop();
            if(top>200) {
                $('.go-top').fadeIn();
            } else {
                $('.go-top').fadeOut();
            }
        });
    }
    goTop();
});


