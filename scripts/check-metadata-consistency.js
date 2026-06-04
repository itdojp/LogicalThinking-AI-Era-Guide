#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');
const util = require('node:util');

const REPO_SLUG = 'LogicalThinking-AI-Era-Guide';
const PACKAGE_NAME = 'logical-thinking-ai-era-guide';
const GITHUB_URL = `https://github.com/itdojp/${REPO_SLUG}`;
const GITHUB_GIT_URL = `${GITHUB_URL}.git`;
const PACKAGE_GIT_URL = `git+${GITHUB_GIT_URL}`;
const PAGES_URL = `https://itdojp.github.io/${REPO_SLUG}/`;
const ISSUES_URL = `${GITHUB_URL}/issues`;
const REQUIRED_DOC_ASSETS = [
  'assets/css/main.css',
  'assets/css/mobile-responsive.css',
  'assets/css/syntax-highlighting.css',
  'assets/js/theme.js',
  'assets/js/search.js',
  'assets/js/code-copy-lightweight.js',
  'assets/images/itdo_logo_48x48_blue.png',
];

const root = path.resolve(__dirname, '..');
const docsDir = path.join(root, 'docs');
const errors = [];

function repoPath(...parts) {
  return path.join(root, ...parts);
}

function readText(relPath) {
  try {
    return fs.readFileSync(repoPath(relPath), 'utf8');
  } catch (error) {
    errors.push(`${relPath}: ${error.message}`);
    return '';
  }
}

function readJson(relPath) {
  try {
    return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
  } catch (error) {
    errors.push(`${relPath}: invalid JSON: ${error.message}`);
    return {};
  }
}

function stripYamlScalar(raw) {
  if (raw == null) return '';
  let value = String(raw).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  return value.trim();
}

function parseRootScalars(text) {
  const values = {};
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_]+):\s*(.*?)\s*$/);
    if (!match) continue;
    const [, key, raw] = match;
    if (!raw) continue;
    values[key] = stripYamlScalar(raw);
  }
  return values;
}

function parseFrontMatter(relPath) {
  const text = readText(relPath);
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    errors.push(`${relPath}: missing YAML front matter`);
    return {};
  }
  const front = {};
  for (const line of match[1].split(/\r?\n/)) {
    const scalar = line.match(/^([A-Za-z0-9_-]+):\s*(.*?)\s*$/);
    if (scalar) front[scalar[1]] = stripYamlScalar(scalar[2]);
  }
  return front;
}

function parseNavigation(text) {
  const sections = {};
  let currentKey = null;
  let currentItem = null;
  const flush = () => {
    if (!currentKey || !currentItem) return;
    sections[currentKey] ??= [];
    sections[currentKey].push(currentItem);
    currentItem = null;
  };
  for (const line of text.split(/\r?\n/)) {
    const section = line.match(/^([A-Za-z0-9_]+):\s*$/);
    if (section) {
      flush();
      currentKey = section[1];
      continue;
    }
    if (!currentKey) continue;
    const title = line.match(/^\s*-\s+title:\s*(.*?)\s*$/);
    if (title) {
      flush();
      currentItem = { title: stripYamlScalar(title[1]) };
      continue;
    }
    const directPath = line.match(/^\s*-\s+path:\s*(.*?)\s*$/);
    if (directPath) {
      flush();
      currentItem = { path: stripYamlScalar(directPath[1]) };
      continue;
    }
    const itemPath = line.match(/^\s+path:\s*(.*?)\s*$/);
    if (itemPath && currentItem) currentItem.path = stripYamlScalar(itemPath[1]);
  }
  flush();
  return sections;
}

function normalizeRoute(raw, label) {
  if (typeof raw !== 'string') {
    errors.push(`${label}: path must be a string`);
    return null;
  }
  let route = raw.trim();
  if (!route) {
    errors.push(`${label}: path is empty`);
    return null;
  }
  if (/^(https?:|mailto:)/i.test(route)) {
    errors.push(`${label}: external paths are not allowed (${route})`);
    return null;
  }
  if (route.includes('..')) {
    errors.push(`${label}: path must not contain '..' (${route})`);
    return null;
  }
  if (!route.startsWith('/')) route = `/${route}`;
  if (route !== '/' && !/[.]\w+$/.test(route) && !route.endsWith('/')) route += '/';
  return route;
}

