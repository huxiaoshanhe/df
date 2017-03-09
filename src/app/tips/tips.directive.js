(function() {
	'use strict';
	angular
	.module('pf.directive')
	.controller('tipsCtrl',tipsCtrl)
	.directive('tips',tips);
	
	function tips() {
		return {
			replace: true,
	  		restrict: 'E',
	  		templateUrl: 'app/template/tips.html'
		};
	}
	
	tipsCtrl.$inject = ['userService', '$interval', 'dataService'];
	function tipsCtrl(userService, $interval, dataService) {
		var that = this;
		that.now_tips=1;
		/*userService.getSessionUser().then(function(data) {
			that.username=data.name;
		});*/
		
		var height=$(window).height();
		var width=$(window).width();
		that.zy={
				style:{
					height:height-258+'px'
				},
				style_add: {
					top:136+36*indicator_size()+'px'
				},
				style_time: {
					height:height-569+'px'
				},
				style_info: {
					width:width-230+'px'
				},
				style_infozy: {
					width:width-230+'px',
					height:height-139+'px'
				}
		}
		
		that.show = function(num) {
			var tips = getCookie('tips');
			that.now_tips=num;
			if(tips!=='over') {
				$('.tips').show();
			} else {
				$('.tips').hide();
			}	
			if(that.now_tips===1) {
				that.zy.style_next_start = {margin:'0 110px 0 0'};
			} else {
				that.zy.style_next_start = {margin:'0 0 0 0'};
			}			
			$('.tips-list').hide();
			$('.tips'+num).show();
			if(num>=10) {
				$('.tips').hide();
				var days = setCookieDate(7);
				setCookie('tips','over',days);
			} else {
				$('.tips-bg').css('display','block');
			}
		}
		that.show(1);
		
		that.prevTips = function(num) {
			that.now_tips = num-1;
			that.show(that.now_tips);
		}
		that.nextTips = function(num) {
			that.now_tips = num+1;
			that.show(that.now_tips);
		}
		
		that.closeTips = function() {
			$('.tips').hide();
			var days = setCookieDate(7);
			setCookie('tips','over',days);
		}
		
		function indicator_size() {
			var size;
			var userCookie=userService.getDimeByCookie();
			if(userCookie===undefined||userCookie===''||userCookie===null) {
				var nearestCheck=dataService.getItem('nearestCheck');
				size = nearestCheck[nearestCheck.length-1].indicators.length;
			} else {
				size =1;
			}
			return size;
		}
		
		
		
		
		
		/*function setcookie(name,value){   
	        document.cookie = name + "="+ escape (value);  
	    }*/
		/**
		 * 创建cookie
		 * @param name cookie名
		 * @param value cookie值
		 * @param expires cookie过期时间
		 * @param path cookie访问路径
		 * @param domain cookie访问域名
		 * @param secure 安全设置
		 */
		function setCookie(name,value,expires,path,domain,secure) {
			var cookieText=encodeURIComponent(name)+'='+encodeURIComponent(value);
			if(expires instanceof Date) {
				cookieText+=';expires='+expires;
			}
			if(path) {
				cookieText+=';path='+path;
			}
			if(domain) {
				cookieText+=';domain='+domain;
			}
			if(secure) {
				cookieText+=';secure='+secure;
			}
			document.cookie=cookieText;
		}
	
	    /*function getcookie(name){  
	        var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));  
	        if(arr != null){  
	            return (arr[2]);  
	        }else{  
	            return "";  
	        }  
	    }*/
		/**
		 * 获取cookie
		 * @param name
		 * @returns
		 */
		function getCookie(name) {
			var cookieName = encodeURIComponent(name)+'=';
			var cookieStart = document.cookie.indexOf(cookieName);
			var cookieValue = null;
			if(cookieStart>-1) {
				var cookieEnd = document.cookie.indexOf(';',cookieStart);
				if(cookieEnd==-1) {
					cookieEnd = document.cookie.length;
				}
				cookieValue = decodeURIComponent(document.cookie.substring(cookieStart+cookieName.length,cookieEnd));
			}
			return cookieValue;
		}
		
		/**
		 * 设置cookie失效天数 需要设置cookie失效天数的时候调用
		 * @param day
		 */
		function setCookieDate(day) {
			if(typeof day=='number' && day>0) {
				var date=new Date();
				date.setDate(date.getDate()+day);
			} else {
				throw new Error('必须传递一个大于0的天数');
			}
			return date;
		}
		
		
		
	}
})();