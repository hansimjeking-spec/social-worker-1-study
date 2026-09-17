(function(){
  const $=(s,r=document)=>r.querySelector(s), arr=v=>Array.isArray(v)?v:[];
  const esc=v=>String(v??'').replace(/업무상질병/g,'업무상 질병').replace(/아동의최상의/g,'아동의 최상의').replace(/기회를줄인다/g,'기회를 줄인다').replace(/차미가/g,'차이가').replace(/유면성/g,'유연성').replace(/확정기며식/g,'확정기여식').replace(/반반씩부담/g,'반반씩 부담').replace(/정책평가는사회복지/g,'정책평가는 사회복지').replace(/얻기위함/g,'얻기 위함').replace(/에영\s*향을미친다/g,'에 영향을 미친다').replace(/영\s*향을미친다/g,'영향을 미친다').replace(/과업환\s*경으로구분할수/g,'과업환경으로 구분할 수').replace(/에대한사람들의태도는정책/g,'에 대한 사람들의 태도는 정책').replace(/배\s*제된다/g,'배제된다').replace(/규칙\s+에의해서/g,'규칙에 의해서').replace(/추구\s+한다/g,'추구한다').replace(/한번\s+씩/g,'한 번씩').replace(/가입\s+하여야/g,'가입하여야').replace(/산출:상담전문가10인/g,'산출: 상담 전문가 10인').replace(/질측정도구/g,'질 측정도구').replace(/자산조사를\s*거쳐대상을/g,'자산조사를 거쳐 대상을').replace(/정해진\s+기일/g,'정해진 기일').replace(/발달와/g,'발달과').replace(/지역복지(['’])을/g,'지역복지$1를').replace(/참며자/g,'참여자').replace(/비교\s+한다/g,'비교한다').replace(/정도를평가/g,'정도를 평가').replace(/조사시/g,'조사 시').replace(/표집를선정/g,'표집단위 선정').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  const lab=n=>['①','②','③','④','⑤'][Number(n)]||String(Number(n)+1);
  const norm=s=>s==='사회복지법제론'?'사회복지법제와 실천':String(s||'');
  const yr=q=>String(q.year||arr(q.tags).find(t=>/^20\d{2}$/.test(String(t)))||'');
  const qs=()=>arr(window.SAMPLE_QUESTIONS).map(q=>({...q,subject:norm(q.subject)})).filter(q=>q.question&&arr(q.choices).length);
  const uniq=a=>Array.from(new Set(a.filter(Boolean)));
  const fallback=(q,i)=>Number(q.answer)===i?`${lab(i)}는 정답 선지입니다. 문제의 조건과 가장 잘 맞는 표현입니다.`:`${lab(i)}는 정답 선지와 비교해 핵심 조건이 맞지 않는 오답입니다.`;
  const caseMarkup=(q)=>{const src=window.CASE_IMAGE_MAP?.[q.id];if(!src)return '';const text=String(q.question||'');const label=/다음 내용/.test(text)?'내용':/다음 사례/.test(text)?'사례':'자료';return `<div class="case-content"><strong>원문 ${label}</strong><img src="${esc(src)}" alt="${label} 원문" loading="lazy"></div>`};
  function render(){
    const root=$('#answersView');if(!root)return;
    const all=qs();const sub=$('#ansSub')?.value||'';const y=$('#ansYear')?.value||'2026';
    const subs=uniq(all.map(q=>q.subject)).sort(), years=uniq(all.map(yr)).sort((a,b)=>Number(b)-Number(a));
    const list=all.filter(q=>(!sub||q.subject===sub)&&(!y||yr(q)===String(y)));
    root.innerHTML=`<section class="panel"><div class="panel-heading"><div><p class="eyebrow">선지별 해설</p><h3>해설집</h3></div></div><div class="toolbar"><label>과목<select id="ansSub"><option value="">전체</option>${subs.map(s=>`<option value="${esc(s)}" ${s===sub?'selected':''}>${esc(s)}</option>`).join('')}</select></label><label>연도<select id="ansYear"><option value="">전체</option>${years.map(v=>`<option value="${esc(v)}" ${String(v)===String(y)?'selected':''}>${esc(v)}년</option>`).join('')}</select></label></div><p class="summary-count">${list.length}문항 · 2026년은 선지별 해설 초안 표시</p><div class="answer-detail-list">${list.slice(0,80).map(q=>`<article class="answer-detail-card"><p class="question-meta">${esc(yr(q)||'연도 미상')}년 · ${esc(q.period||'교시 미상')} · ${esc(q.subject)} ${q.number?`· ${esc(q.number)}번`:''}</p><h4>${q.number?`${esc(q.number)}번. `:''}${esc(q.question)}</h4>${caseMarkup(q)}<div class="choices-view">${q.choices.map((c,i)=>`<div class="answer-choice ${Number(q.answer)===i?'correct-choice':''}"><strong>${lab(i)}</strong><span>${esc(c)}</span></div><div class="answer-note"><b>${Number(q.answer)===i?'정답인 이유':'오답인 이유'}</b><br>${esc(arr(q.choiceExplanations)[i]||fallback(q,i))}</div>`).join('')}</div></article>`).join('')||'<div class="empty-state">선택 조건에 해당하는 문항이 없습니다.</div>'}</div>${list.length>80?'<p class="muted">화면 속도를 위해 80문항까지만 표시합니다. 과목이나 연도로 좁혀 보세요.</p>':''}</section>`;
    $('#ansSub')?.addEventListener('change',render);$('#ansYear')?.addEventListener('change',render);
  }
  function hook(){document.querySelector('[data-view="answers"]')?.addEventListener('click',()=>setTimeout(render,160));if($('#answersView')?.classList.contains('active'))render()}
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',hook):hook();
})();
