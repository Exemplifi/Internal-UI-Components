(function () {
    var section = document.querySelector('.timeline-section');
    var content = document.querySelector('.timeline-section .timeline-content');
    var bar = document.querySelector('.index-progress-bar');
    var navWrap = document.querySelector('.timeline-navigation-wrapper');
    var navLinks = document.querySelectorAll('.timeline-range .timeline-range-item');
    var navScroll = document.querySelector('.timeline-items-wrapper');
    var liveRegion = document.getElementById('timeline-v1-announce');
    var reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    var lastSpyIdx = -1;
    var cachedLinkFracs = null;
    /** Nav tab becomes active this many px before the section reaches the reading line. */
    var NAV_ACTIVE_EARLY_PX = 120;
    /** Gap between sticky nav bottom and article top (px). */
    var NAV_ARTICLE_GAP_PX = 48;

    function removeSvgWhenRangeToEmpty() {
        document.querySelectorAll('.timeline-range-item').forEach(function (item) {
            var svg = item.querySelector('svg');
            if (!svg) return;
            var next = svg.nextElementSibling;
            if (
                next &&
                next.classList.contains('timeline-range-to') &&
                !next.textContent.trim()
            ) {
                svg.remove();
            }
        });
    }

    removeSvgWhenRangeToEmpty();

    function getNavLinkAccessibleName(link) {
        if (!link) return '';
        return link.textContent.replace(/\s+/g, ' ').trim();
    }

    function getArticleAnnouncementText(article) {
        if (!article) return '';
        var parts = [];
        var titleEl = article.querySelector('.timeline-title');
        var descEl = article.querySelector('.timeline-description');
        if (titleEl) {
            var titleText = titleEl.textContent.replace(/\s+/g, ' ').trim();
            if (titleText) parts.push(titleText);
        }
        if (descEl) {
            var paragraphs = descEl.querySelectorAll('p');
            if (paragraphs.length) {
                paragraphs.forEach(function (p) {
                    var text = p.textContent.replace(/\s+/g, ' ').trim();
                    if (text) parts.push(text);
                });
            } else {
                var bodyText = descEl.textContent.replace(/\s+/g, ' ').trim();
                if (bodyText) parts.push(bodyText);
            }
        }
        return parts.join('. ');
    }

    function announceTimelineArticle(article) {
        if (!article) return;
        var text = getArticleAnnouncementText(article);
        if (!text) return;

        if (!liveRegion && section) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'timeline-v1-announce';
            liveRegion.className = 'visually-hidden';
            liveRegion.setAttribute('role', 'status');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            section.insertBefore(liveRegion, section.firstChild);
        }
        if (!liveRegion) return;

        liveRegion.textContent = '';
        window.setTimeout(function () {
            liveRegion.textContent = text;
        }, 50);
    }

    function initTimelineAccessibility() {
        if (!content) return;
        var articles = content.querySelectorAll('article.timeline-item');
        articles.forEach(function (article) {
            var titleSpan = article.querySelector('.timeline-title span');
            var articleId = article.id;
            if (titleSpan && articleId && !titleSpan.id) {
                titleSpan.id = 'timeline-heading-' + articleId;
            }
            if (titleSpan && titleSpan.id) {
                article.setAttribute('aria-labelledby', titleSpan.id);
            }
            article.setAttribute('tabindex', '-1');
        });

        navLinks.forEach(function (link) {
            var article = getArticleForNavLink(link);
            var name = getNavLinkAccessibleName(link);
            if (name) link.setAttribute('aria-label', name);
            if (article && article.id) {
                link.setAttribute('aria-controls', article.id);
            }
        });
    }

    function focusArticleWithoutScroll(article) {
        if (!article || typeof article.focus !== 'function') return;
        article.focus({ preventScroll: true });
    }

    function afterScrollToArticle(callback) {
        if (reducedMotionMq.matches) {
            callback();
            return;
        }
        var done = false;
        function finish() {
            if (done) return;
            done = true;
            window.removeEventListener('scrollend', onScrollEnd);
            window.clearTimeout(fallbackTimer);
            callback();
        }
        function onScrollEnd() {
            finish();
        }
        var fallbackTimer;
        if ('onscrollend' in window) {
            fallbackTimer = window.setTimeout(finish, 900);
            window.addEventListener('scrollend', onScrollEnd, { once: true, passive: true });
        } else {
            fallbackTimer = window.setTimeout(finish, 500);
        }
    }

    /** Viewport Y of the line just below the sticky timeline nav (updates as layout/sticky state changes). */
    function getReadingLineViewportY() {
        if (!navWrap) return 96;
        return navWrap.getBoundingClientRect().bottom;
    }

    /** Where article tops should sit — nav bottom + gap. */
    function getArticleAnchorViewportY() {
        return getReadingLineViewportY() + NAV_ARTICLE_GAP_PX;
    }

    function getReadingLineDocumentY() {
        return window.scrollY + getReadingLineViewportY();
    }

    function syncNavArticleGapCss() {
        if (!content) return;
        content.style.setProperty('--nav-article-gap', NAV_ARTICLE_GAP_PX + 'px');
    }

    /** Dashed vertical line ends at bottom of last timeline item. */
    function updateTimelineLineHeight() {
        if (!content) return;
        var items = content.querySelectorAll('.timeline-item');
        if (!items.length) return;
        var last = items[items.length - 1];
        var totalHeight = content.offsetHeight;
        var h = totalHeight - last.offsetHeight;
        content.style.setProperty('--timeline-line-height', Math.max(0, h) + 'px');
    }

    var mobileNavMq = window.matchMedia('(max-width: 767px)');

    function centerActiveNavItem(link, instant) {
        if (!link || !navScroll) return;
        var behavior = instant ? 'auto' : 'smooth';

        if (mobileNavMq.matches) {
            link.scrollIntoView({
                inline: 'start',
                block: 'nearest',
                behavior: behavior
            });
            return;
        }

        var linkRect = link.getBoundingClientRect();
        var wrapRect = navScroll.getBoundingClientRect();
        var linkCenter = linkRect.left + linkRect.width / 2;
        var wrapCenter = wrapRect.left + wrapRect.width / 2;
        var delta = linkCenter - wrapCenter;
        var maxScroll = navScroll.scrollWidth - navScroll.clientWidth;
        var next = Math.max(0, Math.min(maxScroll, navScroll.scrollLeft + delta));
        navScroll.scrollTo({ left: next, behavior: behavior });
    }

    /**
     * Stable tab positions on the progress track (layout-based).
     * Not affected by horizontal nav scroll — avoids bar jumping when active changes.
     */
    function measureLinkCenterFracs(track) {
        cachedLinkFracs = [];
        if (!navScroll || !track || !navLinks.length) return;
        var trackRect = track.getBoundingClientRect();
        var trackW = trackRect.width;
        if (trackW <= 0) return;
        var container = navScroll.closest('.container');
        var cRect = container
            ? container.getBoundingClientRect()
            : navScroll.getBoundingClientRect();
        var contentWidth = navScroll.scrollWidth;
        if (contentWidth <= 0) return;
        var usableLeft = (cRect.left - trackRect.left) / trackW;
        var usableWidth = cRect.width / trackW;
        for (var j = 0; j < navLinks.length; j++) {
            var link = navLinks[j];
            var centerInContent = link.offsetLeft + link.offsetWidth / 2;
            var t = centerInContent / contentWidth;
            cachedLinkFracs.push(
                Math.max(0, Math.min(1, usableLeft + t * usableWidth))
            );
        }
    }

    function getLinkCenterFracs(track) {
        if (!cachedLinkFracs || cachedLinkFracs.length !== navLinks.length) {
            measureLinkCenterFracs(track);
        }
        return cachedLinkFracs || [];
    }

    function setBarToLinkFraction(widthFrac, track) {
        if (!bar || !track) return;
        var w = track.getBoundingClientRect().width;
        if (w <= 0) return;
        var px_16 = 32;
        var px = Math.max(0, Math.min(w, widthFrac * w));
        bar.style.width = px + px_16 + 'px';
    }

    function setBarFullWidth(track) {
        if (!bar || !track) return;
        bar.style.width = '100%';
        bar.style.maxWidth = '100%';
    }

    function getArticleForNavLink(link) {
        if (!link) return null;
        var href = link.getAttribute('href');
        if (!href || href.charAt(0) !== '#') return null;
        return document.getElementById(decodeURIComponent(href.slice(1)));
    }

    /** Active nav tab and its linked article (href → id) always stay in sync. */
    function setActiveFromNavLink(link, articles) {
        navLinks.forEach(function (item) {
            var isActive = item === link;
            item.classList.toggle('active', isActive);
            if (isActive) {
                item.setAttribute('aria-current', 'location');
            } else {
                item.removeAttribute('aria-current');
            }
        });
        for (var a = 0; a < articles.length; a++) {
            articles[a].classList.remove('active');
        }
        var article = getArticleForNavLink(link);
        if (article) {
            article.classList.add('active');
            article.removeAttribute('aria-hidden');
        }
    }

    function setActivetimelineIndex(activeIdx, articles) {
        var link = navLinks[activeIdx];
        if (link) setActiveFromNavLink(link, articles);
    }

    function updatetimelineNav() {
        if (!content) return;
        var articles = content.querySelectorAll('article.timeline-item');
        var n = articles.length;
        if (!n || !navLinks.length) return;

        var yLine = getReadingLineViewportY();
        var articleAnchorY = getArticleAnchorViewportY();
        var anchor = window.scrollY + articleAnchorY;
        var activeIdx = 0;
        var i;
        for (i = 0; i < n; i++) {
            var sectionTop = articles[i].getBoundingClientRect().top;
            if (sectionTop <= yLine + NAV_ACTIVE_EARLY_PX) activeIdx = i;
        }

        var lastNavIdx = navLinks.length - 1;
        var lastArticle = articles[n - 1];
        var lastArticleTopDoc =
            lastArticle.getBoundingClientRect().top + window.scrollY;
        if (anchor >= lastArticleTopDoc - NAV_ACTIVE_EARLY_PX) {
            activeIdx = Math.min(n - 1, lastNavIdx);
        }

        if (activeIdx >= lastNavIdx) activeIdx = lastNavIdx;

        setActivetimelineIndex(activeIdx, articles);

        if (bar) {
            var track = bar.parentElement;
            if (track) {
                var isLastActive =
                    activeIdx >= lastNavIdx ||
                    navLinks[lastNavIdx].classList.contains('active');

                if (isLastActive) {
                    setBarFullWidth(track);
                } else {
                    var cfs = getLinkCenterFracs(track);
                    var barIdx = Math.min(activeIdx, cfs.length - 2);
                    if (barIdx >= 0 && cfs.length > barIdx + 1) {
                        var t0 =
                            articles[barIdx].getBoundingClientRect().top +
                            window.scrollY;
                        var t1 =
                            articles[barIdx + 1].getBoundingClientRect().top +
                            window.scrollY;
                        var span = t1 - t0;
                        var u = span > 0 ? (anchor - t0) / span : 0;
                        u = Math.min(1, Math.max(0, u));
                        var widthFrac =
                            cfs[barIdx] + u * (cfs[barIdx + 1] - cfs[barIdx]);
                        setBarToLinkFraction(widthFrac, track);
                    }
                }
            }
        }

        if (activeIdx !== lastSpyIdx && navLinks[activeIdx]) {
            lastSpyIdx = activeIdx;
            centerActiveNavItem(navLinks[activeIdx], false);
        }
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = link.getAttribute('href');
            if (!href || href.charAt(0) !== '#') return;
            var id = decodeURIComponent(href.slice(1));
            var target = document.getElementById(id);
            if (!target) return;
            e.preventDefault();
            var articles = content.querySelectorAll('article.timeline-item');
            var clickIdx = Array.prototype.indexOf.call(navLinks, link);
            if (clickIdx < 0) clickIdx = 0;
            lastSpyIdx = clickIdx;
            setActiveFromNavLink(link, articles);
            centerActiveNavItem(link, false);
            if (clickIdx >= navLinks.length - 1 && bar) {
                var track = bar.parentElement;
                if (track) setBarFullWidth(track);
            }
            announceTimelineArticle(target);
            var articleAnchorY = getArticleAnchorViewportY();
            var top =
                target.getBoundingClientRect().top +
                window.scrollY -
                articleAnchorY;
            var scrollBehavior = reducedMotionMq.matches ? 'auto' : 'smooth';
            window.scrollTo({ top: Math.max(0, top), behavior: scrollBehavior });
            afterScrollToArticle(function () {
                focusArticleWithoutScroll(target);
            });
        });
    });

    initTimelineAccessibility();

    window.addEventListener('scroll', updatetimelineNav, { passive: true });
    window.addEventListener('resize', function () {
        cachedLinkFracs = null;
        syncNavArticleGapCss();
        updatetimelineNav();
        updateTimelineLineHeight();
        var activeEl = document.querySelector('.timeline-range .timeline-range-item.active');
        if (activeEl) {
            centerActiveNavItem(activeEl, true);
            lastSpyIdx = Array.prototype.indexOf.call(navLinks, activeEl);
        }
    });

    if (content && typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(updateTimelineLineHeight).observe(content);
    }

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
            cachedLinkFracs = null;
            lastSpyIdx = -1;
            updatetimelineNav();
            updateTimelineLineHeight();
        });
    }

    syncNavArticleGapCss();

    requestAnimationFrame(function () {
        cachedLinkFracs = null;
        lastSpyIdx = -1;
        syncNavArticleGapCss();
        updatetimelineNav();
        updateTimelineLineHeight();
        requestAnimationFrame(function () {
            cachedLinkFracs = null;
            updatetimelineNav();
            updateTimelineLineHeight();
        });
    });
})();