import {lazy,Suspense,useEffect,useRef,useState} from 'react';
import avatar from '../../assets/characters/cassie-favicon.png';
import passFront from './assets/lanyard/card-front.svg';
import passBack from './assets/lanyard/card-back.svg';
import passBand from './assets/lanyard/lanyard-band.svg';
import {productLogoById} from './productAssets';
import studioHome from '../../assets/room-spec/home-stage-theatre.webp';
import studioAbout from '../../assets/room-spec/about.webp';
import studioTimeline from '../../assets/room-spec/timeline.webp';
import studioProjects from '../../assets/room-spec/projects-v2.webp';
import studioWriting from '../../assets/room-spec/writing-v2.webp';
import {projects} from './projects';
import './work.css';

const Lanyard=lazy(()=>import('./Lanyard.jsx'));

function LanyardIdentity(){
 const [interactive,setInteractive]=useState(()=>typeof window!=='undefined'&&!matchMedia('(max-width: 759px), (prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{const media=matchMedia('(max-width: 759px), (prefers-reduced-motion: reduce)');const update=()=>setInteractive(!media.matches);media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 if(!interactive)return <div className="lanyard-wrap is-static" aria-label="Cassie 的工作身份牌"><span className="lanyard-line"/><div className="identity-pass"><small>WORK IN PROGRESS</small><img src={avatar} alt=""/><strong>Cassie Liang</strong><span>AI STUDENT · INDIE BUILDER</span><em>BUILDER PASS · 01</em></div></div>;
 return <div className="lanyard-three" aria-label="Cassie 的 3D 工作身份牌，可以拖动"><Suspense fallback={<div className="lanyard-loading">正在挂上工作牌…</div>}><Lanyard position={[0,0,24]} gravity={[0,-40,0]} fov={22} frontImage={passFront} backImage={passBack} imageFit="cover" lanyardImage={passBand} lanyardWidth={.82}/></Suspense></div>;
}

function ProductDock(){
 const visible=projects.filter(project=>project.id==='1day'||project.id==='tabspace');const [active,setActive]=useState(visible[0]);
 return <div className="product-inline"><div className="product-switcher" role="tablist" aria-label="Cassie 的主要产品">{visible.map((project,index)=><button role="tab" type="button" key={project.id} className={active.id===project.id?'is-active':''} aria-selected={active.id===project.id} onClick={()=>setActive(project)}><span className="switcher-index">0{index+1}</span><img src={productLogoById[project.id]} alt=""/><span><strong>{project.name}</strong><small>{project.category}</small></span></button>)}</div><article className="product-inline-detail" aria-live="polite"><header><div><small>{active.category} · {active.status}</small><h3>{active.name}</h3></div><p>{active.description}</p></header><div className="inline-detail-sections"><section><h4>为什么做</h4><p>{active.story}</p></section><section><h4>我负责的部分</h4><p>{active.role}</p></section><section><h4>一个关键选择</h4><p>{active.decision}</p></section></div><footer><a href={active.url} target="_blank" rel="noreferrer">打开项目 ↗</a><a href={active.source} target="_blank" rel="noreferrer">查看源码 ↗</a></footer></article></div>;
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

export function WorkPage({showArchive=true}:{showArchive?:boolean}){
 return <div className="work-page">
  <section className="work-hero"><div className="hero-copy"><p className="eyebrow">CASSIE LIANG / 梁悦</p><h1>AI 学生，<br/><em>1Day</em> 的独立开发者。</h1><p>我在 San Jose 学习人工智能，也独立设计、开发和发布自己的产品。现在主要在做 AI 应用、iOS 和浏览器工具。</p><nav><a className="button-primary" href="#flagship">看作品 ↓</a><a href="#resume">关于我 ↗</a><a href="https://github.com/cassieliang6709" target="_blank" rel="noreferrer">GitHub ↗</a></nav></div><div className="hero-object" aria-label="Cassie 的工作身份牌"><LanyardIdentity/></div></section>
  <section id="flagship" className="product-library"><header><p className="eyebrow">PRODUCTS / 01—02</p><h2>先放这两个。</h2><span>切换产品，详情留在这一页。</span></header><ProductDock/></section>
  {showArchive&&<StudioArchiveFooter/>}
 </div>;
}
