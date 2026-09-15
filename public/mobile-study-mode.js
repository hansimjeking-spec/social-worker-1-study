(function(){
  const style=document.createElement('style');
  style.textContent=`
    @media(max-width:760px){
      body{background:#f6f7fb}.topbar{position:sticky;top:0;z-index:30;background:rgba(246,247,251,.94);backdrop-filter:blur(10px);padding-bottom:10px}.nav{display:flex;overflow:auto;gap:8px;padding-bottom:4px}.nav-item{min-width:max-content;border-radius:999px}.study-meter{display:none}.question-card,.answer-detail-card,.summary-card{border-radius:22px;box-shadow:0 10px 30px rgba(15,23,42,.08);border:1px solid #dbe5f3}.question-card h4,.answer-detail-card h4{font-size:18px;line-height:1.55}.choice,.answer-choice,.choice-line{border-radius:16px;padding:14px;min-height:52px}.toolbar{position:sticky;top:76px;z-index:20;background:rgba(246,247,251,.94);backdrop-filter:blur(10px);border:1px solid #e2e8f0;border-radius:18px;padding:10px}.summary-count{font-weight:900;color:#17365f}.cbt-layout,.quiz-layout,.summary-layout,.library-grid,.pdf-layout{grid-template-columns:1fr}.compact-panel{order:2}.primary-button,.ghost-button,.small-button,.ghost-link{min-height:44px}.answer-detail-list,.question-area{scroll-snap-type:y proximity}.answer-detail-card,.question-card{scroll-snap-align:start}.explain,.answer-note{font-size:15px;line-height:1.75}.day-badge,.count-badge{font-size:12px}.pdf-list{max-height:none}.pdf-frame{min-height:58vh}
    }
    .study-card-tip{margin:10px 0 14px;background:#eef6ff;border:1px solid #bfdbfe;color:#1e3a8a;border-radius:16px;padding:12px;line-height:1.6;font-weight:800}
  `;
  document.head.appendChild(style);
  function addTip(){
    ['pastView','answersView','quizView'].forEach(id=>{
      const root=document.getElementById(id);
      if(!root||root.querySelector('.study-card-tip'))return;
      const tip=document.createElement('div');
      tip.className='study-card-tip';
      tip.textContent='모바일에서는 카드처럼 한 문항씩 넘기며 볼 수 있게 최적화했습니다.';
      root.prepend(tip);
    });
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(addTip,1200));
  document.addEventListener('click',e=>{if(e.target.closest('.nav-item'))setTimeout(addTip,300)});
})();
