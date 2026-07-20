#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const root = path.resolve(__dirname, '..');
const canonicalPath = 'docs/additional/case-study-01-executive-summary/index.md';
const packagePath = 'package.json';
const workflowPath = '.github/workflows/book-qa.yml';
const fence = String.fromCharCode(96).repeat(3);

const expected = {
  ai: {
    headings: [
      '1. 暫定判断（第1段階の承認依頼）',
      '2. 確認済みの事実',
      '3. 増加要因（仮説 / 要確認）',
      '4. 選択肢比較',
      '5. 第1段階の確認計画',
      '6. 二段階の承認ゲート',
      '7. 人間が確認すべき点',
    ],
    opening: [
      '今決めること: 主要サービス別・部門別の内訳を確認し、A/B/Cの選択条件を評価する確認フェーズの開始です。',
      'この承認にはA/B/Cいずれの施策実行も含めません。',
      '確認後に決めること: 第2段階で、確認結果に基づきA案、B案、C案、または保留を選びます。',
      'C案は、新規利用の統制と既存利用の見直しの両方が必要で、後述の最低条件を満たした場合の第一候補です。現時点では削減率を約束できる根拠はありません。',
    ],
    facts: [
      '直近3か月のクラウド利用費は、8.5M円、9.7M円、11.2M円と増加しています。',
      '主要サービス別・部門別の内訳は未確定です。',
      '削減率や年間効果を約束できる根拠はありません。',
    ],
    assumptions: [
      '予約購入の未活用',
      '停止忘れ',
      '過剰スペック',
      '検証環境の残存',
    ],
    questions: [
      '主要サービス別・部門別の内訳',
      '継続利用が必要なリソースと不要なリソースの区分',
      '契約・会計への影響',
      'セキュリティ・可用性・業務への影響',
    ],
    conditions: {
      'A案を選ぶ条件': [
        '確認結果から、新規利用の統制を先に整える必要性が高いと判断できる。',
        '既存リソースの削除影響が未確認で、棚卸し施策を先行承認できない。',
      ],
      'B案を選ぶ条件': [
        '確認結果から、既存リソースの見直しを先に進める必要性が高いと判断できる。',
        '新規利用は既存ルールで管理できると確認できる。',
      ],
      'C案を選べる最低条件': [
        '新規利用の統制と既存利用の見直しの両方が必要と確認できる。',
        '契約・会計、セキュリティ・可用性に重大な阻害要因がない。',
        '施策オーナー、部門協力、例外承認の体制を確保できる。',
      ],
      '保留条件': [
        '内訳データの精度が判断に足りない。',
        '契約・会計、セキュリティ・可用性、業務影響の確認が未了である。',
        '施策オーナーまたは関係部門の責任分担が未確定である。',
      ],
    },
    approvals: {
      '今決めること（第1段階）': [
        '確認フェーズを開始する。',
        'IT運用責任者を確認責任者とし、CFO、事業責任者、調達、セキュリティ担当へ協力を依頼する。',
        'この承認にはA/B/Cいずれの施策実行も含めません。',
      ],
      '確認後に決めること（第2段階）': [
        '確認済みの事実と条件充足状況に基づき、A/B/C/保留を承認する。',
        '選んだ案の対象範囲、例外、実行責任者、監視方法を承認する。',
      ],
      '承認を止める条件': [
        '内訳、契約・会計、セキュリティ・可用性、業務影響のいずれかが判断に足りない。',
        '施策オーナー、部門協力、例外承認の体制を確保できない。',
      ],
    },
  },
  final: {
    headings: [
      '1. 本日承認いただきたいこと（第1段階）',
      '2. 確認後に承認いただきたいこと（第2段階）',
      '3. 現状（確認済みの事実）',
      '4. 増加要因（仮説 / 要確認）',
      '5. 選択肢比較',
      '6. 確認フェーズの計画',
      '7. 承認を止める条件',
      '8. 留意事項',
    ],
    firstStage: [
      '今決めること: 主要サービス別・部門別の内訳と、A/B/Cの選択条件を評価する確認フェーズの開始です。',
      '- IT運用責任者を確認責任者とする。',
      '- CFO、事業責任者、調達、セキュリティ担当へ確認協力を依頼する。',
      '- 4週目を目安に、条件充足状況と残課題を経営会議へ再提出する。',
      'この承認にはA/B/Cいずれの施策実行も含めません。',
    ],
    secondStage: [
      '確認後に決めること: 確認済みの事実と条件充足状況に基づき、A案、B案、C案、または保留を選びます。',
      'C案は最低条件を満たした場合の第一候補であり、現時点の実行推奨ではありません。第2段階では、選んだ案の対象範囲、例外、実行責任者、監視方法も承認します。',
    ],
    facts: [
      '直近3か月のクラウド利用費は、8.5M円 → 9.7M円 → 11.2M円と増加しています。',
      '主要サービス別・部門別の内訳は未確定です。',
      '現時点では、削減率や年間効果を約束できる根拠はありません。',
    ],
    assumptions: [
      '予約購入の未活用',
      '停止忘れ',
      '過剰スペック',
      '検証環境の残存',
    ],
    questions: [
      '主要サービス別・部門別の内訳',
      '継続利用が必要なリソースと不要なリソースの区分',
      '契約・会計への影響',
      'セキュリティ・可用性・業務への影響',
    ],
    conditions: {
      'A案を選ぶ条件': [
        '新規利用の統制を先に整える必要性が高いと確認できる。',
        '既存リソースの削除影響が未確認で、棚卸し施策を先行承認できない。',
      ],
      'B案を選ぶ条件': [
        '既存リソースの見直しを先に進める必要性が高いと確認できる。',
        '新規利用は既存ルールで管理できると確認できる。',
      ],
      'C案を選べる最低条件': [
        '主要サービス別・部門別の内訳から、新規利用の統制と既存利用の見直しの両方が必要と確認できる。',
        '契約・会計、セキュリティ・可用性、業務影響に重大な阻害要因がない。',
        '施策オーナー、部門協力、例外承認の体制を確保できる。',
      ],
      '保留条件': [
        '内訳データの精度が判断に足りない。',
        '契約・会計、セキュリティ・可用性、業務影響の確認が未了である。',
        '施策オーナーまたは関係部門の責任分担が未確定である。',
      ],
    },
    stopConditions: [
      '確認済みの事実と仮説が混在し、要確認事項を分離できていない。',
      '内訳、契約・会計、セキュリティ・可用性、業務影響のいずれかが判断に足りない。',
      '施策オーナー、部門協力、例外承認の体制を確保できない。',
      'A/B/Cの選択理由と残リスクを経営会議へ説明できない。',
    ],
  },
};

