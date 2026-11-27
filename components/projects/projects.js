(() => {
  if (!window.Splide) return;

  const section = document.querySelector('#projects');
  const details = section.querySelector('.projects__details');
  const slides = Array.from(details.querySelectorAll('.projects__slide'));
  const mapImage = section.querySelector('.projects__map-art img');
  const pins = section.querySelector('.projects__pins');
  const zoom = section.querySelector('.projects__zoom');
  const map = section.querySelector('.projects__map');
  const status = section.querySelector('#project-status');
  const zoomOrigin = { x: 54, y: 64 };
  const zoomScale = 1.45;
  const mapButtons = [];
  mapImage.style.transformOrigin = `${zoomOrigin.x}% ${zoomOrigin.y}%`;

  const slider = new window.Splide(details, {
    type: 'loop',
    arrows: false,
    flickMaxPages: 0.5,
    live: false,
    i18n: {
      carousel: 'карусель',
      slide: 'слайд',
      select: 'Выбор объекта',
    },
  });
  slider.on('move', (index) => {
    for (const { pin, index: pinIndex } of mapButtons) {
      pin.setAttribute('aria-pressed', String(pinIndex === index));
    }
    const slide = slides[index];
    status.textContent = slide.dataset.project
      ? `Выбран объект. ${slide.getAttribute('aria-label')}.`
      : 'Показана область работы.';
  });
  slider.on('pagination:mounted', ({ items }) => {
    for (const { button, page } of items) {
      button.setAttribute('aria-label', slides[page].getAttribute('aria-label'));
    }
  });
  slider.mount();

  for (const [index, slide] of slides.entries()) {
    const { project, x, y } = slide.dataset;
    if (!project) continue;

    const label = slide.getAttribute('aria-label');
    const pin = document.createElement('button');
    pin.type = 'button';
    pin.className = 'projects__pin';
    pin.dataset.project = project;
    pin.title = label;
    pin.setAttribute('aria-label', label);
    pin.setAttribute('aria-pressed', 'false');
    pin.addEventListener('click', () => slider.go(index));
    pins.append(pin);
    mapButtons.push({ pin, index, x: Number(x), y: Number(y) });

    const cardButton = section.querySelector(`[data-show-project="${project}"]`);
    if (!cardButton) continue;

    cardButton.hidden = false;
    cardButton.addEventListener('click', () => {
      slider.go(index);
      map.scrollIntoView({ block: 'start' });
      pin.focus({ preventScroll: true });
    });
  }

  function positionPins(scale) {
    for (const { pin, x, y } of mapButtons) {
      pin.style.left = `${zoomOrigin.x + (x - zoomOrigin.x) * scale}%`;
      pin.style.top = `${zoomOrigin.y + (y - zoomOrigin.y) * scale}%`;
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
  positionPins(1);
})();
