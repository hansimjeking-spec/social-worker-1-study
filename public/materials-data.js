window.PDF_LIBRARY = window.PDF_LIBRARY || [];

const MATERIAL_FILES = [
  ['인간행동과 사회환경', '인간행동과 사회환경-윤종필.pdf'],
  ['사회복지조사론', '사회복지조사론-윤종필.pdf'],
  ['사회복지실천론', '사회복지실천론-윤종필.pdf'],
  ['사회복지실천기술론', '사회복지실천기술론-윤종필.pdf'],
  ['지역사회복지론', '지역사회복지론-윤종필.pdf'],
  ['사회복지정책론', '사회복지정책론-윤종필.pdf'],
  ['사회복지행정론', '사회복지행정론-윤종필.pdf'],
  ['사회복지법제와 실천', '사회복지법제와 실천-윤종필.pdf']
];

window.PDF_LIBRARY.push(...MATERIAL_FILES.map(([subject, file]) => ({
  title: subject,
  subject,
  type: 'PDF',
  url: './pdfs/' + encodeURIComponent(file)
})));