function readText(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

function normalizeLines(text) {
  return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function equal(actual, wanted) {
  return JSON.stringify(actual) === JSON.stringify(wanted);
}

function expectEqual(actual, wanted, label, errors) {
  if (!equal(actual, wanted)) {
    errors.push(label + ': expected ' + JSON.stringify(wanted) + ', got ' + JSON.stringify(actual));
  }
}

function extractBetween(text, startMarker, endMarker, label, errors) {
  const start = text.indexOf(startMarker);
  if (start === -1) {
    errors.push(label + ': missing start marker ' + JSON.stringify(startMarker));
    return '';
  }
  const end = text.indexOf(endMarker, start + startMarker.length);
  if (end === -1) {
    errors.push(label + ': missing end marker ' + JSON.stringify(endMarker));
    return '';
  }
  return text.slice(start, end);
}

function extractSingleTextFence(text, sectionStart, sectionEnd, label, errors) {
  const section = extractBetween(text, sectionStart, sectionEnd, label, errors);
  const lines = section.split(/\r?\n/);
  const starts = [];
  const ends = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index].trim() === fence + 'text') starts.push(index);
    if (lines[index].trim() === fence) ends.push(index);
  }
  if (starts.length !== 1 || ends.length !== 1 || ends[0] <= starts[0]) {
    errors.push(label + ': expected exactly one closed text fence');
    return '';
  }
  return lines.slice(starts[0] + 1, ends[0]).join('\n');
}

