import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import avatar from '../../assets/characters/cassie-favicon.png';
import {StudioArchiveFooter,WorkPage} from './WorkPage';
import {LifePage} from './LifePage';
import {ResumePage} from './ResumePage';
import {RoomEntry,RoomPage} from './RoomSection';
import {SupportSection} from './SupportSection';
import './style.css';

type Page='home'|'resume'|'room';
const readPage=():Page=>location.hash.startsWith('#resume')?'resume':location.hash==='#room'?'room':'home';

function WechatCopy(){
 const [copied,setCopied]=useState(false);
 const copy=async()=>{try{await navigator.clipboard.writeText('liangyue3666');setCopied(true);window.setTimeout(()=>setCopied(false),1800)}catch{window.prompt('复制我的微信号','liangyue3666')}};
 return <button type="button" className="footer-wechat" onClick={copy}>{copied?'已复制微信号':'微信 · liangyue3666'}</button>;
}

function App(){
 const [page,setPage]=useState<Page>(readPage);
 useEffect(()=>{const sync=()=>{setPage(readPage());const id=location.hash.slice(1);if(id&&!['home','resume','room'].includes(id))requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView())};addEventListener('popstate',sync);addEventListener('hashchange',sync);return()=>{removeEventListener('popstate',sync);removeEventListener('hashchange',sync)}},[]);
 const switchPage=(next:Page)=>{if(next===page)return;history.pushState(null,'',`${location.pathname}#${next}`);setPage(next);window.scrollTo({top:0,behavior:'auto'})};
 return <div className={`site-shell is-${page}`}>
  <a className="skip" href="#content">跳到内容</a>
  <header className="site-header"><a className="site-identity" href="#home" onClick={e=>{e.preventDefault();switchPage('home')}}><img src={avatar} alt=""/><span>Yue (Cassie) Liang<small>梁悦</small></span></a><nav className="primary-tabs" aria-label="主要内容"><button className={page==='home'?'active':''} aria-current={page==='home'?'page':undefined} onClick={()=>switchPage('home')}>HOME <span>主页</span></button><button className={page==='resume'?'active':''} aria-current={page==='resume'?'page':undefined} onClick={()=>switchPage('resume')}>ABOUT <span>关于我</span></button></nav><nav className="header-tools" aria-label="站点工具"><a href="https://liangyue.site/en/">EN</a><a href="mailto:liangyue3666@gmail.com">CONTACT</a></nav></header>
  <main id="content">{page==='home'?<><WorkPage showArchive={false}/><LifePage embedded/><SupportSection/><div className="home-exits"><RoomEntry onOpen={()=>switchPage('room')}/><StudioArchiveFooter/></div></>:page==='room'?<RoomPage onExit={()=>switchPage('home')}/>:<ResumePage/>}</main>
  <footer className="site-footer"><span>© 2026 Yue (Cassie) Liang</span><nav><a href="#resume" onClick={e=>{e.preventDefault();switchPage('resume')}}>简历</a><a href="mailto:liangyue3666@gmail.com">Email</a><WechatCopy/><a href="https://github.com/cassieliang6709" target="_blank" rel="noreferrer">GitHub</a></nav></footer>
  <nav className="mobile-tabs" aria-label="主要内容"><button className={page==='home'?'active':''} onClick={()=>switchPage('home')}>主页</button><button className={page==='resume'?'active':''} onClick={()=>switchPage('resume')}>关于</button></nav>
 </div>;
}
createRoot(document.getElementById('root')!).render(<App/>);
