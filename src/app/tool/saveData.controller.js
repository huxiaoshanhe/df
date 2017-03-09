(function() {
	'use strict';
	angular
		.module('pf.indicator')
		.controller('savedataCtrl',savedataCtrl);
	
	savedataCtrl.$inject = ['dataService', 'sheetService'];
	function savedataCtrl(dataService, sheetService) {
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
	  			code2: 0 //选中的左侧文件夹
	  	}
	  	that.getFile=function(collectionCode,collectionName) {
	  		dataService.get('read',{'type':'info','collectionCode':collectionCode}).then(function(data) {
	  			that.list = data;
	  			var parent={};
	  			parent.collectionName=collectionName;
	  			parent.collectionCode=collectionCode;
	  			that.parents=[];
	  			that.parents[0]=parent;
	  		});
	  		that.selectFile.code2 = collectionCode;
	  		that.selectFile.code = 0;
	  		
	  		that.selectFile.code = collectionCode;
	  		that.selectFile.directory = true;
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
	  		}
	  		
	  	}
	  	/**选择指标**/	  	
	  	that.selectIndicate=function (collectionCode,collectionName,directory) {
	  		that.selectFile.code = collectionCode;
	  		that.selectFile.directory = directory;
	  	}
	  	
	  	that.startButton = function() {
	  		if(that.selectFile.code==0||that.selectFile.directory!=true) {
	  			return false;
	  		}
	  	}
	  	
	  	/**保存指标**/
	  	that.saveGo=function() {
	  		if(that.startButton==false) {
	  			return false;
	  		}


	  		var sheetId = sheetService.getSheetId();
			var params = {
					'sheetId':sheetId,
					'parentID':that.selectFile.code
			}
			dataService.get('save',params).then(function(response) {
				$('.ngdialog-content').hide();
				$('.ngdialog-overlay').hide();
				$('.ngdialog').hide();
				if(response.success==true) {
					alert('恭喜你，保存成功！');
				}
			});
	  	}
	  	
	  	
	  	/**新建文件夹**/
	  	that.shownewFiles=function() {
	  		that.isTable = false;
	  		var parentID=null;
	  		var parlen=that.parents.length;
	  		if(parlen!=0) {	  			
	  			$(".m-main-r.save tfoot").show();	  			
	  		} else {
	  			$(".m-main-l.save dd.hide").show();	  			
	  		}	  		
	  	}
	  	that.newFiles=function() {
	  		var parentID=null;
	  		var parlen=that.parents.length;
	  		if(parlen!=0) {
	  			parentID=that.parents[parlen-1].collectionCode;
	  			var parentName=that.parents[parlen-1].collectionName;
	  			dataService.get('baseOp',{'action':'new','name':that.rname,'parentID':parentID}).then(function(data) {
  					if(data.success==true) {
  						that.getFileChild(parentID,parentName,true);
  					}
  					$(".m-main-r.save tfoot").hide();
  				});
  				that.rname = '新建文件夹';
  				that.parents.splice((that.parents.length-1),1);
	  		}else{
  				dataService.get('baseOp',{'action':'new','name':that.lname,'parentID':parentID}).then(function(data) {
  					if(data.success==true) {
  						dataService.get('read',{'type':'info'}).then(function(data) {
  							that.myds = data;
  							that.defaultlist=that.myds[0];
  							that.getFile(that.defaultlist.collectionCode,that.defaultlist.collectionName);
  						});
  						$(".m-main-l.save dd.hide").hide();
  					}
  				});
  				that.lname = '新建文件夹';
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