"use strict";

(function (window, document, navigator) {

    var element = {
        body: document.body,
        postBody: "cnblogs_post_body",
        postCategory: "BlogPostCategory",
        postTagList: "EntryTag",
        toc: "lnh-toc",
        digg: "div_digg",
        sideBar: "sideBar",
    };

    function isMobile() {
        return /.*Mobile.*/.test(navigator.userAgent);
    }

    function isPC() {
        return !isMobile();
    }

    function $id(id) {
        return $('#' + id);
    }

    function addMobileCss(href) {
        $id('home').before('<link href="' + href + '" rel="stylesheet">');
    };

    function appendToolBarToBody() {
        var toolBar = [];
        toolBar.push('<div id="lnh-toolbar" class="lnh-toolbar">');
        if ($id(element.postBody).length) {
            toolBar.push('<a class="fa fa-bars" href="javascript:lnh.toggleToc();" title="目录"></a>');
            toolBar.push('<a class="fa fa-comments" href="#comment_form_container" title="评论列表"></a>');
            toolBar.push('<a class="fa fa-pencil" href="#comment_form" title="写评论"></a>');
        }

        toolBar.push('<a class="fa fa-arrow-circle-up" href="javascript:scroll(0,0);" title="返回顶部"></a>');
        toolBar.push('</div>');

        var toolBarHtml = toolBar.join('');

        $(element.body).append(toolBarHtml)
    }

    function moveDigg() {
        var $sideBar = $id(element.sideBar);
        if ($sideBar.find(element.digg).length) {
            return true;
        }

        var $digg = $id(element.digg);
        if ($digg.length) {
            $sideBar.append($digg);
            return true;
        }
    }

    function copyCategoryAndTag() {
        var categotyHtml = $id(element.postCategory).html();
        var entryTagListHtml = $id(element.postTagList).html();

        if (categotyHtml) {
            var html = '<div class="lnh-post-categoty-tags">'
                + '<div class="post-categoty">' + categotyHtml + '</div>'
                + '<div class="post-tags">' + entryTagListHtml + '</div>'
                + '</div>';
            $(html).insertBefore("#topics .postBody");
            return true;
        }
    }

    function setAutoId() {
        $id(element.postBody).find(":header").each(function (index, header) {
            if (!header.id) {
                header.id = "auto-id-" + index;
            }
        });
    }


    function getTocItemArray() {
        var tocItemArray = [];

        $id(element.postBody).find(":header").each(function (index, header) {
            var $header = $(header);
            tocItemArray.push({
                anchor: $header
            });
        });

        return tocItemArray;
    }

    function buildTocHtml(tocItemArray) {
        var tocHtml = [];

        if (tocItemArray.length) {
            tocHtml.push('<div id="' + element.toc + '" class="lnh-toc">');
            tocHtml.push('<div class="items">');
            for (var i = 0; i < tocItemArray.length; i++) {
                var tocItem = tocItemArray[i];
                var tocItemAnchor = tocItem.anchor;
                var tocItemAnchorId = tocItemAnchor.attr('id');
                var tocItemAnchorTagName = tocItemAnchor.get(0).tagName.toLowerCase();
                var tocItemAnchorText = tocItemAnchor.text();
                var tocItemHtml = '<a'
                    + ' href="#' + tocItemAnchorId + '"'
                    + ' id="toc-' + tocItemAnchorId + '"'
                    + ' class="item item-' + tocItemAnchorTagName + '"'
                    + '>'
                    + tocItemAnchorText
                    + '</a>';

                tocHtml.push(tocItemHtml);
            }
            tocHtml.push('</div>');
            tocHtml.push('</div>');
        }

        return tocHtml.join('');
    }

    function appendTocToBody() {
        if ($id(element.toc).length) {
            return;
        }
        var tocItemArray = getTocItemArray();
        var tocHtml = buildTocHtml(tocItemArray);
        $(element.body).append(tocHtml);
    }

    function toggleToc() {
        $id(element.toc).toggleClass('opened');
        resetBodyStyle();
    }

    function resetBodyStyle() {
        var $body = $(element.body);
        var $toc = $id(element.toc);
        if ($toc.hasClass('opened')) {
            var tocWidth = $toc.outerWidth();
            $body.css("margin-left", tocWidth + 'px');
        } else {
            $body.css("margin-left", '');
        }
    }

    function selectedTocItem(tocItem) {
        var $selected = $("#toc-" + tocItem.anchor.attr("id"));
        if (!$selected.hasClass("selected")) {
            $id(element.toc).find(".item").removeClass("selected");
            $selected.addClass("selected");
        }
    }

    function watchWindowScrollCore(tocItemArray) {
        var scrollTop = $(window).scrollTop() + 80;
        for (var i = 0; i < tocItemArray.length; i++) {
            var current = tocItemArray[i];
            var next = tocItemArray[i + 1];
            if (scrollTop > current.anchor.offset().top) {
                if (next && (scrollTop >= next.anchor.offset().top)) {
                    continue;
                }
                selectedTocItem(current);
                break;
            }
        }
    }

    window.lnh = {
        isMobile: isMobile,
        isPC: isPC,
        addMobileCss: addMobileCss,
        appendTocToBody: appendTocToBody,
        appendToolBarToBody: appendToolBarToBody,
        toggleToc: toggleToc,
        moveDigg: moveDigg,
        copyCategoryAndTag: copyCategoryAndTag,
        setAutoId: setAutoId,
        watchWindowScroll: function () {
            var tocItemArray = getTocItemArray();
            $(window).scroll(function () {
                watchWindowScrollCore(tocItemArray);
            });
        },
        run: function () {
            var functionList = Array.prototype.slice.apply(arguments);

            var intervalCoreHandler = setInterval(intervalCore, 500);

            function intervalCore() {
                var length = functionList.length;
                for (var i = 0; i < length; i++) {
                    var functionHandler = functionList[i];
                    if (functionHandler) {
                        var result = functionHandler();
                        if (result) {
                            functionList.splice(i, 1);
                            i--;
                            length--;
                        }
                    }
                }
                if (functionList.length === 0) {
                    clearInterval(intervalCoreHandler);
                }
            };
        }
    };

})(window, document, navigator);

lnh.setAutoId();
lnh.appendTocToBody();
lnh.appendToolBarToBody();
lnh.watchWindowScroll();

if (lnh.isMobile()) {
    lnh.addMobileCss('//files.cnblogs.com/files/linianhui/lnh.cnblogs.mobile.css');
    lnh.run(lnh.copyCategoryAndTag);
} else {
    lnh.toggleToc();
    lnh.run(lnh.moveDigg, lnh.copyCategoryAndTag);
}