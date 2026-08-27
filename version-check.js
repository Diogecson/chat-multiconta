// Verifica /version.json a cada 60s. Se detectar mudanca, mostra banner com botao "Atualizar".
(function(){
  var VERSAO_URL = '/version.json';
  var INTERVAL_MS = 60000; // 1 minuto
  var versaoAtual = null;

  function fetchVersao(){
    // cache buster garantido
    return fetch(VERSAO_URL + '?t=' + Date.now(), { cache: 'no-store' })
      .then(function(r){ return r.ok ? r.json() : null; })
      .catch(function(){ return null; });
  }

  function mostrarBanner(){
    if(document.getElementById('__update-banner__')) return;
    var css = '#__update-banner__{position:fixed;top:0;left:0;right:0;z-index:99999;background:linear-gradient(90deg,#ff6b00,#ff9347);color:#fff;padding:11px 18px;display:flex;align-items:center;justify-content:center;gap:14px;font-family:"Inter",system-ui,sans-serif;font-size:.9rem;font-weight:600;box-shadow:0 4px 16px rgba(0,0,0,.25);animation:__ubs .3s ease-out}@keyframes __ubs{from{transform:translateY(-100%)}to{transform:none}}#__update-banner__ button{background:#fff;color:#c25200;border:none;padding:7px 16px;border-radius:8px;font-weight:700;cursor:pointer;font-size:.85rem;transition:.15s}#__update-banner__ button:hover{transform:scale(1.05)}#__update-banner__ .__uc{background:transparent;color:#fff;padding:4px 8px;font-size:1rem}';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var el = document.createElement('div');
    el.id = '__update-banner__';
    el.innerHTML = '<i class="bi bi-arrow-repeat" style="font-size:1.15rem"></i> Nova versão disponível! ' +
      '<button onclick="location.reload(true)">Atualizar agora</button>' +
      '<button class="__uc" onclick="document.getElementById(\'__update-banner__\').remove()" title="Fechar">×</button>';
    document.body.appendChild(el);
    // Ajusta padding-top pra nao cobrir conteudo
    document.body.style.paddingTop = (el.offsetHeight) + 'px';
  }

  function check(){
    fetchVersao().then(function(r){
      if(!r || !r.v) return;
      if(versaoAtual === null){ versaoAtual = r.v; return; }
      if(r.v !== versaoAtual){ mostrarBanner(); }
    });
  }

  // Primeira leitura ao carregar
  check();
  // Poll periodico
  setInterval(check, INTERVAL_MS);
  // Ao voltar da aba, checa na hora
  document.addEventListener('visibilitychange', function(){
    if(!document.hidden) check();
  });
})();
