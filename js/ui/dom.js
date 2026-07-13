(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  const domParIdCache = new Map();
  const barreProgres = {};

  // Stable nodes are cached. Dynamic nodes replaced through innerHTML are
  // automatically looked up again once the old node is disconnected.
  function domParId(id) {
    let el = domParIdCache.get(id);
    if (!el || el.isConnected === false) {
      el = root.document.getElementById(id);
      if (el) domParIdCache.set(id, el);
      else domParIdCache.delete(id);
    }
    return el;
  }

  function ecrireTexte(el, valeur) {
    if (!el) return false;
    const texte = String(valeur);
    if (el.textContent === texte) return false;
    el.textContent = texte;
    return true;
  }

  function ecrireHTML(el, valeur) {
    if (!el || el.innerHTML === valeur) return false;
    el.innerHTML = valeur;
    return true;
  }

  function ecrireStyle(el, propriete, valeur) {
    if (!el || el.style[propriete] === valeur) return false;
    el.style[propriete] = valeur;
    return true;
  }

  function ecrirePropriete(el, propriete, valeur) {
    if (!el || el[propriete] === valeur) return false;
    el[propriete] = valeur;
    return true;
  }

  function ecrireVariableStyle(el, propriete, valeur) {
    if (!el) return false;
    const texte = String(valeur);
    if (el.style.getPropertyValue(propriete) === texte) return false;
    el.style.setProperty(propriete, texte);
    return true;
  }

  function basculerClasse(el, classe, active) {
    if (!el || el.classList.contains(classe) === active) return false;
    el.classList.toggle(classe, active);
    return true;
  }

  function setBarreProgress(id, ratio) {
    const el = domParId(id);
    if (!el) return;
    const pct = Math.min(ratio * 100, 100);
    const ancien = barreProgres[id] || 0;
    const largeur = pct + "%";
    if (pct === ancien && el.style.width === largeur) return;
    if (pct < ancien - 5) {
      el.style.transition = "none";
      el.style.width = largeur;
      el.getBoundingClientRect();
      el.style.transition = "";
    } else {
      ecrireStyle(el, "width", largeur);
    }
    barreProgres[id] = pct;
  }

  CatInc.dom = Object.freeze({
    domParId: domParId,
    ecrireTexte: ecrireTexte,
    ecrireHTML: ecrireHTML,
    ecrireStyle: ecrireStyle,
    ecrirePropriete: ecrirePropriete,
    ecrireVariableStyle: ecrireVariableStyle,
    basculerClasse: basculerClasse,
    setBarreProgress: setBarreProgress
  });
})(typeof window !== "undefined" ? window : globalThis);
