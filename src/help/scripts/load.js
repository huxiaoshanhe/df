/**
 * Created by Administrator on 2015/12/30.
 */
$(function(){
    /*$(".header").load('./help/temp/header.html');
    $(".footer").load('./help/temp/footer.html');*/
	checkLoginCookie();
});

function showUserInfoBox(){
	$(".top-inner").css("display","none");
	$(".userinfo").css("display","block");
}

function showLoginBox(){
	$(".top-inner").css("display","none");
	$(".loginInfor").css("display","block");
}


function checkLoginCookie(){
	var loginStatus=getCookie('loginStatus');
	if(loginStatus==null||loginStatus==''){
		checklogin();
	}else{
		var userName=getCookie('loginName');
		showUserInfoBox();
		$(".userName").append(userName);
	}
	
}

function checklogin(){
	 $.ajax({url:'http://www.dfinder.cn/login/checkLogin',data:{},dataType:'json',type:'post',success:function(result){
		   if(result!=null){
			   if(result.success==true||result.success=='true'){
				  showUserInfoBox();
				  var userName=result.entity.userName;
				  $(".userName").append(userName);
				  $(".userName").attr('title',userName);
				  setCookie('loginName',userName,0.2,'dfinder.cn');
				  setCookie('loginStatus',true,0.2,'dfinder.cn');
			   }else{
				   showLoginBox();
			   }
		   }else{
			   return false;
			   showLoginBox();
		   }
	     }
	 });
}

function setCookie(name,value,day) { 
    var exp = new Date(); 
    exp.setTime(exp.getTime() + day*24*60*60*1000); 
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString(); 
}


function getCookie(name) {
	 var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	 
	    if(arr=document.cookie.match(reg))
	 
	        return unescape(arr[2]); 
	    else 
	        return null; 
}

function loginOut(){
	$.ajax({
		  dataType: 'jsonp',
		  jsonp: 'jsonp_callback',
		  url: 'http://login.dfinder.cn/logout.do',
		  complete: function () {
              delCookie('loginStatus','dfinder.cn');
			  delCookie('loginName','dfinder.cn');
			  location.href = 'http://www.dfinder.cn';
		  }
		});
}