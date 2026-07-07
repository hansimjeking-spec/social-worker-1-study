(function(){
  function count(arr){return Array.isArray(arr)?arr.length:0}
  window.APP_HEALTH_CHECK=function(){
    const questions=Array.isArray(window.SAMPLE_QUESTIONS)?window.SAMPLE_QUESTIONS:[];
    const guides=Array.isArray(window.SUMMARY_GUIDES)?window.SUMMARY_GUIDES:[];
    const pdfs=Array.isArray(window.PDF_LIBRARY)?window.PDF_LIBRARY:[];
    const badChoices=questions.filter(q=>Array.isArray(q.choices)&&q.choices.some(c=>/www\.comcbt\.com|전자문제집\s*CBT/i.test(String(c))));
    const missingChoices=questions.filter(q=>!Array.isArray(q.choices)||q.choices.length<2);
    const missingSubject=questions.filter(q=>!q.subject);
    return {
      questions:count(questions),
      guides:count(guides),
      pdfs:count(pdfs),
      badChoiceFooter:badChoices.length,
      missingChoices:missingChoices.length,
      missingSubject:missingSubject.length,
      status:badChoices.length||missingChoices.length?'CHECK_NEEDED':'OK'
    };
  };
  document.addEventListener('DOMContentLoaded',()=>{
    setTimeout(()=>console.info('APP_HEALTH_CHECK',window.APP_HEALTH_CHECK()),1200);
  });
})();
