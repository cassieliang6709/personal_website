import {lazy,Suspense,useEffect,useRef,useState,type CSSProperties} from 'react';
import cassieCard from './assets/lanyard/cassie-card.png';
import cassieBand from './assets/lanyard/cassie-band.png';
import cassieCardFront from './assets/lanyard/cassie-card-front.webp';
import {productLogoById} from './productAssets';
import studioHome from '../../assets/room-spec/home-stage-theatre.webp';
import studioAbout from '../../assets/room-spec/about.webp';
import studioTimeline from '../../assets/room-spec/timeline.webp';
import studioProjects from '../../assets/room-spec/projects-v2.webp';
import studioWriting from '../../assets/room-spec/writing-v2.webp';
import {projects} from './projects';
import {lang,t} from './i18n';
import './work.css';

const Lanyard=lazy(()=>import('./Lanyard.jsx'));

function LanyardIdentity(){
 const [interactive,setInteractive]=useState(()=>typeof window!=='undefined'&&!matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setInteractive(!media.matches);media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 if(!interactive)return <div className="lanyard-wrap is-static" aria-label={t('Yue 的工作身份牌',"Yue's work pass")}><span className="lanyard-line"/><img className="identity-pass-flat" src={cassieCardFront} alt="" width="520" height="785"/></div>;
 return <div className="lanyard-three" aria-label={t('Yue 的 3D 工作身份牌，可以拖动',"Yue's 3D work pass, draggable")}><Suspense fallback={<div className="lanyard-loading">{t('正在挂上工作牌…','Hanging up the pass…')}</div>}><Lanyard position={[0,0,16]} gravity={[0,-40,0]} fov={20} cardImage={cassieCard} lanyardImage={cassieBand}/></Suspense></div>;
}

const productBriefs:Record<string,{why:string;did:string;key:string}>={
 '1day':{why:t('把一天剪成一支短片','Turn a day into a short film'),did:t('产品、设计、SwiftUI、上架','Product, design, SwiftUI, launch'),key:t('单人记录不离开手机','Solo clips never leave the phone')},
 tabspace:{why:t('标签页越开越多','Tabs keep piling up'),did:t('产品、交互、前端、上架','Product, interaction, front end, launch'),key:t('先预览，确认后才整理','Preview first, tidy only after you confirm')},
};

// Tilt toward the pointer with a light that follows it (React Bits Tilted Card + Spotlight Card).
function ProductPass({project,index,onOpen}:{project:(typeof projects)[number];index:number;onOpen:()=>void}){
 const ref=useRef<HTMLButtonElement>(null);
 const move=(e:React.PointerEvent<HTMLButtonElement>)=>{
  const el=ref.current;if(!el||e.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
  el.style.setProperty('--rx',`${(0.5-y)*16}deg`);el.style.setProperty('--ry',`${(x-0.5)*16}deg`);
  el.style.setProperty('--mx',`${x*100}%`);el.style.setProperty('--my',`${y*100}%`);el.classList.add('is-tilting','is-hover');
 };
 const leave=()=>{const el=ref.current;if(!el)return;el.classList.remove('is-tilting','is-hover');el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')};
 return <button ref={ref} type="button" className="product-pass" aria-haspopup="dialog" onClick={onOpen} onPointerMove={move} onPointerLeave={leave} style={{'--accent':project.accent,'--tilt':`${index?4:-4}deg`} as CSSProperties}>
  <span className="pass-art"><img src={productLogoById[project.id]} alt=""/></span>
  <small>0{index+1} · {project.category}</small><strong>{project.name}</strong><em>{project.description}</em>
 </button>;
}

function ProductPasses(){
 const visible=projects.filter(project=>project.id in productBriefs);
 const [selected,setSelected]=useState<string|null>(null);const dialog=useRef<HTMLDialogElement>(null);
 const active=visible.find(project=>project.id===selected);const brief=active?productBriefs[active.id]:null;
 useEffect(()=>{if(!selected){dialog.current?.close();return}const overflow=document.body.style.overflow;dialog.current?.showModal();document.body.style.overflow='hidden';return()=>{document.body.style.overflow=overflow}},[selected]);
 const close=()=>{dialog.current?.close();setSelected(null)};
 return <><div className="product-passes">{visible.map((project,i)=><ProductPass key={project.id} project={project} index={i} onOpen={()=>setSelected(project.id)}/>)}</div>
 <p className="product-pass-hint">{t('点开一张，看它是怎么来的。','Open one to see how it started.')}</p>
 <dialog ref={dialog} className="product-sheet" aria-labelledby="product-sheet-title" onClose={()=>setSelected(null)} onClick={e=>{if(e.target===e.currentTarget)close()}}>{active&&brief&&<>
  <header style={{'--accent':active.accent} as CSSProperties}><img src={productLogoById[active.id]} alt=""/><button type="button" onClick={close} aria-label={t('关闭','Close')}>×</button></header>
  <div className="product-sheet-body"><small>{active.status}</small><h3 id="product-sheet-title">{active.name}</h3><p>{active.description}</p>
   <dl><div><dt>{t('为什么','Why')}</dt><dd>{brief.why}</dd></div><div><dt>{t('我做了','I did')}</dt><dd>{brief.did}</dd></div><div><dt>{t('关键','Key call')}</dt><dd>{brief.key}</dd></div></dl>
   <footer><a className="button-primary" href={active.url} target="_blank" rel="noreferrer">{t('打开 ↗','Open ↗')}</a><a href={active.source} target="_blank" rel="noreferrer">{t('源码 ↗','Source ↗')}</a></footer>
  </div></>}</dialog></>;
}

const studioRooms=[
 {label:t('主房间','Main room'),caption:t('最初的个人主页：从房间里的物件开始认识我。','My first homepage: meet me through the objects in a room.'),image:studioHome},
 {label:t('床边','Bedside'),caption:t('关于我、好奇心和一路留下来的个人笔记。','About me, curiosity, and personal notes along the way.'),image:studioAbout},
 {label:t('照片墙','Photo wall'),caption:t('哈密、上海、杭州与 San Jose 的时间线。','A timeline of Hami, Shanghai, Hangzhou, and San Jose.'),image:studioTimeline},
 {label:t('工作台','Workbench'),caption:t('产品、工作牌，以及当时做过的各种小东西。','Products, the work pass, and small things I made back then.'),image:studioProjects},
 {label:t('阅读角','Reading nook'),caption:t('文章、漫画和生活记录放在这间书房里。','Articles, comics, and life notes live in this study.'),image:studioWriting},
];

function StudioArchive(){
 const [open,setOpen]=useState(false),[room,setRoom]=useState(0);const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(!open){dialog.current?.close();return}const overflow=document.body.style.overflow;dialog.current?.showModal();document.body.style.overflow='hidden';return()=>{document.body.style.overflow=overflow}},[open]);
 const close=()=>{dialog.current?.close();setOpen(false)};
 return <><button className="studio-entry" type="button" onClick={()=>setOpen(true)}><img src={studioHome} alt=""/><span><small>FROM THE ARCHIVE</small><strong>{t('打开插画旧工作室','Open the old illustrated studio')}</strong></span><i aria-hidden="true">↗</i></button><dialog ref={dialog} className="studio-dialog" aria-labelledby="studio-title" onClose={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)close()}}><header><div><small>ILLUSTRATED STUDIO · ARCHIVE</small><h2 id="studio-title">{t('以前的奇迹暖暖风格主页','My old dress-up-game style homepage')}</h2></div><button type="button" onClick={close} aria-label={t('关闭旧工作室','Close the old studio')}>×</button></header><div className="studio-dialog-body"><figure><img src={studioRooms[room].image} alt={t(`${studioRooms[room].label}插画场景`,`${studioRooms[room].label} illustration`)}/><figcaption>{studioRooms[room].caption}</figcaption></figure><nav aria-label={t('切换旧工作室房间','Switch studio room')}>{studioRooms.map((item,index)=><button type="button" key={item.label} aria-pressed={room===index} onClick={()=>setRoom(index)}>{item.label}</button>)}</nav></div></dialog></>;
}

