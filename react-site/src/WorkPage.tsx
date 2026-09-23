import {useEffect,useRef,useState} from 'react';
import avatar from '../../assets/characters/cassie-favicon.png';
import {productLogoById} from './productAssets';
import studioHome from '../../assets/room-spec/home-stage-theatre.webp';
import studioAbout from '../../assets/room-spec/about.webp';
import studioTimeline from '../../assets/room-spec/timeline.webp';
import studioProjects from '../../assets/room-spec/projects-v2.webp';
import studioWriting from '../../assets/room-spec/writing-v2.webp';
import {projects,type Project} from './projects';
import './work.css';

function LanyardIdentity(){
 const start=useRef<{x:number;y:number}|null>(null);const [offset,setOffset]=useState({x:0,y:0});const [open,setOpen]=useState(false);const dialog=useRef<HTMLDialogElement>(null);
 const reset=()=>{start.current=null;setOffset({x:0,y:0})};
 useEffect(()=>{if(open)dialog.current?.showModal();else dialog.current?.close()},[open]);
 const ropeY=190+offset.y;
 return <div className="lanyard-wrap"><span className="lanyard-line" style={{height:Math.hypot(offset.x,ropeY),transform:`rotate(${Math.atan2(-offset.x,ropeY)}rad)`}}/><button className="identity-pass" style={{transform:`translate(${offset.x}px,${offset.y}px) rotate(${offset.x/15-3}deg)`}} aria-label="Cassie 的工作牌，点击查看简介，也可以拖动" onClick={()=>{if(!start.current)setOpen(true)}} onPointerDown={e=>{if(e.button!==0||matchMedia('(prefers-reduced-motion: reduce)').matches)return;start.current={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{if(start.current)setOffset({x:Math.max(-120,Math.min(120,e.clientX-start.current.x)),y:Math.max(-42,Math.min(96,e.clientY-start.current.y))})}} onPointerUp={e=>{if(start.current&&Math.hypot(offset.x,offset.y)<5)setOpen(true);e.currentTarget.releasePointerCapture(e.pointerId);reset()}} onPointerCancel={reset} onKeyDown={e=>{if(e.key==='Escape')reset()}}><small>WORK IN PROGRESS</small><img src={avatar} alt=""/><strong>Cassie Liang</strong><span>AI STUDENT · INDIE BUILDER</span><em>OPEN PROFILE ↗</em></button><dialog className="about-dialog" ref={dialog} onClose={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)setOpen(false)}}><header><span>ABOUT / 关于我</span><button onClick={()=>setOpen(false)} aria-label="关闭简介">×</button></header><img src={avatar} alt="Cassie Liang 的头像"/><h2>我想把真实的问题，做成真的能用起来的软件。</h2><p>现在学习 AI，也独立设计、开发和发布 1Day。工作之外，我会记录城市、产品和脑子里那些不太安静的想法。</p><a href="../../assets/resume/Cassie-SDE-CN.pdf" target="_blank">下载简历 ↗</a></dialog></div>;
}

function ProductDock({onOpen}:{onOpen:(project:Project)=>void}){
 const visible=projects.filter(project=>project.id==='1day'||project.id==='tabspace');const [active,setActive]=useState(visible[0]);
 return <div className="product-dock-shell"><div className="product-dock is-compact" role="list" aria-label="Cassie 的主要产品">{visible.map(project=><button role="listitem" key={project.id} className={active.id===project.id?'is-active':''} onPointerEnter={()=>setActive(project)} onFocus={()=>setActive(project)} onClick={()=>onOpen(project)} aria-label={`打开 ${project.name} 项目详情`}><span className="dock-logo"><img src={productLogoById[project.id]} alt=""/></span><span className="dock-tooltip" aria-hidden="true">{project.name}</span></button>)}</div><button className="dock-preview" type="button" onClick={()=>onOpen(active)}><span><small>{active.category} · {active.status}</small><strong>{active.name}</strong></span><p>{active.description}</p><i aria-hidden="true">查看项目 ↗</i></button></div>;
}

const studioRooms=[
 {label:'主房间',caption:'最初的个人主页：从房间里的物件开始认识我。',image:studioHome},
 {label:'床边',caption:'关于我、好奇心和一路留下来的个人笔记。',image:studioAbout},
 {label:'照片墙',caption:'哈密、上海、杭州与 San Jose 的时间线。',image:studioTimeline},
 {label:'工作台',caption:'产品、工作牌，以及当时做过的各种小东西。',image:studioProjects},
 {label:'阅读角',caption:'文章、漫画和生活记录放在这间书房里。',image:studioWriting},
];

function StudioArchive(){
 const [open,setOpen]=useState(false),[room,setRoom]=useState(0);const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(!open){dialog.current?.close();return}const overflow=document.body.style.overflow;dialog.current?.showModal();document.body.style.overflow='hidden';return()=>{document.body.style.overflow=overflow}},[open]);
 const close=()=>{dialog.current?.close();setOpen(false)};
 return <><button className="studio-entry" type="button" onClick={()=>setOpen(true)}><img src={studioHome} alt=""/><span><small>FROM THE ARCHIVE</small><strong>打开插画旧工作室</strong></span><i aria-hidden="true">↗</i></button><dialog ref={dialog} className="studio-dialog" aria-labelledby="studio-title" onClose={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)close()}}><header><div><small>ILLUSTRATED STUDIO · ARCHIVE</small><h2 id="studio-title">以前的奇迹暖暖风格主页</h2></div><button type="button" onClick={close} aria-label="关闭旧工作室">×</button></header><div className="studio-dialog-body"><figure><img src={studioRooms[room].image} alt={`${studioRooms[room].label}插画场景`}/><figcaption>{studioRooms[room].caption}</figcaption></figure><nav aria-label="切换旧工作室房间">{studioRooms.map((item,index)=><button type="button" key={item.label} aria-pressed={room===index} onClick={()=>setRoom(index)}>{item.label}</button>)}</nav></div></dialog></>;
}

export function StudioArchiveFooter(){return <aside className="studio-archive-footer" aria-label="旧版主页存档"><StudioArchive/></aside>}

export function WorkPage({onOpen,showArchive=true}:{onOpen:(project:Project)=>void;showArchive?:boolean}){
 return <div className="work-page">
  <section className="work-hero"><div className="hero-copy"><p className="eyebrow">CASSIE LIANG / 梁悦</p><h1>AI 学生，<br/><em>1Day</em> 的独立开发者。</h1><p>我在 San Jose 学习人工智能，也独立设计、开发和发布自己的产品。现在主要在做 AI 应用、iOS 和浏览器工具。</p><nav><a className="button-primary" href="#flagship">看作品 ↓</a><a href="#resume">关于我 ↗</a><a href="https://github.com/cassieliang6709" target="_blank" rel="noreferrer">GitHub ↗</a></nav></div><div className="hero-object" aria-label="Cassie 的工作身份牌"><LanyardIdentity/></div></section>
  <section id="flagship" className="product-library"><header><p className="eyebrow">PRODUCTS / 01—02</p><h2>先放这两个。</h2><span>点 Logo 切换，点开查看项目。</span></header><ProductDock onOpen={onOpen}/></section>
  {showArchive&&<StudioArchiveFooter/>}
 </div>;
}
