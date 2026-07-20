#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const canonicalPath = 'docs/chapters/chapter02/index.md';
const answerPath = 'src/exercise-answers/chapter02-answers.md';
const packagePath = 'package.json';
const workflowPath = '.github/workflows/book-qa.yml';

const headingOrder = [
  '### 2.1.1 論証を読むための最小単位',
  '### 2.1.2 必要条件と十分条件を区別する',
  '### 2.1.3 相関と因果を区別する',
  '## 2.2 重要概念：6つの論理部品',
];

const expectedAggregateTestCommands = [
  // Keep the aggregate local QA order explicit. A new gate must update this
  // reviewed sequence instead of being inserted as an untracked shell command.
  'npm run test:content-boundaries',
  'npm run check:content-boundaries',
  'npm run test:chapter02-foundations',
  'npm run check:chapter02-foundations',
  'npm run test:case-study-01',
  'npm run check:case-study-01',
  'npm run test:ux-contract',
  'npm run check:metadata',
  'npm run check:ux-contract',
  'npm run lint',
  'npm run check-links',
];

const chapterMarkers = [
  '- **主張**: 正しい、または採用すべきだと読み手へ提示する文。',
  '- **前提**: 推論を始めるために置く条件。',
  '- **推論**: 前提や根拠から主張へ進む理由づけ。',
  '- **反例**: 主張が想定する範囲に含まれるのに、その主張が成立しない具体例。',
  '資料を1件示しただけでは推論を説明したことにならず、推論を書いただけでは根拠を確認したことになりません。',
  '- **必要条件**: その条件が欠けると、主張を成立させられない条件です。',
  '- **十分条件**: その条件を満たせば、定めた範囲では主張を成立させられる条件です。',
  '「必須テストが成功している」は、開始の**必要条件**ですが、単独では十分ではありません。',
  '3条件をすべて満たすことは、この通常手順の範囲では、開始の**十分条件**です。',
  '「テストが成功した。したがって開始できる」は、承認と時間帯を省略しているため成立しません。',
  '- **相関**: 2つの事象が同じ時期に変化するなど、連動して観察される関係です。',
  '- **因果**: 一方の変化が、一定の作用経路を通じて他方の変化を生じさせた関係です。',
  '同じ時期の製品変更、繁閑、利用者数、集計基準の変更など、別の説明があり得ます。',
  '因果を主張する前に、時間順序、作用経路、代替説明、比較材料を確認する',
  'この6部品は、前節の主張・前提・推論・反例を置き換える基礎論理の代替ではありません。',
  '判断可能な実務成果物へ適用するテンプレート',
  '### 演習2-5：条件不足・因果混同・反例候補を判定する',
  '2. Aの「必須テスト成功」は必要条件、十分条件のどちらとして扱うべきか説明してください。',
  '3. Bで確認できるのは相関と因果のどちらか、因果を検討するために何を追加確認するか説明してください。',
  '4. Cが反例候補になる理由と、元の主張をどのように修正すべきか説明してください。',
  '- **根拠**: 前提や主張を支える確認可能な材料。',
  '対象範囲、前提条件、測定方法が同じかを確認するまでは**反例候補**として扱い',
  '1. Aの主張、前提、根拠、推論を分け、不足している条件を挙げてください。',
  '論証の最小単位では、前提、根拠、推論、主張を分け、反例候補で適用範囲を検査します。',
  '通常の本番rolloutを開始できるのは、次の3条件をすべて満たす場合に限る。',
  '3条件をすべて満たせば、この通常手順では本番rolloutを開始できる。',
];

