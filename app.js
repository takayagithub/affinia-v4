
(function(){
  'use strict';
  function qs(s){return document.querySelector(s);}
  function el(tag,cls){const n=document.createElement(tag); if(cls) n.className=cls; return n;}
  function getParam(name){ const u=new URL(location.href); return u.searchParams.get(name);}

  document.addEventListener('DOMContentLoaded',()=>{
    const n=document.getElementById('nav'); if(n && !n.querySelector('.nav-close')){
      const b=el('button','nav-close'); b.type='button'; b.setAttribute('aria-label','閉じる'); b.textContent='×';
      n.appendChild(b);
      const t=document.getElementById('navToggle'); const scrim=document.querySelector('.scrim')||document.body.appendChild(el('div','scrim'));
      const open=()=>{n.classList.add('open'); scrim.classList.add('show'); t?.setAttribute('aria-expanded','true');};
      const close=()=>{n.classList.remove('open'); scrim.classList.remove('show'); t?.setAttribute('aria-expanded','false');};
      t?.addEventListener('click',()=>{n.classList.contains('open')?close():open();});
      b.addEventListener('click',close); scrim.addEventListener('click',close); document.addEventListener('keydown',e=>{if(e.key==='Escape') close();});
      n.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    }
  });

  window.AFFINIA_TYPES = window.AFFINIA_TYPES || [
    {"code":"A1","name":"情熱ヒーロー","catch":"勢いとまっすぐさが武器。","desc":"熱量が高く、まわりを前向きに引っぱります。"},
    {"code":"A2","name":"クールブレイン","catch":"静かにコツコツ、頭脳派。","desc":"ムダを減らして、静かに成果を出します。"},
    {"code":"A3","name":"ハッピーバニー","catch":"その場を明るくする達人。","desc":"空気をやわらかくして、皆を笑顔にします。"},
    {"code":"A4","name":"癒し天使","catch":"やさしさで場をととのえる。","desc":"人の気持ちに気づき、そっと支えるのが得意です。"},
    {"code":"B1","name":"おちゃめキツネ","catch":"ひらめきと遊び心で動く。","desc":"機転がきき、場を明るくひっくり返すことも。"},
    {"code":"B2","name":"博識フクロウ","catch":"深く考えて、広く見る。","desc":"情報を集め、洞察から一歩先を提案します。"},
    {"code":"B3","name":"ゴージャスプリンセス","catch":"こだわりで魅せるリーダー気質。","desc":"見た目や体験の質にもこだわり、安心感を出します。"},
    {"code":"B4","name":"夢見るユニコーン","catch":"理想を形にしていく。","desc":"思いつきを実験して形にしていきます。"},
    {"code":"C1","name":"頑張りミツバチ","catch":"小さな積み重ねが得意。","desc":"コツコツ続けて、信頼を積み上げます。"},
    {"code":"C2","name":"もじもじヒツジ","catch":"静かな安心感。","desc":"落ち着いた環境で力を発揮します。"},
    {"code":"C3","name":"ドジっ子リス","catch":"元気で親しみやすい。","desc":"多少のドジも愛嬌に変えられます。"},
    {"code":"C4","name":"パンクハリネズミ","catch":"やさしい線引きが上手。","desc":"自分と相手の距離感を大切にします。"},
    {"code":"D1","name":"マイペースナマケモノ","catch":"自分のペースを守る名人。","desc":"無理しないで結果を出すタイプです。"},
    {"code":"D2","name":"健気ワンコ","catch":"誰かの力になるのが好き。","desc":"縁の下の力持ちとして動けます。"},
    {"code":"D3","name":"キラキラアイドル","catch":"自分らしく輝かせる。","desc":"人前でも自分らしく表現できます。"},
    {"code":"D4","name":"ツンデレニャンコ","catch":"素直じゃないのが素直。","desc":"自分のペースを大切にしつつ、信頼した人にはよく懐きます。"}
  ];

  const Q = [
    {axis:'X', icon:'🌅', title:'朝のはじまり', left:'ゆっくり整えて動く', right:'起きてすぐ動く'},
    {axis:'X', icon:'🌀', title:'計画が崩れたら', left:'静かに立て直す', right:'勢いで切り替える'},
    {axis:'X', icon:'🎯', title:'チャンスの誘い', left:'様子を見る', right:'まず行く'},
    {axis:'Y', icon:'💬', title:'会話のテンポ', left:'短めが楽', right:'話すと元気'},
    {axis:'Y', icon:'🧭', title:'決め方', left:'気持ち優先', right:'筋道優先'},
    {axis:'Y', icon:'🤝', title:'助け方', left:'そっと寄りそう', right:'具体的に動く'},
    {axis:'Y', icon:'🌙', title:'夜の過ごし方', left:'静かに回復', right:'誰かと発散'}
  ];

  function mountQuiz(){
    const root = qs('#quiz'); if(!root) return;
    const bar = qs('#bar'), qwrap = qs('#qwrap');
    if(!bar||!qwrap) return;
    let idx=0;
    const macro = Array(Q.length).fill(0);
    const fine = Array(Q.length).fill(5);

    function render(){
      const q=Q[idx];
      bar.style.width = Math.round((idx/Q.length)*100)+'%';
      qwrap.innerHTML='';
      const title=document.createElement('h2'); title.className='q-title'; title.textContent='Q'+(idx+1)+' / '+Q.length+'：'+q.title; qwrap.appendChild(title);

      const opts=document.createElement('div'); opts.className='options';
      const left=document.createElement('button'); left.type='button'; left.className='option-card'; left.innerHTML=f'<div class="option-ic">{q.icon}</div><div class="option-body"><div class="option-title">{q.left}</div></div>';
      const right=document.createElement('button'); right.type='button'; right.className='option-card'; right.innerHTML=f'<div class="option-ic">{q.icon}</div><div class="option-body"><div class="option-title">{q.right}</div></div>';
      const setMacro=(v)=>{ macro[idx]=v; left.classList.toggle('active',v===0); right.classList.toggle('active',v===1); };
      left.addEventListener('click',()=>setMacro(0)); right.addEventListener('click',()=>setMacro(1)); setMacro(macro[idx]);
      opts.appendChild(left); opts.appendChild(right); qwrap.appendChild(opts);

      const rail=document.createElement('div'); rail.className='fine-rail';
      for(let i=1;i<=9;i++){ const d=document.createElement('div'); d.className='dot'+(fine[idx]===i?' active':''); d.addEventListener('click',()=>{fine[idx]=i; render();}); rail.appendChild(d); }
      qwrap.appendChild(rail);
      const labs=document.createElement('div'); labs.className='rail-labels'; labs.innerHTML='<span>やさしく</span><span>力強く</span>'; qwrap.appendChild(labs);

      const prev=qs('#prevBtn'), next=qs('#nextBtn');
      if(prev){ prev.disabled=idx===0; prev.onclick=()=>{ if(idx>0){idx--; render();} }; }
      if(next){
        next.textContent = idx===Q.length-1? '結果を見る':'次へ';
        next.onclick=()=>{
          if(idx<Q.length-1){ idx++; render(); return; }
          const fineNorm = fine.map(v=>(v-1)/8);
          let x=0,y=0,xc=0,yc=0;
          for(let i=0;i<Q.length;i++){
            const v = (macro[i]===1? .6 : .4)*0.4 + fineNorm[i]*0.6;
            if(Q[i].axis==='X'){x+=v;xc++;} else {y+=v;yc++;}
          }
          const X=x/xc, Y=y/yc;
          const lv=v=>v<.25?1: v<.5?2: v<.75?3: 4;
          const code='ABCD'[lv(X)-1]+String(lv(Y));
          const mix=(Math.abs(X-.5)<=.08)||(Math.abs(Y-.5)<=.08);
          const t=window.AFFINIA_TYPES.find(t=>t.code===code)||window.AFFINIA_TYPES[0];
          sessionStorage.setItem('affinia_result', JSON.stringify({type:t, code, mix, axes:{X,Y}}));
          location.href='result.html?t='+encodeURIComponent(code);
        };
      }
    }
    render();
  }

  document.addEventListener('DOMContentLoaded', ()=>{ try{ mountQuiz(); }catch(e){ console.error(e);} });
})();
