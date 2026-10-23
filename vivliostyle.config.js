import { readdirSync, readFileSync } from 'node:fs';

// One PDF per manuscript. Keep design documents outside novels/.
const manuscripts = readdirSync('novels').filter((name) => name.endsWith('.md')).sort();
if (!manuscripts.length) throw new Error('novels/ に Markdown 原稿がありません。');

export default manuscripts.map((name) => {
  const source = readFileSync(`novels/${name}`, 'utf8');
  const title = source.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (!title) throw new Error(`${name}: 作品名を「# 作品名」で指定してください。`);
  return {
    title,
    language: 'ja',
    readingProgression: 'rtl',
    entry: `novels/${name}`,
    theme: 'styles/novel.css',
    size: '105mm,148mm',
    output: `dist/${name.slice(0, -3)}.pdf`,
    workspaceDir: `.vivliostyle/${name.slice(0, -3)}`,
    vfm: { hardLineBreaks: false },
  };
});
