import "./case-content-map.js";

window.CASE_IMAGE_MAP=window.CASE_IMAGE_MAP||{"past_2026_3교시_27":"/case-images/case-001.gif","past_2026_3교시_50":"/case-images/case-002.gif","past_2026_2교시_19":"/case-images/case-003.gif","past_2026_2교시_39":"/case-images/case-004.gif","past_2026_2교시_55":"/case-images/case-005.gif","past_2026_2교시_74":"/case-images/case-006.gif","past_2026_1교시_34":"/case-images/case-007.gif","past_2026_1교시_42":"/case-images/case-008.gif","past_2025_2교시_16":"/case-images/case-009.gif","past_2025_2교시_28":"/case-images/case-010.gif","past_2025_2교시_29":"/case-images/case-011.gif","past_2025_2교시_39":"/case-images/case-012.gif","past_2025_2교시_56":"/case-images/case-013.gif","past_2025_2교시_67":"/case-images/case-014.gif","past_2024_2교시_5":"/case-images/case-015.gif","past_2024_2교시_11":"/case-images/case-016.gif","past_2024_2교시_22":"/case-images/case-017.gif","past_2024_2교시_61":"/case-images/case-018.gif","past_2024_1교시_39":"/case-images/case-019.gif","past_2024_1교시_43":"/case-images/case-020.gif","past_2023_3교시_34":"/case-images/case-021.gif","past_2023_2교시_34":"/case-images/case-022.gif","past_2023_2교시_39":"/case-images/case-023.gif","past_2023_2교시_66":"/case-images/case-024.gif","past_2022_2교시_37":"/case-images/case-025.gif","past_2022_2교시_39":"/case-images/case-026.gif","past_2022_2교시_46":"/case-images/case-027.gif","past_2022_2교시_50":"/case-images/case-028.gif","past_2022_1교시_33":"/case-images/case-029.gif","past_2022_1교시_42":"/case-images/case-030.gif","past_2021_2교시_7":"/case-images/case-031.gif","past_2021_2교시_10":"/case-images/case-032.gif","past_2021_2교시_61":"/case-images/case-033.gif","past_2021_2교시_74":"/case-images/case-034.gif","past_2021_1교시_35":"/case-images/case-035.gif","past_2021_1교시_45":"/case-images/case-036.gif","past_2020_3교시_36":"/case-images/case-037.gif","past_2020_2교시_32":"/case-images/case-038.gif","past_2020_2교시_36":"/case-images/case-039.gif","past_2020_2교시_38":"/case-images/case-040.gif","past_2020_2교시_49":"/case-images/case-041.gif","past_2020_2교시_57":"/case-images/case-042.gif","past_2020_2교시_65":"/case-images/case-043.gif","past_2019_2교시_13":"/case-images/case-044.gif","past_2019_2교시_15":"/case-images/case-045.gif","past_2019_2교시_16":"/case-images/case-046.gif","past_2019_2교시_42":"/case-images/case-047.gif","past_2019_2교시_46":"/case-images/case-048.gif","past_2019_2교시_74":"/case-images/case-049.gif","past_2017_3교시_47":"/case-images/case-050.gif","past_2017_2교시_45":"/case-images/case-051.gif","past_2017_2교시_46":"/case-images/case-052.gif","past_2017_2교시_54":"/case-images/case-053.gif","past_2017_2교시_55":"/case-images/case-054.gif","past_2016_2교시_13":"/case-images/case-055.gif","past_2016_2교시_25":"/case-images/case-056.gif","past_2016_2교시_47":"/case-images/case-057.gif","past_2016_2교시_72":"/case-images/case-058.gif","past_2016_1교시_40":"/case-images/case-059.gif","past_2015_2교시_16":"/case-images/case-060.gif","past_2015_2교시_36":"/case-images/case-061.gif","past_2015_2교시_47":"/case-images/case-062.gif","past_2015_2교시_49":"/case-images/case-063.gif","past_2015_2교시_50":"/case-images/case-064.gif","past_2015_1교시_13":"/case-images/case-065.gif","past_2014_2교시_10":"/case-images/case-066.gif","past_2014_2교시_13":"/case-images/case-067.gif","past_2014_1교시_49":"/case-images/case-068.gif"};

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
const PDFS=Array.isArray(window.PDF_LIBRARY)?window.PDF_LIBRARY:[];

