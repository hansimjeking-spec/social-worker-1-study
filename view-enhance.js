(function enhanceViews(){
  const $=(s,root=document)=>root.querySelector(s);
  const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
  const esc=(v)=>String(v??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  const safeArr=(v)=>Array.isArray(v)?v:[];
  const uniq=(arr)=>Array.from(new Set(arr.filter(v=>v!==undefined&&v!==null&&String(v).trim()!=='')));
  const answerLabel=(n)=>['①','②','③','④','⑤'][Number(n)]||String(Number(n)+1);
  const normalizeSubject=(s)=>s==='사회복지법제론'?'사회복지법제와 실천':String(s||'');
  const questions=()=>safeArr(window.SAMPLE_QUESTIONS).map(q=>({...q,subject:normalizeSubject(q.subject)})).filter(q=>q.question&&Array.isArray(q.choices));
  const fileExt=(url='')=>String(url).split('?')[0].split('#')[0].split('.').pop()?.toLowerCase()||'';
  const isPreviewable=(url='')=>['pdf','png','jpg','jpeg','webp','txt'].includes(fileExt(url));
  const subjects=()=>Array.from(new Set([...(Array.isArray(window.SUBJECTS)?window.SUBJECTS:[]),'인간행동과 사회환경','사회복지조사론','사회복지실천론','사회복지실천기술론','지역사회복지론','사회복지정책론','사회복지행정론','사회복지법제와 실천'].map(normalizeSubject)));

  function materialItems(){
    const registered=safeArr(window.PDF_LIBRARY).map((p,i)=>({
      id:p.id||`material-${i}`,
      title:p.title||p.name||p.subject||`자료 ${i+1}`,
      subject:normalizeSubject(p.subject||''),
      type:p.type||p.kind||fileExt(p.url||p.path||p.file||'').toUpperCase()||'자료',
      url:p.url||p.path||p.file||p.href||'',
      description:p.description||p.desc||p.memo||''
    })).filter(x=>x.url);
    const paperSets=safeArr(window.PAST_PAPER_DATA?.paperSets);
    const derived=[];
    paperSets.forEach((set,i)=>{
      const urls=[
        ['학생용 기출',set.studentUrl||set.studentPdf||set.studentPath],
        ['교사용 기출',set.teacherUrl||set.teacherPdf||set.teacherPath],
        ['원문',set.url||set.pdfUrl||set.sourceUrl]
      ].filter(([,url])=>url);
      urls.forEach(([type,url],j)=>derived.push({
        id:`paper-${i}-${j}`,
        title:set.title||`${set.year||''}년 ${set.period||''} ${type}`,
        subject:normalizeSubject(set.subject||''),
        type,
        url,
        description:`${set.year||''}년 ${set.period||''}`
      }));
    });
    const seen=new Set();
    return [...registered,...derived].filter(item=>{if(!item.url||seen.has(item.url)) return false;seen.add(item.url);return true});
  }

  function renderMaterials(){
    const root=$('#pdfsView');
    if(!root) return;
    const items=materialItems();
    const prevSubject=$('#materialSubject')?.value||'';
    const prevType=$('#materialType')?.value||'';
    const allSubjects=uniq(items.map(x=>x.subject)).sort();
    const types=uniq(items.map(x=>x.type)).sort();
    const filtered=items.filter(x=>(!prevSubject||x.subject===prevSubject)&&(!prevType||x.type===prevType));
    if(!items.length){
      root.innerHTML=`<section class="panel empty-state"><h3>등록된 교재 자료가 없습니다</h3><p>과목별 HWP/HWPX/PDF 파일은 GitHub 저장소의 <code>public/files/</code> 폴더에 올리면 됩니다.</p><p>그다음 <code>materials-data.js</code>에 파일 정보를 등록하세요.</p><pre class="export-box">window.PDF_LIBRARY.push({\n  subject: '인간행동과 사회환경',\n  title: '인간행동과 사회환경 한글 원본',\n  type: 'HWP',\n  url: './files/인간행동과사회환경.hwp'\n});</pre><p class="muted">PDF는 바로 열기, HWP/HWPX는 다운로드 방식으로 연결됩니다.</p></section>`;
      return;
    }
    root.innerHTML=`<section class="panel"><div class="panel-heading"><div><p class="eyebrow">교재·기출 원문</p><h3>교재 자료실</h3></div></div><div class="toolbar"><label>과목<select id="materialSubject"><option value="">전체</option>${allSubjects.map(s=>`<option value="${esc(s)}" ${s===prevSubject?'selected':''}>${esc(s)}</option>`).join('')}</select></label><label>유형<select id="materialType"><option value="">전체</option>${types.map(t=>`<option value="${esc(t)}" ${t===prevType?'selected':''}>${esc(t)}</option>`).join('')}</select></label></div><p class="summary-count">등록 자료 ${items.length}개 · 선택 조건 ${filtered.length}개</p><div class="summary-list">${filtered.map(item=>{
      const preview=isPreviewable(item.url);
      return `<article class="summary-card"><div class="summary-head"><div><p class="eyebrow">${esc(item.subject||'공통')} · ${esc(item.type)}</p><h3 class="summary-title">${esc(item.title)}</h3></div></div><p class="summary-one">${esc(item.description||fileExt(item.url).toUpperCase()+' 파일')}</p><div class="summary-foot"><a class="small-button" href="${esc(item.url)}" target="_blank" rel="noopener">${preview?'열기':'다운로드'}</a></div></article>`;
    }).join('')||'<div class="empty-state">선택 조건에 해당하는 자료가 없습니다.</div>'}</div></section>`;
    ['#materialSubject','#materialType'].forEach(id=>$(id)?.addEventListener('change',renderMaterials));
  }

  function renderPastDetails(){
    const root=$('#pastView');
    if(!root) return;
    const all=questions().filter(q=>q.year||safeArr(q.tags).some(t=>/^20\d{2}$/.test(String(t))));
    if(!all.length){
      root.innerHTML='<div class="panel empty-state">연도 정보가 있는 기출문제가 없습니다.</div>';
      return;
    }
    const prevYear=$('#detailPastYear')?.value||'';
    const prevPeriod=$('#detailPastPeriod')?.value||'';
    const prevSubject=$('#detailPastSubject')?.value||'';
    const years=uniq(all.map(q=>q.year||safeArr(q.tags).find(t=>/^20\d{2}$/.test(String(t))))).sort((a,b)=>Number(b)-Number(a));
    const periods=uniq(all.map(q=>q.period)).sort();
    const year=prevYear||years[0]||'';
    const period=prevPeriod||'';
    const subject=prevSubject||'';
    const filtered=all.filter(q=>(!year||String(q.year)===String(year)||safeArr(q.tags).includes(String(year)))&&(!period||q.period===period)&&(!subject||q.subject===subject));
    const rows=filtered.slice(0,60).map((q,idx)=>`<article class="question-card always-open"><div class="question-meta">${idx+1}. ${esc(q.year||'연도 미상')}년 · ${esc(q.period||'교시 미상')} · ${esc(q.subject)} ${q.number?`· ${esc(q.number)}번`:''}</div><h4>${esc(q.question)}</h4><div class="choices-view">${q.choices.map((c,n)=>`<div class="choice ${Number(q.answer)===n?'correct-choice':''}"><span>${answerLabel(n)}</span><span>${esc(c)}</span></div>`).join('')}</div><div class="explain" style="display:block"><strong>정답 ${answerLabel(q.answer)}</strong><br>${esc(q.explain||'별도 해설이 없습니다. 정답과 선택지를 중심으로 복습하세요.')}</div></article>`).join('');
    root.innerHTML=`<section class="panel"><div class="panel-heading"><div><p class="eyebrow">문제·보기·정답</p><h3>연도별 기출 상세 보기</h3></div></div><div class="toolbar"><label>연도<select id="detailPastYear"><option value="">전체</option>${years.map(y=>`<option value="${esc(y)}" ${String(y)===String(year)?'selected':''}>${esc(y)}년</option>`).join('')}</select></label><label>교시<select id="detailPastPeriod"><option value="">전체</option>${periods.map(p=>`<option value="${esc(p)}" ${p===period?'selected':''}>${esc(p)}</option>`).join('')}</select></label><label>과목<select id="detailPastSubject"><option value="">전체</option>${subjects().map(s=>`<option value="${esc(s)}" ${s===subject?'selected':''}>${esc(s)}</option>`).join('')}</select></label></div><p class="summary-count">선택 조건 ${filtered.length}문항 · 목록은 60문항까지 표시</p><div class="question-area">${rows||'<div class="empty-state">선택 조건에 해당하는 문제가 없습니다.</div>'}</div>${filtered.length>60?'<p class="muted">화면 속도를 위해 60문항까지만 표시합니다. 연도·교시·과목으로 좁혀 보세요.</p>':''}</section>`;
    ['#detailPastYear','#detailPastPeriod','#detailPastSubject'].forEach(id=>$(id)?.addEventListener('change',renderPastDetails));
  }

  function hook(){
    document.querySelector('[data-view="pdfs"]')?.addEventListener('click',()=>setTimeout(renderMaterials,80));
    document.querySelector('[data-view="past"]')?.addEventListener('click',()=>setTimeout(renderPastDetails,80));
    if($('#pdfsView')?.classList.contains('active')) renderMaterials();
    if($('#pastView')?.classList.contains('active')) renderPastDetails();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',hook);
  else hook();
})();
