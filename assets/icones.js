/* SUS É TOP — biblioteca de ícones SVG (traço, 24x24, herda currentColor)
   Uso: <span data-ico="livro"></span>  ou  ICO.svg('livro', 22)
   Desenhados no padrão line/rounded (stroke 1.7), sem dependência externa. */

(function () {
  'use strict';

  var P = {
    /* ---------- navegação ---------- */
    casa:      '<path d="M3 10.2 12 3l9 7.2"/><path d="M5.5 9.4V20a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.4"/><path d="M9.6 21v-6.2h4.8V21"/>',
    livros:    '<path d="M4 4.5v15"/><path d="M8 7v12.5"/><path d="M12 5.5v14"/><path d="m16.2 6.2 3.8 13.3"/><path d="M3 20.5h18"/>',
    duvida:    '<circle cx="12" cy="12" r="9"/><path d="M9.2 9.3a2.9 2.9 0 0 1 5.6 1c0 1.9-2.8 2.4-2.8 4"/><path d="M12 17.3h.01"/>',
    ciclo:     '<path d="M20.5 12a8.5 8.5 0 0 1-14.6 5.9L3.5 15.6"/><path d="M3.5 12a8.5 8.5 0 0 1 14.6-5.9l2.4 2.3"/><path d="M20.5 3.9v4.5H16"/><path d="M3.5 20.1v-4.5H8"/>',
    grafico:   '<path d="M3.5 3.5v15a2 2 0 0 0 2 2h15"/><path d="M8 16.5v-4"/><path d="M12.5 16.5V8"/><path d="M17 16.5v-6.5"/>',

    /* ---------- capítulos / matérias ---------- */
    balanca:   '<path d="M12 3.5v17"/><path d="M7 20.5h10"/><path d="M4.6 6.6 12 5l7.4 1.6"/><path d="M4.6 6.6 2 13.2h5.2z"/><path d="M19.4 6.6 16.8 13.2H22z"/><path d="M2 13.2a2.6 2.6 0 0 0 5.2 0"/><path d="M16.8 13.2a2.6 2.6 0 0 0 5.2 0"/>',
    livro:     '<path d="M4 5.2A2.2 2.2 0 0 1 6.2 3H19a1 1 0 0 1 1 1v13.4"/><path d="M6.2 17.4H20v2.4a1.2 1.2 0 0 1-1.2 1.2H6.2A2.2 2.2 0 0 1 4 18.8V5.2"/><path d="M8 8h8"/><path d="M8 11.5h5.5"/>',
    urna:      '<path d="M5 7.2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2V19H5z"/><path d="m9.2 11.8 2 2 3.6-3.7"/><path d="M2.5 19h19"/>',
    alvo:      '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.3"/>',
    rede:      '<circle cx="12" cy="4.8" r="2.2"/><circle cx="5" cy="19.2" r="2.2"/><circle cx="19" cy="19.2" r="2.2"/><path d="M12 7v3.4"/><path d="M6.4 17.4 10.6 12h2.8l4.2 5.4"/><path d="M10.6 12h2.8"/>',
    hospital:  '<path d="M4 20.5h16"/><path d="M5.5 20.5V6.2a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v14.3"/><path d="M12 8.2v4.6"/><path d="M9.7 10.5h4.6"/><path d="M10 20.5v-3.8h4v3.8"/>',
    maos:      '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a3 3 0 0 0-4.2 0l-.9.9a1 1 0 1 1-3-3l2.8-2.8a5.8 5.8 0 0 1 7.1-.9l.5.3a2 2 0 0 0 1.4.3L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',

    /* ---------- novas matérias ---------- */
    texto:     '<path d="M5 6.5V4.5h14v2"/><path d="M12 4.5v15"/><path d="M9 19.5h6"/>',
    cerebro:   '<path d="M12 5.2a3.1 3.1 0 0 0-5.6 1.4A2.9 2.9 0 0 0 4 9.4a2.9 2.9 0 0 0 1 2.2A3 3 0 0 0 4.6 14a3 3 0 0 0 3 3 3 3 0 0 0 4.4 1.6z"/><path d="M12 5.2a3.1 3.1 0 0 1 5.6 1.4A2.9 2.9 0 0 1 20 9.4a2.9 2.9 0 0 1-1 2.2 3 3 0 0 1 .4 2.4 3 3 0 0 1-3 3 3 3 0 0 1-4.4 1.6z"/><path d="M12 5.2v13.4"/>',
    monitor:   '<rect x="2.8" y="4" width="18.4" height="12.4" rx="1.8"/><path d="M8.5 20.5h7"/><path d="M12 16.4v4.1"/>',
    jornal:    '<path d="M3.5 5.6h13.2v13.6a1.8 1.8 0 0 1-1.8 1.8H5.3a1.8 1.8 0 0 1-1.8-1.8z"/><path d="M16.7 8.4h2.2a1.6 1.6 0 0 1 1.6 1.6v9.2a1.8 1.8 0 0 1-1.8 1.8"/><path d="M6.4 9h7.4"/><path d="M6.4 12.4h7.4"/><path d="M6.4 15.8h4.6"/>',
    escudo:    '<path d="M12 21c4.4-1.8 7-5.2 7-9.4V5.9L12 3 5 5.9v5.7C5 15.8 7.6 19.2 12 21z"/><path d="m9.2 11.8 2 2 3.6-3.7"/>',
    pulso:     '<path d="M2.8 12.5h4l2-4.4 3.2 8.2 2.4-5 1.6 3.2h5.2"/>',
    seringa:   '<path d="m15.4 3.6 5 5"/><path d="m18.2 6.4-9.8 9.8-3.9 1.3 1.3-3.9 9.8-9.8"/><path d="m11 8.6 4.4 4.4"/><path d="m4.5 17.5-2 2"/><path d="m9.6 10 1.6 1.6"/><path d="m12.4 7.2 1.6 1.6"/>',
    curativo:  '<rect x="2.6" y="8.2" width="18.8" height="7.6" rx="3.8" transform="rotate(-45 12 12)"/><path d="m8.6 8.6 6.8 6.8"/><path d="M10.4 12h.01M12 10.4h.01M12 13.6h.01M13.6 12h.01"/>',
    pessoas:   '<circle cx="9" cy="8.2" r="3.2"/><path d="M3.4 19.6a5.8 5.8 0 0 1 11.2 0"/><path d="M16.2 5.4a3.2 3.2 0 0 1 0 5.9"/><path d="M17.6 14.6a5.8 5.8 0 0 1 3 4.6"/>',
    coracao:   '<path d="M12 20.3s-7.6-4.5-7.6-9.7A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.6 3c0 5.2-7.6 9.7-7.6 9.7z"/><path d="M4.9 12.6h3l1.4-2.4 1.9 4 1.4-2.7 1 1.1h5.2"/>',
    ambulancia:'<path d="M2.6 16.4V7.6a1 1 0 0 1 1-1h9.6v9.8"/><path d="M13.2 9.6h3.4l3.8 3.5v3.3"/><path d="M2.6 16.4h1.7M9.4 16.4h4.6M18.9 16.4h1.5"/><circle cx="6.6" cy="17.6" r="1.9"/><circle cx="16.6" cy="17.6" r="1.9"/><path d="M7.9 10.2v3.2M6.3 11.8h3.2"/>',
    etica:     '<path d="M6.5 3.5h8.2l3.8 3.8v13.2H6.5z"/><path d="M14.4 3.5v4h4"/><path d="M9.4 12.4h5.6M9.4 15.6h5.6"/>',

    /* ---------- interface ---------- */
    busca:     '<circle cx="10.8" cy="10.8" r="6.6"/><path d="m20 20-4.5-4.5"/>',
    filtros:   '<path d="M5 6.5h14M8 12h11M11.5 17.5h7.5"/><circle cx="5" cy="12" r="1.6"/><circle cx="8.5" cy="17.5" r="1.6"/>',
    sino:      '<path d="M6.4 10.2a5.6 5.6 0 0 1 11.2 0c0 4.2 1.5 5.6 1.5 5.6H4.9s1.5-1.4 1.5-5.6z"/><path d="M10.2 19a2 2 0 0 0 3.6 0"/>',
    tema:      '<circle cx="12" cy="12" r="8.4"/><path d="M12 3.6v16.8a8.4 8.4 0 0 0 0-16.8z" fill="currentColor" stroke="none"/>',
    baixar:    '<path d="M12 3.8v11.4"/><path d="m7.6 11 4.4 4.3 4.4-4.3"/><path d="M4.5 19.5h15"/>',
    fogo:      '<path d="M8.6 14.7A2.5 2.5 0 0 0 11 12.1c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.4-2.3 1-3a2.5 2.5 0 0 0 2.6 2.6z"/>',
    relogio:   '<circle cx="12" cy="12" r="8.6"/><path d="M12 7.2V12l3.2 1.9"/>',
    pdf:       '<path d="M6.5 3.5h8.2l3.8 3.8v13.2H6.5z"/><path d="M14.4 3.5v4h4"/><path d="M9.6 16.5v-4h1.4a1.3 1.3 0 0 1 0 2.6H9.6"/><path d="M14 16.5v-4h1.1a2 2 0 0 1 0 4z"/>'
  };

  function svg(nome, tam){
    var d = P[nome];
    if (!d) return '';
    return '<svg class="ico-svg" viewBox="0 0 24 24" width="' + (tam || 24) + '" height="' + (tam || 24) +
      '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      d + '</svg>';
  }

  /* preenche todo [data-ico] presente na página */
  function hidratar(raiz){
    (raiz || document).querySelectorAll('[data-ico]').forEach(function(el){
      if (el.firstElementChild && el.firstElementChild.tagName.toLowerCase() === 'svg') return;
      el.innerHTML = svg(el.getAttribute('data-ico'), +el.getAttribute('data-ico-tam') || 24);
    });
  }

  window.ICO = { svg: svg, hidratar: hidratar, nomes: Object.keys(P) };
  document.addEventListener('DOMContentLoaded', function(){ hidratar(); });
})();
