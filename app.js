const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));

const DEFAULT_SUBJECTS=[
  '인간행동과 사회환경','사회복지조사론','사회복지실천론','사회복지실천기술론',
  '지역사회복지론','사회복지정책론','사회복지행정론','사회복지법제와 실천'
];
const SUBJECTS=Array.from(new Set([...(Array.isArray(window.SUBJECTS)?window.SUBJECTS:[]),...DEFAULT_SUBJECTS].filter(Boolean)));
const GUIDES=Array.isArray(window.SUMMARY_GUIDES)?window.SUMMARY_GUIDES:[];
const BASE=Array.isArray(window.SAMPLE_QUESTIONS)?window.SAMPLE_QUESTIONS:[];
const PAST=window.PAST_PAPER_DATA||{paperSets:[],questions:[]};

const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const esc=(v)=>String(v??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const pct=(a,b)=>b?Math.round(a/b*100):0;
const shuffle=(a)=>[...a].sort(()=>Math.random()-.5);
const today=()=>new Date().toISOString().slice(0,10);
const uniq=(arr)=>Array.from(new Set(arr.filter(v=>v!==undefined&&v!==null&&String(v).trim()!=='')));
const answerLabel=(n)=>['①','②','③','④','⑤'][Number(n)]||String(Number(n)+1);
const safeArr=(v)=>Array.isArray(v)?v:[];
const normalizeSubject=(s)=>s==='사회복지법제론'?'사회복지법제와 실천':String(s||'');

let stats=read('sw1_stats',{date:today(),solved:0,correct:0,streak:0,subject:{}});
let wrong=read('sw1_wrong',[]);
let learned=read('sw1_learned',[]);
let custom=read('sw1_custom',[]);
let current=[];
let timer=null;
let left=1500;

function questions(){return BASE.concat(custom).map(q=>({...q,subject:normalizeSubject(q.subject)})).filter(q=>q.question&&Array.isArray(q.choices)&&q.choices.length>=2)}
function save(){write('sw1_stats',stats);write('sw1_wrong',wrong);write('sw1_learned',learned);write('sw1_custom',custom)}
function dayCheck(){if(stats.date!==today()){const y=new Date(Date.now()-86400000).toISOString().slice(0,10);stats.streak=stats.date===y?(stats.streak||0)+1:1;stats.date=today();stats.solved=0;stats.correct=0;save()}}
function setText(sel,text){const el=$(sel);if(el)el.textContent=text}
function setHtml(sel,html){const el=$(sel);if(el)el.innerHTML=html}

function view(v){
  $$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
  $$('.view').forEach(x=>x.classList.toggle('active',x.id===v+'View'));
  const title=$('#'+v+'View')?.dataset.title||'학습 홈';
  setText('#viewTitle',title);
  if(v==='dashboard') dashboard();
  if(v==='summary') summary();
  if(v==='wrong') wrongView();
  if(v==='library') library();
  if(v==='past') renderPast();
  if(v==='answers') renderAnswers();
}

function dashboard(){
  dayCheck();
  const all=questions();
  const r=pct(stats.correct,stats.solved);
  setText('#statSolved',stats.solved);
  setText('#statCorrect',r+'%');
  setText('#statWrong',(stats.streak||0)+'일');
  setText('#statSavedWrong',wrong.length);
  setText('#meterRate',r+'%');
  const meter=$('#meterFill'); if(meter) meter.style.width=r+'%';
  const goal=Number($('#dailyGoalInput')?.value||20);
  setText('#dailyPlanText',`${stats.solved}/${goal}문항 완료`);
  const goalFill=$('#goalFill'); if(goalFill) goalFill.style.width=Math.min(100,pct(stats.solved,goal))+'%';
  dday();
  const box=$('#dashboardSubjects');
  if(!box) return;
  box.innerHTML=SUBJECTS.map(s=>{
    const st=stats.subject?.[s]||{solved:0,correct:0};
    const n=all.filter(q=>q.subject===s).length;
    return `<button class="subject-button" data-s="${esc(s)}"><strong>${esc(s)}</strong><span>${n}문항 · 정확도 ${pct(st.correct,st.solved)}%</span></button>`;
  }).join('');
  box.querySelectorAll('button').forEach(b=>b.onclick=()=>startQuiz(b.dataset.s,10));
}

function dday(){
  const input=$('#examDateInput'),badge=$('#examDday');
  if(!input||!badge) return;
  const saved=read('sw1_exam','');
  if(saved&&!input.value) input.value=saved;
  if(!input.value){badge.textContent='시험일 미설정';return}
  const d=Math.ceil((new Date(input.value)-new Date(today()))/86400000);
  badge.textContent=d>=0?'D-'+d:'D+'+Math.abs(d);
}

function initSelects(){
  ['#summarySubject','#quizSubject'].forEach(id=>{
    const e=$(id);
    if(e) e.innerHTML='<option value="">전체</option>'+SUBJECTS.map(s=>`<option value="${esc(s)}">${esc(s)}</option>`).join('');
  });
  const tags=uniq(GUIDES.flatMap(g=>safeArr(g.tags)));
  const t=$('#summaryTag');
  if(t) t.innerHTML='<option value="">전체</option>'+tags.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');
}

function summary(){
  const sub=$('#summarySubject')?.value||'';
  const tag=$('#summaryTag')?.value||'';
  const kw=($('#summarySearch')?.value||'').toLowerCase().trim();
  const exam=$('#examModeToggle')?.checked;
  const cards=GUIDES.filter(g=>{
    const text=[g.subject,g.unit,g.title,g.oneLine,g.examPoint,g.trap,g.memoryLine,...safeArr(g.tags),...safeArr(g.corePoints)].join(' ').toLowerCase();
    return(!sub||g.subject===sub)&&(!tag||safeArr(g.tags).includes(tag))&&(!kw||text.includes(kw));
  });
  setText('#summaryCount',`${cards.length}개 개념 정리 · ${exam?'시험 직전 압축 모드':'상세 학습 모드'}`);
  setHtml('#summaryList',cards.length?cards.map(g=>card(g,exam)).join(''):'<div class="panel empty-state">검색 결과가 없습니다.</div>');
  $$('#summaryList [data-learn]').forEach(b=>b.onclick=()=>{learned=learned.includes(b.dataset.learn)?learned.filter(x=>x!==b.dataset.learn):learned.concat(b.dataset.learn);save();summary();dashboard()});
  $$('#summaryList [data-q]').forEach(b=>b.onclick=()=>startQuiz(b.dataset.q,5));
  flash(cards);
}

function card(g,exam){
  const ok=learned.includes(g.id);
  const tags=safeArr(g.tags).map(t=>`<span class="tag ${t==='법령'?'warn':t==='실천연결'?'good':''}">${esc(t)}</span>`).join('');
  const core=safeArr(g.corePoints).length?g.corePoints:[g.oneLine].filter(Boolean);
  const compare=safeArr(g.compare);
  const relatedCount=questions().filter(q=>q.subject===g.subject).length;
  const detail=exam?'':`<div class="summary-grid"><div class="summary-box"><strong>핵심 내용</strong><ul>${core.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div class="summary-box"><strong>비교 개념</strong><ul>${compare.length?compare.map(c=>`<li><b>${esc(c.title)}</b>: ${esc(c.description)}</li>`).join(''):'<li>관련 개념과 함께 비교해 보세요.</li>'}</ul></div><div class="summary-box"><strong>기출 포인트</strong><p>${esc(g.examPoint)}</p></div><div class="summary-box"><strong>오답 함정</strong><p>${esc(g.trap)}</p></div></div>`;
  return `<article class="summary-card ${ok?'learned':''}"><div class="summary-head"><div><p class="eyebrow">${esc(g.subject)} · ${esc(g.unit)}</p><h3 class="summary-title">${esc(g.title)}</h3></div><div class="tag-row">${tags}</div></div><p class="summary-one">${esc(g.oneLine)}</p><div class="summary-box"><strong>암기 문장</strong><p>${esc(g.memoryLine)}</p></div>${detail}<div class="summary-foot"><button class="small-button" data-learn="${esc(g.id)}">${ok?'암기 취소':'암기 완료'}</button><button class="small-button" data-q="${esc(g.subject)}">관련 문제 ${relatedCount}문항 중 풀기</button></div></article>`;
}

function flash(cards){
  const box=$('#flashList');
  if(!box) return;
  const done=cards.filter(c=>learned.includes(c.id)).length;
  box.innerHTML=`<div class="flash-item"><strong>${done}/${cards.length}</strong><span>현재 목록 암기 완료</span></div>`+cards.filter(c=>!learned.includes(c.id)).slice(0,8).map(c=>`<div class="flash-item"><strong>${esc(c.title)}</strong><span>${esc(c.memoryLine)}</span></div>`).join('');
}

function startQuiz(subject='',count=10,mode='quiz'){
  const pool=questions().filter(q=>!subject||q.subject===subject);
  startQuizFromPool(pool,count,mode,subject);
}

function startQuizFromPool(pool,count=10,mode='quiz',label=''){
  const all=questions();
  const source=pool.length?pool:(!label?all:[]);
  current=shuffle(source).slice(0,Math.max(1,Number(count)||10));
  if(!current.length){
    const target=mode==='cbt'?'#cbtArea':'#quizArea';
    setHtml(target,`<div class="empty-state">${esc(label||'선택한 조건')}에 해당하는 문제가 없습니다.</div>`);
    if(mode!=='cbt') view('quiz');
    return;
  }
  renderQ(mode==='cbt'?'#cbtArea':'#quizArea');
  if(mode!=='cbt') view('quiz');
}

function renderQ(target){
  const box=$(target);
  if(!box) return;
  box.classList.remove('empty-state');
  box.innerHTML=current.map((q,i)=>`<article class="question-card" data-id="${esc(q.id)}"><div class="question-meta">${i+1}. ${esc(q.subject)} · ${safeArr(q.tags).map(esc).join(' · ')}</div><h4>${esc(q.question)}</h4><div>${q.choices.map((c,n)=>`<label class="choice"><input type="radio" name="${esc(q.id)}" value="${n}"><span>${n+1}. ${esc(c)}</span></label>`).join('')}</div><div class="explain"><strong>정답 ${answerLabel(q.answer)}</strong><br>${esc(q.explain)}</div></article>`).join('');
  $$(target+' input[type="radio"]').forEach(input=>input.addEventListener('change',updateSheet));
  updateSheet();
}

function grade(mode='quiz'){
  const target=mode==='cbt'?'#cbtArea':'#quizArea';
  const cards=$$(target+' .question-card');
  if(!cards.length) return;
  let good=0;
  cards.forEach(c=>{
    const q=current.find(x=>String(x.id)===String(c.dataset.id));
    if(!q) return;
    const v=Number(c.querySelector('input:checked')?.value??-1);
    const ok=v===Number(q.answer);
    if(ok) good++;
    c.classList.add('graded');
    c.querySelectorAll('.choice').forEach((ch,i)=>{ch.classList.toggle('correct-choice',i===Number(q.answer));ch.classList.toggle('wrong-choice',i===v&&!ok)});
    if(ok) wrong=wrong.filter(w=>String(w.id)!==String(q.id));
    else{
      const e=wrong.find(w=>String(w.id)===String(q.id));
      e?e.count=(e.count||1)+1:wrong.push({...q,count:1,last:today()});
    }
    stats.subject[q.subject]=stats.subject[q.subject]||{solved:0,correct:0};
    stats.subject[q.subject].solved++;
    if(ok) stats.subject[q.subject].correct++;
  });
  stats.solved+=cards.length;
  stats.correct+=good;
  save();
  if(mode!=='cbt'){
    setText('#quizScore',`${good} / ${cards.length}`);
    setText('#quizPercent','정확도 '+pct(good,cards.length)+'%');
  }
  dashboard();
  if(mode==='cbt') stop();
}

function startCbt(){view('cbt');startQuiz('',25,'cbt');left=1500;stop();tick();timer=setInterval(()=>{left--;tick();if(left<=0){stop();grade('cbt')}},1000)}
function stop(){if(timer) clearInterval(timer);timer=null}
function tick(){const m=Math.floor(left/60),s=left%60;setText('#timer',String(m).padStart(2,'0')+':'+String(s).padStart(2,'0'))}

function updateSheet(){
  const s=$('#answerSheet');
  if(!s) return;
  s.innerHTML=current.map((q,i)=>{
    const answered=!!document.querySelector(`input[name="${CSS.escape(String(q.id))}"]:checked`);
    return `<button class="answer-chip ${answered?'answered':''}" data-jump="${i}">${i+1}</button>`;
  }).join('');
  $$('#answerSheet [data-jump]').forEach(btn=>btn.onclick=()=>$$('.question-card')[Number(btn.dataset.jump)]?.scrollIntoView({behavior:'smooth',block:'start'}));
}

function wrongView(){
  const list=$('#wrongList');
  if(!list) return;
  if(!wrong.length){list.innerHTML='<div class="empty-state">아직 오답이 없습니다.</div>';setHtml('#wrongRelated','');return}
  list.innerHTML=wrong.map(q=>`<div class="wrong-item"><strong>${esc(q.question)}</strong><p class="muted">${esc(q.subject)} · ${q.count||1}회 오답</p><p>${esc(q.explain)}</p></div>`).join('');
  const subs=uniq(wrong.map(q=>q.subject));
  const rel=GUIDES.filter(g=>subs.includes(g.subject)).slice(0,6);
  setHtml('#wrongRelated','<h3>관련 요약</h3><div class="summary-list">'+(rel.length?rel.map(g=>card(g,true)).join(''):'<div class="empty-state">관련 요약이 없습니다.</div>')+'</div>');
  $$('#wrongRelated [data-q]').forEach(b=>b.onclick=()=>startQuiz(b.dataset.q,5));
  $$('#wrongRelated [data-learn]').forEach(b=>b.onclick=()=>{learned=learned.includes(b.dataset.learn)?learned.filter(x=>x!==b.dataset.learn):learned.concat(b.dataset.learn);save();wrongView()});
}

function retryWrong(){if(!wrong.length){alert('복습할 오답이 없습니다.');return}startQuizFromPool(wrong,Math.min(10,wrong.length),'quiz','오답')}

function renderPast(){
  const root=$('#pastView');
  if(!root) return;
  const all=questions().filter(q=>q.year||safeArr(q.tags).some(t=>/^20\d{2}$/.test(String(t))));
  if(!all.length){root.innerHTML='<div class="panel empty-state">아직 연도 정보가 있는 기출문제가 없습니다. 문제 관리는 사용할 수 있습니다.</div>';return}
  const prevYear=$('#pastYear')?.value||'';
  const prevPeriod=$('#pastPeriod')?.value||'';
  const prevSubject=$('#pastSubject')?.value||'';
  const years=uniq(all.map(q=>q.year||safeArr(q.tags).find(t=>/^20\d{2}$/.test(String(t))))).sort((a,b)=>Number(b)-Number(a));
  const periods=uniq(all.map(q=>q.period)).sort();
  const year=prevYear||years[0]||'';
  const period=prevPeriod||'';
  const subject=prevSubject||'';
  const filtered=all.filter(q=>(!year||String(q.year)===String(year)||safeArr(q.tags).includes(String(year)))&&(!period||q.period===period)&&(!subject||q.subject===subject));
  const rows=filtered.slice(0,80).map(q=>`<div class="wrong-item"><strong>${q.number?`${q.number}번. `:''}${esc(q.question)}</strong><p class="muted">${esc(q.year)}년 · ${esc(q.period||'교시 미상')} · ${esc(q.subject)} · 정답 ${answerLabel(q.answer)}</p></div>`).join('');
  root.innerHTML=`<section class="panel"><div class="panel-heading"><div><p class="eyebrow">실제 기출</p><h3>연도별 기출</h3></div><button class="primary-button" id="startPastBtn">선택 조건 문제 풀기</button></div><div class="toolbar"><label>연도<select id="pastYear"><option value="">전체</option>${years.map(y=>`<option value="${esc(y)}" ${String(y)===String(year)?'selected':''}>${esc(y)}년</option>`).join('')}</select></label><label>교시<select id="pastPeriod"><option value="">전체</option>${periods.map(p=>`<option value="${esc(p)}" ${p===period?'selected':''}>${esc(p)}</option>`).join('')}</select></label><label>과목<select id="pastSubject"><option value="">전체</option>${SUBJECTS.map(s=>`<option value="${esc(s)}" ${s===subject?'selected':''}>${esc(s)}</option>`).join('')}</select></label><label>문항 수<input id="pastCount" type="number" min="5" max="200" value="${Math.min(50,filtered.length||10)}"></label></div><p class="summary-count">선택 조건 ${filtered.length}문항 · 전체 연도 기출 ${all.length}문항</p><div class="wrong-list">${rows||'<div class="empty-state">선택 조건에 해당하는 문제가 없습니다.</div>'}</div>${filtered.length>80?'<p class="muted">목록은 80문항까지만 미리 보여줍니다. 문제 풀기는 선택 조건 전체에서 출제됩니다.</p>':''}</section>`;
  ['#pastYear','#pastPeriod','#pastSubject'].forEach(id=>$(id)?.addEventListener('change',renderPast));
  $('#startPastBtn')?.addEventListener('click',()=>startQuizFromPool(filtered,Number($('#pastCount')?.value||50),'quiz','연도별 기출'));
}

function renderAnswers(){
  const root=$('#answersView');
  if(!root) return;
  const all=questions().filter(q=>q.explain||q.year||safeArr(q.tags).includes('실제기출'));
  if(!all.length){root.innerHTML='<div class="panel empty-state">표시할 해설 데이터가 없습니다.</div>';return}
  const prevSubject=$('#answerSubject')?.value||'';
  const prevYear=$('#answerYear')?.value||'';
  const years=uniq(all.map(q=>q.year||safeArr(q.tags).find(t=>/^20\d{2}$/.test(String(t))))).sort((a,b)=>Number(b)-Number(a));
  const filtered=all.filter(q=>(!prevSubject||q.subject===prevSubject)&&(!prevYear||String(q.year)===String(prevYear)||safeArr(q.tags).includes(String(prevYear))));
  root.innerHTML=`<section class="panel"><div class="panel-heading"><div><p class="eyebrow">정답 확인</p><h3>해설집</h3></div></div><div class="toolbar"><label>과목<select id="answerSubject"><option value="">전체</option>${SUBJECTS.map(s=>`<option value="${esc(s)}" ${s===prevSubject?'selected':''}>${esc(s)}</option>`).join('')}</select></label><label>연도<select id="answerYear"><option value="">전체</option>${years.map(y=>`<option value="${esc(y)}" ${String(y)===String(prevYear)?'selected':''}>${esc(y)}년</option>`).join('')}</select></label></div><p class="summary-count">${filtered.length}개 정답·해설 표시</p><div class="wrong-list">${filtered.slice(0,100).map(q=>`<div class="wrong-item"><strong>${q.number?`${q.number}번. `:''}${esc(q.question)}</strong><p class="muted">${esc(q.year||'연도 미상')} · ${esc(q.period||'교시 미상')} · ${esc(q.subject)} · 정답 ${answerLabel(q.answer)}</p><p>${esc(q.explain||'별도 해설이 없습니다. 정답 선지를 중심으로 복습하세요.')}</p></div>`).join('')||'<div class="empty-state">선택 조건에 해당하는 해설이 없습니다.</div>'}</div>${filtered.length>100?'<p class="muted">해설 목록은 100개까지만 미리 보여줍니다. 과목이나 연도로 좁혀 보세요.</p>':''}</section>`;
  ['#answerSubject','#answerYear'].forEach(id=>$(id)?.addEventListener('change',renderAnswers));
}

function library(){
  const box=$('#libraryStats');
  if(!box) return;
  const all=questions();
  box.innerHTML='<div class="stats-grid">'+SUBJECTS.map(s=>`<div class="stat"><span>${esc(s)}</span><strong>${all.filter(q=>q.subject===s).length}</strong></div>`).join('')+'</div><p class="muted">기본 문제은행 '+BASE.length+'문항 · 직접 추가 '+custom.length+'문항 · 요약카드 '+GUIDES.length+'개</p>';
}

function importQ(){
  try{
    const arr=JSON.parse($('#importBox').value);
    if(!Array.isArray(arr)) throw Error('JSON 배열이 아닙니다.');
    const add=arr.filter(q=>q.question&&Array.isArray(q.choices)).map((q,i)=>({id:q.id||'custom-'+Date.now()+'-'+i,subject:normalizeSubject(q.subject||SUBJECTS[0]),tags:q.tags||['직접추가'],question:q.question,choices:q.choices,answer:Number(q.answer||0),explain:q.explain||'직접 추가한 문제입니다.'}));
    custom=custom.concat(add);save();alert(add.length+'문항을 추가했습니다.');library();dashboard();
  }catch(e){alert('가져오기 실패: '+e.message)}
}

function weakestSubject(){
  const all=questions();
  const scored=SUBJECTS.map(s=>{const st=stats.subject?.[s]||{solved:0,correct:0};return {s,rate:st.solved?pct(st.correct,st.solved):-1,count:all.filter(q=>q.subject===s).length,solved:st.solved||0}}).filter(x=>x.count>0);
  if(wrong.length){const counts={};wrong.forEach(q=>counts[q.subject]=(counts[q.subject]||0)+1);return Object.entries(counts).sort((a,b)=>b[1]-a[1])[0][0]}
  return (scored.sort((a,b)=>a.rate===b.rate?a.solved-b.solved:a.rate-b.rate)[0]?.s)||SUBJECTS[0];
}

function boot(){
  dayCheck();initSelects();
  $$('.nav-item').forEach(b=>b.onclick=()=>view(b.dataset.view));
  ['#summarySubject','#summaryTag','#summarySearch','#examModeToggle'].forEach(id=>$(id)?.addEventListener('input',summary));
  $('#examDateInput')?.addEventListener('change',e=>{write('sw1_exam',e.target.value);dashboard()});
  $('#dailyGoalInput')?.addEventListener('input',dashboard);
  $('#startQuickBtn')?.addEventListener('click',()=>startQuiz('',10));
  $('#startDailyBtn')?.addEventListener('click',()=>startQuiz('',Number($('#dailyGoalInput').value||20)));
  $('#startWeakBtn')?.addEventListener('click',()=>startQuiz(weakestSubject(),10));
  $('#buildQuizBtn')?.addEventListener('click',()=>startQuiz($('#quizSubject').value,Number($('#quizCount').value||10)));
  $('#finishQuizBtn')?.addEventListener('click',()=>grade('quiz'));
  $('#startCbtBtn')?.addEventListener('click',startCbt);
  $('#submitCbtBtn')?.addEventListener('click',()=>grade('cbt'));
  $('#reviewWrongBtn')?.addEventListener('click',()=>view('wrong'));
  $('#retryWrongBtn')?.addEventListener('click',retryWrong);
  $('#clearWrongBtn')?.addEventListener('click',()=>{wrong=[];save();wrongView();dashboard()});
  $('#sampleBtn')?.addEventListener('click',()=>$('#importBox').value=JSON.stringify(BASE.slice(0,2),null,2));
  $('#importBtn')?.addEventListener('click',importQ);
  $('#exportBtn')?.addEventListener('click',()=>$('#exportBox').textContent=JSON.stringify(questions(),null,2));
  $('#resetSessionBtn')?.addEventListener('click',()=>{stats.solved=0;stats.correct=0;save();dashboard()});
  dashboard();summary();library();
  console.info('사회복지사 1급 앱 로드 완료',window.STUDY_DATA_META||{subjects:SUBJECTS.length,guides:GUIDES.length,questions:BASE.length});
}

document.addEventListener('DOMContentLoaded',boot);
