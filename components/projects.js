(() => {
  const projects = [
    { id: 'office', city: 'Химки', name: 'Офисный комплекс', size: '3 500 м²', description: 'Монтаж вводных распределительных щитов и освещения.', image: 'switchgear.webp', alt: 'Шкафы распределительного оборудования', lng: 37.44, lat: 55.9 },
    { id: 'factory', city: 'Электросталь', name: 'Производственный цех', size: '5 000 м²', description: 'Электроснабжение цеха и монтаж системы оповещения.', image: 'factory.webp', alt: 'Внутреннее пространство производственного цеха', lng: 38.44, lat: 55.79 },
    { id: 'warehouse', city: 'Подольск', name: 'Логистический центр', size: '4 200 м²', description: 'Проектирование и монтаж освещения и видеонаблюдения.', image: 'warehouse.webp', alt: 'Стеллажи в глубине склада', lng: 37.55, lat: 55.43 },
    { id: 'equipment', city: 'Руза', name: 'Инженерный узел', size: '1 200 м²', description: 'Подключение оборудования и проверка электроснабжения.', image: 'hero.webp', alt: 'Электрическое оборудование на открытой подстанции', lng: 36.19, lat: 55.7 },
  ];

  const section = document.querySelector('#projects');
  const canvas = section.querySelector('.projects__canvas');
  const context = canvas.getContext('2d');
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
    image: 'switchgear.webp',
    alt: picture.alt,
  };

  const regionalBounds = [34.3, 40.8, 54.17, 57.36];
  const cityBounds = [35.85, 38.75, 55.13, 56.27];
  let bounds = regionalBounds;

  function point(longitude, latitude) {
    const [west, east, south, north] = bounds;
    return [(longitude - west) / (east - west), (north - latitude) / (north - south)];
  }

  function drawRegion(region) {
    context.beginPath();
    for (const polygon of region.polygons) {
      for (const ring of polygon) {
        for (const [index, [longitude, latitude]] of ring.entries()) {
          const [x, y] = point(longitude, latitude);
          if (index === 0) context.moveTo(x * canvas.width, y * canvas.height);
          else context.lineTo(x * canvas.width, y * canvas.height);
        }
        context.closePath();
      }
    }
    const fills = { 'RU-MOW': '#939a95', 'RU-MOS': '#b8bfba' };
    context.fillStyle = fills[region.code] || '#d9dbd9';
    context.fill('evenodd');
    context.strokeStyle = '#f1f1f1';
    context.lineWidth = 1.05;
    context.stroke();
  }

  function drawMap() {
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const region of allianceRegions) drawRegion(region);
  }

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

  function positionPins() {
    for (const { project, pin } of mapButtons) {
      const [x, y] = point(project.lng, project.lat);
      pin.style.left = `${x * 100}%`;
      pin.style.top = `${y * 100}%`;
    }
  }

  zoom.addEventListener('click', () => {
    bounds = bounds === regionalBounds ? cityBounds : regionalBounds;
    const isCloser = bounds === cityBounds;
    zoom.setAttribute('aria-pressed', String(isCloser));
    zoom.textContent = isCloser ? 'Показать всю область' : 'Приблизить карту';
    positionPins();
    drawMap();
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
  positionPins();
  drawMap();
})();
