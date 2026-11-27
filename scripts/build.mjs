import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);

function readFile(path) {
  return readFileSync(new URL(path, root), 'utf8').replaceAll('\r\n', '\n');
}

const template = readFile('templates/home.html');
const sectionPattern = /^([ \t]*)\{\{([a-z-]+)\}\}$/gm;
const page = template.replace(sectionPattern, (_, indent, name) => {
  const section = readFile(`components/${name}/${name}.html`).trimEnd();
  return section.split('\n').map((line) => line ? indent + line : '').join('\n');
});

writeFileSync(new URL('index.html', root), page);
