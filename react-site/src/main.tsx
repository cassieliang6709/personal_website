import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import avatar from '../../assets/characters/cassie-favicon.png';
import {projects,type Project} from './projects';
import {StudioArchiveFooter,WorkPage} from './WorkPage';
import {LifePage} from './LifePage';
import {ResumePage} from './ResumePage';
import {productLogoById} from './productAssets';
import './style.css';

type Page='home'|'resume';
const readPage=():Page=>location.hash.startsWith('#resume')?'resume':'home';

function ProductSheet({project,onClose}:{project:Project|null;onClose:()=>void}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(!project){ref.current?.close();return}const overflow=document.body.style.overflow;ref.current?.showModal();document.body.style.overflow='hidden';return()=>{document.body.style.overflow=overflow}},[project]);
 return <dialog ref={ref} className="detail-sheet" aria-labelledby="product-sheet-title" onClose={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>{project&&<>
  <header className="sheet-header"><span className="product-mark" style={{background:project.accent}}><img src={productLogoById[project.id]} alt=""/></span><div><small>{project.category}</small><h2 id="product-sheet-title">{project.name}</h2></div><button type="button" onClick={onClose} aria-label="关闭项目详情">×</button></header>
  <div className="sheet-body"><span className="project-status">{project.status}</span><p className="sheet-lede">{project.description}</p><section><h3>为什么做</h3><p>{project.story}</p></section><section><h3>我负责的部分</h3><p>{project.role}</p></section><section><h3>一个关键选择</h3><p>{project.decision}</p></section></div>
  <footer className="sheet-footer"><a href={project.url} target="_blank" rel="noreferrer">打开项目 ↗</a><a href={project.source} target="_blank" rel="noreferrer">查看源码 ↗</a></footer>
 </>}</dialog>;
}

function App(){
 const [page,setPage]=useState<Page>(readPage);
 const [project,setProject]=useState<Project|null>(()=>projects.find(p=>p.id===new URLSearchParams(location.search).get('project'))??null);
 useEffect(()=>{const sync=()=>{setPage(readPage());const id=new URLSearchParams(location.search).get('project');setProject(projects.find(p=>p.id===id)??null);window.scrollTo(0,0)};addEventListener('popstate',sync);addEventListener('hashchange',sync);return()=>{removeEventListener('popstate',sync);removeEventListener('hashchange',sync)}},[]);
 const switchPage=(next:Page)=>{if(next===page)return;history.pushState(null,'',`${location.pathname}#${next}`);setPage(next);setProject(null);window.scrollTo({top:0,behavior:'auto'})};
 const openProject=(next:Project)=>{history.pushState(null,'',`${location.pathname}?project=${next.id}#home`);setProject(next)};
 const closeProject=()=>{history.pushState(null,'',`${location.pathname}#home`);setProject(null)};
 return <div className={`site-shell is-${page}`}>
  <a className="skip" href="#content">跳到内容</a>
  <header className="site-header"><a className="site-identity" href="#home" onClick={e=>{e.preventDefault();switchPage('home')}}><img src={avatar} alt=""/><span>Cassie Liang<small>梁悦</small></span></a><nav className="primary-tabs" aria-label="主要内容"><button className={page==='home'?'active':''} aria-current={page==='home'?'page':undefined} onClick={()=>switchPage('home')}>HOME <span>主页</span></button><button className={page==='resume'?'active':''} aria-current={page==='resume'?'page':undefined} onClick={()=>switchPage('resume')}>ABOUT <span>关于我</span></button></nav><nav className="header-tools" aria-label="站点工具"><a href="https://liangyue.site/en/">EN</a><a href="mailto:liangyue3666@gmail.com">CONTACT</a></nav></header>
  <main id="content">{page==='home'?<><WorkPage onOpen={openProject} showArchive={false}/><LifePage embedded/><StudioArchiveFooter/></>:<ResumePage/>}</main>
  <footer className="site-footer"><span>© 2026 Cassie Liang</span><nav><a href="#resume" onClick={e=>{e.preventDefault();switchPage('resume')}}>简历</a><a href="https://github.com/cassieliang6709" target="_blank" rel="noreferrer">GitHub</a><a href="mailto:liangyue3666@gmail.com">Email</a></nav></footer>
  <nav className="mobile-tabs" aria-label="主要内容"><button className={page==='home'?'active':''} onClick={()=>switchPage('home')}>主页</button><button className={page==='resume'?'active':''} onClick={()=>switchPage('resume')}>关于</button></nav>
  <ProductSheet project={project} onClose={closeProject}/>
 </div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
