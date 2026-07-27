const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif', '.bmp', '.ico']);

function listerFichiers(dossier, filtre) {
  const resultats = [];
  fs.readdirSync(dossier, { withFileTypes: true }).forEach(function(entree) {
    const chemin = path.join(dossier, entree.name);
    if (entree.isDirectory()) resultats.push(...listerFichiers(chemin, filtre));
    else if (!filtre || filtre(chemin)) resultats.push(chemin);
  });
  return resultats;
}

function cheminRelatif(chemin) {
  return path.relative(root, chemin).split(path.sep).join('/');
}

const sourcesExecution = [
  path.join(root, 'index.html'),
  path.join(root, 'style.css'),
  path.join(root, 'jeu.js'),
  ...listerFichiers(path.join(root, 'js'), function(chemin) { return chemin.endsWith('.js'); })
];

const motifImage = /\bimg\/[A-Za-z0-9_./ ()'-]+\.(?:png|jpe?g|gif|webp|svg|avif|bmp|ico)/gi;
const references = new Set();

sourcesExecution.forEach(function(fichier) {
  const source = fs.readFileSync(fichier, 'utf8');
  Array.from(source.matchAll(motifImage)).forEach(function(match) {
    references.add(match[0].replace(/\\/g, '/'));
  });
});

const fichiersImages = listerFichiers(path.join(root, 'img'), function(chemin) {
  return imageExtensions.has(path.extname(chemin).toLowerCase());
});

function existeAvecCasseExacte(cheminRelatifImage) {
  let dossier = root;
  for (const segment of cheminRelatifImage.split('/')) {
    const noms = fs.readdirSync(dossier);
    if (!noms.includes(segment)) return false;
    dossier = path.join(dossier, segment);
  }
  return true;
}

function signatureValide(fichier) {
  const extension = path.extname(fichier).toLowerCase();
  const contenu = fs.readFileSync(fichier);
  const debut = contenu.subarray(0, 16);

  if (extension === '.png') return debut.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'));
  if (extension === '.jpg' || extension === '.jpeg') return debut[0] === 0xff && debut[1] === 0xd8;
  if (extension === '.gif') return debut.toString('ascii', 0, 4) === 'GIF8';
  if (extension === '.webp') return debut.toString('ascii', 0, 4) === 'RIFF' && debut.toString('ascii', 8, 12) === 'WEBP';
  if (extension === '.bmp') return debut.toString('ascii', 0, 2) === 'BM';
  if (extension === '.ico') return debut.subarray(0, 4).equals(Buffer.from('00000100', 'hex'));
  if (extension === '.avif') return debut.toString('ascii', 4, 8) === 'ftyp';
  if (extension === '.svg') return contenu.toString('utf8', 0, Math.min(contenu.length, 512)).includes('<svg');
  return false;
}

test('every runtime image reference resolves to an existing file', function() {
  assert.ok(references.size > 0);
  const manquantes = Array.from(references).filter(function(reference) {
    return !fs.existsSync(path.join(root, ...reference.split('/')));
  });
  assert.deepEqual(manquantes, []);
});

test('runtime image paths use the exact on-disk letter case', function() {
  const erreursCasse = Array.from(references).filter(function(reference) {
    return !existeAvecCasseExacte(reference);
  });
  assert.deepEqual(erreursCasse, []);
});

test('image extensions match valid file signatures', function() {
  const invalides = fichiersImages.filter(function(fichier) {
    return !signatureValide(fichier);
  }).map(cheminRelatif);
  assert.deepEqual(invalides, []);
});

test('runtime code does not depend on staging or backup image folders', function() {
  const dossiersHorsJeu = ['img/Backupo/', 'img/CHATGPT Instructions/', 'img/To be converted/'];
  const referencesHorsJeu = Array.from(references).filter(function(reference) {
    return dossiersHorsJeu.some(function(prefixe) { return reference.startsWith(prefixe); });
  });
  assert.deepEqual(referencesHorsJeu, []);
});

