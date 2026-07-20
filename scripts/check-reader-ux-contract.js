#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const docsDir = path.join(root, 'docs');
const errors = [];

const modules = [
  {
    flag: 'conceptMap',
    id: 'appendix-b',
    route: '/appendices/appendix-b/',
    source: 'docs/appendices/appendix-b/index.md',
    title: '付録B：概念マップ',
  },
  {
    flag: 'glossary',
    id: 'appendix-c',
    route: '/appendices/appendix-c/',
    source: 'docs/appendices/appendix-c/index.md',
    title: '付録C：用語集',
  },
  {
    flag: 'figureIndex',
    id: 'appendix-d',
    route: '/appendices/appendix-d/',
    source: 'docs/appendices/appendix-d/index.md',
    title: '付録D：図版索引',
  },
];

const appendixSequence = [
  {
    id: 'appendix-a',
    route: '/appendices/appendix-a/',
    title: '付録A：実践的なツール・テンプレート集',
  },
  ...modules,
];

const purposeRoutes = [
  {
    purpose: 'AIに依頼する前の整理をしたい',
    entry: ['/chapters/chapter05/'],
    route: ['/chapters/chapter01/', '/chapters/chapter03/', '/chapters/chapter05/', '/appendices/appendix-a/'],
  },
  {
    purpose: 'AI出力を提出前に検証したい',
    entry: ['/chapters/chapter06/'],
    route: ['/chapters/chapter02/', '/chapters/chapter03/', '/chapters/chapter06/', '/chapters/chapter07/', '/chapters/chapter09/'],
  },
  {
    purpose: '1枚サマリーや提案書を作りたい',
    entry: ['/chapters/chapter10/'],
    route: ['/chapters/chapter04/', '/chapters/chapter05/', '/chapters/chapter06/', '/chapters/chapter10/', '/chapters/chapter11/', '/chapters/chapter13/'],
  },
  {
    purpose: '会議を決定につなげたい',
    entry: ['/chapters/chapter12/'],
    route: ['/chapters/chapter04/', '/chapters/chapter08/', '/chapters/chapter12/', '/chapters/chapter16/'],
  },
  {
    purpose: 'AI利用をチームへ導入したい',
    entry: ['/chapters/chapter15/'],
    route: ['/chapters/chapter09/', '/chapters/chapter10/', '/chapters/chapter12/', '/chapters/chapter15/', '/chapters/chapter16/'],
  },
  {
    purpose: '図版から概念を確認したい',
    entry: ['/appendices/appendix-d/'],
    route: ['/chapters/chapter02/', '/chapters/chapter05/', '/chapters/chapter06/', '/appendices/appendix-d/'],
  },
  {
    purpose: '用語の意味を確認しながら読みたい',
    entry: ['/appendices/appendix-c/'],
    route: ['/appendices/appendix-a/', '/appendices/appendix-d/'],
  },
];

