# Альянс

Откройте `index.html` в браузере или перейдите к [демо на GitHub Pages](https://doctor-hao.github.io/alliance-static-test/).

## Структура проекта

Общий HTML-каркас лежит в `layout/base.html`. Шаблон `templates/home.json` задаёт заголовок вкладки, метаописание и порядок секций в `<main>`. Поля `header` и `footer` задают первый экран с навигацией и подвал. В `components/` у каждой секции есть свой HTML, CSS и при необходимости JavaScript.

```text
index.html       готовая страница
layout/
  base.html      общий HTML-каркас
templates/
  home.json      метаданные и порядок секций главной
components/
  hero/          первый экран, навигация и слайды
  projects/      карта и карточки проектов
  services/      услуги и фотоколлаж
  process/       этапы работ
  company/       компания, команда и документы
  reviews/       отзывы
  contact/       форма и проверка ввода
  footer/        подвал
styles/
  base.css       типографика, общие элементы и сетка
scripts/
  build.mjs      сборка HTML из шаблонов
assets/
  fonts/
  images/
```
