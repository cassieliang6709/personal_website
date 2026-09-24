// Language is fixed per page load: /en/ serves the English build of the same app.
export type Lang='zh'|'en';

export const lang:Lang=typeof location!=='undefined'&&location.pathname.startsWith('/en')?'en':'zh';

export const t=(zh:string,en:string)=>lang==='en'?en:zh;

// Bilingual data files store copy as [zh, en] pairs.
export const pick=<T,>(pair:readonly T[])=>pair[lang==="en"?1:0];

export const otherLangHref=lang==='en'?'/':'/en/';