const glossaryTerms = [
  {
    heading: 'CRISP-P',
    anchor: 'term-crisp-p',
    classification: '本書独自の運用定義',
    definitionFragments: ['Context（文脈）', 'Role（期待する視点）', 'Instruction（作業）',
      'Specification（制約・禁止事項・受け入れ基準）', 'Product（出力形式）'],
    relatedRoutes: ['/chapters/chapter05/'],
    backlinks: [
      { source: 'docs/chapters/chapter05/index.md', label: 'CRISP-P', target: '../../appendices/appendix-c/#term-crisp-p' },
    ],
  },
  {
    heading: 'context pack',
    anchor: 'term-context-pack',
    classification: '一般概念',
    definitionFragments: ['目的', '読み手', '意思決定点', '利用資料', '除外情報', '情報分類'],
    relatedRoutes: ['/chapters/chapter05/', '/chapters/chapter09/'],
    backlinks: [
      { source: 'docs/chapters/chapter05/index.md', label: 'context pack', target: '../../appendices/appendix-c/#term-context-pack' },
    ],
  },
  {
    heading: 'CARE',
    anchor: 'term-care',
    classification: '本書独自の運用定義',
    definitionFragments: ['Correctness（正確性）', 'Appropriateness（適切性）',
      'Relevance（関連性）', 'Effectiveness（効果性）'],
    relatedRoutes: ['/chapters/chapter06/', '/chapters/chapter10/'],
    backlinks: [
      { source: 'docs/introduction/01-introduction/index.md', label: 'CARE', target: '../../appendices/appendix-c/#term-care' },
      { source: 'docs/chapters/chapter06/index.md', label: 'CARE', target: '../../appendices/appendix-c/#term-care' },
    ],
  },
  {
    heading: 'CARE+',
    anchor: 'term-care-plus',
    classification: '本書独自の運用定義',
    definitionFragments: ['CAREの4観点', 'Evidence（根拠）', 'Risk（リスク）', 'Approval（承認条件）'],
    relatedRoutes: ['/chapters/chapter06/', '/chapters/chapter09/'],
    backlinks: [
      { source: 'docs/introduction/01-introduction/index.md', label: 'CARE+', target: '../../appendices/appendix-c/#term-care-plus' },
      { source: 'docs/chapters/chapter06/index.md', label: 'CARE+', target: '../../appendices/appendix-c/#term-care-plus' },
    ],
  },
  {
    heading: 'synthetic content',
    anchor: 'term-synthetic-content',
    classification: '一般概念',
    definitionFragments: ['AIを含むアルゴリズム', '大幅に変更または生成', '画像、動画、音声、テキスト'],
    relatedRoutes: ['/chapters/chapter07/', '/chapters/chapter09/'],
    sourceUrl: 'https://www.nist.gov/publications/reducing-risks-posed-synthetic-content-overview-technical-approaches-digital-content',
    backlinks: [
      { source: 'docs/chapters/chapter07/index.md', label: 'synthetic content', target: '../../appendices/appendix-c/#term-synthetic-content' },
    ],
  },
  {
    heading: 'BATNA',
    anchor: 'term-batna',
    classification: '一般概念',
    definitionFragments: ['Best Alternative to a Negotiated Agreement', '合意に至らない場合', '最善の代替案'],
    relatedRoutes: ['/chapters/chapter13/'],
    sourceUrl: 'https://www.pon.harvard.edu/daily/batna/translate-your-batna-to-the-current-deal/',
    backlinks: [
      { source: 'docs/chapters/chapter13/index.md', label: 'BATNA', target: '../../appendices/appendix-c/#term-batna' },
    ],
  },
];

// Issue #161 intentionally defines these exact nine public SVG files as the
// figure-index contract. Adding, removing, or renaming a diagram must update
// both this reviewed inventory and Appendix D in the same change.
const expectedFigures = [
  'ai-era-decision-framework.svg',
  'ai-human-collaboration.svg',
  'ai-workflow-change.svg',
  'deduction-induction-comparison.svg',
  'expression-communication-model.svg',
  'human-ai-collaboration-thinking.svg',
  'human-ai-role-distribution.svg',
  'logical-thinking-framework-enhanced.svg',
  'logical-thinking-framework.svg',
].map((filename) => ({
  filename,
  stableId: `figure-${filename.slice(0, -4)}`,
}));

function read(relPath) {
  try {
    return fs.readFileSync(path.join(root, relPath), 'utf8');
  } catch (error) {
    errors.push(`${relPath}: ${error.message}`);
    return '';
  }
}

function expect(condition, message) {
  if (!condition) errors.push(message);
}

function equal(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function stripYamlScalar(raw) {
  let value = String(raw ?? '').trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  return value.trim();
}

function parseFrontMatter(text, relPath) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  expect(match, `${relPath}: missing YAML front matter`);
  const front = {};
  if (!match) return front;
  for (const line of match[1].split(/\r?\n/)) {
    const item = line.match(/^([A-Za-z0-9_-]+):\s*(.*?)\s*$/);
    if (item) front[item[1]] = stripYamlScalar(item[2]);
  }
  return front;
}

function parseNavigation(text) {
  const sections = {};
  let section = null;
  let entry = null;

  const flush = () => {
    if (!section || !entry) return;
    sections[section] ??= [];
    if (!entry.path) errors.push(`docs/_data/navigation.yml: ${section} entry ${entry.title} is missing path`);
    sections[section].push(entry);
    entry = null;
  };

  for (const line of text.split(/\r?\n/)) {
    const sectionMatch = line.match(/^([A-Za-z0-9_]+):\s*$/);
    if (sectionMatch) {
      flush();
      section = sectionMatch[1];
      sections[section] ??= [];
      continue;
    }
    if (!section) continue;

    const titleMatch = line.match(/^\s*-\s+title:\s*(.*?)\s*$/);
    if (titleMatch) {
      flush();
      entry = { title: stripYamlScalar(titleMatch[1]) };
      continue;
    }

    const pathMatch = line.match(/^\s+path:\s*(.*?)\s*$/);
    if (pathMatch && entry) entry.path = stripYamlScalar(pathMatch[1]);
  }
  flush();
  return sections;
}

