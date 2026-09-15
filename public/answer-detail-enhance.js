(function(){
  const $=(s,r=document)=>r.querySelector(s), arr=v=>Array.isArray(v)?v:[];
  const esc=v=>String(v??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  const lab=n=>['①','②','③','④','⑤'][Number(n)]||String(Number(n)+1);
  const norm=s=>s==='사회복지법제론'?'사회복지법제와 실천':String(s||'');
  const yr=q=>String(q.year||arr(q.tags).find(t=>/^20\d{2}$/.test(String(t)))||'');
  const qs=()=>arr(window.SAMPLE_QUESTIONS).map(q=>({...q,subject:norm(q.subject)})).filter(q=>q.question&&arr(q.choices).length);
  const uniq=a=>Array.from(new Set(a.filter(Boolean)));
  const fallback=(q,i)=>Number(q.answer)===i?`${lab(i)}는 정답 선지입니다. 문제의 조건과 가장 잘 맞는 표현입니다.`:`${lab(i)}는 정답 선지와 비교해 핵심 조건이 맞지 않는 오답입니다.`;
  function render(){
    const root=$('#answersView');if(!root)return;
    const all=qs();const sub=$('#ansSub')?.value||'';const y=$('#ansYear')?.value||'2026';
    const subs=uniq(all.map(q=>q.subject)).sort(), years=uniq(all.map(yr)).sort((a,b)=>Number(b)-Number(a));
    const list=all.filter(q=>(!sub||q.subject===sub)&&(!y||yr(q)===String(y)));
    root.innerHTML=`<section class="panel"><div class="panel-heading"><div><p class="eyebrow">선지별 해설</p><h3>해설집</h3></div></div><div class="toolbar"><label>과목<select id="ansSub"><option value="">전체</option>${subs.map(s=>`<option value="${esc(s)}" ${s===sub?'selected':''}>${esc(s)}</option>`).join('')}</select></label><label>연도<select id="ansYear"><option value="">전체</option>${years.map(v=>`<option value="${esc(v)}" ${String(v)===String(y)?'selected':''}>${esc(v)}년</option>`).join('')}</select></label></div><p class="summary-count">${list.length}문항 · 2026년은 선지별 해설 초안 표시</p><div class="answer-detail-list">${list.slice(0,80).map(q=>`<article class="answer-detail-card"><p class="question-meta">${esc(yr(q)||'연도 미상')}년 · ${esc(q.period||'교시 미상')} · ${esc(q.subject)} ${q.number?`· ${esc(q.number)}번`:''}</p><h4>${q.number?`${esc(q.number)}번. `:''}${esc(q.question)}</h4><div class="choices-view">${q.choices.map((c,i)=>`<div class="answer-choice ${Number(q.answer)===i?'correct-choice':''}"><strong>${lab(i)}</strong><span>${esc(c)}</span></div><div class="answer-note"><b>${Number(q.answer)===i?'정답인 이유':'오답인 이유'}</b><br>${esc(arr(q.choiceExplanations)[i]||fallback(q,i))}</div>`).join('')}</div></article>`).join('')||'<div class="empty-state">선택 조건에 해당하는 문항이 없습니다.</div>'}</div>${list.length>80?'<p class="muted">화면 속도를 위해 80문항까지만 표시합니다. 과목이나 연도로 좁혀 보세요.</p>':''}</section>`;
    $('#ansSub')?.addEventListener('change',render);$('#ansYear')?.addEventListener('change',render);
  }
  function hook(){document.querySelector('[data-view="answers"]')?.addEventListener('click',()=>setTimeout(render,160));if($('#answersView')?.classList.contains('active'))render()}
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',hook):hook();
})();
