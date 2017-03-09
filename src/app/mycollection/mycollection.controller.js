(function() {
	'use strict';
	angular
    .module('pf.indicator')
    .controller('mycollectionCtrl', mycollectionCtrl);
	
	mycollectionCtrl.$inject=['coreCF', '$http', 'dataService', 'workbookService', 'workbookFactory', 'handsontableService', '$rootScope', 'conditionService'];
	function mycollectionCtrl(config, $http, dataService, workbookService, workbookFactory, handsontableService, $rootScope, conditionService) {
		var that=this;	
		that.lname='新建文件夹';
		that.rname='新建文件夹';
	  	
	  	/**我的数据集第一级栏目**/
	  	that.myds=[];
	  	that.parents=[];//父级目录
	  	that.copyid=null;//记录需要移动的文件编号
  		dataService.get('read',{'type':'info'}).then(function(data) {
	  		that.myds = data;
	  		that.defaultlist=that.myds[0];
	  		if(data.length!==0) {
	  			that.getFile(that.defaultlist.collectionCode,that.defaultlist.collectionName);
	  		}
	  	});
	  	
	  	/**获取我的数据集子级栏目**/
	  	that.selectFile = {
	  			code : 0,//选中的右侧文件或文件夹
	  			code2: 0,//选中的左侧文件夹
	  			codes: [],//多选
	  			allcodes:[]//当前路径下的所有文件或文件夹
	  	}
	  	that.getFile=function(collectionCode,collectionName) {
	  		dataService.get('read',{'type':'info','collectionCode':collectionCode}).then(function(data) {
	  			that.list = data;
	  			var allIndicatorsCodes=[];
	  			for(var i=0;i<data.length;i++) {
	  				var arr1=data[i].lastModify.split(',');
	  				var arr2=arr1[0].split(' ');
	  				var month='';
	  				switch(arr2[0]) {
	  				case 'Jan' :month='1';break;
	  				case 'Feb' :month='2';break;
	  				case 'Mar' :month='3';break;
	  				case 'Apr' :month='4';break;
	  				case 'May' :month='5';break;
	  				case 'Jun' :month='6';break;
	  				case 'Jul' :month='7';break;
	  				case 'Aug' :month='8';break;
	  				case 'Sep' :month='9';break;
	  				case 'Oct' :month='10';break;
	  				case 'Nov' :month='11';break;
	  				case 'Dec' :month='12';break;
	  				}
	  				data[i].lastModify=arr1[1]+'/'+month+'/'+arr2[1];	
	  				allIndicatorsCodes.push(data[i].collectionCode);
	  			}
	  			that.selectFile.allcodes=allIndicatorsCodes;
	  			var parent={};
	  			parent.collectionName=collectionName;
	  			parent.collectionCode=collectionCode;
	  			that.parents=[];
	  			that.parents[0]=parent;
	  		});
	  		that.selectFile.code2 = collectionCode;
	  		that.selectFile.code = 0;
	  	}
	  	that.allFiles=function() {
	  		$('.m-main-l dt').addClass('on');
	  		$('.m-main-l dd').removeClass('on');
	  		that.parents=[];
	  		$('.m-main-l dd.hide').hide();
	  		$('.m-main-r tfoot').hide();
	  	}
	  		  	
	  	
	  	/**双击打开文件夹**/
	  	that.getFileChild=function(collectionCode,collectionName,directory) {
	  		if(directory==true) {
	  			dataService.get('read',{'type':'info','collectionCode':collectionCode}).then(function(data) {
	  				that.list = data;
	  				var allIndicatorsCodes=[];
	  				for(var i=0;i<data.length;i++) {
		  				var arr1=data[i].lastModify.split(',');
		  				var arr2=arr1[0].split(' ');
		  				var month='';
		  				switch(arr2[0]) {
		  				case 'Jan' :month='1';break;
		  				case 'Feb' :month='2';break;
		  				case 'Mar' :month='3';break;
		  				case 'Apr' :month='4';break;
		  				case 'May' :month='5';break;
		  				case 'Jun' :month='6';break;
		  				case 'Jul' :month='7';break;
		  				case 'Aug' :month='8';break;
		  				case 'Sep' :month='9';break;
		  				case 'Oct' :month='10';break;
		  				case 'Nov' :month='11';break;
		  				case 'Dec' :month='12';break;
		  				}
		  				data[i].lastModify=arr1[1]+'/'+month+'/'+arr2[1];
		  				data[i].lastModify=arr1[1]+'/'+month+'/'+arr2[1];	
		  				allIndicatorsCodes.push(data[i].collectionCode);
		  				that.selectFile.code = 0;
		  			}
	  				that.selectFile.allcodes=allIndicatorsCodes;
	  		    	var parent={};
	  				parent.collectionName=collectionName;
	  				parent.collectionCode=collectionCode;
	  				var issetCode=-1;
	  				for(var i=0;i<that.parents.length;i++) {
	  					if(that.parents[i].collectionCode==collectionCode) {
	  						issetCode = i;
	  					}
	  				}
	  				if(issetCode===-1) {
	  					that.parents.push(parent);
	  				} else {
	  					var dNum = that.parents.length - issetCode-1;
	  					that.parents.splice(issetCode+1,dNum);
	  				}
	  			});
	  			that.selectFile.codes = [];
	  			that.selectFile.code = collectionCode;
	  		} else {
	  			config.isMyUploadFile = 0;
	  			var params = {
	  					'type':'file',
	  					'collectionCode':collectionCode
	  			}
	  			dataService.get('read',params).then(function(response){
	  				var source = workbookFactory.parse(response);
	  				workbookService.addMySheet(source);
	  			});
	  			$('.ngdialog-close').click();
	  		}
	  		
	  	}
	  	/**选择指标**/	  	
	  	that.selectIndicate=function (collectionCode,collectionName,directory) {
	  		that.selectFile.codes = [];
	  		that.selectFile.code = collectionCode;
	  	}
	  	
	  	/**选择所有指标**/
	  	that.selectAllFiles = function() {
	  		if(that.selectFile.codes===that.selectFile.allcodes) {
	  			that.selectFile.codes=[];
	  		} else {
	  			that.selectFile.codes=that.selectFile.allcodes;
	  		}
	  	}

	  	that.multiSelect = function(collectionCode,collectionName,directory) {
	  		that.selectFile.code = collectionCode;
	  		var num=that.selectFile.codes.indexOf(collectionCode);
	  		if(num===-1) {
	  			that.selectFile.codes.push(collectionCode);
	  		} else {
	  			that.selectFile.codes.splice(num,1);
	  		}
	  	}
	  	
	  	/**打开指标**/
	  	that.openSheet=function() {
	  		if(that.selectFile.code==0) {
	  			return false;
	  		}
  			var name = '';
  			var isDirectory = false;
  			angular.forEach(that.list,function(v,k) {
  				if(v.collectionCode==that.selectFile.code) {
  					name = v.collectionName;
  					isDirectory = v.directory;
  				}
  			});
  			that.getFileChild(that.selectFile.code,name,isDirectory);
	  	}
	  	
	  	/**复制我的文件**/
	  	that.indicateCopy=function() {
	  		var id=that.selectFile.code;
	  		var prelen=that.parents.length-1;
	  		var pid=that.parents[prelen].collectionCode;
	  		var pname=that.parents[prelen].collectionName;
	  		dataService.get('baseOp',{'action':'copy','collectionCode':id}).then(function(data){
	  			if(data.message=="OK") {
	  				that.getFileChild(pid,pname,true);
	  			}
	  		});
	  	}
	  	/**移动我的文件**/
	  	that.moveFile=function() {
	  		that.copyid=that.selectFile.code;
	  	}
	  	/**粘贴我的文件**/
	  	that.paste=function() {
	  		var prelen=that.parents.length-1;
	  		var pid=that.parents[prelen].collectionCode;
	  		var pname=that.parents[prelen].collectionName;
	  		dataService.get('baseOp',{'action':'move','parentID':pid,'collectionCode':that.copyid}).then(function(data) {
	  			that.getFileChild(pid,pname,true);
	  		});
	  		that.copyid=null;	  		
	  	}
	  	
	  	/**删除我的指标**/
	  	that.indicateDelete=function() {
	  		var id=0;
	  		if(that.selectFile.code!=0) {//右侧删除
	  			if(that.selectFile.codes.length>0) {//多条删除
	  				if(confirm("你确定要多条删除吗？")!=true) {
		  				return false;
		  			} 
	  				var prelen=that.parents.length-1;
		  			var pid=that.parents[prelen].collectionCode;
		  			var pname=that.parents[prelen].collectionName;
	  				for(var i=0;i<that.selectFile.codes.length;i++) {
	  					id=that.selectFile.codes[i];
	  					dataService.get('baseOp',{'action':'delete','collectionCode':id}).then(function(data){
	  						that.getFileChild(pid,pname,true);
	  					});
	  				}			
		  			
	  			} else {//单条删除
	  				id=that.selectFile.code;
		  			if(confirm("你确定要删除吗？")!=true) {
		  				return false;
		  			} 
		  			var prelen=that.parents.length-1;
		  			var pid=that.parents[prelen].collectionCode;
		  			var pname=that.parents[prelen].collectionName;
		  			dataService.get('baseOp',{'action':'delete','collectionCode':id}).then(function(data) {
		  				if(data.success==true) {
		  					that.getFileChild(pid,pname,true);
		  				}
		  			});
	  			}
	  			
	  			
	  		} else {//左侧删除
	  			id=that.selectFile.code2;
	  			if(confirm("你确定要删除吗？")!=true) {
	  				return false;
	  			} 
	  			var prelen=that.parents.length-1;
	  			dataService.get('baseOp',{'action':'delete','collectionCode':id}).then(function(data) {
	  				if(data.success==true) {
	  					dataService.get('read',{'type':'info'}).then(function(data) {
	  						that.myds = data;
	  						that.defaultlist=that.myds[0];
	  						that.getFile(that.defaultlist.collectionCode,that.defaultlist.collectionName);
	  					});
	  				}
	  			});
	  		}
	  		
	  	}
	  	/**下载我的指标**/
	  	that.indicateDownload=function() {
	  		var id=that.selectFile.code;
	  		var isFolder = 0;
	  		angular.forEach(that.list,function(v,k){
	  			if(v.collectionCode==id&&v.directory==true) {
	  				isFolder = 1;
	  			}
	  		});
	  		if(isFolder===1) {
	  			alert('不支持文件夹下载！');
	  			return false;
	  		}
	  		if(id==0){
	  			alert('请选择要下载的文件！');
	  			return false;
	  		}
	  		location.href=config.baseUrl+config.urlMap.download+"?action=collection&collectionCode="+id;
	  	}
	  	/**新建文件夹**/
	  	that.shownewFiles=function() {
	  		that.isTable = false;
	  		var parentID=null;
	  		var parlen=that.parents.length;
	  		if(parlen!=0) {	  			
	  			$(".m-main-r.collection tfoot").show();	  			
	  		} else {
	  			$(".m-main-l.collection dd.hide").show();	  			
	  		}	  		
	  	}
	  	that.newFiles=function() {
	  		var parentID=null;
	  		var parlen=that.parents.length;
	  		if(parlen!=0) {
	  			parentID=that.parents[parlen-1].collectionCode;
	  			var parentName=that.parents[parlen-1].collectionName;
	  			if($.trim(that.rname)==='') {
	  				alert('文件夹名称不能为空');
	  				return false;
	  			}
  				dataService.get('baseOp',{'action':'new','name':that.rname,'parentID':parentID}).then(function(data) {
  					if(data.success==true) {
  						that.getFileChild(parentID,parentName,true);
  					}
  					$(".m-main-r.collection tfoot").hide();
  				});
  				that.rname ='新建文件夹';
  				that.parents.splice((that.parents.length-1),1);
	  		}else{
	  			if($.trim(that.lname)==='') {
	  				alert('文件夹名称不能为空');
	  				return false;
	  			}
  				dataService.get('baseOp',{'action':'new','name':that.lname,'parentID':parentID}).then(function(data) {
  					if(data.success==true) {
  						dataService.get('read',{'type':'info'}).then(function(data) {
  							that.myds = data;
  							that.defaultlist=that.myds[0];
  							that.getFile(that.defaultlist.collectionCode,that.defaultlist.collectionName);
  						});
  						$(".m-main-l.collection dd.hide").hide();
  					}
  				});
  				that.lname='新建文件夹';
	  		}
	  	}
	  	
	  	/**文件或文件夹重命名**/
	  	that.renameFiles=function() {
	  		that.isTable = false;
	  		var id=0;
	  		if(that.selectFile.code!=0) {
	  			var collectionCode=that.selectFile.code;
	  			var filename=$(".m-main-r tr.on span").text();
	  			$(".m-main-r tr.on span").html("<input type='text' name='filename' value='"+filename+"' />");
	  			$("input[name='filename']").focus();
	  			$("input[name='filename']").blur(function() {
	  				var name=$(this).val();
	  				if($.trim(name)==='') {
		  				alert('文件或文件夹名称不能为空');
		  				return false;
		  			}
	  				var parlen=that.parents.length;
					var parentID=that.parents[parlen-1].collectionCode;
					var parentName=that.parents[parlen-1].collectionName;
	  				dataService.get('baseOp',{'action':'rename','collectionCode':collectionCode,'name':name,'parentID':parentID}).then(function(data) {
	  					if(data.success==true) {	  						
	  						that.getFileChild(parentID,parentName,true);
	  					}
	  				});
	  			});
	  		} else {
	  			var collectionCode=that.selectFile.code2;
	  			var filename=$(".m-main-l dd.on").text();
	  			$(".m-main-l dd.on").html("<input type='text' name='filename' value='"+filename+"' /><input type='hidden' name='collectionCode' value='"+collectionCode+"' />");
	  			$("input[name='filename']").focus();
	  			$("input[name='filename']").blur(function() {
	  				var name=$(this).val();
	  				if($.trim(name)==='') {
		  				alert('文件或文件夹名称不能为空');
		  				return false;
		  			}
	  				var code=$("input[name='collectionCode']").val();
	  				dataService.get('baseOp',{'action':'rename','collectionCode':code,'name':name,'parentID':-1}).then(function(data) {
	  					if(data.success==true) {
	  						dataService.get('read',{'type':'info'}).then(function(data) {
	  							that.myds = data;
	  							that.defaultlist=that.myds[0];
	  							that.getFile(that.defaultlist.collectionCode,that.defaultlist.collectionName);
	  						});
	  					}
	  				});
	  			});
	  		}
	  	}
	  	/**搜索指标**/
	  	that.sear_files = function() {
	  		var params = {
	  				type           : 'searchFile',
	  				collectionCode : that.file_keywords
	  		}
	  		dataService.get('read',params).then(function(source) {
	  			that.list = source;
	  		});
	  	}
	}
})();