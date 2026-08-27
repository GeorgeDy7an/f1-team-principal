const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'index.html');
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

const html = fs.readFileSync(htmlPath, 'utf8');
const scripts = [...html.matchAll(/<script(?:[^>]*)>[\s\S]*?<\/script>/g)];
if (scripts.length !== sourceNames.length) {
  throw new Error(`Expected ${sourceNames.length} embedded scripts, found ${scripts.length}`);
}

const first = scripts[0];
const last = scripts[scripts.length - 1];
const prefix = html.slice(0, first.index);
const suffix = html.slice(last.index + last[0].length);
const blocks = sourceNames.map((name) => {
  const source = fs.readFileSync(path.join(root, 'src', name), 'utf8').trimEnd();
  return `<script>\n${source}\n</script>`;
});

const output = `${prefix}${blocks.join('\n')}${suffix}`;
fs.writeFileSync(htmlPath, output, 'utf8');
console.log(`Built index.html (${Buffer.byteLength(output, 'utf8')} bytes)`);

