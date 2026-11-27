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

  const pagination = hero.querySelector('.hero__pagination');
  const buttons = pagination.querySelectorAll('button[data-hero-slide]');
  const title = hero.querySelector('#hero-title');
  const description = hero.querySelector('#hero-description');
  const slides = {
    power: {
      title: title.textContent,
      description: description.textContent,
    },
    panels: {
      title: 'Сборка щитового\nоборудования',
      description: 'Подбираем комплектующие, собираем щиты и проверяем оборудование перед установкой.',
    },
    supply: {
      title: 'Электроснабжение\nпредприятий',
      description: 'Проектируем и монтируем сети на производственных, складских и коммерческих объектах.',
    },
    security: {
      title: 'Системы\nбезопасности',
      description: 'Объединяем видеонаблюдение, контроль доступа и противопожарную защиту под задачи объекта.',
    },
  };

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const slideId = button.dataset.heroSlide;
      const slide = slides[slideId];

      hero.dataset.hero = slideId;
      title.textContent = slide.title;
      description.textContent = slide.description;

      for (const control of buttons) {
        control.setAttribute('aria-pressed', String(control === button));
      }
    });
  }
  pagination.hidden = false;
})();
