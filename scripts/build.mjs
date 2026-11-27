import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);

function readFile(path) {
  return readFileSync(new URL(path, root), 'utf8').replaceAll('\r\n', '\n');
}

function assetUrl(path) {
  const version = createHash('sha256').update(readFile(path)).digest('hex').slice(0, 10);
  return `${path}?v=${version}`;
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const { title, description, header, sections, footer } = JSON.parse(readFile('templates/home.json'));
if (typeof title !== 'string' || typeof description !== 'string' || !Array.isArray(sections)) {
  throw new Error('Set the title, description and sections array in templates/home.json.');
}

const names = [header, ...sections, footer];
if (
  !names.every((name) => typeof name === 'string' && /^[a-z][a-z0-9-]*$/.test(name)) ||
  new Set(names).size !== names.length
) {
  throw new Error('Use unique lowercase section names in templates/home.json.');
}

const components = names.map((name) => {
  const path = `components/${name}/${name}`;
  if (!existsSync(new URL(`${path}.css`, root))) {
    throw new Error(`Missing stylesheet: ${path}.css`);
  }

  return {
    html: readFile(`${path}.html`).trimEnd(),
    style: `<link rel="stylesheet" href="${assetUrl(`${path}.css`)}">`,
    script: existsSync(new URL(`${path}.js`, root)) ? `<script defer src="${assetUrl(`${path}.js`)}"></script>` : '',
  };
});

const slots = {
  title: escapeHtml(title),
  description: escapeHtml(description),
  basestyle: assetUrl('styles/base.css'),
  styles: components.map(({ style }) => style).join('\n'),
  scripts: components.map(({ script }) => script).filter(Boolean).join('\n'),
  header: components[0].html,
  content: components.slice(1, -1).map(({ html }) => html).join('\n\n'),
  footer: components.at(-1).html,
};

const slotPattern = /^([ \t]*)\{\{([a-z]+)\}\}$|\{\{([a-z]+)\}\}/gm;
const page = readFile('layout/base.html').replace(slotPattern, (_, indent, block, inline) => {
  const name = block ?? inline;
  if (!Object.hasOwn(slots, name)) {
    throw new Error(`Unknown placeholder in layout/base.html: ${name}`);
  }

  return indent ? slots[name].replace(/^.+$/gm, (line) => indent + line) : slots[name];
});

writeFileSync(new URL('index.html', root), page);
