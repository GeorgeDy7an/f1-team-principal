const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const sourceNames = [
  'f1_decision_engine_v01.js',
  'f1_personality_engine_v01.js',
  'f1_career_engine_v01.js',
  'f1_recruitment_engine_v01.js',
  'f1_contract_engine_v01.js',
  'f1_team_engine_v01.js',
  'f1_legacy_engine_v01.js',
  'f1_achievement_engine_v01.js',
  'f1_app_v02.js',
];

assert(!html.includes('\uFFFD'), 'index.html contains a Unicode replacement character');
assert(Buffer.byteLength(html, 'utf8') < 1024 * 1024, 'single-file build unexpectedly exceeds 1 MiB');

for (const label of ['F1 Team Principal', '商业价值', '车手状态', '成就']) {
  assert(html.includes(label), `missing required label: ${label}`);
}

const blocks = [...html.matchAll(/<script(?:[^>]*)>([\s\S]*?)<\/script>/g)];
assert.strictEqual(blocks.length, sourceNames.length, 'unexpected embedded script count');

sourceNames.forEach((name, index) => {
  const source = fs.readFileSync(path.join(root, 'src', name), 'utf8').trimEnd();
  const embedded = blocks[index][1].replace(/^\n/, '').replace(/\n$/, '');
  assert.strictEqual(embedded, source, `${name} differs from its embedded copy`);
  new vm.Script(source, { filename: name });
});

console.log(`Smoke test passed: ${sourceNames.length} modules, UTF-8 clean, single-file build synchronized.`);