const answerMarkers = [
  '## 演習2-5：条件不足・因果混同・反例候補を判定する',
  '#### A：必要条件だけでは結論を出せない',
  '単独では**十分条件ではありません**',
  '#### B：相関から因果へ飛躍している',
  '- 共有会が問い合わせを減らす作用経路。',
  '- 製品変更、繁閑、利用者数、集計基準などの代替説明。',
  '- 導入前後の十分な時系列と、条件が近い比較対象。',
  '#### C：全称的な主張を見直す反例候補である',
  '少なくとも「すべて」という一般化は維持できません。',
  '### 判定基準',
  '- **前提**: 通常のrollout手順を適用し、その開始条件を満たせば開始できる。',
  '- **根拠**: 必須テストが成功した記録がある。',
  '| 論証の分解 | Aの主張、前提、根拠、推論を別々に示している |',
  '| 条件判定 | 必須テスト成功を必要条件とし、単独では十分でない理由と不足条件を示している |',
  '| 因果判定 | Bを相関に留め、作用経路、代替説明、比較材料の追加確認を示している |',
  '| 反例の扱い | Cが「すべて」という主張を崩す条件と、適用範囲を限定した修正文を示している |',
  '主張、前提、根拠、推論、反例候補を分けると、どこに確認が必要か特定できます。',
];

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

function count(text, marker) {
  return text.split(marker).length - 1;
}

function expectSingle(text, marker, label, errors) {
  const found = count(text, marker);
  if (found !== 1) errors.push(`${label}: expected one ${JSON.stringify(marker)}, found ${found}`);
}

function contractText(markdown) {
  const withoutComments = markdown.replace(/<!--[\s\S]*?-->/g, '');
  const visible = [];
  let fence = null;
  for (const line of withoutComments.split(/\r?\n/)) {
    const candidate = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (!fence && candidate) {
      fence = { character: candidate[1][0], length: candidate[1].length };
      continue;
    }
    if (fence && candidate && candidate[1][0] === fence.character
      && candidate[1].length >= fence.length) {
      fence = null;
      continue;
    }
    if (!fence) visible.push(line);
  }
  return visible.join('\n');
}

function validateContent(chapter, answers, label) {
  const errors = [];
  const chapterContract = contractText(chapter);
  const answerContract = contractText(answers);
  for (const marker of chapterMarkers) expectSingle(chapterContract, marker, `${label} chapter`, errors);
  for (const marker of answerMarkers) expectSingle(answerContract, marker, `${label} answers`, errors);

  let previous = -1;
  for (const heading of headingOrder) {
    const index = chapterContract.indexOf(heading);
    if (index === -1) {
      errors.push(`${label} chapter: missing ordered heading ${JSON.stringify(heading)}`);
    } else if (index <= previous) {
      errors.push(`${label} chapter: heading order is invalid at ${JSON.stringify(heading)}`);
    }
    previous = index;
  }

  const exercise = chapterContract.indexOf('### 演習2-5：条件不足・因果混同・反例候補を判定する');
  const understanding = chapterContract.indexOf('## 理解度チェック');
  if (exercise === -1 || understanding === -1 || exercise >= understanding) {
    errors.push(`${label} chapter: exercise 2-5 must precede the understanding check`);
  }
  const answerExercise = answerContract.indexOf('## 演習2-5：条件不足・因果混同・反例候補を判定する');
  const learningPoints = answerContract.indexOf('## 学習ポイント');
  if (answerExercise === -1 || learningPoints === -1 || answerExercise >= learningPoints) {
    errors.push(`${label} answers: exercise 2-5 answer and rubric must precede learning points`);
  }
  return errors;
}

function parseWorkflowSteps(workflow) {
  const lines = workflow.split(/\r?\n/);
  const starts = [];
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^(\s*)-\s+name:\s*(.*?)\s*$/);
    if (match && !lines[index].trimStart().startsWith('#')) {
      starts.push({ index, indent: match[1].length, name: match[2] });
    }
  }
  return starts.map((start) => {
    const next = starts.find((candidate) => candidate.index > start.index && candidate.indent <= start.indent);
    const body = lines.slice(start.index + 1, next ? next.index : lines.length)
      .filter((line) => !line.trimStart().startsWith('#'));
    return {
      name: start.name,
      run: body.map((line) => line.match(/^\s+run:\s*(.*?)\s*$/)).filter(Boolean).map((match) => match[1]),
      conditions: body.map((line) => line.match(/^\s+if:\s*(.*?)\s*$/)).filter(Boolean).map((match) => match[1]),
      continueOnError: body
        .map((line) => line.match(/^\s+continue-on-error:\s*(.*?)\s*$/))
        .filter(Boolean)
        .map((match) => match[1]),
    };
  });
}

