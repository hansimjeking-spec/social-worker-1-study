(function enhanceViews(){
  const style=document.createElement('style');
  style.textContent='.pdf-toolbar{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px}.pdf-item{width:100%;border:1px solid var(--line);border-radius:14px;background:#fff;padding:12px;text-align:left;display:grid;gap:4px;color:var(--ink)}.pdf-item:hover,.pdf-item.active{border-color:#93c5fd;background:#eff6ff}.pdf-item strong{font-size:15px}.pdf-item span{font-size:12px;color:var(--muted)}.choices-view{display:grid;gap:8px}.always-open .explain{display:block}.pdf-panel{min-height:75vh}.pdf-frame{background:#f8fafc}.material-warning{background:#fff7ed;border:1px solid #fed7aa;color:#9a3412;border-radius:14px;padding:12px;margin-top:10px;line-height:1.6}.answer-detail-list{display:grid;gap:14px}.answer-detail-card{border:1px solid var(--line);border-radius:18px;background:#fff;padding:18px}.answer-choice{display:grid;grid-template-columns:40px 1fr;gap:10px;border:1px solid var(--line);border-radius:12px;background:#f8fafc;padding:10px}.answer-choice.correct-choice{background:#ecfdf5;border-color:#86efac}.answer-choice strong{color:#17365f}.answer-note{margin-top:12px;background:#f8fafc;border:1px solid var(--line);border-radius:14px;padding:12px;line-height:1.7}@media(max-width:980px){.pdf-toolbar{align-items:flex-start;flex-direction:column}.pdf-panel{min-height:auto}.pdf-frame{min-height:60vh}.answer-detail-card{padding:14px}.answer-choice{grid-template-columns:34px 1fr}}';
  document.head.appendChild(style);
  const $=(s,root=document)=>root.querySelector(s);
  const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
  const esc=(v)=>String(v??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  const safeArr=(v)=>Array.isArray(v)?v:[];
  const uniq=(arr)=>Array.from(new Set(arr.filter(v=>v!==undefined&&v!==null&&String(v).trim()!=='')));
  const answerLabel=(n)=>['①','②','③','④','⑤'][Number(n)]||String(Number(n)+1);
  const normalizeSubject=(s)=>s==='사회복지법제론'?'사회복지법제와 실천':String(s||'');
  const questions=()=>safeArr(window.SAMPLE_QUESTIONS).map(q=>({...q,subject:normalizeSubject(q.subject)})).filter(q=>q.question&&Array.isArray(q.choices));
  const fileExt=(url='')=>String(url).split('?')[0].split('#')[0].split('.').pop()?.toLowerCase()||'';
  const canPreview=(url='')=>['pdf','png','jpg','jpeg','webp','txt'].includes(fileExt(url));
  const subjects=()=>Array.from(new Set([...(Array.isArray(window.SUBJECTS)?window.SUBJECTS:[]),'인간행동과 사회환경','사회복지조사론','사회복지실천론','사회복지실천기술론','지역사회복지론','사회복지정책론','사회복지행정론','사회복지법제와 실천'].map(normalizeSubject)));
  const yearOf=q=>q.year||safeArr(q.tags).find(t=>/^20\d{2}$/.test(String(t)))||'';
  const explainOf=q=>{
    const raw=String(q.explain||'').trim();
    const bad=!raw||raw.includes('교사용 PDF')||raw.includes('정답지를 확인')||raw.length<8;
    const correct=q.choices?.[Number(q.answer)]||'';
    if(!bad) return raw;
    return correct?`정답은 ${answerLabel(q.answer)}번입니다. 정답 선지 「${correct}」가 문제의 조건에 가장 부합합니다. 다른 선택지는 대상, 시기, 주체, 원칙, 예외 조건 중 일부가 달라진 오답인지 확인하세요.`:'정답 선지를 기준으로 문제의 핵심 조건과 보기의 표현을 비교해 복습하세요.';
  };

  function materialItems(){
    const registered=safeArr(window.PDF_LIBRARY).map((p,i)=>({
      id:p.id||`material-${i}`,
      title:p.title||p.name||p.subject||`자료 ${i+1}`,
      subject:normalizeSubject(p.subject||''),
      type:p.type||p.kind||fileExt(p.url||p.path||p.file||'').toUpperCase()||'자료',
      url:p.url||p.path||p.file||p.href||'',
      description:p.description||p.desc||p.memo||''
    })).filter(x=>x.url);
    const seen=new Set();
    return registered.filter(item=>{if(!item.url||seen.has(item.url)) return false;seen.add(item.url);return true});
  }

  function renderMaterials(){
    const root=$('#pdfsView');
    if(!root) return;
    const items=materialItems();
    if(!items.length){root.innerHTML='<section class="panel empty-state"><h3>등록된 교재 자료가 없습니다</h3><p><code>materials-data.js</code>에 과목별 교재 PDF가 등록되지 않았습니다.</p></section>';return;}
    const first=items[0];
    root.innerHTML=`<div class="pdf-layout"><aside class="panel compact-panel"><div class="panel-heading"><div><p class="eyebrow">과목별 학습자료</p><h3>교재 목록</h3></div></div><div id="materialList" class="pdf-list">${items.map((item,index)=>`<button class="pdf-item ${index===0?'active':''}" data-i="${index}"><strong>${esc(item.title)}</strong><span>${esc(item.subject||'공통')} · ${esc(item.type)}</span></button>`).join('')}</div></aside><section class="panel pdf-panel"><div class="pdf-toolbar"><div><p class="eyebrow" id="materialSubjectLabel">${esc(first.subject||'교재')}</p><h3 id="materialTitle">${esc(first.title)}</h3></div><a class="ghost-link" id="openMaterialLink" href="${esc(first.url)}" target="_blank" rel="noreferrer">${canPreview(first.url)?'새 탭으로 열기':'다운로드'}</a></div><iframe id="materialFrame" class="pdf-frame" title="교재 자료 미리보기" src="${canPreview(first.url)?esc(first.url):'about:blank'}"></iframe><p class="muted" id="materialPath">찾는 경로: ${esc(first.url)}</p><div class="material-warning" id="materialHelp">${canPreview(first.url)?'교재 PDF만 표시합니다. 기출문제는 왼쪽 메뉴의 연도별 기출에서 확인하세요.':'이 파일은 브라우저 미리보기가 어려워 다운로드로 열어야 합니다.'}</div></section></div>`;
    const select=index=>{const item=items[index];if(!item)return;$$('#materialList .pdf-item').forEach(btn=>btn.classList.toggle('active',Number(btn.dataset.i)===index));$('#materialSubjectLabel').textContent=item.subject||'교재';$('#materialTitle').textContent=item.title;$('#openMaterialLink').href=item.url;$('#openMaterialLink').textContent=canPreview(item.url)?'새 탭으로 열기':'다운로드';$('#materialFrame').src=canPreview(item.url)?item.url:'about:blank';$('#materialPath').textContent='찾는 경로: '+item.url;$('#materialHelp').textContent=canPreview(item.url)?'교재 PDF만 표시합니다. 기출문제는 왼쪽 메뉴의 연도별 기출에서 확인하세요.':'이 파일은 브라우저 미리보기가 어려워 다운로드로 열어야 합니다.';};
    $$('#materialList .pdf-item').forEach(btn=>btn.addEventListener('click',()=>select(Number(btn.dataset.i))));
  }

  function renderPastDetails(){
    const root=$('#pastView');if(!root)return;
    const all=questions().filter(q=>q.year||safeArr(q.tags).some(t=>/^20\d{2}$/.test(String(t))));
    if(!all.length){root.innerHTML='<div class="panel empty-state">연도 정보가 있는 기출문제가 없습니다.</div>';return;}
    const prevYear=$('#detailPastYear')?.value||'';const prevPeriod=$('#detailPastPeriod')?.value||'';const prevSubject=$('#detailPastSubject')?.value||'';
    const years=uniq(all.map(yearOf)).sort((a,b)=>Number(b)-Number(a));const periods=uniq(all.map(q=>q.period)).sort();
    const year=prevYear||years[0]||'';const period=prevPeriod||'';const subject=prevSubject||'';
    const filtered=all.filter(q=>(!year||String(yearOf(q))===String(year))&&(!period||q.period===period)&&(!subject||q.subject===subject));
    const rows=filtered.slice(0,60).map((q,idx)=>`<article class="question-card always-open"><div class="question-meta">${idx+1}. ${esc(yearOf(q)||'연도 미상')}년 · ${esc(q.period||'교시 미상')} · ${esc(q.subject)} ${q.number?`· ${esc(q.number)}번`:''}</div><h4>${esc(q.question)}</h4><div class="choices-view">${q.choices.map((c,n)=>`<div class="choice ${Number(q.answer)===n?'correct-choice':''}"><span>${answerLabel(n)}</span><span>${esc(c)}</span></div>`).join('')}</div><div class="explain" style="display:block"><strong>정답 ${answerLabel(q.answer)}</strong><br>${esc(explainOf(q))}</div></article>`).join('');
    root.innerHTML=`<section class="panel"><div class="panel-heading"><div><p class="eyebrow">문제·보기·정답</p><h3>연도별 기출 상세 보기</h3></div></div><div class="toolbar"><label>연도<select id="detailPastYear"><option value="">전체</option>${years.map(y=>`<option value="${esc(y)}" ${String(y)===String(year)?'selected':''}>${esc(y)}년</option>`).join('')}</select></label><label>교시<select id="detailPastPeriod"><option value="">전체</option>${periods.map(p=>`<option value="${esc(p)}" ${p===period?'selected':''}>${esc(p)}</option>`).join('')}</select></label><label>과목<select id="detailPastSubject"><option value="">전체</option>${subjects().map(s=>`<option value="${esc(s)}" ${s===subject?'selected':''}>${esc(s)}</option>`).join('')}</select></label></div><p class="summary-count">선택 조건 ${filtered.length}문항 · 목록은 60문항까지 표시</p><div class="question-area">${rows||'<div class="empty-state">선택 조건에 해당하는 문제가 없습니다.</div>'}</div>${filtered.length>60?'<p class="muted">화면 속도를 위해 60문항까지만 표시합니다. 연도·교시·과목으로 좁혀 보세요.</p>':''}</section>`;
    ['#detailPastYear','#detailPastPeriod','#detailPastSubject'].forEach(id=>$(id)?.addEventListener('change',renderPastDetails));
  }

  function renderAnswerDetails(){
    const root=$('#answersView');if(!root)return;
    const all=questions().filter(q=>q.year||safeArr(q.tags).includes('실제기출')||q.explain);
    if(!all.length){root.innerHTML='<div class="panel empty-state">표시할 해설 데이터가 없습니다.</div>';return;}
    const prevSubject=$('#detailAnswerSubject')?.value||'';const prevYear=$('#detailAnswerYear')?.value||'';
    const years=uniq(all.map(yearOf)).sort((a,b)=>Number(b)-Number(a));
    const filtered=all.filter(q=>(!prevSubject||q.subject===prevSubject)&&(!prevYear||String(yearOf(q))===String(prevYear)));
    const rows=filtered.slice(0,80).map(q=>`<article class="answer-detail-card"><p class="question-meta">${esc(yearOf(q)||'연도 미상')}년 · ${esc(q.period||'교시 미상')} · ${esc(q.subject)} ${q.number?`· ${esc(q.number)}번`:''}</p><h4>${q.number?`${esc(q.number)}번. `:''}${esc(q.question)}</h4><div class="choices-view">${q.choices.map((c,n)=>`<div class="answer-choice ${Number(q.answer)===n?'correct-choice':''}"><strong>${answerLabel(n)}</strong><span>${esc(c)}</span></div>`).join('')}</div><div class="answer-note"><strong>정답 ${answerLabel(q.answer)}</strong><br>${esc(explainOf(q))}</div></article>`).join('');
    root.innerHTML=`<section class="panel"><div class="panel-heading"><div><p class="eyebrow">정답 확인</p><h3>해설집</h3></div></div><div class="toolbar"><label>과목<select id="detailAnswerSubject"><option value="">전체</option>${subjects().map(s=>`<option value="${esc(s)}" ${s===prevSubject?'selected':''}>${esc(s)}</option>`).join('')}</select></label><label>연도<select id="detailAnswerYear"><option value="">전체</option>${years.map(y=>`<option value="${esc(y)}" ${String(y)===String(prevYear)?'selected':''}>${esc(y)}년</option>`).join('')}</select></label></div><p class="summary-count">${filtered.length}개 문항 · 문제, 보기, 정답, 기본 해설 표시</p><div class="answer-detail-list">${rows||'<div class="empty-state">선택 조건에 해당하는 해설이 없습니다.</div>'}</div>${filtered.length>80?'<p class="muted">화면 속도를 위해 80문항까지만 표시합니다. 과목이나 연도로 좁혀 보세요.</p>':''}</section>`;
    ['#detailAnswerSubject','#detailAnswerYear'].forEach(id=>$(id)?.addEventListener('change',renderAnswerDetails));
  }

  function hook(){
    document.querySelector('[data-view="pdfs"]')?.addEventListener('click',()=>setTimeout(renderMaterials,80));
    document.querySelector('[data-view="past"]')?.addEventListener('click',()=>setTimeout(renderPastDetails,80));
    document.querySelector('[data-view="answers"]')?.addEventListener('click',()=>setTimeout(renderAnswerDetails,80));
    if($('#pdfsView')?.classList.contains('active')) renderMaterials();
    if($('#pastView')?.classList.contains('active')) renderPastDetails();
    if($('#answersView')?.classList.contains('active')) renderAnswerDetails();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',hook);else hook();
})();
