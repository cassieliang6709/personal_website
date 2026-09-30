import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import avatar from '../../assets/characters/cassie-favicon.png';
import {StudioArchiveFooter,WorkPage} from './WorkPage';
import {LifePage} from './LifePage';
import {NotesBook} from './NotesBook';
import {WritingBook} from './WritingBook';
import {ResumePage} from './ResumePage';
import {RoomEntry,RoomPage} from './RoomSection';
import {SupportSection} from './SupportSection';
import {PandaEntry,PandaPage} from './PandaSection';
import {lang,otherLangHref,t} from './i18n';
import './style.css';

if(lang==='en'){document.documentElement.lang='en';document.title='Yue (Cassie) Liang — AI student & indie builder';document.querySelector('meta[name="description"]')?.setAttribute('content','Yue (Cassie) Liang: AI student in San Jose building 1Day, Tabspace, and other small products.')}

type Page='home'|'resume'|'room'|'panda'|'notes'|'writing';
const readPage=():Page=>location.hash.startsWith('#resume')?'resume':location.hash==='#room'?'room':location.hash==='#panda'?'panda':location.hash.startsWith('#notes')?'notes':location.hash.startsWith('#writing')?'writing':'home';

function WechatCopy(){
 const [copied,setCopied]=useState(false);
 const copy=async()=>{try{await navigator.clipboard.writeText('liangyue3666');setCopied(true);window.setTimeout(()=>setCopied(false),1800)}catch{window.prompt(t('复制我的微信号','Copy my WeChat ID'),'liangyue3666')}};
 return <button type="button" className="footer-wechat" onClick={copy}>{copied?t('已复制微信号','WeChat ID copied'):t('微信 · liangyue3666','WeChat · liangyue3666')}</button>;
}

function App(){
 const [page,setPage]=useState<Page>(readPage);
 useEffect(()=>{const sync=()=>{setPage(readPage());const id=location.hash.slice(1);if(id&&!['home','resume','room','panda'].includes(id)&&!id.startsWith('notes')&&!id.startsWith('writing'))requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView())};addEventListener('popstate',sync);addEventListener('hashchange',sync);return()=>{removeEventListener('popstate',sync);removeEventListener('hashchange',sync)}},[]);
 // Leaving a full-screen reader for #stories etc.: the section only exists after home renders.
 useEffect(()=>{const id=location.hash.slice(1);if(page==='home'&&id&&id!=='home')document.getElementById(id)?.scrollIntoView()},[page]);
 const switchPage=(next:Page)=>{if(next===page)return;history.pushState(null,'',`${location.pathname}#${next}`);setPage(next);window.scrollTo({top:0,behavior:'auto'})};
 if(page==='notes')return <NotesBook/>;
 if(page==='writing')return <WritingBook/>;
 return <div className={`site-shell is-${page}`}>
  <a className="skip" href="#content">{t('跳到内容','Skip to content')}</a>
  <header className="site-header"><a className="site-identity" href="#home" onClick={e=>{e.preventDefault();switchPage('home')}}><img src={avatar} alt=""/><span>Yue (Cassie) Liang{lang==='zh'&&<small>梁悦</small>}</span></a><nav className="primary-tabs" aria-label={t('主要内容','Main')}><button className={page==='home'?'active':''} aria-current={page==='home'?'page':undefined} onClick={()=>switchPage('home')}>HOME{lang==='zh'&&<span>主页</span>}</button><button className={page==='resume'?'active':''} aria-current={page==='resume'?'page':undefined} onClick={()=>switchPage('resume')}>ABOUT{lang==='zh'&&<span>关于我</span>}</button></nav><nav className="header-tools" aria-label={t('站点工具','Site tools')}><a href={otherLangHref} lang={lang==='en'?'zh-CN':'en'}>{t('EN','中文')}</a><a href="#notes">NOTES</a><a href="mailto:liangyue3666@gmail.com">CONTACT</a></nav></header>
  <main id="content">{page==='home'?<><WorkPage showArchive={false}/><LifePage embedded/><SupportSection/><div className="home-exits"><div className="side-quests"><RoomEntry onOpen={()=>switchPage('room')}/><PandaEntry onOpen={()=>switchPage('panda')}/></div><StudioArchiveFooter/></div></>:page==='room'?<RoomPage onExit={()=>switchPage('home')}/>:page==='panda'?<PandaPage onExit={()=>switchPage('home')}/>:<ResumePage/>}</main>
  <footer className="site-footer"><span>© 2026 Yue (Cassie) Liang</span><nav><a href="#resume" onClick={e=>{e.preventDefault();switchPage('resume')}}>{t('简历','Resume')}</a><a href="mailto:liangyue3666@gmail.com">Email</a><WechatCopy/><a href="https://github.com/cassieliang6709" target="_blank" rel="noreferrer">GitHub</a></nav></footer>
  <nav className="mobile-tabs" aria-label={t('主要内容','Main')}><button className={page==='home'?'active':''} onClick={()=>switchPage('home')}>{t('主页','Home')}</button><button className={page==='resume'?'active':''} onClick={()=>switchPage('resume')}>{t('关于','About')}</button></nav>
 </div>;
}
createRoot(document.getElementById('root')!).render(<App/>);
