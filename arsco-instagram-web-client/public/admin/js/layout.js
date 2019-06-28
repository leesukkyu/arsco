$(function(){
    /* gnb와 lnb의 애니메이션이 싫다면 삭제해 주세요.*/
    var $w = $(window)
    var $b = $('body')
    
    if($w.scrollTop() > 0){
      $b.addClass('fold')  
    }
    
    $w.scroll(function(e){
        if($w.scrollTop() > 0){
            $b.addClass('fold')
        }
        else{
            $b.removeClass('fold')
        }       
    })

    /* 우측 내 정보 보기 */
    $('#myInfoBtn').on('click',(function(){
    	var hideMyInfo = function(e){
    		if($(e.target).closest("#myInfoBtnBox").length == 0){
    			$b.off('click',hideMyInfo)
    			$('#myInfoPopupWrap').removeClass('active').css('opacity',0)
    			setTimeout(function(){
    				$t.css('display','none')
    			},230)
    		}
    	}
    	return function(e){
    		var $t = $('#myInfoPopupWrap');
    		if($t.hasClass('active')){
    			$b.off('click',hideMyInfo)
    			$t.removeClass('active').css('opacity',0)
    			setTimeout(function(){
    				$t.css('display','none')
    			},230)
    		}else{
    			$t.addClass('active').css('display','block')
    				setTimeout(function(){
    				$t.css('opacity',1)
    				$b.on('click',hideMyInfo)
    			},1)
    		}       
    	}
    })())
    
    // 달력 오픈
    $('#AddDateInfoBtn').on('click',(function(){
    	var calendarOptionWrapHide = function(e){
    		if($(e.target).closest("#calendarOptionWrap").length == 0){
    			$('#calendarOptionWrap').fadeOut('fast');
    			$b.off('click',calendarOptionWrapHide)
    			$('#calendarOptionWrap').removeClass('active')
    		}
    	}
    	return function(e){
    		if($('#calendarOptionWrap').hasClass('active')){
    			$('#calendarOptionWrap').removeClass('active').fadeOut('fast');
    		}else{
    			$('#calendarOptionWrap').addClass('active').fadeIn('fast');
    			$b.on('click',calendarOptionWrapHide)
    			e.stopPropagation();
    			$(e).stop()
    		}
    	}
    })())
})

