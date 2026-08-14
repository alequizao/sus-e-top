/* SUS É TOP — camada de dados (localStorage + sincronização opcional com a API)
   Implementa: estatísticas por questão e por assunto, caderno de erros,
   revisão espaçada (sistema de caixas de Leitner), streak e histórico de sessões. */

(function () {
  'use strict';

  var K = {
    stats:   'susetop_stats',     // { id: {a, e, box, prox, ult} }
    erros:   'susetop_erros',     // [ id ]
    hist:    'susetop_hist',      // [ sessao ]
    lidos:   'susetop_lidos',     // [ capitulo ]
    streak:  'susetop_streak',    // { ultimo: 'YYYY-MM-DD', dias: n, recorde: n }
    meta:    'susetop_meta',      // { diaria: 20 }
    tema:    'susetop_tema',      // 'claro' | 'escuro'
    aluno:   'susetop_aluno'      // identificador anônimo do dispositivo
  };

  /* Intervalos da revisão espaçada, em dias, por caixa de Leitner (1 a 5). */
  var CAIXAS = [0, 1, 2, 4, 8, 16];

  var CAPITULOS = [
    { n: 1, t: 'CF/88 — arts. 194 e 195',   arq: '01-cf-194-195.html' },
    { n: 2, t: 'Lei nº 8.080/1990',          arq: '02-lei-8080.html' },
    { n: 3, t: 'Lei nº 8.142/1990',          arq: '03-lei-8142.html' },
    { n: 4, t: 'Princípios e diretrizes',    arq: '04-principios-diretrizes-sus.html' },
    { n: 5, t: 'Redes de Atenção (RAS)',     arq: '05-redes-atencao-saude.html' },
    { n: 6, t: 'PNAB',                       arq: '06-pnab.html' },
    { n: 7, t: 'Humanização e segurança',    arq: '07-humanizacao-seguranca.html' },
    { n: 8, t: 'Biossegurança e infecção',   arq: '08-biosseguranca.html' },
    { n: 9, t: 'Sinais vitais',              arq: '09-sinais-vitais.html' },
    { n: 10, t: 'Medicamentos',              arq: '10-medicamentos.html' },
    { n: 11, t: 'Curativos e feridas', arq: '11-curativos.html' },
    { n: 12, t: 'Vacinação', arq: '12-vacinacao.html' },
    { n: 13, t: 'Urgência e emergência', arq: '13-urgencia-emergencia.html' },
    { n: 14, t: 'Saúde da mulher e da criança', arq: '14-mulher-crianca.html' },
    { n: 15, t: 'Saúde do adulto e do idoso', arq: '15-adulto-idoso.html' },
    { n: 16, t: 'Ética em enfermagem', arq: '16-etica-enfermagem.html' },
    { n: 17, t: 'Fundamentos e SAE', arq: '17-fundamentos-sae.html' },
    { n: 18, t: 'Língua Portuguesa', arq: '18-portugues.html' },
    { n: 19, t: 'Raciocínio Lógico', arq: '19-raciocinio-logico.html' },
    { n: 20, t: 'Informática', arq: '20-informatica.html' },
    { n: 21, t: 'Atualidades', arq: '21-atualidades.html' }
  ];

  /* Blocos temáticos — agrupam capítulos para seleção rápida no questionário */
  var BLOCOS = [
    { id: 'sus', t: 'Legislação do SUS', caps: [1,2,3,4,5,6,7] },
    { id: 'enf', t: 'Enfermagem',        caps: [8,9,10,11,12,13,14,15,16,17] },
    { id: 'bas', t: 'Básicas',           caps: [18,19,20,21] }
  ];

  /* ---------------- utilitários de storage ---------------- */
  function ler(chave, padrao) {
    try {
      var v = localStorage.getItem(chave);
      return v === null ? padrao : JSON.parse(v);
    } catch (e) { return padrao; }
  }
  function gravar(chave, valor) {
    try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (e) {}
  }
  function hoje() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function diasEntre(a, b) {
    return Math.round((new Date(b) - new Date(a)) / 86400000);
  }

  /* ---------------- identificador anônimo ---------------- */
  function aluno() {
    var id = ler(K.aluno, null);
    if (!id) {
      id = 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      gravar(K.aluno, id);
    }
    return id;
  }

  /* ---------------- índice das questões ---------------- */
  function questoes() {
    var b = window.BANCO_QUESTOES || [];
    if (b.length && b[0].id === undefined) {
      b.forEach(function (q, i) { q.id = 'q' + i; });
    }
    return b;
  }
  function porId(id) {
    return questoes().filter(function (q) { return q.id === id; })[0] || null;
  }

  /* ---------------- registro de resposta ---------------- */
  function registrar(questao, acertou) {
    var stats = ler(K.stats, {});
    var s = stats[questao.id] || { a: 0, e: 0, box: 1, prox: hoje(), ult: null };

    if (acertou) {
      s.a++;
      s.box = Math.min(5, s.box + 1);            // sobe de caixa
    } else {
      s.e++;
      s.box = 1;                                  // volta para a primeira caixa
    }
    s.ult = hoje();

    var d = new Date();
    d.setDate(d.getDate() + CAIXAS[s.box]);
    s.prox = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

    stats[questao.id] = s;
    gravar(K.stats, stats);

    /* caderno de erros */
    var erros = ler(K.erros, []);
    var i = erros.indexOf(questao.id);
    if (!acertou && i === -1) erros.push(questao.id);
    if (acertou && s.a >= 2 && i !== -1) erros.splice(i, 1);  // sai após 2 acertos
    gravar(K.erros, erros);
  }

  /* ---------------- seleção de questões ---------------- */
  function filtrar(opts) {
    opts = opts || {};
    var caps = opts.caps || [1, 2, 3, 4, 5, 6, 7];
    var dif = opts.dif || 'todas';
    var stats = ler(K.stats, {});
    var h = hoje();

    return questoes().filter(function (q) {
      if (caps.indexOf(q.c) === -1) return false;
      if (dif !== 'todas' && q.d !== dif) return false;

      if (opts.modo === 'erros') {
        return ler(K.erros, []).indexOf(q.id) !== -1;
      }
      if (opts.modo === 'revisao') {
        var s = stats[q.id];
        return !s || s.prox <= h;                 // nunca vista ou vencida
      }
      if (opts.modo === 'ineditas') {
        return !stats[q.id];
      }
      return true;
    });
  }

  function embaralhar(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------------- estatísticas ---------------- */
  function resumo() {
    var stats = ler(K.stats, {});
    var tot = 0, ac = 0, er = 0, vistas = 0;
    Object.keys(stats).forEach(function (id) {
      vistas++;
      ac += stats[id].a;
      er += stats[id].e;
    });
    tot = ac + er;
    return {
      respondidas: tot,
      acertos: ac,
      erros: er,
      aproveitamento: tot ? Math.round(ac / tot * 100) : 0,
      questoesVistas: vistas,
      totalBanco: questoes().length,
      cobertura: questoes().length ? Math.round(vistas / questoes().length * 100) : 0,
      caderno: ler(K.erros, []).length,
      paraRevisar: filtrar({ modo: 'revisao' }).length
    };
  }

  function porCapitulo() {
    var stats = ler(K.stats, {});
    return CAPITULOS.map(function (c) {
      var qs = questoes().filter(function (q) { return q.c === c.n; });
      var ac = 0, er = 0, vistas = 0;
      qs.forEach(function (q) {
        var s = stats[q.id];
        if (!s) return;
        vistas++; ac += s.a; er += s.e;
      });
      var tot = ac + er;
      return {
        n: c.n, titulo: c.t, arquivo: c.arq,
        totalQuestoes: qs.length,
        vistas: vistas,
        respondidas: tot,
        acertos: ac,
        erros: er,
        aproveitamento: tot ? Math.round(ac / tot * 100) : null,
        lido: ler(K.lidos, []).indexOf(c.n) !== -1
      };
    });
  }

  /* ---------------- streak / ofensiva ---------------- */
  function marcarDia() {
    var s = ler(K.streak, { ultimo: null, dias: 0, recorde: 0 });
    var h = hoje();
    if (s.ultimo === h) return s;
    if (s.ultimo && diasEntre(s.ultimo, h) === 1) s.dias++;
    else s.dias = 1;
    s.ultimo = h;
    s.recorde = Math.max(s.recorde || 0, s.dias);
    gravar(K.streak, s);
    return s;
  }
  function streak() {
    var s = ler(K.streak, { ultimo: null, dias: 0, recorde: 0 });
    if (s.ultimo && diasEntre(s.ultimo, hoje()) > 1) s.dias = 0;
    return s;
  }

  /* ---------------- meta diária ---------------- */
  function meta() { return ler(K.meta, { diaria: 20 }); }
  function definirMeta(n) { gravar(K.meta, { diaria: n }); }
  function feitasHoje() {
    var h = hoje();
    return ler(K.hist, []).filter(function (r) { return (r.data || '').slice(0, 10) === h; })
      .reduce(function (s, r) { return s + r.total; }, 0);
  }

  /* ---------------- capítulos lidos ---------------- */
  function marcarLido(n, lido) {
    var l = ler(K.lidos, []);
    var i = l.indexOf(n);
    if (lido && i === -1) l.push(n);
    if (!lido && i !== -1) l.splice(i, 1);
    gravar(K.lidos, l);
    return l;
  }
  function lidos() { return ler(K.lidos, []); }

  /* ---------------- sessões ---------------- */
  function salvarSessao(reg) {
    var h = ler(K.hist, []);
    h.unshift(reg);
    gravar(K.hist, h.slice(0, 200));
    marcarDia();

    try {
      fetch('api.php?acao=salvar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ aluno: aluno() }, reg))
      }).catch(function () {});
    } catch (e) {}
  }
  function historico() { return ler(K.hist, []); }

  /* ---------------- tema ---------------- */
  function tema() { return ler(K.tema, 'claro'); }
  function definirTema(t) {
    gravar(K.tema, t);
    document.documentElement.setAttribute('data-tema', t);
  }
  function aplicarTema() {
    document.documentElement.setAttribute('data-tema', tema());
  }

  function zerar() {
    Object.keys(K).forEach(function (k) {
      if (k === 'tema' || k === 'aluno') return;
      try { localStorage.removeItem(K[k]); } catch (e) {}
    });
  }

  window.DADOS = {
    CAPITULOS: CAPITULOS,
    BLOCOS: BLOCOS,
    questoes: questoes, porId: porId,
    registrar: registrar, filtrar: filtrar, embaralhar: embaralhar,
    resumo: resumo, porCapitulo: porCapitulo,
    streak: streak, marcarDia: marcarDia,
    meta: meta, definirMeta: definirMeta, feitasHoje: feitasHoje,
    marcarLido: marcarLido, lidos: lidos,
    salvarSessao: salvarSessao, historico: historico,
    tema: tema, definirTema: definirTema, aplicarTema: aplicarTema,
    aluno: aluno, zerar: zerar, hoje: hoje
  };

  aplicarTema();
})();
