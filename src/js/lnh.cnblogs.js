"use strict";

(function (window, document, navigator) {

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

    function trySetBlogHeaderId() {
        $(selectors.postBody).find(":header").each(function (index, h) {
            if (!h.id) {
                h.id = "auto-id-" + index;
            }
        });
    }


    function getTocItemArray() {
        var tocItemArray = [];

        $(selectors.postBody).find(":header").each(function (index, header) {
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
            tocHtml.push('<div id="lnh-toc" class="lnh-toc">');
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
        if ($(selectors.toc).length) {
            return;
        }
        var tocItemArray = getTocItemArray();
        var tocHtml = buildTocHtml(tocItemArray);
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

    function refreshSelectedTocItemStyle(tocItem) {
        var $selected = $("#toc-" + tocItem.anchor.attr("id"));
        if (!$selected.hasClass("selected")) {
            $(selectors.toc).find(".item").removeClass("selected");
            $selected.addClass("selected");
        }
    }

    function refreshSelectedTocStyle(tocItemArray) {
        var scrollTop = $(window).scrollTop() + 80;
        for (var i = 0; i < tocItemArray.length; i++) {
            var current = tocItemArray[i];
            var next = tocItemArray[i + 1];
            if (scrollTop > current.anchor.offset().top) {
                if (next && (scrollTop >= next.anchor.offset().top)) {
                    continue;
                }
                refreshSelectedTocItemStyle(current);
                break;
            }
        }
    }

    function appendHorizontalProgressToBody() {
        $(selectors.body).append('<div id="horizontal-progress" class="horizontal-progress"></div>');
    }

    function refreshHorizontalProgressStyle() {
        var progress = (document.documentElement.clientHeight + window.scrollY)
            / document.body.offsetHeight
            * 100;

        if (progress < 0) {
            progress = 0;
        }

        if (progress > 100) {
            progress = 100;
        }

        $(selectors.horizontalProgress).css('width', progress + '%');
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
        trySetBlogHeaderId: trySetBlogHeaderId,
        addOnScorllEvent: addOnScorllEvent,
        run: run
    };

})(window, document, navigator);

lnh.trySetBlogHeaderId();
lnh.appendHorizontalProgressToBody();
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