export function StudioArchiveFooter(){return <aside className="studio-archive-footer" aria-label={t('旧版主页存档','Old homepage archive')}><StudioArchive/></aside>}

export function WorkPage({showArchive=true}:{showArchive?:boolean}){
 return <div className="work-page">
  <section className="work-hero"><div className="hero-copy"><p className="eyebrow">{t('YUE (CASSIE) LIANG / 梁悦','YUE (CASSIE) LIANG')}</p>{lang==='en'?<h1>AI student.<br/>Indie builder of <em>1Day</em>.</h1>:<h1>AI 学生，<br/><em>1Day</em> 的独立开发者。</h1>}<p>{t('我在 San Jose 学习人工智能，也独立设计、开发和发布自己的产品。现在主要在做 AI 应用、iOS 和浏览器工具。','I study AI in San Jose and design, build, and ship my own products. Right now that means AI apps, iOS, and browser tools.')}</p><nav><a className="button-primary" href="#flagship">{t('看作品 ↓','See my work ↓')}</a><a href="#resume">{t('关于我 ↗','About me ↗')}</a><a href="https://github.com/cassieliang6709" target="_blank" rel="noreferrer">GitHub ↗</a></nav></div><div className="hero-object" aria-label={t('Yue 的工作身份牌',"Yue's work pass")}><LanyardIdentity/></div></section>
  <section id="flagship" className="product-library"><header><p className="eyebrow">PRODUCTS / 01—02</p><h2>{t('先放这两个。','Two to start.')}</h2><span>{t('点开卡片看详情。','Open a card for details.')}</span></header><ProductPasses/></section>
  {showArchive&&<StudioArchiveFooter/>}
 </div>;
}
