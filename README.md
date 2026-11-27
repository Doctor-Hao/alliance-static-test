# Альянс

Адаптивная демонстрационная вёрстка главной страницы. Контакты, проекты, отзывы и документы в демо условные. Карта использует статический набор объектов, а форма проверяет ввод локально.

Откройте `index.html` в браузере или перейдите к [демо на GitHub Pages](https://doctor-hao.github.io/alliance-static-test/).

## Структура проекта

Общий HTML-каркас лежит в `layout/base.html`. Шаблон `templates/home.json` задаёт заголовок вкладки, метаописание и порядок секций в `<main>`. Поля `header` и `footer` задают первый экран с навигацией и подвал. В `components/` у каждой секции есть свой HTML, CSS и при необходимости JavaScript.

После правок исходников запустите `node scripts/build.mjs`. Сборка вставит выбранные секции в каркас, подключит их стили и скрипты и обновит корневой `index.html` для GitHub Pages.

Слайдер первого экрана использует [Splide 4.1.4](https://splidejs.com/). Библиотека и её лицензия MIT лежат в `assets/vendor/splide/`.

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

## Материалы

Фотографии первого экрана, карточек проектов и коллажа услуг взяты из предоставленного макета и оптимизированы в WebP. Остальные фотографии для слайдов и карты перечислены ниже.

| Файл | Автор и источник | Лицензия |
| --- | --- | --- |
| `hero.webp` | Rsparks3, [Distribution substation switchgear](https://commons.wikimedia.org/wiki/File:Distribution_substation_switchgear.jpg) | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| `switchgear.webp` | P199, [Electrical switchgear](https://commons.wikimedia.org/wiki/File:Electrical_switchgear.JPG) | Общественное достояние |
| `warehouse.webp` | Axisadman, [Modern warehouse with pallet rack storage system](https://commons.wikimedia.org/wiki/File:Modern_warehouse_with_pallet_rack_storage_system.jpg) | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| `factory.webp` | Shixart1985, [Industrial production line operating in a large modern factory](https://commons.wikimedia.org/wiki/File:Industrial_production_line_operating_in_a_large_modern_factory.jpg) | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) |

Контур карты взят из предоставленного макета. Шрифты [Montserrat](assets/fonts/montserrat-OFL.txt) и [Tektur](assets/fonts/tektur-OFL.txt) поставляются по SIL Open Font License.
