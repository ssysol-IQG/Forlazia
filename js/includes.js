async function fetchInclude(path) {
    const response = await fetch(path);

    if (!response.ok) {
        throw new Error(`Unable to load ${path}: ${response.status}`);
    }

    return response.text();
}

async function loadIncludes() {
    try {
        const headerPlaceholder = document.getElementById('header-placeholder');
        const footerPlaceholder = document.getElementById('footer-placeholder');

        const requests = [];

        if (headerPlaceholder) {
            requests.push(
                fetchInclude('/partials/header.html').then((markup) => {
                    headerPlaceholder.innerHTML = markup;
                })
            );
        }

        if (footerPlaceholder) {
            requests.push(
                fetchInclude('/partials/footer.html').then((markup) => {
                    footerPlaceholder.innerHTML = markup;
                })
            );
        }

        await Promise.all(requests);

        initializeNavigation();
        initializeCurrentPage();
        initializeHeaderScroll();
        initializeCopyrightYear();
    } catch (error) {
        console.error('Iron Quill Games site include error:', error);
    }
}

function initializeNavigation() {
    const navToggle = document.querySelector('[data-nav-toggle]');
    const navMenu = document.querySelector('[data-nav-menu]');

    if (!navToggle || !navMenu) return;

    const closeNavigation = () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation');
        navMenu.classList.remove('is-open');
    };

    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        const nextState = !isExpanded;

        navToggle.setAttribute('aria-expanded', String(nextState));
        navToggle.setAttribute('aria-label', nextState ? 'Close navigation' : 'Open navigation');
        navMenu.classList.toggle('is-open', nextState);
    });

    navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeNavigation);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
            closeNavigation();
            navToggle.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            closeNavigation();
        }
    });
}

function initializeCurrentPage() {
    const currentPage = document.body.dataset.page;

    if (!currentPage) return;

    const navLink = document.querySelector(`[data-nav="${currentPage}"]`);

    if (navLink) {
        navLink.setAttribute('aria-current', 'page');
    }
}

function initializeHeaderScroll() {
    const header = document.querySelector('[data-header]');

    if (!header) return;

    const setHeaderState = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
    };

    setHeaderState();
    window.addEventListener('scroll', setHeaderState, { passive: true });
}

function initializeCopyrightYear() {
    document.querySelectorAll('[data-year]').forEach((element) => {
        element.textContent = new Date().getFullYear();
    });
}

function startIncludes() {
    loadIncludes();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startIncludes, { once: true });
} else {
    startIncludes();
}