function parseHeadings(block, label, errors) {
  const lines = block.split(/\r?\n/);
  const headings = [];
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^(#{2,3})\s+(.+?)\s*$/);
    if (!match) continue;
    headings.push({ level: match[1].length, title: match[2], index });
  }
  const top = headings.filter((heading) => heading.level === 2).map((heading) => heading.title);
  if (new Set(top).size !== top.length) {
    errors.push(label + ': duplicate top-level heading');
  }
  return { lines, headings, top };
}

function sectionByHeading(parsed, level, title, label, errors) {
  const matches = parsed.headings.filter((heading) => heading.level === level && heading.title === title);
  if (matches.length !== 1) {
    errors.push(label + ': expected one heading ' + JSON.stringify(title) + ', found ' + matches.length);
    return '';
  }
  const start = matches[0];
  const next = parsed.headings.find(
    (heading) => heading.index > start.index && heading.level <= level,
  );
  return parsed.lines.slice(start.index + 1, next ? next.index : parsed.lines.length).join('\n');
}

function exactBullets(section, wanted, label, errors) {
  const lines = normalizeLines(section);
  const malformed = lines.filter((line) => !line.startsWith('- '));
  if (malformed.length) {
    errors.push(label + ': non-bullet content is not allowed: ' + JSON.stringify(malformed));
  }
  expectEqual(lines.map((line) => line.replace(/^-\s+/, '')), wanted, label, errors);
}

function exactBody(section, wanted, label, errors) {
  expectEqual(normalizeLines(section), wanted, label, errors);
}

function parseLabeledBullets(section, labels, label, errors) {
  const result = Object.fromEntries(labels.map((item) => [item, []]));
  let current = null;
  for (const line of normalizeLines(section)) {
    if (labels.includes(line)) {
      current = line;
      continue;
    }
    if (!current || !line.startsWith('- ')) {
      errors.push(label + ': unexpected content ' + JSON.stringify(line));
      continue;
    }
    result[current].push(line.replace(/^-\s+/, ''));
  }
  for (const item of labels) {
    if (!result[item].length) errors.push(label + ': empty or missing label ' + item);
  }
  return result;
}

function validateArtifact(block, kind, label, errors) {
  const parsed = parseHeadings(block, label, errors);
  const contract = expected[kind];
  expectEqual(parsed.top, contract.headings, label + ' top-level heading order', errors);

  if (kind === 'ai') {
    exactBody(
      sectionByHeading(parsed, 2, contract.headings[0], label, errors),
      contract.opening,
      label + ' opening',
      errors,
    );
    exactBullets(
      sectionByHeading(parsed, 2, contract.headings[1], label, errors),
      contract.facts,
      label + ' confirmed facts',
      errors,
    );
  } else {
    exactBody(
      sectionByHeading(parsed, 2, contract.headings[0], label, errors),
      contract.firstStage,
      label + ' first-stage approval',
      errors,
    );
    exactBody(
      sectionByHeading(parsed, 2, contract.headings[1], label, errors),
      contract.secondStage,
      label + ' second-stage approval',
      errors,
    );
    exactBullets(
      sectionByHeading(parsed, 2, contract.headings[2], label, errors),
      contract.facts,
      label + ' confirmed facts',
      errors,
    );
  }

  const claimsHeading = kind === 'ai' ? contract.headings[2] : contract.headings[3];
  const claims = parseLabeledBullets(
    sectionByHeading(parsed, 2, claimsHeading, label, errors),
    ['仮説:', '要確認:'],
    label + ' assumptions/open questions',
    errors,
  );
  expectEqual(claims['仮説:'], contract.assumptions, label + ' assumptions', errors);
  expectEqual(claims['要確認:'], contract.questions, label + ' open questions', errors);

  const optionsHeading = kind === 'ai' ? contract.headings[3] : contract.headings[4];
  for (const [heading, wanted] of Object.entries(contract.conditions)) {
    exactBullets(
      sectionByHeading(parsed, 3, heading, label + ' options', errors),
      wanted,
      label + ' ' + heading,
      errors,
    );
  }

  if (kind === 'ai') {
    for (const [heading, wanted] of Object.entries(contract.approvals)) {
      exactBullets(
        sectionByHeading(parsed, 3, heading, label + ' approval gate', errors),
        wanted,
        label + ' ' + heading,
        errors,
      );
    }
  } else {
    exactBullets(
      sectionByHeading(parsed, 2, contract.headings[6], label, errors),
      contract.stopConditions,
      label + ' stop conditions',
      errors,
    );
  }

  const dangerous = [
    /C案で進める/,
    /C案を(?:直ちに|今すぐ)?(?:実行|承認|推奨)/,
    /(?:推奨|承認)(?:案)?(?:は|:|：)\s*C案/,
    /C案[^。\n]{0,50}(?:を実行する|を先行承認する|で進めること)/,
  ];
  for (const pattern of dangerous) {
    if (pattern.test(block)) {
      errors.push(label + ': unconditional C execution language matched ' + pattern);
    }
  }
}

