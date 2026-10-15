/* Navigation enhancement only. Course engines retain their data and event handlers. */
(() => {
  'use strict';
  function initialize() {
    const sidebar = document.querySelector('.app-sidebar, .sidebar');
    const main = document.querySelector('main');
    const header = document.querySelector('.app-header, .lesson-topbar');
    if (!sidebar || !main || !header) return;
    if (!main.id) main.id = 'lesson-content';
    if (!sidebar.id) sidebar.id = 'lesson-navigation';
    const skip = document.createElement('a');
    skip.className = 'learning-skip';
    skip.href = '#' + main.id;
    skip.textContent = 'Langsung ke materi';
    document.body.prepend(skip);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'lesson-menu-button';
    button.textContent = '☰ Materi';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', sidebar.id);
    header.append(button);
    const close = document.createElement('button');
    close.className = 'lesson-menu-close';
    close.type = 'button';
    close.textContent = 'Tutup daftar materi ×';
    sidebar.prepend(close);
    const backdrop = document.createElement('button');
    backdrop.type = 'button';
    backdrop.className = 'lesson-backdrop';
    backdrop.tabIndex = -1;
    backdrop.setAttribute('aria-label', 'Tutup daftar materi');
    document.body.append(backdrop);
    const mobile = matchMedia('(max-width: 992px)');
    function setMenu(open, restore = true) {
      document.body.classList.toggle('lesson-menu-open', open);
      button.setAttribute('aria-expanded', String(open));
      sidebar.inert = mobile.matches && !open;
      if (mobile.matches) {
        main.inert = open;
        header.inert = open;
      } else {
        main.inert = false;
        header.inert = false;
      }
      if (open) close.focus();
      else if (restore && mobile.matches) button.focus();
    }
    button.addEventListener('click', () => setMenu(true));
    close.addEventListener('click', () => setMenu(false));
    backdrop.addEventListener('click', () => setMenu(false));
    mobile.addEventListener('change', () => setMenu(false, false));
    sidebar.addEventListener('click', event => {
      if (mobile.matches && event.target.closest('.chapter-item, .chapter-card, .item-modul, .sidebar-exam-btn, .cta-btn')) setMenu(false);
    });
    document.addEventListener('keydown', event => {
      if (!document.body.classList.contains('lesson-menu-open')) return;
      if (event.key === 'Escape') setMenu(false);
      if (event.key === 'Tab') {
        const items = [...sidebar.querySelectorAll('a, button, input, [tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length);
        const first = items[0], last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    });
    function enhanceList() {
      sidebar.querySelectorAll('.chapter-item, .chapter-card, .item-modul').forEach(item => {
        if (!item.matches('a, button')) { item.tabIndex = 0; item.setAttribute('role', 'button'); }
        item.setAttribute('aria-current', item.matches('.active, .aktif') ? 'step' : 'false');
      });
    }
    sidebar.addEventListener('keydown', event => {
      const item = event.target.closest('.chapter-item, .chapter-card, .item-modul');
      if (item && !item.matches('a, button') && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault(); item.click();
      }
    });
    new MutationObserver(enhanceList).observe(sidebar, {childList: true, subtree: true});
    enhanceList();
    const initialCount = sidebar.querySelectorAll('.chapter-item, .chapter-card, .item-modul').length;
    if (initialCount) {
      const sidebarCount = document.getElementById('chapterCountSidebar');
      if (sidebarCount) sidebarCount.textContent = initialCount + ' modul';
      const brandCount = document.getElementById('chapterCountBadge');
      if (brandCount) brandCount.textContent = brandCount.textContent.replace(/^\d+\+?/, String(initialCount));
    }
    const tabBar = document.querySelector('.tabs-nav');
    if (tabBar) {
      const tabs = [...tabBar.querySelectorAll('.tab-btn[data-tab]')];
      const labels = {theory:'Materi', video:'Video', playground:'Praktik', lab:'Lab praktik', pitfall:'Kesalahan umum', quiz:'Kuis', hardquiz:'Tantangan', notes:'Catatan'};
      tabBar.setAttribute('role', 'tablist');
      tabBar.setAttribute('aria-label', 'Aktivitas belajar');
      tabs.forEach(tab => {
        const key = tab.dataset.tab;
        if (labels[key]) tab.textContent = labels[key];
        tab.id = tab.id || 'lesson-tab-' + key;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', 'tab-' + key);
        const panel = document.getElementById('tab-' + key);
        if (panel) {
          panel.setAttribute('role', 'tabpanel');
          panel.setAttribute('aria-labelledby', tab.id);
        }
      });
      const syncTabs = () => tabs.forEach(tab => {
        const active = tab.classList.contains('active');
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      const tabObserver = new MutationObserver(syncTabs);
      tabs.forEach(tab => tabObserver.observe(tab, {attributes:true, attributeFilter:['class']}));
      syncTabs();
      tabBar.addEventListener('keydown', event => {
        if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
        event.preventDefault();
        event.stopPropagation();
        const index = tabs.indexOf(document.activeElement);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 :
          (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        tabs[next].click();
        tabs[next].focus();
      });
    }
    document.querySelectorAll('input[type="text"], input[type="search"]').forEach(input => {
      if (!input.labels?.length && !input.hasAttribute('aria-label')) input.setAttribute('aria-label', input.placeholder || 'Cari materi');
    });
    document.querySelectorAll('.editor-textarea').forEach(editor => {
      editor.spellcheck = false;
      editor.setAttribute('autocapitalize', 'off');
      editor.setAttribute('autocorrect', 'off');
    });
    new ResizeObserver(() => {
      document.documentElement.style.setProperty('--lesson-header-height', header.offsetHeight + 'px');
    }).observe(header);
    const chapterTitle = document.getElementById('chapterTitle');
    if (chapterTitle) {
      let previousTitle = chapterTitle.textContent;
      new MutationObserver(() => {
        if (chapterTitle.textContent === previousTitle) return;
        previousTitle = chapterTitle.textContent;
        window.scrollTo({top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
      }).observe(chapterTitle, {childList:true, characterData:true, subtree:true});
    }
    const folder = decodeURIComponent(location.pathname.split('/').at(-2) || '');
    try { localStorage.setItem('kodeloka-kelas-terakhir', folder); } catch {}
    setMenu(false, false);
    // Article pages link back with #modul-N: open that module once the course engine has drawn its list.
    const wanted = /^#modul-(\d+)$/.exec(location.hash);
    if (wanted) {
      let tries = 0;
      const open = () => {
        const item = sidebar.querySelectorAll('.chapter-item, .chapter-card, .item-modul')[Number(wanted[1]) - 1];
        if (item) item.click();
        else if (++tries < 20) setTimeout(open, 100);
      };
      setTimeout(open, 0);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
  else initialize();
})();
