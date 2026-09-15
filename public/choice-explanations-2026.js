(function(){
  const arr=v=>Array.isArray(v)?v:[];
  const lab=n=>['①','②','③','④','⑤'][Number(n)]||String(Number(n)+1);
  const yearOf=q=>String(q.year||arr(q.tags).find(t=>/^20\d{2}$/.test(String(t)))||'');
  const askType=q=>{const s=String(q.question||'');if(/옳지 않은|않은 것은|틀린 것은|부적절/.test(s))return'wrong';if(/모두 고른|모두 고르|묶은 것/.test(s))return'combo';return'right'};
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  function make(q,i){
    const type=askType(q), ok=Number(q.answer)===i, c=clean(q.choices[i]), ans=clean(q.choices[Number(q.answer)]);
    if(type==='wrong'){
      if(ok)return `${lab(i)}는 문항이 요구한 '옳지 않은 설명'입니다. 따라서 이 선지는 틀린 내용을 담고 있어 정답입니다. 핵심 표현은 「${c}」입니다.`;
      return `${lab(i)}는 정답이 아닙니다. 이 문항은 '옳지 않은 것'을 묻고 있으므로, 이 선지는 대체로 옳은 설명으로 처리됩니다. 정답 선지 ${lab(q.answer)} 「${ans}」와 비교해 틀린 표현을 확인하세요.`;
    }
    if(type==='combo'){
      if(ok)return `${lab(i)}는 제시된 항목 조합 중 정답 조합입니다. 포함된 항목들이 문항의 조건을 충족하므로 정답입니다.`;
      return `${lab(i)}는 조합이 맞지 않습니다. 맞는 항목이 빠졌거나, 문항 조건에 맞지 않는 항목이 포함된 선택지입니다. 정답 조합 ${lab(q.answer)}와 비교해 빠진 항목과 추가된 항목을 확인하세요.`;
    }
    if(ok)return `${lab(i)}는 정답입니다. 보기의 핵심 표현 「${c}」가 문항에서 묻는 조건에 가장 부합합니다.`;
    return `${lab(i)}는 오답입니다. 보기의 표현 「${c}」는 문항의 조건에 가장 부합하는 설명이 아닙니다. 정답 선지 ${lab(q.answer)} 「${ans}」와 핵심 용어·주체·대상·시기를 비교해 보세요.`;
  }
  function apply(){
    arr(window.SAMPLE_QUESTIONS).forEach(q=>{
      if(yearOf(q)!=='2026'||!arr(q.choices).length)return;
      if(Array.isArray(q.choiceExplanations)&&q.choiceExplanations.length===q.choices.length)return;
      q.choiceExplanations=q.choices.map((_,i)=>make(q,i));
      q.explanationStatus='선지별 해설 초안';
    });
  }
  apply();
  window.APPLY_2026_CHOICE_EXPLANATIONS=apply;
})();
