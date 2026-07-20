#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT, 'content-boundaries.json');
const POLICY_MARKER = '<!-- content-boundary: docs-canonical -->';
const ARCHIVE_MARKER = '<!-- content-boundary: archived-legacy -->';
const SUPPLEMENTAL_MARKER = '<!-- content-boundary: unpublished-supplemental -->';
const MIRROR_ROOTS = ['src/chapters', 'src/appendices'];
const SUPPLEMENTAL_ROOT = 'src/exercise-answers';

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function isSafeRelativePath(value) {
  if (typeof value !== 'string' || value.length === 0 || value.includes('\\')) {
    return false;
  }
  if (path.posix.isAbsolute(value) || value.startsWith('../')) {
    return false;
  }
  const normalized = path.posix.normalize(value);
  return normalized === value && !normalized.split('/').includes('..');
}

function pathInsideRoot(relativePath) {
  const absolute = path.resolve(ROOT, relativePath);
  return absolute === ROOT || absolute.startsWith(ROOT + path.sep);
}

function isWithin(relativePath, allowedRoot) {
  return (
    relativePath === allowedRoot ||
    relativePath.startsWith(allowedRoot + '/')
  );
}

function hasForbiddenPublicReference(content, forbiddenRoots) {
  const normalized = content
    .toLowerCase()
    .replace(/%2f/gi, '/')
    .replace(/\\/g, '/');
  return forbiddenRoots.find((root) => {
    const escaped = root
      .toLowerCase()
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const trailingBoundary = "(?=/|$|[\\s)\\]}>#?&\\\"'])";
    return new RegExp(
      '(^|[^a-z0-9_-])' +
      escaped +
      trailingBoundary
    ).test(normalized);
  }) || null;
}

function firstSymlinkComponent(relativePath) {
  let current = ROOT;
  for (const segment of relativePath.split('/')) {
    current = path.join(current, segment);
    if (!fs.existsSync(current)) {
      return null;
    }
    if (fs.lstatSync(current).isSymbolicLink()) {
      return toPosix(path.relative(ROOT, current));
    }
  }
  return null;
}

function readManifest() {
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
}

function stripFrontMatter(content) {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n(?:\r?\n)?/, '');
}

function listMarkdownFiles(relativeRoot) {
  const absoluteRoot = path.join(ROOT, relativeRoot);
  if (!fs.existsSync(absoluteRoot)) {
    return [];
  }

  const files = [];
  const visit = (absoluteDir) => {
    for (const entry of fs.readdirSync(absoluteDir, { withFileTypes: true })) {
      const absolute = path.join(absoluteDir, entry.name);
      if (entry.isSymbolicLink()) {
        throw new Error(
          'Symlink is not allowed in content boundaries: ' +
          toPosix(path.relative(ROOT, absolute))
        );
      }
      if (
        entry.isDirectory() &&
        !['_site', '.jekyll-cache'].includes(entry.name)
      ) {
        visit(absolute);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(toPosix(path.relative(ROOT, absolute)));
      }
    }
  };
  visit(absoluteRoot);
  return files.sort();
}

function listPublicLinkSources(relativeRoot) {
  const absoluteRoot = path.join(ROOT, relativeRoot);
  if (!fs.existsSync(absoluteRoot)) {
    return [];
  }

  const allowedExtensions = new Set([
    '.md',
    '.html',
    '.htm',
    '.yml',
    '.yaml',
    '.json'
  ]);
  const files = [];
  const visit = (absoluteDir) => {
    for (const entry of fs.readdirSync(absoluteDir, { withFileTypes: true })) {
      const absolute = path.join(absoluteDir, entry.name);
      if (entry.isSymbolicLink()) {
        throw new Error(
          'Symlink is not allowed in public content: ' +
          toPosix(path.relative(ROOT, absolute))
        );
      }
      if (
        entry.isDirectory() &&
        !['_site', '.jekyll-cache'].includes(entry.name)
      ) {
        visit(absolute);
      } else if (
        entry.isFile() &&
        allowedExtensions.has(path.extname(entry.name).toLowerCase())
      ) {
        files.push(toPosix(path.relative(ROOT, absolute)));
      }
    }
  };
  visit(absoluteRoot);
  return files.sort();
}

