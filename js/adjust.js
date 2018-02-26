//用于本地储存的兼容对象，IE8以下不支持localStorage
localData = {
    hname:location.hostname?location.hostname:'localStatus',
    isLocalStorage:window.localStorage?true:false,
    dataDom:null,

    initDom:function(){ //初始化userData，是兼容IE8以下的本地存储
        if(!this.dataDom){
            try{
                this.dataDom = document.createElement('input');//这里使用hidden的input元素
                this.dataDom.type = 'hidden';
                this.dataDom.style.display = "none";
                this.dataDom.addBehavior('#default#userData');//这是userData的语法
                document.body.appendChild(this.dataDom);
                var exDate = new Date();
                exDate = exDate.getDate()+30;
                this.dataDom.expires = exDate.toUTCString();//设定过期时间
            }catch(ex){
                return false;
            }
        }
        return true;
    },
    setItem:function(key,value){
        if(this.isLocalStorage){
            window.localStorage.setItem(key,value);
        }else{
            if(this.initDom()){
                if(this.hname == 'localStatus'){
                    //虽然IE8以上支持localStorge，但是不支持本地测试，暂时用cookie代替IE的本地
                    $.cookie(key, value, { expires: 7 });
                    console.log('IE本地测试存储：暂时用kookie代替');
                }else{
                    this.dataDom.load(this.hname);
                    this.dataDom.setAttribute(key,value);
                    this.dataDom.save(this.hname)
                }
                
            }
        }
    },
    getItem:function(key){
        if(this.isLocalStorage){
            return window.localStorage.getItem(key);
        }else{
            if(this.initDom()){
                if(this.hname == 'localStatus'){
                    var al = $.cookie(key);
                    console.log('IE本地测试存储：暂时用kookie代替');
                }else{
                    this.dataDom.load(this.hname);
                    return this.dataDom.getAttribute(key);
                }
            }
        }
    },
    removeItem:function(key){
        if(this.isLocalStorage){
            localStorage.removeItem(key);
        }else{
            if(this.initDom()){
                //
                if(this.hname == 'localStatus'){
                    $.removeCookie(key);
                    console.log('IE本地测试存储：暂时用kookie代替');
                }else{
                    this.dataDom.load(this.hname);
                    this.dataDom.removeAttribute(key);
                    this.dataDom.save(this.hname)
                }
            }
        }
    }
}

function openNewFile(o){
    var slideId= $(o).attr("slide-id");
    $.ajax({
        //请求方式为get
        type: "GET",
        //xml文件位置
        url: "database/data.xml",
        //返回数据格式为xml
        dataType: "xml",
        //请求成功完成后要执行的方法
        success: function (xml) {
            $(xml).find("user").each(function (i) {
                //i从0开始，累加，如果要显示所有数据，将判断去除即可
                if($(this).attr("id") == "petter"){
                    $(this).find("slide").each(function (j){
                        if($(this).attr("id") == slideId){
                            var content = $(this).find("content").text();
                            var storage = localData;
                            try {
                                //这里存储幻灯片的字符串
                                storage.setItem('h5slides-data', content);
                                console.log('saved', (new Date).valueOf());
                            }
                            catch (e) {
                                console.log(e); // QuotaExceededError
                            }
                            location.reload();
                        }
                    });
                }
            });
        }
    });
}

function removeThisLine(o){
    $(o).parent().remove();
}
function mylayoutbarToggle(){
    $("#mylayoutbar").toggle(function() {
        /* Stuff to do every *even* time the element is clicked */
        if($(this).css("display") == "none")
            $(".show-layout-toggle").find('a').html("展开布局模板<b class='caret'></b>");
        else
            $(".show-layout-toggle").find('a').html("收起布局模板<b class='upcaret'></b>");

    });
}



/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.1.9
 *
 * Requires: jQuery 1.2.2+
 */
//为jquery添加鼠标滚轮的兼容函数
(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;
    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }
    var special = $.event.special.mousewheel = {
        version: '3.1.9',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        },

        getLineHeight: function(elem) {
            return parseInt($(elem)['offsetParent' in $.fn ? 'offsetParent' : 'parent']().css('fontSize'), 10);
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true
        }
    };
    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });
    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }
    function nullLowestDelta() {
        lowestDelta = null;
    }
    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }
}));

function addEditorMousewheelEvent(vm){
    $('#editor-stage').bind('mousewheel', function(event, delta) {
        if(delta > 0){//往上滚一次
            vm.prevPage();
        }else{//往下滚一次
            vm.nextPage();
        }
        return false;
    });
}
function removeEditorMousewheelEvent(){
    $('#editor-stage').unbind('mousewheel');
}

function adjustCss(){
    try{
        if(!!window.ActiveXObject || "ActiveXObject" in window){
            $("#editor-stage").css('height', '578px');
            $("#editor-slide").css('margin-top', '45px');
        }
    }catch(e){}
    /*var hDistance = 0;
    try{
        hDistance = $("#editor-stage").offset().top - $("#editor-slide").offset().top;
    }catch(e){
        hDistance = $("#editor-stage").position().top - $("#editor-slide").position().top;
    }
    if(hDistance <= 5 && hDistance >= -5){
        $("#editor-slide").css('margin-top', '45px');
    }*/
   	try{
		var height = $(document).height() - $("#editor-stage").offset().top;
        $("#editor-stage").height(height);
   	}catch(e){}
    
}

/**
* jquery去除字符串中的html
* 给jQuery添加一个扩展函数
*/
jQuery.removeHtml = function(s){
    return (s)? jQuery("<p>").append(s).text(): "";
}

function TextEditorBtnEvent(e){
    var cmd = $(this).data('role');
    if(cmd){
        if(cmd == 'FontSize' || cmd == 'FontName'){
            document.execCommand(cmd, false, $(this).text());
        }else if(cmd == 'ForeColor'){
            document.execCommand(cmd, false, $(this).data('color'));
        }else if(cmd == 'CreateLink'){
            if(!!window.ActiveXObject || "ActiveXObject" in window){
                document.execCommand(cmd, true, 'true');
            }else{
                var url = "#";
                document.execCommand(cmd, false, url);
            }

        }else{
            document.execCommand(cmd, false, null);
        }
    }
    return false;
}
//添加文本编辑框按钮事件
function addTextEditorBtnEvent(){
    $("#toolbar .btn-group").find('a').each(function(index, el) {
        $(el).bind("mouseup",TextEditorBtnEvent);
    });
}
//去除文本编辑框按钮事件
function removeTextEditorBtnEvent(){
    $("#toolbar .btn-group").find('a').each(function(index, el) {
        $(el).unbind("mouseup",TextEditorBtnEvent);
    });
}

function setMycolorPicker(){
    $("#moreColors").colorpicker({
        fillcolor:true,
        event:'mouseover',
        success:function(o,color){
            document.execCommand('ForeColor', false, color);
        }
    });
}