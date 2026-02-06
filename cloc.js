/* eslint-disable no-undef */
import fs from 'fs';
import { exec } from 'child_process';

const outputDir = '.reports';
const outputFile = `${outputDir}/project-languages.md`;

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const cmd = `npx cloc . --exclude-dir=node_modules,package.json,package-lock.json,build --exclude-ext=json --json`;

exec(cmd, { maxBuffer: 20 * 1024 * 1024 }, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ cloc failed: ${error.message}`);
    return;
  }
  if (stderr && !/^\s*$/.test(stderr)) {
    // cloc sometimes prints notes to stderr; not fatal.
    console.warn(`ℹ️ cloc notes: ${stderr.trim()}`);
  }

  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch (e) {
    console.error('❌ Could not parse cloc JSON output.', e);
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { header, SUM, ...langs } = parsed;

  const rows = Object.entries(langs)
    .map(([lang, s]) => ({ lang, files: s.nFiles, blank: s.blank, comment: s.comment, code: s.code }))
    .sort((a, b) => b.code - a.code);

  // Compute column widths (left align language, right align numbers)
  const w = {
    lang: Math.max('Language'.length, ...rows.map((r) => r.lang.length), 'TOTAL'.length),
    files: Math.max('Files'.length, ...rows.map((r) => String(r.files).length), String(SUM.nFiles).length),
    blank: Math.max('Blank'.length, ...rows.map((r) => String(r.blank).length), String(SUM.blank).length),
    comment: Math.max('Comment'.length, ...rows.map((r) => String(r.comment).length), String(SUM.comment).length),
    code: Math.max('Code'.length, ...rows.map((r) => String(r.code).length), String(SUM.code).length),
  };

  const line = (char = '-') =>
    `|-${char.repeat(w.lang)}-|-${char.repeat(w.files)}-|-${char.repeat(w.blank)}-|-${char.repeat(w.comment)}-|-${char.repeat(w.code)}-|`;

  const headerLine = `| ${'Language'.padEnd(w.lang)} | ${'Files'.padStart(w.files)} | ${'Blank'.padStart(w.blank)} | ${'Comment'.padStart(w.comment)} | ${'Code'.padStart(w.code)} |`;

  const row = (r) =>
    `| ${r.lang.padEnd(w.lang)} | ${String(r.files).padStart(w.files)} | ${String(r.blank).padStart(w.blank)} | ${String(r.comment).padStart(w.comment)} | ${String(r.code).padStart(w.code)} |`;

  const total = `| ${'TOTAL'.padEnd(w.lang)} | ${String(SUM.nFiles).padStart(w.files)} | ${String(SUM.blank).padStart(w.blank)} | ${String(SUM.comment).padStart(w.comment)} | ${String(SUM.code).padStart(w.code)} |`;

  const asciiTable = [headerLine, line(), ...rows.map(row), line(), total].join('\n');

  const md = [
    '# 📊 Code Analysis Report',
    '',
    `Generated: ${new Date().toISOString()}\n\nIgnoring node_modules, package.json, package-lock.json`,
    '',
    '```text',
    asciiTable,
    '```',
    '',
  ].join('\n');

  fs.writeFileSync(outputFile, md);
  console.log(`✅ cloc report generated at ${outputFile}`);
});
