/*!
 * Dopeless Rotate - jQuery Plugin
 * version: 1.2.5 (24/07/2013)
 *
 * Documentation and license http://www.dopeless-design.de/dopeless-rotate-jquery-plugin-for-360-degree-product-view.html
 *
 * (c) 2013 Dopeless Design (Rostyslav Chernyakhovskyy) - mail@dopeless-design.de
 */

(function( $ ){
var is_touch_device = 'ontouchstart' in document.documentElement;

$.fn.tsRotate = function( options ) {  
    var settings = $.extend( {
        'zoom' : true,
        'reverse' : false,
        'disablelogo' : false,
        'nophp' : false,
        'nophpimglist' : '',
        'nophpzoomlist' : '',
        'startfrom' : 0,
        'zoomfolder' : 'zoomimages',
        'pathtophp' : 'dopelessRotate/scripts/',
        'hotspots' : false,
        'hotspotsTitle' : 'Highlights',
        'hotspotsFade' : true,
        'changeAxis' : false,
        'rightclass' : false,
        'leftclass' : false,
        'playstopclass' : false,
        'autorotate' : false,
        'rotateloop' : true,
        'autorotatespeed' : 100,
        'rotatehover' : false,
        'speedmultiplyer' : 1,
        'wheelRotate' : false
    }, options);
    var zoomDiv = (settings.zoom) ? '<div class="zoom"></div>' : '';
    var pointerDiv = (settings.changeAxis) ? '' : '<div class="round"><div class="pointer_object"></div><div class="pointer"></div></div>';
    var direction = (settings.reverse) ? -1 : 1;
    var addLogo = (settings.disablelogo) ? '' : '';
    var currentFrame = settings.startfrom;
    var startFrame = settings.startfrom;
    var zoomfolder = settings.zoomfolder;
    var pathtophp = settings.pathtophp;
    var nophp = settings.nophp;
    var hotspots = settings.hotspots;
    var highlightsHidden = true;
    var changeAxis = settings.changeAxis;
    var goright = settings.rightclass;
    var goleft = settings.leftclass;
    var playstop = settings.playstopclass;
    var isautorotate = settings.autorotate;
    var isrotateloop = settings.rotateloop;
    var rotatehover = settings.rotatehover;
    if(!isrotateloop){
        var autorotateFrame = 0;
    }
    var autorotatespeed = settings.autorotatespeed;
    var speedMult = settings.speedmultiplyer;
    var wheelRotate = settings.wheelRotate;
    if(speedMult != 1){
        speedMult = speedMult/10 + 1;
    }
    var hsFade = settings.hotspotsFade;
    if(hotspots){
        var toti;     
    }
    var hotspotsTitle = settings.hotspotsTitle;
    if(nophp){
        var nophpimglist = settings.nophpimglist;
        var nophpzoomlist = settings.nophpzoomlist;
    }
    var fullpath = $(this)[0].src;
    var a = document.createElement('a');
    a.href = fullpath;
    var imgpath = a.pathname + a.search;
    var thisName = $(this).attr('id');
    if (playstop){
        if(isautorotate){
            $('.'+thisName+'.'+playstop+'').addClass('busy');
        }
    }
    var contWidth = $(this).attr('width');
    var contHeight = $(this).attr('height');
    
    var screenWidth = screen.width;
    
    if(contWidth > screenWidth){
        contHeight = Math.ceil(screenWidth*contHeight/contWidth);
        contWidth = screenWidth;
    }
    
    
    $(this).wrap('<div class="ts_holder" id="holder_'+thisName+'"/>');
    var doc = $(document);
    var holder = $('#holder_'+thisName+'');
    holder.html("<img class='ts_img_view' src='' /><img class='ts_imgzoom_view' src='' />"+pointerDiv+zoomDiv+"<div class='loading_bg'><div class='loading'><p>loading</p><div class='loading_bar'><div class='loading_bar_inside'></div></div></div></div><div class='zoomload_bg'><div class='zoomload_gif'></div></div></div>"+addLogo);
    var image = $(holder).find('.ts_img_view');
    var imagezoom = $(holder).find('.ts_imgzoom_view');
    var round = $(holder).find('.round');
    var contOffset = holder.offset();
    var setRoundWidth = Math.ceil(contWidth/5);
    var setPointerWidth = Math.ceil(setRoundWidth/10);
    var rotCenter = setRoundWidth/2 - setPointerWidth/2 -1;
    var rotRadius = setRoundWidth/2 - setPointerWidth;
    var setPointerObjectWidth = setRoundWidth/2-setPointerWidth*2;
    var setPointerObjectOffset = (setRoundWidth - setPointerObjectWidth)/2;
    var zoomLoadLeft = Math.round((contWidth-220)/2);
    var zoomLoadTop = Math.round((contHeight-20)/2);
    var loadingWidth = Math.round(contWidth/100*40);
    var loadingHeight = 72;
    var loadingLeft = Math.round((contWidth-loadingWidth)/2)
    var loadingTop = Math.round((contHeight-loadingHeight)/2);
    var loadingBarWidth = Math.round(loadingWidth/100*80);
    var loadingBarLeft = Math.round((loadingWidth-loadingBarWidth)/2);
    var loadingBarBottom = Math.round(loadingHeight/100*15);
    var loadingBarInsideFWidth = loadingBarWidth - 4;
    var loadingBarInsideWidth;
    var autorotate;
    var rotateright;
    var rotateleft;
    var playing = false;
    holder.bind('dragstart', function(event) { event.preventDefault() });
    holder.children().bind('dragstart', function(event) { event.preventDefault() });
    holder.css({'width':contWidth, 'height':contHeight});
    _css('.loading_bg, .zoomload_bg',{'width':contWidth, 'height':contHeight});
    _css('.zoomload_gif',{'left':zoomLoadLeft, 'top':zoomLoadTop});
    _css('.loading',{'width':loadingWidth, 'height':loadingHeight, 'left':loadingLeft, 'top':loadingTop});
    _css('.loading_bar',{'width':loadingBarWidth, 'left':loadingBarLeft, 'bottom':loadingBarBottom});
    _css('.round',{'width':setRoundWidth, 'height':setRoundWidth});
    _css('.pointer',{'width':setPointerWidth, 'height':setPointerWidth, 'left':rotCenter, 'top':rotCenter*2});
    _css('.zoom',{'top':setRoundWidth+setRoundWidth/10+10, 'right':(setRoundWidth-30)/2-3});
    if (changeAxis){
        _css('.zoom',{'top':25, 'right':(setRoundWidth-30)/2-3});
    }
    else{
        _css('.zoom',{'top':setRoundWidth+setRoundWidth/10+10, 'right':(setRoundWidth-30)/2-3});
    }
    _css('.pointer_object',{'width':setPointerObjectWidth, 'height':setPointerObjectWidth, 'left':setPointerObjectOffset, 'top':setPointerObjectOffset});
    holder.find('.loading_bg').fadeIn();
    function _css(elem,rules){
        holder.find(elem).css(rules);
    }
    
    var imagelist;
    var zoomlist;
    var countFrames;
    var zoomon;
    
    if(!nophp){
        $.getJSON(pathtophp+"/loadimages.php", {fname:imgpath, zoomdir:zoomfolder}, function(output) {
            imagelist = jQuery.makeArray(output.imagelist);
            zoomlist = jQuery.makeArray(output.zoomlist);
            countFrames = imagelist.length;
            preload(imagelist,countFrames);
        }); 
    }

    if(nophp){
        imagelist = nophpimglist.split(',');
        zoomlist = nophpzoomlist.split(',');
        countFrames = imagelist.length;
        preload(imagelist,countFrames);
    }

    function preload(arrayOfImages,countFrames) {
        
        var perc = 0;
        var thisFrame = 0;
        var cache = [];
        
        $(arrayOfImages).each(function(){
            var im = $("<img>").attr("src",this).load(function() {
                perc = perc + 100/countFrames;
                loadingBarInsideWidth = Math.round(loadingBarInsideFWidth/100*perc);
                $(holder).find('.loading_bar_inside').css('width',loadingBarInsideWidth);
                if(Math.round(perc) == 100){
                    $(holder).find('.loading_bg').fadeOut();
                    $(holder).find('.round, .zoom').fadeIn();
                    if(hotspots){
                       showHighlights();
                   }
                }
            });
            
            thisFrame++;
            image.attr('src', this);
            cache.push(im);
            
        });
        image.attr('src', arrayOfImages[currentFrame]);
        setPointer();
        
        if(hotspots){
            var counthotspots =  holder.parent('.dopelessrotate').find('.sethotspot').length;
            if(counthotspots < 1){
                alert('Please add at least one hotspot element (see manual)');
            }
            else{
                toti = new Array();
                holder.parent('.dopelessrotate').find('.sethotspot').each(function(index){
                    var frame = $(this).attr('href');
                    var posix = $(this).attr('posix');
                    var posiy = $(this).attr('posiy');
                    var title = $(this).attr('title');
                    var nomenu = parseInt($(this).attr('nomenu'));
                    var text = $(this).text();
                    var link = $(this).attr('link');
                    var target = $(this).attr('target');
                    if(typeof target == 'undefined'){
                        target = "_self";
                    }
                    
                    $(this).remove();
                    toti[index] = new Object();
                    toti[index]["frame"] = frame;
                    toti[index]["posix"] = posix;
                    toti[index]["posiy"] = posiy;
                    toti[index]["title"] = title;
                    toti[index]["text"] = text;
                    toti[index]["nomenu"] = nomenu;
                    toti[index]["link"] = link;
                    toti[index]["target"] = target;
                    if((index + 1) == counthotspots){
                        holder.append('<div class="highlights"><a href="#" class="highlights_but">'+hotspotsTitle+'</a></div>');
                        for (var i = 0; i < toti.length; i++) {
                            if(toti[i].nomenu != 1){
                                holder.find('.highlights').append('<a class="highlights_item" href="'+i+'">'+toti[i].title+'</a>');
                                $('.highlights_item').css({'display':'none'});
                            }
                        }
                    }
                });
            }
        }
        
        if(isautorotate){
            startautorotate();
        }
                
        
    }
    
    if(isautorotate){
        holder.on('mousedown',function(){
             stopautorotate();
        })
        if(is_touch_device){
            holder.on('touchstart',function(){
                stopautorotate();
            })
        }
    }
    
    if(hotspots){
        var expanded = false;
        
        $(document).on('click','.highlights_but',function(e){e.preventDefault();});
    
    
        holder.find('.ts_img_view').on('click',function(){
            holder.find('.highlights_item').removeClass('active');
            if(expanded){
                collapseHighlight();
            }
        })
        
        holder.on('mouseenter','.highlights',function(){
            $(this).find('.highlights_item').css({'display':'block'});
            $(this).on('mouseleave',function(){
                $(this).find('.highlights_item').css({'display':'none'});
            })
        });
        
        holder.on('click','.highlights_item',function(e){
            e.stopPropagation();
            e.preventDefault(); 
        });
        
        holder.on('click','.highlights_item:not(.active)',function(e){
            e.stopPropagation();
            holder.find('.highlights_item').removeClass('active');
            $(this).addClass('active');
            var itemid = parseInt($(this).attr('href'));
            var frameno = parseInt(toti[itemid].frame);
            if (frameno != currentFrame){
                hideHighlights();   
                getFrame(frameno,itemid);
            }
            else{
                if(expanded){   
                    collapseHighlight(function(){
                        expandHighlight(itemid); 
                    });
                }
                else{
                    expandHighlight(itemid); 
                }
            }
        });
        
        holder.on( 'click', '.hotspot:not(.expanded)', function(e){
            e.stopPropagation();
            var itemid = parseInt($(this).attr('id').replace('hs',''));
            if(expanded){
                collapseHighlight(function(){
                    expandHighlight(itemid); 
                });
            }
            else{
                expandHighlight(itemid); 
            }
            
        });
        
        
        if(!is_touch_device){
            holder.on( 'click', '.expanded', function(e){
                e.stopPropagation();
                holder.find('.highlights_item').removeClass('active');
                collapseHighlight();
            })
        }
        
        if(is_touch_device){
            holder.find('.ts_img_view').on('touchstart',function(){
                holder.find('.highlights_item').removeClass('active');
                if(expanded){
                    collapseHighlight();
                }
            })
            
            holder.on('touchstart','.highlights',function(e){
                e.stopPropagation();
                e.preventDefault(); 
                $(this).find('.highlights_item').css({'display':'block'});
            });
            
            holder.on('touchend','.highlights_item',function(e){
                e.stopPropagation();
                e.preventDefault(); 
            });
            
            holder.on('touchend','.highlights_item:not(.active)',function(e){
                e.stopPropagation();
                holder.find('.highlights_item').removeClass('active');
                $(this).addClass('active');
                var itemid = parseInt($(this).attr('href'));
                var frameno = parseInt(toti[itemid].frame);
                if (frameno != currentFrame){
                    hideHighlights();   
                    getFrame(frameno,itemid);
                }
                else{
                    if(expanded){
                        collapseHighlight(function(){
                            expandHighlight(itemid); 
                        });
                    }
                    else{
                        expandHighlight(itemid); 
                    }
                }
            });
            
            holder.on( 'touchend', '.hotspot:not(.expanded)', function(e){
                e.stopPropagation();
                var itemid = parseInt($(this).attr('id').replace('hs',''));
                if(expanded){
                    collapseHighlight(function(){
                        expandHighlight(itemid); 
                    });
                }
                else{
                    expandHighlight(itemid); 
                }
            });
            
            holder.on( 'touchend', '.expanded', function(e){
                e.stopPropagation();
                holder.find('.highlights_item').removeClass('active');
                collapseHighlight();
            })
        }
    
        function getFrame(frameno,itemid){
            (function step() {
                    if(currentFrame > frameno){
                        currentFrame--;  
                        image.attr('src', imagelist[currentFrame]);
                        if(currentFrame == frameno){
                            startFrame = currentFrame;
                            showHighlights(itemid);
                            setPointer();
                        }
                        else{
                            setTimeout(step, 30);
                        }
                    }
                    if(currentFrame < frameno){
                        currentFrame++;  
                        image.attr('src', imagelist[currentFrame]);
                        if(currentFrame == frameno){
                            startFrame = currentFrame;
                            showHighlights(itemid);
                            setPointer();
                        }
                        else{
                            setTimeout(step, 30);
                        }
                    }
            })();
        }  
        
        
        
        function showHighlights(itemid){
            holder.find('.expanded').removeClass('expanded').find('.hltitle,.hltext').remove();
            holder.find('.highlights_item').removeClass('active');
            for (var i = 0; i < toti.length; i++) {    
                if(toti[i].frame == currentFrame){
                    
                    holder.append('<div class="hotspot" id="hs'+i+'"></div>');
                    holder.find('#hs'+i+'').css({
                        'top':toti[i].posiy+'%',
                        'left':toti[i].posix+'%'
                    }).fadeIn(50);
                    if(toti[i].posix > 60){
                        holder.find('#hs'+i+'').addClass('posr');
                    }
                    if(toti[i].posiy > 75){
                        holder.find('#hs'+i+'').addClass('posb');
                    }
                    
                }
            }
            
            if(itemid !== undefined){
                expandHighlight(itemid);
            }
            highlightsHidden = false;
        }
    
        function hideHighlights(){
            if(expanded){
                collapseHighlight(function(){
                    holder.find('.highlights_item').removeClass('active');
                    if(hsFade){
                        holder.find('.hotspot').fadeOut(150, function(){
                            $(this).remove();
                        });
                    }
                    else{
                        holder.find('.hotspot').css({'display':'none'});
                        $(this).remove();
                    }
                    highlightsHidden = true;
                })
            }
            else{
                holder.find('.highlights_item').removeClass('active');
                if(hsFade){
                    holder.find('.hotspot').fadeOut(150, function(){
                        $(this).remove();
                    });
                }
                else{
                    holder.find('.hotspot').css({'display':'none'});
                    $(this).remove();
                }
                highlightsHidden = true;
            }
        }
        
        function expandHighlight(itemid){
            if(itemid !== undefined){
                holder.find('.highlights_item').removeClass('active');
                holder.find('.highlights_item[href="'+itemid+'"]').addClass('active');
                holder.find('#hs'+itemid+'').addClass('expanded').append('<span class="hltitle">'+toti[itemid].title+'</span>');
     
                if(toti[itemid].text){
                    if (holder.find('#hs'+itemid+'').is('.posb')) {
                        if(toti[itemid].link){
                            holder.find('#hs'+itemid+'').prepend('<a class="hltext link" href="'+toti[itemid].link+'" target="'+toti[itemid].target+'">'+toti[itemid].text+'</a>');
                        }
                        else{
                            holder.find('#hs'+itemid+'').prepend('<span class="hltext">'+toti[itemid].text+'</span>');
                        }
                    }
                    else{
                        if(toti[itemid].link){
                            holder.find('#hs'+itemid+'').append('<a class="hltext link" href="'+toti[itemid].link+'" target="'+toti[itemid].target+'">'+toti[itemid].text+'</a>');
                        }
                        else{
                            holder.find('#hs'+itemid+'').append('<span class="hltext">'+toti[itemid].text+'</span>');
                        }
                    }
                }
                if (holder.find('#hs'+itemid+'').is('.posr')) {
                    var hsposition = holder.find('#hs'+itemid+'').position();
                    holder.find('#hs'+itemid+'').css({'left':'0px'});
                    var hswidth = holder.find('#hs'+itemid+'').outerWidth();
                    var newhsposition = hsposition.left - hswidth + 20;
                    holder.find('#hs'+itemid+'').css({'left':newhsposition+'px'});
                } 
                if (holder.find('#hs'+itemid+'').is('.posb')) {
                    var hsposition = holder.find('#hs'+itemid+'').position();
                    holder.find('#hs'+itemid+'').css({'top':'0px'});
                    var hsheight = holder.find('#hs'+itemid+'').outerHeight();
                    var newhsposition = hsposition.top - hsheight + 20;
                    holder.find('#hs'+itemid+'').css({'top':newhsposition+'px'});
                }
                expanded = true;
            }
        }
        
        function collapseHighlight(callback){
            var itemid = parseInt(holder.find('.expanded').attr('id').replace('hs',''));
            holder.find('.expanded').css({'top':toti[itemid].posiy+'%','left':toti[itemid].posix+'%'}).removeClass('expanded').find('.hltitle,.hltext').remove();
            expanded = false;
            if(callback){
                callback();
            }
        }
    
    }
    
    function startautorotate(rtl){
        playing = true;
        if(!rtl){
            autorotate = setInterval(nextFrame, autorotatespeed);
        }
        if(rtl){
            autorotate = setInterval(prevFrame, autorotatespeed);
        }
        
        if(playstop){
            $('.'+thisName+'.'+playstop+'').addClass('busy');
        }
    }
    
    function stopautorotate(){
        clearInterval(autorotate);
        playing = false;
        isrotateloop = true;
        if(playstop){
            $('.'+thisName+'.'+playstop+'').removeClass('busy');
        }
    }
    
    
    function setPointer(){
        var corner = Math.floor(360/countFrames)*direction;                     
        var degrees = corner*currentFrame;                              
        var radians=degrees*Math.PI/180;
        var sine=Math.sin(radians);
        var cose=Math.cos(radians);
        var poinx = rotCenter+rotRadius*sine*-1;
        var poiny = rotCenter+rotRadius*cose;
        _css('.pointer',{'left':poinx, 'top':poiny});
    }
    
    function rotateImg(enterPosition){  
        doc.on('mousemove.dragrotate', function(e){
            
            
            if(changeAxis){
                var cursorPosition = e.pageY - contOffset.top;
            }
            else{
                var cursorPosition = e.pageX - contOffset.left;
            }
            var xOffset = cursorPosition - enterPosition;
            
            
            
            var step = Math.round(contWidth/countFrames)*direction;
            var frameOffset = Math.round(xOffset/step);
            var cycles = Math.abs(Math.floor((frameOffset+startFrame)/countFrames));
            currentFrame = startFrame + frameOffset;
            
            if(hotspots){
                if(currentFrame != startFrame){
                    hideHighlights();
                }
            }
            
            if(currentFrame >= countFrames){
                currentFrame = currentFrame - countFrames*cycles;
            }       
            if(currentFrame < 0){
                currentFrame = countFrames*cycles + currentFrame;
            }
            image.attr('src', imagelist[currentFrame]);
            if(!changeAxis){
                setPointer();
            }
        });
        doc.on('mouseup.dragrotate', function(){
            if(hotspots && highlightsHidden){
                showHighlights();
            }
            startFrame = currentFrame;
            doc.off('.dragrotate');
        });
        if(rotatehover){
            holder.on('mouseleave.dragrotate', function(){
                if(hotspots && highlightsHidden){
                    showHighlights();
                }
                startFrame = currentFrame;
                doc.off('.dragrotate');
            });
        }
    }
    
    function rotateImgMobile(enterPosition){    
        holder.on('touchmove.dragrotatemob', function(mobileEvent) {
           
            var event = window.event;
            if(changeAxis){
                var cursorPosition = event.touches[0].pageY - contOffset.top;
            }
            else{
                var cursorPosition = event.touches[0].pageX - contOffset.left;
            }
            var xOffset = cursorPosition - enterPosition;
            var step = Math.round(contWidth/countFrames)*direction;
            var frameOffset = Math.round(xOffset/step);
            var cycles = Math.abs(Math.floor((frameOffset+startFrame)/countFrames));
            currentFrame = startFrame + frameOffset;
            
            if(hotspots){
                if(currentFrame != startFrame){
                    hideHighlights();
                }
            }
            
            if(currentFrame >= countFrames){
                currentFrame = currentFrame - countFrames*cycles;
            }       
            if(currentFrame < 0){
                currentFrame = countFrames*cycles + currentFrame;
            }
            image.attr('src', imagelist[currentFrame]);
            if(!changeAxis){
                setPointer();
            }
        });
        holder.on('touchend.dragrotatemob', function(mobileEvent) {
            if(hotspots && highlightsHidden){
                showHighlights();
            }
            startFrame = currentFrame;
            holder.off('.dragrotatemob');
        });
        
    }
    
    function zoomImg(startXpos,startYpos,offset){
        zoomon = true;
        if(hotspots){
            hideHighlights();
        }
        holder.find('.highlights').fadeOut();
        var zoomloading = true;
        holder.find('.round').fadeOut();
        holder.find('.zoom').fadeOut();  
        var zoomImg = new Image();
        zoomImg.src = zoomlist[currentFrame];
        if (zoomImg.complete || zoomImg.readystate === 4) {
        }
        else {
            holder.find('.zoomload_bg').fadeIn();
        }
        zoomImg.onload = function() {
            zoomHeight = zoomImg.height;
            zoomWidth = zoomImg.width;
            var leftOverflow = (zoomWidth - contWidth)/-2;
            var topOverflow = (zoomHeight - contHeight)/-2;
            imagezoom.attr('src', zoomlist[currentFrame]);
            imagezoom.css({'left':leftOverflow, 'top':topOverflow});
    
            image.animate({
                width: zoomWidth,
                height: zoomHeight,
                left:leftOverflow,
                top:topOverflow
                }, 100, 'linear', function() {
                    imagezoom.animate({
                    width: zoomWidth,
                    height: zoomHeight,
                        left:leftOverflow,
                        top:topOverflow
                        }, 100, 'linear', function() {
                            imagezoom.fadeIn(100);
                        });
                    });

            holder.find('.zoomload_bg').fadeOut();
            holder.addClass('zoomout');
            var zoomloading = false;

            holder.on('mousemove.dragpan', (function(e){
                var hMoveLock = false;
                var vMoveLock = false;
                var currentXpos = e.pageX - offset.left;
                var currentYpos = e.pageY - offset.top;
                var xlimit = (zoomWidth-contWidth)*-1;
                var ylimit = (zoomHeight-contHeight)*-1;

                var xSpeedCoeff = Math.floor(zoomWidth/contWidth)*speedMult;
                var ySpeedCoeff = Math.floor(zoomHeight/contHeight)*speedMult;
                var moveLeft = startXpos - currentXpos;
                var moveTop = startYpos - currentYpos;
                var leftOffset = leftOverflow + moveLeft*xSpeedCoeff;
                var topOffset = topOverflow + moveTop*ySpeedCoeff;
                    
                if(leftOffset >= 0){
                    hMoveLock = true;
                    startXpos = startXpos - leftOffset;
                } 
                if(leftOffset <= xlimit){
                    hMoveLock = true;
                    startXpos = startXpos - leftOffset + xlimit;    
                }
                if(topOffset >= 0){
                    vMoveLock = true;
                    startYpos = startYpos - topOffset;
                } 
                if(topOffset <= ylimit){
                    vMoveLock = true;
                    startYpos = startYpos - topOffset + ylimit; 
                }
                if(!hMoveLock) {
                    imagezoom.css('left', leftOffset);
                }
                if(!vMoveLock) {
                    imagezoom.css('top', topOffset);
                }
            }));
            doc.on('mousedown.zoomof', (function(){
                if(!zoomloading){
                   zoomOut();
                }
            }));
        };  
    }
    
    function zoomMoveMobile(startXpos,startYpos,offset,leftOverflow,topOverflow){
        var sieventm = window.event;
        var currentXpos = sieventm.touches[0].pageX - offset.left;
        var currentYpos = sieventm.touches[0].pageY - offset.top;   
        var xlimit = (zoomWidth-contWidth)*-1;
        var ylimit = (zoomHeight-contHeight)*-1;
        var xSpeedCoeff = Math.floor(zoomWidth/contWidth)*speedMult;
        var ySpeedCoeff = Math.floor(zoomHeight/contHeight)*speedMult;
        var moveLeft = startXpos - currentXpos;
        var moveTop = startYpos - currentYpos;
        var leftOffset = leftOverflow + moveLeft*xSpeedCoeff*-1;
        var topOffset = topOverflow + moveTop*ySpeedCoeff*-1;
            if(leftOffset >= 0){
                leftOffset = 0;
            }
            if(leftOffset <= xlimit){
                leftOffset = xlimit;
            }
            if(topOffset >= 0){
                topOffset = 0;
            }
            if(topOffset <= ylimit){
                topOffset = ylimit;
            }
            imagezoom.css('left', leftOffset);
            imagezoom.css('top', topOffset);
        holder.on('touchend.zoomendmob',(function(){
                    holder.off('.mobdragpan');
                    newleftOverflow = leftOffset;
                    newtopOverflow = topOffset;
                }));
    }
    
    var newleftOverflow;
    var newtopOverflow;
    
    function zoomImgMobile(offset){
        zoomon = true;
        if(hotspots){
            hideHighlights();
        }
        holder.find('.highlights').fadeOut();
        $(document).find('.highlights_item').css({'display':'none'});
        var zoomloading = true;
        holder.find('.round').fadeOut();
        $('.zoom').fadeOut();  
        var zoomImg = new Image();
        zoomImg.src = zoomlist[currentFrame];
        if (zoomImg.complete || zoomImg.readystate === 4) {
        }
        else {
            $(holder).find('.zoomload_bg').fadeIn();
        }
        
        zoomImg.onload = function() {
            zoomHeight = zoomImg.height;
            zoomWidth = zoomImg.width;
            
            var leftOverflow = (zoomWidth - contWidth)/-2;
            var topOverflow = (zoomHeight - contHeight)/-2;
            
            
                
            imagezoom.attr('src', zoomlist[currentFrame]);
            imagezoom.css({'left':leftOverflow,'top':topOverflow});
            
            image.animate({
                width: zoomWidth,
                height: zoomHeight,
                left:leftOverflow,
                top:topOverflow
                }, 100, 'linear', function() {
                    imagezoom.animate({
                    width: zoomWidth,
                    height: zoomHeight,
                        left:leftOverflow,
                        top:topOverflow
                        }, 100, 'linear', function() {
                            imagezoom.fadeIn(100);
                        });
                    });
            
            holder.find('.zoomload_bg').fadeOut();
            holder.addClass('zoomout');
            var zoomloading = false; 
            holder.on('touchstart.dragstartmob',(function(){
                if(typeof newleftOverflow !== 'undefined'){
                    leftOverflow = newleftOverflow;
                }
                if(typeof newtopOverflow !== 'undefined'){
                    topOverflow = newtopOverflow;
                }
                var seventm = window.event;
                var startXpos = seventm.touches[0].pageX - offset.left;
                var startYpos = seventm.touches[0].pageY - offset.top;
                    holder.on('touchmove.mobdragpan', (function(e){
                        e.preventDefault();
                        zoomMoveMobile(startXpos,startYpos,offset,leftOverflow,topOverflow);
                    }));
                
            }));
            
            holder.on('click.zoomofmob', (function(){
                if(!zoomloading){
                    zoomOut();
                }
            }));
        };  
    }
    
    
    function zoomOut(){
        if(hotspots && highlightsHidden){
            showHighlights();
            holder.find('.highlights').fadeIn();
        }
        holder.off('.dragpan');
        holder.off('mousedown.zoomof');
        holder.off('.zoomendmob');
        holder.off('.dragstartmob');
        image.attr('src', imagelist[currentFrame]);
        image.css({'left':0,'top':0,'width':contWidth,'height':contHeight});
        imagezoom.animate({
            width: contWidth,
            height: contHeight,
            left:0,
            top:0
            }, 100, 'linear', function() {
                imagezoom.fadeOut(100);
                });
        holder.find('.round').fadeIn();
        holder.find('.zoom').fadeIn();          
        holder.removeClass('zoomout');
        zoomon = false;
    }
    
    
    
    holder.on('mousedown.initrotate', function(e){
        
        if(!zoomon){
            if(changeAxis){
                var enterPosition = e.pageY - contOffset.top;
            }
            else{
                var enterPosition = e.pageX - contOffset.left;
            }
            rotateImg(enterPosition);
        }
    });
    
    if(wheelRotate){
        holder.on('mousewheel',function(e){
            if(!zoomon){
                e.preventDefault();
                if(playing){
                    stopautorotate();
                }
                if(e.originalEvent.wheelDelta /120 > 0) {
                    nextFrame();
                }
                else{
                    prevFrame();
                }
            }
        })
    }
    
    if(rotatehover){
        holder.on('mouseenter.initrotate', function(e){
        
        if(!zoomon){
            if(changeAxis){
                var enterPosition = e.pageY - contOffset.top;
            }
            else{
                var enterPosition = e.pageX - contOffset.left;
            }
            rotateImg(enterPosition);
        }
        });
    }
    
    holder.find('.zoom').on('click.initzoom', function(e){
        var offset = holder.offset();
        var startXpos = e.pageX - offset.left;
        var startYpos = e.pageY - offset.top;
        zoomImg(startXpos,startYpos,offset);
    });
    
    
    
   
    if(is_touch_device){
    
        holder.find(image).on('touchstart.initrotatemob', function(mobileEvent){
            if(hotspots){
                $(document).find('.highlights_item').css({'display':'none'});
            }
            if(!zoomon){
                mobileEvent.preventDefault();
                var sevent = window.event;
                if(changeAxis){
                    var enterPosition = sevent.touches[0].pageY - contOffset.top;
                }
                else{
                    var enterPosition = sevent.touches[0].pageX - contOffset.left;
                }
                rotateImgMobile(enterPosition);
            }
        });
    
        holder.find('.zoom').on('touchstart.initzoommob', function(mobileEvent){
            mobileEvent.preventDefault();
            var offset = holder.offset();
            zoomImgMobile(offset);  
        }); 
    }
    
    
    function nextFrame(){
        if(hotspots){
            hideHighlights();
        }
        
        currentFrame++;
        
        if(currentFrame >= countFrames){
            currentFrame = 0;
        }
        image.attr('src', imagelist[currentFrame]);
        if(!changeAxis){
            setPointer();
        }
        
        startFrame = currentFrame;
        if(hotspots){
            showHighlights();
        }
        if(!isrotateloop){
            autorotateFrame = autorotateFrame + 1;
            if(autorotateFrame == countFrames){
                stopautorotate();
            }
        }
    }
    
    function prevFrame(){
        if(hotspots){
                hideHighlights();
            }
            
            currentFrame--;
            
            if(currentFrame < 0){
                currentFrame = countFrames;
            }
            image.attr('src', imagelist[currentFrame]);
            if(!changeAxis){
                setPointer();
            }
            
            startFrame = currentFrame;
            if(hotspots){
                showHighlights();
            }
    }
    
    
 
    if(goright){
        $('.'+thisName+'.'+goright+'').on('click',function(){
            stopautorotate();
            nextFrame();
        })
        
        $('.'+thisName+'.'+goright+'').on('mousedown touchstart',function(){
            stopautorotate();
            if(!playing){
                startautorotate();
                $(this).on('mouseleave mouseup touchend touchmove',function(){
                    stopautorotate();
                })
            }
        })
    }
    
    
    
    if(goleft){
        $('.'+thisName+'.'+goleft+'').on('click',function(){
            stopautorotate();
            prevFrame();
        })
        $('.'+thisName+'.'+goleft+'').on('mousedown touchstart',function(){
            stopautorotate();
            if(!playing){
                startautorotate(true);
                $(this).on('mouseleave mouseup touchend touchmove',function(){
                    stopautorotate();
                })
            }
        })
    }
    
    if(playstop){
        $('.'+thisName+'.'+playstop+'').on('click',function(){
            if(playing){
                stopautorotate();
            }
            else{
                startautorotate();
            }
            
        })
    }
};
})( jQuery );