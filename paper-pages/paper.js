// Copied from the blog (dl-m9/blog assets/post.js) so project pages behave like posts.
// Theme toggle, reading progress, table of contents and reading time.
(function () {
    const root = document.documentElement;

    // Theme: follow the system until the reader picks one.
    function storedTheme() {
        try { return localStorage.getItem('blog-theme'); } catch (e) { return null; }
    }
    function systemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    root.dataset.theme = storedTheme() || systemTheme();

    document.addEventListener('DOMContentLoaded', function () {
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', function () {
                const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
                root.dataset.theme = next;
                try { localStorage.setItem('blog-theme', next); } catch (e) { /* private mode */ }
            });
        }

        const body = document.querySelector('.post-body');
        if (!body) return;

        // Reading time: CJK characters and Latin words are counted separately.
        const timeSlot = document.querySelector('[data-reading-time]');
        if (timeSlot) {
            const text = body.textContent;
            const cjk = (text.match(/[一-鿿]/g) || []).length;
            const words = (text.replace(/[一-鿿]/g, ' ').match(/[A-Za-z0-9]+/g) || []).length;
            const minutes = Math.max(1, Math.round(cjk / 400 + words / 220));
            timeSlot.textContent = minutes + ' min read';
        }

        // Nested, scroll-driven TOC is the default. Add data-toc-flat to .post-body for a flat list.
        const autoCollapse = !body.hasAttribute('data-toc-flat');
        const headings = Array.from(body.querySelectorAll(autoCollapse ? 'h2, h3, h4' : 'h2, h3'));
        const desktopTOC = window.matchMedia('(min-width: 1100px)');
        const tocTrees = [];
        const tocTargets = document.querySelectorAll('[data-toc]');
        const used = {};
        headings.forEach(function (h, i) {
            if (!h.id) {
                let id = h.textContent.trim().toLowerCase().replace(/[^\w一-鿿]+/g, '-').replace(/^-|-$/g, '') || 'section-' + (i + 1);
                if (used[id]) id += '-' + (i + 1);
                h.id = id;
            }
            used[h.id] = true;
        });

        const links = [];
        tocTargets.forEach(function (target) {
            if (headings.length < 2) {
                const box = target.closest('.toc, .toc-inline');
                if (box) box.hidden = true;
                return;
            }
            const items = new Map();
            const stack = [];
            if (autoCollapse) {
                target.closest('.toc, .toc-inline').classList.add('toc-nested');
                target.dataset.tocTree = '';
            }
            headings.forEach(function (h) {
                const level = Number(h.tagName.slice(1));
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#' + h.id;
                a.textContent = h.textContent;
                li.appendChild(a);
                if (autoCollapse) {
                    while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
                    const parent = stack[stack.length - 1];
                    let list = target;
                    if (parent) {
                        if (!parent.children) {
                            parent.children = document.createElement('ol');
                            parent.children.className = 'toc-children';
                            parent.li.appendChild(parent.children);
                        }
                        list = parent.children;
                    }
                    list.appendChild(li);
                    const item = { level: level, li: li, children: null, link: a };
                    items.set(h.id, item);
                    stack.push(item);
                } else {
                    if (h.tagName === 'H3') li.className = 'sub';
                    target.appendChild(li);
                }
                links.push(a);
            });
            if (autoCollapse) {
                tocTrees.push(items);
                target.addEventListener('click', function (event) {
                    if (!event.target.closest('a')) return;
                    const details = target.closest('details');
                    if (details) details.open = false;
                });
            }
        });

        // Progress bar and the current section in the table of contents.
        const bar = document.querySelector('.progress');
        let ticking = false;
        let previousHeading;
        let previousDesktop;
        function update() {
            ticking = false;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            if (bar) bar.style.width = (max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0) + '%';

            let current = null;
            // Match anchor landing positions below the sticky header.
            const offset = autoCollapse ? (parseFloat(getComputedStyle(root).scrollPaddingTop) || 76) + 2 : 120;
            for (const h of headings) {
                if (h.getBoundingClientRect().top <= offset) current = h; else break;
            }
            links.forEach(function (a) {
                if (current && a.getAttribute('href') === '#' + current.id) a.setAttribute('aria-current', 'true');
                else a.removeAttribute('aria-current');
            });
            if (autoCollapse && (current !== previousHeading || desktopTOC.matches !== previousDesktop)) {
                tocTrees.forEach(function (items) {
                    const active = current && items.get(current.id);
                    items.forEach(function (item) {
                        if (!item.children) return;
                        const expanded = !desktopTOC.matches || Boolean(active && item.li.contains(active.li));
                        item.children.hidden = !expanded;
                        item.link.setAttribute('aria-expanded', String(expanded));
                    });
                });
                previousHeading = current;
                previousDesktop = desktopTOC.matches;
            }
        }
        window.addEventListener('scroll', function () {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
        window.addEventListener('resize', update);
        if (autoCollapse) {
            desktopTOC.addEventListener('change', update);
            window.addEventListener('hashchange', update);
            window.addEventListener('load', update, { once: true });
            if (document.fonts) document.fonts.ready.then(update);
        }
        update();

        // Previous and next posts, from posts.json. Only posts hosted in this blog are linked, not homepage pages (../).
        const nav = document.querySelector('.post-nav');
        const base = nav && nav.dataset.base;
        if (nav && base) {
            fetch(base + 'posts.json').then(function (r) { return r.json(); }).then(function (posts) {
                const local = posts.filter(function (p) { return !/^(https?:|\.\.\/)/.test(p.link); });
                const here = new URL('.', window.location.href).pathname;
                const index = local.findIndex(function (p) {
                    return new URL(base + p.link, window.location.href).pathname === here;
                });
                if (index === -1) return;
                // posts.json is newest first, so the next post in time is the one before.
                [['next', local[index - 1], 'Newer'], ['prev', local[index + 1], 'Older']].forEach(function (item) {
                    if (!item[1]) return;
                    const a = document.createElement('a');
                    a.className = item[0];
                    a.href = base + item[1].link;
                    const label = document.createElement('span');
                    label.className = 'label';
                    label.textContent = item[2];
                    a.appendChild(label);
                    a.appendChild(document.createTextNode(item[1].title));
                    if (item[0] === 'prev') nav.prepend(a); else nav.appendChild(a);
                });
            }).catch(function () { /* the links are optional */ });
        }
    });
})();