/*달력 컨트롤*/
$(function(){
		var $b = $('body')
		/*설정해주세요. 하드코딩 하셔도 되고 API 이용해도 됩니다.*/
		var STARTYEAR = 2015;						// 달력 목록의 시작 년도
		var ENDYEAR = 2016;							// 달력 목록의 끝 년도
		var TARGET_ID = '#calendarWrap';			// 달력을 그릴 영역의 아이디
		var ENG 		= true;							// 영어용인지 아닌지
		var dateClick = function(){					// 사용자가 날짜 선택 시 콜백
			var $this = $(this)
			alert('dateClick : ' + $this.attr('data-year') + '.' + $this.attr('data-month') + '.' + $this.attr('data-day'))
		}
		var API = {
				setSTARTYEAR : function(t){
					STARTYEAR = t
				},
				setENDYEAR : function(t){
					ENDYEAR = t
				},
				setENG : function(t){
					ENG = ENG
				},
				setDateClick : function(t){
					dateClick = t
				}
		}
		
		/*이하 달력 코드*/
		var calendar = (function(){
			var calcMonth=function(){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,a=new Date,s=["일","월","화","수","목","금","토"],t=function(){var a;return function(b){return a=b%7-1,a>=0?s[a]:"토"}}();return function(s,u,v){if(c=0,m=1,p=[],q=[],r=[],a.setFullYear(s,u,0),e=a.getDate(),a.setFullYear(s,u-1,1),f=a.getDay(),a.setFullYear(s,u-1,e),g=a.getDay(),n=s,o=u-1,f>0)for(a.setFullYear(n,o,0),h=a.getDate(),i=a.getFullYear(),j=a.getMonth()+1,c=h-f+1,d=h,c;c<=d;c++,m++)p.push({day:c,year:i,month:j,isThisMonth:0,dow:t(m)});for(d=e,c=1;c<=d;c++,m++)m%7-1!=0?m%7-1!=1?q.push({day:c,year:n,month:u,isThisMonth:1,dow:t(m)}):q.push({day:c,year:n,month:u,isThisMonth:1,weekendData:1,dow:t(m)}):q.push({day:c,year:n,month:u,isThisMonth:1,weekendData:0,dow:t(m)});for(c=6-g,b=1,a.setFullYear(n,u,1),k=a.getFullYear(),l=a.getMonth()+1,d=36,m;m<d;m++,b++)r.push({day:b,year:k,month:l,isThisMonth:2,dow:t(m)});if(0==r.length)for(d=43,m;m<d;m++,b++)r.push({day:b,year:k,month:l,isThisMonth:2,dow:t(m)});return q[0]?q[0].first=!0:0,r[0]?r[0].first=!0:0,{list1:p,list2:q,list3:r}}}();
			var TODAY = new Date()
			var YEAR, MONTH;
			var MONTH_ENG = ['January','February','March','April','May','June', 'July', 'August', 'September', 'October', 'November','December']
			var MONTH_KOR = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
			var WEEK_ENG = ['Su','Mo','Tu','We','Th','Fr','Sa']	
			var WEEK_KOR = ['일','월','화','수','목','금','토','일']
			var drawCalendar = function(){
				//YEAR, MONTH 를 가지고 그린다.
				var data = calcMonth(YEAR, MONTH)
				var tag = '';
				for(var i in data.list1){
					tag += '<button class="hide past day"></button>'
				}
				for(var i in data.list2){
					tag += '<button class="thisMonth day font-1" data-year="'+data.list2[i].year+'" data-month="'+data.list2[i].month+'" data-day="'+data.list2[i].day+'">'+data.list2[i].day+'</button>'		
				}
				for(var i in data.list3){
					tag += '<button class="hide next day"></button>'
				}
				$('#dayWrap').html(tag);
				$('.thisMonth').on('click',dateClick)
				if(ENG){
					$('#monthViewSelectBtn').html(MONTH_ENG[MONTH-1]+' '+YEAR);
				}else{
					$('#monthViewSelectBtn').html(MONTH_KOR[MONTH-1]+' '+YEAR);				
				}
			}
			var leftMenuClick = function(){
				MONTH--;
				if(MONTH<=0){
					MONTH = 12;
					YEAR--;
				}
				drawCalendar();
			}
			var rightMenuClick = function(){
				MONTH++;
				if(MONTH>=13){
					MONTH = 1;
					YEAR++;
				}
				drawCalendar();
			}
			var monthSelect = function(e){
				var $this = $(this)
				YEAR = $this.attr('data-year');
				MONTH = $this.attr('data-month');
				drawCalendar();
				$('#monthSelectList').hide();
				$b.off('click',hideMonthList)
			}
			var viewMonthList = function(e){
				$('#monthSelectList').show();
				$b.on('click',hideMonthList);
				e.stopPropagation();
				$(e).stop()
			}
			var hideMonthList = function(e){
				if($(e.target).closest("#monthSelectList").length == 0){
					$('#monthSelectList').hide();
					$b.off('click',hideMonthList)
				}
			}
			var currentMonthSelect = function(){
				$('#monthSelectList').hide();
				$b.off('click',hideMonthList)
			}
			var init = (function(){
				var attachEvent = function(){
					$('#calendarLeftNavi').on('click',leftMenuClick)
					$('#calendarRightNavi').on('click',rightMenuClick)
					$('#monthViewSelectBtn').on('click',viewMonthList)
				}
				var dateSetting = function(){
					YEAR = TODAY.getFullYear()
					MONTH = TODAY.getMonth() + 1
				}
				var setMonthList = function(){
					var year = STARTYEAR;
					var i;
					var $t = $('#monthSelectList')
					for(year;year<=ENDYEAR;year++){
						i = 1;
						for(i;i<=12;i++){
							if(ENG){
								$('<button class="monthSelectBtn" data-year="'+year+'" data-month="'+i+'">'+MONTH_ENG[i-1]+' '+year+'</button>').on('click',monthSelect).prependTo($t)
							}else{
								$('<button class="monthSelectBtn" data-year="'+year+'" data-month="'+i+'">'+MONTH_KOR[i-1]+' '+year+'</button>').on('click',monthSelect).prependTo($t)
							}
						}
					}
					if(ENG){
						$('<button class="monthSelectBtn active">'+MONTH_ENG[MONTH-1]+' '+YEAR+'</button>').on('click',currentMonthSelect).prependTo($t)
					}else{
						$('<button class="monthSelectBtn active">'+MONTH_KOR[MONTH-1]+' '+YEAR+'</button>').on('click',currentMonthSelect).prependTo($t)
					}
				}
				var drawWeek = function(){
					var tag = '';
					if(ENG){
						for(var i in WEEK_ENG){
							tag += '<span class="weekTxt">'+WEEK_ENG[i]+'</span>'
						}
					}else{
						for(var i in WEEK_ENG){
							tag += '<span class="weekTxt">'+WEEK_KOR[i]+'</span>'
						}
					}
					$('#weekWrap').html(tag)
				}
				return function(){
					$(TARGET_ID).html(	'<div class="calendarHeader">	<div class="calendarBtn navi left" id="calendarLeftNavi"></div><div class="calendarBtn monthBox"><button class="monthViewSelectBtn font-1" id="monthViewSelectBtn"></button><div class="monthSelectList" id="monthSelectList"></div></div><div class="calendarBtn navi right" id="calendarRightNavi"></div></div><div class="weekWrap" id="weekWrap"></div><div class="dayWrap clearfix" id="dayWrap"></div>')
					dateSetting();
					setMonthList();
					attachEvent();
					drawWeek();
					drawCalendar();
				}
			})()
			return {
				init : init,
				API : API
			}
	})()
	
	//calendar.API.setENDYEAR(STARTYEAR) // 이런식으로 달력을 설정해주세요
	calendar.init();
})

