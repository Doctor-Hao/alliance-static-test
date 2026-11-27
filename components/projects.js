(() => {
  const projects = [
    { id: 'office', city: 'Москва', name: 'Офисный комплекс', size: '3 500 м²', description: 'Монтаж вводных распределительных щитов и освещения.', image: 'project-office.webp', alt: 'Шкафы распределительного оборудования', x: 60.2, y: 46.8 },
    { id: 'factory', city: 'Апрелевка', name: 'Производственный цех', size: '5 000 м²', description: 'Электроснабжение цеха и монтаж системы оповещения.', image: 'project-factory.webp', alt: 'Производственный цех с монтажным подъёмником', x: 51.8, y: 62.4 },
    { id: 'warehouse', city: 'Подольск', name: 'Логистический центр', size: '4 200 м²', description: 'Проектирование и монтаж освещения и видеонаблюдения.', image: 'project-warehouse.webp', alt: 'Пожарное оборудование у стены склада', x: 57.5, y: 84.5 },
    { id: 'equipment', city: 'Руза', name: 'Инженерный узел', size: '1 200 м²', description: 'Подключение оборудования и проверка электроснабжения.', image: 'hero.webp', alt: 'Электрическое оборудование на открытой подстанции', x: 43.9, y: 55.8 },
  ];

  const section = document.querySelector('#projects');
  const mapImage = section.querySelector('.projects__map-art img');
  const pins = section.querySelector('.projects__pins');
  const pagination = section.querySelector('.projects__pagination');
  const zoom = section.querySelector('.projects__zoom');
  const map = section.querySelector('.projects__map');
  const city = section.querySelector('#project-city');
  const name = section.querySelector('#project-name');
  const size = section.querySelector('#project-size');
  const description = section.querySelector('#project-description');
  const picture = section.querySelector('#project-photo');
  const status = section.querySelector('#project-status');
  const defaultCard = {
    city: city.textContent,
    name: name.textContent,
    size: size.textContent,
    description: description.textContent,
    image: 'project-office.webp',
    alt: picture.alt,
  };

  const zoomOrigin = { x: 54, y: 64 };
  const zoomScale = 1.45;
  mapImage.style.transformOrigin = `${zoomOrigin.x}% ${zoomOrigin.y}%`;

  function select(id, announce = true) {
    const project = projects.find((entry) => entry.id === id) || defaultCard;
    city.textContent = project.city;
    name.textContent = project.name;
    size.textContent = project.size;
    description.textContent = project.description;
    picture.src = `assets/${project.image}`;
    picture.alt = project.alt;
    for (const button of section.querySelectorAll('[data-project]')) {
      button.setAttribute('aria-pressed', String(button.dataset.project === id));
    }
    if (announce) status.textContent = id ? `Выбран объект «${project.name}», ${project.city}.` : 'Показана область работы.';
  }

  function projectButton(label, id, className) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.dataset.project = id;
    button.setAttribute('aria-label', label);
    button.addEventListener('click', () => select(id));
    return button;
  }

  pagination.append(projectButton('Область работы', '', 'projects__dot'));
  const mapButtons = projects.map((project) => {
    const label = `${project.city}, ${project.name}`;
    const pin = projectButton(label, project.id, 'projects__pin');
    pin.title = label;
    pins.append(pin);
    pagination.append(projectButton(label, project.id, 'projects__dot'));
    return { project, pin };
  });

  function positionPins(scale) {
    for (const { project, pin } of mapButtons) {
      pin.style.left = `${zoomOrigin.x + (project.x - zoomOrigin.x) * scale}%`;
      pin.style.top = `${zoomOrigin.y + (project.y - zoomOrigin.y) * scale}%`;
    }
  }

  zoom.addEventListener('click', () => {
    const isCloser = zoom.getAttribute('aria-pressed') === 'false';
    const scale = isCloser ? zoomScale : 1;
    zoom.setAttribute('aria-pressed', String(isCloser));
    zoom.textContent = isCloser ? 'Показать всю область' : 'Приблизить карту';
    mapImage.style.transform = `scale(${scale})`;
    positionPins(scale);
  });

  for (const button of section.querySelectorAll('[data-show-project]')) {
    button.hidden = false;
    button.addEventListener('click', () => {
      const id = button.dataset.showProject;
      select(id);
      map.scrollIntoView({ block: 'start' });
      mapButtons.find(({ project }) => project.id === id).pin.focus({ preventScroll: true });
    });
  }

  section.querySelector('.projects__map-actions').hidden = false;
  pagination.hidden = false;
  select('', false);
  positionPins(1);
})();
