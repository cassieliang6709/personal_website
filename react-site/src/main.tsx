import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import avatar from '../../assets/characters/cassie-favicon.png';
import {StudioArchiveFooter,WorkPage} from './WorkPage';
import {LifePage} from './LifePage';
import {ResumePage} from './ResumePage';
import './style.css';

type Page='home'|'resume';
const readPage=():Page=>location.hash.startsWith('#resume')?'resume':'home';

function App(){
 const [page,setPage]=useState<Page>(readPage);
 useEffect(()=>{const sync=()=>setPage(readPage());addEventListener('popstate',sync);addEventListener('hashchange',sync);return()=>{removeEventListener('popstate',sync);removeEventListener('hashchange',sync)}},[]);
 const switchPage=(next:Page)=>{if(next===page)return;history.pushState(null,'',`${location.pathname}#${next}`);setPage(next);window.scrollTo({top:0,behavior:'auto'})};
 return <div className={`site-shell is-${page}`}>
  <a className="skip" href="#content">跳到内容</a>
  <header className="site-header"><a className="site-identity" href="#home" onClick={e=>{e.preventDefault();switchPage('home')}}><img src={avatar} alt=""/><span>Yue (Cassie) Liang<small>梁悦</small></span></a><nav className="primary-tabs" aria-label="主要内容"><button className={page==='home'?'active':''} aria-current={page==='home'?'page':undefined} onClick={()=>switchPage('home')}>HOME <span>主页</span></button><button className={page==='resume'?'active':''} aria-current={page==='resume'?'page':undefined} onClick={()=>switchPage('resume')}>ABOUT <span>关于我</span></button></nav><nav className="header-tools" aria-label="站点工具"><a href="https://liangyue.site/en/">EN</a><a href="mailto:liangyue3666@gmail.com">CONTACT</a></nav></header>
  <main id="content">{page==='home'?<><WorkPage showArchive={false}/><LifePage embedded/><StudioArchiveFooter/></>:<ResumePage/>}</main>
  <footer className="site-footer"><span>© 2026 Yue (Cassie) Liang</span><nav><a href="#resume" onClick={e=>{e.preventDefault();switchPage('resume')}}>简历</a><a href="https://github.com/cassieliang6709" target="_blank" rel="noreferrer">GitHub</a><a href="mailto:liangyue3666@gmail.com">Email</a></nav></footer>
  <nav className="mobile-tabs" aria-label="主要内容"><button className={page==='home'?'active':''} onClick={()=>switchPage('home')}>主页</button><button className={page==='resume'?'active':''} onClick={()=>switchPage('resume')}>关于</button></nav>
 </div>;
}
createRoot(document.getElementById('root')!).render(<App/>);
