import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {cityStories} from './cityStories';
import home from '../../assets/room-spec/home-stage-theatre.webp';
import desk from '../../assets/workbench-v3.png';
import cities from '../../assets/travel-cities-v2.png';
import avatar from '../../assets/characters/cassie-favicon.png';
import {projects,type Project} from './projects';
import './rooms.css';
import './journey.css';
import {ProductCard} from './ProductCard';

export const sceneLinks = [
  {label:'家',href:'#home'}, {label:'关于我 ↗',href:'https://liangyue.site/#profile'},
  {label:'走过的路',href:'#timeline'}, {label:'工作台',href:'#work'},
  {label:'阅读角',href:'#writing'}
];
export function RoomHome(){return <section className="room-home"><header><p className="eyebrow">YUE'S ROOM</p><h1>欢迎来我的房间。</h1><p>我在读 AI，也在做自己的产品。随便看看，点一个角落开始。</p></header><div className="room-stage"><img src={home} alt="温暖的小房间：床边、照片墙、工作桌和书架"/>{[{label:'床边 · 关于我',href:sceneLinks[1].href,x:18,y:50},{label:'照片墙 · 走过的路',href:'#timeline',x:51,y:22},{label:'工作桌 · 作品',href:'#work',x:67,y:48},{label:'书架 · 阅读角',href:sceneLinks[4].href,x:85,y:34}].map(p=><a key={p.label} href={p.href} style={{left:`${p.x}%`,top:`${p.y}%`}}>{p.label}<span> ↗</span></a>)}</div></section>}
function Pass(){
 const start=useRef<{x:number;y:number}|null>(null);const [offset,setOffset]=useState({x:0,y:0});const [dragging,setDragging]=useState(false);
 const reset=()=>{start.current=null;setDragging(false);setOffset({x:0,y:0})};
 return <div className={`room-pass ${dragging?'dragging':''}`}><span className="pass-cord" style={{height:Math.hypot(offset.x,75+offset.y),transform:`rotate(${Math.atan2(-offset.x,75+offset.y)}rad)`}}/><button className="pass-card" aria-label="拖动 Yue 工作牌，松开复位" style={{transform:`translate(${offset.x}px,${offset.y}px) rotate(${offset.x/10-5}deg)`}} onPointerDown={e=>{if(e.button!==0||matchMedia('(prefers-reduced-motion: reduce)').matches)return;start.current={x:e.clientX,y:e.clientY};setDragging(true);e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{if(start.current)setOffset({x:Math.max(-40,Math.min(80,e.clientX-start.current.x)),y:Math.max(-20,Math.min(65,e.clientY-start.current.y))})}} onPointerUp={reset} onPointerCancel={reset} onLostPointerCapture={reset} onBlur={reset} onKeyDown={e=>{if(e.key==='Escape')reset()}}><small>WORK IN PROGRESS</small><img src={avatar} alt=""/><strong>Yue (Cassie) Liang</strong><span>DESIGN · BUILD · LEARN</span></button></div>
}
export function Workbench({onOpen}:{onOpen:(p:Project)=>void}){return <section className="scene-split"><div className="desk-scene"><img src={desk} alt="暖色创作工作台"/><a className="back-room" href="#home">← 回到房间</a><Pass/></div><div className="desk-index"><p className="eyebrow">工作桌 / PROJECTS</p><h1>这些是我做过的东西。</h1><p>点开一个项目，看看它解决的问题。</p><div className="product-grid">{projects.map(p=><ProductCard key={p.id} project={p} onOpen={onOpen}/>)}</div></div></section>}
const chapters=[
 {id:'hami',name:'哈密',en:'HAMI',date:'18 岁以前'},
 {id:'shanghai',name:'上海',en:'SHANGHAI',date:'2018—2024'},
 {id:'hangzhou',name:'杭州',en:'HANGZHOU',date:'2025'},
 {id:'sanjose',name:'San Jose',en:'SAN JOSE',date:'2025—现在'}
] as const;
export function Travel(){
 const [selected,setSelected]=useState<number|null>(null);
 const [hover,setHover]=useState<number|null>(null);
 const dialog=useRef<HTMLDialogElement>(null);
 const active=hover??0;
 const story=selected===null?null:cityStories[chapters[selected].id];
 useEffect(()=>{
  if(selected===null){dialog.current?.close();return;}
  const previous=document.body.style.overflow;
  dialog.current?.showModal(); document.body.style.overflow='hidden';
  return()=>{document.body.style.overflow=previous};
 },[selected]);
 const close=()=>{dialog.current?.close();setSelected(null)};
 return <section className="journey-page">
  <header className="journey-header"><div><p className="eyebrow">走过的路</p><h1>四座城市，四段经历。</h1></div><a href="#home">← 回到房间</a></header>
  <div className="travel-surface journey-fan"><div className="travel-deck" onPointerLeave={()=>setHover(null)}>{chapters.map((item,i)=><button key={item.id} className="city-pass" aria-haspopup="dialog" onClick={()=>setSelected(i)} onPointerEnter={()=>setHover(i)} onFocus={()=>setHover(i)} onBlur={()=>setHover(null)} style={{'--x':`${(i-1.5)*115+(i<active?-22:i>active?22:0)}px`,'--angle':`${i===active?0:[-12,-5,6,13][i]}deg`,'--lift':i===active?'-20px':'0px',zIndex:i===active?6:i} as CSSProperties}>
   <div className="city-art" style={{backgroundImage:`url(${cities})`,backgroundPosition:`${i%2*100}% ${Math.floor(i/2)*100}%`}}/>
   <small>CHAPTER 0{i+1}</small><strong>{item.name}</strong><span>{item.en}</span><em>{item.date}</em>
  </button>)}</div><p className="travel-hint">点开一张卡片，读这一段故事。</p></div>
  <dialog ref={dialog} className="city-dialog" aria-labelledby="city-dialog-title" onClose={()=>setSelected(null)} onClick={e=>{if(e.target===e.currentTarget)close()}}>
   {story&&<><header className="city-dialog-header"><div><p>{story.meta[0]}</p><h2 id="city-dialog-title">{story.title[0]}</h2></div><button onClick={close} aria-label="关闭城市故事">×</button></header><div className="city-dialog-body"><p>{story.body[0]}</p>{story.extra.map((paragraph,i)=><p key={i}>{paragraph[0]}</p>)}<blockquote>{story.quote[0]}</blockquote></div></>}
  </dialog>
 </section>;
}
