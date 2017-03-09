/**
 * Created by Administrator on 2015/12/7.
 */

$(function(){
    $(".left_list a.canClick").click(function(){
        //获取当前a的位置并计算出下一页和上一页的value值
        var prev_num=$(".left_list a.canClick").index(this)-1;
        var next_num=$(".left_list a.canClick").index(this)+1;
        var a_size=$(".left_list a.canClick").size();
        var prev_text="<"+$(".left_list a.canClick:eq("+prev_num+")").text();
        var next_text=$(".left_list a.canClick:eq("+next_num+")").text()+">";
        if(prev_num<0) {
            $(".page_tab .prev").attr("value","").css("display","none");
        } else {
            $(".page_tab .prev").attr("value",prev_num).css("display","block").text(prev_text);
        }
        if(next_num>=45) {
            $(".page_tab .next").attr("value","").css("display","none");
        } else {
            $(".page_tab .next").attr("value",next_num).css("display","block").text(next_text);
        }

        $(".main_text").load($(this).attr("data"));

        $(".main_header h2").text($(this).text());
    });


    $(".page_tab .prev").click(function() {
        var num=$(this).attr("value");
        $(".left_list a.canClick:eq("+num+")").click();
        $(window).scrollTop(0);
    });
    $(".page_tab .next").click(function() {
        var num=$(this).attr("value");
        $(".left_list a.canClick:eq("+num+")").click();
        $(window).scrollTop(0);
    });

    $(".scroll").click(function() {
        $(".scroll").removeClass('on2');
        $(this).addClass('on2');
        var url=$(this).attr("data");
        $('.left_list a.canClick').each(function(index,e) {
            if($(e).attr('data')==url) {
                $(e).click();
            }
        });
        var top=$(this).attr('scroll-value');
        $(window).scrollTop(top);
    });
});


