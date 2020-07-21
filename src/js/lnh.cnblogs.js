"use strict";

(function (window, document, navigator, $) {

    var selectors = {
        body: document.body,
        home: "#home",
        horizontalProgress: '#horizontal-progress',
        postBody: "#cnblogs_post_body",
        postCategory: "#BlogPostCategory",
        postTagList: "#EntryTag",
        toc: "#lnh-toc",
        digg: "#div_digg",
        sideBar: "#sideBar",
        postDesc: "#topics .postDesc"
    };

    function isMobile() {
        return /.*Mobile.*/.test(navigator.userAgent);
    }

    function isPC() {
        return !isMobile();
    }

    function getViewportYAxis() {
        var viewportY1 = window.scrollY;
        var viewportHeight = document.documentElement.clientHeight;
        var viewportY2 = viewportY1 + viewportHeight;
        return {
            y1: viewportY1,
            y2: viewportY2
        };
    }

    function getWindowSize() {
        return {
            width: document.body.offsetWidth,
            height: document.body.offsetHeight,
        };
    }
    function addMobileCssUrl(href) {
        $(selectors.home).before('<link href="' + href + '" rel="stylesheet">');
    };

    function appendToolBarToBody() {
        var toolBar = [];
        toolBar.push('<div id="lnh-toolbar" class="lnh-toolbar">');
        if ($(selectors.postBody).length) {
            toolBar.push('<a class="fa fa-list" href="javascript:lnh.toggleToc();" title="目录"></a>');
            toolBar.push('<a class="fa fa-comments" href="#blog-comments-placeholder" title="评论列表"></a>');
            toolBar.push('<a class="fa fa-comment" href="#comment_form" title="写评论"></a>');
        }

        toolBar.push('<a class="fa fa-arrow-up" href="javascript:scroll(0,0);" title="返回顶部"></a>');
        toolBar.push('</div>');

        var toolBarHtml = toolBar.join('');

        $(selectors.body).append(toolBarHtml)
    }

    function moveDiggToSideBar() {
        var $sideBar = $(selectors.sideBar);
        if ($sideBar.find(selectors.digg).length) {
            return true;
        }

        var $digg = $(selectors.digg);
        if ($digg.length) {
            $sideBar.append($digg);
            return true;
        }
    }

    function copyPostInfoUnderBlogTitle() {
        var postDescHtml = $(selectors.postDesc).html();
        var categotyHtml = $(selectors.postCategory).html();
        var entryTagListHtml = $(selectors.postTagList).html();

        if (postDescHtml) {
            var html = '<div class="lnh-post-info">'
                + '<div class="post-desc">' + postDescHtml + '</div>'
                + '<div class="post-categoty">' + categotyHtml + '</div>'
                + '<div class="post-tags">' + entryTagListHtml + '</div>'
                + '</div>';
            $(html).insertBefore("#topics .postBody");
            return true;
        }
    }

    function foreachArticleHeader(action) {
        $(selectors.postBody).find(":header").each(action);
    }

    function appendArticleHeaderLocatorElement() {
        foreachArticleHeader(function (index, header) {
            if (!header.id) {
                header.id = "auto-id-" + index;
            }
            $(header).prepend('<i id="locator-' + header.id + '" class="lnh-article-header-locator"></i>');
        });
    }

    function getTocItemArray() {
        var tocItemArray = [];

        foreachArticleHeader(function (index, header) {
            tocItemArray.push({
                a: document.getElementById('toc-' + header.id),
                locator: document.getElementById('locator-' + header.id),
            });
        });

        return tocItemArray;
    }

    function buildTocItemHtmlArray() {
        var tocItemHtmlArray = [];
        foreachArticleHeader(function (index, header) {
            var tocItemAnchor = $(header);
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
            tocItemHtmlArray.push(tocItemHtml);
        });
        return tocItemHtmlArray;
    }

    function buildTocHtml() {
        var tocItemHtmlArray = buildTocItemHtmlArray();
        var tocHtmlArray = [];
        if (tocItemHtmlArray.length) {
            tocHtmlArray.push('<div id="lnh-toc" class="lnh-toc">');
            tocHtmlArray.push('<div class="items">');
            for (var i = 0; i < tocItemHtmlArray.length; i++) {
                tocHtmlArray.push(tocItemHtmlArray[i]);
            }
            tocHtmlArray.push('</div>');
            tocHtmlArray.push('</div>');
        }
        return tocHtmlArray.join('');
    }

    function appendTocToBody() {
        if ($(selectors.toc).length) {
            return;
        }
        var tocHtml = buildTocHtml();
        $(selectors.body).append(tocHtml);
    }

    function refreshBodyStyle() {
        var $body = $(selectors.body);
        var $toc = $(selectors.toc);
        if ($toc.hasClass('opened')) {
            var tocWidth = $toc.outerWidth();
            $body.css("margin-left", tocWidth + 'px');
        } else {
            $body.css("margin-left", '');
        }
    }

    function toggleToc() {
        $(selectors.toc).toggleClass('opened');
        refreshBodyStyle();
        refreshHorizontalProgressStyle();
    }

    function refreshSelectedTocStyle(tocItemArray) {
        var selectedTocItemArray = [];
        var viewportYAxis = getViewportYAxis();

        for (var i = 0; i < tocItemArray.length; i++) {
            var current = tocItemArray[i];
            var next = tocItemArray[i + 1];
            var locatorYAxis = {
                y1: current.locator.offsetTop,
                y2: (next && next.locator.offsetTop) || viewportYAxis.y2
            };
            if (inViewport(locatorYAxis, viewportYAxis)) {
                selectedTocItemArray.push(current);
            }
        }

        refreshSelectedTocItemArrayStyle(tocItemArray, selectedTocItemArray);
    }

    function inViewport(locatorYAxis, viewportYAxis) {
        if (locatorYAxis.y1 > viewportYAxis.y2) {
            return false;
        }
        return Math.max(locatorYAxis.y1, viewportYAxis.y1) < Math.min(locatorYAxis.y2, viewportYAxis.y2);
    }

    function refreshSelectedTocItemArrayStyle(tocItemArray, selectedTocItemArray) {
        tocItemArray.forEach(function (tocItem) {
            $(tocItem.a).removeClass('selected');
        });
        selectedTocItemArray.forEach(function (selectedTocItem) {
            $(selectedTocItem.a).addClass('selected');
        });
    }

    function appendHorizontalProgressToBody() {
        $(selectors.body).append('<div id="horizontal-progress" class="horizontal-progress"></div>');
    }

    function refreshHorizontalProgressStyle() {
        var viewportYAxis = getViewportYAxis();
        var windowSize = getWindowSize();
        var percentage = Math.min(1, Math.max(0, viewportYAxis.y2 / windowSize.height));
        $(selectors.horizontalProgress).css('width', (percentage * windowSize.width) + 'px');
    }

    function addOnScorllEvent() {
        var tocItemArray = getTocItemArray();
        $(window).scroll(function () {
            refreshSelectedTocStyle(tocItemArray);
            refreshHorizontalProgressStyle();
        });
        refreshHorizontalProgressStyle();
    }

    function run() {
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

    window.lnh = {
        isMobile: isMobile,
        isPC: isPC,
        addMobileCssUrl: addMobileCssUrl,
        appendTocToBody: appendTocToBody,
        appendToolBarToBody: appendToolBarToBody,
        appendHorizontalProgressToBody: appendHorizontalProgressToBody,
        toggleToc: toggleToc,
        moveDiggToSideBar: moveDiggToSideBar,
        copyPostInfoUnderBlogTitle: copyPostInfoUnderBlogTitle,
        appendArticleHeaderLocatorElement: appendArticleHeaderLocatorElement,
        addOnScorllEvent: addOnScorllEvent,
        run: run
    };

})(window, document, navigator, $);

lnh.appendHorizontalProgressToBody();
lnh.appendArticleHeaderLocatorElement();
lnh.appendTocToBody();
lnh.appendToolBarToBody();
lnh.addOnScorllEvent();

if (lnh.isMobile()) {
    lnh.addMobileCssUrl('//files.cnblogs.com/files/linianhui/lnh.cnblogs.mobile.css');
    lnh.run(lnh.copyPostInfoUnderBlogTitle);
} else {
    lnh.toggleToc();
    lnh.run(lnh.moveDiggToSideBar, lnh.copyPostInfoUnderBlogTitle);
}