function validateContent(text, label) {
  const errors = [];
  const ai = extractSingleTextFence(
    text,
    '### 6.2 改善後出力（AIのたたき台）',
    '## 7. 最終成果物',
    label + ' AI draft',
    errors,
  );
  const finalArtifact = extractSingleTextFence(
    text,
    '## 7. 最終成果物',
    '## 8. 人間が確認すべき点',
    label + ' final artifact',
    errors,
  );
  if (ai) validateArtifact(ai, 'ai', label + ' AI draft', errors);
  if (finalArtifact) validateArtifact(finalArtifact, 'final', label + ' final artifact', errors);
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
    const next = starts.find(
      (candidate) => candidate.index > start.index && candidate.indent <= start.indent,
    );
    const body = lines.slice(start.index + 1, next ? next.index : lines.length)
      .filter((line) => !line.trimStart().startsWith('#'));
    const run = body
      .map((line) => line.match(/^\s+run:\s*(.*?)\s*$/))
      .filter(Boolean)
      .map((match) => match[1]);
    const conditions = body
      .map((line) => line.match(/^\s+if:\s*(.*?)\s*$/))
      .filter(Boolean)
      .map((match) => match[1]);
    return { name: start.name, run, conditions };
  });
}

function validateRepositoryContract(packageText, workflow, label) {
  const errors = [];
  let packageJson = {};
  try {
    packageJson = JSON.parse(packageText);
  } catch (error) {
    errors.push(label + ' ' + packagePath + ': ' + error.message);
  }
  const scripts = packageJson.scripts || {};
  if (scripts['check:case-study-01'] !== 'node scripts/check-case-study-01-decision-gate.js') {
    errors.push(label + ' ' + packagePath + ': scripts.check:case-study-01 is not the reviewed checker command');
  }
  if (scripts['test:case-study-01'] !== 'node scripts/check-case-study-01-decision-gate.js --self-test') {
    errors.push(label + ' ' + packagePath + ': scripts.test:case-study-01 is not the reviewed self-test command');
  }
  for (const scriptName of ['test:case-study-01', 'check:case-study-01']) {
    const occurrences = String(scripts.test || '').split('npm run ' + scriptName).length - 1;
    if (occurrences !== 1) {
      errors.push(label + ' ' + packagePath + ': scripts.test must run npm run ' + scriptName + ' exactly once');
    }
  }

  const steps = parseWorkflowSteps(workflow)
    .filter((step) => step.name === 'Case study 01 decision-gate contract');
  if (steps.length !== 1) {
    errors.push(label + ' ' + workflowPath + ': expected exactly one active decision-gate step, found ' + steps.length);
  } else {
    expectEqual(
      steps[0].run,
      ['npm run test:case-study-01 && npm run check:case-study-01'],
      label + ' workflow decision-gate run command',
      errors,
    );
    if (steps[0].conditions.some((condition) => /(?:false|cancelled|failure)/i.test(condition))) {
      errors.push(label + ' ' + workflowPath + ': decision-gate step has a disabling condition');
    }
  }
  return errors;
}

function expectNegative(base, mutate, expectedFragment, label) {
  const mutated = mutate(base);
  if (mutated === base) throw new Error(label + ': mutation did not change the fixture');
  const errors = validateContent(mutated, label);
  if (!errors.some((error) => error.includes(expectedFragment))) {
    throw new Error(
      label + ': expected error containing ' + JSON.stringify(expectedFragment)
      + ', got ' + JSON.stringify(errors),
    );
  }
}

