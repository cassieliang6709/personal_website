import {useEffect,useMemo,useRef,useState,type MouseEvent} from 'react';
import {Marked,type Tokens} from 'marked';
import {lang,t} from './i18n';
import './notes.css';

// Chapters are synced from the llm-study-notes repo: `npm run sync-notes`.
const files=import.meta.glob('./notes/*.md',{eager:true,query:'?raw',import:'default'}) as Record<string,string>;
const SOURCE='https://github.com/cassieliang6709/llm-study-notes';

type Heading={id:string;text:string;level:number};
type Chapter={slug:string;num:string;title:string;html:string;headings:Heading[]};

const plain=(text:string)=>text.replace(/`([^`]*)`/g,'$1').replace(/\*\*([^*]*)\*\*/g,'$1').replace(/\[([^\]]*)\]\([^)]*\)/g,'$1');
const escapeAttr=(text:string)=>text.replace(/&/g,'&amp;').replace(/"/g,'&quot;');

function buildChapter(slug:string,markdown:string):Chapter{
 const headings:Heading[]=[],used=new Map<string,number>();
 const marked=new Marked({gfm:true});
 marked.use({renderer:{
  heading({tokens,depth,text}:Tokens.Heading){
   if(depth===1)return ''; // rendered as the page title
   const label=plain(text);let id=label.toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-+|-+$/g,'');
   const seen=used.get(id)??0;used.set(id,seen+1);if(seen)id+=`-${seen}`;
   if(depth<=3)headings.push({id,text:label,level:depth});
   return `<h${depth} id="${escapeAttr(id)}">${this.parser.parseInline(tokens)}</h${depth}>`;
  },
  link({href,tokens}:Tokens.Link){
   const label=this.parser.parseInline(tokens),chapter=href.match(/^(?:\.\/)?(\d{2}-[\w-]+)\.md(?:#.*)?$/);
   if(chapter)return `<a href="#notes/${chapter[1]}">${label}</a>`;
   return `<a href="${escapeAttr(href)}"${/^https?:/.test(href)?' target="_blank" rel="noreferrer"':''}>${label}</a>`;
  }
 }});
 // Let wide tables scroll inside their own box instead of widening the page.
 return {slug,num:slug.slice(0,2),title:plain(markdown.match(/^# (.+)$/m)?.[1]??slug),
  html:(marked.parse(markdown) as string).replace(/<table>/g,'<div class="notes-table"><table>').replace(/<\/table>/g,'</table></div>'),headings};
}

export function NotesBook(){
 const chapters=useMemo(()=>Object.entries(files).sort(([a],[b])=>a.localeCompare(b)).map(([path,markdown])=>buildChapter(path.split('/').pop()!.replace(/\.md$/,''),markdown)),[]);
 const slugFromHash=()=>{const slug=decodeURIComponent(location.hash.replace(/^#notes\/?/,''));return chapters.some(c=>c.slug===slug)?slug:chapters[0].slug};
 const [slug,setSlug]=useState(slugFromHash),[navOpen,setNavOpen]=useState(false),[activeId,setActiveId]=useState('');
 const main=useRef<HTMLDivElement>(null);
 const index=chapters.findIndex(c=>c.slug===slug),chapter=chapters[index],prev=chapters[index-1],next=chapters[index+1];

 useEffect(()=>{const sync=()=>{setSlug(slugFromHash());setNavOpen(false)};addEventListener('hashchange',sync);return()=>removeEventListener('hashchange',sync)},[]);
 useEffect(()=>{const previous=document.title;return()=>{document.title=previous}},[]);
 useEffect(()=>{
  document.title=`${chapter.title} · ${t('技术笔记','Technical notes')}`;
  const root=main.current;if(!root)return;root.scrollTo(0,0);setActiveId(chapter.headings[0]?.id??'');
  // Highlight the last section heading that has scrolled past the top of the reading area.
  let frame=0;const onScroll=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
   const top=root.getBoundingClientRect().top+96;let current=chapter.headings[0]?.id??'';
   for(const h of chapter.headings){const el=document.getElementById(h.id);if(el&&el.getBoundingClientRect().top<=top)current=h.id}
   setActiveId(current);
  })};
  root.addEventListener('scroll',onScroll,{passive:true});return()=>{root.removeEventListener('scroll',onScroll);cancelAnimationFrame(frame)};
 },[chapter]);

 const jump=(event:MouseEvent,id:string)=>{event.preventDefault();document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})};

 return <div className={`notes-book${navOpen?' nav-open':''}`}>
  <header className="notes-top">
   <button type="button" className="notes-menu" aria-expanded={navOpen} aria-controls="notes-nav" onClick={()=>setNavOpen(!navOpen)}>{t('目录','Contents')}</button>
   <a className="notes-home" href="#home">← Yue (Cassie) Liang</a>
   <strong className="notes-brand">{t('LLM 技术笔记','LLM technical notes')}</strong>
   <a className="notes-source" href={SOURCE} target="_blank" rel="noreferrer">GitHub ↗</a>
  </header>
  <div className="notes-layout">
   <nav id="notes-nav" className="notes-nav" aria-label={t('章节','Chapters')}>
    <p className="notes-nav-label">{t('章节','Chapters')}</p>
    <ol>{chapters.map(c=><li key={c.slug}><a href={`#notes/${c.slug}`} aria-current={c.slug===slug?'page':undefined}><span>{c.num}</span>{c.title}</a></li>)}</ol>
    {lang==='en'&&<p className="notes-lang">These notes are written in Chinese.</p>}
    <a className="notes-nav-home" href="#home">{t('← 返回主页','← Back to home')}</a>
   </nav>
   <button type="button" className="notes-scrim" aria-label={t('关闭目录','Close contents')} tabIndex={navOpen?0:-1} onClick={()=>setNavOpen(false)}/>
   <div ref={main} className="notes-main">
    <div className="notes-page">
     <article className="notes-article">
      <p className="notes-kicker">{t(`第 ${chapter.num} 章`,`Chapter ${chapter.num}`)}</p>
      <h1>{chapter.title}</h1>
      <div className="notes-prose" dangerouslySetInnerHTML={{__html:chapter.html}}/>
      <nav className="notes-pager" aria-label={t('上一篇和下一篇','Previous and next')}>
       {prev?<a href={`#notes/${prev.slug}`}><small>{t('上一篇','Previous')}</small><span>{prev.num} · {prev.title}</span></a>:<span/>}
       {next&&<a className="is-next" href={`#notes/${next.slug}`}><small>{t('下一篇','Next')}</small><span>{next.num} · {next.title}</span></a>}
      </nav>
     </article>
     {chapter.headings.length>0&&<aside className="notes-toc" aria-label={t('本页目录','On this page')}>
      <p>{t('本页','On this page')}</p>
      <ul>{chapter.headings.map(h=><li key={h.id} className={`level-${h.level}`}><a href={`#${h.id}`} aria-current={activeId===h.id?'location':undefined} onClick={e=>jump(e,h.id)}>{h.text}</a></li>)}</ul>
     </aside>}
    </div>
   </div>
  </div>
 </div>;
}
