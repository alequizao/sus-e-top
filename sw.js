/* SUS É TOP — Service Worker
   Estratégia: cache-first para o "casco" do app, network-first para a API. */

const VERSAO = 'sus-e-top-v8.2.1';
const CASCO = [
  './',
  './index.html',
  './estudos.html',
  './quiz.html',
  './categorias.html',
  './revisao.html',
  './progresso.html',
  './apostila-completa.html',
  './01-cf-194-195.html',
  './02-lei-8080.html',
  './03-lei-8142.html',
  './04-principios-diretrizes-sus.html',
  './05-redes-atencao-saude.html',
  './06-pnab.html',
  './07-humanizacao-seguranca.html',
  './10-medicamentos.html',
  './11-curativos.html',
  './12-vacinacao.html',
  './13-urgencia-emergencia.html',
  './14-mulher-crianca.html',
  './15-adulto-idoso.html',
  './16-etica-enfermagem.html',
  './17-fundamentos-sae.html',
  './18-portugues.html',
  './19-raciocinio-logico.html',
  './20-informatica.html',
  './21-atualidades.html',
  './09-sinais-vitais.html',
  './08-biosseguranca.html',
  './assets/style.css?v=821',
  './assets/app.js?v=821',
  './assets/icones.js?v=821',
  './assets/versao.js?v=821',
  './assets/dados.js?v=821',
  './assets/questoes.js?v=821',
  './assets/questoes-enfermagem.js?v=821',
  './assets/questoes-basicas.js?v=821',
  './assets/questoes-errado.js?v=821',
  './assets/questoes-final.js?v=821',
  './assets/questoes-sus2.js?v=821',
  './assets/questoes-enfermagem4.js?v=821',
  './assets/questoes-enfermagem3.js?v=821',
  './assets/questoes-enfermagem2.js?v=821',
  './manifest.json',
  './icons/icon-192.png?v=821',
  './icons/icon-512.png?v=821'
];

self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(VERSAO)
      .then((c) => c.addAll(CASCO))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((chaves) => Promise.all(
        chaves.filter((k) => k !== VERSAO).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (ev) => {
  const req = ev.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // API: sempre rede, sem cache
  if (url.pathname.endsWith('/api.php')) {
    ev.respondWith(fetch(req).catch(() => new Response(
      JSON.stringify({ ok: false, offline: true }),
      { headers: { 'Content-Type': 'application/json' } }
    )));
    return;
  }

  const guardar = (resp) => {
    if (resp && resp.status === 200 && resp.type === 'basic') {
      const copia = resp.clone();
      caches.open(VERSAO).then((c) => c.put(req, copia));
    }
    return resp;
  };

  // Páginas, CSS e JS: REDE PRIMEIRO.
  // Assim toda alteração publicada chega na hora para quem já usa o app;
  // o cache só entra em cena quando não há internet.
  const d = req.destination;
  if (req.mode === 'navigate' || d === 'document' || d === 'script' ||
      d === 'style' || url.pathname.endsWith('manifest.json')) {
    ev.respondWith(
      fetch(req).then(guardar).catch(() =>
        caches.match(req).then((c) => c || caches.match('./index.html'))
      )
    );
    return;
  }

  // Ícones, imagens e fontes: cache primeiro, revalidando em segundo plano
  ev.respondWith(
    caches.match(req).then((cacheado) => {
      const rede = fetch(req).then(guardar).catch(() => cacheado);
      return cacheado || rede;
    })
  );
});

self.addEventListener('message', (ev) => {
  if (ev.data === 'atualizar') self.skipWaiting();
});
