function coachRead(key, fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
function coachEscape(value){return String(value??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]))}
function goSummary({subject='',tag='',search='',exam=true}={}){
  document.querySelector('[data-view="summary"]')?.click();
  setTimeout(()=>{
    const sub=document.querySelector('#summarySubject');
    const tagEl=document.querySelector('#summaryTag');
    const searchEl=document.querySelector('#summarySearch');
    const examEl=document.querySelector('#examModeToggle');
    if(sub) sub.value=subject;
    if(tagEl) tagEl.value=tag;
    if(searchEl) searchEl.value=search;
    if(examEl) examEl.checked=exam;
    [sub,tagEl,searchEl,examEl].forEach(el=>el&&el.dispatchEvent(new Event('input',{bubbles:true})));
  },30);
}
function goQuiz(subject=''){
  document.querySelector('[data-view="quiz"]')?.click();
  setTimeout(()=>{
    const select=document.querySelector('#quizSubject');
    const count=document.querySelector('#quizCount');
    if(select) select.value=subject;
    if(count) count.value=10;
    document.querySelector('#buildQuizBtn')?.click();
  },30);
}
function weakestSubject(){
  const stats=coachRead('sw1_stats',{subject:{}});
  const subjects=window.SUBJECTS||[];
  const scored=subjects.map(subject=>{
    const s=stats.subject?.[subject]||{solved:0,correct:0};
    return {subject, solved:s.solved||0, rate:s.solved?Math.round((s.correct||0)/s.solved*100):-1};
  });
  const wrong=coachRead('sw1_wrong',[]);
  if(wrong.length){
    const count={}; wrong.forEach(q=>count[q.subject]=(count[q.subject]||0)+1);
    return Object.entries(count).sort((a,b)=>b[1]-a[1])[0][0];
  }
  return scored.sort((a,b)=>(a.rate===b.rate?a.solved-b.solved:a.rate-b.rate))[0]?.subject||subjects[0]||'';
}
function pickCards(){
  const guides=window.SUMMARY_GUIDES||[];
  const learned=coachRead('sw1_learned',[]);
  const weak=weakestSubject();
  const priority=guides.filter(g=>g.subject===weak&&!learned.includes(g.id));
  const rest=guides.filter(g=>!learned.includes(g.id)&&g.subject!==weak);
  return [...priority,...rest,guides[0],guides[1]].filter(Boolean).slice(0,3);
}
function renderCoach(){
  const dashboard=document.querySelector('#dashboardView .dashboard-grid');
  if(!dashboard||document.querySelector('#coachPanel')) return;
  const wrong=coachRead('sw1_wrong',[]);
  const learned=coachRead('sw1_learned',[]);
  const guides=window.SUMMARY_GUIDES||[];
  const weak=weakestSubject();
  const cards=pickCards();
  const panel=document.createElement('section');
  panel.className='panel coach-panel';
  panel.id='coachPanel';
  panel.innerHTML=`
    <div class="panel-heading">
      <div><p class="eyebrow">자동 추천</p><h3>오늘의 학습 처방</h3></div>
      <span class="coach-badge">${coachEscape(weak||'전체')}</span>
    </div>
    <div class="coach-brief">
      <div><strong>${guides.length?Math.round(learned.length/guides.length*100):0}%</strong><span>요약 암기율</span></div>
      <div><strong>${wrong.length}</strong><span>오답 보관</span></div>
      <div><strong>${cards.length}</strong><span>오늘 추천 개념</span></div>
    </div>
    <div class="coach-actions">
      <button class="small-button" data-coach="frequent">빈출만 압축 보기</button>
      <button class="small-button" data-coach="law">법제·법령만 보기</button>
      <button class="small-button" data-coach="weak">취약 과목 문제 풀기</button>
      <button class="small-button" data-coach="wrong">오답 관련 요약</button>
    </div>
    <div class="coach-routine">
      <strong>20분 루틴</strong>
      <ol>
        <li>추천 개념 3개를 시험 직전 모드로 확인</li>
        <li>취약 과목 10문제 풀이</li>
        <li>틀린 문제의 관련 요약만 다시 체크</li>
      </ol>
    </div>
    <div class="coach-card-list">
      ${cards.map(card=>`<button class="coach-card" data-subject="${coachEscape(card.subject)}" data-title="${coachEscape(card.title)}"><span>${coachEscape(card.subject)}</span><strong>${coachEscape(card.title)}</strong><em>${coachEscape(card.memoryLine)}</em></button>`).join('')}
    </div>`;
  dashboard.insertAdjacentElement('afterend',panel);
  panel.querySelector('[data-coach="frequent"]')?.addEventListener('click',()=>goSummary({tag:'빈출',exam:true}));
  panel.querySelector('[data-coach="law"]')?.addEventListener('click',()=>goSummary({tag:'법령',exam:true}));
  panel.querySelector('[data-coach="weak"]')?.addEventListener('click',()=>goQuiz(weak));
  panel.querySelector('[data-coach="wrong"]')?.addEventListener('click',()=>wrong.length?goSummary({subject:weak,exam:true}):goSummary({tag:'오답함정',exam:true}));
  panel.querySelectorAll('.coach-card').forEach(btn=>btn.addEventListener('click',()=>goSummary({subject:btn.dataset.subject,search:btn.dataset.title,exam:true})));
}
function injectCoachStyle(){
  if(document.querySelector('#coachStyle')) return;
  const style=document.createElement('style');
  style.id='coachStyle';
  style.textContent=`.coach-panel{margin-top:18px}.coach-badge{border:1px solid var(--line);background:#f8fafc;color:#17365f;border-radius:999px;padding:7px 12px;font-weight:900;font-size:13px}.coach-brief{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}.coach-brief div{border:1px solid var(--line);border-radius:16px;background:#f8fafc;padding:14px}.coach-brief strong{display:block;font-size:24px}.coach-brief span{display:block;color:var(--muted);font-size:13px}.coach-actions{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 14px}.coach-routine{border:1px solid var(--line);background:linear-gradient(135deg,#f8fbff,#eef6ff);border-radius:16px;padding:14px;margin-bottom:14px}.coach-routine ol{margin:8px 0 0;padding-left:20px;line-height:1.7;color:#344156}.coach-card-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.coach-card{border:1px solid var(--line);background:#fff;border-radius:16px;padding:14px;text-align:left}.coach-card:hover{border-color:#93c5fd;background:#f8fbff}.coach-card span{display:block;color:var(--muted);font-size:12px;font-weight:800}.coach-card strong{display:block;margin:4px 0 6px}.coach-card em{display:block;color:#344156;font-style:normal;font-size:13px;line-height:1.55}@media(max-width:980px){.coach-brief,.coach-card-list{grid-template-columns:1fr}}`;
  document.head.appendChild(style);
}
function bootCoach(){injectCoachStyle();renderCoach()}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bootCoach); else bootCoach();
