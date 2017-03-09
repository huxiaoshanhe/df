(function() {
	'use strict';
	angular
    .module('pf.indicator')
    .controller('myDataCtrl', myDataCtrl);
	
	myDataCtrl.$inject=['coreCF', '$http', 'dataService', 'workbookService', 'workbookFactory', 'handsontableService', '$rootScope', 'conditionService', 'errorService'];
	function myDataCtrl(config, $http, dataService, workbookService, workbookFactory, handsontableService, $rootScope, conditionService, errorService) {
		var that=this;
		that.user = dataService.getItem('_user');
  		if(that.user.type!=='PERSONAL') {
			alert('对不起，您不是个人用户，请登录个人用户');
			errorService.swallow(errorService.NotLoggedIn);
			$('.ngdialog-theme-mydata .ngdialog-close').click();
			return false;
		}
		
	  		  	
		
  		
  		
  		
  		
  		
  		
  		
  		that.mydataBases = [];
	  	that.mydataBasesParentId='0';
	  	
	  	  that.files={
	  			  allFiles:[],
	  			  selectFiles:[]
	  	  };
	  	if(that.user.id) {
	  		dataService.get('queryFileList',{'parentFileCode':'','userCode':that.user.id}).then(function(data){
		  		that.mydataBases = data;
		  		for(var i=0;i<data.length;i++) {
		  			that.files.allFiles.push(data[i].cude_id);
		  		}
  			});
	  	}
	  	
	  	
	  	
	  	
	  	that.selectId=0;//选中操作项
  		that.back_target = [];//记录所有父级目录
	  	that.openMydataBases = function(code,directory,owner,indictorCodeStr) {
	  		if(directory==0) {
	  			that.mydataBasesParentId = code;
	  			that.files.allFiles = [];
	  			that.files.selectFiles = [];
		  		dataService.get('queryFileList',{'parentFileCode':code,'userCode':that.user.id}).then(function(data){
			  		that.mydataBases = data;
			  		for(var i=0;i<data.length;i++) {
			  			that.files.allFiles.push(data[i].cude_id);
			  		}
	  			});
		  		that.back_target.push(owner);
		  		that.selectId=0;
	  		} else {
	  			config.isMyUploadFile = 1;
	  			var arr = indictorCodeStr.split(',');
	  			var str = '';
	  			for(var i=0;i<arr.length;i++) {
	  				if(i==arr.length-1) {
	  					str+='"'+arr[i]+'"';
	  				} else {
	  					str+='"'+arr[i]+'"'+',';
	  				}
	  				
	  			}
	  			var sstr='['+str+']';
	  			var params = {
	  					'productID':'out',
	  					'dims':'[{"codeName":"indicatorCode","codes":'+sstr+'}]'
	  			}
	  			dataService.get('sync',params).then(function(response){			  				
	  				var source = workbookFactory.parse(response);
	  				config.myFileSheet=source.sheets[0].id;
	  				workbookService.addMySheet(source);
	  			});
	  		}
	  		
	  	  }
	  	  that.goBack = function() {
	  		var plen = that.back_target.length-1;
	  		that.files.allFiles=[];
	  		that.files.selectFiles = [];
	  		if(that.back_target[plen]!==undefined) {
	  			dataService.get('queryFileList',{'parentFileCode':that.back_target[plen],'userCode':that.user.id}).then(function(data){
			  		that.mydataBases = data;
			  		for(var i=0;i<data.length;i++) {
			  			that.files.allFiles.push(data[i].cude_id);
			  		}
	  			});
	  		} else {
	  			dataService.get('queryFileList',{'parentFileCode':0,'userCode':that.user.id}).then(function(data){
			  		that.mydataBases = data;
			  		for(var i=0;i<data.length;i++) {
			  			that.files.allFiles.push(data[i].cude_id);
			  		}
	  			});
	  		}
	  		that.back_target.splice(plen,1);
	  		that.mydataBasesParentId = that.back_target[plen];//记录当前目录的ID
	  	  }
	  	  
	  	  /**单选**/
	  	  that.selectSingle = function(id) {
	  		  var num=that.files.selectFiles.indexOf(id);
	  		  if(num===-1) {
	  			that.files.selectFiles.push(id);
	  		  } else {
	  			that.files.selectFiles.splice(num,1);
	  		  }
	  	  }
	  	  /**全选文件**/
	  	  that.selectAll=function() {
	  		  	if(that.files.selectFiles.length===that.files.allFiles.length) {
	  		  		that.files.selectFiles=[];
	  		  	} else {
		  		  	var code = that.mydataBasesParentId;
			  		  dataService.get('queryFileList',{'parentFileCode':code,'userCode':that.user.id}).then(function(data){
				  		that.mydataBases = data;
				  		for(var i=0;i<data.length;i++) {
				  			that.files.selectFiles.push(data[i].cude_id);
				  		}
		  			});	  
	  		  	}
	  				
	  	  }
	  	  
	  	  
		  /**右侧新建文件夹**/
		  that.shownewFiles2 = function() {
		  		$('#newfile').show();
		  		$("input[name='filename']").focus();
		  	}
		  
		  that.newFiles2=function() {
			  	var userCode = that.user.id;
				var name=$("#newfile input[name='filename']").val();
				dataService.get('createMyFile',{'filename':name,'userCode':userCode,'parentFileCode':that.mydataBasesParentId}).then(function(data){
			  		if(data.code==1) {
			  			dataService.get('queryFileList',{'userCode':that.user.id,'parentFileCode':that.mydataBasesParentId}).then(function(msg){
					  		that.mydataBases = msg;
			  			});
			  		}
	  			});
				$('#newfile').hide();
				$("#newfile input[name='filename']").val('新建文件夹');
		  	}
		  that.delConfirm2 = function() {
			  var id=that.files.selectFiles.length;
			  if(id==0) {
				  return false;
			  } else {
				  if(confirm('你确定要永久性删除吗？')!=true) {
					  return false;
				  } else {
					  for(var i=0;i<that.files.selectFiles.length;i++) {
						  var id=that.files.selectFiles[i];
						  dataService.get('delMyFile',{cubeId:id}).then(function(data){
						  		if(data.code==1) {
						  			dataService.get('queryFileList',{'userCode':that.user.id,'parentFileCode':that.mydataBasesParentId}).then(function(msg){
								  		that.mydataBases = msg;
						  			});
						  		} else if(data.code==2) {
						  			alert('请先删除文件夹下的内容！');
						  		} else if(data.code==0) {
						  			alert('删除失败！');
						  		}
				  			});
					  }
					  
				  }
			  }
			  $('.mydata .confirm_bg').show();
			  $('.mydata .confirm_del').show();
		  }
		  /**右侧删除文件夹**/
		  /*that.delFiles2=function(num) {
			  if(num==1) {
				  var id=that.selectId;
			  		dataService.get('delMyFile',{cubeId:id}).then(function(data){
				  		if(data.code==1) {
				  			dataService.get('queryFileList',{'userCode':that.user.id,'parentFileCode':that.mydataBasesParentId}).then(function(msg){
						  		that.mydataBases = msg;
				  			});
				  		} else if(data.code==2) {
				  			alert('请先删除文件夹下的内容！');
				  		} else if(data.code==0) {
				  			alert('删除失败！');
				  		}
		  			});
			  }
			  $('.mydata .confirm_bg').hide();
			  $('.mydata .confirm_del').hide();
		  	}*/
		  	/**右侧重命名**/
		  	that.renameFiles2=function() {
		  		var collectionCode=$(".myDS dl.on:first").attr("code");
		  		var filename=$(".myDS dl.on:first dd").text();
		  		$(".myDS dl.on:first dd").html("<input type='text' name='filename' value='"+filename+"' /><input type='hidden' name='collectionCode' value='"+collectionCode+"' />");
		  		$("input[name='filename']").focus();
				$("input[name='filename']").blur(function() {
					var name=$(this).val();
					var code=$("input[name='collectionCode']").val();						
					dataService.get('renameMyFile',{cubeId:code,newFileName:name}).then(function(data){
				  		if(data.code==1) {
				  			dataService.get('queryFileList',{'userCode':that.user.id,'parentFileCode':that.mydataBasesParentId}).then(function(msg){
						  		that.mydataBases = msg;
				  			});
				  		}
		  			});
				});
		  	}
	  	
	  	
	  	  	
	  	
		  	
		  	
		  	/**搜索历史**/
		  	that.history = dataService.getItem('searchHistory');
		  	if(that.history.length!==undefined) {
		  		that.history=that.history.reverse();
		  	}
		  	
		  	
		  	/**最近访问**/
		  	that.latest=[];
		  	var latestSheet =dataService.getItem('nearestCheck');
		  	if(latestSheet.length!==undefined) {
		  		latestSheet=latestSheet.reverse();
		  	}
		  	for(var i=0;i<latestSheet.length;i++) {
		  		var item={name:latestSheet[i].name};
		  		that.latest.push(item);
		  	}
		  	/**
		  	 * 打开最近访问工作表
		  	 */
		  	that.openLatestCheck=function(num) {
		  		var codes = latestSheet[num].indicators;
		  		var _codes='';
		  		for(var i=0;i<codes.length;i++) {
		  			if(i==codes.length-1) {
		  				_codes+='"'+codes[i]+'"'
		  			} else {
		  				_codes+='"'+codes[i]+'",'
		  			}
		  		}
		  		var params = {
			    		  'dims':'[{"codeName":"indicatorCode","codes":['+_codes+']}]',
			    		  'productID': '00010000000000000000000000000001'
			      };
		  		dataService.get('sync',params).then(function(result) {
		  			var source = workbookFactory.parse(result);
		  			workbookService.addMySheet(source);
		  		});
		  	}
		  	
		  	/**右侧手风琴开始**/
		  	that.mydsshow=function() {
		  		if($(".myDS .con").hasClass("on")) {
		  			$(".myDS .con").removeClass("on");
		  		} else {
		  			$(".myDS .con").addClass("on");
		  		}
		  	}
		  	that.historyshow=function() {
		  		if($(".sear-history .con").hasClass("on")) {
		  			$(".sear-history .con").removeClass("on");
		  		} else {
		  			$(".sear-history .con").addClass("on");
		  			$(".latest-check .con").removeClass("on");
		  		}
		  	}
		  	that.latestshow=function() {
		  		if($(".latest-check .con").hasClass("on")) {
		  			$(".latest-check .con").removeClass("on");
		  		} else {
		  			$(".latest-check .con").addClass("on");
		  			$(".sear-history .con").removeClass("on");
		  		}
		  	}
		  	that.autoStyle = {
		  			style:{
		  				height:$(window).height()-420+'px',
		  				maxHeight:'300px',
		  				overflow:'auto'
		  			}
		  	}
		  	/**右侧手风琴结束**/
		  	
		  	
		  	
		  	
		  	/**触发上传窗口**/
		  	that.showupload=function() {
		  		$('#upload-win').show();
		  	}
	}
})();