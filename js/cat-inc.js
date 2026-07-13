(function(root) {
  "use strict";

  // Shared namespace for classic scripts. Keeping one public object avoids
  // adding every extracted function directly to the browser global scope.
  if (!root.CatInc) root.CatInc = {};
})(typeof window !== "undefined" ? window : globalThis);