function buildRouteMap(manifest) {
  const routeMap = new Map();
  for (const canonical of listMarkdownFiles(manifest.canonicalRoot)) {
    const withoutExtension = canonical.slice(0, -3);
    routeMap.set(canonical, canonical);
    routeMap.set(withoutExtension, canonical);

    const relativeToDocs = path.posix.relative(manifest.canonicalRoot, canonical);
    const publicWithoutExtension = '/' + relativeToDocs.slice(0, -3);
    routeMap.set(publicWithoutExtension, canonical);

    if (path.posix.basename(canonical) === 'index.md') {
      const directory = path.posix.dirname(canonical);
      const publicDirectory = '/' + path.posix.relative(manifest.canonicalRoot, directory);
      routeMap.set(directory, canonical);
      routeMap.set(directory + '/', canonical);
      routeMap.set(publicDirectory, canonical);
      routeMap.set(publicDirectory + '/', canonical);
      if (directory === manifest.canonicalRoot) {
        routeMap.set('/', canonical);
      }
    }
  }
  return routeMap;
}

function splitHref(href) {
  const match = href.match(/^([^?#]*)([?#][\s\S]*)?$/);
  return {
    pathname: match ? match[1] : href,
    suffix: match && match[2] ? match[2] : ''
  };
}

function resolveCanonicalTarget(rawPath, canonicalPath, routeMap, canonicalRoot) {
  if (
    rawPath.length === 0 ||
    rawPath.startsWith('#') ||
    rawPath.startsWith('//') ||
    /^[a-z][a-z0-9+.-]*:/i.test(rawPath) ||
    rawPath.includes('{{') ||
    rawPath.includes('{%')
  ) {
    return null;
  }

  let candidate;
  if (rawPath.startsWith('/')) {
    candidate = rawPath;
  } else {
    candidate = path.posix.normalize(
      path.posix.join(path.posix.dirname(canonicalPath), rawPath)
    );
  }

  const candidates = [candidate];
  if (candidate.endsWith('/')) {
    candidates.push(candidate.slice(0, -1));
  }
  if (!candidate.endsWith('.md')) {
    candidates.push(candidate + '.md');
    candidates.push(candidate + '/index.md');
  }

  if (candidate.startsWith('/')) {
    const docsCandidate = canonicalRoot + candidate;
    candidates.push(
      docsCandidate,
      docsCandidate.replace(/\/$/, ''),
      docsCandidate + '/index.md'
    );
  }

  for (const key of candidates) {
    if (routeMap.has(key)) {
      return routeMap.get(key);
    }
  }
  return null;
}

function rewriteMarkdownLinks(content, canonicalPath, mirrorPath, manifest, routeMap) {
  const mirrorByCanonical = new Map(
    manifest.mirrors.map((item) => [item.canonical, item.mirror])
  );
  const lines = content.match(/[^\n]*\n|[^\n]+$/g) || [];
  let inFence = false;

  return lines.map((line) => {
    const trimmed = line.trimStart();
    if (/^(```|~~~)/.test(trimmed)) {
      inFence = !inFence;
      return line;
    }
    if (inFence) {
      return line;
    }

    return line.replace(
      /(!?\[[^\]]*\]\()(<[^>]+>|[^)\s]+)([^)]*)(\))/g,
      (match, prefix, wrappedHref, titlePart, closing) => {
        const angled = wrappedHref.startsWith('<') && wrappedHref.endsWith('>');
        const href = angled ? wrappedHref.slice(1, -1) : wrappedHref;
        const parts = splitHref(href);
        const canonicalTarget = resolveCanonicalTarget(
          parts.pathname,
          canonicalPath,
          routeMap,
          manifest.canonicalRoot
        );
        if (!canonicalTarget) {
          return match;
        }

        const destination = mirrorByCanonical.get(canonicalTarget) || canonicalTarget;
        let relative = path.posix.relative(
          path.posix.dirname(mirrorPath),
          destination
        );
        if (relative.length === 0) {
          relative = path.posix.basename(destination);
        }
        const rewritten = relative + parts.suffix;
        return (
          prefix +
          (angled ? '<' + rewritten + '>' : rewritten) +
          titlePart +
          closing
        );
      }
    );
  }).join('');
}

function expectedMirrorContent(item, manifest, routeMap) {
  const canonicalContent = fs.readFileSync(
    path.join(ROOT, item.canonical),
    'utf8'
  );
  return rewriteMarkdownLinks(
    stripFrontMatter(canonicalContent),
    item.canonical,
    item.mirror,
    manifest,
    routeMap
  );
}

function validateManifest(manifest) {
  const errors = [];
  const requiredArrays = ['mirrors', 'supplemental', 'archives', 'policyFiles'];

  if (manifest.version !== 1) {
    errors.push('content-boundaries.json version must be 1');
  }
  if (manifest.canonicalRoot !== 'docs') {
    errors.push('canonicalRoot must be docs');
  }
  if (manifest.archiveRoot !== 'archive/legacy-src') {
    errors.push('archiveRoot must be archive/legacy-src');
  }
  for (const key of requiredArrays) {
    if (!Array.isArray(manifest[key])) {
      errors.push(key + ' must be an array');
    }
  }
  if (errors.length > 0) {
    return errors;
  }

  const declaredPaths = [];
  for (const item of manifest.mirrors) {
    declaredPaths.push(item.canonical, item.mirror);
  }
  for (const item of manifest.archives) {
    declaredPaths.push(
      item.activePath,
      item.archivePath,
      ...item.replacements
    );
  }
  for (const item of manifest.supplemental) {
    declaredPaths.push(item.root);
  }
  declaredPaths.push(...manifest.policyFiles);

  for (const relativePath of declaredPaths) {
    if (!isSafeRelativePath(relativePath) || !pathInsideRoot(relativePath)) {
      errors.push('Unsafe or non-normalized path: ' + String(relativePath));
      continue;
    }
    const symlink = firstSymlinkComponent(relativePath);
    if (symlink) {
      errors.push(
        'Symlink is not allowed in a declared content path: ' +
        relativePath +
        ' (component: ' +
        symlink +
        ')'
      );
    }
  }

  const canonicalSet = new Set();
  const mirrorSet = new Set();
  for (const item of manifest.mirrors) {
    if (
      !isWithin(item.canonical, manifest.canonicalRoot) ||
      !item.canonical.endsWith('.md')
    ) {
      errors.push(
        'Canonical mirror source must be Markdown under docs/: ' +
        item.canonical
      );
    }
    if (
      !MIRROR_ROOTS.some((root) => isWithin(item.mirror, root)) ||
      !item.mirror.endsWith('.md')
    ) {
      errors.push(
        'Mirror destination must be Markdown under an approved mirror root: ' +
        item.mirror
      );
    }
    if (canonicalSet.has(item.canonical)) {
      errors.push('Duplicate canonical mirror source: ' + item.canonical);
    }
    if (mirrorSet.has(item.mirror)) {
      errors.push('Duplicate mirror destination: ' + item.mirror);
    }
    canonicalSet.add(item.canonical);
    mirrorSet.add(item.mirror);
  }

  for (const item of manifest.supplemental) {
    if (item.root !== SUPPLEMENTAL_ROOT) {
      errors.push(
        'Supplemental root must be exactly ' +
        SUPPLEMENTAL_ROOT +
        ': ' +
        item.root
      );
    }
  }

  for (const item of manifest.archives) {
    if (!isWithin(item.activePath, 'src')) {
      errors.push('Legacy active path must be under src/: ' + item.activePath);
    }
    if (!isWithin(item.archivePath, manifest.archiveRoot)) {
      errors.push(
        'Archive path must be under ' +
        manifest.archiveRoot +
        ': ' +
        item.archivePath
      );
    }
    for (const replacement of item.replacements) {
      if (!isWithin(replacement, manifest.canonicalRoot)) {
        errors.push(
          'Canonical replacement must be under docs/: ' + replacement
        );
      }
    }
  }

  return errors;
}

function validateRepository(manifest) {
  const errors = validateManifest(manifest);
  if (errors.length > 0) {
    return errors;
  }

  const routeMap = buildRouteMap(manifest);
  const mirrorSet = new Set(manifest.mirrors.map((item) => item.mirror));

  for (const item of manifest.mirrors) {
    const canonical = path.join(ROOT, item.canonical);
    const mirror = path.join(ROOT, item.mirror);
    if (!fs.existsSync(canonical) || !fs.statSync(canonical).isFile()) {
      errors.push('Missing canonical file: ' + item.canonical);
      continue;
    }
    if (!fs.existsSync(mirror) || !fs.statSync(mirror).isFile()) {
      errors.push('Missing mirror file: ' + item.mirror);
      continue;
    }
    const expected = expectedMirrorContent(item, manifest, routeMap);
    const actual = fs.readFileSync(mirror, 'utf8');
    if (actual !== expected) {
      errors.push(
        'Mirror drift: ' + item.mirror +
        ' (run npm run sync:content-mirrors after editing ' +
        item.canonical +
        ')'
      );
    }
  }

  const supplementalRoots = manifest.supplemental.map((item) => item.root);
  for (const item of manifest.supplemental) {
    const absolute = path.join(ROOT, item.root);
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isDirectory()) {
      errors.push('Missing supplemental root: ' + item.root);
      continue;
    }
    if (item.published !== false || item.generated !== false) {
      errors.push(
        'Supplemental root must be non-published and manually maintained: ' +
        item.root
      );
    }
    const supplementalFiles = listMarkdownFiles(item.root);
    if (supplementalFiles.length === 0) {
      errors.push('Supplemental root has no Markdown files: ' + item.root);
    }
    for (const supplementalFile of supplementalFiles) {
      if (
        !fs.readFileSync(path.join(ROOT, supplementalFile), 'utf8')
          .includes(SUPPLEMENTAL_MARKER)
      ) {
        errors.push(
          'Supplemental file is missing its boundary marker: ' +
          supplementalFile
        );
      }
    }
  }

  for (const srcFile of listMarkdownFiles('src')) {
    const inSupplemental = supplementalRoots.some(
      (root) => srcFile === root || srcFile.startsWith(root + '/')
    );
    if (!mirrorSet.has(srcFile) && !inSupplemental) {
      errors.push('Unclassified active src Markdown: ' + srcFile);
    }
  }

  const publicPolicyFiles = listPublicLinkSources(
    manifest.canonicalRoot
  );
  const forbiddenPublicRoots = ['src', manifest.archiveRoot];
  for (const publicFile of publicPolicyFiles) {
    const absolute = path.join(ROOT, publicFile);
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
      continue;
    }
    const forbidden = hasForbiddenPublicReference(
      fs.readFileSync(absolute, 'utf8'),
      forbiddenPublicRoots
    );
    if (forbidden) {
      errors.push(
        'Published content must not link to non-canonical root ' +
        forbidden +
        ': ' +
        publicFile
      );
    }
  }

  for (const item of manifest.archives) {
    const active = path.join(ROOT, item.activePath);
    const archived = path.join(ROOT, item.archivePath);
    if (fs.existsSync(active)) {
      errors.push('Legacy active path must not exist: ' + item.activePath);
    }
    if (!fs.existsSync(archived) || !fs.statSync(archived).isFile()) {
      errors.push('Missing archived file: ' + item.archivePath);
    } else {
      const archivedContent = fs.readFileSync(archived, 'utf8');
      if (!archivedContent.includes(ARCHIVE_MARKER)) {
        errors.push(
          'Archived file is missing its boundary marker: ' + item.archivePath
        );
      }
      for (const phrase of ['非正本', '非公開', '更新対象外']) {
        if (!archivedContent.includes(phrase)) {
          errors.push(
            'Archived file is missing label ' +
            phrase +
            ': ' +
            item.archivePath
          );
        }
      }
    }
    for (const replacement of item.replacements) {
      if (!fs.existsSync(path.join(ROOT, replacement))) {
        errors.push('Missing canonical replacement: ' + replacement);
      }
    }
  }

  const archiveReadme = path.join(ROOT, manifest.archiveRoot, 'README.md');
  if (
    !fs.existsSync(archiveReadme) ||
    !fs.readFileSync(archiveReadme, 'utf8').includes(ARCHIVE_MARKER)
  ) {
    errors.push('Archive README is missing its boundary marker');
  }

  for (const policyFile of manifest.policyFiles) {
    const absolute = path.join(ROOT, policyFile);
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
      errors.push('Missing policy file: ' + policyFile);
    } else if (
      !fs.readFileSync(absolute, 'utf8').includes(POLICY_MARKER)
    ) {
      errors.push(
        'Policy file is missing its canonical boundary marker: ' + policyFile
      );
    }
  }

  const workflow = path.join(ROOT, '.github/workflows/book-qa.yml');
  if (
    !fs.existsSync(workflow) ||
    !fs.readFileSync(workflow, 'utf8').includes(
      'npm run check:content-boundaries'
    )
  ) {
    errors.push('Book QA must run npm run check:content-boundaries');
  }

  const packageJson = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')
  );
  const scripts = packageJson.scripts || {};
  if (
    scripts['sync:content-mirrors'] !==
    'node scripts/check-content-boundaries.js --write'
  ) {
    errors.push(
      'package.json sync:content-mirrors script is missing or incorrect'
    );
  }
  if (
    scripts['check:content-boundaries'] !==
    'node scripts/check-content-boundaries.js'
  ) {
    errors.push(
      'package.json check:content-boundaries script is missing or incorrect'
    );
  }
  if (
    scripts['test:content-boundaries'] !==
    'node scripts/check-content-boundaries.js --self-test'
  ) {
    errors.push(
      'package.json test:content-boundaries script is missing or incorrect'
    );
  }

  return errors;
}

function writeMirrors(manifest) {
  const manifestErrors = validateManifest(manifest);
  if (manifestErrors.length > 0) {
    throw new Error(manifestErrors.join('\n'));
  }

  const routeMap = buildRouteMap(manifest);
  let changed = 0;
  for (const item of manifest.mirrors) {
    const expected = expectedMirrorContent(item, manifest, routeMap);
    const absoluteMirror = path.join(ROOT, item.mirror);
    const actual = fs.existsSync(absoluteMirror)
      ? fs.readFileSync(absoluteMirror, 'utf8')
      : null;
    if (actual !== expected) {
      fs.mkdirSync(path.dirname(absoluteMirror), { recursive: true });
      fs.writeFileSync(absoluteMirror, expected, 'utf8');
      changed += 1;
      console.log('updated: ' + item.mirror);
    }
  }
  console.log(
    'OK: synchronized ' +
    manifest.mirrors.length +
    ' content mirrors (' +
    changed +
    ' changed)'
  );
}

function runSelfTest() {
  assert.strictEqual(
    stripFrontMatter('---\ntitle: x\n---\n\n# Heading\n'),
    '# Heading\n'
  );
  assert.strictEqual(stripFrontMatter('# Heading\n'), '# Heading\n');
  assert.strictEqual(
    isSafeRelativePath('docs/chapters/chapter01/index.md'),
    true
  );
  assert.strictEqual(isSafeRelativePath('../outside.md'), false);
  assert.strictEqual(isSafeRelativePath('/absolute.md'), false);
  assert.strictEqual(isSafeRelativePath('docs\\chapter.md'), false);
  assert.strictEqual(
    isWithin('src/chapters/chapter01.md', 'src/chapters'),
    true
  );
  assert.strictEqual(
    isWithin('.git/hooks/post-commit', 'src/chapters'),
    false
  );
  assert.strictEqual(
    hasForbiddenPublicReference(
      '[old](https://github.com/x/y/blob/main/archive%2Flegacy-src/a.md)',
      ['src', 'archive/legacy-src']
    ),
    'archive/legacy-src'
  );
  assert.strictEqual(
    hasForbiddenPublicReference(
      '[root](https://github.com/x/y/tree/main/src)',
      ['src']
    ),
    'src'
  );
  assert.strictEqual(
    hasForbiddenPublicReference(
      '[archive](https://github.com/x/y/tree/main/archive/legacy-src)',
      ['archive/legacy-src']
    ),
    'archive/legacy-src'
  );
  assert.strictEqual(
    hasForbiddenPublicReference('[canonical](/chapters/chapter01/)', ['src']),
    null
  );

  const fixtureManifest = {
    canonicalRoot: 'docs',
    mirrors: [
      {
        canonical: 'docs/chapters/chapter01/index.md',
        mirror: 'src/chapters/chapter01.md'
      },
      {
        canonical: 'docs/chapters/chapter02/index.md',
        mirror: 'src/chapters/chapter02.md'
      }
    ]
  };
  const fixtureRoutes = new Map([
    [
      'docs/chapters/chapter02',
      'docs/chapters/chapter02/index.md'
    ],
    [
      'docs/chapters/chapter02/',
      'docs/chapters/chapter02/index.md'
    ],
    [
      'docs/introduction/guide',
      'docs/introduction/guide/index.md'
    ],
    [
      'docs/introduction/guide/',
      'docs/introduction/guide/index.md'
    ]
  ]);
  const fixture = [
    '[next](../chapter02/)',
    '[guide](../../introduction/guide/#step)',
    '[external](https://example.com/)',
    '[anchor](#local)',
    '```text',
    '[code](../chapter02/)',
    '```',
    ''
  ].join('\n');
  const rewritten = rewriteMarkdownLinks(
    fixture,
    'docs/chapters/chapter01/index.md',
    'src/chapters/chapter01.md',
    fixtureManifest,
    fixtureRoutes
  );
  assert.strictEqual(
    rewritten,
    [
      '[next](chapter02.md)',
      '[guide](../../docs/introduction/guide/index.md#step)',
      '[external](https://example.com/)',
      '[anchor](#local)',
      '```text',
      '[code](../chapter02/)',
      '```',
      ''
    ].join('\n')
  );

  console.log(
    'OK: content boundary self-test passed ' +
    '(path classes, public links, front matter, mirror links, fences)'
  );
}

function main() {
  const args = new Set(process.argv.slice(2));
  if (args.has('--self-test')) {
    runSelfTest();
    return;
  }

  const manifest = readManifest();
  if (args.has('--write')) {
    writeMirrors(manifest);
    return;
  }

  const errors = validateRepository(manifest);
  if (errors.length > 0) {
    for (const error of errors) {
      console.error('ERROR: ' + error);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    'OK: content boundaries are consistent (' +
    manifest.mirrors.length +
    ' mirrors, ' +
    manifest.supplemental.length +
    ' supplemental root, ' +
    manifest.archives.length +
    ' archived files)'
  );
}

main();
