import {useEffect,useRef,useState,type MouseEvent} from 'react';
import {articles,categories,inline} from './articles';
import {pick,t} from './i18n';
import './notes.css';
import './writing.css';

// The #notes book layout, used for the bilingual articles in articles.js. Route: #writing/<id>.
// The comic has no text body, so it stays in the reading corner's dialog.
const shelf=categories.map(c=>({...c,items:articles.filter(a=>a.cat===c.id&&!a.comicEpisodes)})).filter(c=>c.items.length);
const order=shelf.flatMap(c=>c.items);
const idFromHash=()=>{const id=decodeURIComponent(location.hash.replace(/^#writing\/?/,''));return order.some(a=>a.id===id)?id:order[0].id};

export function WritingBook(){
 const [id,setId]=useState(idFromHash),[navOpen,setNavOpen]=useState(false),[activeId,setActiveId]=useState('');
 const main=useRef<HTMLDivElement>(null);
 const index=order.findIndex(a=>a.id===id),article=order[index],prev=order[index-1],next=order[index+1];
 const body=pick(article.body),headings=body.flatMap((p,i)=>p.startsWith('## ')?[{id:`s-${i}`,text:p.slice(3)}]:[]);

 useEffect(()=>{const sync=()=>{setId(idFromHash());setNavOpen(false)};addEventListener('hashchange',sync);return()=>removeEventListener('hashchange',sync)},[]);
 useEffect(()=>{const previous=document.title;return()=>{document.title=previous}},[]);
 useEffect(()=>{
  document.title=`${pick(article.title)} · Yue (Cassie) Liang`;
  const root=main.current;if(!root)return;root.scrollTo(0,0);setActiveId(headings[0]?.id??'');
  // Highlight the last section heading that has scrolled past the top of the reading area.
  let frame=0;const onScroll=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
   const top=root.getBoundingClientRect().top+96;let current=headings[0]?.id??'';
   for(const h of headings){const el=document.getElementById(h.id);if(el&&el.getBoundingClientRect().top<=top)current=h.id}
   setActiveId(current);
  })};
  root.addEventListener('scroll',onScroll,{passive:true});return()=>{root.removeEventListener('scroll',onScroll);cancelAnimationFrame(frame)};
 },[article]);

 const jump=(event:MouseEvent,target:string)=>{event.preventDefault();document.getElementById(target)?.scrollIntoView({behavior:'smooth',block:'start'})};

 return <div className={`notes-book${navOpen?' nav-open':''}`}>
  <header className="notes-top">
   <button type="button" className="notes-menu" aria-expanded={navOpen} aria-controls="writing-nav" onClick={()=>setNavOpen(!navOpen)}>{t('目录','Contents')}</button>
   <a className="notes-home" href="#stories">← Yue (Cassie) Liang</a>
   <strong className="notes-brand">{t('文章','Writing')}</strong>
  </header>
  <div className="notes-layout">
   <nav id="writing-nav" className="notes-nav" aria-label={t('文章','Articles')}>
    {shelf.map(c=><section key={c.id}>
     <p className="notes-nav-label">{c.label}</p>
     <ol>{c.items.map(a=><li key={a.id}><a href={`#writing/${a.id}`} aria-current={a.id===id?'page':undefined}><span>{String(order.indexOf(a)+1).padStart(2,'0')}</span>{pick(a.title)}</a></li>)}</ol>
    </section>)}
    <a className="notes-nav-home" href="#stories">{t('← 返回主页','← Back to home')}</a>
   </nav>
   <button type="button" className="notes-scrim" aria-label={t('关闭目录','Close contents')} tabIndex={navOpen?0:-1} onClick={()=>setNavOpen(false)}/>
   <div ref={main} className="notes-main">
    <div className="notes-page">
     <article className="notes-article">
      <p className="notes-kicker">{pick(article.meta)}</p>
      <h1>{pick(article.title)}</h1>
      <div className="notes-prose">
       <p className="notes-deck">{pick(article.deck)}</p>
       {body.map((p,i)=>p.startsWith('## ')?<h2 key={i} id={`s-${i}`}>{inline(p.slice(3))}</h2>:p.startsWith('> ')?<blockquote key={i}><p>{inline(p.slice(2))}</p></blockquote>:<p key={i}>{inline(p)}</p>)}
      </div>
      <nav className="notes-pager" aria-label={t('上一篇和下一篇','Previous and next')}>
       {prev?<a href={`#writing/${prev.id}`}><small>{t('上一篇','Previous')}</small><span>{pick(prev.title)}</span></a>:<span/>}
       {next&&<a className="is-next" href={`#writing/${next.id}`}><small>{t('下一篇','Next')}</small><span>{pick(next.title)}</span></a>}
      </nav>
     </article>
     {headings.length>0&&<aside className="notes-toc" aria-label={t('本页目录','On this page')}>
      <p>{t('本页','On this page')}</p>
      <ul>{headings.map(h=><li key={h.id} className="level-2"><a href={`#${h.id}`} aria-current={activeId===h.id?'location':undefined} onClick={e=>jump(e,h.id)}>{h.text}</a></li>)}</ul>
     </aside>}
    </div>
   </div>
  </div>
 </div>;
}
