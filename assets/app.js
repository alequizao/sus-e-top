/* SUS É TOP — casco do app: app bar, tab bar, tela de detalhe em acordeão, tema, PWA e PDF */

(function () {
  'use strict';

  var CAPS = [
    { arq:'01-cf-194-195.html',                titulo:'CF/88 — arts. 194 e 195', curto:'CF/88',       ico:'balanca', cor:'b-menta'   },
    { arq:'02-lei-8080.html',                  titulo:'Lei nº 8.080/1990',       curto:'Lei 8.080',   ico:'livro', cor:'b-azul'    },
    { arq:'03-lei-8142.html',                  titulo:'Lei nº 8.142/1990',       curto:'Lei 8.142',   ico:'urna', cor:'b-roxo'    },
    { arq:'04-principios-diretrizes-sus.html', titulo:'Princípios e diretrizes', curto:'Princípios',  ico:'alvo', cor:'b-coral'   },
    { arq:'05-redes-atencao-saude.html',       titulo:'Redes de Atenção',        curto:'RAS',         ico:'rede', cor:'b-laranja' },
    { arq:'06-pnab.html',                      titulo:'PNAB',                    curto:'PNAB',        ico:'hospital', cor:'b-amarelo' },
    { arq:'07-humanizacao-seguranca.html',     titulo:'Humanização e segurança', curto:'Humanização', ico:'maos', cor:'b-rosa'    },
    { arq:'08-biosseguranca.html',             titulo:'Biossegurança e infecção', curto:'Biossegurança', ico:'escudo', cor:'b-menta'  },
    { arq:'09-sinais-vitais.html',             titulo:'Sinais vitais',            curto:'Sinais vitais', ico:'pulso',  cor:'b-coral'  },
    { arq:'10-medicamentos.html',              titulo:'Administração de medicamentos', curto:'Medicamentos', ico:'seringa', cor:'b-azul' },
    { arq:'11-curativos.html', titulo:'Curativos e feridas', curto:'Curativos', ico:'curativo', cor:'b-laranja' },
    { arq:'12-vacinacao.html', titulo:'Vacinação', curto:'Vacinação', ico:'seringa', cor:'b-menta' },
    { arq:'13-urgencia-emergencia.html', titulo:'Urgência e emergência', curto:'Urgência', ico:'ambulancia', cor:'b-vermelho' },
    { arq:'14-mulher-crianca.html', titulo:'Saúde da mulher e da criança', curto:'Mulher e criança', ico:'pessoas', cor:'b-rosa' },
    { arq:'15-adulto-idoso.html', titulo:'Saúde do adulto e do idoso', curto:'Adulto e idoso', ico:'coracao', cor:'b-coral' },
    { arq:'16-etica-enfermagem.html', titulo:'Ética em enfermagem', curto:'Ética', ico:'etica', cor:'b-roxo' },
    { arq:'17-fundamentos-sae.html', titulo:'Fundamentos e SAE', curto:'Fundamentos', ico:'livro', cor:'b-azul' },
    { arq:'18-portugues.html', titulo:'Língua Portuguesa', curto:'Português', ico:'texto', cor:'b-amarelo' },
    { arq:'19-raciocinio-logico.html', titulo:'Raciocínio Lógico', curto:'Rac. Lógico', ico:'cerebro', cor:'b-roxo' },
    { arq:'20-informatica.html', titulo:'Informática', curto:'Informática', ico:'monitor', cor:'b-azul' },
    { arq:'21-atualidades.html', titulo:'Atualidades', curto:'Atualidades', ico:'jornal', cor:'b-laranja' }
  ];

  var TABS = [
    { arq:'index.html',     ico:'casa', rot:'Início' },
    { arq:'estudos.html',   ico:'livros', rot:'Estudos', tambem: CAPS.map(function(c){ return c.arq; }).concat(['apostila-completa.html','categorias.html']) },
    { arq:'quiz.html',      ico:'duvida', rot:'Questões' },
    { arq:'revisao.html',   ico:'ciclo', rot:'Revisão' },
    { arq:'progresso.html', ico:'grafico', rot:'Progresso' }
  ];

  var TITULOS = {
    'estudos.html':'Capítulos',
    'categorias.html':'Categorias',
    'quiz.html':'Questionário',
    'revisao.html':'Revisão',
    'progresso.html':'Meu progresso',
    'apostila-completa.html':'Apostila completa'
  };

  function atual(){
    var p = location.pathname.split('/').pop();
    return p === '' ? 'index.html' : p;
  }
  function capAtual(){
    var a = atual(), r = null;
    CAPS.forEach(function(c,i){ if (c.arq === a) r = { c:c, i:i }; });
    return r;
  }

  /* ---------------- App bar ---------------- */
  function appbar(){
    var a = atual();
    var cap = capAtual();
    var bar = document.createElement('header');
    bar.className = 'appbar no-print';

    var html = '';
    if (cap || TITULOS[a]) {
      html += '<a class="ico voltar" href="' + (cap ? 'estudos.html' : 'index.html') + '" aria-label="Voltar"></a>';
      html += '<span class="titulo-tela">' + (cap ? cap.c.curto : TITULOS[a]) + '</span>';
    } else {
      html += '<a class="marca" href="index.html">SUS <span>É</span> TOP</a><span class="espaco"></span>';
    }
    /* atenção: não usar [data-tema] aqui — o <html> carrega data-tema="claro|escuro"
       e um closest('[data-tema]') casaria com QUALQUER clique da página */
    html += '<button class="ico" type="button" data-acao="tema" aria-label="Alternar tema">' + ICO.svg('tema',19) + '</button>';
    html += '<button class="ico" type="button" data-acao="pdf" aria-label="Exportar PDF">' + ICO.svg('baixar',19) + '</button>';

    bar.innerHTML = html;
    document.body.insertBefore(bar, document.body.firstChild);
  }

  /* ---------------- Tab bar ---------------- */
  function tabbar(){
    var a = atual();
    var nav = document.createElement('nav');
    nav.className = 'tabbar no-print';

    var pendentes = 0;
    try { pendentes = window.DADOS ? window.DADOS.resumo().caderno : 0; } catch(e){}

    nav.innerHTML = TABS.map(function(t){
      var ativo = (t.arq === a) || (t.tambem && t.tambem.indexOf(a) !== -1);
      var badge = (t.arq === 'revisao.html' && pendentes > 0)
        ? '<span class="badge">' + (pendentes > 99 ? '99+' : pendentes) + '</span>' : '';
      return '<a href="' + t.arq + '" class="' + (ativo ? 'ativo' : '') + '">' + badge + '<i>' + ICO.svg(t.ico, 22) + '</i>' + t.rot + '</a>';
    }).join('');

    document.body.appendChild(nav);
  }

  /* ---------------- Tela de detalhe do capítulo ----------------
     Transforma o conteúdo corrido em: capa + avaliação + acordeões,
     no mesmo formato da tela de produto do layout. */
  function telaDetalhe(){
    var cap = capAtual();
    if (!cap || !window.DADOS) return;

    var papel = document.querySelector('.papel');
    if (!papel) return;

    var n = cap.i + 1;
    var stat = window.DADOS.porCapitulo()[cap.i];
    var header = papel.querySelector('.cabecalho');

    /* --- capa --- */
    var capa = document.createElement('div');
    capa.className = 'detalhe-capa ' + cap.c.cor + ' no-print';
    capa.innerHTML = '<span class="n">Capítulo ' + n + '</span>' + ICO.svg(cap.c.ico, 74);
    papel.insertBefore(capa, papel.firstChild);

    /* --- linha de avaliação, logo abaixo do cabeçalho --- */
    var estrelas = stat.aproveitamento === null ? 0 : Math.round(stat.aproveitamento / 20);
    var linha = document.createElement('div');
    linha.className = 'avaliacao no-print';
    linha.innerHTML =
      '<span class="pill-estoque">' + (stat.lido ? '✔ Estudado' : 'Disponível') + '</span>' +
      '<span class="estrelas">' + '★'.repeat(Math.max(1, estrelas)) + '☆'.repeat(5 - Math.max(1, estrelas)) + '</span>' +
      '<span class="nota">' + (stat.aproveitamento === null ? '—' : stat.aproveitamento + '%') + '</span>' +
      '<span>(' + stat.totalQuestoes + ' questões)</span>';
    if (header && header.nextSibling) papel.insertBefore(linha, header.nextSibling);
    else papel.appendChild(linha);

    /* --- agrupa cada H2 em um acordeão --- */
    var nos = [].slice.call(papel.children);
    var comeco = nos.indexOf(linha) + 1;
    var grupos = [], atualGrupo = null;

    for (var k = comeco; k < nos.length; k++){
      var el = nos[k];
      if (el.tagName === 'H2'){
        atualGrupo = { titulo: el.textContent, itens: [], origem: el };
        grupos.push(atualGrupo);
      } else if (atualGrupo && !el.classList.contains('rodape')){
        atualGrupo.itens.push(el);
      }
    }
    if (!grupos.length) return;

    grupos.forEach(function(g, gi){
      var det = document.createElement('details');
      det.className = 'acc';
      if (gi === 0) det.open = true;

      var sum = document.createElement('summary');
      sum.innerHTML = '<span class="ic">' + (gi + 1) + '</span>' + g.titulo;
      det.appendChild(sum);

      var corpo = document.createElement('div');
      corpo.className = 'corpo';
      g.itens.forEach(function(it){ corpo.appendChild(it); });
      det.appendChild(corpo);

      g.origem.parentNode.replaceChild(det, g.origem);
    });

    /* --- barra fixa de ação --- */
    document.body.classList.add('tem-barra');
    var barra = document.createElement('div');
    barra.className = 'barra-acao no-print';
    barra.innerHTML =
      '<button class="btn sec" type="button" id="marcar-lido" style="flex:0 0 auto;padding:13px 18px"></button>' +
      '<a class="btn" href="quiz.html?cap=' + n + '">' + ICO.svg('duvida',18) + 'Responder questões</a>';
    document.body.appendChild(barra);

    var bt = barra.querySelector('#marcar-lido');
    var pinta = function(){
      var lido = window.DADOS.lidos().indexOf(n) !== -1;
      bt.textContent = lido ? '✔ Estudado' : '○ Marcar';
      bt.className = lido ? 'btn' : 'btn sec';
      bt.style.flex = '0 0 auto';
      bt.style.padding = '13px 18px';
    };
    bt.addEventListener('click', function(){
      window.DADOS.marcarLido(n, window.DADOS.lidos().indexOf(n) === -1);
      pinta();
    });
    pinta();

    /* --- navegação entre capítulos --- */
    var ant = CAPS[cap.i - 1], prox = CAPS[cap.i + 1];
    var nav = document.createElement('nav');
    nav.className = 'nav-paginas no-print';
    nav.innerHTML =
      (ant ? '<a href="' + ant.arq + '">← ' + ant.curto + '</a>' : '<a href="estudos.html">← Capítulos</a>') +
      (prox ? '<a href="' + prox.arq + '">' + prox.curto + ' →</a>' : '<a href="quiz.html">Questionário →</a>');
    papel.appendChild(nav);

    /* --- abre todos os acordeões antes de imprimir --- */
    window.addEventListener('beforeprint', function(){
      papel.querySelectorAll('details.acc').forEach(function(d){ d.open = true; });
    });
  }

  /* ---------------- Assinatura ---------------- */
  function creditos(){
    var alvo = document.querySelector('.folha') || document.querySelector('.papel');
    if (!alvo || alvo.querySelector('.assinatura')) return;
    var a = document.createElement('a');
    a.className = 'assinatura no-print';
    a.href = 'https://wa.me/5582988717072';
    a.target = '_blank';
    a.rel = 'noopener';
    a.innerHTML = '<span class="zap"><svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">' +
      '<path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1a13 13 0 0 1-5.6-4.6c-.4-.6-1-1.5-1-2.9 0-1.3.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.3.5-.3.3c-.1.2-.3.3-.1.6.2.3.7 1.2 1.6 2 1 .9 1.9 1.2 2.2 1.3.3.2.4.1.6 0l.9-1c.2-.2.3-.2.6-.1l2 1c.3.1.4.2.5.3.1.2.1.6-.1 1.3z"/>' +
      '</svg></span>Desenvolvido por: <b>@alequizao</b>';
    alvo.appendChild(a);

    var v = document.createElement('p');
    v.className = 'versao-app no-print';
    v.id = 'versao-app';
    v.textContent = 'versão ' + (window.APP_VERSAO || '—');
    alvo.appendChild(v);
  }

  /* ---------------- Verificação de versão ----------------
     Toda abertura confere na rede qual é a versão publicada. Se o que está
     rodando for antigo, limpa os caches e recarrega uma única vez — ninguém
     fica preso numa versão velha. */
  function conferirVersao(){
    if (!window.fetch || sessionStorage.getItem('sus-recarregou') === '1') return;

    fetch('assets/versao.js?ts=' + Date.now(), { cache:'no-store' })
      .then(function(r){ return r.ok ? r.text() : null; })
      .then(function(txt){
        if (!txt) return;
        var m = txt.match(/APP_VERSAO\s*=\s*'([^']+)'/);
        if (!m || m[1] === window.APP_VERSAO) return;

        sessionStorage.setItem('sus-recarregou', '1');
        var limpar = window.caches
          ? caches.keys().then(function(ks){ return Promise.all(ks.map(function(k){ return caches.delete(k); })); })
          : Promise.resolve();
        limpar.then(function(){ location.reload(); });
      })
      .catch(function(){});
  }

  /* ---------------- Ações ---------------- */
  function acoes(){
    document.addEventListener('click', function(ev){
      if (ev.target.closest('[data-acao="pdf"]')){
        ev.preventDefault();
        document.querySelectorAll('details.acc').forEach(function(d){ d.open = true; });
        window.print();
        return;
      }
      if (ev.target.closest('[data-acao="tema"]')){
        ev.preventDefault();
        if (!window.DADOS) return;
        var novo = window.DADOS.tema() === 'escuro' ? 'claro' : 'escuro';
        window.DADOS.definirTema(novo);
        var mt = document.querySelector('meta[name="theme-color"]');
        if (mt) mt.content = novo === 'escuro' ? '#181F29' : '#FFFFFF';
      }
    });
  }

  /* ---------------- PWA ---------------- */
  function pwa(){
    if (!document.querySelector('link[rel="manifest"]')){
      var l = document.createElement('link');
      l.rel = 'manifest'; l.href = 'manifest.json';
      document.head.appendChild(l);
    }
    if (!document.querySelector('meta[name="theme-color"]')){
      var m = document.createElement('meta');
      m.name = 'theme-color';
      m.content = (window.DADOS && window.DADOS.tema() === 'escuro') ? '#181F29' : '#FFFFFF';
      document.head.appendChild(m);
    }
    var ap = document.createElement('meta');
    ap.name = 'apple-mobile-web-app-capable'; ap.content = 'yes';
    document.head.appendChild(ap);

    var ai = document.createElement('link');
    ai.rel = 'apple-touch-icon'; ai.href = 'icons/icon-180.png?v=6';
    document.head.appendChild(ai);

    if ('serviceWorker' in navigator && location.protocol !== 'file:'){
      /* quem já tinha o app instalado recebe a versão nova sem precisar
         limpar cache: o SW novo assume o controle e a página recarrega uma vez */
      var jaRecarregou = false, interagiu = false;
      ['pointerdown','keydown'].forEach(function(e){
        document.addEventListener(e, function(){ interagiu = true; }, { once:true, capture:true });
      });

      navigator.serviceWorker.addEventListener('controllerchange', function(){
        /* só recarrega se o usuário ainda não tocou em nada e a página
           acabou de abrir — senão o reload cancelaria a navegação do toque */
        if (jaRecarregou || interagiu || performance.now() > 3000) return;
        jaRecarregou = true;
        location.reload();
      });

      navigator.serviceWorker.register('sw.js', { updateViaCache:'none' })
        .then(function(reg){
          reg.update();
          reg.addEventListener('updatefound', function(){
            var novo = reg.installing;
            if (!novo) return;
            novo.addEventListener('statechange', function(){
              if (novo.state === 'installed' && navigator.serviceWorker.controller) {
                novo.postMessage('atualizar');
              }
            });
          });
        })
        .catch(function(){});
    }
  }

  var promptInstalar = null;
  window.addEventListener('beforeinstallprompt', function(ev){
    ev.preventDefault();
    promptInstalar = ev;
    var alvo = document.getElementById('instalar-app');
    if (!alvo) return;
    alvo.classList.remove('oculto');
    alvo.addEventListener('click', function(){
      if (!promptInstalar) return;
      promptInstalar.prompt();
      promptInstalar = null;
      alvo.classList.add('oculto');
    });
  });

  document.addEventListener('DOMContentLoaded', function(){
    if (window.DADOS) window.DADOS.aplicarTema();
    if (atual() === 'index.html') document.body.classList.add('tela-inicio');
    appbar();
    tabbar();
    telaDetalhe();
    creditos();
    conferirVersao();
    if (window.ICO) ICO.hidratar();
    acoes();
    pwa();
  });

  window.APP_CAPS = CAPS;
})();
