(() => {
  if (!window.Splide) return;

  const section = document.querySelector('#projects');
  const details = section.querySelector('.projects__details');
  const slides = Array.from(details.querySelectorAll('.projects__slide'));
  const pins = section.querySelector('.projects__pins');
  const map = section.querySelector('.projects__map');
  const status = section.querySelector('#project-status');
  const mapButtons = [];

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
    pin.style.left = `${x}%`;
    pin.style.top = `${y}%`;
    pin.addEventListener('click', () => slider.go(index));
    pins.append(pin);
    mapButtons.push({ pin, index });

    const cardButton = section.querySelector(`[data-show-project="${project}"]`);
    if (!cardButton) continue;

    cardButton.hidden = false;
    cardButton.addEventListener('click', () => {
      slider.go(index);
      map.scrollIntoView({ block: 'start' });
      pin.focus({ preventScroll: true });
    });
  }

  if (!window.Panzoom) return;

  const mapArt = map.querySelector('.projects__map-art');
  const zoom = map.querySelector('.projects__zoom');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const panzoom = window.Panzoom(mapArt, {
    minScale: 1,
    maxScale: 2.5,
    contain: 'outside',
    panOnlyWhenZoomed: true,
    touchAction: '',
    excludeClass: 'projects__pin',
    overflow: 'clip',
    cursor: '',
  });

  mapArt.addEventListener('panzoomchange', ({ detail: { scale } }) => {
    const isZoomed = scale > 1.001;
    const pressed = String(isZoomed);
    if (zoom.getAttribute('aria-pressed') === pressed) return;
    map.classList.toggle('projects__map--zoomed', isZoomed);
    zoom.setAttribute('aria-pressed', pressed);
    zoom.textContent = isZoomed ? 'Показать всю область' : 'Приблизить карту';
  });

  zoom.addEventListener('click', () => {
    const animate = !reducedMotion.matches;
    if (panzoom.getScale() > 1.001) {
      panzoom.reset({ animate });
      return;
    }

    const scale = 1.45;
    const origin = { x: 0.54, y: 0.75 };
    panzoom.zoom(scale, {
      animate,
      focal: {
        x: (origin.x - 0.5) * map.clientWidth * scale,
        y: (origin.y - 0.5) * map.clientHeight * scale,
      },
    });
  });

  pins.addEventListener('focusin', ({ target }) => {
    const view = map.getBoundingClientRect();
    const pin = target.getBoundingClientRect();
    if (pin.right > view.left && pin.left < view.right && pin.bottom > view.top && pin.top < view.bottom) return;

    const scale = panzoom.getScale();
    panzoom.pan(
      (view.left + view.width / 2 - pin.left - pin.width / 2) / scale,
      (view.top + view.height / 2 - pin.top - pin.height / 2) / scale,
      { relative: true },
    );
  });

  section.querySelector('.projects__map-actions').hidden = false;
})();
