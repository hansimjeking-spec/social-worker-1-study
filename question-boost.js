(function bridgeOriginalPastPaperData(){
  window.SAMPLE_QUESTIONS=window.SAMPLE_QUESTIONS||[];
  const data=window.PAST_PAPER_DATA;
  if(!data||!Array.isArray(data.questions)||window.__pastPaperDataBridged) return;
  window.__pastPaperDataBridged=true;
  const normalizeSubject=(subject)=>subject==='사회복지법제론'?'사회복지법제와 실천':subject;
  const existing=new Set(window.SAMPLE_QUESTIONS.map(q=>q.id));
  const converted=data.questions
    .filter(q=>q&&q.stem&&Array.isArray(q.choices)&&q.choices.length>=2)
    .map(q=>{
      const answer=Number(q.answer);
      return {
        id:q.id||`past_${q.year||'unknown'}_${q.period||''}_${q.number||Math.random()}`,
        subject:normalizeSubject(q.subject||''),
        tags:['실제기출',String(q.year||''),q.period||''].filter(Boolean),
        question:q.stem,
        choices:q.choices,
        answer:Number.isFinite(answer)?answer:0,
        explain:q.explain&&q.explain!=='교사용 PDF 정답지를 확인하세요.'
          ? q.explain
          : `${q.year||''}년 ${q.period||''} ${q.number||''}번 실제 기출문제입니다.`,
        year:q.year,
        period:q.period,
        number:q.number,
        sourceUrl:q.sourceUrl
      };
    })
    .filter(q=>!existing.has(q.id));
  window.SAMPLE_QUESTIONS.push(...converted);
  window.PAST_DATA_BRIDGE_META={added:converted.length,total:window.SAMPLE_QUESTIONS.length,paperSets:data.paperSets?.length||0};
})();

(function boostQuestionsFromSummaries(){
  if(window.__questionBoosted) return;
  window.__questionBoosted=true;
  const guides=Array.isArray(window.SUMMARY_GUIDES)?window.SUMMARY_GUIDES:[];
  window.SAMPLE_QUESTIONS=window.SAMPLE_QUESTIONS||[];
  const existing=new Set(window.SAMPLE_QUESTIONS.map(q=>q.id));
  const pickOtherSubjects=(subject)=>{
    const subjects=(window.SUBJECTS||[]).filter(s=>s!==subject);
    return subjects.length?subjects:['사회복지조사론','사회복지실천론','사회복지정책론'];
  };
  const clean=(text)=>String(text||'').replace(/<[^>]+>/g,'').trim();
  const short=(text,n=42)=>{
    const value=clean(text);
    return value.length>n?value.slice(0,n)+'…':value;
  };
  const tagOf=(guide,extra)=>Array.from(new Set([...(guide.tags||[]),extra,'기출형']));
  const makeWrongChoices=(guide)=>{
    const others=guides.filter(g=>g.subject!==guide.subject).slice(0,12);
    const titles=others.map(g=>g.title).filter(Boolean);
    const subjectWrong=pickOtherSubjects(guide.subject);
    return [
      `${short(subjectWrong[0]||'다른 과목')}의 세부 제도만을 설명한다.`,
      titles[0]?`${short(titles[0])}의 핵심 개념이다.`:'무작위 표집 절차만을 의미한다.',
      titles[1]?`${short(titles[1])}와 동일한 개념이다.`:'사회보험 급여 산식만을 뜻한다.',
      '개인의 문제를 환경과 분리하여 단일 원인으로만 설명한다.'
    ];
  };
  const generated=[];
  guides.forEach((guide)=>{
    const idBase='auto-'+guide.id;
    const wrong=makeWrongChoices(guide);
    const core=guide.corePoints||[];
    const title=clean(guide.title);
    const subject=clean(guide.subject);
    const unit=clean(guide.unit);
    const memory=clean(guide.memoryLine||guide.oneLine||title);
    const exam=clean(guide.examPoint||guide.oneLine||title);
    const trap=clean(guide.trap||'개념의 기준어를 바꾼 선택지를 조심한다.');
    generated.push({id:idBase+'-def',subject,tags:tagOf(guide,'정의'),question:`${title}에 대한 설명으로 가장 적절한 것은?`,choices:[clean(guide.oneLine||core[0]||memory),wrong[0],wrong[1],wrong[2],wrong[3]],answer:0,explain:`${title}: ${memory}`});
    generated.push({id:idBase+'-exam',subject,tags:tagOf(guide,'빈출'),question:`${subject} 영역에서 '${title}'을 판단할 때 가장 중요한 기출 포인트는?`,choices:[exam,`${title}은 항상 법률상 급여액 계산 문제로만 출제된다.`,`${title}은 지역사회복지론에서만 다루는 개념이다.`,'개념 이름보다 암기 순서를 무조건 우선한다.','모든 보기에서 개인 책임만 확인하면 된다.'],answer:0,explain:`기출 포인트: ${exam}`});
    generated.push({id:idBase+'-trap',subject,tags:tagOf(guide,'오답함정'),question:`다음 중 '${title}'과 관련해 오답으로 의심해야 할 설명은?`,choices:[trap,core[0]||memory,core[1]||exam,memory,`${unit} 단원에서 함께 비교할 수 있다.`],answer:0,explain:`오답 함정: ${trap}`});
    generated.push({id:idBase+'-memory',subject,tags:tagOf(guide,'암기'),question:`'${title}'을 빠르게 암기하기 위한 문장으로 가장 적절한 것은?`,choices:[memory,wrong[1],wrong[2],'정답 선택지는 항상 가장 긴 문장이다.','법제 과목의 세부 시행일만 외우면 충분하다.'],answer:0,explain:`암기 문장: ${memory}`});
  });
  const unique=generated.filter(q=>!existing.has(q.id));
  window.SAMPLE_QUESTIONS.push(...unique);
  window.QUESTION_BOOST_META={generated:unique.length,total:window.SAMPLE_QUESTIONS.length,sourceCards:guides.length};
})();
