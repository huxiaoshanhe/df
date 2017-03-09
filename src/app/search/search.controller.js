(function() {
	
	angular
	  .module('pf.search')
	  .controller('searchCtrl', searchCtrl);
	searchCtrl.$inject=['$filter', 'coreCF', 'indicatorService', 'dataService', '$timeout', 'workbookFactory', 'workbookService'];
	function searchCtrl($filter, config, indicatorService, dataService, $timeout, workbookFactory, workbookService) {
		var that=this;
		that.itemsPerPage = 10;
		that.currentPage = 1;
		that.keywords='';
		that.frequent='';
		that.area=-1;
		that.typeName='';
		that.source='';
		that.publish='';
		that.items=[];
		
		that.getRecommends = function() {
			$timeout(function() {
				dataService.get('search',{'action':'indicator','keywords':that.keywords}).then(function(source) {
					that.recommend_keywords = source;
					return source;
		 	    });
			},2000);
			$('.recommend_keywords').show();
		}
		that.selectKeywords = function(str) {
			that.keywords= str;
			that.sousuo();
		}
		that.sousuo=function() {
			if(that.keywords=='') {
				return false;
			}
			$('.recommend_keywords').hide();
			that.currentPage = 1;
			var params={
					'action' : 'indicator',
					'keywords' : that.keywords,
					'page'    : that.currentPage,
					'qic.cubeId':-1
			};
			that.frequent='';
			that.area=-1;
			that.typeName='';
			that.orgZh='';
			that.sourceZh='';
			$('.frequent').find('p').text('频度').css('background','url(../assets/images/arrow-drop-icon.png) right center no-repeat');
			$('.area').find('p').text('区域筛选').css('background','url(../assets/images/arrow-drop-icon.png) right center no-repeat');
			$('.field').find('p').text('领域筛选').css('background','url(../assets/images/arrow-drop-icon.png) right center no-repeat');
			$('.source').find('p').text('来源筛选').css('background','url(../assets/images/arrow-drop-icon.png) right center no-repeat');
			$('.publish').find('p').text('出版物筛选').css('background','url(../assets/images/arrow-drop-icon.png) right center no-repeat');
			$('.del-condition').css('display','none');
			dataService.get('searchPage',params).then(function(source) {
				if(source.entity.length!=0) {
					that.items=source.entity;
				}		
	 	    });				
		}
		
		
		
		that.shaixuan = function(num) {
			if(that.frequent=='') {
				that.frequent=null;
			}
			if(that.typeName=='') {
				that.typeName=null;
			}
			if(that.orgZh=='') {
				that.orgZh=null;
			}
			if(that.sourceZh=='') {
				that.sourceZh=null;
			}
			var params={
					'action' : 'indicator',
					'keywords' : that.keywords,
					'page'    : that.currentPage,
					'qic.freqId':that.frequent,
					'qic.cubeId':that.area,
					'qic.typeName':that.typeName,
					'qic.orgZh':that.orgZh,
					'qic.source':that.sourceZh
			};
			that.currentPage=num;
			
			dataService.get('searchPage',params).then(function(source) {
				if(source.entity.length!=0) {
					that.items=source.entity;
				}else {
					that.items={entityList:[{'nameZh':'无相关结果'}]};
				}	
	 	    });
		}
		
        
        //筛选频度、来源……
		that.shaixuanFreq= function(num,str) {
			$('.frequent').find('p').text(str).css('background','none').attr('title',str);
    		that.frequent=num;
    		$('.frequent').find('.del-condition').css('display','block');
    		that.shaixuan(1);
		}
		that.shaixuanArea= function(num,str) {
			$('.area').find('p').text(str).css('background','none').attr('title',str);
    		that.area=num;
    		$('.area').find('.del-condition').css('display','block');
    		that.shaixuan(1);
		}
		that.shaixuanField= function(str) {
			$('.field').find('p').text(str).css('background','none').attr('title',str);
    		that.typeName=str;
    		$('.field').find('.del-condition').css('display','block');
    		that.shaixuan(1);
		}
		that.shaixuanSource= function(str) {
			$('.source').find('p').text(str).css('background','none').attr('title',str);
    		that.orgZh=str;
    		$('.source').find('.del-condition').css('display','block');
    		that.shaixuan(1);
		}
		that.shaixuanPublish= function(str) {
			$('.publish').find('p').text(str).css('background','none').attr('title',str);
    		that.sourceZh=str;
    		$('.publish').find('.del-condition').css('display','block');
    		that.shaixuan(1);
		}
		
		that.cancelCondition = function(str,name) {
			switch(str) {
			case 'frequent':
	    		that.frequent=null;
	    		break;
			case 'area':
				that.area=-1;
				break;
			case 'field':
				that.typeName=null;
				break;
			case 'source':
				that.orgZh=null;
				break;
			case 'publish':
				that.sourceZh=null;
				break;
			}
			$('.'+str).find('p').text(name).css('background','url(../assets/images/arrow-drop-icon.png) right center no-repeat');
			$('.'+str).find('.del-condition').css('display','none');
			that.shaixuan(1);
		}
        
       
		/**
		 * 上一页
		 */
        that.prevPage = function () {
            if (that.currentPage > 1) {
            	that.currentPage--;
            	that.shaixuan(that.currentPage);
            }
        };
        
        /**
         * 下一页
         */
        that.nextPage = function () {
            that.currentPage+=1;
            that.shaixuan(that.currentPage);
        };   
                
        
        
        /**
		 * 搜索选中取消选中
		 **/
		that.selectRecord={
				code:[]
		}
		that.searchselected=function(id) {
			var index=that.selectRecord.code.indexOf(id);
			if(index===-1) {
				that.selectRecord.code.push(id);
			} else {
				that.selectRecord.code.splice(index,1);
			}
		}
		/**
		 * 搜索全选取消全选 
		 **/
		that.selectall=function() {
			if($("#search .selectall").hasClass("selected")) {
				that.selectRecord.code=[];
			} else {
				for(var i=0;i<that.items.entityList.length;i++) {
					var index=that.selectRecord.code.indexOf(that.items.entityList[i].indicatorCode);
					if(index===-1) {
						that.selectRecord.code.push(that.items.entityList[i].indicatorCode);
					}
				}
			}			
		}
		
		
		/**添加选定指标**/
		that.addIndicator=function() {
			that.selected={};
			$('#search td .checkbox.selected').each(function(index,e) {
				var code=$(e).attr('value');
				eval("that.selected['"+code+"']=true");
			});
			if(config.isAddSheet===false) {
				indicatorService.addSheetSync(that.selected);
			} else if(config.isAddSheet===true) {
			      var codes_1=that.selectRecord.code;
			      var codes1='';
			      for(var i=0;i<codes_1.length;i++) {
			    	  if(i===codes_1.length-1) {
			    		  codes1+='"'+codes_1[i]+'"';
			    	  } else {
			    		  codes1+='"'+codes_1[i]+'",';
			    	  }
			      }
			      var params = {
			    		  'dims':'[{"codeName":"indicatorCode","codes":['+codes1+']}]',
			    		  'productID': '00010000000000000000000000000001'
			      };
			      
			      /**累加指标浏览次数**/
			      angular.forEach(codes_1,function(v,k) {
			      	updateLookNum(v,'looknum');
			      });
			      /**累加指标浏览次数**/

			      config.isMyUploadFile = 0;
			     dataService.get('sync',params).then(function(result) {
			    	  var source = workbookFactory.parse(result);
			    	  /**记录访问历史开始**/
		              var _indicators = codes_1;
		              var nearestCheck = dataService.getItem('nearestCheck');
		              var now = new Date();
		              var yy = now.getFullYear();      //年
		              var mm = now.getMonth() + 1;     //月
		              var dd = now.getDate();          //日
		              var hh = now.getHours();         //时
		              var ii = now.getMinutes();       //分
		              var ss = now.getSeconds();
		              var recordData={
		               'name':source.sheets[0].name,
		               'indicators':_indicators,
		               'time':yy+'-'+mm+'-'+dd+' '+hh+':'+ii+':'+ss
		              }
		              if(nearestCheck[0]==undefined) {
		               dataService.setItem('nearestCheck',JSON.stringify([recordData]));
		              } else {
		              if(nearestCheck.length>=10) {
		                nearestCheck.splice(0,(nearestCheck.length-10));
		              }
		              for(var i=0;i<nearestCheck.length;i++) {
		                if(nearestCheck[i].name==source.sheets[0].name) {
		                  nearestCheck.splice(i,1);           
		                }
		              }
		              nearestCheck.push(recordData);
		              dataService.setItem('nearestCheck',JSON.stringify(nearestCheck));
		          	 }
		          	 /**记录访问历史结束**/
		          	 //删除cookie:userData——这些都是为了刷新时展示最近的访问指标
		          	 dataService.removeCookie('userData',{domain:config.domain});

		  			 workbookService.addMySheet(source);
			     });
			}
			that.selected={};
			$('#search').hide();
			that.items = [];
			that.selectRecord.code=[];
			
			/**缓存最近搜索的10个关键词**/			
			var searchHistory = dataService.getItem('searchHistory');
			var now = new Date();
            var yy = now.getFullYear();      //年
            var mm = now.getMonth() + 1;     //月
            var dd = now.getDate();          //日
            var hh = now.getHours();         //时
            var ii = now.getMinutes();       //分
            var ss = now.getSeconds();
			var recordData={'keywords':that.keywords,'time':yy+'-'+mm+'-'+dd+' '+hh+':'+ii+':'+ss}
		      
			
			if(searchHistory[0]==undefined) {
		    	  dataService.setItem('searchHistory',JSON.stringify([recordData]));
		      } else {
		    	  if(searchHistory.length>=9) {
		    		  searchHistory.splice(0,(searchHistory.length-9));
		    	  }
		    	  for(var i=0;i<searchHistory.length;i++) {
		    		  if(searchHistory[i].keywords==that.keywords) {
		    			  searchHistory.splice(i,1);    			  
		    		  }
		    	  }
		    	  searchHistory.push(recordData);
				  dataService.setItem('searchHistory',JSON.stringify(searchHistory));
		     }
			/**缓存最近搜索的10个关键词**/
			
		}

		function updateLookNum(code,field){
	        $.ajax({
	            url:config.mainUrl+'update/upindic',
	            data:{"code":code,"upField":field},
	            dataType:'json',
	            type:'post',
	            success:function(result){
	            }
	        });
	    }
		
		that.keyboard = function() {
			$(".search input[name='keywords']").keyup(function(e) {
				if (e.keyCode === 13) {
                    that.sousuo();
                    return false;
                }
			});
		}
		that.keyboard();
		
		//windowlayerService.windowLayer(814,542,'#search');
		
	}
})();