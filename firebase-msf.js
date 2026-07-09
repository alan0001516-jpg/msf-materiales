// Conexión compartida a Firebase/Firestore para el sitio MSF y el panel admin.
// Se carga vía <script> clásico en el helmet de cada DC (usa el SDK "compat" de Firebase,
// que expone el global `firebase`, apto para código no-módulo).
(function () {
  if (window.__msfDb) return; // ya inicializado (evita doble init si el DC recarga en caliente)

  var firebaseConfig = {
    apiKey: "AIzaSyD0keM5Sahm2ohz1fc_Y4dZzfsumTVjrmw",
    authDomain: "msf-materiales.firebaseapp.com",
    projectId: "msf-materiales",
    storageBucket: "msf-materiales.firebasestorage.app",
    messagingSenderId: "715514570277",
    appId: "1:715514570277:web:4a8211920abfff8258c1cc"
  };

  function init() {
    if (window.__msfDb) return;
    if (!window.firebase || typeof window.firebase.firestore !== 'function') return; // todavía no cargó firestore-compat; una carga en curso lo llamará de nuevo
    var app = window.firebase.apps && window.firebase.apps.length ? window.firebase.app() : window.firebase.initializeApp(firebaseConfig);
    window.__msfDb = window.firebase.firestore();
    window.dispatchEvent(new Event('msf-firebase-ready'));
  }

  // Evita que el helmet dispare esta carga más de una vez (streaming del DC puede re-ejecutar el <script>).
  if (window.__msfFirebaseLoading) { init(); return; }
  window.__msfFirebaseLoading = true;

  if (window.firebase && typeof window.firebase.firestore === 'function') { init(); return; }

  // Cargar los scripts compat de Firebase dinámicamente si todavía no están.
  var s1 = document.createElement('script');
  s1.src = 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js';
  s1.onload = function () {
    var s2 = document.createElement('script');
    s2.src = 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js';
    s2.onload = init;
    document.head.appendChild(s2);
  };
  document.head.appendChild(s1);
})();
