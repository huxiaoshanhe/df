app.controller('mydatasCtrl',mydatasCtrl);
mydatasCtrl.$inject = ['$scope','$http', 'coreCF', 'dataService', '$rootScope'];
function mydatasCtrl($scope, $http, config, dataService, $rootScope) {
	var that = this;
	$scope.order = 'directory';
	that.parents = [];
	that.userInfo = dataService.getItem('_user');

	that.getFolders = function(collectionCode,directory,indictorCodeStr) {
		var params = {
			parentFileCode:collectionCode,
			userCode:that.userInfo.id
		}
		if(collectionCode) {
			params.collectionCode = collectionCode;
			if(that.parents.indexOf(collectionCode)===-1&&directory==0) {
				that.parents.push(collectionCode);
			}
		}
		if(directory==0) {
			dataService.get('queryFileList',params).then(function(data) {
				that.folders = data;
				that.selectedFiles = [];//清空选中项
			});
		} else {
			var arr = indictorCodeStr.split(',');
  			var userData = {dims:{dim:[{codeName:'indicatorCode',codes:arr}]},productID:'out'};
  			userData = JSON.stringify(userData);
  			setcookie('userData',userData,config.domainUrl);
			location.href=config.baseUrl;
		}
		
	}
	that.getFolders(null,0);

	function setcookie(name,value,domain){   
        document.cookie = name + "="+ escape (value) + ";domain=" + domain;  
    }
	

	that.goBack = function() {
		that.parents.splice(that.parents.length-1,1);
		var len = that.parents.length-1;
		if(len<0) {
			that.getFolders(null,0);
		} else {
			that.getFolders(that.parents[len],0);
		}
	}
	

	/**新建文件夹开始**/
	that.folderName = '新建文件夹';
	that.isShow = 0;
	that.newFolder = function() {
		var parentID=null;
	  	var parlen=that.parents.length;
  		if(parlen!==0) {
  			parentID=that.parents[parlen-1];
  			var name=that.folderName;
				dataService.get('createMyFile',{'filename':name,'parentFileCode':parentID,'userCode':that.userInfo.id}).then(function(data) {
					if(data.code==1) {
						that.getFolders(parentID,0);
					}
					that.isShow = 0;
				});
				that.folderName = '新建文件夹';
  		}else{
  			var name=that.folderName;
			dataService.get('createMyFile',{'filename':name,'parentFileCode':0,'userCode':that.userInfo.id}).then(function(data) {
				if(data.code==1) {
					that.getFolders(null,0);
					that.isShow = 0;
					that.folderName = '新建文件夹';
				}
			});
  		}
	}
	/**新建文件夹结束**/


	that.selectedFiles = [];//已选中的文件或文件夹
	/**单选文件或文件夹**/
	that.selectFile = function(code) {
		that.selectedFiles = [];//清空已选中的文件或文件夹
		that.selectedFiles.push(code);
	}
	/**多选、取消多选**/
	that.checkFiles = function(code) {
		if(that.selectedFiles.indexOf(code)===-1) {
			that.selectedFiles.push(code);
		} else {
			var num = that.selectedFiles.indexOf(code);
			that.selectedFiles.splice(num,1);
		}
	}
	/**全选、取消全选**/
	that.selectAll = function() {
		if(that.selectedFiles.length === that.folders.length) {
			that.selectedFiles = [];
		} else {
			angular.forEach(that.folders,function(obj){
				if(that.selectedFiles.indexOf(obj.cude_id)===-1) {
					that.selectedFiles.push(obj.cude_id);
				}				
			});
		}
	}

	/**删除文件或文件夹**/
	that.delete = function() {

		if(that.selectedFiles.length>0) {
			if(confirm("你确定要删除选中项吗？")!=true) {
  				return false;
  			} 
			for (var i = 0; i < that.selectedFiles.length; i++) {
				var code = that.selectedFiles[i];
				dataService.get('delMyFile',{'cubeId':code}).then(function(data) {
					that.getFolders(that.parents[that.parents.length-1],0);
				});
			}
		}		
	}

	/**移动文件**/
	that.move = function() {
		if(that.selectedFiles.length===0) {
			return false;
		}
		that.needMoves = that.selectedFiles;
	}
	/**粘贴文件**/
	that.paste = function() {
		var current_folder = that.parents[that.parents.length-1];
		var num =that.needMoves.indexOf(current_folder);
		if(num!==-1) {
			that.needMoves.splice(num,1);
		}
		for (var i = 0; i < that.needMoves.length; i++) {
			var code = that.needMoves[i];
			dataService.get('baseOp',{'action':'move','parentID':current_folder,'collectionCode':code}).then(function(data) {
	  			that.getFolders(current_folder,true);
	  		});
		}
		that.needMoves=[];		
	}

	that.rename = function() {
		if(that.selectedFiles.length!==1) {
			return false;
		} else {
			var code = that.selectedFiles[0];
			var parentID = that.parents[that.parents.length-1];
			var obj = $('.data-list tr.on .glyphicon em');
			var name = obj.text();
			obj.html('<input name="name" value="'+name+'" />');
			var obj2 = $('.data-list input[name="name"]');
			obj2.blur(function() {
				var indicatorName = $(this).val();
				dataService.get('renameMyFile',{cubeId:code,newFileName:indicatorName}).then(function(data) {
					that.getFolders(parentID,0);
				});
			});
		}
	}
}