function stripHtmlComments(text) {
  return text.replace(/<!--[\s\S]*?-->/g, '');
}

function normalizeMarkdownRoute(target, source) {
  if (/^(?:https?:|mailto:)/i.test(target) || target.startsWith('#')) return target;
  const pathOnly = target.split(/[?#]/, 1)[0];
  const sourceRel = source.replace(/^docs\//, '');
  let route = pathOnly.startsWith('/')
    ? path.posix.normalize(pathOnly)
    : `/${path.posix.normalize(path.posix.join(path.posix.dirname(sourceRel), pathOnly))}`;
  if (!path.posix.extname(route) && !route.endsWith('/')) route += '/';
  return route;
}

function parseMarkdownLinks(text, source) {
  const links = [];
  const pattern = /(?<!!)\[([^\]\n]+)\]\(([^)\s]+)(?:\s+(?:"[^"]*"|'[^']*'))?\)/g;
  for (const match of stripHtmlComments(text).matchAll(pattern)) {
    links.push({
      label: match[1],
      target: match[2],
      route: normalizeMarkdownRoute(match[2], source),
    });
  }
  return links;
}

function extractSection(text, startHeading, endHeading, relPath) {
  const start = text.indexOf(startHeading);
  expect(start !== -1, `${relPath}: missing section ${startHeading}`);
  if (start === -1) return '';
  const end = endHeading ? text.indexOf(endHeading, start + startHeading.length) : text.length;
  expect(end !== -1, `${relPath}: missing section boundary ${endHeading}`);
  return text.slice(start, end === -1 ? text.length : end);
}

function parseMarkdownTable(text) {
  return text.split(/\r?\n/)
    .filter((line) => /^\s*\|.*\|\s*$/.test(line))
    .map((line) => line.trim().slice(1, -1).split('|').map((cell) => cell.trim()))
    .filter((cells) => !cells.every((cell) => /^:?-+:?$/.test(cell)));
}

function extractHeadingBlock(text, heading, relPath) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = [...text.matchAll(new RegExp(`^###\\s+${escaped}(?:\\s+\\{#[A-Za-z0-9-]+\\})?\\s*$`, 'gm'))];
  expect(matches.length === 1, `${relPath}: expected one heading "${heading}", found ${matches.length}`);
  if (matches.length !== 1) return '';
  const start = matches[0].index;
  const remainder = text.slice(start + matches[0][0].length);
  const nextHeading = remainder.match(/^#{2,3}\s+/m);
  const end = nextHeading ? start + matches[0][0].length + nextHeading.index : text.length;
  return text.slice(start, end);
}

function htmlAttribute(tag, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return tag.match(new RegExp(`\\b${escaped}="([^"]*)"`, 'i'))?.[1] ?? '';
}

const bookConfigText = read('book-config.json');
let bookConfig = {};
try {
  bookConfig = JSON.parse(bookConfigText);
} catch (error) {
  errors.push(`book-config.json: invalid JSON: ${error.message}`);
}

const navigationText = read('docs/_data/navigation.yml');
const navigation = parseNavigation(navigationText);
const navAppendices = navigation.appendices ?? [];
const topPage = read('docs/index.md');
const topLinks = parseMarkdownLinks(topPage, 'docs/index.md');
const layout = read('docs/_layouts/book.html');
const sidebar = read('docs/_includes/sidebar-nav.html');
const pageNavigation = read('docs/_includes/page-navigation.html');

expect((layout.match(/\{\%\s*include\s+page-navigation\.html\s*\%\}/g) ?? []).length === 1,
  'docs/_layouts/book.html: expected exactly one automatic page-navigation include');
expect((layout.match(/\{\%\s*include\s+sidebar-nav\.html\s*\%\}/g) ?? []).length === 1,
  'docs/_layouts/book.html: expected exactly one automatic sidebar include');
expect(!topPage.includes('{% include page-navigation.html %}'),
  'docs/index.md: must not duplicate the layout-provided page navigation');
expect(sidebar.includes('navigation.appendices'),
  'docs/_includes/sidebar-nav.html: appendices are not rendered in the sidebar');
expect(pageNavigation.includes('navigation.appendices'),
  'docs/_includes/page-navigation.html: appendices are not part of prev/next sequence');

const expectedNavEntries = appendixSequence.map(({ title, route }) => ({ title, path: route }));
expect(equal(navAppendices, expectedNavEntries),
  `docs/_data/navigation.yml appendices: expected exact A→B→C→D sequence ${JSON.stringify(expectedNavEntries)}, got ${JSON.stringify(navAppendices)}`);

const configAppendices = Array.isArray(bookConfig.structure?.appendices) ? bookConfig.structure.appendices : [];
const expectedConfigEntries = appendixSequence.map(({ id, title, route }) => ({ id, title, path: route }));
const actualConfigEntries = configAppendices.map(({ id, title, path: entryPath }) => ({
  id,
  title,
  path: entryPath,
}));
expect(equal(actualConfigEntries, expectedConfigEntries),
  `book-config.json structure.appendices: expected exact A→B→C→D sequence ${JSON.stringify(expectedConfigEntries)}, got ${JSON.stringify(actualConfigEntries)}`);
for (const module of modules) {
  const page = read(module.source);
  const front = parseFrontMatter(page, module.source);
  const configIdMatches = configAppendices.filter((entry) => entry.id === module.id);
  const configTitleMatches = configAppendices.filter((entry) => entry.title === module.title);
  const configPathMatches = configAppendices.filter((entry) => entry.path === module.route);
  const navTitleMatches = navAppendices.filter((entry) => entry.title === module.title);
  const navPathMatches = navAppendices.filter((entry) => entry.path === module.route);
  const navEntryMatches = navAppendices.filter((entry) => entry.title === module.title && entry.path === module.route);
  const topRouteLinks = topLinks.filter((link) => link.route === module.route);

  expect(bookConfig.ux?.modules?.[module.flag] === true,
    `book-config.json ux.modules.${module.flag}: expected true after page implementation`);
  expect(configIdMatches.length === 1,
    `book-config.json structure.appendices: expected unique id ${module.id}, found ${configIdMatches.length}`);
  expect(configTitleMatches.length === 1,
    `book-config.json structure.appendices: expected unique title ${module.title}, found ${configTitleMatches.length}`);
  expect(configPathMatches.length === 1,
    `book-config.json structure.appendices: expected unique path ${module.route}, found ${configPathMatches.length}`);
  const configEntry = configIdMatches[0];
  expect(configEntry?.title === module.title && configEntry?.path === module.route,
    `book-config.json ${module.id}: id/title/path must be ${JSON.stringify({ id: module.id, title: module.title, path: module.route })}`);
  expect(navTitleMatches.length === 1,
    `docs/_data/navigation.yml: title ${module.title} must be unique, found ${navTitleMatches.length}`);
  expect(navPathMatches.length === 1,
    `docs/_data/navigation.yml: path ${module.route} must be unique, found ${navPathMatches.length}`);
  expect(navEntryMatches.length === 1,
    `docs/_data/navigation.yml: title and path must belong to the same ${module.id} entry`);
  expect(configEntry?.title === navEntryMatches[0]?.title && configEntry?.path === navEntryMatches[0]?.path,
    `${module.id}: book-config title/path must match the same navigation entry`);
  expect(fs.existsSync(path.join(root, module.source)), `${module.source}: reader-facing page is missing`);
  expect(front.layout === 'book', `${module.source}: expected layout: book`);
  expect(front.title === configEntry?.title,
    `${module.source}: front matter title must match book-config/navigation title ${configEntry?.title}`);
  expect(front.permalink === configEntry?.path,
    `${module.source}: permalink must match book-config/navigation path ${configEntry?.path}`);
  expect(topRouteLinks.length === 1,
    `docs/index.md: expected exactly one Markdown link to ${module.route}, found ${topRouteLinks.length}`);
  expect(topRouteLinks[0]?.label === module.title,
    `docs/index.md: top link to ${module.route} must use label ${module.title}`);
  expect(topRouteLinks[0] && !/[?#]/.test(topRouteLinks[0].target),
    `docs/index.md: top link to ${module.route} must target the route directly without query or fragment`);
  expect(!page.includes('{% include page-navigation.html %}'),
    `${module.source}: must not include page-navigation.html; the book layout injects it`);
}

const expectedNeighbors = {
  '/appendices/appendix-b/': { previous: '/appendices/appendix-a/', next: '/appendices/appendix-c/' },
  '/appendices/appendix-c/': { previous: '/appendices/appendix-b/', next: '/appendices/appendix-d/' },
  '/appendices/appendix-d/': { previous: '/appendices/appendix-c/', next: null },
};
for (const [route, expected] of Object.entries(expectedNeighbors)) {
  const index = navAppendices.findIndex((entry) => entry.path === route);
  const actual = {
    previous: index > 0 ? navAppendices[index - 1].path : null,
    next: index >= 0 && index + 1 < navAppendices.length ? navAppendices[index + 1].path : null,
  };
  expect(equal(actual, expected),
    `navigation prev/next source sequence for ${route}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

const conceptSource = 'docs/appendices/appendix-b/index.md';
const conceptMap = read(conceptSource);
const conceptMapWithoutComments = stripHtmlComments(conceptMap);
const forbiddenInteractivePatterns = [
  { pattern: /<script(?:\s|>)/i, label: 'script tags' },
  { pattern: /javascript\s*:/i, label: 'javascript: URLs' },
  { pattern: /\bon[a-z][a-z0-9_-]*\s*=/i, label: 'HTML event-handler attributes' },
  { pattern: /<(?:iframe|object|embed)\b/i, label: 'embedded executable/external content' },
];
for (const forbidden of forbiddenInteractivePatterns) {
  expect(!forbidden.pattern.test(conceptMapWithoutComments),
    `Appendix B: non-JavaScript text map must not contain ${forbidden.label}`);
}
expect(conceptMap.includes('依存関係') && conceptMap.includes('目的別ルート'),
  'Appendix B: expected dependency and purpose-route sections');
for (let part = 1; part <= 4; part += 1) {
  expect(conceptMap.includes(`id="part-${part}"`), `Appendix B: missing stable part anchor part-${part}`);
}
for (let chapter = 1; chapter <= 17; chapter += 1) {
  const id = String(chapter).padStart(2, '0');
  expect(parseMarkdownLinks(conceptMap, conceptSource).some((link) => link.route === `/chapters/chapter${id}/`),
    `Appendix B: missing Markdown link to chapter${id}`);
}

const purposeSection = extractSection(conceptMap, '## B.6 目的別ルート', '## B.7 ', conceptSource);
const purposeRows = parseMarkdownTable(purposeSection).filter((cells) => cells[0] !== '目的');
expect(purposeRows.length === purposeRoutes.length,
  `Appendix B B.6: expected ${purposeRoutes.length} purpose rows, found ${purposeRows.length}`);
expect(equal(purposeRows.map((cells) => cells[0]), purposeRoutes.map((entry) => entry.purpose)),
  'Appendix B B.6: purpose rows must remain in the reviewed order');
for (const expected of purposeRoutes) {
  const rows = purposeRows.filter((cells) => cells[0] === expected.purpose);
  expect(rows.length === 1, `Appendix B B.6: expected one row for ${expected.purpose}, found ${rows.length}`);
  if (rows.length !== 1) continue;
  const row = rows[0];
  const entryLinks = parseMarkdownLinks(row[1] ?? '', conceptSource).map((link) => link.route);
  const routeLinks = parseMarkdownLinks(row[2] ?? '', conceptSource).map((link) => link.route);
  expect(equal(entryLinks, expected.entry),
    `Appendix B B.6 ${expected.purpose}: entry links expected ${JSON.stringify(expected.entry)}, got ${JSON.stringify(entryLinks)}`);
  expect(equal(routeLinks, expected.route),
    `Appendix B B.6 ${expected.purpose}: route links expected ${JSON.stringify(expected.route)}, got ${JSON.stringify(routeLinks)}`);
  const linkedCellsWithoutLinks = `${row[1]} ${row[2]}`.replace(/(?<!!)\[[^\]\n]+\]\([^)]+\)/g, '');
  expect(!/(?:第\d+章|付録[A-D])/.test(linkedCellsWithoutLinks),
    `Appendix B B.6 ${expected.purpose}: every chapter/appendix node must be a Markdown link`);
}

const glossary = read('docs/appendices/appendix-c/index.md');
const glossaryDefinitions = (glossary.match(/^\*\*定義\*\*:/gm) ?? []).length;
const glossaryUses = (glossary.match(/^\*\*使いどころ\*\*:/gm) ?? []).length;
const glossaryChapterLinks = parseMarkdownLinks(glossary, 'docs/appendices/appendix-c/index.md')
  .filter((link) => /^\/chapters\/chapter\d{2}\/$/.test(link.route)).length;
expect(glossaryDefinitions >= 15,
  `Appendix C: expected at least 15 meaningful definitions, found ${glossaryDefinitions}`);
expect(glossaryChapterLinks >= 15,
  `Appendix C: expected at least 15 chapter links, found ${glossaryChapterLinks}`);
expect(glossaryDefinitions === glossaryUses,
  'Appendix C: every definition must explain its practical use');

const stableGlossaryAnchors = [...glossary.matchAll(/^###\s+.+?\s+\{#([A-Za-z0-9-]+)\}\s*$/gm)]
  .map((match) => match[1]);
expect(new Set(stableGlossaryAnchors).size === stableGlossaryAnchors.length,
  'Appendix C: stable term anchors must be unique');

for (const term of glossaryTerms) {
  const block = extractHeadingBlock(glossary, term.heading, 'docs/appendices/appendix-c/index.md');
  expect(block.startsWith(`### ${term.heading} {#${term.anchor}}`),
    `Appendix C ${term.heading}: heading must use stable anchor ${term.anchor}`);
  expect((block.match(/^\*\*分類\*\*:/gm) ?? []).length === 1,
    `Appendix C ${term.heading}: expected one classification field`);
  expect(block.includes(`**分類**: ${term.classification}`),
    `Appendix C ${term.heading}: classification must be ${term.classification}`);
  expect((block.match(/^\*\*定義\*\*:/gm) ?? []).length === 1,
    `Appendix C ${term.heading}: expected one definition field`);
  expect((block.match(/^\*\*出典境界\*\*:/gm) ?? []).length === 1,
    `Appendix C ${term.heading}: expected one source-boundary field`);
  expect((block.match(/^\*\*使いどころ\*\*:/gm) ?? []).length === 1,
    `Appendix C ${term.heading}: expected one practical-use field`);
  expect((block.match(/^\*\*関連章\*\*:/gm) ?? []).length === 1,
    `Appendix C ${term.heading}: expected one related-chapters field`);
  for (const fragment of term.definitionFragments) {
    expect(block.includes(fragment),
      `Appendix C ${term.heading}: definition/source boundary is missing ${fragment}`);
  }
  if (term.sourceUrl) {
    expect(parseMarkdownLinks(block, 'docs/appendices/appendix-c/index.md')
      .some((link) => link.target === term.sourceUrl),
    `Appendix C ${term.heading}: missing reviewed representative source ${term.sourceUrl}`);
    expect(block.includes('2026-07-19確認'),
      `Appendix C ${term.heading}: representative source requires confirmation date 2026-07-19`);
  }

  const relatedRoutes = parseMarkdownLinks(block, 'docs/appendices/appendix-c/index.md')
    .map((link) => link.route)
    .filter((route) => /^\/chapters\/chapter\d{2}\/$/.test(route));
  expect(equal(relatedRoutes, term.relatedRoutes),
    `Appendix C ${term.heading}: related chapter routes expected ${JSON.stringify(term.relatedRoutes)}, got ${JSON.stringify(relatedRoutes)}`);

  for (const backlink of term.backlinks) {
    const sourceText = read(backlink.source);
    const matches = parseMarkdownLinks(sourceText, backlink.source)
      .filter((link) => link.label === backlink.label && link.target === backlink.target);
    expect(matches.length >= 1,
      `${backlink.source}: missing backlink [${backlink.label}](${backlink.target}) to Appendix C ${term.heading}`);
  }
}

const careConsistency = [
  ['README.md', 'CARE（Correctness / Appropriateness / Relevance / Effectiveness）'],
  ['docs/index.md', 'CARE+（CAREの4観点にEvidence、Risk、Approvalを追加）'],
  ['docs/introduction/01-introduction/index.md', 'Correctness、Appropriateness、Relevance、Effectiveness'],
  ['docs/introduction/02-standard-workflow/index.md', '**Correctness**:'],
  ['docs/introduction/02-standard-workflow/index.md', '**Appropriateness**:'],
  ['docs/introduction/02-standard-workflow/index.md', '**Relevance**:'],
  ['docs/introduction/02-standard-workflow/index.md', '**Effectiveness**:'],
  ['docs/chapters/chapter06/index.md', '| Correctness |'],
  ['docs/chapters/chapter06/index.md', '| Appropriateness |'],
  ['docs/chapters/chapter06/index.md', '| Relevance |'],
  ['docs/chapters/chapter06/index.md', '| Effectiveness |'],
  ['docs/chapters/chapter06/index.md', '| Evidence |'],
  ['docs/chapters/chapter06/index.md', '| Risk |'],
  ['docs/chapters/chapter06/index.md', '| Approval |'],
  ['docs/chapters/chapter01/index.md', 'CAREの4観点に加えて、CARE+で扱うEvidence、Risk、Approval'],
  ['docs/chapters/chapter05/index.md', 'CAREの4観点を土台に、Evidence、Risk、Approvalを加えたCARE+'],
  ['docs/appendices/appendix-a/index.md', 'AI出力をCARE+と受け入れ基準で評価'],
  ['docs/additional/case-study-01-executive-summary/index.md', '### 5.1 CARE（4観点）評価'],
  ['docs/additional/case-study-02-meeting-to-decision-log/index.md', '### 5.1 CARE（4観点）評価'],
  ['docs/additional/case-study-03-sales-hearing-and-proposal/index.md', '### 5.1 CARE（4観点）評価'],
];
for (const [source, fragment] of careConsistency) {
  expect(read(source).includes(fragment), `${source}: CARE/CARE+ contract is missing ${fragment}`);
}
expect(!glossary.includes('内容の正確さ、適合性、リスク、説明可能性'),
  'Appendix C CARE: obsolete Risk/Explainability expansion must not return');
for (const source of [
  'docs/additional/case-study-01-executive-summary/index.md',
  'docs/additional/case-study-02-meeting-to-decision-log/index.md',
  'docs/additional/case-study-03-sales-hearing-and-proposal/index.md',
]) {
  expect(!read(source).includes('CARE +'),
    `${source}: ambiguous "CARE +" spelling must not return; use CARE or CARE+ explicitly`);
}

const batnaChapter = read('docs/chapters/chapter13/index.md');
for (const fragment of [
  '相手BATNA仮説の根拠 / 確認状態: 未確認 / 確認中 / 確認済み',
  '相手BATNA仮説を提案本文へ採用する条件:',
  '未確認の仮説は提案本文の事実へ昇格させず',
]) {
  expect(batnaChapter.includes(fragment),
    `docs/chapters/chapter13/index.md: BATNA hypothesis boundary is missing ${fragment}`);
}

const bookQaWorkflow = read('.github/workflows/book-qa.yml');
const activeGlossaryGateRuns = bookQaWorkflow.match(/^\s+run:\s+npm run check:ux-contract\s*$/gm) ?? [];
expect(activeGlossaryGateRuns.length === 1,
  `.github/workflows/book-qa.yml: expected one active exact glossary gate run, found ${activeGlossaryGateRuns.length}`);

const figureSource = 'docs/appendices/appendix-d/index.md';
const figureIndex = read(figureSource);
let actualFigures = [];
try {
  actualFigures = fs.readdirSync(path.join(docsDir, 'assets/images/diagrams'))
    .filter((filename) => filename.endsWith('.svg'))
    .sort();
} catch (error) {
  errors.push(`docs/assets/images/diagrams: ${error.message}`);
}
expect(equal(actualFigures, expectedFigures.map(({ filename }) => filename)),
  `SVG inventory: expected intentional exact 9-file set ${expectedFigures.map(({ filename }) => filename).join(', ')}, got ${actualFigures.join(', ')}`);

const inventorySection = extractSection(figureIndex, '## D.1 全図版一覧', '## D.2 ', figureSource);
const inventoryRows = parseMarkdownTable(inventorySection).filter((cells) => cells[0] !== 'ID');
expect(inventoryRows.length === expectedFigures.length,
  `Appendix D D.1: expected ${expectedFigures.length} inventory rows, found ${inventoryRows.length}`);

const figureIds = [...figureIndex.matchAll(/<figure\s+id="([^"]+)"/g)].map((match) => match[1]);
expect(figureIds.length === expectedFigures.length,
  `Appendix D: expected ${expectedFigures.length} figure blocks, found ${figureIds.length}`);
expect(new Set(figureIds).size === figureIds.length, 'Appendix D: figure stable IDs must be unique');

for (const expected of expectedFigures) {
  const inventoryMatches = inventoryRows.filter((cells) => {
    const links = parseMarkdownLinks(cells[0] ?? '', figureSource);
    return links.length === 1
      && links[0].target === `#${expected.stableId}`
      && cells[1] === `\`${expected.filename}\``;
  });
  expect(inventoryMatches.length === 1,
    `Appendix D D.1: ${expected.stableId} must be joined to ${expected.filename} in exactly one inventory row`);

  const heading = expected.filename.slice(0, -4);
  const block = extractHeadingBlock(figureIndex, heading, figureSource);
  const figures = [...block.matchAll(/<figure\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/figure>/g)];
  expect(figures.length === 1,
    `Appendix D ${heading}: expected one figure block, found ${figures.length}`);
  if (figures.length !== 1) continue;

  const [figureMatch] = figures;
  expect(figureMatch[1] === expected.stableId,
    `Appendix D ${heading}: stable ID must be ${expected.stableId}, got ${figureMatch[1]}`);
  const imageTags = [...figureMatch[2].matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  expect(imageTags.length === 1,
    `Appendix D ${expected.stableId}: expected one embedded image, found ${imageTags.length}`);
  const imageTag = imageTags[0] ?? '';
  const src = htmlAttribute(imageTag, 'src');
  const alt = htmlAttribute(imageTag, 'alt').trim();
  expect(path.posix.basename(src) === expected.filename,
    `Appendix D ${expected.stableId}: image source must be ${expected.filename}, got ${src}`);
  expect(alt.length >= 10,
    `Appendix D ${expected.stableId}: meaningful alt text is required`);

  const captions = [...figureMatch[2].matchAll(/<figcaption>([\s\S]*?)<\/figcaption>/gi)]
    .map((match) => match[1].replace(/<[^>]+>/g, '').trim());
  expect(captions.length === 1 && captions[0].length > 0 && captions[0].includes('概念図'),
    `Appendix D ${expected.stableId}: one conceptual/illustrative caption is required`);

  const blockSvgFiles = [...block.matchAll(/[A-Za-z0-9-]+\.svg/g)].map((match) => match[0]);
  expect(equal(blockSvgFiles, [expected.filename]),
    `Appendix D ${expected.stableId}: block must bind only expected SVG ${expected.filename}, got ${JSON.stringify(blockSvgFiles)}`);
  const metadataRows = parseMarkdownTable(block);
  const purposeRowsForFigure = metadataRows.filter((cells) => cells[0] === '**用途**');
  const relatedRowsForFigure = metadataRows.filter((cells) => cells[0] === '**関連章**');
  expect(purposeRowsForFigure.length === 1 && Boolean(purposeRowsForFigure[0]?.[1]),
    `Appendix D ${expected.stableId}: one non-empty purpose row is required in the same block`);
  expect(relatedRowsForFigure.length === 1,
    `Appendix D ${expected.stableId}: one related-chapters row is required in the same block`);
  const relatedLinks = parseMarkdownLinks(relatedRowsForFigure[0]?.[1] ?? '', figureSource)
    .map((link) => link.route);
  expect(relatedLinks.length > 0 && relatedLinks.every((route) => /^\/chapters\/chapter\d{2}\/$/.test(route)),
    `Appendix D ${expected.stableId}: related chapters must be chapter Markdown links in the same block`);
}

expect(figureIndex.includes('実測効果') && figureIndex.includes('保証'),
  'Appendix D: conceptual/illustrative status and non-guarantee boundary are required');

if (errors.length) {
  console.error(`Reader UX contract failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('OK: reader UX contract (joined metadata/routes, purpose paths, glossary term boundaries, exact SVG inventory, and stable figure blocks)');
