import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import config from '../vivliostyle.config.js';

// Inspect the actual PDFs rather than treating a successful renderer exit as proof.
for (const book of config) {
  const pdf = readFileSync(book.output);
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-', book.output);
  const info = execFileSync('pdfinfo', [book.output], { encoding: 'utf8' });
  assert.match(info, /Pages:\s+[1-9]\d*/, `${book.output}: no pages`);
  const dimensions = info.match(/Page size:\s+([\d.]+) x ([\d.]+)/);
  assert.ok(dimensions, `${book.output}: missing page dimensions`);
  assert.ok(Math.abs(Number(dimensions[1]) - 297.64) < 2, 'Expected A6 width');
  assert.ok(Math.abs(Number(dimensions[2]) - 419.53) < 2, 'Expected A6 height');
  const fonts = execFileSync('pdffonts', [book.output], { encoding: 'utf8' });
  assert.match(fonts, /NotoSerifJP/, `${book.output}: Japanese font missing`);
  const fontLines = fonts.trim().split('\n').slice(2);
  assert.ok(fontLines.length > 0, `${book.output}: no embedded text fonts`);
  for (const line of fontLines) {
    assert.match(line, /\s+yes\s+(?:yes|no)\s+yes\s+\d+\s+\d+\s*$/, `Font must be embedded with Unicode mapping: ${line}`);
  }
  const text = execFileSync('pdftotext', [book.output, '-'], { encoding: 'utf8' }).replace(/\s/g, '');
  assert.ok(text.includes(book.title.replace(/\s/g, '')), `${book.output}: Japanese title missing`);
  console.log(`OK ${book.output}: A6, text extraction, embedded fonts`);
}
