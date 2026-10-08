import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toArtifactHtml } from '../scripts/build-artifact.mjs';

const page = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Dünyanın en güzel perfüzyonisti</title>
<link rel="stylesheet" href="css/styles.css">
<script type="module" src="js/main.js"></script>
</head>
<body>
<header class="topbar">x</header>
</body>
</html>
`;

test('belge iskeleti çıkarılır, başlık en üstte kalır, içerik korunur', () => {
  const out = toArtifactHtml(page);
  assert.ok(out.startsWith('<title>Dünyanın en güzel perfüzyonisti</title>'));
  assert.doesNotMatch(out, /<!doctype|<html|<head>|<\/head>|<body|<\/body>|<\/html>|<meta charset|name="viewport"/i);
  assert.ok(out.includes('<header class="topbar">x</header>'));
  assert.ok(out.includes('<link rel="stylesheet" href="css/styles.css">'));
  assert.ok(out.includes('<script type="module" src="js/main.js"></script>'));
});

test('artifact kapsayıcısında Türkçe belge dili korunur', () => {
  const out = toArtifactHtml(page);
  assert.match(out, /<div lang="tr">/);
  assert.ok(out.includes('<header class="topbar">x</header>'));
  assert.ok(out.trimEnd().endsWith('</div>'));
});