const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const esc=(v)=>cleanText(v).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const pct=(a,b)=>b?Math.round(a/b*100):0;
const shuffle=(a)=>[...a].sort(()=>Math.random()-.5);
const today=()=>new Date().toISOString().slice(0,10);
const uniq=(arr)=>Array.from(new Set(arr.filter(v=>v!==undefined&&v!==null&&String(v).trim()!=='')));
const answerLabel=(n)=>['①','②','③','④','⑤'][Number(n)]||String(Number(n)+1);
const safeArr=(v)=>Array.isArray(v)?v:[];
const normalizeSubject=(s)=>s==='사회복지법제론'?'사회복지법제와 실천':String(s||'');
const firstUrl=(obj={})=>obj.url||obj.path||obj.src||obj.href||obj.file||obj.pdf||obj.pdfUrl||obj.sourceUrl||obj.studentUrl||obj.teacherUrl||'';

let stats=read('sw1_stats',{date:today(),solved:0,correct:0,streak:0,subject:{}});
let wrong=read('sw1_wrong',[]);
let learned=read('sw1_learned',[]);
let custom=read('sw1_custom',[]);
let current=[];
let timer=null;
let left=1500;

function questions(){return BASE.concat(custom).map(q=>({...q,subject:normalizeSubject(q.subject),statements:normalizeStatements(q.statements)})).filter(q=>q.question&&Array.isArray(q.choices)&&q.choices.length>=2)}
function save(){write('sw1_stats',stats);write('sw1_wrong',wrong);write('sw1_learned',learned);write('sw1_custom',custom)}
function dayCheck(){if(stats.date!==today()){const y=new Date(Date.now()-86400000).toISOString().slice(0,10);stats.streak=stats.date===y?(stats.streak||0)+1:1;stats.date=today();stats.solved=0;stats.correct=0;save()}}
function setText(sel,text){const el=$(sel);if(el)el.textContent=text}
function setHtml(sel,html){const el=$(sel);if(el)el.innerHTML=html}
function cleanText(value){return String(value??'').replace(/\s*(?:격증\s*기출문제\s*)?전자문제집\s*CBT\s*:[\s\S]*$/i,'').replace(/\s*www\.comcbt\.com[\s\S]*$/i,'').replace(/[ \t]+/g,' ').replace(/(하|되|있|없|어진|하는|되는)\s+(다|는|지)/g,'$1$2').replace(/하는\s+다/g,'한다').replace(/상호작용하는다양한/g,'상호작용하는 다양한').replace(/도입되\s*었다/g,'도입되었다').replace(/통\s+한/g,'통한').replace(/고소\s*득층/g,'고소득층').replace(/사회\s+전\s+체/g,'사회 전체').replace(/대해서\s+는/g,'대해서는').replace(/받을\s*수/g,'받을 수').replace(/탈빈곤\s*효과/g,'탈빈곤 효과').replace(/해당하는지역사회/g,'해당하는 지역사회').replace(/운동을잘/g,'운동을 잘').replace(/못하는사람이/g,'못하는 사람이').replace(/공부에열중하는/g,'공부에 열중하는').replace(/결혼한친구/g,'결혼한 친구').replace(/친구\s+의얼굴/g,'친구의 얼굴').replace(/얼굴을의식하지못하는현상/g,'얼굴을 의식하지 못하는 현상').replace(/신체화\s*-\s*실적/g,'신체화 - 실적').replace(/반동형성\s*-\s*부모의/g,'반동형성 - 부모의').replace(/정해\s*진기일/g,'정해진 기일').replace(/해결하기위해임시편성된/g,'해결하기 위해 임시 편성된').replace(/결합\s+하며/g,'결합하며').replace(/두조직의/g,'두 조직의').replace(/위하여설\s*계된/g,'위하여 설계된').replace(/병역법\s+에/g,'병역법에').replace(/고용보험법\s+에/g,'고용보험법에').replace(/연대에기초한/g,'연대에 기초한').replace(/으로시장경제/g,'으로 시장경제').replace(/마을기\s*업/g,'마을기업').replace(/신청\s+한다/g,'신청한다').replace(/신청서\s+에/g,'신청서에').replace(/조사\s+하게/g,'조사하게').replace(/제\s+출/g,'제출').replace(/인정\s+서/g,'인정서').replace(/지역사회사정/g,'지역사회 사정').replace(/:기존/g,': 기존').replace(/하위체계\s+가\s+되는/g,'하위체계가 되는').replace(/되었\s+다/g,'되었다').replace(/Miff\s+ord/g,'Milford').replace(/h이lon/g,'holon').replace(/공통요\s+소/g,'공통요소').replace(/유지\s+하도록/g,'유지하도록').replace(/집단성원의\s*개별/g,'집단성원의 개별').replace(/목표를\s*설정/g,'목표를 설정').replace(/나타나는\s*다양한/g,'나타나는 다양한').replace(/토론하\s+도록/g,'토론하도록').replace(/나간\s+다/g,'나간다').replace(/구체적조작기/g,'구체적 조작기').replace(/\s+\($/,'').trim()}

const _baseCleanText=cleanText;
cleanText=(value)=>_baseCleanText(value).replace(/공급자\s+와/g,'공급자와').replace(/보험\s+의/g,'보험의').replace(/않는\s+다/g,'않는다').replace(/제공했는\s+가/g,'제공했는가').replace(/다른사람에\s+게/g,'다른 사람에게').replace(/다른사람/g,'다른 사람').replace(/수급개시연령\s+은/g,'수급개시연령은').replace(/포함한\s+다/g,'포함한다').replace(/지식\s+과/g,'지식과').replace(/구성원\s+의/g,'구성원의').replace(/공공부조\s+와/g,'공공부조와').replace(/전달체계\s+에/g,'전달체계에').replace(/소득\s+이/g,'소득이').replace(/기관에\s+게/g,'기관에게').replace(/생활\s+이/g,'생활이').replace(/동시\s+에/g,'동시에').replace(/실행\s+의/g,'실행의').replace(/힘들\s+다/g,'힘들다').replace(/사회복지전담공무원\s+(을|의)/g,'사회복지전담공무원$1').replace(/사회적기업육성법\s+에/g,'사회적기업육성법에').replace(/사회복지사업법\s+에/g,'사회복지사업법에').replace(/욕구\s+가/g,'욕구가').replace(/대면서비스\s+를/g,'대면 서비스를').replace(/대면서비스/g,'대면 서비스').replace(/합리성을띠\s+고/g,'합리성을 띠고').replace(/시행하였\s+다/g,'시행하였다').replace(/작성하였\s+다/g,'작성하였다').replace(/민간재원\s+이/g,'민간재원이').replace(/사회복지정책\s+이/g,'사회복지정책이').replace(/핵심적인업무는반드시객관적으로자격\s+이/g,'핵심적인 업무는 반드시 객관적으로 자격이').replace(/정한\s+다/g,'정한다').replace(/있으\s+며/g,'있으며').replace(/하였\s+다/g,'하였다').replace(/근거\s+를/g,'근거를').replace(/속성\s+에/g,'속성에').replace(/결정된\s+다/g,'결정된다').replace(/집단성원간/g,'집단성원 간').trim();

const _baseCleanText2=cleanText;
cleanText=(value)=>_baseCleanText2(value).replace(/정책결정모형이\s+다/g,'정책결정 모형이다').replace(/다\s+양한/g,'다양한').replace(/다양한서비스/g,'다양한 서비스').replace(/40%이하/g,'40% 이하').replace(/이하미\s+고/g,'이하이고').replace(/개정\s+이\s+후/g,'개정 이후').replace(/이법개정이전/g,'이 법 개정 이전').replace(/인정된사람/g,'인정된 사람').replace(/:서비스/g,': 서비스').replace(/사회보험원리/g,'사회보험 원리').replace(/정책결정과정\s+으로설명/g,'정책결정 과정으로 설명').replace(/쓰레기통모혈/g,'쓰레기통 모형').replace(/혼합모형은합리모형과최적모형을혼합하여/g,'혼합모형은 합리모형과 최적모형을 혼합하여').replace(/정책의\s+창\s+이/g,'정책의 창이').replace(/점진\s+적으로/g,'점진적으로').replace(/생활에너\s+지/g,'생활에너지').replace(/사회복\s+지/g,'사회복지').replace(/복지\s+서비\s+스/g,'복지서비스').replace(/프로\s*그\s*램/g,'프로그램').replace(/기능\s+을/g,'기능을').replace(/관계\s+는/g,'관계는').replace(/통합\s+성/g,'통합성').replace(/전문\s+성/g,'전문성').replace(/책임\s+성/g,'책임성').replace(/접근\s+성/g,'접근성').replace(/포괄\s+성/g,'포괄성').trim();

const _baseCleanText3=cleanText;
cleanText=(value)=>_baseCleanText3(value).replace(/발달와/g,'발달과').replace(/지역복지(['’])을/g,'지역복지$1를').replace(/참며자/g,'참여자').replace(/비교\s+한다/g,'비교한다').replace(/정도를평가/g,'정도를 평가').replace(/조사시/g,'조사 시').replace(/표집를선정/g,'표집단위 선정');

const _baseCleanText4=cleanText;
cleanText=(value)=>_baseCleanText4(value).replace(/업무상질병/g,'업무상 질병').replace(/아동의최상의/g,'아동의 최상의').replace(/기회를줄인다/g,'기회를 줄인다').replace(/차미가/g,'차이가').replace(/유면성/g,'유연성').replace(/확정기며식/g,'확정기여식').replace(/반반씩부담/g,'반반씩 부담').replace(/정책평가는사회복지/g,'정책평가는 사회복지').replace(/얻기위함/g,'얻기 위함').replace(/에영\s*향을미친다/g,'에 영향을 미친다').replace(/영\s*향을미친다/g,'영향을 미친다').replace(/과업환\s*경으로구분할수/g,'과업환경으로 구분할 수').replace(/에대한사람들의태도는정책/g,'에 대한 사람들의 태도는 정책').replace(/배\s*제된다/g,'배제된다').replace(/규칙\s+에의해서/g,'규칙에 의해서').replace(/추구\s+한다/g,'추구한다').replace(/한번\s+씩/g,'한 번씩').replace(/가입\s+하여야/g,'가입하여야').replace(/산출:상담전문가10인/g,'산출: 상담 전문가 10인').replace(/질측정도구/g,'질 측정도구').replace(/자산조사를\s*거쳐대상을/g,'자산조사를 거쳐 대상을').replace(/정해진\s+기일/g,'정해진 기일');

function normalizeStatements(statements){
  const out=[];
  safeArr(statements).forEach(raw=>{
    const text=cleanText(raw);
    const match=text.match(/^(.*?표본추출방법 결정)\s*ㅁ\.\s*(.*)$/);
    if(match&&match[2]){out.push(match[1]);out.push(`표집단위 선정`)}else out.push(text);
  });
  return out;
}

function view(v){
  $$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
  $$('.view').forEach(x=>x.classList.toggle('active',x.id===v+'View'));
  const title=$('#'+v+'View')?.dataset.title||'학습 홈';
  setText('#viewTitle',title);
  if(v==='dashboard') dashboard();
  if(v==='summary') summary();
  if(v==='pdfs') renderPdfs();
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

function buildPdfItems(){
  const registered=PDFS.map((p,i)=>({
    id:p.id||`pdf-${i}`,title:p.title||p.name||p.subject||`PDF 자료 ${i+1}`,subject:normalizeSubject(p.subject||p.area||''),type:p.type||p.kind||'교재 PDF',url:firstUrl(p),description:p.description||p.desc||p.memo||'',year:p.year,period:p.period
  })).filter(p=>p.url);
  const paperSets=Array.isArray(PAST.paperSets)?PAST.paperSets:[];
  const derived=[];
  paperSets.forEach((set,i)=>{
    const pairs=[
      ['학생용',set.studentUrl||set.studentPdf||set.studentPath],
      ['교사용',set.teacherUrl||set.teacherPdf||set.teacherPath],
      ['원문',set.url||set.pdfUrl||set.sourceUrl||set.path]
    ].filter(([,url])=>url);
    pairs.forEach(([kind,url],j)=>derived.push({
      id:`paper-${i}-${j}`,title:set.title||`${set.year||''}년 ${set.period||''} ${kind} 기출 PDF`,subject:normalizeSubject(set.subject||''),type:`기출 ${kind}`,url,description:`${set.year||''}년 ${set.period||''} 자료`,year:set.year,period:set.period
    }));
  });
  const seen=new Set();
  return [...registered,...derived].filter(item=>{if(!item.url||seen.has(item.url)) return false;seen.add(item.url);return true});
}

function renderPdfs(){
  const root=$('#pdfsView');
  if(!root) return;
  const items=buildPdfItems();
  const prevSubject=$('#pdfSubject')?.value||'';
  const prevType=$('#pdfType')?.value||'';
  const subjects=uniq(items.map(i=>i.subject)).sort();
  const types=uniq(items.map(i=>i.type)).sort();
  const filtered=items.filter(i=>(!prevSubject||i.subject===prevSubject)&&(!prevType||i.type===prevType));
  if(!items.length){
    root.innerHTML=`<section class="panel empty-state"><h3>등록된 PDF 원문이 없습니다</h3><p>현재 저장소에는 <code>PDF_LIBRARY</code> 등록값이나 <code>pdfs</code> 폴더의 PDF 파일이 연결되어 있지 않습니다.</p><p>PDF를 보이게 하려면 저장소에 PDF 파일을 올리고 <code>PDF_LIBRARY</code>에 제목, 과목, 경로를 등록해야 합니다.</p><pre class="export-box">window.PDF_LIBRARY = [\n  { subject: '인간행동과 사회환경', title: '인간행동과 사회환경 요약 PDF', url: './pdfs/human.pdf' }\n];</pre></section>`;
    return;
  }
  root.innerHTML=`<section class="panel"><div class="panel-heading"><div><p class="eyebrow">PDF 원문</p><h3>교재 자료실</h3></div></div><div class="toolbar"><label>과목<select id="pdfSubject"><option value="">전체</option>${subjects.map(s=>`<option value="${esc(s)}" ${s===prevSubject?'selected':''}>${esc(s)}</option>`).join('')}</select></label><label>유형<select id="pdfType"><option value="">전체</option>${types.map(t=>`<option value="${esc(t)}" ${t===prevType?'selected':''}>${esc(t)}</option>`).join('')}</select></label></div><p class="summary-count">등록 PDF ${items.length}개 · 선택 조건 ${filtered.length}개</p><div class="summary-list">${filtered.map(item=>`<article class="summary-card"><div class="summary-head"><div><p class="eyebrow">${esc(item.subject||'공통')} · ${esc(item.type)}</p><h3 class="summary-title">${esc(item.title)}</h3></div></div><p class="summary-one">${esc(item.description||'PDF 원문을 새 창에서 열 수 있습니다.')}</p><div class="summary-foot"><a class="small-button" href="${esc(item.url)}" target="_blank" rel="noopener">PDF 열기</a></div></article>`).join('')||'<div class="empty-state">선택 조건에 해당하는 PDF가 없습니다.</div>'}</div></section>`;
  ['#pdfSubject','#pdfType'].forEach(id=>$(id)?.addEventListener('change',renderPdfs));
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
  const caseMarkup=(q)=>{const src=window.CASE_IMAGE_MAP?.[q.id];if(!src)return '';const label=/다음 내용/.test(String(q.question||''))?'내용':'사례';return `<div class="case-content"><strong>원문 ${label}</strong><img src="${esc(src)}" alt="${label} 원문" loading="lazy"></div>`};
  box.innerHTML=current.map((q,i)=>`<article class="question-card" data-id="${esc(q.id)}"><div class="question-meta">${i+1}. ${esc(q.subject)} · ${safeArr(q.tags).map(esc).join(' · ')}</div><h4>${esc(cleanText(q.question))}</h4>${caseMarkup(q)}${!window.CASE_IMAGE_MAP?.[q.id]&&Array.isArray(q.statements)&&q.statements.length?`<div class="question-statements"><strong>보기</strong><ol class="statement-list">${q.statements.map((s,n)=>`<li><span class="statement-label">${['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ'][n]||`${n+1}`}</span>${esc(cleanText(s))}</li>`).join('')}</ol></div>`:''}<div>${q.choices.map((c,n)=>`<label class="choice"><input type="radio" name="${esc(q.id)}" value="${n}"><span>${n+1}. ${esc(cleanText(c))}</span></label>`).join('')}</div><div class="explain"><strong>정답 ${answerLabel(q.answer)}</strong><br>${esc(cleanText(q.explain))}</div></article>`).join('');
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
  box.innerHTML='<div class="stats-grid">'+SUBJECTS.map(s=>`<div class="stat"><span>${esc(s)}</span><strong>${all.filter(q=>q.subject===s).length}</strong></div>`).join('')+'</div><p class="muted">기본 문제은행 '+BASE.length+'문항 · 직접 추가 '+custom.length+'문항 · 요약카드 '+GUIDES.length+'개 · PDF '+buildPdfItems().length+'개</p>';
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
  console.info('사회복지사 1급 앱 로드 완료',window.STUDY_DATA_META||{subjects:SUBJECTS.length,guides:GUIDES.length,questions:BASE.length,pdfs:PDFS.length});
}

document.addEventListener('DOMContentLoaded',boot);