function routeCandidates(route) {
  if (route === '/') return [path.join(docsDir, 'index.md')];
  const rel = route.replace(/^\//, '');
  if (rel.endsWith('/')) {
    const dir = rel.slice(0, -1);
    return [path.join(docsDir, dir, 'index.md'), path.join(docsDir, `${dir}.md`)];
  }
  return [path.join(docsDir, rel), path.join(docsDir, `${rel}.md`), path.join(docsDir, rel, 'index.md')];
}

function routeExists(route) {
  return routeCandidates(route).some((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) errors.push(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

function expectDeepEqual(actual, expected, label) {
  if (!util.isDeepStrictEqual(actual, expected)) errors.push(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

function ensureArray(value, label) {
  if (!Array.isArray(value)) {
    errors.push(`${label}: expected an array`);
    return [];
  }
  return value;
}

const bookConfig = readJson('book-config.json');
const packageJson = readJson('package.json');
const packageLock = readJson('package-lock.json');
const docsConfigText = readText('docs/_config.yml');
const docsConfig = parseRootScalars(docsConfigText);
const docsIndex = parseFrontMatter('docs/index.md');
const navigation = parseNavigation(readText('docs/_data/navigation.yml'));
const navEntries = ['introduction', 'chapters', 'additional', 'appendices']
  .flatMap((section) => ensureArray(navigation[section] ?? [], `docs/_data/navigation.yml ${section}`)
    .map((entry) => ({ ...entry, section })));
const navChapters = ensureArray(navigation.chapters, 'docs/_data/navigation.yml chapters');
const navAppendices = ensureArray(navigation.appendices, 'docs/_data/navigation.yml appendices');

const canonical = {
  title: bookConfig.title,
  description: bookConfig.description,
  author: bookConfig.author,
  version: bookConfig.version,
  license: bookConfig.license,
};

for (const [key, expected] of Object.entries(canonical)) {
  expectEqual(bookConfig[key], expected, `book-config.json ${key}`);
}
expectEqual(bookConfig.language, 'ja', 'book-config.json language');
expectEqual(bookConfig.homepage, PAGES_URL, 'book-config.json homepage');
expectDeepEqual(bookConfig.repository, { url: GITHUB_GIT_URL, branch: 'main' }, 'book-config.json repository');

expectEqual(packageJson.name, PACKAGE_NAME, 'package.json name');
expectEqual(packageJson.version, canonical.version, 'package.json version');
expectEqual(packageJson.description, canonical.description, 'package.json description');
expectEqual(packageJson.author, canonical.author, 'package.json author');
expectEqual(packageJson.license, canonical.license, 'package.json license');
expectDeepEqual(packageJson.repository, { type: 'git', url: PACKAGE_GIT_URL }, 'package.json repository');
expectDeepEqual(packageJson.bugs, { url: ISSUES_URL }, 'package.json bugs');
expectEqual(packageJson.homepage, PAGES_URL, 'package.json homepage');
expectEqual(packageJson.scripts?.['check:metadata'], 'node scripts/check-metadata-consistency.js', 'package.json scripts.check:metadata');
if (!String(packageJson.scripts?.test || '').includes('npm run check:metadata')) {
  errors.push('package.json scripts.test: expected to run npm run check:metadata');
}

expectEqual(packageLock.name, PACKAGE_NAME, 'package-lock.json name');
expectEqual(packageLock.version, canonical.version, 'package-lock.json version');
expectEqual(packageLock.packages?.['']?.name, PACKAGE_NAME, 'package-lock.json packages[""].name');
expectEqual(packageLock.packages?.['']?.version, canonical.version, 'package-lock.json packages[""].version');

for (const [key, expected] of [
  ['title', canonical.title],
  ['description', canonical.description],
  ['author', canonical.author],
  ['version', canonical.version],
  ['lang', 'ja'],
  ['url', 'https://itdojp.github.io'],
  ['baseurl', `/${REPO_SLUG}`],
  ['repository', `itdojp/${REPO_SLUG}`],
  ['license', canonical.license],
  ['homepage', PAGES_URL],
  ['repository_url', GITHUB_URL],
]) {
  expectEqual(docsConfig[key], expected, `docs/_config.yml ${key}`);
}

for (const [key, expected] of [
  ['title', canonical.title],
  ['description', canonical.description],
  ['author', canonical.author],
  ['version', canonical.version],
]) {
  expectEqual(docsIndex[key], expected, `docs/index.md front matter ${key}`);
}

function structureEntries(section, label) {
  return ensureArray(bookConfig.structure?.[section], `book-config.json structure.${section}`).map((item, index) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    path: normalizeRoute(item.path, `${label}[${index}].path`),
  }));
}

const expectedChapters = navChapters.map((item, index) => ({
  id: `chapter${String(index + 1).padStart(2, '0')}`,
  title: item.title,
  description: bookConfig.structure?.chapters?.[index]?.description,
  path: normalizeRoute(item.path, `navigation chapter ${index + 1}`),
}));
const expectedAppendices = navAppendices.map((item, index) => ({
  id: `appendix-${String.fromCharCode(97 + index)}`,
  title: item.title,
  description: bookConfig.structure?.appendices?.[index]?.description,
  path: normalizeRoute(item.path, `navigation appendix ${index + 1}`),
}));
expectDeepEqual(structureEntries('chapters', 'book-config.json structure.chapters'), expectedChapters, 'book-config.json structure.chapters');
expectDeepEqual(structureEntries('appendices', 'book-config.json structure.appendices'), expectedAppendices, 'book-config.json structure.appendices');

const seen = new Map();
for (const [index, entry] of navEntries.entries()) {
  const route = normalizeRoute(entry.path, `docs/_data/navigation.yml ${entry.section}[${index}].path`);
  if (!route) continue;
  if (seen.has(route)) {
    errors.push(`docs/_data/navigation.yml: duplicate path ${route} at entries ${seen.get(route)} and ${index + 1}`);
  } else {
    seen.set(route, index + 1);
  }
  if (!routeExists(route)) {
    const candidates = routeCandidates(route).map((candidate) => path.relative(root, candidate).replaceAll(path.sep, '/')).join(', ');
    errors.push(`docs/_data/navigation.yml: path ${route} has no matching Markdown source (${candidates})`);
  }
}

for (const route of [...expectedChapters, ...expectedAppendices].map((entry) => entry.path)) {
  if (!seen.has(route)) errors.push(`book-config.json structure path ${route} is missing from navigation`);
}

for (const asset of REQUIRED_DOC_ASSETS) {
  const file = path.join(docsDir, asset);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile() || fs.statSync(file).size === 0) {
    errors.push(`docs/${asset}: required public asset is missing or empty`);
  }
}

if (errors.length) {
  console.error(`Metadata consistency check failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`OK: metadata, navigation, structure, and required assets are consistent (${navEntries.length} navigation entries)`);