function parseStrictAndChain(script, label, errors) {
  const raw = String(script || '');
  const withoutAnd = raw.replaceAll('&&', '');
  if (/[|;&\r\n]/.test(withoutAnd)) {
    errors.push(`${label}: only a fail-closed && command chain is allowed`);
  }
  const commands = raw.split(/\s*&&\s*/).map((command) => command.trim());
  if (commands.some((command) => !command)) errors.push(`${label}: empty command in && chain`);
  return commands;
}

function validateRepositoryContract(packageText, workflow, label) {
  const errors = [];
  let packageJson = {};
  try {
    packageJson = JSON.parse(packageText);
  } catch (error) {
    errors.push(`${label} ${packagePath}: invalid JSON: ${error.message}`);
  }
  const scripts = packageJson.scripts || {};
  const expectedScripts = {
    'check:chapter02-foundations': 'node scripts/check-chapter02-logic-foundations.js',
    'test:chapter02-foundations': 'node scripts/check-chapter02-logic-foundations.js --self-test',
  };
  const aggregateCommands = parseStrictAndChain(scripts.test, `${label} ${packagePath} scripts.test`, errors);
  if (JSON.stringify(aggregateCommands) !== JSON.stringify(expectedAggregateTestCommands)) {
    errors.push(`${label} ${packagePath}: scripts.test must preserve the reviewed exact aggregate command sequence`);
  }
  for (const [name, command] of Object.entries(expectedScripts)) {
    if (scripts[name] !== command) errors.push(`${label} ${packagePath}: ${name} must be ${command}`);
    const aggregateCommand = `npm run ${name}`;
    const occurrences = aggregateCommands.filter((item) => item === aggregateCommand).length;
    if (occurrences !== 1) {
      errors.push(`${label} ${packagePath}: scripts.test must contain exact command ${aggregateCommand} once`);
    }
  }
  const selfTestIndex = aggregateCommands.indexOf('npm run test:chapter02-foundations');
  const checkIndex = aggregateCommands.indexOf('npm run check:chapter02-foundations');
  if (selfTestIndex === -1 || checkIndex === -1 || selfTestIndex >= checkIndex) {
    errors.push(`${label} ${packagePath}: Chapter 2 self-test must precede the repository check`);
  }

  // Only the Chapter 2 gate is constrained here. Diagnostic upload steps may
  // legitimately use `if: always()` and are governed by the workflow itself.
  const steps = parseWorkflowSteps(workflow).filter((step) => step.name === 'Chapter 2 logic foundations contract');
  if (steps.length !== 1) {
    errors.push(`${label} ${workflowPath}: expected one active Chapter 2 contract step, found ${steps.length}`);
  } else {
    const wanted = ['npm run test:chapter02-foundations && npm run check:chapter02-foundations'];
    if (JSON.stringify(steps[0].run) !== JSON.stringify(wanted)) {
      errors.push(`${label} ${workflowPath}: Chapter 2 contract command drifted`);
    }
    if (steps[0].conditions.length) errors.push(`${label} ${workflowPath}: Chapter 2 contract step must not have an if condition`);
    if (steps[0].continueOnError.length) {
      errors.push(`${label} ${workflowPath}: Chapter 2 contract step must not set continue-on-error`);
    }
  }
  return errors;
}

function expectNegative(chapter, answers, mutate, expectedFragment, label) {
  const changed = mutate({ chapter, answers });
  if (changed.chapter === chapter && changed.answers === answers) throw new Error(`${label}: fixture did not change`);
  const errors = validateContent(changed.chapter, changed.answers, label);
  if (!errors.some((error) => error.includes(expectedFragment))) {
    throw new Error(`${label}: expected ${JSON.stringify(expectedFragment)}, got ${JSON.stringify(errors)}`);
  }
}

