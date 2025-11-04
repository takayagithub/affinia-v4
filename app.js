const AFFINIA_TYPES = [{"code": "A1", "name": "ツンデレニャンコ", "catch": "素直じゃないのが素直。", "desc": "自分のペースを大切にしつつ、信頼した人にはよく懐きます。"}, {"code": "A2", "name": "情熱ヒーロー", "catch": "勢いとまっすぐさが武器。", "desc": "熱量が高く、まわりを前向きに引っぱります。"}, {"code": "A3", "name": "クールブレイン", "catch": "静かにコツコツ、頭脳派。", "desc": "ムダを減らして、静かに成果を出します。"}, {"code": "A4", "name": "ハッピーバニー", "catch": "その場を明るくする達人。", "desc": "空気をやわらかくして、皆を笑顔にします。"}, {"code": "B1", "name": "癒し天使", "catch": "やさしさで場をととのえる。", "desc": "人の気持ちに気づき、そっと支えるのが得意です。"}, {"code": "B2", "name": "おちゃめキツネ", "catch": "ひらめきと遊び心で動く。", "desc": "機転がきき、場を明るくひっくり返すことも。"}, {"code": "B3", "name": "博識フクロウ", "catch": "深く考えて、広く見る。", "desc": "情報を集め、洞察から一歩先を提案します。"}, {"code": "B4", "name": "ゴージャスプリンセス", "catch": "こだわりで魅せるリーダー気質。", "desc": "見た目や体験の質にもこだわり、安心感を出します。"}, {"code": "C1", "name": "夢見るユニコーン", "catch": "理想を形にしていく。", "desc": "思いつきを実験して形にしていきます。"}, {"code": "C2", "name": "頑張りミツバチ", "catch": "小さな積み重ねが得意。", "desc": "コツコツ続けて、信頼を積み上げます。"}, {"code": "C3", "name": "もじもじヒツジ", "catch": "静かな安心感。", "desc": "落ち着いた環境で力を発揮します。"}, {"code": "C4", "name": "ドジっ子リス", "catch": "元気で親しみやすい。", "desc": "多少のドジも愛嬌に変えられます。"}, {"code": "D1", "name": "パンクハリネズミ", "catch": "やさしい線引きが上手。", "desc": "自分と相手の距離感を大切にします。"}, {"code": "D2", "name": "マイペースナマケモノ", "catch": "自分のペースを守る名人。", "desc": "無理しないで結果を出すタイプです。"}, {"code": "D3", "name": "健気ワンコ", "catch": "誰かの力になるのが好き。", "desc": "縁の下の力持ちとして動けます。"}, {"code": "D4", "name": "キラキラアイドル", "catch": "自分らしく輝かせる。", "desc": "人前でも自分らしく表現できます。"}];

function qs(s){return document.querySelector(s);}
function getParam(name){ const u=new URL(location.href); return u.searchParams.get(name);}
function byCode(c){ return AFFINIA_TYPES.find(t=>t.code===c) || AFFINIA_TYPES[0]; }

const QUESTIONS = [
  {axis:'X', text:'朝のスタートは？', left:'ゆっくり整えてから', right:'すぐ動きたい'},
  {axis:'X', text:'予定の入れ方は？', left:'余裕を多めにとる', right:'勢いで詰めがち'},
  {axis:'X', text:'締切前の動き方は？', left:'前半で進める', right:'ラストスパート派'},
  {axis:'X', text:'休みの日は？', left:'のんびり回復', right:'アクティブに外へ'},
  {axis:'Y', text:'初対面での過ごし方は？', left:'少人数や一人が安心', right:'人と話すと元気'},
  {axis:'Y', text:'決め方は？', left:'まずは気持ちを大事に', right:'まずは筋道を大事に'},
  {axis:'Y', text:'相談は？', left:'近い人にゆっくり', right:'色々な人にテンポよく'},
  {axis:'Y', text:'役割は？', left:'支えるのが得意', right:'前でまとめるのが得意'},
];

function mountQuiz(){
  if(!qs('#quiz')) return;
  let idx=0; const answers = Array(QUESTIONS.length).fill(4);
  const bar = qs('#bar'), qwrap = qs('#qwrap'), bubbles = qs('#bubbles'), leftL=qs('#leftLabel'), rightL=qs('#rightLabel');
  function render(){
    const q=QUESTIONS[idx];
    bar.style.width = Math.round((idx/QUESTIONS.length)*100)+'%';
    qwrap.innerHTML = '<h2 class="q-title">Q'+(idx+1)+' / '+QUESTIONS.length+'：'+q.text+'</h2>';
    leftL.textContent = q.left; rightL.textContent = q.right;
    bubbles.innerHTML='';
    for(let i=1;i<=8;i++){
      const b=document.createElement('button');
      b.type='button'; b.className='bubble s'+i+(answers[idx]===i?' active':''); b.textContent='';
      b.setAttribute('aria-label','選択肢 '+i);
      b.onclick=()=>{ answers[idx]=i; render(); };
      bubbles.appendChild(b);
    }
    qs('#prevBtn').disabled = idx===0;
    qs('#nextBtn').textContent = idx===QUESTIONS.length-1 ? "結果を見る" : "次へ";
  }
  qs('#prevBtn').onclick=()=>{ if(idx>0){idx--; render();} };
  qs('#nextBtn').onclick=()=>{
    if(idx<QUESTIONS.length-1){ idx++; render(); return; }
    const norm = answers.map(v => (v-1)/7);
    let x=0,y=0,xc=0,yc=0;
    for(let i=0;i<QUESTIONS.length;i++){ if(QUESTIONS[i].axis==='X'){x+=norm[i];xc++;} else {y+=norm[i];yc++;} }
    function lv(v){ return v<.25?1: v<.5?2: v<.75?3: 4; }
    const code='ABCD'[lv(x/xc)-1]+String(lv(y/yc));
    const t = byCode(code);
    sessionStorage.setItem('affinia_result', JSON.stringify({type:t, answers, code}));
    location.href = 'result.html?t='+encodeURIComponent(code);
  };
  render();
}

function mountResult(){
  if(!qs('#resultBox')) return;
  let code = getParam('t');
  if(!code){
    try{ const s=sessionStorage.getItem('affinia_result'); if(s) code=JSON.parse(s).code; }catch(e){}
  }
  const t = byCode(code);
  const box = qs('#resultBox');
  if(!t){ box.innerHTML = '<div class="card"><p>結果が見つかりませんでした。もう一度お試しください。</p><div class="list-inline"><a class="btn primary" href="quiz.html">診断をやり直す</a></div></div>'; return; }
  box.innerHTML =
    '<article class="card">'+
      '<span class="kicker">あなたに近いタイプ</span>'+
      '<h2>'+t.name+' <span class="badge">'+t.code+'</span></h2>'+
      '<p><strong>'+t.catch+'</strong></p>'+
      '<p>'+t.desc+'</p>'+
      '<div class="list-inline">'+
        '<a class="btn primary" href="relation.html?me='+encodeURIComponent(t.code)+'">タイプ相性を見る</a>'+
        '<a class="btn ghost" href="types.html">全タイプを見る</a>'+
        '<a class="btn ghost" href="quiz.html">もう一度ためす</a>'+
      '</div>'+
    '</article>';
}
document.addEventListener('DOMContentLoaded',()=>{ mountQuiz(); mountResult(); });
