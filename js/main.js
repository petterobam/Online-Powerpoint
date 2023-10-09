define('storage',[],function () {
    var storage = localData;

    function getTimestamp() {
        var date = new Date;
        //alert(Date.parse(date));
        return date.valueOf().toString();
    }

    function readData() {
        var data;
        try{
            //在这里得到幻灯片的字符串
            var dataStr = storage.getItem('h5slides-data');            

            data = JSON.parse(dataStr);
            console.log('[19]read');
            return data;
        }catch(e){
            console.log('[22]' + e);
        }
    }
    function saveData(data) {
        try {
            var dataStr = data;
            //这里存储幻灯片的字符串
            if(!(typeof data == 'string')){
                dataStr = JSON.stringify(data);
            }
            storage.setItem('h5slides-data', dataStr);
            console.log('[30]saved', (new Date).valueOf());
            return true;
        }catch (e) {
            console.log('[34]' + e); // QuotaExceededError
            return false;
        }
    }

    function readMedia(mid) {
        var key = 'h5slides-media-' + mid;
        return storage.getItem(key);
    }
    function removeMedia(mid) {
        var key = 'h5slides-media-' + mid;
        var list = getMediaList();
        var index = list.indexOf(mid);
        if (index >= 0) {
            storage.removeItem(key);
            list.splice(index, 1);
            storage.setItem('h5slides-medialist', JSON.stringify(list));
        }
        return true;
    }
    function saveMedia(media) {
        var mid = getTimestamp();
        var key = 'h5slides-media-' + mid;
        var list = getMediaList();

        list.push(mid);

        try {
            storage.setItem('h5slides-medialist', JSON.stringify(list));
            storage.setItem(key, media);
        }
        catch (e) {
            console.log('[66]' + e); //  QuotaExceededError
            list.pop();
            storage.removeItem(key);
            storage.setItem('h5slides-medialist', JSON.stringify(list));
            mid = null;
        }
        return mid;
    }
    function getMediaList() {
        var list;
        var listStr = storage.getItem('h5slides-medialist');
        if (listStr) {
            list = JSON.parse(listStr);
        }
        else {
            list = [];
        }
        return list;
    }

    return {
        readData: readData,
        saveData: saveData,
        readMedia: readMedia,
        saveMedia: saveMedia,
        removeMedia: removeMedia,
        getMediaList: getMediaList
    };
});
define('data',['storage'], function (storage) {
    var isExport = false;
    var templateList = [
            {key: 'normal', title: '普通', layout: 'normal', typeMap: {title: 'text', content: 'text'}},
            {key: 'title', title: '含标题', layout: 'title', typeMap: {title: 'text', content: 'text'}},
            {key: 'subtitle', title: '含子标题', layout: 'subtitle', typeMap: {title: 'text', content: 'text'}},
            {key: 'double', title: '两列正文', layout: 'double', typeMap: {title: 'text', content: 'text', content2: 'text'}},
            {key: 'double-subtitle', title: '含子标题和两列正文', layout: 'double-subtitle', typeMap: {title: 'text', subtitle: 'text', subtitle2: 'text', content: 'text', content2: 'text'}},
            {key: 'picture', title: '图片', layout: 'imax', typeMap: {title: 'text', content: 'img'}},
            {key: 'picture-left', title: '图片在左', layout: 'double', typeMap: {title: 'text', content: 'img', content2: 'text'}},
            {key: 'picture-right', title: '图片在右', layout: 'double', typeMap: {title: 'text', content: 'text', content2: 'img'}}
            // {key: 'video', title: 'Youku Video', layout: 'imax', typeMap: {title: 'text', content: 'video'}}
        ];
    var tmplList = [
    ];
    var layoutList = [
            {key: 'normal', title: '普通'},
            {key: 'title', title: '含标题'},
            {key: 'subtitle', title: '含子标题'},
            {key: 'double', title: '两列正文'},
            {key: 'double-subtitle', title: '含子标题和两列正文'},
            {key: 'imax', title: '纯文本'}
        ];
    var typeName = {
        text: '文本',
        img: '图片',
        code: '代码段'
    };
    var typeMap = {
        default: {
            default: ['text', 'img', 'code'],
            title: ['text'],
            subtitle: ['text'],
            subtitle2: ['text']
        },
        title: {
            content: ['text']
        },
        subtitle: {
            content: ['text']
        }
    };
    var designList = [
            {key: 'default', title: '默认'},
            { key: 'revert', title: '反默认' },
            { key: 'pink', title: '可爱粉' },
            { key: 'green', title: '文青绿' },
            { key: 'lightblue', title: '清亮蓝' },
            { key: 'purple', title: '高雅紫' },
            { key: 'blackbord', title: '黑板' },
            { key: 'party', title: '党' },
            { key: 'multi-random', title: '随机' },
            { key: 'head-tail-wust_thesis', title: '武科大论文答辩' }
        ];
    var transitionList = [
            {key: 'horizontal', title: '常规'},
            {key: 'vertical', title: '垂直'},
            {key: 'cubic-horizontal', title: '立方'},
            {key: 'cubic-horizontal-inner', title: '立方 插切'},
            {key: 'cubic-vertical', title: '立方 垂直'},
            {key: 'cubic-vertical-inner', title: '立方 垂直 插切'},
            {key: 'doors', title: '开门式'},
            {key: 'zoom-in', title: '淡入'},
            {key: 'zoom-out', title: '淡出'},
            {key: 'sublime', title: '拉升淡出'},
            {key: 'fly', title: '飞入'},
            {key: 'fall', title: '下落'}
        ];

    var defaultData = {
        design: 'default',
        transition: 'horizontal',
        title: '',
        slides: [
            {sid: 'A', layout: 'title', items: {title: {type: 'text', value: '封面'}, content: {type: 'text', value: '介绍写这里'}}},
            {sid: 'B', layout: 'normal', items: {title: {type: 'text', value: '正文'}, content: {type: 'text', value: '正文内容.'}}},
            {sid: 'C', layout: 'imax', items: {title: {type: 'text', value: '结束语'}, content: {type: 'img', value: ''}}}
            // {sid: 'D', template: 'video', layout: 'imax', items: {title: {type: 'text', value: 'Video'}, content: {type: 'video', value: 'XNjUwODE1Mg=='}}}
        ]
    };

    var data = storage.readData() || JSON.parse(JSON.stringify(defaultData));

    var onStorage = true;

    //console.log(toString.call([123]));//[object Array]  
    //console.log(toString.call('123'));//[object String]  
    //console.log(toString.call({ a: '123' }));//[object Object]  
    //console.log(toString.call(/123/));//[object RegExp]  
    //console.log(toString.call(123));//[object Number]  
    //console.log(toString.call(undefined));//[object Undefined]  
    //console.log(toString.call(null));//[object Null]  

    function mapToArray(obj) {
        var newObj;
        if (Object.prototype.toString.call(obj) == '[object Object]') {
            newObj = [];
            $.each(obj, function (k, v) {
                newObj.push([k, mapToArray(v)]);
            });
            newObj.sort(function (a, b) {
                return a[0] > b[0];
            });
        }
        else if (Object.prototype.toString.call(obj) == '[object Array]') {
            newObj = [];
            $.each(obj, function (i, v) {
                newObj.push(mapToArray(v));
            });
        }
        else {
            newObj = obj;
        }
        return newObj;
    }
    function checkChanged(objA, objB) {
        var newObjA = mapToArray(objA);
        var newObjB = mapToArray(objB);

        return JSON.stringify(newObjA) !== JSON.stringify(newObjB);
    }

    function extend(dest, src) {
        $.each(src, function (k, v) {
            dest[k] = v;
        });
    }

    var manager = {
        getTplList: function () {
            return templateList;
        },
        getLayoutList: function () {
            return layoutList;
        },
        getDesignList: function () {
            return designList;
        },
        getTransitionList: function () {
            return transitionList;
        },
        getTplByKey: function (key) {
            var result;
            templateList.forEach(function (tplData) {
                if (tplData.key == key) {
                    result = tplData;
                }
            });
            return result;
        },
        getDesignByKey: function (key) {
            var result;
            designList.forEach(function (designData) {
                if (designData.key == key) {
                    result = designData;
                }
            });
            return result;
        },
        getTransitionByKey: function (key) {
            var result;
            transitionList.forEach(function (transitionData) {
                if (transitionData.key == key) {
                    result = transitionData;
                }
            });
            return result;
        },
        getTypeList: function (layout, key) {
            var layoutInfo;
            var itemInfo;
            var result;

            layoutInfo = typeMap[layout];

            if (layoutInfo) {
                itemInfo = layoutInfo[key] || layoutInfo.default;
            }
            if (!itemInfo) {
                layoutInfo = typeMap.default;
                itemInfo = layoutInfo[key] || layoutInfo.default;
            }

            result = [];
            itemInfo.forEach(function (key) {
                result.push({key: key, name: typeName[key]});
            });

            return result;
        },

        getData: function () {
            return data;
        },
        getDesign: function () {
            return data.design;
        },
        getTransition: function () {
            return data.transition;
        },
        getTitle: function () {
            return data.title;
        },
        setData: function (newData) {
            data = newData;
        },
        setDesign: function (newDesign) {
            data.design = newDesign;
        },
        setTransition: function (newTransition) {
            data.transition = newTransition;
        },
        setTitle: function (newTitle) {
            data.title = newTitle;
        },

        getPageList: function () {
            var list = [];
            data.slides.forEach(function (slideData) {
                //去除标题的html标签
                list.push({sid: slideData.sid, title: $.removeHtml(slideData.items.title.value), key: slideData.layout});
	    });            
	    return list;        
	},

        getSlideList: function () {
            return data.slides;
        },
        getSlide: function (page) {
            return data.slides[page];
        },
        getSlideById: function (sid) {
            var result;
            data.slides.forEach(function (slideData) {
                if (slideData.sid == sid) {
                    result = slideData;
                }
            });
            return result;
        },
        getItem: function (page, key) {
            var slideData = data.slides[page] || {};
            var itemMap = slideData.items || {};
            var itemData = itemMap[key] || {};
            return itemData;
        },
        getValue: function (page, key) {
            var slideData = data.slides[page] || {};
            var itemMap = slideData.items || {};
            var itemData = itemMap[key] || {};
            var result = itemData.value;
            try{
                if(isExport){
                    if(result.indexOf('media://') >= 0){
                        result = storage.readMedia(result.substr(8))
                    }
                }else if(result.indexOf('data:') >= 0){
                    result = 'media://' + storage.saveMedia(result);
                    itemData.value = value;
                }
            }catch(e){}
            return result;
        },

        changeLayout: function (page, layout, ignoreTypeChange) {
            var slideData = data.slides[page] || {};
            slideData.layout = layout;
            //暂时:改变页面列表layout,显示效果
            // var key = JSON.prase(layout).key;
            $("#page-list").find(".active").find("img").attr("src",'images/layout/' + layout + '.png');
        },
        // changeTemplate: function (page, template, ignoreTypeChange) {
        //     var slideData = data.slides[page] || {};
        //     var tplData = manager.getTplByKey(template);
        //     var hasNewLayout = (slideData.layout != tplData.layout);
        //     var changedKeys = [];

        //     slideData.template = template;

        //     if (hasNewLayout) {
        //         slideData.layout = tplData.layout;
        //     }

        //     $.each(tplData.typeMap, function (key, type) {
        //         var itemData = slideData.items[key];

        //         if (!itemData) {
        //             slideData.items[key] = itemData = {};
        //         }
        //         if (hasNewLayout) {
        //             itemData.position = {};
        //         }
        //         if (!itemData.value) {
        //             if (!ignoreTypeChange) {
        //                 itemData.type = type;
        //             }
        //             itemData.config = {};
        //             changedKeys.push(key);
        //         }
        //     });

        //     return changedKeys;
        // },
        changeType: function (page, key, type) {
            var slideData = data.slides[page] || {};
            var itemData = slideData.items[key];

            if (!itemData) {
                itemData = {};
                slideData.items[key] = itemData;
            }

            itemData.type = type;
            itemData.value = null;
            itemData.config = {};
        },

        clearItem: function (page, key) {
            var itemData = manager.getItem(page, key);
            itemData.value = null;
            itemData.config = {};
        },
        setValue: function (page, key, value) {
            var itemData = manager.getItem(page, key);
            itemData.value = value;
        },

        startStorage: function () {
            onStorage = true;
        },
        stopStorage: function () {
            onStorage = false;
        },

        startExport: function(){
            isExport = true;
        },
        stopExport: function(){
            isExport = false;
        },

        checkItemChanged: function (page, key, outerData) {
            var itemData;

            if (!key) {
                return;
            }

            itemData = manager.getItem(page, key);

            return checkChanged(itemData, outerData);
        },

        reset: function (newData) {
            var _newData = newData || defaultData;
            if(typeof _newData == 'string'){
                data = JSON.parse(_newData);
            }else{
                data = _newData;
            }
        },
        save: function (value1) {
            var result;
            if (onStorage) {
                if(arguments.length>0){
                    result = storage.saveData(value1);
                }else{
                    result = storage.saveData(data);
                }
                if (result === false) {
                    console.log('[442]storage error! (QuotaExceededError)');
                }
            }
        }
    };

    extend(manager, {
        readMedia: storage.readMedia,
        saveMedia: storage.saveMedia,
        removeMedia: storage.removeMedia,
        getMediaList: storage.getMediaList
    });

    return manager;
});
define('vm',['data'], function (dataManager) {
    var currentPage = 0;
    var currentSlide = dataManager.getSlideList()[currentPage];

    var vm = {
        title: ko.observable(dataManager.getTitle()),
        editingTitle: ko.observable(false),
        designList: dataManager.getDesignList(),
        transitionList: dataManager.getTransitionList(),
        layoutList: dataManager.getLayoutList(),
        tplList: dataManager.getTplList(),
        pageList: ko.observableArray(dataManager.getPageList()),
        currentDesign: ko.observable(dataManager.getDesign()),
        currentTransition: ko.observable(dataManager.getTransition()),
        currentPage: ko.observable(currentPage),
        currentLayout: ko.observable(currentSlide.layout),
        // currentTpl: ko.observable(currentSlide.template),
        currentItem: ko.observable(''),
        currentItemDataCopy: ko.observable(null)
    };

    vm.currentSid = ko.computed(function () {
        var page = vm.currentPage();
        var pageList = vm.pageList();
        return pageList[page] ? pageList[page].sid : '';
    });

    // vm.currentLayout = ko.computed(function () {
    //     var layout;
    //     var currentTpl = vm.currentTpl();
    //     vm.tplList.forEach(function (template) {
    //         if (template.key == currentTpl) {
    //             layout = template.layout;
    //         }
    //     });
    //     return layout;
    // });

    return vm;
});
define('title',['data'], function (dataManager) {
    return {
        init: function (vm) {
            vm.editTitle = function () {
                vm.editingTitle(true);
            };
            vm.titleDisplay = ko.computed(function () {
                var title = vm.title();
                if (title.trim()) {
                    return title;
                }
                else {
                    return '在这里输入PPT标题...';
                }
            });

            vm.title.subscribe(function (newValue) {
                dataManager.setTitle(newValue);
                dataManager.save();
            });
        }
    };
});
define('page',['data','design'], function (dataManager,designManager) {
    function AddPageListMenu(vm){
        $("#page-list").find('li').each(function(index, el) {
            $(el).bind('contextmenu' , function(e){
                e.preventDefault();
                $(this).click();

                ev= e || window.event;
                //获取当前的x,y坐标,并借此设定菜单位置
                $("#myEditorMenu").css("left", ev.pageX + "px");
                $("#myEditorMenu").css("top", ev.pageY + "px"); 
                $("#myEditorMenu").show();

                $("#myPageMoveUp").show();
                $("#myPageMoveDown").show();
                $("#myPageRemove").show();
                return false;
            });
            $(el).bind("mousedown",function(e){
                e.preventDefault();
                $("#myPageMoveUp").hide();
                $("#myPageMoveDown").hide();
                $("#myPageRemove").hide();
                $("#myEditorMenu").hide();
            });
        });
        //处理变化的主题样式
        designManager.resetDesign(vm);
    }
    return {
        init: function (vm) {
            vm.addPageListMenu = function(vm){
                AddPageListMenu(vm);
            };
            vm.clickPage = function (pageData, e) {
                var beforeIndex = vm.currentPage();

                var $index = vm.pageList().indexOf(pageData);
                vm.currentPage($index);

                // 暂时：保存前一个页面信息不失真
                page = vm.pageList.splice(beforeIndex, 1)[0];
                vm.pageList.splice(beforeIndex, 0, page);

                AddPageListMenu(vm);
            };
            vm.nextPage = function () {
                var $index = vm.currentPage();
                if ($index < vm.pageList().length - 1) {
                    vm.currentPage($index + 1);
                    //暂时：保存前一个页面信息不失真
                    page = vm.pageList.splice($index, 1)[0];
                    vm.pageList.splice($index, 0, page);

                    AddPageListMenu(vm);
                }
            };
            vm.prevPage = function () {
                var $index = vm.currentPage();
                if ($index > 0) {
                    vm.currentPage($index - 1);
                    //暂时：保存前一个页面信息不失真
                    page = vm.pageList.splice($index, 1)[0];
                    vm.pageList.splice($index, 0, page);

                    AddPageListMenu(vm);
                }
            };
            vm.addPage = function (templateData) {
                var $index;
                var slideList;
                var slide;
                var page;
                //改为时间戳
                //var sid = (new Date).toString();
                var sid = Date.parse(new Date).toString();

                templateData = templateData || { key: 'normal', title: 'Normal', layout: 'normal', typeMap: { title: 'text', content: 'text' } };
                
                //修改的地方
                if (typeof (templateData) == 'string') {
                    $.each(dataManager.getTplList(), function (key, template) {
                        if (template.layout == templateData) {
                            templateData = template;
                        }
                    });
                }

                $index = vm.currentPage();

                vm.pageList.splice($index + 1, 0, {sid: sid, title: '', key: templateData.layout});


                slideList = dataManager.getSlideList();
                slide = {
                        sid: sid,
                        layout: templateData.layout,
                        items: {}
                        //template: 'normal',
                        //layout: 'normal',
                        //items: {
                        //    title: {type: 'text', value: ''},
                        //    content: {type: 'text', value: ''}
                        //}
                    };
                $.each(templateData.typeMap, function (key, type) {
                    slide.items[key] = { type: type, value: '' };
                });

                slideList.splice($index + 1, 0, slide);

                vm.currentPage($index + 1);

                //暂时：保存前一个页面信息不失真
                page = vm.pageList.splice($index, 1)[0];
                vm.pageList.splice($index, 0, page);

                dataManager.save();
                AddPageListMenu(vm);
            };
            vm.clonePage = function () {
                var $index;
                var page;
                var slideList;
                var slide;
                var sid = (new Date).toString();

                $index = vm.currentPage();
                page = JSON.stringify(vm.pageList.slice($index, $index + 1)[0]);
                page.sid = sid;
                page = JSON.parse(page);
                vm.pageList.splice($index + 1, 0, page);

                slideList = dataManager.getSlideList();
                slide = JSON.stringify(dataManager.getSlide($index));
                slide.sid = sid;
                slide = JSON.parse(slide);
                slideList.splice($index + 1, 0, slide);

                vm.currentPage($index + 1);

                dataManager.save();
                AddPageListMenu(vm);
            };
            vm.removePage = function () {
                var $index;
                var slideList;

                $index = vm.currentPage();
                if (vm.pageList().length == 1) {
                    return;
                }
                if ($index == vm.pageList().length - 1) {
                    vm.currentPage($index - 1);
                }
                vm.pageList.splice($index, 1);

                slideList = dataManager.getSlideList();
                slideList.splice($index, 1);
                dataManager.save();
                AddPageListMenu(vm);
            };
            vm.moveUpPage = function () {
                var $index;
                var slideList;
                var page;
                var slide;

                $index = vm.currentPage();
                slideList = dataManager.getSlideList();

                if ($index > 0) {
                    page = vm.pageList.splice($index, 1)[0];
                    vm.pageList.splice($index - 1, 0, page);

                    slide = slideList.splice($index, 1)[0];
                    slideList.splice($index - 1, 0, slide);

                    vm.currentPage($index - 1);

                    dataManager.save();
                    AddPageListMenu(vm);
                }
            };
            vm.moveDownPage = function () {
                var $index;
                var slideList;
                var page;
                var slide;

                $index = vm.currentPage();
                slideList = dataManager.getSlideList();

                if ($index < vm.pageList().length - 1) {
                    page = vm.pageList.splice($index, 1)[0];
                    vm.pageList.splice($index + 1, 0, page);

                    slide = slideList.splice($index, 1)[0];
                    slideList.splice($index + 1, 0, slide);

                    vm.currentPage($index + 1);

                    dataManager.save();
                    AddPageListMenu(vm);
                }
            };
        },
        addPageListMenu: AddPageListMenu
    };
});
define('design',[],function () {
    var cssLinkMap = {};

    function loadCssLink(key) {
        if (!cssLinkMap[key]) {
            cssLink = $('<link rel="stylesheet">').attr('href', 'css/design/' + key + '.css');
            $('head').append(cssLink);
            cssLinkMap[key] = cssLink;
        }
    }
    function resetDesign(vm,currentIndex,totalIndex){
        try{
            var isPlaying = arguments.length > 1;
            var currentDesign = vm.currentDesign();
            var index = isPlaying? currentIndex : vm.currentPage();
            var max = isPlaying? totalIndex : vm.pageList().length - 1; 

            var hasHead = currentDesign.indexOf('head-') >= 0;
            var hesTail = currentDesign.indexOf('tail-') >= 0;
            var target = "[data-design='" + currentDesign + "'] " + ".slide";
            var imgurl;

            if(currentDesign.indexOf('multi-') >= 0){
                var maxIndex = 7;//最大随机图片数
                try{
                   maxIndex = parseInt(currentDesign.replace(/[^0-9]+/ig,""))||7;
                }catch(e){}
                index = index % maxIndex;
                
                imgurl = "url('css/design/images/"+currentDesign+"/"+index+".png')";
                $(target).css("background-image",imgurl);
            }

            if(hasHead || hesTail){
                if(hasHead && index == 0){
                    imgurl = "url('css/design/images/"+currentDesign+"/head.png')";
                    $(target).css("background-image",imgurl);
                }else if(hesTail && index == max){
                    imgurl = "url('css/design/images/"+currentDesign+"/tail.png')";
                    $(target).css("background-image",imgurl);
                }else{
                    imgurl = "url('css/design/images/"+currentDesign+"/main.png')";
                    $(target).css("background-image",imgurl);
                }
            }
        }catch(e){}
    }

    return {
        loadCssLink: loadCssLink,
        resetDesign: resetDesign
    };
});
define('transition',[],function () {
    var dialog = $('#theme-manager');
    var tabs = $('#theme-manager-tabs');
    var root = $('#transition-stage');
    var slides = root.find('.transition-slide');

    var length = slides.length;

    var currentPage;
    var currentSlide;
    var nextSlide;
    var prevSlide;

    var isActiveTab = false;
    var isActiveDialog = false;
    var loopTimer;

    function loseSlide() {
        currentSlide.removeClass('slide-current');
        nextSlide.removeClass('slide-next');
        prevSlide.removeClass('slide-prev');
    }
    function findSlide(page) {
        currentSlide = $(slides[page]).addClass('slide-current');
        nextSlide = $(slides[(page + 1) % length]).addClass('slide-next');
        prevSlide = $(slides[(page + length - 1) % length]).addClass('slide-prev');
    }

    function next() {
        currentPage = (currentPage + 1) % length;
        loseSlide();
        findSlide(currentPage);
    }
    function prev() {
        currentPage = (currentPage + length - 1) % length;
        loseSlide();
        findSlide(currentPage);
    }

    function change(key) {
        root.attr('data-transition', key);
    }

    function init() {
        currentPage = 0;
        findSlide(currentPage);
    }

    function checkLoop() {
        clearInterval(loopTimer);
        if (isActiveDialog && isActiveTab) {
            loopTimer = setInterval(next, 1500);
        }
    }

    tabs.find('a').on('shown', function (e) {
        var target = $(e.target);
        isActiveTab = target.attr('href') === '#transition-panel';
        checkLoop();
    });
    dialog.on('shown', function () {
        isActiveDialog = true;
        checkLoop();
    });
    dialog.on('hide', function () {
        isActiveDialog = true;
        checkLoop();
    });

    init();

    return {
        change: change
    };
});
define('status',['data', 'design', 'transition','page'], function (dataManager, designManager, transitionManager,pageManager) {
    var activeItem;
    // var ignoreTypeChange;
    return {
        init: function (vm) {
            designManager.loadCssLink(vm.currentDesign());

            vm.clickLayout = function (layoutData, e) {
                vm.currentLayout(layoutData.key);
            };
            // vm.clickTpl = function (templateData, e) {
            //     vm.currentTpl(templateData.key);
            // };
            
            vm.clickDesign = function (designData, e) {
                //暂时：清除图片背景样式
                $("[data-design='" + vm.currentDesign() + "'] " + ".slide").css('background-image','');

                var key = designData.key;
                var cssLink;

                designManager.loadCssLink(key);
                vm.currentDesign(key);

                //处理变化的主题样式
                designManager.resetDesign(vm);
            };
            vm.clickTransition = function (transitionData, e) {
                var key = transitionData.key;
                vm.currentTransition(key);
            };
            vm.resetData = function (newData) {
                if (newData === vm) {
                    newData = null;
                }
                dataManager.reset(newData);
                dataManager.stopStorage();

                var currentPage = 0;
                var currentSlide = dataManager.getSlideList()[currentPage];

                vm.title(dataManager.getTitle()),
                vm.currentDesign(dataManager.getDesign());
                vm.currentPage(currentPage);
                vm.currentLayout(currentSlide.layout);
                // vm.currentTpl(currentSlide.template);
                vm.pageList(dataManager.getPageList());

                dataManager.startStorage();
                dataManager.save();

                vm.addPageListMenu();
            };

            vm.currentLayout.subscribe(function (newValue) {
                var page = vm.currentPage();
                dataManager.changeLayout(page, newValue);

                setTimeout(vm.resizeAll, 13);
                dataManager.save();
            });
            // vm.currentTpl.subscribe(function (newValue) {
            //     var page = vm.currentPage();
            //     var changedKeys = dataManager.changeTemplate(page, newValue, ignoreTypeChange);

            //     changedKeys.forEach(function (key) {
            //         vm.previewItem(key);
            //     });

            //     vm.resizeAll();
            //     dataManager.save();
            // });
            vm.currentPage.subscribe(function (newValue) {
                var slideData = dataManager.getSlide(newValue);
                dataManager.stopStorage();
                vm.currentLayout(slideData.layout);
                // ignoreTypeChange = true;
                // vm.currentTpl(slideData.template);
                // ignoreTypeChange = false;
                dataManager.startStorage();
            });
            vm.currentDesign.subscribe(function (newValue) {
                dataManager.setDesign(newValue);
                dataManager.save();
            });
            vm.currentTransition.subscribe(function (newValue) {
                transitionManager.change(newValue);
                dataManager.setTransition(newValue);
                dataManager.save();
            });
            vm.currentItem.subscribe(function (newValue) {
                if (activeItem) {
                    activeItem.removeClass('active');
                }
                if (newValue) {
                    activeItem = $('#slide-' + newValue).addClass('active');
                }
            });
        }
    };
});
define('types/text',['data', 'vm'], function (dataManager, vm) {
    var itemEditorLayer = $('#item-editor-layer');

    function blurEditor(e) {
        var target = $(e.target);
        var key = vm.currentItem();

        if (!vm.currentItem()) {
            return;
        }
        if (itemEditorLayer.has(target).length > 0) {
            return;
        }

        itemEditorLayer.empty().hide();
        vm.finishEdit();

        removeTextEditorBtnEvent();
        addEditorMousewheelEvent(vm);
        $(window).unbind('mousedown', blurEditor);
        $(window).unbind('touchstart', blurEditor);
    }

    function render(data, dom, placeHolder) {
        if (data.value) {
            dom.empty().html(data.value);
        } else {
            dom.html(data.value);
        }
        
        // 在DOM更新后触发MathJax渲染
        if (window.MathJax && MathJax.typeset) {
            try {
                console.log("MathJax 渲染：", dom[0]);
                // Pass the DOM element to be rendered by MathJax
                MathJax.typeset([dom[0]]);
            } catch (err) {
                console.log("MathJax 渲染错误: ", err);
            }
        }
    }

    return {
        init: null,
        preview: function (data, dom) {
            render(data, dom, '[空文本]');
        },
        resize: null,
        edit: function (key, page, data, dom) {
            var position = dom.parent().position();
            var width = dom.outerWidth();
            var height = dom.outerHeight();
            var fontSize = dom.css('font-size');
            var lineHeight = dom.css('line-height');
            var editor = $('<div id = "editor1" contenteditable = "true"></div>');

            editor.css('border', '1px solid #C0C0C0');
            editor.css('box-shadow','0px 0px 10px #C0C0C0 inset')
            editor.css('position', 'absolute');
            editor.css('padding', '5px');
            editor.css('left', position.left - 5 + 'px');
            editor.css('top', position.top - 5 + 'px');
            editor.css('width', width + 'px');
            editor.css('height', height + 'px');
            editor.css('font-size', fontSize);
            editor.css('line-height', lineHeight);
            editor.css('background-color',$('#editor-slide').css('background-color'));


            editor.html(data.value);

            itemEditorLayer.empty().append(editor);
            itemEditorLayer.show();

            editor.on('input blur', function (e) {
                var newValue = $(this).html();
                var page = vm.currentPage();
                var itemData = dataManager.getItem(page, key);

                if (itemData.value != newValue) {
                    dataManager.setValue(page, key, newValue);
                }
            });
            editor.focus();

            $(window).bind('mouseup', blurEditor);
            $(window).bind('touchstart', blurEditor);
            addTextEditorBtnEvent();
            removeEditorMousewheelEvent();
        },
        build: function (data, dom) {
            render(data, dom, '');
        },
        show: function (dom) {
        },
        hide: function (dom) {
        }
    };
});
define('types/img-helper',[],function () {
    var MAX_WIDTH = 640;
    var MAX_HEIGHT = 480;

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    canvas.width = MAX_WIDTH;
    canvas.height = MAX_HEIGHT;

    function adjustSize(sw, sh, dw, dh) {
        var x, y, w, h, scale;
        //临时修改上下对齐
        dh = dh - 10;
        dw = dw - 10;
        var dRatio = dh / dw;
        var sRatio = sh / sw;

        if (sw <= dw && sh <= dh) {
            scale = 1;
            w = sw;
            h = sh;
            x = parseInt((dw - sw) / 2);
            y = parseInt((dh - sh) / 2);
        }
        else {
            if (sRatio >= dRatio) {
                scale = dh / sh;
                y = 5;
                h = dh;
                w = sw * scale;
                x = parseInt((dw - w) / 2);
            }
            else {
                scale = dw / sw;
                x = 5;
                w = dw;
                h = sh * scale;
                y = parseInt((dh - h) / 2);
            }
        }

        return {
            scale: scale,
            w: w,
            h: h,
            x: x,
            y: y
        };
    }

    function loadImg(src, callback, errorCallback) {
        var img = new Image;
        var timer = setTimeout(function () {
            errorCallback && errorCallback(img);
        }, 500);

        img.src = src;
        img.onload = function () {
            clearTimeout(timer);
            callback && callback(img);
        };
        img.onerror = function () {
            errorCallback && errorCallback(img);
        };
    }

    function minify(src, callback) {
        loadImg(src,
            function (img) {
                var newSrc;

                var nw = img.naturalWidth;
                var nh = img.naturalHeight;

                var ref = adjustSize(nw, nh, MAX_WIDTH, MAX_HEIGHT);

                canvas.width = ref.w;
                canvas.height = ref.h;

                context.drawImage(img, 0, 0, ref.w, ref.h);
                newSrc = canvas.toDataURL();
                context.clearRect(0, 0, ref.w, ref.h);

                callback && callback(newSrc, ref);
            },
            function (img) {
                callback && callback('', {});
            }
        );
    }
    function embed(src, dom, placeHolder) {
        var dw;
        var dh;

        dw = dom.width();       //xx% ==> xx
        dh = dom.height();      //yy% ==> yy

        var fdw = dom.parent().width();     //xx% ==> xx
        var ffdw = dom.parent().parent().width();
        var fdh = dom.parent().height();    //yy% ==> yy
        var ffdh = dom.parent().parent().height();

        if(fdw != dw){  //解决100%失效问题，个人感觉有时候width()和height()函数是这样实现的：parseInt($.css('width'||'height').replace(/[^0-9]+/ig,""))
            dw = (ffdw * fdw * dw)/10000;
            dh = (ffdh * fdh * dh)/10000;
        }

        // alert(dw + ' ' + dh + ' ' + fdw + ' ' + fdh + ' ' + ffdw + ' ' + ffdh);
        loadImg(src,
            function (img) {
                var nw = img.naturalWidth;
                var nh = img.naturalHeight;

                ref = adjustSize(nw, nh, dw, dh);

                img.style.width = ref.w + 'px';
                img.style.height = ref.h + 'px';
                img.style.padding = ref.y + 'px ' + ref.x + 'px';

                dom.empty().append(img);
            },
            function (img) {
                dom.html(placeHolder);
            }
        );
    }
    return {
        minify: minify,
        embed: embed
    };
});
define('types/img',['data', 'vm', 'types/img-helper'], function (dataManager, vm, lib) {
    var dialog = $('#img-manager');
    var tabs = $('#img-manager-tabs');

    var imgList = $('#my-img-list');
    var imgListHolder = $('#my-img-list-holder');

    var localPanel = $('#img-local-panel');
    var localInput = localPanel.find('input');
    var localThumb = localPanel.find('.thumbnail');

    var urlPanel = $('#img-url-panel');
    var urlInput = urlPanel.find('input');
    var urlThumb = urlPanel.find('.thumbnail');

    var urlBtnRemove = $('#img-url-remove');

    var currentLi;
    var oldMid;
    var newMid; // '$' means remove

    var localMedia;

    var manager = {};

    function setCurrentLi(li, mid) {
        if (currentLi) {
            currentLi.removeClass('active');
        }
        currentLi = li.addClass('active');

        newMid = mid;
    }

    function checkMediaListEmpty() {
        if (imgList.find('li').length == 0) {
            imgList.hide();
            imgListHolder.show();
        }
        else {
            imgList.show();
            imgListHolder.hide();
        }
    }

    function buildMeidaList(mediaList) {
        imgList.empty();

        mediaList.forEach(function (mid) {
            var li = $('<li class="span2"><a href="#" class="thumbnail"><img></a>' +
                '<p class="clearfix"><button class="btn pull-left" data-action="choose">Choose</button>' +
                '<button class="btn btn-danger pull-right" data-action="remove"><i class="icon-trash"></i></button></p></li>');

            if (mid == oldMid) {
                currentLi = li.addClass('active');
            }
            li.find('img').attr('src', dataManager.readMedia(mid));
            li.find('a').click(function (e) {
                e.preventDefault();
                setCurrentLi(li, mid);
            });
            li.find('[data-action="choose"]').click(function () {
                setCurrentLi(li, mid);
                save();
                dialog.modal('hide');
            });
            li.find('[data-action="remove"]').click(function (e) {
                e.preventDefault();
                if (li.hasClass('active')) {
                    newMid = '$';
                }
                li.remove();
                dataManager.removeMedia(mid);
                checkMediaListEmpty();
            });
            imgList.append(li);
        });

        checkMediaListEmpty();
    }

    function save() {
        var currentPanelKey = tabs.find('.active').attr('data-key');
        var media;
        var mid;

        switch (currentPanelKey) {
            case 'list':
            if (newMid) {
                if (newMid == '$') {
                    media = '$';
                }
                else {
                    media = 'media://' + newMid;
                }
            }
            break;
            case 'local':
            if (localMedia) {
                mid = dataManager.saveMedia(localMedia);
                if (mid) {
                    media = 'media://' + mid;
                }
                else {
                    console.log('[1187]storage error! (QuotaExceededError)');
                    return;
                }
            }
            break;
            case 'url':
            media = urlInput.val();
            break;
            default:
            ;
        }
        if (media) {
            if (media == '$') {
                media = '';
            }
            console.log('set img', (new Date).valueOf());
            dataManager.setValue(vm.currentPage(), vm.currentItem(), media);
        }

        vm.finishEdit();
    }

    function render(data, dom, placeHolder) {
        var src = data.value;

        // dom[0].cssText = '';
        // if (data.position) {
        //     $.each(data.position, function (key, value) {
        //         dom.css(key, value);
        //     });
        // }

        if (src) {
            dom.html('<div class="info"></div>');
            dom.find('.info').attr('data-src', src);
        }
        else {
            dom.text(placeHolder);
        }
    }

    function showImg(dom, placeHolder) {
        var src = dom.find('.info').attr('data-src');

        if (src) {
            dom.html('');
            if (src.match(/^media\:\/\//)) {
                src = dataManager.readMedia(src.substr(8));
            }
            lib.embed(src, dom, placeHolder);
        }
    }

    return {
        init: function () {
            imgListHolder.find('a').click(function (e) {
                var item = $(this);
                var key = item.attr('data-key');

                if (key) {
                    e.preventDefault();
                    tabs.find('[data-key="' + key + '"] a').tab('show');
                }
            });

            localInput.on('change', function (e) {
                var file = e.target.files[0];
                var reader = new FileReader();
                reader.onload = function (e) {
                    var img;
                    var src = e.target.result;

                    if (src.length > 0) {
                        lib.minify(src, function (newSrc, info) {
                            localMedia = newSrc;
                            lib.embed(newSrc, localThumb, '图片加载出错!');
                        });
                    }
                };
                reader.readAsDataURL(file);
            });

            urlInput.on('change', function (e) {
                var img;
                var src = e.target.value;

                if (src.length > 0) {
                    lib.embed(src, urlThumb, '图片加载出错!');
                }
            });

            urlBtnRemove.click(function () {
                dataManager.setValue(vm.currentPage(), vm.currentItem(), '');
                dialog.modal('hide');
            });

            dialog.on('hidden', function () {
                vm.finishEdit();
            });

            dialog.find('[data-action="save"]').click(save);
        },
        preview: function (data, dom) {
            render(data, dom, '[暂无图片]');
            showImg(dom, '[暂无图片]');
        },
        resize: function (data, dom) {
            var src = data.value;

            if (src) {
                dom.html('');
                if (src.match(/^media\:\/\//)) {
                    src = dataManager.readMedia(src.substr(8));
                }
                lib.embed(src, dom, '[暂无图片]');
            }
        },
        edit: function (key, page, data, dom) {
            var position = dom.position();
            var width = dom.width();
            var height = dom.height();
            var mediaList;

            newMid = '';
            localMedia = '';

            localInput.val('');
            localThumb.html('');

            urlInput.val('');
            urlThumb.html('');
            urlBtnRemove.hide();

            dialog.modal('show');

            if (!data.value) {
                oldMid = '';
            }
            else if (data.value.match(/^media\:\/\//)) {
                oldMid = data.value.substr(8);
                tabs.find('[data-key="list"] a').tab('show');
            }
            else {
                tabs.find('[data-key="url"] a').tab('show');
                urlInput.val(data.value);
                lib.embed(data.value, urlThumb, '图片加载出错!');
                urlBtnRemove.show();
            }

            mediaList = dataManager.getMediaList();
            buildMeidaList(mediaList);
        },
        build: function (data, dom) {
            render(data, dom, '');
        },
        show: function (dom) {
            showImg(dom, '');
        },
        hide: function (dom) {}
    };
});
define('types/video',['data', 'vm'], function (dataManager, vm) {
    var dialog = $('#video-dialog');
    var input = $('#video-url');

    var helperLoaded;

    function loadHelperScript(callback) {
        var node = document.createElement('script');

        node.addEventListener('load', function () {
            helperLoaded = true;
            callback && callback();
        }, false);

        node.type = 'text/javascript';
        node.src = 'http://player.youku.com/jsapi';

        document.head.appendChild(node);
    }

    function checkHelperLoaded(callback) {
        if (helperLoaded) {
            callback && callback();
        }
        else {
            loadHelperScript(callback);
        }
    }

    function getVid(value) {
        // http://v.youku.com/v_show/id_XNjUwODE1Mg==.html
        var matchResult;

        if (value) {
            matchResult = value.match(/\/id_(.+?)\.html/);
            if (matchResult && matchResult.length >= 2) {
                return matchResult[1];
            }
        }

        return '';
    }

    dialog.find('[data-action="save"]').click(function (e) {
        var val = input.val();
        var vid = getVid(val);

        e.preventDefault();

        dataManager.setValue(vm.currentPage(), vm.currentItem(), vid);
    });

    dialog.on('hidden', function () {
        vm.finishEdit();
    });

    return {
        init: function () {
            checkHelperLoaded();
        },
        preview: function (data, dom) {
            var timeStamp = (new Date).valueOf();
            var value = data ? data.value : '';
            var playerId = 'video-' + timeStamp;
            var playerContainer;
            var img;
            var height;

            if (value) {
                dom.empty();
                height = dom.height();
                playerContainer = $('<div></div>');
                playerContainer.css('height', height + 'px');
                playerContainer.css('line-height', height + 'px');
                playerContainer.css('text-align', 'center');
                dom.append(playerContainer);
                img = $('<img>');
                img.attr('src', 'images/widget/video/youkulogo.png');
                playerContainer.append(img);
            }
            else {
                dom.text('[empty video]');
            }
        },
        resize: function (data, dom) {
            var playerContainer = dom.children().first();
            var height;
            playerContainer.hide();
            height = dom.height();
            playerContainer.css('height', height + 'px');
            playerContainer.css('line-height', height + 'px');
            playerContainer.show();
        },
        adjust: function (dom) {
            ;
        },
        edit: function (key, page, data, dom) {
            dialog.modal('show');
        },
        build: function (data, dom) {
            var timeStamp = (new Date).valueOf();
            var value = data ? data.value : '';
            var playerId = 'video-' + timeStamp;
            var playerContainer;

            dom.empty();

            if (value) {
                playerContainer = $('<div id="' + playerId + '"></div>');
                playerContainer.attr('data-vid', value);
                dom.append(playerContainer);
            }
        },
        show: function (dom) {
            var playerContainer = dom.find('div');
            var playerId = playerContainer.attr('id');
            var vid = playerContainer.attr('data-vid');

            if (vid) {
                playerContainer.css('height', dom.height() + 'px');
                checkHelperLoaded(function () {
                    var player = new YKU.Player(playerId, {
                            client_id: 'c22ac066adde91fe',
                            vid: vid
                        });
                });
            }
        },
        hide: function (dom) {
            dom.find('div').empty();
        }
    };
});
define('types/code',['data', 'vm'], function (dataManager, vm) {
    var dialog = $('#code-dialog');
    var tabs = $('#code-manager-tabs');
    var codePanel = $('#code-panel');
    var demoPanel = $('#demo-panel');

    var codeInput = $('#code-input');
    var urlInput = $('#demo-url-input');
    var urlBtnRemove = $('#demo-url-remove');

    var currentData;

    function getCurrentKey() {
        return tabs.find('.active a').attr('data-key') || 'code';
    }

    function showData(data) {
        var key;

        if (data.config && data.config.type === 'demo') {
            key = 'demo';
            urlInput.val(data.value).focus();
        }
        else {
            key = 'code';
            codeInput.val(data.value).focus();
        }

        tabs.find('[data-key="' + key + '"]').tab('show');
    }

    function render(data, dom, placeHolder) {
        var contentDom;

        if (!data.value) {
            dom.text(placeHolder);
            return;
        }

        if (data.config && data.config.type == 'demo') {
            contentDom = $('<iframe class="code-item demo"></iframe>');
            contentDom.attr('frameborder', '0');
            contentDom.attr('src', data.value);
        }
        else {
            contentDom = $('<pre class="code-item code"></pre>');
            contentDom.html(hljs.highlightAuto(data.value).value);
        }

        contentDom.hide();
        dom.append(contentDom);
    }

    function resize(dom) {
        var width;
        var height;

        var contentDom = dom.find('.code-item');


        if (!contentDom || !dom) {
            return;
        }

        width = dom.width();
        height = dom.height();
        contentDom.css('width', width + 'px');
        contentDom.css('height', height + 'px');

        contentDom.show();
    }

    function save() {
        var currentKey = getCurrentKey();
        var newValue;
        if (currentKey === 'code') {
            newValue = codeInput.val();
            console.log("添加代码段："+newValue)
        }
        else {
            newValue = urlInput.val();
        }

        if (!currentData.config) {
            currentData.config = {};
        }
        currentData.config.type = currentKey;

        console.log('set code', (new Date).valueOf());
        dataManager.setValue(vm.currentPage(), vm.currentItem(), newValue);
    }

    return {
        init: function () {
            urlBtnRemove.click(function () {
                if (!currentData.config) {
                    currentData.config = {};
                }
                currentData.config.type = 'code';

                dataManager.setValue(vm.currentPage(), vm.currentItem(), '');
                dialog.modal('hide');
            });

            dialog.on('hidden', function () {
                vm.finishEdit();
            });

            dialog.find('[data-action="save"]').click(save);
        },
        preview: function (data, dom) {
            render(data, dom, '[空代码段]');
            resize(dom);
        },
        resize: function (data, dom) {
            resize(dom);
        },
        edit: function (key, page, data, dom) {
            currentData = data;
            dialog.modal('show');
            showData(data);
        },
        build: function (data, dom) {
            render(data, dom, '');
        },
        show: function (dom) {
            resize(dom);
        },
        hide: function (dom) {
        }
    };
});
define('types',['types/text', 'types/img',  'types/video', 'types/code'], function (textManager, imgManager, videoManager, codeManager) {

    // for each type
    //   unscalable
    //   init(): initiation
    //   preview(data, dom): preview in editor
    //   resize(data, dom): resize in editor when layout changed
    //   adjust(dom): resize in player when a unscalable item set current
    //   edit(key, page, data, dom): handler when click item in editor
    //   build(data, dom): prepare to display in player
    //   show(dom): handler when show the current page in player
    //   hide(dom): handler when show another page in player

    return {
        text: textManager,
        img: imgManager,
        video: videoManager,
        code: codeManager
    };
});
define('ctrl',[],function () {
    var STAGE_WIDTH = 640;
    var STAGE_HEIGHT = 480;
    var MIN_UNIT = 20;

    var currentVm;
    var currentMenu;

    function toggleMenu(menu) {
        if (menu.attr('data-shown')) {
            hideMenu(menu);
        }
        else {
            showMenu(menu);
        }
    }

    function showMenu(menu) {
        menu.attr('data-show', 'true');

        setTimeout(function () {
            menu.attr('data-shown', 'true');
            currentMenu = menu;
        }, 13);
    }

    function hideMenu(menu) {
        currentMenu = null;

        menu.removeAttr('data-shown');
        menu.removeAttr('data-extended');

        setTimeout(function () {
            menu.removeAttr('data-extend');
        }, 513);
        setTimeout(function () {
            menu.removeAttr('data-show');
        }, 513);
    }

    function toggleMoreMenu(menu) {
        if (menu.attr('data-extended')) {
            hideMoreMenu(menu);
        }
        else {
            showMoreMenu(menu);
        }
    }

    function showMoreMenu(menu) {
        menu.attr('data-extend', 'true');

        setTimeout(function () {
            menu.attr('data-extended', 'true');
        }, 13);
    }

    function hideMoreMenu(menu) {
        menu.removeAttr('data-extended');

        setTimeout(function () {
            menu.removeAttr('data-extend');
        }, 513);
    }

    function startDrag(e, dragTo, finish) {
        var ori = {};
        var win = $(window);
        var target = $(e.target);
        var type = e.type;
        var offset = {};

        function readXY(e, dest) {
            try {
                if (type == 'touchstart') {
                    e = e.originalEvent.touches[0];
                }
                dest.x = e.clientX;
                dest.y = e.clientY;
            }
            catch (ex) {
                console.log('[1713]' + ex);
            }
        }

        function move(e) {
            var cur = {};

            e.preventDefault();

            readXY(e, cur);
            offset.x = cur.x - ori.x;
            offset.y = cur.y - ori.y;

            if (!draggingFlag) {
                if (Math.abs(offset.x) + Math.abs(offset.y) > 5) {
                    draggingFlag = true;
                }
            }
            else {
                dragTo(offset);
            }
        }

        function end(e) {
            var cur = {};
            var offset = {};

            if (draggingFlag) {
                e.preventDefault();
                finish(offset);
                setTimeout(function () {
                    draggingFlag = false;
                }, 13);
            }

            target.css('cursor', '');

            if (type == 'touchstart') {
                win.unbind('touchmove', move);
                win.unbind('touchend', end);
            }
            else {
                win.unbind('mousemove', move);
                win.unbind('mouseup', end);
            }
        }

        draggingFlag = false;

        readXY(e, ori);

        target.css('cursor', 'move');

        if (type == 'touchstart') {
            win.bind('touchmove', move);
            win.bind('touchend', end);
        }
        else {
            e.preventDefault();
            win.bind('mousemove', move);
            win.bind('mouseup', end);
        }
    }

    function adjustChanges(status, changes, mode, verticalAlign) {
        var left = status.left + (changes.left || 0);
        var top = status.top + (changes.top || 0);
        var width = status.outerWidth + (changes.width || 0);
        var height = status.outerHeight + (changes.height || 0);

        var widthExtra = status.outerWidth - status.width;
        var heightExtra = status.outerHeight - status.height;

        if (verticalAlign == 'bottom') {
            top = STAGE_HEIGHT - status.bottom - status.outerHeight + (changes.top || 0);
        }

        if (left < 0) {
            left = 0;
        }
        if (top < 0) {
            top = 0;
        }
        if (width < MIN_UNIT) {
            width = MIN_UNIT;
        }
        if (height < MIN_UNIT) {
            height = MIN_UNIT;
        }
        if (left + width > STAGE_WIDTH) {
            if (mode == 'move') {
                left = STAGE_WIDTH - width;
            }
            else {
                width = STAGE_WIDTH - left;
            }
        }
        if (top + height > STAGE_HEIGHT) {
            if (mode == 'move') {
                top = STAGE_HEIGHT - height;
            }
            else {
                height = STAGE_HEIGHT - top;
            }
        }

        return {
            left: left,
            top: top,
            width: width,
            height: height
        };
    }

    function initCtrl(root, vm) {
        var btnStart;
        var menu;
        var btnMore;
        var btnResize;
        var key = root.attr('data-key');

        var verticalAlign = (key == 'title') ? 'bottom' : 'top';

        var draggingFlag = false;

        function appendCtrl(root) {
            var templateSrc = $('#ctrl-template');
            var template = $.trim(templateSrc.text());
            var ctrlRoot = $(template);

            root.append(ctrlRoot);
            ctrlRoot.find('a').click(function (e) {
                e.preventDefault();
            });

            btnStart = root.find('.ctrl-start');
            menu = root.find('.ctrl-menu');
            btnResize = root.find('.ctrl-resize');

            // if (menu.find('li').length > 3) {
            //     btnMore = menu.find('li:nth-child(3) a');
            // }
            // else {
            //     btnMore = $();
            // }
        }
        function bindActions(menu) {
            var output = root.find('.output');
            var btnEdit = menu.find('[data-action="edit"]');
            var btnClear = menu.find('[data-action="clear"]');
            var moreMenu = menu.find('.ctrl-menu-more');

            btnEdit.click(function (e) {
                e.preventDefault();
                hideMenu(menu);
                vm.editItem(output);
            });

            btnClear.click(function (e) {
                e.preventDefault();
                hideMenu(menu);
                vm.clearItem(output);
            });

            moreMenu.delegate('a', 'click', function (e) {
                var target;
                e.preventDefault();
                target = $(this);
                if (target.attr('data-action') === 'type') {
                    vm.confirmChangeType(output, target.attr('data-type'));
                }
            });
        }

        function startMove(e) {
            var status = {
                left: parseInt(root.css('left')) || 0,
                top: parseInt(root.css('top')) || 0,
                bottom: parseInt(root.css('bottom')) || 0,
                width: parseInt(root.css('width')) || 0,
                height: parseInt(root.css('height')) || 0,
                outerWidth: root.outerWidth(),
                outerHeight: root.outerHeight()
            };
            var result;

            startDrag(e, function (offset) {
                var changes = {
                    left: offset.x,
                    top: offset.y
                };

                result = adjustChanges(status, changes, 'move', verticalAlign);

                root.css('left', result.left + 'px');
                if (verticalAlign == 'top') {
                    root.css('top', result.top + 'px');
                }
                else {
                    root.css('bottom', STAGE_HEIGHT - result.top - result.height + 'px');
                }
            }, function (offset) {
                var diffX;
                var diffY;

                diffX = result.left - status.left;
                if (verticalAlign == 'top') {
                    diffY = result.top - status.top;
                }
                else {
                    diffY = STAGE_HEIGHT - result.top - result.height - status.bottom;
                }

                if (Math.abs(diffX) + Math.abs(diffY) > 0) {
                    // TODO changed;
                }
            });
        }
        function startResize(e) {
            var status = {
                left: parseInt(root.css('left')) || 0,
                top: parseInt(root.css('top')) || 0,
                bottom: parseInt(root.css('bottom')) || 0,
                width: parseInt(root.css('width')) || 0,
                height: parseInt(root.css('height')) || 0,
                outerWidth: root.outerWidth(),
                outerHeight: root.outerHeight()
            };
            var result;

            startDrag(e, function (offset) {
                var changes = {
                    width: offset.x,
                    height: offset.y
                };

                result = adjustChanges(status, changes, 'resize', verticalAlign);

                root.css('width', result.width + 'px');
                root.css('height', result.height + 'px');
                if (verticalAlign == 'bottom') {
                    root.css('bottom', STAGE_HEIGHT - result.top - result.height + 'px');
                }
            }, function (offset) {
                var diffX;
                var diffY;

                diffX = result.width - status.width;
                diffY = result.height - status.height;

                if (Math.abs(diffX) + Math.abs(diffY) > 0) {
                    // TODO save new size/position;
                }
            });
        }

        currentVm = vm;
        appendCtrl(root);
        bindActions(menu);

        btnStart.click(function (e) {
            e.preventDefault();
            currentVm.currentItem(key);
            if (!draggingFlag) {
                toggleMenu(menu);
            }
        });
        // btnMore.click(function (e) {
        //     e.preventDefault();
        //     toggleMoreMenu(menu);
        // });
        // btnResize.click(function (e) {
        //     e.preventDefault();
        // });
        // btnStart.bind('mousedown', startMove);
        // btnStart.bind('touchstart', startMove);
        // btnResize.bind('mousedown', startResize);
        // btnResize.bind('touchstart', startResize);
    }

    function updateTypeList(root, currentType, typeList) {
        var output = root.find('.output');
        var moreMenu = root.find('.ctrl-menu-more');

        if (!typeList) {
            moreMenu.find('a').removeClass('active');
            moreMenu.find('[data-type="' + currentType + '"]').addClass('active');
        }
        else {
            moreMenu.empty();
            if (typeList.length > 0) {
                $.each(typeList, function (i, typeData) {
                    var key = typeData.key;
                    var name = typeData.name;
                    var btn = $('<a href="#"></a>').text(name).
                        attr('data-action', 'type').attr('data-type', key);
                    if (currentType === key) {
                        btn.addClass('active');
                    }
                    moreMenu.append(btn);
                });
            }
            else {
                moreMenu.html('<a href="#">Text</a>');
            }
        }
    }

    function mousedown(e) {
        var target = $(e.target);
        var menu = target.closest('.ctrl-menu');

        if (currentMenu && (!menu || !currentMenu.is(menu))) {
            hideMenu(currentMenu);
        }
        if (menu && menu.length) {
            currentMenu = menu;
        }
    }

    return {
        init: function (stage, vm) {
            stage.find('[data-key]').each(function () {
                initCtrl($(this), vm);
            });

            $(window).bind('mousedown', mousedown);
        },
        update: function (item, currentIndex, typeList) {
            updateTypeList(item, currentIndex, typeList);
        }
    };
});
define('stage',['data', 'types', 'ctrl'], function (dataManager, typeMap, ctrlManager) {
    var itemKeyMap = ['title', 'content', 'content2', 'subtitle', 'subtitle2'];

    return {
        init: function (vm) {
            vm.previewItem = function (key) {
                var page = vm.currentPage();
                var itemData = dataManager.getItem(page, key);
                var dom = $('#slide-' + key);
                var output = dom.find('.output');
                var typeHelper = typeMap[itemData.type];

                output.empty();

                if (typeHelper) {
                    typeHelper.preview(itemData, output);
                }
            };
            vm.previewAll = function () {
                itemKeyMap.forEach(function (key) {
                    vm.previewItem(key);
                });
            };

            vm.resizeItem = function (key) {
                var page = vm.currentPage();
                var layout = dataManager.getSlide(page).layout;
                var itemData = dataManager.getItem(page, key);
                var dom = $('#slide-' + key);
                var output = dom.find('.output');
                var typeHelper = typeMap[itemData.type];

                if (typeHelper && typeHelper.resize) {
                    typeHelper.resize(itemData, output);
                }

                ctrlManager.update(dom, itemData.type, dataManager.getTypeList(layout, key));
            };
            vm.resizeAll = function () {
                itemKeyMap.forEach(function (key) {
                    vm.resizeItem(key);
                });
            };

            vm.clickItem = function (vm, e) {
                var output = $(e.currentTarget);
                e.stopPropagation();
                vm.editItem(output);
            };

            vm.editItem = function (output) {
                var dom = output.parent();
                var key = dom.attr('data-key');
                var page = vm.currentPage();
                var itemData = dataManager.getItem(page, key);
                var typeHelper = typeMap[itemData.type];

                vm.currentItem(key);

                if (typeHelper) {
                    vm.currentItemDataCopy(JSON.parse(JSON.stringify(itemData)));
                    if (typeHelper.init && !typeHelper.initialized) {
                        typeHelper.init();
                        typeHelper.initialized = true;
                    }
                    typeHelper.edit(key, page, itemData, output);
                }
            };

            vm.confirmChangeType = function (output, newType) {
                var dom = output.parent();
                var key = dom.attr('data-key');
                var page = vm.currentPage();
                var itemData = dataManager.getItem(page, key);
                var type = itemData.type;

                var dialog = $('#confirm-dialog');

                vm.currentItem(key);

                if (type === newType) {
                    return;
                }

                if (itemData.value) {
                    dialog.find('.modal-header h3').text('Change Type');
                    dialog.find('.modal-body').text('Are you sure?');
                    dialog.find('[data-action="yes"]').on('click', function (e) {
                        vm.changeType(output, newType);
                    });
                    dialog.on('hide', function () {
                        dialog.find('modal-header h3').text('Change Type');
                        dialog.find('modal-body').text('Are you sure?');
                        dialog.find('[data-action="yes"]').off('click');
                    });
                    dialog.modal('show');
                }
                else {
                    vm.changeType(output, newType);
                }
            },
            vm.changeType = function (output, type) {
                var dom = output.parent();
                var key = dom.attr('data-key');
                var page = vm.currentPage();

                vm.currentItem(key);
                dataManager.changeType(page, key, type);
                dataManager.save();
                vm.previewItem(key);

                ctrlManager.update(dom, type);
            }

            vm.clearItem = function (output) {
                var dom = output.parent();
                var key = dom.attr('data-key');
                var page = vm.currentPage();

                vm.currentItem(key);

                dataManager.clearItem(page, key);
                dataManager.save();
                vm.previewItem(key);
            };

            vm.finishEdit = function () {
                var page = vm.currentPage();
                var key = vm.currentItem();
                var newPageData;

                var changed = dataManager.checkItemChanged(
                        page, key,
                        vm.currentItemDataCopy()
                    );
                if (changed) {
                    if (key == 'title') {
                        newPageData = JSON.parse(JSON.stringify(vm.pageList.slice(page, page + 1)[0]));
                        //要处理的地方
                        newPageData.title = $.removeHtml(dataManager.getValue(page, key));
                        vm.pageList.splice(page, 1, newPageData);

                        vm.addPageListMenu();
                    }
                    dataManager.save();
                    vm.previewItem(key);
                }

                vm.currentItem('');
            };

            vm.currentSid.subscribe(function () {
                setTimeout(vm.previewAll, 13);
            });

            ctrlManager.init($('#editor-stage'), vm);
            vm.resizeAll();
        }
    };
});
define('editor',['vm', 'title', 'page', 'status', 'stage'],
    function (vm, titleManager, pageManager, statusManager, stageManager) {
        function getExtUrl() {
            var url = '';
            var extResult = location.search.match(/[\&\?]ext=([^\&]*)/);
            if (extResult) {
                url = decodeURIComponent(extResult[1]);
            }
            return url;
        }

        function checkExt() {
            var url = getExtUrl();
            var script;
            if (url) {
                script = document.createElement('script');
                script.src = url;
                document.body.appendChild(script);
                //动态加载script测试
                // alert(url);
            }

            history.replaceState(null, null, location.pathname);
        }

        function init() {
            titleManager.init(vm);
            statusManager.init(vm);
            pageManager.init(vm);
            stageManager.init(vm);

            // 绑定模型的地方
            ko.applyBindings(vm);
            vm.previewAll();

            //添加右键快捷操作
            AddContentClicked();
            //添加滚轮事件
            addEditorMousewheelEvent(vm);
            //添加文本编辑按钮事件
            // addTextEditorBtnEvent();
            //添加取色器
            setMycolorPicker();

            checkExt();
        }

        function clickEditorContent(e){
            e.preventDefault();
            $("#myPageMoveUp").hide();
            $("#myPageMoveDown").hide();
            $("#myPageRemove").hide();
            //左键事件
            if(1 == e.which){
                $("#myEditorMenu").hide();
                return true;
            }
            //右键事件
            if(3 == e.which){
                ev= e || window.event;
                //获取当前的x,y坐标,并借此设定菜单位置
                $("#myEditorMenu").css("left", ev.pageX + "px");
                $("#myEditorMenu").css("top", ev.pageY + "px"); 
                $("#myEditorMenu").show();
            }
            return false;
        }

        

        function AddContentClicked(){
            var editorStage = $("#editor-stage");
            editorStage.bind('contextmenu' , function(e){
                e.preventDefault();
                return false;
            });
            editorStage.bind("mouseup", clickEditorContent);

            $("#myEditorMenuAdd").bind("click",function(e) {
                e.preventDefault();
                $("#template-dialog").modal('show');
            });
            $("#myEditorMenuLayout").bind("click", function(e){
                $("#mylayoutbar").show("slow");
                $(".show-layout-toggle").find('a').html("收起布局模板<b class='upcaret'></b>");
            });

            pageManager.addPageListMenu(vm);
        }

        return {
            init: init
        }
    }
);
define('fullscreen',[], function(){

    var fullScreen = {
        /**
            是否支持全屏模式
         */
        fullScreenEnabled: ( function() {
            var doc = document.documentElement;

            return  ( 'requestFullscreen' in doc ) ||
                    ( 'webkitRequestFullScreen' in doc ) ||
                    ( 'msRequestFullscreen' in doc && document.msFullscreenEnabled) ||
                    ( 'mozRequestFullScreen' in doc && document.mozFullScreenEnabled ) ||
                    false;
        } )(),
        /**
            判断当前全屏状态
         */
        isFullScreen: function() {
            return  document.fullscreen ||
                    document.webkitIsFullScreen ||
                    document.mozFullScreen ||
                    false;
        },
        /**
            进入全屏模式
         */
        requestFullScreen : function(elem){
            if ( !this.fullScreenEnabled ) {
                return;
            }

            if ( this.isFullScreen() ) {
                this.exitFullScreen();
            }

            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            }else if (elem.webkitRequestFullScreen) {
                elem.webkitRequestFullScreen();
            }else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            }else if (elem.msRequestFullscreen){
                elem.msRequestFullscreen();
                var f_height = $("#player-stage").height();
                var s_height = $("#player-slides-container").height();
                $("#player-slides-container").find(".slide").css("margin-top",(f_height - s_height)/2 + "px");
            }
        },
        /**
            退出全屏模式
         */
        exitFullScreen : function(){
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }else if (document.msExitFullscreen){
                document.msExitFullscreen();
            }
        },
        /**
            绑定全屏事件
         */
        bindFullScreenChange : function(handler){
            if (this.fullScreenEnabled) {
                if(document.onwebkitfullscreenchange){
                    document.onwebkitfullscreenchange = function (e) {
                        handler && handler(isFullscreen());
                    };
                }else if(document.onmozfullscreenchange){
                    document.onmozfullscreenchange = function (e) {
                        handler && handler(isFullscreen());
                    };
                }else if(document.onmsfullscreenchange){
                    document.onmsfullscreenchange = function (e) {
                        handler && handler(isFullscreen());
                    };
                }
            }
        }
    };

    return fullScreen;
});
define('player',['data', 'design', 'types', 'vm', 'fullscreen'], function (dataManager, designManager, typeMap, vm, fullscreen) {
    var btnPreview = $('#preview-btn');
    var btnPreviewCurrent = $('#preview-current-btn');

    var player = $('#player');
    var editor = $('#editor');

    var stageDom = $('#player-stage');
    var slidesContainer = $('#player-slides-container');

    var btnMenu = $('#player-btn-menu');
    var btnNext = $('#player-btn-next');
    var btnPrev = $('#player-btn-prev');
    var btnGoto = $('#player-btn-goto');
    var btnExit = $('#player-btn-exit');

    var txtPage = $('#player-page');
    var txtSum = $('#player-sum');

    var gotoDialog = $('#goto-dialog');
    var gotoNumber = $('#goto-number');
    var mouseClickScreen = $("#player-stage");

    var btnGo = gotoDialog.find('[data-action="go"]');

    var slideLength;
    var currentPage;

    var currentSlideDom;
    var nextSlideDom;
    var prevSlideDom;

    var isPlaying = false;

    /**
        创建一个元素
     */
    function createItem(key, itemData) {
        var itemDom = $('<div><div class="output"></div></div>');
        var type = itemData.type || 'text';
        var typeHelper = typeMap[type];
        var output = itemDom.find('.output');

        itemDom.attr('data-key', key);
        itemDom.attr('data-type', type);

        if (typeHelper) {
            typeHelper.build(itemData, output);
        }

        return itemDom;
    }
    /**
        创建一页幻灯片
     */
    function createSlide(page, slideData) {
        var slideDom = $('<div></div>');

        slideDom.addClass('slide');

        slideDom.attr('id', 'slide-' + slideData.sid);
        slideDom.attr('data-layout', slideData.layout);
        slideDom.attr('data-page', page);

        $.each(slideData.items, function (key, itemData) {
            var itemDom = createItem(key, itemData);
            if (itemDom) {
                slideDom.append(itemDom);
            }
        });

        return slideDom;
    }


    /**
        获取某一页幻灯片
     */
    function getSlideDom(page) {
        if (page < 0) {
            return $();
        }
        return $(slidesContainer.find('.slide')[page]);
    }


    /**
        隐藏一页幻灯片
     */
    function hidePage(dom) {
        dom.children().each(function () {
            var itemDom = $(this);
            var output = itemDom.find('.output');
            var type = itemDom.attr('data-type');
            var typeHelper = typeMap[type];

            if (typeHelper && typeHelper.hide) {
                typeHelper.hide(output);
            }
        });
    }
    /**
        显示一页幻灯片
     */
    function showPage(dom) {
        dom.children().each(function () {
            var itemDom = $(this);
            var output = itemDom.find('.output');
            var type = itemDom.attr('data-type');
            var typeHelper = typeMap[type];

            if (typeHelper && typeHelper.show) {
                typeHelper.show(output);
            }
        });
    }


    /**
        切换两页幻灯片
     */
    function switchPage(newPage) {
        var next = -1;
        var prev = -1;

        var oldPage = -1;
        var oldNext = -1;
        var oldPrev = -1;

        // get old current/next/prev
        if (currentSlideDom) {
            oldPage = currentSlideDom.attr('data-page') - 0;
        }
        if (nextSlideDom) {
            oldNext = nextSlideDom.attr('data-page') - 0;
        }
        if (prevSlideDom) {
            oldPrev = prevSlideDom.attr('data-page') - 0;
        }

        if (oldPage == newPage) {
            return;
        }

        // get new current/next/prev
        if (newPage > 0) {
            prev = newPage - 1;
        }
        if (newPage < slideLength - 1) {
            next = newPage + 1;
        }
        if (oldPage >= 0) {
            if (oldPage > newPage) {
                next = oldPage;
            }
            else if (oldPage < newPage) {
                prev = oldPage;
            }
        }

        currentSlideDom && currentSlideDom.removeClass('slide-current');
        nextSlideDom && nextSlideDom.removeClass('slide-next');
        prevSlideDom && prevSlideDom.removeClass('slide-prev');

        currentSlideDom = null;
        nextSlideDom = null;
        prevSlideDom = null;

        if (newPage >= 0) {
            currentSlideDom = getSlideDom(newPage).addClass('slide-current');
        }
        if (next >= 0) {
            nextSlideDom = getSlideDom(next).addClass('slide-next');
        }
        if (prev >= 0) {
            prevSlideDom = getSlideDom(prev).addClass('slide-prev');
        }
    }

    /**
        跳转到某一页
     */
    function gotoPage(page) {
        var oldPage = currentPage;
        var newPage = page - 0;

        var oldSlideDom = currentSlideDom;
        var newSlideDom = getSlideDom(page);;

        if (oldPage == newPage) {
            return;
        }

        if (oldSlideDom) {
            hidePage(oldSlideDom);
        }
        if (newSlideDom) {
            showPage(newSlideDom);
        }

        currentPage = newPage;
        txtPage.text(newPage + 1);

        switchPage(newPage);

        //处理变化的主题样式
        designManager.resetDesign(vm,currentPage,slideLength - 1);
    }


    /**
        下一页
     */
    function goNext() {
        if (currentPage < slideLength - 1) {
            gotoPage(currentPage + 1);
        }
    }
    /**
        前一页
     */
    function goPrev() {
        if (currentPage > 0) {
            gotoPage(currentPage - 1);
        }
    }


    /**
        绑定点击下一页按钮的事件
     */
    function clickNext(e) {
        e.preventDefault();
        goNext();
    }
    /**
        绑定点击前一页按钮的事件
     */
    function clickPrev(e) {
        e.preventDefault();
        goPrev();
    }
    /**
        绑定点击弹出跳转对话框按钮的事件
     */
    function clickGoto(e) {
        e.preventDefault();

        gotoDialog.modal('show');
        gotoNumber.val(currentPage + 1);
    }
    /**
        绑定点击跳转按钮的事件
     */
    function clickGo(e) {
        var newPage = gotoNumber.val() - 1;
        gotoPage(newPage);
    }

    /**
        修改属性元素的前缀以兼容当前浏览器
     */
    function compatCssPropPrefix(prop) {
        var style = document.createElement('dummy').style,
            prefixes = 'Webkit Moz O ms Khtml'.split(' '),
            memory = {};

        if (typeof memory[ prop ] === "undefined") {

            var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1),
                props = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');

            memory[ prop ] = null;
            for (var i in props) {
                if (style[ props[i] ] !== undefined) {
                    memory[ prop ] = props[i];
                    break;
                }
            }

        }

        return memory[ prop ];
    }

    /**
        修改元素的css属性元素以兼容当前浏览器
        @param el
        @param props
        @returns {*}
     */
    function compatCssProp ( el, props ) {
        var key, pkey;

        for ( key in props ) {
            if ( props.hasOwnProperty(key) ) {
                pkey = compatCssPropPrefix(key);
                if ( pkey !== null ) {
                    el.style[pkey] = props[key];
                }
            }
        }
        return el;
    }

    /**
        退出播放器，显示编辑器
     */
    function doExit() {
        //使transform属性兼容当前浏览器
        compatCssProp(slidesContainer[0], {'transform':''});

        currentSlideDom = null;
        nextSlideDom = null;
        prevSlideDom = null;

        currentPage = -1;

        slideLength = null;
        slidesContainer.empty();

        $(window).unbind('keydown', keydown);
        //解绑定鼠标点击下一页

        mouseClickScreen.unbind('mousedown',clickScreen);
        //未解决问题：还原页面的缩放比为100%
        // $(document.body).css("zoom","100%");
        // $(window).width("100%");
        // $(window).height("100%");
        // document.body.style.zoom = 1.0;
        // document.body.style.cssText += '; -moz-transform: scale('1.0');-moz-transform-origin: 0 0; ';


        fullscreen.bindFullScreenChange(null);
        fullscreen.exitFullScreen();

        player.hide();
        editor.show();

        isPlaying = false;

        //还原网页的缩放比
        //$('*').css('zoom','1'); //无效
    }

    /**
        启动播放器，初始化幻灯片和屏幕
     */
    function doPlay(page) {
        var design = dataManager.getDesign();
        var transition = dataManager.getTransition();
        var title = dataManager.getTitle();
        var slideList = dataManager.getSlideList();

        designManager.loadCssLink(design);
        stageDom.attr('data-design', design);
        stageDom.attr('data-transition', transition);

        slidesContainer.empty();
        $.each(slideList, function (i, slideData) {
            var slideDom = createSlide(i, slideData);

            slidesContainer.append(slideDom);
        });

        slideLength = slideList.length
        txtSum.text(slideLength);
        gotoNumber.attr('min', 1);
        gotoNumber.attr('max', slideLength);
            
        gotoPage(parseInt(page) || 0);

        $(window).bind('keydown', keydown);
        //绑定鼠标点击下一页
        mouseClickScreen.bind('mousedown',clickScreen);
        

        fullscreen.requestFullScreen(document.body);
        fullscreen.bindFullScreenChange(function (isFullscreen) {
            if (!isFullscreen) {
                 doExit();
            }
        });

        isPlaying = true;
    }

    /**
        绑定鼠标左右键事件
     */
    function clickScreen(e){
        e.preventDefault();
        //左键事件
        if(1 == e.which){
            clickNext(e);
            $("#myPlayerMenu").hide();
        }
        //右键事件
        if(3 == e.which){
            ev= e || window.event;
            //获取当前的x,y坐标,并借此设定菜单位置
            $("#myPlayerMenu").css("left", ev.pageX + "px");
            $("#myPlayerMenu").css("top", ev.pageY + "px"); 
            $("#myPlayerMenu").show();
        }
        return false;
    }

    /**
        绑定键盘事件
     */
    function keydown(e) {
        switch (e.keyCode) {
        case 38:
        case 37://左箭头：上一页
            goPrev();
            break;
        case 13://Enter键：跳转
            gotoDialog.modal('show');
            gotoNumber.val(currentPage + 1);
            gotoNumber.select();
            break;
        case 39:
        case 40://右箭头：下一页
            goNext();
            break;
        case 27://esc：退出
            doExit();
            break;
        default:
            ;
        }
    }

    /**
        绑定点击退出按钮的事件
     */
    function clickExit(e) {
        e.preventDefault();
        doExit();
    }

    /**
        绑定点击播放按钮的事件
     */
    function clickPreview(e) {
        e.preventDefault();
        editor.hide();
        player.show();
        doPlay();
    }

    /**
        绑定点击播放按钮的事件
     */
    function clickPreviewCurrent(e) {
        e.preventDefault();
        editor.hide();
        player.show();
        doPlay(vm.currentPage());
    }


    btnPreview.click(clickPreview);
    btnPreviewCurrent.click(clickPreviewCurrent);
    //导航按钮事件
    btnNext.click(clickNext);
    btnPrev.click(clickPrev);
    btnGoto.click(clickGoto);
    btnExit.click(clickExit);
    //菜单按钮事件
    $("#myPlayerMenuNext").click(clickNext);
    $("#myPlayerMenuPrev").click(clickPrev);
    $("#myPlayerMenuGoto").click(clickGoto);
    $("#myPlayerMenuExit").click(clickExit);
    $("#myPlayerMenu-player-nav-toggle").click(function(event) {
        var navToogle = this;
        $("#player-nav").toggle(function() {
            if($(this).css("display") == "none")
                $(navToogle).html("显示操作条");
            else
                $(navToogle).html("隐藏操作条");

        });
    });

    btnGo.click(clickGo);
    mouseClickScreen.bind('contextmenu' , function(e){
        e.preventDefault();
        return false;
    });

    return {};
});
define('save',['data'],function(dataManager){
    /**
    * 将指定字符写入指定名称的文本文件中，并可以选择本地保存目录，兼容IE11和谷歌浏览器
    */
    function downloadText(filename,content)
    {
        //FileSaver.js
        var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
        saveAs(blob, filename);
    }

    // 初始化 Showdown converter，用于将 html 转为 markdown
    showdown.extension('mathjax', function() {
        return [{
            type: 'output',
            regex: /<mjx-assistive-mml[^>]*>([\s\S]*?)<\/mjx-assistive-mml>/g,
            replace: function(match, p1) {
                return '$$' + p1 + '$$';
            }
        }];
    });    
    showdown.extension('checkbox', function() {
        return [{
            type: 'output',
            regex: /<input type="checkbox" (checked)?.*?>([^<]+)/g,
            replace: function(match, p1, p2) {
                // p1 is either undefined (for unchecked) or 'checked=""' (for checked)
                // p2 is the text content
                console.log("html2md checkbox catch ", p1, p2);
                return (p1 ? "[x] " : "[ ] ") + p2;
            }
        }];
    });
    showdownConverter = new showdown.Converter({
        literalMidWordUnderscores: true,
        strikethrough: true,
        tables: true,
        simpleLineBreaks: true,
        simplifiedAutoLink: true,
        parseImgDimensions: true,
        ghCodeBlocks: true,
        smartIndentationFix: true,
        extensions: ['mathjax', 'checkbox']
    });
    function downloadMarkdown(filename)
    {
        var data = dataManager.getData()
        var contentHtml = ''
        if (data.title) {
            contentHtml += '<h1>' + data.title + '</h1>\n\n'
            data.slides.forEach(function (slide) {
                for (const key in slide.items) {
                    // {"title":{"type":"text","value":"介绍"},"content":{"type":"text","value":"<p><font color=\\"#0000ff\\">你好呀！</font></p>"}}
                    if (key == "title") {
                        contentHtml += '<h2>' + slide.items[key].value + '</h2>\n\n'
                    } else {
                        contentHtml += slide.items[key].value + '\n\n'
                    }
                }
            })
        }
        contentHtml = convertTasksToMarkdown(contentHtml)
        content = showdownConverter.makeMarkdown(contentHtml);
        //FileSaver.js
        var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
        saveAs(blob, filename);
    }

    function convertTasksToMarkdown(htmlString) {
        return htmlString.replace(/<input type="checkbox"[^>]*>(?:<\/input>)?\s*([^<]*)/g, function(match, p1) {
            // p1 是任务的文本内容
            // match 是整个匹配到的字符串，例如整个 <input> 元素
            var isChecked = /checked=""/.test(match);
            return "[" + (isChecked ? "x" : " ") + "] " + p1.trim();
        });
    }
    

    var storage = localData;
    var finished = 0;
    var filecount = 13;
    var fileName = '新幻灯片.html';
    function readTextFile(key,myurl){
        if(storage.getItem(key) == null){
            $.ajax({
                url: myurl,
                dataType: 'text',
                success: function(data) {
                    storage.setItem(key,data);
                    finished++;
                    if(finished == filecount){
                        saveToHtml();
                    }
                }
            });
        }else{
            finished++;
            if(finished == filecount){
                saveToHtml();
            }
        }
    }
    function downloadHtml(filename){
        finished = 0;
        // Attention: 如果需要新解析文档，需要增加filecount的值
        filecount = 13;
        fileName = filename || '新幻灯片.html';
        // 锁屏
        //加载css——4个
        readTextFile('bootstrap_css','template.html/bootstrap.css.txt');
        readTextFile('default_min_css','template.html/default.min.css.txt');
        readTextFile('main_css','template.html/main.css.txt');
        readTextFile('adjust_css','template.html/adjust.css.txt');
        //加载html——1个
        readTextFile('body_html','template.html/body.html.txt');
        //加载js——8个
        readTextFile('jquery_min_js','template.html/jquery.min.js.txt');
        readTextFile('bootstrap_min_js','template.html/bootstrap.min.js.txt');
        readTextFile('knockout_js','template.html/knockout-2.2.1.js.txt');
        readTextFile('highlight_min_js','template.html/highlight.min.js.txt');
        readTextFile('FileSaver_min_js','template.html/FileSaver.min.js.txt');
        readTextFile('adjust_js','template.html/adjust.js.txt');
        readTextFile('tex_mml_chtml_js','template.html/tex-mml-chtml.js.txt');
        readTextFile('require_js','template.html/require.js.txt');
        readTextFile('main_js','template.html/main.js.txt');
        // Attention: 如果需要新解析文档，需要增加filecount的值 向上看
        
        // while(finished < filecount){  }
        //解屏
    }

    function saveToHtml(){

        var bootstrap_css = storage.getItem("bootstrap_css") || '';
        var default_min_css = storage.getItem("default_min_css") || '';
        var main_css = storage.getItem("main_css") || '';
        var adjust_css = storage.getItem("adjust_css") || '';
        var all_css = "<style type = 'text/css'>" + bootstrap_css + default_min_css + main_css + adjust_css + "</style>";

        var jquery_min_js = storage.getItem("jquery_min_js") || '';
        var bootstrap_min_js = storage.getItem("bootstrap_min_js") || '';
        var knockout_js = storage.getItem("knockout_js") || '';
        var highlight_min_js = storage.getItem("highlight_min_js") || '';
        var FileSaver_min_js = storage.getItem("FileSaver_min_js") || '';
        var adjust_js = storage.getItem("adjust_js") || '';
        // var tex_mml_chtml_js = storage.getItem("tex_mml_chtml_js") || '';
        var require_js = storage.getItem("require_js") || '';
        var main_js = storage.getItem("main_js") || '';
        var all_js = "<script type=\"text/javascript\">\n" 
            + "var myHtmlSlidesData = " + (storage.getItem('h5slides-data')||"") + ";" 
            + jquery_min_js + bootstrap_min_js + knockout_js
            + highlight_min_js + FileSaver_min_js  
            + adjust_js + require_js + main_js 
            + "setmyImagesByKey();setmyDesignByKey();\n</script>";

        var body_html =  storage.getItem("body_html") || '';

        var content = "<!doctype html><html><head>" + all_css + "</head><body>" + body_html + all_js + "</body>" + "</html>";

        //FileSaver.js
        var blob = new Blob(["\ufeff" + content], {type: "text/plain;charset=utf-8"});
        saveAs(blob, fileName);
        finished = 0;
    }


    return {
        init: function(){
            $("#save-text-btn").bind('click',function(e){
                var filename = (dataManager.getTitle() || '新幻灯片') + '.txt';
                var content = JSON.stringify(dataManager.getData() || '');
                downloadText(filename,content);
            });
            $("#save-html-btn").bind('click',function(e){
                dataManager.save();
                var filename = (dataManager.getTitle() || '新幻灯片') + '.html';
                downloadHtml(filename);
            });
            $("#save-markdown-btn").bind('click',function(e){
                dataManager.save();
                var filename = (dataManager.getTitle() || '新幻灯片') + '.md';
                downloadMarkdown(filename);
            });
        }
    };
});
define('open',['data'],function(dataManager){
    /**
    * 将指定字符写入指定名称的文本文件中，并可以选择本地保存目录，兼容IE11和谷歌浏览器
    */
    var importPanel = $('#import-file-panel');
    var importInput = importPanel.find('input').val('');
    var importThumb = importPanel.find('.file-info').text('');
    var onlinePanel = $('#online-file-panel');
    function getFileList() {
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
                        var listStr = ""
                        $(this).find("slide").each(function (j){
                            listStr += "<div class='clear'><p><a onclick='openOnlineNewFile(this)' name='open-online-go'  slide-id='" + $(this).attr("id") + "' title='打开' >" + (j+1) +"、"+ $(this).find("title").text() + "<span>[发布时间：" + ($(this).find("time").text() || "未知") + "]</span></a></p><a onclick='removeThisLine(this)' name='open-online-delete' id='DeleteMyFile-" + $(this).attr("id") + "' title='删除' class='close delete-btn'>×</a></div>";
                        });
                        onlinePanel.html(listStr);
                    }
                });
            }
        });
        return false;
    }

    // 初始化 Showdown converter，用于将 markdown 转为 html
    showdownConverter = new showdown.Converter({
        literalMidWordUnderscores: true,
        strikethrough: true,
        tables: true,
        tasklists: true,
        simpleLineBreaks: true,
        simplifiedAutoLink: true,
        parseImgDimensions: true,
        ghCodeBlocks: true,
        smartIndentationFix: true
    });

    // 转化 markdown 为幻灯片 json
    function renderMarkdownText(markdownContent){
        // 初始化JSON结构
        var presentationJSON = {
            "design": "default",
            "transition": "cubic-vertical-inner",
            "title": "",
            "slides": []
        };

        // 使用正则表达式提取标题和内容
        var sections = markdownContent.split(/\n## /);
        presentationJSON.title = sections[0].split('\n')[0].substr(2).trim();

        sections.slice(1).forEach((section, index) => {
            var lines = section.split('\n');
            var contentHtml = lines.slice(1).join('\n').trim()
            contentHtml = showdownConverter.makeHtml(contentHtml); // 这里可以转为HTML
            console.log(contentHtml);
            // 使用emoji-toolkit解析表情
            contentHtml = joypixels.toImage(contentHtml);
            console.log(contentHtml);
            // 调整html结构，方便 MathJax 渲染
            // 使用 replace 方法和正则表达式来处理字符串
            contentHtml = contentHtml.replace(/\$\$([\s\S]*?)\$\$/g, function(match, p1) {
                // p1 是 $$ 符号之间的内容
                console.log(p1);  // 原始的匹配内容，可能包含 <br> 和换行符
                var text = $("<div></div>").html(p1).text().trim();  // 使用 jQuery 来解码 HTML 实体，并移除首尾的空白字符
                console.log(text);  // 处理后的纯文本公式
                var htmlElement = MathJax.tex2chtml(text);  // 将纯文本公式转换为 MathJax HTML
                // 将MathJax创建的HTML元素转换为字符串
                let div = document.createElement('div');
                div.appendChild(htmlElement);
                return div.innerHTML;
            });            
            console.log(contentHtml);

            var slide = {
                "sid": "S" + (index + 1),
                "layout": "normal",
                "items": {
                    "title": {
                        "type": "text",
                        "value": lines[0].trim()
                    },
                    "content": {
                        "type": "text",
                        "value": contentHtml
                    }
                }
            };
            presentationJSON.slides.push(slide);
        });

        // 在此处，presentationJSON 已经包含了你所需的结构和数据。你可以转化为字符串，并在需要的地方使用它。
        var jsonString = JSON.stringify(presentationJSON, null, 2); // 使用缩进便于阅读

        return jsonString;
    }

    function isJSON(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    // 打开在线文件
    window.openOnlineNewFile = function openOnlineNewFile(o) {
        var slideId = $(o).attr("slide-id");
        $.ajax({
          //请求方式为get
          type: "GET",
          //xml文件位置
          url: "database/data.xml",
          //返回数据格式为xml
          dataType: "xml",
          //请求成功完成后要执行的方法
          success: function (xml) {
            $(xml)
              .find("user")
              .each(function (i) {
                //i从0开始，累加，如果要显示所有数据，将判断去除即可
                if ($(this).attr("id") == "petter") {
                  $(this)
                    .find("slide")
                    .each(function (j) {
                      if ($(this).attr("id") == slideId) {
                        var content = $(this).find("content").text();
                        var storage = localData;
                        try {
                          //这里存储幻灯片的字符串
                          if (!isJSON(content)) {
                            // 不是规范 json，可能是 markdown
                            content = renderMarkdownText(content);
                          }
                          storage.setItem("h5slides-data", content);
                          console.log("saved", new Date().valueOf());
                        } catch (e) {
                          console.log(e); // QuotaExceededError
                        }
                        location.reload();
                      }
                    });
                }
              });
          },
        });
    }
    
    return {
        init: function(){
            importInput.on("change",function(e){
                var file = e.target.files[0];

                // 获取文件的 MIME 类型
                var fileType = file.type;
                // 获取文件的扩展名
                var fileExtension = file.name.split('.').pop().toLowerCase();

                var reader = new FileReader();
                reader.onload = function (e) {
                    importThumb.text(e.target.result);
                    importThumb.attr('file-type', fileType);
                    importInput.attr('file-extension', fileExtension);
                }
                reader.readAsText(file, 'utf-8');
            });

            $("#open-text-btn").bind('click',function(e){
                var fileType = importThumb.attr('file-type');
                var fileExtension = importInput.attr('file-extension');
                var dataStr = importThumb.text();
                if(fileType === "text/markdown" || fileExtension === "MD" 
                || fileExtension === "md" || fileExtension === "markdown") {
                    // 读取markdown文件，并将其转换为标准 json 格式
                    dataStr = renderMarkdownText(dataStr);
                }
                dataManager.startStorage();
                dataManager.save(dataStr);
                dataManager.stopStorage();
                location.reload();
            });
            $("#open-online-btn").bind('click',function(e){
                getFileList();
            });
        }
    };
});

requirejs(['editor', 'player','save','open'],function (editor, player, save, open) {
    editor.init();
    save.init();
    open.init();
    adjustCss();


});

// define("main",[], function(){});


// designList **
// transitionList **
// tplList **
// pageList **

// currentDesign **
// currentLayout **
// currentPage **
// currentLayout **
// currentItem **
// currentItemDataCopy *

// title **
// titleDisplay **
// editingTitle **

// clickTpl **
// clickDesign **
// clickPage **

// addPage **
// clonePage **
// removePage **
// nextPage **
// prevPage **
// moveUpPage **
// moveDownPage **

// editTitle **

// previewItem **
// previewAll **
// editItem **
// finishEdit *