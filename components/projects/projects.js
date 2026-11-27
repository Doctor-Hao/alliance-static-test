(() => {
  const projects = [
    {
      id: 'office',
      city: 'Москва',
      name: 'Офисный комплекс',
      size: '3 500 м²',
      description: 'Монтаж вводных распределительных щитов и освещения.',
      image: 'assets/images/project-office.webp',
      alt: 'Шкафы распределительного оборудования',
      x: 60.2,
      y: 46.8,
    },
    {
      id: 'factory',
      city: 'Апрелевка',
      name: 'Производственный цех',
      size: '5 000 м²',
      description: 'Электроснабжение цеха и монтаж системы оповещения.',
      image: 'assets/images/project-factory.webp',
      alt: 'Производственный цех с монтажным подъёмником',
      x: 51.8,
      y: 62.4,
    },
    {
      id: 'warehouse',
      city: 'Подольск',
      name: 'Логистический центр',
      size: '4 200 м²',
      description: 'Проектирование и монтаж освещения и видеонаблюдения.',
      image: 'assets/images/project-warehouse.webp',
      alt: 'Пожарное оборудование у стены склада',
      x: 57.5,
      y: 84.5,
    },
    {
      id: 'equipment',
      city: 'Руза',
      name: 'Инженерный узел',
      size: '1 200 м²',
      description: 'Подключение оборудования и проверка электроснабжения.',
      image: 'assets/images/hero.webp',
      alt: 'Электрическое оборудование на открытой подстанции',
      x: 43.9,
      y: 55.8,
    },
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
  const area = {
    id: '',
    city: city.textContent,
    name: name.textContent,
    size: size.textContent,
    description: description.textContent,
    image: picture.getAttribute('src'),
    alt: picture.alt,
  };

  const zoomOrigin = { x: 54, y: 64 };
  const zoomScale = 1.45;
  const projectControls = [];
  const mapButtons = [];
  mapImage.style.transformOrigin = `${zoomOrigin.x}% ${zoomOrigin.y}%`;

  function selectProject(project) {
    city.textContent = project.city;
    name.textContent = project.name;
    size.textContent = project.size;
    description.textContent = project.description;
    picture.src = project.image;
    picture.alt = project.alt;

    for (const button of projectControls) {
      button.setAttribute('aria-pressed', String(button.dataset.project === project.id));
    }

    status.textContent = project.id
      ? `Выбран объект «${project.name}», ${project.city}.`
      : 'Показана область работы.';
  }

  function projectButton(project, label, className) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.dataset.project = project.id;
    button.setAttribute('aria-label', label);
    button.setAttribute('aria-pressed', String(project === area));
    button.addEventListener('click', () => selectProject(project));
    projectControls.push(button);
    return button;
  }

  pagination.append(projectButton(area, 'Область работы', 'projects__dot'));

  for (const project of projects) {
    const label = `${project.city}, ${project.name}`;
    const pin = projectButton(project, label, 'projects__pin');
    pin.title = label;
    pins.append(pin);
    pagination.append(projectButton(project, label, 'projects__dot'));
    mapButtons.push({ project, pin });

    const cardButton = section.querySelector(`[data-show-project="${project.id}"]`);
    if (!cardButton) continue;

    cardButton.hidden = false;
    cardButton.addEventListener('click', () => {
      selectProject(project);
      map.scrollIntoView({ block: 'start' });
      pin.focus({ preventScroll: true });
    });
  }

  function positionPins(scale) {
    for (const { project, pin } of mapButtons) {
      const x = zoomOrigin.x + (project.x - zoomOrigin.x) * scale;
      const y = zoomOrigin.y + (project.y - zoomOrigin.y) * scale;
      pin.style.left = `${x}%`;
      pin.style.top = `${y}%`;
    }
  }

  zoom.addEventListener('click', () => {
    const isZoomed = zoom.getAttribute('aria-pressed') === 'false';
    const scale = isZoomed ? zoomScale : 1;
    zoom.setAttribute('aria-pressed', String(isZoomed));
    zoom.textContent = isZoomed ? 'Показать всю область' : 'Приблизить карту';
    mapImage.style.transform = `scale(${scale})`;
    positionPins(scale);
  });

  section.querySelector('.projects__map-actions').hidden = false;
  pagination.hidden = false;
  positionPins(1);
})();