function runSelfTest(canonical, packageText, workflow) {
  const canonicalErrors = [
    ...validateContent(canonical, 'canonical'),
    ...validateRepositoryContract(packageText, workflow, 'canonical'),
  ];
  if (canonicalErrors.length) {
    throw new Error('canonical fixture or repository contract is invalid: ' + JSON.stringify(canonicalErrors));
  }

  const contentCases = [
    {
      label: 'missing non-execution boundary',
      expectedFragment: 'first-stage approval',
      mutate: (text) => text.replaceAll(
        'この承認にはA/B/Cいずれの施策実行も含めません。',
        '確認後に施策を実行します。',
      ),
    },
    {
      label: 'unconditional C rewording',
      expectedFragment: 'second-stage approval',
      mutate: (text) => text.replace(
        'C案は最低条件を満たした場合の第一候補であり、現時点の実行推奨ではありません。',
        'C案は最低条件を満たした場合の第一候補です。',
      ),
    },
    {
      label: 'fabricated confirmed fact',
      expectedFragment: 'confirmed facts',
      mutate: (text) => text.replace(
        '- 主要サービス別・部門別の内訳は未確定です。',
        '- 主要サービス別・部門別の内訳は未確定です。\n- 主要サービス別ではコンピュートが増加の中心です。',
      ),
    },
    {
      label: 'misplaced hold phrases',
      expectedFragment: '保留条件',
      mutate: (text) => text.replace(
        '- 内訳データの精度が判断に足りない。\n'
        + '- 契約・会計、セキュリティ・可用性、業務影響の確認が未了である。\n'
        + '- 施策オーナーまたは関係部門の責任分担が未確定である。',
        '- 補足: 内訳、契約・会計、セキュリティ・可用性、施策オーナーという語を脚注として残す。',
      ),
    },
    {
      label: 'lost assumption classification',
      expectedFragment: 'assumptions',
      mutate: (text) => text.replace('- 予約購入の未活用', '- 予約購入を実施する'),
    },
    {
      label: 'unconditional C execution',
      expectedFragment: 'unconditional C execution language',
      mutate: (text) => text.replace(
        'C案は、新規利用の統制と既存利用の見直しの両方が必要で、後述の最低条件を満たした場合の第一候補です。',
        'C案で進めることを承認してください。',
      ),
    },
  ];
  for (const item of contentCases) {
    expectNegative(canonical, item.mutate, item.expectedFragment, item.label);
  }

  const disabledWorkflow = workflow.replace(
    '      - name: Case study 01 decision-gate contract\n'
    + '        run: npm run test:case-study-01 && npm run check:case-study-01',
    '      - name: Case study 01 decision-gate contract\n'
    + '        # run: npm run test:case-study-01 && npm run check:case-study-01\n'
    + '        run: echo skipped',
  );
  const workflowErrors = validateRepositoryContract(packageText, disabledWorkflow, 'disabled workflow');
  if (!workflowErrors.some((error) => error.includes('workflow decision-gate run command'))) {
    throw new Error('disabled workflow: expected structured run-command rejection, got ' + JSON.stringify(workflowErrors));
  }

  console.log(
    'OK: case study 01 decision-gate self-test passed ('
    + contentCases.length + ' content negatives, 1 workflow negative)',
  );
}

function main() {
  const canonical = readText(canonicalPath);
  const packageText = readText(packagePath);
  const workflow = readText(workflowPath);
  if (process.argv.includes('--self-test')) {
    runSelfTest(canonical, packageText, workflow);
    return;
  }

  const errors = [
    ...validateContent(canonical, canonicalPath),
    ...validateRepositoryContract(packageText, workflow, 'repository'),
  ];
  if (errors.length) {
    console.error('Case study 01 decision-gate check failed with ' + errors.length + ' issue(s):');
    for (const error of errors) console.error('- ' + error);
    process.exit(1);
  }
  console.log('OK: case study 01 keeps structured two-stage conditional approval');
}

try {
  main();
} catch (error) {
  console.error('Case study 01 decision-gate check failed: ' + error.message);
  process.exit(1);
}