function runSelfTest(chapter, answers, packageText, workflow) {
  const baseErrors = [
    ...validateContent(chapter, answers, 'canonical'),
    ...validateRepositoryContract(packageText, workflow, 'canonical'),
  ];
  if (baseErrors.length) throw new Error(`canonical contract is invalid: ${JSON.stringify(baseErrors)}`);

  const cases = [
    ['missing minimum-unit heading', 'ordered heading', ({ chapter: text, answers: a }) => ({ chapter: text.replace(headingOrder[0], '### 導入'), answers: a })],
    ['missing claim definition', '主張', ({ chapter: text, answers: a }) => ({ chapter: text.replace(chapterMarkers[0], '- 主張の説明を省略する。'), answers: a })],
    ['necessary condition relabeled', '必要条件', ({ chapter: text, answers: a }) => ({ chapter: text.replace(chapterMarkers[7], '必須テストの成功だけで開始できる。'), answers: a })],
    ['sufficient condition omitted', '十分条件', ({ chapter: text, answers: a }) => ({ chapter: text.replace(chapterMarkers[8], '3条件の関係は説明しない。'), answers: a })],
    ['causal check omitted', '時間順序', ({ chapter: text, answers: a }) => ({ chapter: text.replace(chapterMarkers[13], '因果とみなす。'), answers: a })],
    ['six-part boundary omitted', '基礎論理の代替', ({ chapter: text, answers: a }) => ({ chapter: text.replace(chapterMarkers[14], 'この6部品を使います。'), answers: a })],
    ['exercise omitted', '演習2-5', ({ chapter: text, answers: a }) => ({ chapter: text.replace(chapterMarkers[16], '### 追加演習'), answers: a })],
    ['rubric row omitted', '反例の扱い', ({ chapter: text, answers: a }) => ({
      chapter: text,
      answers: a.replace(answerMarkers.find((marker) => marker.startsWith('| 反例の扱い |')), '| 反例 | 確認する |'),
    })],
    ['commented definition is inactive', '主張', ({ chapter: text, answers: a }) => ({ chapter: text.replace(chapterMarkers[0], `<!-- ${chapterMarkers[0]} -->`), answers: a })],
    ['fenced exercise is inactive', '演習2-5', ({ chapter: text, answers: a }) => ({ chapter: text.replace(chapterMarkers[16], `\`\`\`text\n${chapterMarkers[16]}\n\`\`\``), answers: a })],
    ['only-if rollout rule omitted', '場合に限る', ({ chapter: text, answers: a }) => ({
      chapter: text.replace(
        '通常の本番rolloutを開始できるのは、次の3条件をすべて満たす場合に限る。',
        '通常の本番rolloutは、次の3条件をすべて満たしたときに開始できる。',
      ),
      answers: a,
    })],
  ];
  for (const [label, expectedFragment, mutate] of cases) {
    expectNegative(chapter, answers, mutate, expectedFragment, label);
  }

  const packageJson = JSON.parse(packageText);
  const mutationParseErrors = [];
  const aggregateFixture = parseStrictAndChain(
    packageJson.scripts.test, 'self-test aggregate fixture', mutationParseErrors,
  );
  if (mutationParseErrors.length) {
    throw new Error(`self-test aggregate fixture is invalid: ${JSON.stringify(mutationParseErrors)}`);
  }
  packageJson.scripts.test = aggregateFixture
    .filter((command) => command !== 'npm run test:chapter02-foundations')
    .join(' && ');
  const packageErrors = validateRepositoryContract(JSON.stringify(packageJson), workflow, 'package negative');
  if (!packageErrors.some((error) => error.includes('exact command npm run test:chapter02-foundations once'))) {
    throw new Error(`package negative: expected missing self-test error, got ${JSON.stringify(packageErrors)}`);
  }
  const failOpenPackageJson = JSON.parse(packageText);
  failOpenPackageJson.scripts.test = aggregateFixture
    .map((command) => command === 'npm run test:chapter02-foundations' ? `${command} || true` : command)
    .join(' && ');
  const failOpenPackageErrors = validateRepositoryContract(
    JSON.stringify(failOpenPackageJson), workflow, 'package fail-open negative',
  );
  if (!failOpenPackageErrors.some((error) => error.includes('only a fail-closed && command chain is allowed'))) {
    throw new Error(`package fail-open negative: expected shell-operator error, got ${JSON.stringify(failOpenPackageErrors)}`);
  }
  const extraCommandPackageJson = JSON.parse(packageText);
  extraCommandPackageJson.scripts.test = ['echo preflight', ...aggregateFixture].join(' && ');
  const extraCommandErrors = validateRepositoryContract(
    JSON.stringify(extraCommandPackageJson), workflow, 'package extra-command negative',
  );
  if (!extraCommandErrors.some((error) => error.includes('reviewed exact aggregate command sequence'))) {
    throw new Error(`package extra-command negative: expected aggregate-sequence error, got ${JSON.stringify(extraCommandErrors)}`);
  }
  const reorderedPackageJson = JSON.parse(packageText);
  const chapterCommands = new Set([
    'npm run test:chapter02-foundations',
    'npm run check:chapter02-foundations',
  ]);
  reorderedPackageJson.scripts.test = [
    ...aggregateFixture.filter((command) => !chapterCommands.has(command)),
    ...aggregateFixture.filter((command) => chapterCommands.has(command)),
  ].join(' && ');
  const reorderedPackageErrors = validateRepositoryContract(
    JSON.stringify(reorderedPackageJson), workflow, 'package reordered negative',
  );
  if (!reorderedPackageErrors.some((error) => error.includes('reviewed exact aggregate command sequence'))) {
    throw new Error(`package reordered negative: expected aggregate-sequence error, got ${JSON.stringify(reorderedPackageErrors)}`);
  }
  const commentedWorkflow = workflow.replace(
    '      - name: Chapter 2 logic foundations contract',
    '      # - name: Chapter 2 logic foundations contract',
  );
  const workflowErrors = validateRepositoryContract(packageText, commentedWorkflow, 'workflow negative');
  if (!workflowErrors.some((error) => error.includes('expected one active Chapter 2 contract step'))) {
    throw new Error(`workflow negative: expected inactive-step error, got ${JSON.stringify(workflowErrors)}`);
  }
  const continueOnErrorWorkflow = workflow.replace(
    '      - name: Chapter 2 logic foundations contract',
    '      - name: Chapter 2 logic foundations contract\n        continue-on-error: true',
  );
  const continueOnErrorErrors = validateRepositoryContract(
    packageText, continueOnErrorWorkflow, 'workflow continue-on-error negative',
  );
  if (!continueOnErrorErrors.some((error) => error.includes('must not set continue-on-error'))) {
    throw new Error(`workflow continue-on-error negative: expected fail-open error, got ${JSON.stringify(continueOnErrorErrors)}`);
  }
  const conditionalWorkflow = workflow.replace(
    '      - name: Chapter 2 logic foundations contract',
    '      - name: Chapter 2 logic foundations contract\n        if: false',
  );
  const conditionalErrors = validateRepositoryContract(packageText, conditionalWorkflow, 'workflow condition negative');
  if (!conditionalErrors.some((error) => error.includes('must not have an if condition'))) {
    throw new Error(`workflow condition negative: expected conditional-step error, got ${JSON.stringify(conditionalErrors)}`);
  }
  console.log(`OK: Chapter 2 logic foundations self-test (${cases.length} content negatives, 7 repository negatives)`);
}

const chapter = read(canonicalPath);
const answers = read(answerPath);
const packageText = read(packagePath);
const workflow = read(workflowPath);

if (process.argv.includes('--self-test')) {
  try {
    runSelfTest(chapter, answers, packageText, workflow);
  } catch (error) {
    console.error(`Chapter 2 logic foundations self-test failed: ${error.message}`);
    process.exit(1);
  }
} else {
  const errors = [
    ...validateContent(chapter, answers, 'repository'),
    ...validateRepositoryContract(packageText, workflow, 'repository'),
  ];
  if (errors.length) {
    console.error(`Chapter 2 logic foundations contract failed with ${errors.length} issue(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log('OK: Chapter 2 teaches minimum arguments, condition tests, causal caution, and exercise/rubric alignment');
}
