const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const cssPath = path.join(root, 'style.css');
const css = fs.readFileSync(cssPath, 'utf8');
const sansCommentaires = css.replace(/\/\*[\s\S]*?\*\//g, '');

function reglesFeuilles(source) {
  return Array.from(source.matchAll(/([^{}]+)\{([^{}]*)\}/g), function(match) {
    return {
      selecteur: match[1].replace(/\s+/g, ' ').trim(),
      corps: match[2].trim()
    };
  }).filter(function(rule) {
    return rule.selecteur && !rule.selecteur.startsWith('@');
  });
}

test('stylesheet has balanced blocks and no empty rules', function() {
  const openings = (sansCommentaires.match(/\{/g) || []).length;
  const closings = (sansCommentaires.match(/\}/g) || []).length;
  assert.equal(openings, closings);

  const empty = reglesFeuilles(sansCommentaires).filter(function(rule) {
    return rule.corps.length === 0;
  }).map(function(rule) { return rule.selecteur; });
  assert.deepEqual(empty, []);
});

test('base stylesheet has no exact duplicate selectors', function() {
  const mediaStart = sansCommentaires.indexOf('@media (min-width: 769px)');
  assert.notEqual(mediaStart, -1);
  const selectors = reglesFeuilles(sansCommentaires.slice(0, mediaStart)).map(function(rule) {
    return rule.selecteur;
  });
  const duplicates = selectors.filter(function(selector, index) {
    return selectors.indexOf(selector) !== index;
  });
  assert.deepEqual(Array.from(new Set(duplicates)), []);
});

test('every custom property reference is defined or has a fallback', function() {
  const defined = new Set(Array.from(sansCommentaires.matchAll(/(--[\w-]+)\s*:/g), function(match) {
    return match[1];
  }));
  const unresolved = [];
  Array.from(sansCommentaires.matchAll(/var\((--[\w-]+)([^)]*)\)/g)).forEach(function(match) {
    const name = match[1];
    const hasFallback = match[2].includes(',');
    if (!defined.has(name) && !hasFallback) unresolved.push(name);
  });
  assert.deepEqual(Array.from(new Set(unresolved)), []);
});

test('rules do not redeclare the same property inside one block', function() {
  const duplicates = [];
  reglesFeuilles(sansCommentaires).forEach(function(rule) {
    const properties = Array.from(rule.corps.matchAll(/(?:^|;)\s*([\w-]+)\s*:/g), function(match) {
      return match[1];
    });
    properties.forEach(function(property, index) {
      if (properties.indexOf(property) !== index) duplicates.push(rule.selecteur + ':' + property);
    });
  });
  assert.deepEqual(Array.from(new Set(duplicates)), []);
});

test('every local CSS asset URL resolves to an existing file', function() {
  const missing = [];
  Array.from(css.matchAll(/url\((['"]?)([^)'"\s]+(?: [^)'"\s]+)*)\1\)/g)).forEach(function(match) {
    const url = match[2];
    if (/^(?:https?:|data:|#)/i.test(url)) return;
    const clean = decodeURIComponent(url.split('?')[0].split('#')[0]);
    const absolute = path.resolve(path.dirname(cssPath), clean);
    if (!fs.existsSync(absolute)) missing.push(clean);
  });
  assert.deepEqual(missing, []);
});
