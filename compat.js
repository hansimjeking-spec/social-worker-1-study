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
  const uid=(...parts)=>parts.map(safeText).filter(Boolean).join('-').replace(/\s+/g,'-');
  const normalizeGuides=(raw)=>{
    if(Array.isArray(raw)) return raw.map((item,index)=>normalizeGuide(item,item.subject||'',index)).filter(g=>g.title);
    const guides=[];
    Object.entries(raw||{}).forEach(([subjectName,subjectData])=>{
      const subject=normalizeSubject(subjectName);
      if(!subjectData) return;
      if(Array.isArray(subjectData)){
        subjectData.forEach((item,index)=>guides.push(normalizeGuide(item,subject,index)));
        return;
      }
      if(typeof subjectData==='object'&&(subjectData.keyConcepts||subjectData.comparison||subjectData.deepDive||subjectData.studyOrder||subjectData.oneLine)){
        guides.push(...explodeSubjectGuide(subject,subjectData));
        return;
      }
      Object.entries(subjectData||{}).forEach(([unit,items])=>{
        if(Array.isArray(items)) items.forEach((item,index)=>guides.push(normalizeGuide(item,subject,index,unit)));
        else if(items&&typeof items==='object') guides.push(normalizeGuide(items,subject,guides.length,unit));
      });
    });
    return guides.filter(g=>g.title);
  };
  const explodeSubjectGuide=(subject,data={})=>{
    const cards=[];
    const studyOrder=Array.isArray(data.studyOrder)?data.studyOrder:[];
    const keyConcepts=Array.isArray(data.keyConcepts)?data.keyConcepts:[];
    const deepDive=Array.isArray(data.deepDive)?data.deepDive:[];
    const comparison=data.comparison||{};
    cards.push({
      id:uid(subject,'overview'),subject,unit:'과목 개요',title:`${subject} 학습 흐름`,tags:['핵심','개요'],
      oneLine:safeText(data.oneLine)||`${subject}의 전체 흐름을 정리합니다.`,
      corePoints:studyOrder.length?studyOrder.map(x=>`${x} 순서로 학습`):[safeText(data.oneLine)].filter(Boolean),
      compare:[],examPoint:studyOrder.length?`학습 순서: ${studyOrder.join(' → ')}`:safeText(data.oneLine),
      trap:'과목 전체 흐름을 모르고 단편 개념만 외우면 보기 판단이 흔들립니다.',
      memoryLine:studyOrder.length?`${subject}: ${studyOrder.join(' → ')}`:safeText(data.oneLine)
    });
    keyConcepts.forEach((k,index)=>{
      const term=safeText(k.term||k.title||k.name||`핵심 개념 ${index+1}`);
      const detail=safeText(k.detail||k.description||k.summary||'');
      cards.push({
        id:uid(subject,'concept',term),subject,unit:'핵심 개념',title:term,tags:['핵심','개념'],
        oneLine:detail||`${term} 개념을 정리합니다.`,
        corePoints:[detail||term],compare:[],examPoint:`${term}의 정의와 사례를 구분하는 문제가 자주 나옵니다.`,
        trap:`${term}과 비슷한 용어의 기준을 바꾼 선택지를 조심합니다.`,
        memoryLine:`${term}: ${detail||'정의와 대표 사례를 함께 기억'}`
      });
    });
    if(comparison&&Array.isArray(comparison.rows)&&comparison.rows.length){
      const columns=Array.isArray(comparison.columns)?comparison.columns:[];
      cards.push({
        id:uid(subject,'comparison',comparison.title||'비교표'),subject,unit:'비교표',title:safeText(comparison.title||`${subject} 비교표`),tags:['비교','빈출'],
        oneLine:`${subject}에서 헷갈리는 개념을 표로 비교합니다.`,
        corePoints:comparison.rows.map(row=>Array.isArray(row)?row.join(' / '):String(row)),
        compare:comparison.rows.map(row=>({title:Array.isArray(row)?safeText(row[0]):'비교',description:Array.isArray(row)?row.slice(1).join(' / '):String(row)})),
        examPoint:columns.length?`비교 기준: ${columns.join(' · ')}`:'비교 기준을 중심으로 보기의 단서를 확인합니다.',
        trap:'비슷한 용어끼리 대상, 초점, 대표 단서가 바뀌어 출제됩니다.',
        memoryLine:`${safeText(comparison.title||`${subject} 비교표`)}는 기준어를 먼저 본다.`
      });
    }
    deepDive.forEach((text,index)=>{
      const title=`심화 포인트 ${index+1}`;
      cards.push({
        id:uid(subject,'deep',index+1),subject,unit:'심화 포인트',title,tags:['심화','빈출'],
        oneLine:safeText(text),corePoints:[safeText(text)],compare:[],examPoint:safeText(text),
        trap:'긴 지문에서는 핵심 단어보다 관계와 순서를 먼저 확인합니다.',memoryLine:safeText(text)
      });
    });
    return cards;
  };
  const normalizeGuide=(item={},fallbackSubject='',index=0,fallbackUnit='핵심')=>{
    const subject=normalizeSubject(item.subject||fallbackSubject);
    const unit=safeText(item.unit||item.chapter||item.category||fallbackUnit||'핵심');
    const title=safeText(item.title||item.term||item.name||item.keyword||`핵심 개념 ${index+1}`);
    const corePoints=Array.isArray(item.corePoints)?item.corePoints:
      Array.isArray(item.points)?item.points:
      Array.isArray(item.content)?item.content:
      [item.detail||item.oneLine||item.summary||item.description||title].filter(Boolean);
    const compare=Array.isArray(item.compare)?item.compare:
      item.compare?Object.entries(item.compare).map(([k,v])=>({title:k,description:String(v)})):[];
    return {
      id:safeText(item.id)||uid(subject,unit,title),subject,unit,title,
      tags:Array.from(new Set([...(Array.isArray(item.tags)?item.tags:[]),...(item.tag?[item.tag]:[])])),
      oneLine:safeText(item.oneLine||item.detail||item.summary||corePoints[0]||title),
      corePoints:corePoints.map(safeText).filter(Boolean),
      compare:compare.map(c=>({title:safeText(c.title||c.name||'비교'),description:safeText(c.description||c.value||c.text||'')})).filter(c=>c.description),
      examPoint:safeText(item.examPoint||item.exam||item.examTip||item.point||item.detail||corePoints[0]||title),
      trap:safeText(item.trap||item.warning||item.mistake||'개념의 기준어를 바꾼 선택지를 조심한다.'),
      memoryLine:safeText(item.memoryLine||item.memory||item.memo||item.detail||item.oneLine||corePoints[0]||title)
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
      question:safeText(q.question||q.stem||q.title||''),choices:choices.map(safeText),answer:Number.isFinite(answer)?answer:0,
      explain:safeText(q.explain||q.explanation||q.commentary||`${q.year||''}년 ${q.period||''} ${q.number||''}번 문제입니다.`),
      year:q.year,period:q.period,number:q.number,sourceUrl:q.sourceUrl||q.url||''
    };
  };
  window.SUBJECTS=Array.from(new Set([...(Array.isArray(window.SUBJECTS)?window.SUBJECTS:[]),...DEFAULT_SUBJECTS].map(normalizeSubject).filter(Boolean)));
  window.SUMMARY_GUIDES=normalizeGuides(window.SUMMARY_GUIDES||[]);
  window.PDF_LIBRARY=Array.isArray(window.PDF_LIBRARY)?window.PDF_LIBRARY:[];
  const base=Array.isArray(window.SAMPLE_QUESTIONS)?window.SAMPLE_QUESTIONS:[];
  const past=window.PAST_PAPER_DATA&&Array.isArray(window.PAST_PAPER_DATA.questions)?window.PAST_PAPER_DATA.questions:[];
  const existing=new Set(base.map(q=>q.id));
  const converted=past.map(normalizeQuestion).filter(q=>q.question&&q.choices.length>=2&&!existing.has(q.id));
  window.SAMPLE_QUESTIONS=[...base.map(normalizeQuestion).filter(q=>q.question&&q.choices.length>=2),...converted];
  window.STUDY_DATA_META={subjects:window.SUBJECTS.length,guides:window.SUMMARY_GUIDES.length,questions:window.SAMPLE_QUESTIONS.length,pastQuestions:converted.length,paperSets:window.PAST_PAPER_DATA?.paperSets?.length||0,pdfs:window.PDF_LIBRARY.length};
})();
