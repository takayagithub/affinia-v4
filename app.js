
/* v5.3.1 patch: add drawer close button dynamically and wire events */
(function(){
  const t = document.getElementById('navToggle');
  const n = document.getElementById('nav');
  if(!t || !n) return;

  // ensure close button exists
  let closeBtn = n.querySelector('.nav-close');
  if(!closeBtn){
    closeBtn = document.createElement('button');
    closeBtn.className = 'nav-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label','閉じる');
    closeBtn.textContent = '×';
    n.appendChild(closeBtn);
  }

  let scrim = document.querySelector('.scrim');
  if(!scrim){ scrim = document.createElement('div'); scrim.className='scrim'; document.body.appendChild(scrim); }

  const openNav = ()=>{ n.classList.add('open'); scrim.classList.add('show'); t.setAttribute('aria-expanded','true'); };
  const closeNav= ()=>{ n.classList.remove('open'); scrim.classList.remove('show'); t.setAttribute('aria-expanded','false'); };

  t.addEventListener('click', ()=>{ n.classList.contains('open') ? closeNav() : openNav(); });
  closeBtn.addEventListener('click', closeNav);
  scrim.addEventListener('click', closeNav);
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeNav(); });
  n.querySelectorAll('a').forEach(a=>a.addEventListener('click', closeNav));
})();
