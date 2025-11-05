
/* v5.5: Single-page quiz, 5-step horizontal only, auto-advance */
(function(){
  'use strict';
  const $ = sel => document.querySelector(sel);
  const el = (tag, cls) => { const n=document.createElement(tag); if(cls) n.className=cls; return n; };

  document.addEventListener('DOMContentLoaded', ()=>{
    const nav = $('#nav');
    if(nav && !nav.dataset.enhanced){
      nav.dataset.enhanced='1';
      nav.querySelectorAll('a').forEach(a=>{
        if(!a.querySelector('.ic')){
          const i = el('span','ic');
          i.textContent = (a.textContent.includes('診断')?'🧭': a.textContent.includes('タイプ一覧')?'🗂': a.textContent.includes('相性')?'💞':'ℹ️');
          a.prepend(i);
        }
      });
    }
  });

  const Q = [
    {axis:'X', icon:'🌅', title:'朝のはじまり', left:'ゆっくり整える', right:'すぐ動く'},
    {axis:'X', icon:'⚡', title:'計画が崩れたら', left:'静かに立て直す', right:'勢いで切替'},
    {axis:'X', icon:'🎯', title:'チャンスの誘い', left:'様子を見る', right:'まず挑戦'},
    {axis:'Y', icon:'💬', title:'会話のテンポ', left:'短めが楽', right:'話すと元気'},
    {axis:'Y', icon:'🧭', title:'決め方', left:'気持ち優先', right:'筋道優先'},
    {axis:'Y', icon:'🤝', title:'助け方', left:'そっと寄りそう', right:'具体的に動く'},
    {axis:'Y', icon:'🌙', title:'夜の過ごし方', left:'静かに回復', right:'誰かと発散'}
  ];

  function mountQuiz(){
    const box = document.getElementById('quiz');
    const bar = document.getElementById('bar');
    if(!box || !bar) return;
    box.classList.add('slide');
    const view = document.createElement('div'); view.className='qview show';
    const qwrap = document.getElementById('qwrap');
    if(qwrap) box.replaceChild(view, qwrap); else box.insertBefore(view, box.children[1]);

    let idx = 0;
    const ans = Array(Q.length).fill(3);

    function render(){
      const q = Q[idx];
      bar.style.width = Math.round((idx/Q.length)*100)+'%';
      view.classList.remove('show');
      setTimeout(()=>{
        view.innerHTML = '';
        const h2 = document.createElement('h2'); h2.className='q-title';
        h2.textContent = `Q${idx+1} / ${Q.length}：${q.title}`; view.appendChild(h2);
        const rail = document.createElement('div'); rail.className='h5';
        for(let i=1;i<=5;i++){
          const d = document.createElement('div'); d.className='dot'+(ans[idx]===i?' selected':'');
          d.setAttribute('role','button'); d.setAttribute('aria-label', `${i} / 5`);
          d.onclick = ()=>{ ans[idx]=i; if(idx < Q.length-1){ idx++; render(); } else { finish(); } };
          rail.appendChild(d);
        }
        view.appendChild(rail);
        const labs = document.createElement('div'); labs.className='labels'; labs.innerHTML = `<span>${q.left}</span><span>${q.right}</span>`; view.appendChild(labs);
        view.classList.add('show');
      }, 10);
    }

    function finish(){
      const norm = ans.map(v=>(v-1)/4);
      let x=0,y=0,xc=0,yc=0;
      for(let i=0;i<Q.length;i++){
        if(Q[i].axis==='X'){ x+=norm[i]; xc++; } else { y+=norm[i]; yc++; }
      }
      const X=x/xc, Y=y/yc;
      const lv=v=>v<.25?1: v<.5?2: v<.75?3: 4;
      const code='ABCD'[lv(X)-1]+String(lv(Y));
      const t=(window.AFFINIA_TYPES||[]).find(t=>t.code===code) || (window.AFFINIA_TYPES||[])[0] || {code, name:'タイプ', catch:'', desc:''};
      sessionStorage.setItem('affinia_result', JSON.stringify({type:t, code, axes:{X,Y}}));
      location.href='result.html?t='+encodeURIComponent(code);
    }

    const prev = document.getElementById('prevBtn');
    const next = document.getElementById('nextBtn');
    if(prev){ prev.onclick = ()=>{ if(idx>0){ idx--; render(); } }; }
    if(next){ next.onclick = ()=>{ if(idx<Q.length-1){ idx++; render(); } else { finish(); } }; }

    render();
  }

  document.addEventListener('DOMContentLoaded', ()=>{ try{ mountQuiz(); }catch(e){ console.error(e); } });
})();
