(function(){
	'use strict';
	angular
	  .module('pf.directive')
	  .controller('myDatabase', myDatabaseCtrl);
	
	  myDatabaseCtrl.$inject=['coreCF', '$http', 'userService', 'dataService', 'workbookService', 'workbookFactory', 'handsontableService', '$rootScope','ngDialog', 'errorService'];
	  function myDatabaseCtrl(config, $http, userService, dataService, workbookService, workbookFactory, handsontableService, $rootScope, ngDialog, errorService) {
		  	var that=this;
		  	
		  	that.isShowFileList = false;//文件夹列表显示状态
		  	that.isShowCateList = false;//分类列表显示状态
		  	that.userInfo={user:{}};
		  	that.userInfo.user = dataService.getItem('_user');
		  	if(that.userInfo.user.id==undefined) {
		  		dataService.get('userInfo').then(function(data){
		  			that.userInfo.user.id=data.userID;
			  		that.userInfo.user.name=data.userName;
			  		that.userInfo.user.type=data.userType;
			  	});
		  	}
		  	
		  	
		  	
		  	
		  	that.databaseCates = [];
		  	that.saveRecord = {
		  			'filename':'',
		  			'classtype':0,
		  			'className':'',
		  			'keyword':'',
		  			'keywordId':0,
		  			'parentfileCode':'',
		  			'parentfileName':'',
		  			'userCode':that.userInfo.user.id
		  	}
		  	
		  	
		  	
		  	that.getCates = function() {
		  		if(that.databaseCates.length==0) {
		  			dataService.get('classifySelect',{}).then(function(data){
		  				that.databaseCates = data.value;
		  			});
		  		}
		  		
		  		that.isShowCateList = !that.isShowCateList;
		  	}
		  	that.selectCate = function(id,name) {
		  		that.saveRecord.classtype = id;
		  		that.saveRecord.className = name;
		  		that.isShowCateList = false;
		  	}
		  	that.getLabels = function() {
		  		var params= {
		  				'action' : 'relatTag',
		  				'keyword': that.saveRecord.keyword
		  		}
		  		dataService.get('searchTags',params).then(function(response) {
		  			that.labels = response;
		  		});
		  	}
		  	that.ihasfiles=[];
		  	that.getmyfiles = function() {
		  		if(that.ihasfiles.length==0) {
		  			dataService.get('queryFileList',{'parentFileCode':'','userCode':that.userInfo.user.id}).then(function(data){
		  				that.ihasfiles = data;
		  			});
		  		}
		  		that.isShowFileList = !that.isShowFileList;
		  		
		  	}
		  	that.selectLabel = function(id,name) {
		  		that.saveRecord.keywordId = id;
		  		that.saveRecord.keyword = name;
		  		that.labels=[];
		  	}
		  	that.selectMyfile = function(id,name) {
		  		that.saveRecord.parentfileCode = id;
		  		that.saveRecord.parentfileName = name;
		  		that.isShowFileList = false;
		  	}
		  	
		  	that.startSaveButton = function() {
		  		if(that.saveRecord.filename=='') {
		  			return false;
		  		}
		  		if(that.saveRecord.classtype==0) {
		  			return false;
		  		}
		  		if(that.saveRecord.keyword=='') {
		  			return false;
		  		}
		  		if(that.saveRecord.keywordId==0) {
		  			return false;
		  		}
		  		if(that.saveRecord.parentfileCode=='') {
		  			return false;
		  		}
		  	}
		  	
		  	$rootScope.$on('dirName',function(e,data) {
		  		that.saveRecord.parentfileName = data.file_name;
		  		that.saveRecord.parentfileCode = data.cude_id;
		  		$rootScope.$apply();
		  	});

		  	that.toSave = function() {
		  		if(that.startSaveButton()==false) {
		  			return false;
		  		}
		  		var params = {
		  				'filename'       :  that.saveRecord.filename,
		  				'classtype'      :  that.saveRecord.classtype,
		  				'keyword'        :  that.saveRecord.keyword,
		  				'keywordId'        :  that.saveRecord.keywordId,
		  				'parentfileCode' :  that.saveRecord.parentfileCode,
		  				'userCode'       :  that.saveRecord.userCode,
		  		}
		  		dataService.get('saveUpload',params).then(function(data){
	  				if(data==1) {
	  					return true;
	  				} else {
	  					return false;
	  				}
	  			});
		  		$('.save-data').hide();
		  		$('.shade').hide();
		  	}
		  	
		  	
		  	
		  	
		  	
		  	
		  	
		  	
		  	
		  	
		  	
		  	
		  	
		  	/**上传时间序列**/		  	
		  	function up() {
		  		new AjaxUpload('#time', {
		  			action: config.baseUrl+config.urlMap.uploadFile,
					name: 'filename',
					data:{'seriesType':'sj','userCode':that.userInfo.user.id},
					dataType: 'json',
					autoSubmit: true,
					onChange: function(file, extension){
						if(extension!=='xlsx'&&extension!=='xls'){ 
							alert("只支持xlsx和xls格式的文件"); 
							return false;
						} 
					},
					onSubmit: function(file, extension) {
					},
					onComplete: function(file, response){
		  	        	if(response=='true') {
		  	        		$('#select-file-type').hide();
			  	        	$("#xls-tab-sj").show();			  	        	
			  	        	//获取预览数据
			  	        	dataService.get('showUploadData',{'userCode':that.userInfo.user.id}).then(function(source) {
			  			  		var upload_data=[];
			  			  		var ob=source;
			  				  	for(var prop in ob){
			  				  		 upload_data[prop]=[];
			  				         for(var o in ob[prop]) {
			  				        	 upload_data[prop].push(ob[prop][o]);
			  				         }
			  				  	}
			  				  	$('#example1').handsontable({
			  			  	    	data: upload_data,
			  						minSqareRows:1,
			  						manualColumnResize: true,
			  						sortIndicator: true,
			  						colHeaders:true,
			  						outsideClickDeselects: false
			  			  	    });
			  			  	    $('#example1 .ht_clone_left.handsontable').hide();	
			  			  	});
		  	        	} else {
		  	        		alert(response);
		  	        	}	  	        	
		  	        }
				});
		  	}
		  	up();
		  	
		  	
		  	
		  	
		  	
		  	that.getYears = function() {
		  		dataService.get('yearSelect').then(function(source) {
		  			that.years = source.value;
		  		});
		  	}
		  	
		  	that.selectRecord = {
		  			'freqType'     :  '01',
		  			'freqYear'     :  '01',
		  			'freqMonth'    :  '01',
		  			'freqCoutry'   :  0,
		  			'freqProvince' :  0,
		  			'freqCity'     :  0,
		  			'freqCounty'   :  0,
		  			'regionCode'   :  '01',
		  			'zb'           : '0,1'
		  	}
		  	that.regions = {
		  			'country'  : {},
		  			'province' : {},
		  			'city'     : {},
		  			'county'   : {}
		  	}
		  	
		      	
		  	
		  	
		  	
		  	function select_region() {	  		
		  		$('.country-drop ul li').click(function(){
		  	        $('.countries span').text($(this).children().text());
		  	        if($(this).children().text()=='中国') {
		  	        	$('.detail').show();
		  	        	$.ajax({
		  	        		type:'GET',
		  	        		data:{regionCode:'',regclcId:2},
		  	        		url:config.baseUrl+config.urlMap.regionSelect,
		  	        		success:function(data) {
		  	        			that.regions.province = data;
		  	        		}
		  	        	});
		  	        }else{
		  	        	$('.detail').hide();
		  	        }
		  	    });

		  	    $('.countries').click(function(e){
		  	        $('.country-drop').toggle();
		  	        e.stopPropagation();
		  	    });
		  	    
		  	    $('.detail-1').click(function(e){
		  	    	$('.detail-drop').toggle();
		  	    	e.stopPropagation();
		  	    });
		  	    $('.detail .classify span').click(function(e){
		  	    	var index=$('.detail .classify span').index(this);
		  	    	$(this).addClass('selected').siblings().removeClass('selected');
		  	    	$('.select-board').hide();
		  	    	$('.select-board').eq(index).show();
		  	    	e.stopPropagation();
		  	    });
		  	    $('.select-board dd a ').click(function(e){
		  	    	//面板切换
		  	    	var n=$('.select-board').index($(this).parents('.select-board'));
		  	    	var hit=$(this).parents('.select-board');
		  	    	if(n<2){
		  	    		$('.detail .classify span').eq(n+1).addClass('selected').siblings().removeClass('selected');
		  	    		$('.select-board').hide();
		  	    		hit.next().show();
		  	    	}else{
		  	    		$('.detail-drop').hide();
		  	    	}
		  	    	//选择信息输入
		  	    	$('.detail-1 span').hide();
		  	    	var h=$('.detail-1 a').eq(n).text().split('')[0];
		  	    	$('.detail-1 a').eq(n).show().text(h+$(this).text());

		  	    	//按钮hover
		  	    	$('.select-board:eq('+n+') dd a').removeClass('bg');
		  	    	$(this).addClass('bg');

		  	    	e.stopPropagation();
		  	    });
		  	    
		  	    $(window).click(function(){
		  	    	$('.freq ul').hide();
		  	    });
		  	    
		  	    $('.freq input').click(function(e){
		  	    	var num = $('.freq input').index(this);
		  	    	if($('.freq ul:eq('+num+')').css('display')=='none') {
		  	    		$('.freq ul:eq('+num+')').show();
		  	    	} else {
		  	    		$('.freq ul:eq('+num+')').hide();
		  	    	}
		  	    	e.stopPropagation();
		  	    });
		  	    $('.freq ul li').click(function() {
		  	    	var num = $('.freq ul').index($(this).parents('ul'));
		  	    	$('.freq input:eq('+num+')').val($(this).text());
		  	    	
		  	    	if(num==0) {
		  	    		that.selectRecord.freqType = $(this).attr("value");
		  	    	} else if(num>1) {
		  	    		that.selectRecord.freqMonth = $(this).attr("value");
		  	    	}
		  	    	
		  	    	if($('.freq input:eq(0)').val()=='年') {
		  	    		$('.freq dd:gt(1)').hide();
		  	    	}else if($('.freq input:eq(0)').val()=='季') {
		  	    		$('.freq dd:gt(2)').hide();
		  	    		$('.freq dd:eq(2)').show();
		  	    	}else if($('.freq input:eq(0)').val()=='月') {
		  	    		$('.freq dd').show();
		  	    		$('.freq dd:eq(2)').hide();
		  	    	}
		  	    });
		  	    	  	    
		  	  
		  	}
		  	select_region();
		  	
		  	
		  	$('#example1').mouseup(function() {
		  		var colNum=$('#example1 td.current').index()+1;
		  		var row=$('#example1 td.current').parents('tr');
		  		var rowNum = row.index();
		  		that.selectRecord.zb=rowNum+','+colNum;
		  	});
		  	$(window).keyup(function(e) {
		  		if($('#example1 td.current').length>0) {
		  			if(e.keyCode===37||e.keyCode===38||e.keyCode===39||e.keyCode===40) {
			  			var colNum=$('#example1 td.current').index()+1;
				  		var row=$('#example1 td.current').parents('tr');
				  		var rowNum = row.index();
				  		that.selectRecord.zb=rowNum+','+colNum;
			  		}
		  		}		  		
		  	});
		  	
		  	
		  	
		  	that.selectYear = function(index,name) {
		  		that.selectRecord.freqYear = name.substr(0,4);
		  		$('.freq input:eq(1)').val(name);
		  	}
		  	
		  	that.getCity = function(id,name) {
		  		that.selectRecord.regionCode = id;
		  		$('.detail-1 span').hide();
	  	    	$('.detail-1 a').eq(0).css('display','inline-block').text(name);  	 
	  	    	$('.detail-1 span').hide();
	  	    	$('.detail-1 a').eq(1).hide().text(''); 
	  	    	$('.detail-1 span').hide();
	  	    	$('.detail-1 a').eq(2).hide().text(''); 
		  		$('.detail-drop').show();
		  		$('.detail .classify span:eq(1)').click();
		  		dataService.get('regionSelect',{'regionCode':id,'regclcId':3}).then(function(data) {
		  			that.regions.city = data;
		  		});
		  	}
		  	that.getCounty = function(id,name) {
		  		that.selectRecord.regionCode = id;
		  		$('.detail-1 span').hide();
	  	    	$('.detail-1 a').eq(1).css('display','inline-block').text('/'+name); 
	  	    	$('.detail-1 span').hide();
	  	    	$('.detail-1 a').eq(2).hide().text(''); 
	  			$('.detail-drop').show();
		  		$('.detail .classify span:eq(2)').click();
		  		dataService.get('regionSelect',{'regionCode':id,'regclcId':4}).then(function(data) {
		  			that.regions.county = data;
		  		});
		  	}
		  	that.selectCounty = function(id,name) {
		  		that.selectRecord.freqCounty = id;
		  		$('.detail-1 span').hide();
	  	    	$('.detail-1 a').eq(2).css('display','inline-block').text('/'+name); 
	  	    	$('.detail-drop').hide();
		  	}
		  	
		  	
		  	/**
		  	 * 解析表格
		  	 */
		  	that.toParse = function(type) {
		  		if(type=='sj') {//解析时间数据
		  			var params = {
		  					'code'     : that.selectRecord.regionCode,
		  					'freqId'   : that.selectRecord.freqType,
		  					'timeCode' : that.selectRecord.freqYear+that.selectRecord.freqMonth+'01'+that.selectRecord.freqType,
		  					'zb'       : '0,1',
		  					'userCode' : that.userInfo.user.id
		  			}
		  			$.ajax({
		  				type:'GET',
		  				data:params,
		  				url:config.baseUrl+config.urlMap.parseTable,
		  				success:function(response) {
		  					if(response.code==1) {
		  						$('#save-data').show();
		  						$('#xls-tab-sj').hide();
		  					} else {
		  						$('#analysis-failed').show();
		  						$('#xls-tab-sj').hide();
		  					}
		  				}
		  			});
		  		} else {//解析截面数据
		  			
		  		}
		  	}
		  	
		  	that.reAnalysis = function() {
		  		$('#upload-win').show();
		  		$('#analysis-failed').hide();
		  	}
		  	
		  	
		  	
		  	
		  	//上传截面数据提示框
		  	that.uploadJm = function() {
		  		errorService.showError('近日即将推出，敬请期待！');
		  	}
		  	
		}
})();