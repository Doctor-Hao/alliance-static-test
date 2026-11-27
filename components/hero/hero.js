(() => {
  const hero = document.querySelector('.hero');
  const menu = hero.querySelector('#main-menu');
  const toggle = hero.querySelector('.hero__menu-toggle');
  const narrow = window.matchMedia('(max-width: 700px)');

  function setMenu(open) {
    toggle.hidden = !narrow.matches;
    menu.hidden = narrow.matches && !open;
    toggle.setAttribute('aria-expanded', String(narrow.matches && open));
  }

  toggle.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  hero.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && narrow.matches && !menu.hidden) {
      setMenu(false);
      toggle.focus();
    }
  });
  narrow.addEventListener('change', () => setMenu(false));
  setMenu(false);

  if (!window.Splide) return;

  const slider = new window.Splide(hero.querySelector('.splide'), {
    type: 'fade',
    speed: 0,
    arrows: false,
    drag: false,
    i18n: {
      carousel: 'карусель',
      slide: 'слайд',
      select: 'Направления на первом экране',
    },
  });

  slider.on('active', ({ slide }) => {
    hero.dataset.hero = slide.dataset.hero;
  });
  slider.on('pagination:mounted', ({ items }) => {
    for (const { button, page } of items) {
      const { slide } = slider.Components.Slides.getAt(page);
      button.setAttribute('aria-label', slide.getAttribute('aria-label'));
    }
  });
  slider.mount();
})();
