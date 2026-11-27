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
  const buttons = Array.from(pagination.querySelectorAll('button'));
  const title = hero.querySelector('#hero-title');
  const description = hero.querySelector('#hero-description');
  const slides = {
    power: [title.innerHTML.split('<br>').map((line) => line.trim()).join('\n'), description.textContent],
    panels: ['Сборка щитового\nоборудования', 'Подбираем комплектующие, собираем щиты и проверяем оборудование перед установкой.'],
    supply: ['Электроснабжение\nпредприятий', 'Проектируем и монтируем сети на производственных, складских и коммерческих объектах.'],
    security: ['Системы\nбезопасности', 'Объединяем видеонаблюдение, контроль доступа и противопожарную защиту под задачи объекта.'],
  };

  pagination.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-hero-slide]');
    if (!button) return;
    const key = button.dataset.heroSlide;
    hero.dataset.hero = key;
    title.textContent = slides[key][0];
    description.textContent = slides[key][1];
    for (const control of buttons) control.setAttribute('aria-pressed', String(button === control));
  });
  pagination.hidden = false;
})();
