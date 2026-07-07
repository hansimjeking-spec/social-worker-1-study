(function prepareStudyData(){
  const DEFAULT_SUBJECTS=[
    '인간행동과 사회환경','사회복지조사론','사회복지실천론','사회복지실천기술론',
    '지역사회복지론','사회복지정책론','사회복지행정론','사회복지법제와 실천'
  ];
  const normalizeSubject=(value='')=>{
    const text=String(value||'').trim();
    if(!text) return '';
    if(text==='사회복지법제론') return '사회복지법제와 실천';
    return text;
  };
  const safeText=(value='')=>String(value??'').trim();
  const toArray=(value)=>Array.isArray(value)?value:Object.values(value||{}).flatMap(v=>Array.isArray(v)?v:Object.values(v||{}));
  const normalizeGuides=(raw)=>{
    if(Array.isArray(raw)) return raw;
    const guides=[];
    Object.entries(raw||{}).forEach(([subject,units])=>{
      if(Array.isArray(units)){
        units.forEach((item,index)=>guides.push(normalizeGuide(item,subject,index)));
        return;
      }
      Object.entries(units||{}).forEach(([unit,items])=>{
        if(Array.isArray(items)) items.forEach((item,index)=>guides.push(normalizeGuide(item,subject,index,unit)));
        else if(items&&typeof items==='object') guides.push(normalizeGuide(items,subject,guides.length,unit));
      });
    });
    return guides.filter(g=>g.title);
  };
  const normalizeGuide=(item={},fallbackSubject='',index=0,fallbackUnit='핵심')=>{
    const subject=normalizeSubject(item.subject||fallbackSubject);
    const unit=safeText(item.unit||item.chapter||item.category||fallbackUnit||'핵심');
    const title=safeText(item.title||item.name||item.keyword||`핵심 개념 ${index+1}`);
    const corePoints=Array.isArray(item.corePoints)?item.corePoints:
      Array.isArray(item.points)?item.points:
      Array.isArray(item.content)?item.content:
      [item.oneLine||item.summary||item.description||title].filter(Boolean);
    const compare=Array.isArray(item.compare)?item.compare:
      item.compare?Object.entries(item.compare).map(([k,v])=>({title:k,description:String(v)})):[];
    return {
      id:safeText(item.id)||`${subject}-${unit}-${title}`.replace(/\s+/g,'-'),
      subject,unit,title,
      tags:Array.from(new Set([...(Array.isArray(item.tags)?item.tags:[]),...(item.tag?[item.tag]:[])])),
      oneLine:safeText(item.oneLine||item.summary||corePoints[0]||title),
      corePoints:corePoints.map(safeText).filter(Boolean),
      compare:compare.map(c=>({title:safeText(c.title||c.name||'비교'),description:safeText(c.description||c.value||c.text||'')})).filter(c=>c.description),
      examPoint:safeText(item.examPoint||item.exam||item.examTip||item.point||corePoints[0]||title),
      trap:safeText(item.trap||item.warning||item.mistake||'개념의 기준어를 바꾼 선택지를 조심한다.'),
      memoryLine:safeText(item.memoryLine||item.memory||item.memo||item.oneLine||corePoints[0]||title)
    };
  };
  const normalizeQuestion=(q={},index=0)=>{
    const choices=Array.isArray(q.choices)?q.choices:Array.isArray(q.options)?q.options:[];
    const answerRaw=q.answer??q.correct??q.correctIndex??0;
    const answer=Number(answerRaw);
    return {
      id:safeText(q.id)||`q-${q.year||'custom'}-${q.period||''}-${q.number||index}`,
      subject:normalizeSubject(q.subject||q.area||q.category||''),
      tags:Array.from(new Set([...(Array.isArray(q.tags)?q.tags:[]),...(q.year?[String(q.year)]:[]),...(q.period?[String(q.period)]:[]),...(q.source?'실제기출':[])])),
      question:safeText(q.question||q.stem||q.title||''),
      choices:choices.map(safeText),
      answer:Number.isFinite(answer)?answer:0,
      explain:safeText(q.explain||q.explanation||q.commentary||`${q.year||''}년 ${q.period||''} ${q.number||''}번 문제입니다.`),
      year:q.year,
      period:q.period,
      number:q.number,
      sourceUrl:q.sourceUrl||q.url||''
    };
  };
  window.SUBJECTS=Array.from(new Set([...(Array.isArray(window.SUBJECTS)?window.SUBJECTS:[]),...DEFAULT_SUBJECTS].map(normalizeSubject).filter(Boolean)));
  window.SUMMARY_GUIDES=normalizeGuides(window.SUMMARY_GUIDES||[]);
  const base=Array.isArray(window.SAMPLE_QUESTIONS)?window.SAMPLE_QUESTIONS:[];
  const past=window.PAST_PAPER_DATA&&Array.isArray(window.PAST_PAPER_DATA.questions)?window.PAST_PAPER_DATA.questions:[];
  const existing=new Set(base.map(q=>q.id));
  const converted=past.map(normalizeQuestion).filter(q=>q.question&&q.choices.length>=2&&!existing.has(q.id));
  window.SAMPLE_QUESTIONS=[...base.map(normalizeQuestion).filter(q=>q.question&&q.choices.length>=2),...converted];
  window.STUDY_DATA_META={subjects:window.SUBJECTS.length,guides:window.SUMMARY_GUIDES.length,questions:window.SAMPLE_QUESTIONS.length,pastQuestions:converted.length,paperSets:window.PAST_PAPER_DATA?.paperSets?.length||0};
})();
