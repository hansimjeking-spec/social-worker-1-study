(function(){
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const style=document.createElement('style');
  style.textContent=`
    .summary-cardnews-controls{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:12px 0 16px;padding:10px;border:1px solid var(--line);border-radius:18px;background:#fff}
    .summary-cardnews-controls .button-row{display:flex;gap:8px;align-items:center}
    .summary-cardnews-counter{font-weight:900;color:#17365f;background:#eef6ff;border:1px solid #bfdbfe;border-radius:999px;padding:8px 12px;white-space:nowrap}
    .summary-list.cardnews-mode{display:block;max-width:860px;margin:0 auto}
    .summary-list.cardnews-mode .summary-card{display:none;min-height:420px;border-radius:26px;padding:28px;box-shadow:0 18px 45px rgba(15,23,42,.10)}
    .summary-list.cardnews-mode .summary-card.active-cardnews{display:block;animation:cardSlideIn .18s ease-out}
    .summary-list.cardnews-mode .summary-title{font-size:28px;line-height:1.35}
    .summary-list.cardnews-mode .summary-one{font-size:18px;line-height:1.75}
    .summary-list.cardnews-mode .summary-box{font-size:16px;line-height:1.75}
    .summary-cardnews-help{color:var(--muted);font-size:13px;font-weight:700}
    @keyframes cardSlideIn{from{opacity:.2;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @media(max-width:760px){
      .summary-cardnews-controls{position:sticky;top:76px;z-index:25;flex-direction:column;align-items:stretch;background:rgba(255,255,255,.94);backdrop-filter:blur(10px)}
      .summary-cardnews-controls .button-row{justify-content:space-between}
      .summary-cardnews-controls button{flex:1;min-height:46px}
      .summary-cardnews-counter{text-align:center}
      .summary-list.cardnews-mode .summary-card{min-height:64vh;padding:22px;border-radius:24px}
      .summary-list.cardnews-mode .summary-title{font-size:24px}
      .summary-list.cardnews-mode .summary-one{font-size:17px}
    }
  `;
  document.head.appendChild(style);

  let index=0;
  function ensureControls(root){
    let controls=$('#summaryCardnewsControls',root);
    if(controls) return controls;
    controls=document.createElement('div');
    controls.id='summaryCardnewsControls';
    controls.className='summary-cardnews-controls';
    controls.innerHTML=`<div><strong>카드뉴스 학습</strong><div class="summary-cardnews-help">요약 개념을 한 장씩 넘기며 복습합니다.</div></div><div class="button-row"><button class="ghost-button" id="summaryPrevCard">이전</button><span class="summary-cardnews-counter" id="summaryCardCounter">0 / 0</span><button class="primary-button" id="summaryNextCard">다음</button></div>`;
    const count=$('#summaryCount',root);
    if(count) count.insertAdjacentElement('afterend',controls);
    else root.prepend(controls);
    $('#summaryPrevCard',controls).addEventListener('click',()=>move(-1));
    $('#summaryNextCard',controls).addEventListener('click',()=>move(1));
    return controls;
  }
  function cards(){return $$('#summaryList .summary-card');}
  function render(){
    const root=$('#summaryView');
    const list=$('#summaryList');
    if(!root||!list) return;
    const items=cards();
    if(!items.length){
      const controls=$('#summaryCardnewsControls');
      if(controls) controls.remove();
      return;
    }
    ensureControls(root);
    list.classList.add('cardnews-mode');
    if(index>=items.length) index=items.length-1;
    if(index<0) index=0;
    items.forEach((card,i)=>card.classList.toggle('active-cardnews',i===index));
    const counter=$('#summaryCardCounter');
    if(counter) counter.textContent=`${index+1} / ${items.length}`;
    const prev=$('#summaryPrevCard'), next=$('#summaryNextCard');
    if(prev) prev.disabled=index===0;
    if(next) next.disabled=index===items.length-1;
  }
  function move(delta){index+=delta;render();cards()[index]?.scrollIntoView({behavior:'smooth',block:'center'});}
  function reset(){index=0;setTimeout(render,120);setTimeout(render,450);}
  function hook(){
    document.querySelector('[data-view="summary"]')?.addEventListener('click',reset);
    ['summarySubject','summaryTag','summarySearch','examModeToggle'].forEach(id=>{
      const el=document.getElementById(id);
      if(el){el.addEventListener('input',reset);el.addEventListener('change',reset);}
    });
    if($('#summaryView')?.classList.contains('active')) reset();
  }
  document.addEventListener('keydown',e=>{
    if(!$('#summaryView')?.classList.contains('active')) return;
    if(e.key==='ArrowLeft') move(-1);
    if(e.key==='ArrowRight') move(1);
  });
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',hook):hook();
})();
