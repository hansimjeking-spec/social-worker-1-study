(function enhanceViews(){
  const style=document.createElement('style');
  style.textContent='.pdf-toolbar{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px}.pdf-item{width:100%;border:1px solid var(--line);border-radius:14px;background:#fff;padding:12px;text-align:left;display:grid;gap:4px;color:var(--ink)}.pdf-item:hover,.pdf-item.active{border-color:#93c5fd;background:#eff6ff}.pdf-item strong{font-size:15px}.pdf-item span{font-size:12px;color:var(--muted)}.choices-view{display:grid;gap:8px}.always-open .explain{display:block}.pdf-panel{min-height:75vh}.pdf-frame{background:#f8fafc}.material-warning{background:#fff7ed;border:1px solid #fed7aa;color:#9a3412;border-radius:14px;padding:12px;margin-top:10px;line-height:1.6}.answer-detail-list{display:grid;gap:14px}.answer-detail-card{border:1px solid var(--line);border-radius:18px;background:#fff;padding:18px}.answer-choice{display:grid;grid-template-columns:40px 1fr;gap:10px;border:1px solid var(--line);border-radius:12px;background:#f8fafc;padding:10px}.answer-choice.correct-choice{background:#ecfdf5;border-color:#86efac}.answer-choice strong{color:#17365f}.answer-note{margin-top:12px;background:#f8fafc;border:1px solid var(--line);border-radius:14px;padding:12px;line-height:1.7}@media(max-width:980px){.pdf-toolbar{align-items:flex-start;flex-direction:column}.pdf-panel{min-height:auto}.pdf-frame{min-height:60vh}.answer-detail-card{padding:14px}.answer-choice{grid-template-columns:34px 1fr}}';
  document.head.appendChild(style);
  const $=(s,root=document)=>root.querySelector(s);
  const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
  const cleanText=(value)=>String(value??'').replace(/\s*(?:격증\s*기출문제\s*)?전자문제집\s*CBT\s*:[\s\S]*$/i,'').replace(/\s*www\.comcbt\.com[\s\S]*$/i,'').replace(/[ \t]+/g,' ').replace(/(하|되|있|없|어진|하는|되는)\s+(다|는|지)/g,'$1$2').replace(/하는\s+다/g,'한다').replace(/상호작용하는다양한/g,'상호작용하는 다양한').replace(/도입되\s*었다/g,'도입되었다').replace(/통\s+한/g,'통한').replace(/고소\s*득층/g,'고소득층').replace(/사회\s+전\s+체/g,'사회 전체').replace(/대해서\s+는/g,'대해서는').replace(/받을\s*수/g,'받을 수').replace(/탈빈곤\s*효과/g,'탈빈곤 효과').replace(/해당하는지역사회/g,'해당하는 지역사회').replace(/운동을잘/g,'운동을 잘').replace(/못하는사람이/g,'못하는 사람이').replace(/공부에열중하는/g,'공부에 열중하는').replace(/결혼한친구/g,'결혼한 친구').replace(/친구\s+의얼굴/g,'친구의 얼굴').replace(/얼굴을의식하지못하는현상/g,'얼굴을 의식하지 못하는 현상').replace(/신체화\s*-\s*실적/g,'신체화 - 실적').replace(/반동형성\s*-\s*부모의/g,'반동형성 - 부모의').replace(/정해\s*진기일/g,'정해진 기일').replace(/해결하기위해임시편성된/g,'해결하기 위해 임시 편성된').replace(/결합\s+하며/g,'결합하며').replace(/두조직의/g,'두 조직의').replace(/위하여설\s*계된/g,'위하여 설계된').replace(/병역법\s+에/g,'병역법에').replace(/고용보험법\s+에/g,'고용보험법에').replace(/연대에기초한/g,'연대에 기초한').replace(/으로시장경제/g,'으로 시장경제').replace(/마을기\s*업/g,'마을기업').replace(/신청\s+한다/g,'신청한다').replace(/신청서\s+에/g,'신청서에').replace(/조사\s+하게/g,'조사하게').replace(/제\s+출/g,'제출').replace(/인정\s+서/g,'인정서').replace(/지역사회사정/g,'지역사회 사정').replace(/:기존/g,': 기존').replace(/하위체계\s+가\s+되는/g,'하위체계가 되는').replace(/되었\s+다/g,'되었다').replace(/Miff\s+ord/g,'Milford').replace(/h이lon/g,'holon').replace(/공통요\s+소/g,'공통요소').replace(/유지\s+하도록/g,'유지하도록').replace(/집단성원의\s*개별/g,'집단성원의 개별').replace(/목표를\s*설정/g,'목표를 설정').replace(/나타나는\s*다양한/g,'나타나는 다양한').replace(/토론하\s+도록/g,'토론하도록').replace(/나간\s+다/g,'나간다').replace(/구체적조작기/g,'구체적 조작기').replace(/\s+\($/,'').trim();
  const extraCleanText=(value)=>cleanText(value).replace(/공급자\s+와/g,'공급자와').replace(/보험\s+의/g,'보험의').replace(/않는\s+다/g,'않는다').replace(/제공했는\s+가/g,'제공했는가').replace(/다른사람에\s+게/g,'다른 사람에게').replace(/다른사람/g,'다른 사람').replace(/수급개시연령\s+은/g,'수급개시연령은').replace(/포함한\s+다/g,'포함한다').replace(/지식\s+과/g,'지식과').replace(/구성원\s+의/g,'구성원의').replace(/공공부조\s+와/g,'공공부조와').replace(/전달체계\s+에/g,'전달체계에').replace(/소득\s+이/g,'소득이').replace(/기관에\s+게/g,'기관에게').replace(/생활\s+이/g,'생활이').replace(/동시\s+에/g,'동시에').replace(/실행\s+의/g,'실행의').replace(/힘들\s+다/g,'힘들다').replace(/사회복지전담공무원\s+(을|의)/g,'사회복지전담공무원$1').replace(/사회적기업육성법\s+에/g,'사회적기업육성법에').replace(/사회복지사업법\s+에/g,'사회복지사업법에').replace(/욕구\s+가/g,'욕구가').replace(/대면서비스\s+를/g,'대면 서비스를').replace(/대면서비스/g,'대면 서비스').replace(/합리성을띠\s+고/g,'합리성을 띠고').replace(/시행하였\s+다/g,'시행하였다').replace(/작성하였\s+다/g,'작성하였다').replace(/민간재원\s+이/g,'민간재원이').replace(/사회복지정책\s+이/g,'사회복지정책이').replace(/핵심적인업무는반드시객관적으로자격\s+이/g,'핵심적인 업무는 반드시 객관적으로 자격이').replace(/정한\s+다/g,'정한다').replace(/있으\s+며/g,'있으며').replace(/하였\s+다/g,'하였다').replace(/근거\s+를/g,'근거를').replace(/속성\s+에/g,'속성에').replace(/결정된\s+다/g,'결정된다').replace(/집단성원간/g,'집단성원 간').trim();
  const extraCleanText2=(value)=>extraCleanText(value).replace(/정책결정모형이\s+다/g,'정책결정 모형이다').replace(/다\s+양한/g,'다양한').replace(/다양한서비스/g,'다양한 서비스').replace(/40%이하/g,'40% 이하').replace(/이하미\s+고/g,'이하이고').replace(/개정\s+이\s+후/g,'개정 이후').replace(/이법개정이전/g,'이 법 개정 이전').replace(/인정된사람/g,'인정된 사람').replace(/:서비스/g,': 서비스').replace(/사회보험원리/g,'사회보험 원리').replace(/정책결정과정\s+으로설명/g,'정책결정 과정으로 설명').replace(/쓰레기통모혈/g,'쓰레기통 모형').replace(/혼합모형은합리모형과최적모형을혼합하여/g,'혼합모형은 합리모형과 최적모형을 혼합하여').replace(/정책의\s+창\s+이/g,'정책의 창이').replace(/점진\s+적으로/g,'점진적으로').replace(/생활에너\s+지/g,'생활에너지').replace(/사회복\s+지/g,'사회복지').replace(/복지\s+서비\s+스/g,'복지서비스').replace(/프로\s*그\s*램/g,'프로그램').replace(/기능\s+을/g,'기능을').replace(/관계\s+는/g,'관계는').replace(/통합\s+성/g,'통합성').replace(/전문\s+성/g,'전문성').replace(/책임\s+성/g,'책임성').replace(/접근\s+성/g,'접근성').replace(/포괄\s+성/g,'포괄성').trim();
  const esc=(value)=>extraCleanText2(value).replace(/업무상질병/g,'업무상 질병').replace(/아동의최상의/g,'아동의 최상의').replace(/기회를줄인다/g,'기회를 줄인다').replace(/차미가/g,'차이가').replace(/유면성/g,'유연성').replace(/확정기며식/g,'확정기여식').replace(/반반씩부담/g,'반반씩 부담').replace(/정책평가는사회복지/g,'정책평가는 사회복지').replace(/얻기위함/g,'얻기 위함').replace(/에영\s*향을미친다/g,'에 영향을 미친다').replace(/영\s*향을미친다/g,'영향을 미친다').replace(/과업환\s*경으로구분할수/g,'과업환경으로 구분할 수').replace(/에대한사람들의태도는정책/g,'에 대한 사람들의 태도는 정책').replace(/배\s*제된다/g,'배제된다').replace(/규칙\s+에의해서/g,'규칙에 의해서').replace(/추구\s+한다/g,'추구한다').replace(/한번\s+씩/g,'한 번씩').replace(/가입\s+하여야/g,'가입하여야').replace(/산출:상담전문가10인/g,'산출: 상담 전문가 10인').replace(/질측정도구/g,'질 측정도구').replace(/자산조사를\s*거쳐대상을/g,'자산조사를 거쳐 대상을').replace(/정해진\s+기일/g,'정해진 기일').replace(/발달와/g,'발달과').replace(/지역복지(['’])을/g,'지역복지$1를').replace(/참며자/g,'참여자').replace(/비교\s+한다/g,'비교한다').replace(/정도를평가/g,'정도를 평가').replace(/조사시/g,'조사 시').replace(/표집를선정/g,'표집단위 선정').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]));
  function normalizeStatements(statements){
    const out=[];
    safeArr(statements).forEach(raw=>{
      const text=extraCleanText2(raw).replace(/발달와/g,'발달과').replace(/참며자/g,'참여자').replace(/비교\s+한다/g,'비교한다').replace(/정도를평가/g,'정도를 평가').replace(/조사시/g,'조사 시').replace(/표집를선정/g,'표집단위 선정');
      const match=text.match(/^(.*?표본추출방법 결정)\s*ㅁ\.\s*(.*)$/);
      if(match&&match[2]){out.push(match[1]);out.push('표집단위 선정')}else out.push(text);
    });
    return out;
  }
  const safeArr=(v)=>Array.isArray(v)?v:[];
  const uniq=(arr)=>Array.from(new Set(arr.filter(v=>v!==undefined&&v!==null&&String(v).trim()!=='')));
  const answerLabel=(n)=>['①','②','③','④','⑤'][Number(n)]||String(Number(n)+1);
  const statementMarkup=(q)=>Array.isArray(q.statements)&&q.statements.length?`<div class="question-statements"><strong>보기</strong><ol class="statement-list">${q.statements.map((s,n)=>`<li><span class="statement-label">${['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ'][n]||`${n+1}`}</span><span>${esc(s)}</span></li>`).join('')}</ol></div>`:'';
  const caseMarkup=(q)=>{const src=window.CASE_IMAGE_MAP?.[q.id];if(src){const text=String(q.question||'');const label=/다음 내용/.test(text)?'내용':/다음 사례/.test(text)?'사례':'자료';return `<div class="case-content"><strong>원문 ${label}</strong><img src="${esc(src)}" alt="${label} 원문" loading="lazy"></div>`}return statementMarkup(q)};
  const normalizeSubject=(s)=>s==='사회복지법제론'?'사회복지법제와 실천':String(s||'');
  const questions=()=>safeArr(window.SAMPLE_QUESTIONS).map(q=>({...q,subject:normalizeSubject(q.subject),statements:normalizeStatements(q.statements)})).filter(q=>q.question&&Array.isArray(q.choices));
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
    const rows=filtered.slice(0,60).map((q,idx)=>`<article class="question-card always-open"><div class="question-meta">${idx+1}. ${esc(yearOf(q)||'연도 미상')}년 · ${esc(q.period||'교시 미상')} · ${esc(q.subject)} ${q.number?`· ${esc(q.number)}번`:''}</div><h4>${esc(q.question)}</h4>${caseMarkup(q)}<div class="choices-view">${q.choices.map((c,n)=>`<div class="choice ${Number(q.answer)===n?'correct-choice':''}"><span>${answerLabel(n)}</span><span>${esc(c)}</span></div>`).join('')}</div><div class="explain" style="display:block"><strong>정답 ${answerLabel(q.answer)}</strong><br>${esc(explainOf(q))}</div></article>`).join('');
    root.innerHTML=`<section class="panel"><div class="panel-heading"><div><p class="eyebrow">문제·보기·정답</p><h3>연도별 기출 상세 보기</h3></div><button class="primary-button" id="startDetailPastBtn">선택 조건 문제 풀기</button></div><div class="toolbar"><label>연도<select id="detailPastYear"><option value="">전체</option>${years.map(y=>`<option value="${esc(y)}" ${String(y)===String(year)?'selected':''}>${esc(y)}년</option>`).join('')}</select></label><label>교시<select id="detailPastPeriod"><option value="">전체</option>${periods.map(p=>`<option value="${esc(p)}" ${p===period?'selected':''}>${esc(p)}</option>`).join('')}</select></label><label>과목<select id="detailPastSubject"><option value="">전체</option>${subjects().map(s=>`<option value="${esc(s)}" ${s===subject?'selected':''}>${esc(s)}</option>`).join('')}</select></label><label>문항 수<input id="detailPastCount" type="number" min="5" max="200" value="${Math.min(50,filtered.length||10)}"></label></div><p class="summary-count">선택 조건 ${filtered.length}문항 · 목록은 60문항까지 표시</p><div class="question-area">${rows||'<div class="empty-state">선택 조건에 해당하는 문제가 없습니다.</div>'}</div>${filtered.length>60?'<p class="muted">화면 속도를 위해 60문항까지만 표시합니다. 연도·교시·과목으로 좁혀 보세요.</p>':''}</section>`;
    $('#startDetailPastBtn')?.addEventListener('click',()=>window.startQuizFromPool?.(filtered,Number($('#detailPastCount')?.value||10),'quiz','연도별 기출'));
    ['#detailPastYear','#detailPastPeriod','#detailPastSubject'].forEach(id=>$(id)?.addEventListener('change',renderPastDetails));
  }

  function renderAnswerDetails(){
    const root=$('#answersView');if(!root)return;
    const all=questions().filter(q=>q.year||safeArr(q.tags).includes('실제기출')||q.explain);
    if(!all.length){root.innerHTML='<div class="panel empty-state">표시할 해설 데이터가 없습니다.</div>';return;}
    const prevSubject=$('#detailAnswerSubject')?.value||'';const prevYear=$('#detailAnswerYear')?.value||'';
    const years=uniq(all.map(yearOf)).sort((a,b)=>Number(b)-Number(a));
    const filtered=all.filter(q=>(!prevSubject||q.subject===prevSubject)&&(!prevYear||String(yearOf(q))===String(prevYear)));
    const rows=filtered.slice(0,80).map(q=>`<article class="answer-detail-card"><p class="question-meta">${esc(yearOf(q)||'연도 미상')}년 · ${esc(q.period||'교시 미상')} · ${esc(q.subject)} ${q.number?`· ${esc(q.number)}번`:''}</p><h4>${q.number?`${esc(q.number)}번. `:''}${esc(q.question)}</h4>${caseMarkup(q)}<div class="choices-view">${q.choices.map((c,n)=>`<div class="answer-choice ${Number(q.answer)===n?'correct-choice':''}"><strong>${answerLabel(n)}</strong><span>${esc(c)}</span></div>`).join('')}</div><div class="answer-note"><strong>정답 ${answerLabel(q.answer)}</strong><br>${esc(explainOf(q))}</div></article>`).join('');
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
